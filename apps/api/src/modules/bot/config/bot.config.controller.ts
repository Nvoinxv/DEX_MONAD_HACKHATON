import { Request, Response } from 'express';
import { BotConfigService } from './bot.config.service';

export class BotConfigController {
    static create(req: Request, res: Response) {
        try {
            const { userId, strategyId, tokenIn, tokenOut, amount } = req.body;
            
            const newConfig = BotConfigService.saveConfig({
                id: `bot-${Date.now()}`,
                userId,
                strategyId,
                tokenIn,
                tokenOut,
                amount
            });

            res.json({ success: true, data: newConfig, message: "Konfigurasi bot berhasil disimpan!" });
        } catch (error: any) {
            res.status(500).json({ success: false, error: error.message });
        }
    }
}
