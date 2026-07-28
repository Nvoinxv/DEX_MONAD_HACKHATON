'use client';

/**
 * components/SpotSwapCard.tsx
 *
 * "Panel Kontrol Utama" — Kartu swap yang menggabungkan semua
 * komponen dan logika menjadi satu antarmuka yang siap dipakai.
 *
 * Fitur:
 * - Input token yang mau dijual (atas)
 * - Tombol ↕ untuk balik arah swap
 * - Output token yang akan didapat (bawah, readonly + auto-hitung)
 * - Rincian quote: rate, price impact, minimum received, slippage
 * - Tombol "Connect Wallet" → Modal pilih wallet (MetaMask/WalletConnect)
 * - Tombol "Swap" setelah wallet terhubung
 */

import React, { useState } from 'react';
import TokenAmountInput from '@/components/TokenAmountInput';
import PriceImpactBadge from '@/components/PriceImpactBadge';
import { useSpotQuote } from '@/hooks/useSpotQuote';

// ============================================================
// Tipe Data
// ============================================================

interface WalletOption {
  id: string;
  name: string;
  icon: string;
  desc: string;
}

const WALLET_OPTIONS: WalletOption[] = [
  { id: 'metamask', name: 'MetaMask', icon: '🦊', desc: 'Browser Extension · Most Popular' },
  { id: 'walletconnect', name: 'WalletConnect', icon: '🔗', desc: 'Scan QR Code dengan HP' },
];

// ============================================================
// Komponen Utama
// ============================================================

