export function calculateEMA(prices: number[], period: number): number {
    // Simulasi perhitungan Exponential Moving Average (EMA)
    // Di aplikasi nyata, kita akan menghitung EMA dari deret harga
    return prices.length > 0 ? prices[prices.length - 1] : 0;
}
