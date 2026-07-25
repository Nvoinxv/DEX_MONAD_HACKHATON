import { db } from '../../../db';
import { randomUUID } from 'crypto';

export interface BotConfig {
    id?: string;
    strategy_id: string;
    name: string;
    symbol: string;
    timeframe: string;
    capital: number;
    risk_per_trade: number;
    max_open_trades: number;
    status: string;
}

export class BotConfigService {
    static async saveConfig(config: BotConfig) {
        const id = config.id || randomUUID();
        
        const query = `
            INSERT INTO bot_configs (
                id, strategy_id, name, symbol, timeframe, capital, risk_per_trade, max_open_trades, status
            ) VALUES (
                $1, $2, $3, $4, $5, $6, $7, $8, $9
            ) RETURNING *;
        `;
        
        const values = [
            id,
            config.strategy_id,
            config.name,
            config.symbol,
            config.timeframe,
            config.capital,
            config.risk_per_trade,
            config.max_open_trades,
            config.status
        ];

        try {
            const result = await db.query(query, values);
            console.log(`[Config] Bot config baru disimpan ke Database dengan ID: ${id}`);
            return result.rows[0];
        } catch (error) {
            console.error('[Config] Gagal menyimpan bot config:', error);
            throw error;
        }
    }

    static async getConfig(id: string) {
        const query = `SELECT * FROM bot_configs WHERE id = $1;`;
        
        try {
            const result = await db.query(query, [id]);
            return result.rows[0] || null;
        } catch (error) {
            console.error(`[Config] Gagal mengambil bot config ID ${id}:`, error);
            throw error;
        }
    }

    static async getAllConfigs() {
        const query = `SELECT * FROM bot_configs ORDER BY created_at DESC;`;
        
        try {
            const result = await db.query(query);
            return result.rows;
        } catch (error) {
            console.error('[Config] Gagal mengambil daftar bot config:', error);
            throw error;
        }
    }
}
