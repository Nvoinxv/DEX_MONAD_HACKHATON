export enum OrderSide {
    BUY = "BUY",
    SELL = "SELL",
}

export enum OrderStatus {
    OPEN = "OPEN",
    FILLED = "FILLED",
    CANCELLED = "CANCELLED",
}

export interface OrderModel {
    id: string;

    symbol: string;

    side: OrderSide;

    quantity: number;

    price: number;

    status: OrderStatus;

    strategyId?: string;

    exchangeOrderId?: string;

    createdAt: Date;

    updatedAt: Date;
}