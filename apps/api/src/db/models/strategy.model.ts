export enum StrategyType {
    EMA = "EMA",
    RSI = "RSI",
    MACD = "MACD",
    CUSTOM = "CUSTOM",
}

export interface StrategyModel {
    id: string;

    name: string;

    description?: string;

    type: StrategyType;

    parameters: Record<string, any>;

    createdAt: Date;

    updatedAt: Date;
}