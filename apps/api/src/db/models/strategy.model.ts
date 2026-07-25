export enum StrategyType {
    EMA = "EMA",
    RSI = "RSI",
    MACD = "MACD",
    SMA = "SMA",
    ATR = "ATR",
    VOLUME = "VOLUME",
    OBV = "OBV",
    MTR = "MTR"
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