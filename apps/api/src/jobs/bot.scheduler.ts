import { BotEngine } from '../modules/bot/engine/bot.engine';
import { BotRuntimeManager } from '../modules/bot/runtime/bot.runtime.manager';

export function startBotScheduler() {
    console.log("[Scheduler] Satpam shift malam udah bangun. Siap keliling tiap 10 detik!");
    
    // Nambahin dummy strategi dengan format sesuai evaluator lama
    const dummyBotId = "strat-1";
    BotEngine.addStrategy({
        id: dummyBotId,
        userId: "0xUser123",
        tokenIn: "MONAD",
        tokenOut: "USDT",
        amount: 50,
        conditions: [
            { indicator: 'RSI', operator: '<', value: 30 }
        ]
    });

    // Simulasi user menekan tombol pause setelah 5 detik, lalu play lagi setelah 15 detik
    setTimeout(() => {
        BotRuntimeManager.pauseBot(dummyBotId);
    }, 5000);

    setTimeout(() => {
        BotRuntimeManager.startBot(dummyBotId);
    }, 15000);

    // Jalankan keliling tiap 10 detik
    setInterval(() => {
        BotEngine.tick();
    }, 10000);
}
