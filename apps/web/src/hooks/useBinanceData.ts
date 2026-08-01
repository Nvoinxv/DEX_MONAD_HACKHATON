// hooks/useBinancePrice.ts

import { useCallback, useEffect, useState } from "react";

interface UseBinancePriceResult {
    price: number | null;
    loading: boolean;
    error: string | null;
    refetch: () => Promise<void>;
}

const BINANCE_ENDPOINT =
    "https://testnet.binance.vision/api/v3/ticker/price";

export function useBinancePrice(
    symbol: string
): UseBinancePriceResult {
    const [price, setPrice] = useState<number | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchPrice = useCallback(async () => {
        if (!symbol) return;

        setLoading(true);
        setError(null);

        try {
            const response = await fetch(
                `${BINANCE_ENDPOINT}?symbol=${symbol}`
            );

            if (!response.ok) {
                throw new Error(
                    `Request gagal (${response.status})`
                );
            }

            const data: { symbol: string; price: string } =
                await response.json();

            setPrice(Number(data.price));
        } catch (err) {
            console.error("[Binance] Gagal mengambil harga:", err);

            setError(
                err instanceof Error
                    ? err.message
                    : "Terjadi kesalahan."
            );

            setPrice(null);
        } finally {
            setLoading(false);
        }
    }, [symbol]);

    useEffect(() => {
        fetchPrice();
    }, [fetchPrice]);

    return {
        price,
        loading,
        error,
        refetch: fetchPrice,
    };
}