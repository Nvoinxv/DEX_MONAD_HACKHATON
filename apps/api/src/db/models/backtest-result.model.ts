export interface BacktestResultModel {
    id: string;

    strategyId: string;

    symbol: string;

    timeframe: string;

    startDate: Date;

    endDate: Date;

    initialCapital: number;

    finalCapital: number;

    totalTrades: number;

    winningTrades: number;

    losingTrades: number;

    winRate: number;

    netProfit: number;

    maxDrawdown: number;

    sharpeRatio: number;

    createdAt: Date;
}