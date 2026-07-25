import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import apiRoutes from './routes';
import { startBotScheduler } from './jobs/bot.scheduler';

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Routes (Semua request yang mengarah ke /api akan dilempar ke Terminal Pusat di routes/index.ts)
app.use('/api', apiRoutes);

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

import { runMigrations } from './db/migrations';

app.listen(port, async () => {
  console.log(`Server running on port ${port}`);

  // Jalankan migrasi database
  await runMigrations();

  // Nyalakan bot scheduler otomatis saat server jalan!
  startBotScheduler();
});
