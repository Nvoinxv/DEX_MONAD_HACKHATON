import { Request, Response } from 'express';
import { backtestService } from './backtest.service';

class BacktestController {
  public async runBacktest(req: Request, res: Response): Promise<void> {
    try {
      const { strategyId, pair, timeframe, startDate, endDate } = req.body;
      if (!strategyId || !pair) {
        res.status(400).json({ error: 'Missing required fields: strategyId, pair' });
        return;
      }

      const result = await backtestService.executeSimulation({
        strategyId,
        pair,
        timeframe: timeframe || '1h',
        startDate,
        endDate
      });

      res.status(200).json({
        message: 'Backtest completed successfully',
        data: result
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message || 'Internal server error' });
    }
  }
}

export const backtestController = new BacktestController();
