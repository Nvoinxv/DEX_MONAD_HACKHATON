import { Router } from 'express';
import { SpotController } from './spot.controller';

const router = Router();

// Endpoint untuk meminta quote pertukaran
// Contoh penggunaan: GET /api/trade/spot/quote?reserveIn=1000&reserveOut=1000&amountIn=10
router.get('/quote', SpotController.getQuote);

export default router;
