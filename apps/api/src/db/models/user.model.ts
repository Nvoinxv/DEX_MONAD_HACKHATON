/**
 * db/models/user.model.ts
 *
 * TypeScript interfaces yang merepresentasikan schema tabel `users`.
 */

export interface User {
  id: string;
  wallet_address: string;
  username: string;
  display_name?: string;
  nonce: string;
  is_verified: boolean;
  created_at: Date;
  updated_at: Date;
}

/** Data yang dibutuhkan saat mendaftarkan user baru */
export interface CreateUserInput {
  wallet_address: string;
  username: string;
  display_name?: string;
}

/** Data yang bisa diupdate setelah daftar */
export interface UpdateUserInput {
  username?: string;
  display_name?: string;
}
