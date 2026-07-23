import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import spotRoutes from './modules/trade/spot/spot.route';
import { startBotScheduler } from './jobs/bot.scheduler';

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/trade/spot', spotRoutes);

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
  
  // Nyalakan bot scheduler otomatis saat server jalan!
  startBotScheduler();
});
