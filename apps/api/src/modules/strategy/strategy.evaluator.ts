import { calculateEMA, calculateSMA, calculateRSI, calculateMACD, calculateATR, calculateMTR, calculateVolume, calculateOBV } from '@smartdex/indicators';

export interface StrategyCondition {
    indicator: 'EMA' | 'SMA' | 'RSI' | 'MACD' | 'ATR' | 'MTR' | 'VOLUME' | 'OBV';
    operator: '>' | '<' | '==';
    value: number;
}

export interface UserStrategy {
    id: string;
    userId: string;
    tokenIn: string;
    tokenOut: string;
    amount: number;
    conditions: StrategyCondition[];
}

export class StrategyEvaluator {
    // Fungsi ini mengecek apakah market saat ini memenuhi syarat dari strategi user (Lego)
    static evaluate(strategy: UserStrategy, prices: number[], volumes: number[]): boolean {
        // Kita loop semua kondisi lego-nya
        for (const condition of strategy.conditions) {
            let indicatorValue = 0;

            // Memilih lego indikator yang sesuai yang udah kita import dari packages/indicators
            switch (condition.indicator) {
                case 'EMA': indicatorValue = calculateEMA(prices, 14); break;
                case 'SMA': indicatorValue = calculateSMA(prices, 14); break;
                case 'RSI': indicatorValue = calculateRSI(prices, 14); break;
                case 'MACD': indicatorValue = calculateMACD(prices).macdLine; break;
                case 'ATR': indicatorValue = calculateATR(prices, prices, prices, 14); break;
                case 'MTR': indicatorValue = calculateMTR(prices); break;
                case 'VOLUME': indicatorValue = calculateVolume(volumes); break;
                case 'OBV': indicatorValue = calculateOBV(prices, volumes); break;
            }

            // Cek logikanya
            let passed = false;
            if (condition.operator === '>') passed = indicatorValue > condition.value;
            if (condition.operator === '<') passed = indicatorValue < condition.value;
            if (condition.operator === '==') passed = indicatorValue === condition.value;

            // Kalau ada satu aja kondisi yang gagal, berarti strategi belum bisa dieksekusi
            if (!passed) {
                return false;
            }
        }

        // Kalau lolos semua, sikat!
        return true;
    }
}
