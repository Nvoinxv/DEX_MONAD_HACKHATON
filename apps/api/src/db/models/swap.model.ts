export enum SwapSource {
    MANUAL = "MANUAL",
    BOT = "BOT",
}

export enum SwapStatus {
    PENDING = "PENDING",
    SUCCESS = "SUCCESS",
    FAILED = "FAILED",
}

export interface SwapModel {

    id: string;

    walletAddress: string;

    tokenIn: string;

    tokenOut: string;

    amountIn: number;

    amountOut: number;

    minimumAmountOut: number;

    txHash: string;

    strategyId?: string;

    source: SwapSource;

    status: SwapStatus;

    createdAt: Date;
}