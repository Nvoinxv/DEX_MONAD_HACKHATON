import { BotEngine } from '../modules/bot/bot.engine';
import { UserStrategy } from '../modules/strategy/strategy.evaluator';

export function startBotScheduler() {
    console.log("[Scheduler] Satpam shift malam udah bangun. Siap keliling tiap 10 detik!");
    
    // Nambahin satu dummy strategi biar langsung keliatan pas dijalankan
    BotEngine.addStrategy({
        id: "strat-1",
        userId: "0xUser123",
        tokenIn: "MONAD",
        tokenOut: "USDT",
        amount: 50,
        conditions: [
            // Contoh Lego: Kalo RSI kurang dari 30
            { indicator: 'RSI', operator: '<', value: 30 }
        ]
    });

    // Jalankan keliling tiap 10 detik (10000 ms)
    setInterval(() => {
        BotEngine.tick();
    }, 10000);
}
