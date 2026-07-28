/**
 * lib/api.ts
 * 
 * "Si Kurir" — bertugas sebagai penghubung antara frontend dan backend.
 * 
 * Alur kerja:
 * 1. Frontend minta quote → fungsi fetchSpotQuote() dipanggil
 * 2. Fungsi ini coba kirim request ke backend API (port 3001)
 * 3. Kalau backend tidak bisa dijangkau (offline/belum jalan) → fallback ke
 *    kalkulasi lokal yang persis sama dengan logika di spot.service.ts
 */

// URL backend API — bisa diubah lewat environment variable
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

// ============================================================
// HARDCODED MOCK RESERVES (untuk testing sementara)
// Ini simulasi liquidity pool MON/USDC.
// Dalam produksi nyata, ini diambil dari Smart Contract di Monad.
//
// Artinya: pool ini punya 500,000 MON dan 250,000 USDC.
// Jadi harga awal: 1 MON ≈ 0.5 USDC
// ============================================================
export const MOCK_RESERVES = {
  MON_USDC: {
    reserveIn: 500_000,   // Jumlah MON yang ada di pool
    reserveOut: 250_000,  // Jumlah USDC yang ada di pool
  },
};

export interface QuoteResponse {
  success: boolean;
  data: {
    amountIn: number;
    expectedOutput: number;
    priceImpactPercentage: string;
    message: string;
  };
}

export interface QuoteResult {
  expectedOutput: number;
  priceImpactPercentage: string;
}

/**
 * Kalkulasi quote secara lokal — ini adalah FALLBACK.
 * 
 * Rumus AMM (Automated Market Maker): x * y = k
 * Sama persis dengan logika di backend spot.service.ts.
 * 
 * Kenapa ada fallback? Supaya halaman tetap bisa dipakai
 * meskipun backend API belum jalan atau sedang error.
 */
export function calculateQuoteLocally(params: {
  reserveIn: number;
  reserveOut: number;
  amountIn: number;
}): QuoteResult {
  const { reserveIn, reserveOut, amountIn } = params;

  if (amountIn <= 0) return { expectedOutput: 0, priceImpactPercentage: '0.00%' };
  if (reserveIn <= 0 || reserveOut <= 0) throw new Error('Liquidity Pool kosong!');

  // Fee 0.3% untuk Liquidity Provider (persis seperti di SmartDEX Solidity contract)
  const amountInWithFee = amountIn * 997;
  const numerator = amountInWithFee * reserveOut;
  const denominator = reserveIn * 1000 + amountInWithFee;
  const expectedOutput = numerator / denominator;

  // Hitung price impact: selisih antara "harga ideal" vs "harga nyata setelah slippage"
  const spotPrice = reserveOut / reserveIn;
  const expectedWithoutSlippage = amountIn * spotPrice;
  const priceImpact = ((expectedWithoutSlippage - expectedOutput) / expectedWithoutSlippage) * 100;

  return {
    expectedOutput,
    priceImpactPercentage: priceImpact.toFixed(2) + '%',
  };
}

/**
 * Fungsi utama: minta quote ke backend API.
 * 
 * Kalau API tidak bisa dijangkau → otomatis fallback ke kalkulasi lokal.
 * Timeout: 3 detik (supaya UI tidak hang terlalu lama).
 */
export async function fetchSpotQuote(params: {
  reserveIn: number;
  reserveOut: number;
  amountIn: number;
}): Promise<QuoteResult> {
  const { reserveIn, reserveOut, amountIn } = params;

  try {
    const url =
      `${API_BASE_URL}/api/trade/spot/quote` +
      `?reserveIn=${reserveIn}&reserveOut=${reserveOut}&amountIn=${amountIn}`;

    const res = await fetch(url, {
      signal: AbortSignal.timeout(3000), // 3 detik timeout
    });

    if (!res.ok) throw new Error(`API error: ${res.status}`);

    const json: QuoteResponse = await res.json();

    return {
      expectedOutput: json.data.expectedOutput,
      priceImpactPercentage: json.data.priceImpactPercentage,
    };
  } catch {
    // Log peringatan, lalu gunakan kalkulasi lokal sebagai pengganti
    console.warn(
      '[SpotAPI] Backend tidak tersedia, menggunakan kalkulasi lokal sebagai fallback.',
    );
    return calculateQuoteLocally({ reserveIn, reserveOut, amountIn });
  }
}
