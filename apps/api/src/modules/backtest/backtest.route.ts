import { Router } from 'express';
import { backtestController } from './backtest.controller';

const router = Router();

router.post('/run', backtestController.runBacktest);

export default router;
