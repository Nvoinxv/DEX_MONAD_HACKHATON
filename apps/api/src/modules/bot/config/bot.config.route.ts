import { Router } from 'express';
import { BotConfigController } from './bot.config.controller';

const router = Router();

// Endpoint: POST /api/bot/config
router.post('/create', BotConfigController.create);
router.get('/', BotConfigController.getAll);

export default router;
