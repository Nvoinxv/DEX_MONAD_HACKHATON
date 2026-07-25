import { Request, Response } from 'express';
import { BotConfigService } from './bot.config.service';

export class BotConfigController {
    static async create(req: Request, res: Response): Promise<void> {
        try {
            const { strategy_id, name, symbol, timeframe, capital, risk_per_trade, max_open_trades } = req.body;
            
            // Basic validation
            if (!strategy_id || !name || !symbol || !capital || !risk_per_trade) {
                res.status(400).json({ success: false, error: 'Missing required fields' });
                return;
            }

            const newConfig = await BotConfigService.saveConfig({
                strategy_id,
                name,
                symbol,
                timeframe: timeframe || '1h',
                capital: Number(capital),
                risk_per_trade: Number(risk_per_trade),
                max_open_trades: Number(max_open_trades || 1),
                status: 'inactive' // default status
            });

            res.json({ success: true, data: newConfig, message: "Konfigurasi bot berhasil disimpan ke Database!" });
        } catch (error: any) {
            res.status(500).json({ success: false, error: error.message });
        }
    }

    static async getAll(req: Request, res: Response): Promise<void> {
        try {
            const configs = await BotConfigService.getAllConfigs();
            res.json({ success: true, data: configs });
        } catch (error: any) {
            res.status(500).json({ success: false, error: error.message });
        }
    }
}
