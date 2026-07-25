export interface StrategyPayload {
  name: string;
  logic: string; // e.g., "RSI < 30 AND EMA50 > EMA200 -> BUY"
}

class StrategyService {
  private strategies: Array<StrategyPayload & { id: string }> = [];

  public async createStrategy(payload: StrategyPayload) {
    const newStrategy = {
      id: Date.now().toString(),
      ...payload
    };
    this.strategies.push(newStrategy);
    return newStrategy;
  }

  public async getAllStrategies() {
    return this.strategies;
  }
}

export const strategyService = new StrategyService();
