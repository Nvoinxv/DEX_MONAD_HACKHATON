import { Router } from 'express';
import { strategyController } from './strategy.controller';

const router = Router();

router.post('/create', strategyController.createStrategy);
router.get('/', strategyController.getStrategies);

export default router;
