import { db } from '../../db';

export class StrategyService {
  public async createStrategy(data: any): Promise<any> {
    // Stub implementation
    return data;
  }
  public async getAllStrategies(): Promise<any[]> {
    return [];
  }
}

export const strategyService = new StrategyService();