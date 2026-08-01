// features/strategies/hooks/useStrategies.ts

import {
    useCallback,
    useEffect,
    useState,
} from "react";

import {
    createStrategy,
    getStrategies,
} from "../services/strategy.services";

import type {
    Strategy,
    StrategyPayload,
} from "../types/strategys";

export function useStrategies() {
    const [strategies, setStrategies] =
        useState<Strategy[]>([]);

    const [loading, setLoading] =
        useState(false);

    const [error, setError] =
        useState<string | null>(null);

    const fetchStrategies =
        useCallback(async () => {
            setLoading(true);

            setError(null);

            try {
                const data =
                    await getStrategies();

                setStrategies(data);
            } catch (err) {
                setError(
                    err instanceof Error
                        ? err.message
                        : "Unknown error"
                );
            } finally {
                setLoading(false);
            }
        }, []);

    const addStrategy =
        useCallback(
            async (
                payload: StrategyPayload
            ) => {
                setLoading(true);

                setError(null);

                try {
                    const strategy =
                        await createStrategy(
                            payload
                        );

                    setStrategies((prev) => [
                        ...prev,
                        strategy,
                    ]);

                    return strategy;
                } catch (err) {
                    const message =
                        err instanceof Error
                            ? err.message
                            : "Unknown error";

                    setError(message);

                    throw err;
                } finally {
                    setLoading(false);
                }
            },
            []
        );

    useEffect(() => {
        fetchStrategies();
    }, [fetchStrategies]);

    return {
        strategies,

        loading,

        error,

        fetchStrategies,

        addStrategy,
    };
}