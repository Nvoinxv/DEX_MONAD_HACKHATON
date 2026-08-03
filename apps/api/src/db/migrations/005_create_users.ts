import { db } from '../index';

/**
 * Migration 005 — Create Users Table
 *
 * Tabel ini menyimpan akun pengguna Nvoin SmartDEX.
 * "Akun" di sini berarti profil yang dilekatkan ke wallet address,
 * bukan wallet itu sendiri (wallet dikelola user via MetaMask/WalletConnect).
 *
 * Kolom:
 *   - wallet_address : address EVM unik (primary key de facto)
 *   - username       : nama unik yang dipilih user saat daftar
 *   - display_name   : nama tampilan (opsional)
 *   - nonce          : angka acak untuk proses sign challenge (wallet auth)
 *   - is_verified    : apakah user sudah verifikasi kepemilikan wallet via signature
 *   - created_at     : waktu daftar
 *   - updated_at     : waktu update terakhir
 */
export async function up() {
  await db.query(`
    CREATE TABLE IF NOT EXISTS users (
      id            UUID          PRIMARY KEY DEFAULT gen_random_uuid(),
      wallet_address VARCHAR(42)  NOT NULL UNIQUE,
      username       VARCHAR(50)  NOT NULL UNIQUE,
      display_name   VARCHAR(100),
      nonce          VARCHAR(64)  NOT NULL DEFAULT encode(gen_random_bytes(32), 'hex'),
      is_verified    BOOLEAN      NOT NULL DEFAULT FALSE,
      created_at     TIMESTAMP    NOT NULL DEFAULT NOW(),
      updated_at     TIMESTAMP    NOT NULL DEFAULT NOW()
    );
  `);

  // Index untuk lookup by wallet_address (paling sering dipakai)
  await db.query(`
    CREATE INDEX IF NOT EXISTS idx_users_wallet_address
    ON users (wallet_address);
  `);

  // Index untuk lookup by username (cek keunikan username)
  await db.query(`
    CREATE INDEX IF NOT EXISTS idx_users_username
    ON users (username);
  `);
}

export async function down() {
  await db.query(`DROP TABLE IF EXISTS users;`);
}
