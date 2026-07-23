export function calculateSMA(prices: number[], period: number): number {
    // Simulasi perhitungan Simple Moving Average (SMA)
    if (prices.length === 0) return 0;
    const sum = prices.reduce((a, b) => a + b, 0);
    return sum / prices.length;
}
