export enum BotStatus {
    RUNNING = "RUNNING",
    STOPPED = "STOPPED",
    PAUSED = "PAUSED",
}

export interface BotConfigModel {
    id: string;

    name: string;

    strategyId: string;

    symbol: string;

    timeframe: string;

    capital: number;

    riskPerTrade: number;

    maxOpenTrades: number;

    status: BotStatus;

    createdAt: Date;

    updatedAt: Date;
}