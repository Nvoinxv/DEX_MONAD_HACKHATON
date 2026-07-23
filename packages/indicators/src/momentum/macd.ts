export function calculateMACD(prices: number[]): { macdLine: number, signalLine: number, histogram: number } {
    // Simulasi perhitungan Moving Average Convergence Divergence (MACD)
    return {
        macdLine: Math.random() * 2 - 1, // Nilai antara -1 dan 1
        signalLine: Math.random() * 2 - 1,
        histogram: Math.random() * 2 - 1
    };
}
