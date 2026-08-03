import { Router } from 'express';
import { UserController } from './user.controller';

/**
 * modules/user/user.route.ts
 *
 * Route definitions untuk modul user/akun.
 * Semua route di sini dipasang di bawah prefix /api/user (lihat routes/index.ts).
 *
 * Endpoint:
 *   GET    /api/user/nonce/:address       → Minta nonce untuk sign challenge
 *   GET    /api/user/check/:address       → Cek apakah wallet sudah punya akun
 *   POST   /api/user/register             → Daftar akun baru
 *   GET    /api/user/profile/:address     → Ambil profil user
 *   PATCH  /api/user/profile/:address     → Update profil user
 *   POST   /api/user/verify              → Verifikasi kepemilikan wallet
 */
const router = Router();

// Nonce untuk wallet sign challenge
router.get('/nonce/:address', UserController.getNonce);

// Cek status registrasi wallet
router.get('/check/:address', UserController.checkWallet);

// Registrasi akun baru
router.post('/register', UserController.register);

// Profil user
router.get('/profile/:address', UserController.getProfile);
router.patch('/profile/:address', UserController.updateProfile);

// Verifikasi kepemilikan wallet
router.post('/verify', UserController.verifyWallet);

export default router;
