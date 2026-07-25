import { Router } from 'express';

// Import semua route dari masing-masing module
import spotRoutes from '../modules/trade/spot/spot.route';
import botConfigRoutes from '../modules/bot/config/bot.config.route';
import strategyRoutes from '../modules/strategy/strategy.route';
import backtestRoutes from '../modules/backtest/backtest.route';
import tokenRoutes from '../modules/token/token.route';

const router = Router();

// Papan Petunjuk (Routing)
// 1. Jalur Trading (Manual)
router.use('/trade/spot', spotRoutes);

// 2. Jalur Trading Bot & Configurasi
router.use('/bot', botConfigRoutes);

// 3. Jalur Strategy Builder
router.use('/strategy', strategyRoutes);

// 4. Jalur Backtesting
router.use('/backtest', backtestRoutes);

// 5. Jalur Token Launch
router.use('/token', tokenRoutes);

export default router;
