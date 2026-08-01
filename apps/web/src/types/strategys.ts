// features/strategies/types/strategy.ts

export interface StrategyPayload {
    name: string;
    logic: string;
}

export interface Strategy extends StrategyPayload {
    id: string;
}