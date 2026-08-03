import { Request, Response } from 'express';
import { UserService } from './user.service';

/**
 * modules/user/user.controller.ts
 *
 * HTTP Controller untuk endpoint user/akun.
 * Semua response mengikuti format: { success, data, message } atau { success, error }.
 */
export class UserController {

  // ─────────────────────────────────────────────
  // GET /api/user/nonce/:address
  // ─────────────────────────────────────────────
  /**
   * Ambil nonce untuk wallet address.
   * Frontend pakai nonce ini untuk membentuk pesan yang di-sign user.
   */
  static async getNonce(req: Request, res: Response): Promise<void> {
    try {
      const { address } = req.params;

      if (!address || !/^0x[a-fA-F0-9]{40}$/.test(address)) {
        res.status(400).json({ success: false, error: 'Wallet address tidak valid.' });
        return;
      }

      const nonce = await UserService.getNonce(address);
      res.json({
        success: true,
        data: { nonce, address },
        message: 'Nonce berhasil dibuat. Tanda tangani pesan ini untuk login.',
      });
    } catch (error: any) {
      console.error('[User] getNonce error:', error);
      res.status(500).json({ success: false, error: error.message });
    }
  }

  // ─────────────────────────────────────────────
  // GET /api/user/check/:address
  // ─────────────────────────────────────────────
  /**
   * Cek apakah wallet address sudah punya akun terdaftar.
   * Frontend pakai ini untuk menentukan: arahkan ke /register atau langsung /trade/spot.
   */
  static async checkWallet(req: Request, res: Response): Promise<void> {
    try {
      const { address } = req.params;

      if (!address || !/^0x[a-fA-F0-9]{40}$/.test(address)) {
        res.status(400).json({ success: false, error: 'Wallet address tidak valid.' });
        return;
      }

      const user = await UserService.findByWalletAddress(address);
      const isRegistered = !!(user?.is_verified);

      res.json({
        success: true,
        data: {
          is_registered: isRegistered,
          user: isRegistered
            ? {
                id: user!.id,
                username: user!.username,
                display_name: user!.display_name,
                wallet_address: user!.wallet_address,
                created_at: user!.created_at,
              }
            : null,
        },
        message: isRegistered ? 'Wallet sudah terdaftar.' : 'Wallet belum terdaftar.',
      });
    } catch (error: any) {
      console.error('[User] checkWallet error:', error);
      res.status(500).json({ success: false, error: error.message });
    }
  }

  // ─────────────────────────────────────────────
  // POST /api/user/register
  // ─────────────────────────────────────────────
  /**
   * Daftarkan akun baru.
   * Body: { wallet_address, username, display_name? }
   */
  static async register(req: Request, res: Response): Promise<void> {
    try {
      const { wallet_address, username, display_name } = req.body;

      if (!wallet_address || !username) {
        res.status(400).json({
          success: false,
          error: 'wallet_address dan username wajib diisi.',
        });
        return;
      }

      if (!/^0x[a-fA-F0-9]{40}$/.test(wallet_address)) {
        res.status(400).json({ success: false, error: 'Wallet address tidak valid.' });
        return;
      }

      const user = await UserService.register({ wallet_address, username, display_name });

      res.status(201).json({
        success: true,
        data: {
          id: user.id,
          username: user.username,
          display_name: user.display_name,
          wallet_address: user.wallet_address,
          created_at: user.created_at,
        },
        message: `Selamat datang di Nvoin SmartDEX, ${user.username}! 🚀`,
      });
    } catch (error: any) {
      // Error validasi (username sudah ada, dll.) → 409 Conflict
      const status =
        error.message.includes('sudah') || error.message.includes('tidak valid') ? 409 : 500;
      res.status(status).json({ success: false, error: error.message });
    }
  }

  // ─────────────────────────────────────────────
  // GET /api/user/profile/:address
  // ─────────────────────────────────────────────
  /**
   * Ambil profil user berdasarkan wallet address.
   */
  static async getProfile(req: Request, res: Response): Promise<void> {
    try {
      const { address } = req.params;

      const user = await UserService.findByWalletAddress(address);
      if (!user || !user.is_verified) {
        res.status(404).json({ success: false, error: 'User tidak ditemukan.' });
        return;
      }

      res.json({
        success: true,
        data: {
          id: user.id,
          username: user.username,
          display_name: user.display_name,
          wallet_address: user.wallet_address,
          created_at: user.created_at,
        },
      });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  // ─────────────────────────────────────────────
  // PATCH /api/user/profile/:address
  // ─────────────────────────────────────────────
  /**
   * Update profil user.
   * Body: { username?, display_name? }
   */
  static async updateProfile(req: Request, res: Response): Promise<void> {
    try {
      const { address } = req.params;
      const { username, display_name } = req.body;

      if (!username && !display_name) {
        res.status(400).json({ success: false, error: 'Tidak ada data yang diubah.' });
        return;
      }

      const updated = await UserService.updateProfile(address, { username, display_name });

      res.json({
        success: true,
        data: {
          id: updated.id,
          username: updated.username,
          display_name: updated.display_name,
          wallet_address: updated.wallet_address,
        },
        message: 'Profil berhasil diperbarui.',
      });
    } catch (error: any) {
      const status = error.message.includes('tidak ditemukan') ? 404
        : error.message.includes('sudah dipakai') ? 409
        : 500;
      res.status(status).json({ success: false, error: error.message });
    }
  }

  // ─────────────────────────────────────────────
  // POST /api/user/verify
  // ─────────────────────────────────────────────
  /**
   * Verifikasi kepemilikan wallet.
   * Body: { wallet_address, nonce }
   *
   * Untuk produksi: tambahkan verifikasi signature di sini.
   */
  static async verifyWallet(req: Request, res: Response): Promise<void> {
    try {
      const { wallet_address, nonce } = req.body;

      if (!wallet_address || !nonce) {
        res.status(400).json({ success: false, error: 'wallet_address dan nonce wajib diisi.' });
        return;
      }

      const isValid = await UserService.verifyWallet(wallet_address, nonce);

      if (!isValid) {
        res.status(401).json({ success: false, error: 'Verifikasi gagal. Nonce tidak cocok.' });
        return;
      }

      res.json({
        success: true,
        data: { verified: true, wallet_address },
        message: 'Wallet berhasil diverifikasi.',
      });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  }
}
