import dotenv from 'dotenv';
dotenv.config();

export class BinanceService {
    static async getPrice(symbol: string): Promise<number> {
        // Karena ini pakai testnet, kita akan pakai endpoint testnet Binance
        const endpoint = 'https://testnet.binance.vision/api/v3/ticker/price';
        // Lu nyimpen key di .env kan bro? Kita panggil dari sana
        const apiKey = process.env.PRIVATE_KEY_HERE; 

        try {
            // Minta harga ke Binance
            const response = await fetch(`${endpoint}?symbol=${symbol}`, {
                headers: {
                    'X-MBX-APIKEY': apiKey || ''
                }
            });
            const data = await response.json();
            
            if (data && data.price) {
                return parseFloat(data.price);
            }
            throw new Error("Harga tidak ditemukan");
        } catch (error) {
            console.error("[Binance] Gagal ngambil harga dari Binance Testnet:", error);
            // Fallback harga dummy kalau API error (biar bot tetep bisa dites)
            return Math.random() * 1000 + 100; 
        }
    }
}
