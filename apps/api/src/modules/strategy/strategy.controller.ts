import { Request, Response } from 'express';
import { strategyService } from './strategy.service';

class StrategyController {
  public async createStrategy(req: Request, res: Response): Promise<void> {
    try {
      const { name, logic } = req.body;
      if (!name || !logic) {
        res.status(400).json({ error: 'Missing required fields: name, logic' });
        return;
      }
      
      const newStrategy = await strategyService.createStrategy({ name, logic });
      res.status(201).json({ message: 'Strategy created successfully', data: newStrategy });
    } catch (error: any) {
      res.status(500).json({ error: error.message || 'Internal server error' });
    }
  }

  public async getStrategies(req: Request, res: Response): Promise<void> {
    try {
      const strategies = await strategyService.getAllStrategies();
      res.status(200).json({ data: strategies });
    } catch (error: any) {
      res.status(500).json({ error: error.message || 'Internal server error' });
    }
  }
}

export const strategyController = new StrategyController();
