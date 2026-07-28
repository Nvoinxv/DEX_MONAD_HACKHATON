'use client';

/**
 * hooks/useSpotQuote.ts
 *
 * "Si Otak Logika UI" — Custom React Hook yang mengurus semua logic
 * di balik layar agar komponen tampilan tetap bersih dan sederhana.
 *
 * Tugasnya:
 * - Simpan state: jumlah token yang diinput user
 * - Otomatis hit API setelah user berhenti mengetik (debounce 500ms)
 * - Return hasil quote: jumlah yang didapat, price impact, dll.
 * - Mendukung fitur "balik posisi" token (MON→USDC atau USDC→MON)
 */

import { useState, useEffect, useCallback } from 'react';
import { fetchSpotQuote, MOCK_RESERVES } from '@/lib/api';

// ============================================================
// Type Definitions
// ============================================================

export interface TokenInfo {
  symbol: string;
  name: string;
  color: string;
  decimals: number;
}

export interface SpotQuoteResult {
  expectedOutput: number;
  priceImpactPercentage: string;
  priceImpactValue: number; // angka murni, tanpa simbol %
  spotPrice: number;        // harga per token (tanpa slippage)
  minimumReceived: number;  // estimasi minimum yang diterima (setelah slippage tolerance)
}

export interface UseSpotQuoteReturn {
  amountIn: string;
  setAmountIn: (value: string) => void;
  amountOut: string;
  quote: SpotQuoteResult | null;
  loading: boolean;
  error: string | null;
  isReversed: boolean;
  toggleReverse: () => void;
  tokenIn: TokenInfo;
  tokenOut: TokenInfo;
}

// ============================================================
// Token Definitions
// ============================================================

const MON_TOKEN: TokenInfo = {
  symbol: 'MON',
  name: 'Monad',
  color: '#836EF9', // ungu khas Monad
  decimals: 18,
};

const USDC_TOKEN: TokenInfo = {
  symbol: 'USDC',
  name: 'USD Coin',
  color: '#2775CA', // biru khas USDC
  decimals: 6,
};

// Slippage tolerance: 0.5%
// Artinya: kalau harga bergerak lebih dari 0.5% dari estimasi, swap akan gagal
// (ini proteksi bagi user agar tidak rugi terlalu banyak karena volatilitas)
const SLIPPAGE_TOLERANCE = 0.005;

// ============================================================
// Custom Hook
// ============================================================

export function useSpotQuote(): UseSpotQuoteReturn {
  const [amountIn, setAmountIn] = useState('');
  const [amountOut, setAmountOut] = useState('');
  const [quote, setQuote] = useState<SpotQuoteResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // isReversed: false = MON→USDC, true = USDC→MON
  const [isReversed, setIsReversed] = useState(false);

  const tokenIn = isReversed ? USDC_TOKEN : MON_TOKEN;
  const tokenOut = isReversed ? MON_TOKEN : USDC_TOKEN;

  // Ambil reserve yang sesuai dengan arah swap
  const getReserves = useCallback(() => {
    if (isReversed) {
      // Kalau user mau tukar USDC→MON, posisi reserve dibalik
      return {
        reserveIn: MOCK_RESERVES.MON_USDC.reserveOut,   // USDC jadi "masuk"
        reserveOut: MOCK_RESERVES.MON_USDC.reserveIn,   // MON jadi "keluar"
      };
    }
    return MOCK_RESERVES.MON_USDC; // default: MON→USDC
  }, [isReversed]);

  // Effect ini jalan setiap kali user mengubah amountIn
  // Debounce 500ms = tunggu 0.5 detik setelah user berhenti mengetik, baru hit API
  useEffect(() => {
    const parsed = parseFloat(amountIn);

    // Kalau input kosong atau 0, reset semua state
    if (!amountIn || isNaN(parsed) || parsed <= 0) {
      setAmountOut('');
      setQuote(null);
      setError(null);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      setError(null);

      try {
        const reserves = getReserves();
        const result = await fetchSpotQuote({ ...reserves, amountIn: parsed });

        const priceImpactValue = parseFloat(
          result.priceImpactPercentage.replace('%', ''),
        );
        const spotPrice = reserves.reserveOut / reserves.reserveIn;
        const minimumReceived = result.expectedOutput * (1 - SLIPPAGE_TOLERANCE);

        setAmountOut(result.expectedOutput.toFixed(6));
        setQuote({
          expectedOutput: result.expectedOutput,
          priceImpactPercentage: result.priceImpactPercentage,
          priceImpactValue,
          spotPrice,
          minimumReceived,
        });
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'Gagal mengambil quote';
        setError(message);
        setAmountOut('');
        setQuote(null);
      } finally {
        setLoading(false);
      }
    }, 500); // debounce 500ms

    // Cleanup: batalkan timer kalau user masih mengetik
    return () => clearTimeout(timer);
  }, [amountIn, isReversed, getReserves]);

  // Toggle balik posisi token (MON↔USDC)
  const toggleReverse = useCallback(() => {
    setIsReversed((prev) => !prev);
    // Pindahkan output menjadi input baru (supaya UX lebih smooth)
    setAmountIn(amountOut || '');
    setAmountOut('');
    setQuote(null);
    setError(null);
  }, [amountOut]);

  return {
    amountIn,
    setAmountIn,
    amountOut,
    quote,
    loading,
    error,
    isReversed,
    toggleReverse,
    tokenIn,
    tokenOut,
  };
}
