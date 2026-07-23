/**
 * Service ini bertugas sebagai "otak" untuk melakukan kalkulasi matematika Liquidity Pool
 * menggunakan rumus konstan x * y = k.
 */

// Dalam implementasi nyata, reserve (cadangan) ini diambil langsung dari Smart Contract (SmartDEX).
// Untuk keperluan kalkulator backend ini, kita menerima parameter reserve dari request (yang di-fetch oleh frontend/bot).
export interface QuoteRequest {
    reserveIn: number;
    reserveOut: number;
    amountIn: number;
}

export class SpotService {
    /**
     * Menghitung estimasi token output yang akan didapat (Quote).
     */
    static calculateQuote(req: QuoteRequest): number {
        const { reserveIn, reserveOut, amountIn } = req;
        
        if (amountIn <= 0) return 0;
        if (reserveIn <= 0 || reserveOut <= 0) throw new Error("Liquidity Pool kosong bro!");

        // Kita aplikasikan fee 0.3% untuk Liquidity Provider (sesuai SmartDEX kita di Solidity)
        const amountInWithFee = amountIn * 997; 
        const numerator = amountInWithFee * reserveOut;
        const denominator = (reserveIn * 1000) + amountInWithFee;
        
        const amountOut = numerator / denominator;
        
        return amountOut;
    }
}
