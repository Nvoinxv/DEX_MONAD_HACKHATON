import { Router } from 'express';
import { tokenController } from './token.controller';

const router = Router();

// Endpoint for creating a new token metadata before deploying via smart contract
router.post('/create', tokenController.createToken);
router.get('/', tokenController.getTokens);

export default router;