export default function SpotSwapCard() {
  const {
    amountIn,
    setAmountIn,
    amountOut,
    quote,
    loading,
    error,
    toggleReverse,
    tokenIn,
    tokenOut,
  } = useSpotQuote();

  // State untuk wallet
  const [walletConnected, setWalletConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState('');
  const [walletIcon, setWalletIcon] = useState('');
  const [showModal, setShowModal] = useState(false);

  // State untuk animasi tombol swap
  const [isSwapping, setIsSwapping] = useState(false);
  const [swapSuccess, setSwapSuccess] = useState(false);

  // Apakah tombol Swap aktif?
  const canSwap =
    walletConnected &&
    parseFloat(amountIn) > 0 &&
    !loading &&
    !error &&
    !!quote;

  // Harga per token (tampilan)
  const rateDisplay = quote
    ? `1 ${tokenIn.symbol} ≈ ${quote.spotPrice.toFixed(4)} ${tokenOut.symbol}`
    : '—';

  // ============================================================
  // Handlers
  // ============================================================

  const handleConnectWallet = (wallet: WalletOption) => {
    // Simulasi connect wallet (mock)
    const mockAddress =
      wallet.id === 'metamask' ? '0x1A2b...9F3c' : '0xDeAd...C0fE';
    setWalletConnected(true);
    setWalletAddress(mockAddress);
    setWalletIcon(wallet.icon);
    setShowModal(false);
  };

  const handleSwap = async () => {
    if (!canSwap) return;
    setIsSwapping(true);
    setSwapSuccess(false);

    // Simulasi transaksi (1.5 detik)
    await new Promise((r) => setTimeout(r, 1500));

    setIsSwapping(false);
    setSwapSuccess(true);

    // Reset sukses setelah 3 detik
    setTimeout(() => setSwapSuccess(false), 3000);
  };

  const handleDisconnect = () => {
    setWalletConnected(false);
    setWalletAddress('');
    setWalletIcon('');
  };

  // ============================================================
  // Render
  // ============================================================

  return (
    <>
      {/* ─── Kartu Swap ─────────────────────────────────────── */}
      <div
        style={{
          background: 'rgba(10, 10, 32, 0.88)',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          border: '1px solid rgba(131,110,249,0.22)',
          borderRadius: '24px',
          padding: '28px',
          width: '100%',
          maxWidth: '480px',
          boxShadow:
            '0 0 60px rgba(131,110,249,0.07), 0 8px 40px rgba(0,0,0,0.45)',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Dekorasi glow di sudut kanan atas */}
        <div
          style={{
            position: 'absolute',
            top: '-60px',
            right: '-60px',
            width: '220px',
            height: '220px',
            borderRadius: '50%',
            background:
              'radial-gradient(circle, rgba(131,110,249,0.10) 0%, transparent 70%)',
            pointerEvents: 'none',
          }}
        />

        {/* ── Header ── */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            marginBottom: '22px',
          }}
        >
          <div>
            <h2
              style={{
                margin: 0,
                fontSize: '20px',
                fontWeight: 800,
                color: '#F5F5FF',
                letterSpacing: '-0.4px',
              }}
            >
              Swap Token
            </h2>
            <p style={{ margin: '3px 0 0 0', fontSize: '13px', color: '#8B8BAE' }}>
              Spot Trading · MON/USDC
            </p>
          </div>

          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            {/* Badge Fee */}
            <div
              style={{
                background: 'rgba(131,110,249,0.10)',
                border: '1px solid rgba(131,110,249,0.25)',
                borderRadius: '8px',
                padding: '5px 10px',
                fontSize: '12px',
                color: '#836EF9',
                fontWeight: 600,
              }}
            >
              Fee 0.3%
            </div>

            {/* Tombol Disconnect (kalau wallet sudah connect) */}
            {walletConnected && (
              <button
                onClick={handleDisconnect}
                title="Disconnect wallet"
                style={{
                  background: 'rgba(239,68,68,0.08)',
                  border: '1px solid rgba(239,68,68,0.2)',
                  borderRadius: '8px',
                  padding: '5px 10px',
                  fontSize: '12px',
                  color: '#EF4444',
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                  fontWeight: 600,
                }}
              >
                ✕ Putuskan
              </button>
            )}
          </div>
        </div>

        {/* ── Input: Token Masuk ── */}
        <TokenAmountInput
          label="Kamu Kirim"
          token={tokenIn}
          value={amountIn}
          onChange={setAmountIn}
          balance="1,000.00"
        />

        {/* ── Tombol Balik Arah ── */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            margin: '14px 0',
            position: 'relative',
            zIndex: 1,
          }}
        >
          <button
            id="spot-swap-reverse-btn"
            onClick={toggleReverse}
            className="swap-reverse-btn"
            style={{
              width: '44px',
              height: '44px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #836EF9, #4F7FFF)',
              border: '3px solid rgba(10,10,32,0.88)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '18px',
              color: '#fff',
              transition: 'transform 0.35s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.25s',
              boxShadow: '0 0 20px rgba(131,110,249,0.40)',
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.transform = 'rotate(180deg) scale(1.1)';
              (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 0 32px rgba(131,110,249,0.65)';
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.transform = 'rotate(0deg) scale(1)';
              (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 0 20px rgba(131,110,249,0.40)';
            }}
          >
            ↕
          </button>
        </div>

        {/* ── Input: Token Keluar (readonly) ── */}
        <TokenAmountInput
          label="Kamu Terima (estimasi)"
          token={tokenOut}
          value={amountOut}
          readOnly
          balance="500.00"
          loading={loading}
        />

        {/* ── Rincian Quote ── */}
        {quote && !loading && (
          <div
            style={{
              marginTop: '16px',
              background: 'rgba(255,255,255,0.025)',
              border: '1px solid rgba(255,255,255,0.07)',
              borderRadius: '14px',
              padding: '14px 16px',
              display: 'flex',
              flexDirection: 'column',
              gap: '10px',
              animation: 'fadeInUp 0.3s ease',
            }}
          >
            {/* Rate */}
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '13px', color: '#8B8BAE' }}>Rate</span>
              <span style={{ fontSize: '13px', color: '#C4C4E0', fontWeight: 500 }}>
                {rateDisplay}
              </span>
            </div>

            {/* Divider */}
            <div style={{ height: '1px', background: 'rgba(255,255,255,0.05)' }} />

            {/* Price Impact Badge */}
            <PriceImpactBadge
              priceImpact={quote.priceImpactValue}
              percentage={quote.priceImpactPercentage}
            />

            {/* Minimum Received */}
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '13px', color: '#8B8BAE' }}>Min. Diterima</span>
              <span style={{ fontSize: '13px', color: '#C4C4E0', fontWeight: 500 }}>
                {quote.minimumReceived.toFixed(6)} {tokenOut.symbol}
              </span>
            </div>

            {/* Slippage Tolerance */}
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '13px', color: '#8B8BAE' }}>Slippage Tolerance</span>
              <span style={{ fontSize: '13px', color: '#C4C4E0', fontWeight: 500 }}>0.5%</span>
            </div>
          </div>
        )}

        {/* ── Pesan Error ── */}
        {error && (
          <div
            style={{
              marginTop: '14px',
              background: 'rgba(239,68,68,0.08)',
              border: '1px solid rgba(239,68,68,0.25)',
              borderRadius: '12px',
              padding: '12px 14px',
              fontSize: '13px',
              color: '#EF4444',
              animation: 'fadeInUp 0.3s ease',
            }}
          >
            ⚠️ {error}
          </div>
        )}

        {/* ── Status Wallet Terhubung ── */}
        {walletConnected && (
          <div
            style={{
              marginTop: '14px',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '10px 14px',
              background: 'rgba(34,197,94,0.07)',
              border: '1px solid rgba(34,197,94,0.18)',
              borderRadius: '12px',
              animation: 'fadeInUp 0.3s ease',
            }}
          >
            <span style={{ fontSize: '16px' }}>{walletIcon}</span>
            <div style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#22C55E', boxShadow: '0 0 6px #22C55E' }} />
            <span style={{ fontSize: '13px', color: '#22C55E', fontWeight: 600 }}>
              Terhubung: {walletAddress}
            </span>
          </div>
        )}

        {/* ── Notifikasi Sukses Swap ── */}
        {swapSuccess && (
          <div
            style={{
              marginTop: '14px',
              background: 'rgba(34,197,94,0.10)',
              border: '1px solid rgba(34,197,94,0.30)',
              borderRadius: '12px',
              padding: '12px 16px',
              fontSize: '14px',
              color: '#22C55E',
              fontWeight: 600,
              textAlign: 'center',
              animation: 'fadeInUp 0.3s ease',
            }}
          >
            ✅ Swap berhasil dikonfirmasi! (Demo Mode)
          </div>
        )}

        {/* ── Tombol Aksi Utama ── */}
        <button
          id="spot-swap-action-btn"
          onClick={walletConnected ? handleSwap : () => setShowModal(true)}
          disabled={walletConnected && !canSwap && !isSwapping}
          style={{
            width: '100%',
            marginTop: '18px',
            padding: '16px',
            borderRadius: '14px',
            border: 'none',
            cursor:
              walletConnected && !canSwap
                ? 'not-allowed'
                : 'pointer',
            background:
              walletConnected && !canSwap
                ? 'rgba(131,110,249,0.25)'
                : 'linear-gradient(135deg, #836EF9 0%, #4F7FFF 100%)',
            color: '#fff',
            fontSize: '16px',
            fontWeight: 700,
            fontFamily: 'inherit',
            letterSpacing: '-0.2px',
            transition: 'all 0.3s cubic-bezier(0.34,1.56,0.64,1)',
            boxShadow:
              walletConnected && !canSwap
                ? 'none'
                : '0 0 28px rgba(131,110,249,0.35)',
            opacity: walletConnected && !canSwap ? 0.55 : 1,
          }}
          onMouseEnter={(e) => {
            const btn = e.currentTarget as HTMLButtonElement;
            if (!btn.disabled) {
              btn.style.transform = 'translateY(-2px)';
              btn.style.boxShadow = '0 0 45px rgba(131,110,249,0.55)';
            }
          }}
          onMouseLeave={(e) => {
            const btn = e.currentTarget as HTMLButtonElement;
            btn.style.transform = 'translateY(0)';
            btn.style.boxShadow = !btn.disabled
              ? '0 0 28px rgba(131,110,249,0.35)'
              : 'none';
          }}
        >
          {isSwapping
            ? '⏳ Memproses Transaksi...'
            : walletConnected
            ? canSwap
              ? `⇄ Swap ${tokenIn.symbol} → ${tokenOut.symbol}`
              : 'Masukkan Jumlah Token'
            : '🔌 Hubungkan Wallet'}
        </button>
      </div>

      {/* ─── Modal Connect Wallet ──────────────────────────── */}
      {showModal && (
        <div
          id="wallet-connect-modal"
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.72)',
            backdropFilter: 'blur(10px)',
            WebkitBackdropFilter: 'blur(10px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            animation: 'fadeIn 0.25s ease',
          }}
          onClick={() => setShowModal(false)}
        >
          <div
            style={{
              background: 'rgba(10, 10, 32, 0.98)',
              border: '1px solid rgba(131,110,249,0.28)',
              borderRadius: '24px',
              padding: '32px',
              width: '380px',
              boxShadow: '0 0 70px rgba(131,110,249,0.14)',
              animation: 'scaleIn 0.3s cubic-bezier(0.34,1.56,0.64,1)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div style={{ textAlign: 'center', marginBottom: '24px' }}>
              <div style={{
                width: '52px',
                height: '52px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #836EF9, #4F7FFF)',
                margin: '0 auto 12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '24px',
                boxShadow: '0 0 24px rgba(131,110,249,0.4)',
              }}>
                ⚡
              </div>
              <h3
                style={{
                  margin: '0 0 6px 0',
                  fontSize: '20px',
                  fontWeight: 800,
                  color: '#F5F5FF',
                  letterSpacing: '-0.4px',
                }}
              >
                Hubungkan Wallet
              </h3>
              <p style={{ margin: 0, fontSize: '13px', color: '#8B8BAE' }}>
                Pilih wallet untuk mulai trading di Monad
              </p>
            </div>

            {/* Daftar Wallet */}
            {WALLET_OPTIONS.map((wallet) => (
              <button
                key={wallet.id}
                id={`connect-${wallet.id}-btn`}
                onClick={() => handleConnectWallet(wallet)}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '14px',
                  padding: '16px 18px',
                  marginBottom: '10px',
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  borderRadius: '14px',
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                  color: '#F5F5FF',
                  transition: 'all 0.2s ease',
                  textAlign: 'left',
                }}
                onMouseEnter={(e) => {
                  const btn = e.currentTarget as HTMLButtonElement;
                  btn.style.background = 'rgba(131,110,249,0.12)';
                  btn.style.borderColor = 'rgba(131,110,249,0.4)';
                  btn.style.transform = 'translateX(4px)';
                }}
                onMouseLeave={(e) => {
                  const btn = e.currentTarget as HTMLButtonElement;
                  btn.style.background = 'rgba(255,255,255,0.04)';
                  btn.style.borderColor = 'rgba(255,255,255,0.08)';
                  btn.style.transform = 'translateX(0)';
                }}
              >
                <span style={{ fontSize: '30px', flexShrink: 0 }}>{wallet.icon}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, fontSize: '15px', color: '#F5F5FF' }}>
                    {wallet.name}
                  </div>
                  <div style={{ fontSize: '12px', color: '#8B8BAE', marginTop: '2px' }}>
                    {wallet.desc}
                  </div>
                </div>
                <span style={{ color: '#836EF9', fontSize: '18px' }}>→</span>
              </button>
            ))}

            {/* Tombol Batal */}
            <button
              onClick={() => setShowModal(false)}
              style={{
                width: '100%',
                padding: '13px',
                marginTop: '6px',
                background: 'transparent',
                border: '1px solid rgba(255,255,255,0.10)',
                borderRadius: '12px',
                cursor: 'pointer',
                color: '#8B8BAE',
                fontSize: '14px',
                fontFamily: 'inherit',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.04)';
                (e.currentTarget as HTMLButtonElement).style.color = '#F5F5FF';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.background = 'transparent';
                (e.currentTarget as HTMLButtonElement).style.color = '#8B8BAE';
              }}
            >
              Batal
            </button>
          </div>
        </div>
      )}
    </>
  );
}
