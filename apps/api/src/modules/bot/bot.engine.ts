import { UserStrategy, StrategyEvaluator } from '../strategy/strategy.evaluator';
import { BinanceService } from '../../services/binance.service';

export class BotEngine {
    // Sesuai kesepakatan, kita simpen strategi di memori dulu (Array)
    static activeStrategies: UserStrategy[] = [];

    // Fungsi buat nerima strategi baru dari user
    static addStrategy(strategy: UserStrategy) {
        this.activeStrategies.push(strategy);
        console.log(`[Bot Engine] Strategi baru ditambah untuk user ${strategy.userId}`);
    }

    // Fungsi utama yang dipanggil secara berulang (TICK)
    static async tick() {
        if (this.activeStrategies.length === 0) return; // Diem aja kalau nggak ada kerjaan
        
        console.log(`[Bot Engine] Mengecek market untuk ${this.activeStrategies.length} strategi aktif...`);
        
        // Ambil harga asli dari Binance Testnet
        const currentPrice = await BinanceService.getPrice('BTCUSDT');
        
        // Simulasi deret harga/volume (Di real app ini ambil candles/klines dari API)
        const dummyPrices = [currentPrice - 10, currentPrice, currentPrice + 5, currentPrice];
        const dummyVolumes = [100, 150, 200, 120];

        for (const strategy of this.activeStrategies) {
            // Nanya ke si Pinter (Evaluator) apakah kondisi terpenuhi
            const shouldExecute = StrategyEvaluator.evaluate(strategy, dummyPrices, dummyVolumes);

            if (shouldExecute) {
                console.log(`🚀 BINGO! Kondisi terpenuhi untuk user ${strategy.userId}. Mengeksekusi trade ${strategy.amount} ${strategy.tokenIn} ke ${strategy.tokenOut}...`);
                
                // --- DI SINI TEMPAT KONEKSI KE SMART CONTRACT ---
                // panggil ethers.js buat manggil TradingBotVault.sol -> executeTrade()
                
                // Hapus strategi dari memori setelah berhasil dieksekusi
                this.activeStrategies = this.activeStrategies.filter(s => s.id !== strategy.id);
            }
        }
    }
}
