import { db } from '../../db';
import { randomBytes } from 'crypto';
import type { User, CreateUserInput, UpdateUserInput } from '../../db/models/user.model';

/**
 * modules/user/user.service.ts
 *
 * Layer bisnis untuk manajemen akun user.
 *
 * Flow autentikasi wallet (Sign-In With Ethereum / SIWE pattern):
 *  1. Frontend minta nonce untuk wallet_address tertentu  → GET /api/user/nonce/:address
 *  2. Frontend minta user sign pesan: "Login ke Nvoin SmartDEX\nNonce: <nonce>"
 *  3. Frontend kirim signature ke backend              → POST /api/user/verify
 *  4. Backend verifikasi signature → kalau valid, tandai is_verified = true
 *
 * Untuk hackathon, step 2-4 disederhanakan: verify hanya cek wallet_address ada,
 * tapi endpoint-nya sudah siap untuk upgrade ke full SIWE nanti.
 */
export class UserService {

  // ─────────────────────────────────────────────
  // Lookup
  // ─────────────────────────────────────────────

  /**
   * Cari user berdasarkan wallet address.
   * Return null kalau belum pernah daftar.
   */
  static async findByWalletAddress(walletAddress: string): Promise<User | null> {
    const res = await db.query<User>(
      `SELECT * FROM users WHERE wallet_address = $1 LIMIT 1;`,
      [walletAddress.toLowerCase()],
    );
    return res.rows[0] ?? null;
  }

  /**
   * Cari user berdasarkan username.
   * Dipakai untuk cek keunikan username saat registrasi.
   */
  static async findByUsername(username: string): Promise<User | null> {
    const res = await db.query<User>(
      `SELECT * FROM users WHERE username = $1 LIMIT 1;`,
      [username.toLowerCase()],
    );
    return res.rows[0] ?? null;
  }

  /**
   * Cari user berdasarkan ID internal.
   */
  static async findById(id: string): Promise<User | null> {
    const res = await db.query<User>(
      `SELECT * FROM users WHERE id = $1 LIMIT 1;`,
      [id],
    );
    return res.rows[0] ?? null;
  }

  // ─────────────────────────────────────────────
  // Nonce — untuk Sign-In With Ethereum (SIWE)
  // ─────────────────────────────────────────────

  /**
   * Ambil (atau buat) nonce untuk wallet address.
   * Nonce dirotasi setiap kali diambil supaya tidak bisa di-replay.
   *
   * Kalau wallet belum pernah connect, buat "pre-user" record
   * (hanya address + nonce, belum punya username) → user belum dianggap terdaftar.
   */
  static async getNonce(walletAddress: string): Promise<string> {
    const addr = walletAddress.toLowerCase();
    const nonce = randomBytes(32).toString('hex');

    // Upsert: kalau ada, update nonce-nya. Kalau belum, insert baru.
    await db.query(
      `INSERT INTO users (wallet_address, username, nonce)
       VALUES ($1, $2, $3)
       ON CONFLICT (wallet_address)
       DO UPDATE SET nonce = $3, updated_at = NOW();`,
      [addr, `_pending_${addr.slice(2, 10)}`, nonce],
    );

    return nonce;
  }

  // ─────────────────────────────────────────────
  // Registrasi
  // ─────────────────────────────────────────────

  /**
   * Daftarkan user baru — bisa dipanggil setelah wallet terconnect.
   *
   * Validasi:
   *  - username: 3–30 karakter, hanya huruf/angka/underscore
   *  - wallet_address: belum punya akun terdaftar (is_verified = true)
   *  - username: belum dipakai user lain
   */
  static async register(input: CreateUserInput): Promise<User> {
    const addr = input.wallet_address.toLowerCase();
    const username = input.username.toLowerCase().trim();

    // Validasi format username
    if (!/^[a-z0-9_]{3,30}$/.test(username)) {
      throw new Error('Username hanya boleh huruf kecil, angka, dan underscore (3–30 karakter).');
    }

    // Cek apakah username sudah dipakai
    const existingByUsername = await this.findByUsername(username);
    if (existingByUsername && existingByUsername.wallet_address !== addr) {
      throw new Error('Username sudah dipakai. Coba username lain.');
    }

    // Cek apakah wallet sudah punya akun terdaftar
    const existingByWallet = await this.findByWalletAddress(addr);
    if (existingByWallet?.is_verified) {
      throw new Error('Wallet address ini sudah terdaftar. Silakan login.');
    }

    // Upsert: kalau sudah ada pre-user dari getNonce(), update ke akun penuh
    const res = await db.query<User>(
      `INSERT INTO users (wallet_address, username, display_name, is_verified)
       VALUES ($1, $2, $3, TRUE)
       ON CONFLICT (wallet_address)
       DO UPDATE SET
         username     = $2,
         display_name = $3,
         is_verified  = TRUE,
         updated_at   = NOW()
       RETURNING *;`,
      [addr, username, input.display_name?.trim() || null],
    );

    console.log(`[User] Akun baru terdaftar: ${username} (${addr})`);
    return res.rows[0];
  }

  // ─────────────────────────────────────────────
  // Update Profil
  // ─────────────────────────────────────────────

  /**
   * Update profil user yang sudah terdaftar.
   */
  static async updateProfile(walletAddress: string, input: UpdateUserInput): Promise<User> {
    const addr = walletAddress.toLowerCase();

    const user = await this.findByWalletAddress(addr);
    if (!user) throw new Error('User tidak ditemukan.');
    if (!user.is_verified) throw new Error('Wallet belum terdaftar. Silakan daftar dahulu.');

    const username = input.username
      ? input.username.toLowerCase().trim()
      : user.username;

    if (input.username && !/^[a-z0-9_]{3,30}$/.test(username)) {
      throw new Error('Username hanya boleh huruf kecil, angka, dan underscore (3–30 karakter).');
    }

    if (input.username && input.username !== user.username) {
      const taken = await this.findByUsername(username);
      if (taken) throw new Error('Username sudah dipakai. Coba username lain.');
    }

    const res = await db.query<User>(
      `UPDATE users
       SET username = $1, display_name = $2, updated_at = NOW()
       WHERE wallet_address = $3
       RETURNING *;`,
      [username, input.display_name?.trim() ?? user.display_name, addr],
    );

    return res.rows[0];
  }

  // ─────────────────────────────────────────────
  // Verifikasi Wallet (SIWE Sederhana)
  // ─────────────────────────────────────────────

  /**
   * Verifikasi bahwa user memang pemilik wallet.
   *
   * Untuk hackathon: cukup cek wallet_address ada di DB + nonce cocok.
   * Untuk produksi: perlu verifikasi kriptografis signature dengan ethers.js
   *   → `ethers.verifyMessage(message, signature)` harus return walletAddress.
   */
  static async verifyWallet(walletAddress: string, nonce: string): Promise<boolean> {
    const addr = walletAddress.toLowerCase();

    const res = await db.query<{ nonce: string }>(
      `SELECT nonce FROM users WHERE wallet_address = $1 LIMIT 1;`,
      [addr],
    );

    if (!res.rows[0]) return false;
    return res.rows[0].nonce === nonce;
  }
}
