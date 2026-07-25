import { db } from "../index";
import { up as createStrategies } from "./001_create_strategies";
import { up as createBotConfigs } from "./002_create_bot_configs";
import { up as createSwap } from "./003_create_swap";
import { up as createBacktestResults } from "./004_create_backtest_results";

export async function runMigrations() {
    try {
        console.log('[DB] Menjalankan migrasi database otomatis...');
        await createStrategies();
        await createBotConfigs();
        await createSwap();
        await createBacktestResults();
        console.log('[DB] Migrasi database selesai!');
    } catch (error) {
        console.error('[DB] Gagal menjalankan migrasi:', error);
    }
}