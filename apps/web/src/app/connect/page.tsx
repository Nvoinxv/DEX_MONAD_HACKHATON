'use client';

/**
 * app/connect/page.tsx
 *
 * Halaman Connect Wallet / Login
 *
 * Flow:
 *  1. User pilih wallet (MetaMask / WalletConnect)
 *  2. Simulasi koneksi (mock) → dapat wallet address
 *  3. Check backend: apakah wallet sudah punya akun?
 *     - Sudah → redirect ke /trade/spot
 *     - Belum → redirect ke /register
 */

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useWallet, type WalletType } from '@/context/WalletContext';
import Navbar from '@/components/Navbar';

// ─────────────────────────────────────────────
// Wallet Options
// ─────────────────────────────────────────────

interface WalletOption {
  id: WalletType;
  name: string;
  icon: string;
  desc: string;
  gradient: string;
}

const WALLET_OPTIONS: WalletOption[] = [
  {
    id: 'metamask',
    name: 'MetaMask',
    icon: '🦊',
    desc: 'Browser Extension · Paling populer untuk Web3',
    gradient: 'linear-gradient(135deg, #F6851B22, #E2761B22)',
  },
  {
    id: 'walletconnect',
    name: 'WalletConnect',
    icon: '🔗',
    desc: 'Scan QR Code dengan aplikasi wallet di HP',
    gradient: 'linear-gradient(135deg, #3B99FC22, #3B99FC22)',
  },
];

// ─────────────────────────────────────────────
// Page Component
// ─────────────────────────────────────────────

