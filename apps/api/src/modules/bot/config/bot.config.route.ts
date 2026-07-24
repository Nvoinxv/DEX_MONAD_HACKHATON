import { Router } from 'express';
import { BotConfigController } from './bot.config.controller';

const router = Router();

// Endpoint: POST /api/bot/config
router.post('/config', BotConfigController.create);

export default router;
