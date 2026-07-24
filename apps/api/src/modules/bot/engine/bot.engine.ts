import { UserStrategy, StrategyEvaluator } from '../../strategy/strategy.evaluator';
import { BinanceService } from '../../../services/binance.service';
import { BotRuntimeManager } from '../runtime/bot.runtime.manager';

export class BotEngine {
    static activeStrategies: UserStrategy[] = [];

    static addStrategy(strategy: UserStrategy) {
        this.activeStrategies.push(strategy);
        // Otomatis nyalain bot begitu strategi ditambah
        BotRuntimeManager.startBot(strategy.id);
        console.log(`[Bot Engine] Engine nerima tugas baru buat bot ${strategy.id}`);
    }

    static async tick() {
        if (this.activeStrategies.length === 0) return; 
        
        console.log(`[Bot Engine] Satpam lagi ngecek ${this.activeStrategies.length} bot...`);
        
        const currentPrice = await BinanceService.getPrice('BTCUSDT');
        const dummyPrices = [currentPrice - 10, currentPrice, currentPrice + 5, currentPrice];
        const dummyVolumes = [100, 150, 200, 120];

        for (const strategy of this.activeStrategies) {
            // CEK STATUS DARI RUNTIME! Kalau user nge-pause, kita skip (nggak dieksekusi)
            if (!BotRuntimeManager.isBotRunning(strategy.id)) {
                // Skip
                continue;
            }

            const shouldExecute = StrategyEvaluator.evaluate(strategy, dummyPrices, dummyVolumes);

            if (shouldExecute) {
                console.log(`🚀 BINGO! Kondisi terpenuhi buat bot ${strategy.id}. Eksekusi trade ${strategy.amount} ${strategy.tokenIn} ke ${strategy.tokenOut}...`);
                
                // --- KONEKSI SMART CONTRACT DI SINI ---
                // Panggil ethers.js buat nge-trigger executeTrade() di TradingBotVault.sol
                
                // Setelah selesai, set status bot jadi STOPPED
                BotRuntimeManager.stopBot(strategy.id);
            }
        }
    }
}