export default function ConnectPage() {
  const router = useRouter();
  const { walletAddress, isConnecting, connectWallet } = useWallet();
  const [connecting, setConnecting] = useState<WalletType | null>(null);
  const [step, setStep] = useState<'select' | 'connecting' | 'checking' | 'done'>('select');
  const [error, setError] = useState<string | null>(null);

  // Kalau sudah connect, langsung redirect
  useEffect(() => {
    if (walletAddress) {
      router.push('/trade/spot');
    }
  }, [walletAddress, router]);

  const handleConnect = async (walletType: WalletType) => {
    setConnecting(walletType);
    setError(null);
    setStep('connecting');

    try {
      // Simulasi connecting ke wallet
      await new Promise((r) => setTimeout(r, 900));
      setStep('checking');

      const { isRegistered } = await connectWallet(walletType);

      setStep('done');
      await new Promise((r) => setTimeout(r, 400));

      if (isRegistered) {
        router.push('/trade/spot');
      } else {
        router.push('/register');
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Gagal menghubungkan wallet.';
      setError(msg);
      setStep('select');
      setConnecting(null);
    }
  };

  const isLoading = step !== 'select';

  const stepLabel: Record<typeof step, string> = {
    select: '',
    connecting: 'Menghubungkan ke wallet...',
    checking: 'Memeriksa akun di platform...',
    done: 'Berhasil! Mengalihkan...',
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(160deg, #07071A 0%, #0D0A2E 50%, #07071A 100%)',
        fontFamily: "'Inter', 'Geist', sans-serif",
        color: '#F5F5FF',
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
        * { box-sizing: border-box; }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.94); }
          to { opacity: 1; transform: scale(1); }
        }
        @keyframes pulse-ring {
          0% { transform: scale(0.8); opacity: 1; }
          100% { transform: scale(2.2); opacity: 0; }
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        @keyframes pulse-dot {
          0%, 100% { opacity: 1; box-shadow: 0 0 6px #836EF9; }
          50% { opacity: 0.5; box-shadow: 0 0 14px #836EF9; }
        }
        .wallet-option:hover {
          border-color: rgba(131,110,249,0.45) !important;
          background: rgba(131,110,249,0.10) !important;
          transform: translateX(5px) !important;
        }
      `}</style>

      <Navbar activePath="/connect" />

      {/* Background glow */}
      <div
        style={{
          position: 'fixed',
          top: '30%',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '600px',
          height: '600px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(131,110,249,0.07) 0%, transparent 70%)',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />

      {/* Main Content */}
      <main
        style={{
          position: 'relative',
          zIndex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: 'calc(100vh - 64px)',
          padding: '40px 24px',
        }}
      >
        <div
          style={{
            width: '100%',
            maxWidth: '440px',
            animation: 'scaleIn 0.4s cubic-bezier(0.34,1.56,0.64,1)',
          }}
        >
          {/* Card */}
          <div
            style={{
              background: 'rgba(10,10,32,0.90)',
              border: '1px solid rgba(131,110,249,0.22)',
              borderRadius: '28px',
              padding: '40px 36px',
              boxShadow: '0 0 80px rgba(131,110,249,0.10), 0 20px 60px rgba(0,0,0,0.5)',
            }}
          >
            {/* Header */}
            <div style={{ textAlign: 'center', marginBottom: '36px' }}>
              {/* Icon with pulse */}
              <div style={{ position: 'relative', width: '64px', height: '64px', margin: '0 auto 20px' }}>
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    borderRadius: '50%',
                    background: 'rgba(131,110,249,0.3)',
                    animation: isLoading ? 'pulse-ring 1.5s ease-out infinite' : 'none',
                  }}
                />
                <div
                  style={{
                    position: 'relative',
                    width: '64px',
                    height: '64px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #836EF9, #4F7FFF)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '28px',
                    boxShadow: '0 0 30px rgba(131,110,249,0.45)',
                  }}
                >
                  {isLoading ? (
                    <div
                      style={{
                        width: '28px',
                        height: '28px',
                        border: '3px solid rgba(255,255,255,0.3)',
                        borderTopColor: '#fff',
                        borderRadius: '50%',
                        animation: 'spin 0.8s linear infinite',
                      }}
                    />
                  ) : (
                    '⚡'
                  )}
                </div>
              </div>

              <h1
                style={{
                  margin: '0 0 8px',
                  fontSize: '26px',
                  fontWeight: 800,
                  letterSpacing: '-0.5px',
                  color: '#F5F5FF',
                }}
              >
                {isLoading ? stepLabel[step] : 'Hubungkan Wallet'}
              </h1>
              <p style={{ margin: 0, fontSize: '14px', color: '#8B8BAE', lineHeight: 1.5 }}>
                {isLoading
                  ? 'Mohon tunggu...'
                  : 'Pilih wallet untuk mulai trading di Nvoin SmartDEX · Monad'}
              </p>
            </div>

            {/* Wallet Options */}
            {!isLoading && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {WALLET_OPTIONS.map((wallet) => (
                  <button
                    key={wallet.id}
                    id={`connect-${wallet.id}-btn`}
                    onClick={() => handleConnect(wallet.id)}
                    disabled={isConnecting}
                    className="wallet-option"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '16px',
                      padding: '18px 20px',
                      background: wallet.gradient,
                      border: '1px solid rgba(255,255,255,0.08)',
                      borderRadius: '16px',
                      cursor: 'pointer',
                      fontFamily: 'inherit',
                      color: '#F5F5FF',
                      textAlign: 'left',
                      width: '100%',
                      transition: 'all 0.25s cubic-bezier(0.34,1.56,0.64,1)',
                    }}
                  >
                    <div
                      style={{
                        width: '48px',
                        height: '48px',
                        borderRadius: '14px',
                        background: 'rgba(255,255,255,0.08)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '26px',
                        flexShrink: 0,
                      }}
                    >
                      {wallet.icon}
                    </div>

                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 700, fontSize: '16px', color: '#F5F5FF', marginBottom: '3px' }}>
                        {wallet.name}
                      </div>
                      <div style={{ fontSize: '12px', color: '#8B8BAE' }}>
                        {wallet.desc}
                      </div>
                    </div>

                    <div style={{ color: '#836EF9', fontSize: '20px', flexShrink: 0 }}>→</div>
                  </button>
                ))}
              </div>
            )}

            {/* Loading Progress */}
            {isLoading && (
              <div style={{ textAlign: 'center', padding: '20px 0' }}>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '10px',
                    fontSize: '14px',
                    color: '#8B8BAE',
                  }}
                >
                  {connecting && (
                    <>
                      <span style={{ fontSize: '20px' }}>
                        {WALLET_OPTIONS.find(w => w.id === connecting)?.icon}
                      </span>
                      <span>{WALLET_OPTIONS.find(w => w.id === connecting)?.name}</span>
                    </>
                  )}
                </div>

                {/* Progress bar */}
                <div
                  style={{
                    marginTop: '20px',
                    height: '3px',
                    background: 'rgba(255,255,255,0.06)',
                    borderRadius: '3px',
                    overflow: 'hidden',
                  }}
                >
                  <div
                    style={{
                      height: '100%',
                      background: 'linear-gradient(90deg, #836EF9, #4F7FFF)',
                      borderRadius: '3px',
                      width: step === 'connecting' ? '40%' : step === 'checking' ? '75%' : '100%',
                      transition: 'width 0.5s ease',
                    }}
                  />
                </div>

                <div style={{ marginTop: '12px', fontSize: '12px', color: '#4B4B6E' }}>
                  {step === 'connecting' && '🔌 Menghubungkan ke wallet...'}
                  {step === 'checking' && '🔍 Memeriksa akun di platform...'}
                  {step === 'done' && '✅ Sukses!'}
                </div>
              </div>
            )}

            {/* Error */}
            {error && (
              <div
                style={{
                  marginTop: '16px',
                  padding: '12px 14px',
                  background: 'rgba(239,68,68,0.08)',
                  border: '1px solid rgba(239,68,68,0.25)',
                  borderRadius: '12px',
                  fontSize: '13px',
                  color: '#EF4444',
                  animation: 'fadeInUp 0.3s ease',
                }}
              >
                ⚠️ {error}
              </div>
            )}

            {/* Divider */}
            {!isLoading && (
              <>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    margin: '24px 0',
                  }}
                >
                  <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.07)' }} />
                  <span style={{ fontSize: '12px', color: '#4B4B6E' }}>atau</span>
                  <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.07)' }} />
                </div>

                <p style={{ textAlign: 'center', fontSize: '13px', color: '#8B8BAE', margin: 0, lineHeight: 1.6 }}>
                  Belum punya wallet?{' '}
                  <a
                    href="https://metamask.io/download"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: '#836EF9', fontWeight: 600, textDecoration: 'none' }}
                  >
                    Download MetaMask →
                  </a>
                </p>
              </>
            )}
          </div>

          {/* Security note */}
          <div
            style={{
              textAlign: 'center',
              marginTop: '20px',
              padding: '12px 16px',
              background: 'rgba(255,255,255,0.02)',
              borderRadius: '12px',
              border: '1px solid rgba(255,255,255,0.05)',
            }}
          >
            <p style={{ fontSize: '12px', color: '#4B4B6E', margin: 0, lineHeight: 1.6 }}>
              🔒 <strong style={{ color: '#8B8BAE' }}>Non-custodial</strong> · Kami tidak pernah menyimpan private key atau seed phrase kamu.
              Aset kamu selalu dalam kendali penuh kamu.
            </p>
          </div>

          {/* Back link */}
          <div style={{ textAlign: 'center', marginTop: '16px' }}>
            <Link
              href="/"
              style={{ fontSize: '13px', color: '#4B4B6E', textDecoration: 'none' }}
              onMouseEnter={(e) => ((e.currentTarget as HTMLAnchorElement).style.color = '#8B8BAE')}
              onMouseLeave={(e) => ((e.currentTarget as HTMLAnchorElement).style.color = '#4B4B6E')}
            >
              ← Kembali ke beranda
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
