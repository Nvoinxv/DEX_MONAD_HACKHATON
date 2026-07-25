import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

// Membuat koneksi Pool ke database PostgreSQL
// Akan otomatis membaca string dari process.env.DATABASE_URL
export const db = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Menangkap error di tingkat pool supaya server gak mati kalau database down
db.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
  process.exit(-1);
});

export * from './migrations/index';
