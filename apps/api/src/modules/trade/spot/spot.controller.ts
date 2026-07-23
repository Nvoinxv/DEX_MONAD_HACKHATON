import { Request, Response } from 'express';
import { SpotService } from './spot.service';

export class SpotController {
    static getQuote(req: Request, res: Response): any {
        try {
            // Mengambil parameter dari URL Query String (misal: ?reserveIn=1000&reserveOut=1000&amountIn=10)
            const reserveIn = parseFloat(req.query.reserveIn as string);
            const reserveOut = parseFloat(req.query.reserveOut as string);
            const amountIn = parseFloat(req.query.amountIn as string);

            // Validasi input
            if (isNaN(reserveIn) || isNaN(reserveOut) || isNaN(amountIn)) {
                return res.status(400).json({ error: "Parameter harus berupa angka ya bro!" });
            }

            // Panggil Service (Si Otak)
            const expectedOutput = SpotService.calculateQuote({ reserveIn, reserveOut, amountIn });

            // Menghitung slippage/price impact kasar
            // Harga normal tanpa slippage (jika pool tidak terbatas)
            const spotPrice = reserveOut / reserveIn;
            const expectedWithoutSlippage = amountIn * spotPrice;
            const priceImpact = ((expectedWithoutSlippage - expectedOutput) / expectedWithoutSlippage) * 100;

            res.json({
                success: true,
                data: {
                    amountIn,
                    expectedOutput,
                    priceImpactPercentage: priceImpact.toFixed(2) + "%",
                    message: "Quote berhasil dihitung secara desentralisasi!"
                }
            });

        } catch (error: any) {
            res.status(500).json({ success: false, error: error.message });
        }
    }
}
