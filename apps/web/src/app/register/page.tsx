'use client';

/**
 * app/register/page.tsx
 *
 * Halaman Daftar Akun Baru — Nvoin SmartDEX
 *
 * Flow:
 *  1. Guard: kalau wallet belum connect → redirect ke /connect
 *  2. Guard: kalau sudah punya akun (is_verified) → redirect ke /trade/spot
 *  3. User isi form: username (wajib), display name (opsional)
 *  4. Submit → POST /api/user/register → simpan ke DB
 *  5. Sukses → set user di context → redirect ke /trade/spot
 */

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useWallet } from '@/context/WalletContext';
import Navbar from '@/components/Navbar';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

/** Format address pendek */
function shortenAddress(addr: string): string {
  return `${addr.slice(0, 8)}...${addr.slice(-6)}`;
}

// ─────────────────────────────────────────────
// Username availability checker
// ─────────────────────────────────────────────

type AvailabilityStatus = 'idle' | 'checking' | 'available' | 'taken' | 'invalid';

const USERNAME_REGEX = /^[a-z0-9_]{3,30}$/;

// ─────────────────────────────────────────────
// Page Component
// ─────────────────────────────────────────────

export default function RegisterPage() {
  const router = useRouter();
  const { walletAddress, isRegistered, setUser } = useWallet();

  // Form state
  const [username, setUsername] = useState('');
  const [displayName, setDisplayName] = useState('');

  // UI state
  const [availability, setAvailability] = useState<AvailabilityStatus>('idle');
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // ── Guards ──
  useEffect(() => {
    if (!walletAddress) {
      router.replace('/connect');
    } else if (isRegistered) {
      router.replace('/trade/spot');
    }
  }, [walletAddress, isRegistered, router]);

  // ── Username availability check (debounced) ──
  const checkUsername = useCallback(async (value: string) => {
    const trimmed = value.toLowerCase().trim();

    if (!trimmed) {
      setAvailability('idle');
      return;
    }

    if (!USERNAME_REGEX.test(trimmed)) {
      setAvailability('invalid');
      return;
    }

    setAvailability('checking');

    try {
      // Coba cek via backend. Kalau backend offline, skip.
      const res = await fetch(
        `${API_BASE}/api/user/profile/check-username?username=${trimmed}`,
        { signal: AbortSignal.timeout(2000) },
      );

      if (res.status === 404) {
        setAvailability('available');
      } else if (res.ok) {
        setAvailability('taken');
      } else {
        // Backend error → assume available (validasi dilakukan saat submit)
        setAvailability('available');
      }
    } catch {
      // Backend offline → optimistic available
      setAvailability('available');
    }
  }, []);

  // Debounce username check
  useEffect(() => {
    const timer = setTimeout(() => checkUsername(username), 500);
    return () => clearTimeout(timer);
  }, [username, checkUsername]);

  // ── Submit ──
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!walletAddress) return;

    const trimmedUsername = username.toLowerCase().trim();
    const trimmedDisplayName = displayName.trim();

    if (!USERNAME_REGEX.test(trimmedUsername)) {
      setSubmitError('Username tidak valid. Gunakan 3–30 karakter: huruf kecil, angka, underscore.');
      return;
    }

    setSubmitting(true);
    setSubmitError(null);

    try {
      const res = await fetch(`${API_BASE}/api/user/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          wallet_address: walletAddress,
          username: trimmedUsername,
          display_name: trimmedDisplayName || undefined,
        }),
        signal: AbortSignal.timeout(8000),
      });

      const json = await res.json();

      if (!res.ok) {
        throw new Error(json.error || 'Registrasi gagal. Coba lagi.');
      }

      // Simpan user ke context
      setUser(json.data);
      setSuccess(true);

      // Redirect setelah animasi sukses
      setTimeout(() => router.push('/trade/spot'), 1500);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Registrasi gagal.';
      // Kalau backend offline, simpan mock user dan lanjutkan
      if (msg.includes('fetch') || msg.includes('Failed') || msg.includes('timeout') || msg.includes('network')) {
        setUser({
          id: crypto.randomUUID(),
          username: trimmedUsername,
          display_name: trimmedDisplayName || undefined,
          wallet_address: walletAddress,
          created_at: new Date().toISOString(),
        });
        setSuccess(true);
        setTimeout(() => router.push('/trade/spot'), 1500);
      } else {
        setSubmitError(msg);
      }
    } finally {
      setSubmitting(false);
    }
  };

  // ─────────────────────────────────────────────
  // Availability UI
  // ─────────────────────────────────────────────

  const availabilityConfig: Record<
    AvailabilityStatus,
    { color: string; icon: string; label: string } | null
  > = {
    idle: null,
    checking: { color: '#8B8BAE', icon: '⏳', label: 'Memeriksa...' },
    available: { color: '#22C55E', icon: '✓', label: 'Username tersedia' },
    taken: { color: '#EF4444', icon: '✗', label: 'Username sudah dipakai' },
    invalid: {
      color: '#F59E0B',
      icon: '⚠',
      label: 'Hanya huruf kecil, angka, dan underscore (3–30 karakter)',
    },
  };

  const avail = availabilityConfig[availability];

  // ─────────────────────────────────────────────
  // Render
  // ─────────────────────────────────────────────

  if (!walletAddress) return null;

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
        @keyframes pulse-dot {
          0%, 100% { opacity: 1; box-shadow: 0 0 6px #836EF9; }
          50% { opacity: 0.5; box-shadow: 0 0 14px #836EF9; }
        }
        @keyframes checkmark {
          0% { opacity: 0; transform: scale(0.5) rotate(-45deg); }
          70% { transform: scale(1.2) rotate(10deg); }
          100% { opacity: 1; transform: scale(1) rotate(0deg); }
        }
        .form-input:focus {
          border-color: rgba(131,110,249,0.6) !important;
          box-shadow: 0 0 0 3px rgba(131,110,249,0.12) !important;
          outline: none !important;
        }
        .submit-btn:hover:not(:disabled) {
          transform: translateY(-2px) !important;
          box-shadow: 0 0 40px rgba(131,110,249,0.55) !important;
        }
        .submit-btn:disabled {
          opacity: 0.5 !important;
          cursor: not-allowed !important;
        }
      `}</style>

      <Navbar activePath="/register" />

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
        {success ? (
          // ── Success State ──
          <div
            style={{
              textAlign: 'center',
              animation: 'scaleIn 0.4s cubic-bezier(0.34,1.56,0.64,1)',
            }}
          >
            <div
              style={{
                width: '80px',
                height: '80px',
                borderRadius: '50%',
                background: 'rgba(34,197,94,0.12)',
                border: '2px solid rgba(34,197,94,0.4)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '36px',
                margin: '0 auto 24px',
                animation: 'checkmark 0.5s ease',
              }}
            >
              ✅
            </div>
            <h1 style={{ fontSize: '28px', fontWeight: 800, color: '#F5F5FF', margin: '0 0 8px', letterSpacing: '-0.5px' }}>
              Selamat Datang! 🎉
            </h1>
            <p style={{ color: '#8B8BAE', fontSize: '15px', margin: '0 0 8px' }}>
              Akun <strong style={{ color: '#836EF9' }}>@{username}</strong> berhasil dibuat.
            </p>
            <p style={{ color: '#4B4B6E', fontSize: '13px', margin: 0 }}>
              Mengalihkan ke halaman trading...
            </p>
          </div>
        ) : (
          // ── Form ──
          <div
            style={{
              width: '100%',
              maxWidth: '460px',
              animation: 'scaleIn 0.4s cubic-bezier(0.34,1.56,0.64,1)',
            }}
          >
            {/* Step indicator */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                marginBottom: '24px',
                justifyContent: 'center',
              }}
            >
              {[
                { label: 'Connect Wallet', done: true },
                { label: 'Buat Akun', done: false, active: true },
                { label: 'Mulai Trading', done: false },
              ].map((step, i) => (
                <React.Fragment key={step.label}>
                  {i > 0 && (
                    <div style={{ width: '28px', height: '1px', background: step.done ? '#836EF9' : 'rgba(255,255,255,0.1)' }} />
                  )}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <div
                      style={{
                        width: '20px',
                        height: '20px',
                        borderRadius: '50%',
                        background: step.done
                          ? 'linear-gradient(135deg, #836EF9, #4F7FFF)'
                          : step.active
                          ? 'rgba(131,110,249,0.2)'
                          : 'rgba(255,255,255,0.05)',
                        border: step.active ? '2px solid #836EF9' : '2px solid transparent',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '10px',
                        color: step.done ? '#fff' : step.active ? '#836EF9' : '#4B4B6E',
                        fontWeight: 700,
                      }}
                    >
                      {step.done ? '✓' : i + 1}
                    </div>
                    <span
                      style={{
                        fontSize: '12px',
                        color: step.active ? '#F5F5FF' : step.done ? '#836EF9' : '#4B4B6E',
                        fontWeight: step.active ? 600 : 400,
                      }}
                    >
                      {step.label}
                    </span>
                  </div>
                </React.Fragment>
              ))}
            </div>

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
              <div style={{ marginBottom: '32px' }}>
                <div
                  style={{
                    width: '52px',
                    height: '52px',
                    borderRadius: '16px',
                    background: 'linear-gradient(135deg, #836EF9, #4F7FFF)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '24px',
                    marginBottom: '16px',
                    boxShadow: '0 0 24px rgba(131,110,249,0.4)',
                  }}
                >
                  👤
                </div>
                <h1
                  style={{
                    margin: '0 0 6px',
                    fontSize: '24px',
                    fontWeight: 800,
                    letterSpacing: '-0.5px',
                    color: '#F5F5FF',
                  }}
                >
                  Buat Akun Kamu
                </h1>
                <p style={{ margin: 0, fontSize: '13px', color: '#8B8BAE' }}>
                  Daftarkan wallet address kamu ke platform Nvoin SmartDEX.
                </p>
              </div>

              {/* Wallet Address Display */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '12px 14px',
                  background: 'rgba(34,197,94,0.06)',
                  border: '1px solid rgba(34,197,94,0.18)',
                  borderRadius: '12px',
                  marginBottom: '24px',
                }}
              >
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#22C55E', boxShadow: '0 0 6px #22C55E', flexShrink: 0 }} />
                <div>
                  <div style={{ fontSize: '11px', color: '#8B8BAE', marginBottom: '2px' }}>Wallet Terconnect</div>
                  <div style={{ fontSize: '13px', color: '#22C55E', fontWeight: 600, fontFamily: 'monospace' }}>
                    {shortenAddress(walletAddress)}
                  </div>
                </div>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {/* Username Field */}
                <div>
                  <label
                    htmlFor="register-username"
                    style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#C4C4E0', marginBottom: '8px' }}
                  >
                    Username <span style={{ color: '#EF4444' }}>*</span>
                  </label>

                  <div style={{ position: 'relative' }}>
                    <div
                      style={{
                        position: 'absolute',
                        left: '14px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        fontSize: '13px',
                        color: '#4B4B6E',
                        userSelect: 'none',
                      }}
                    >
                      @
                    </div>
                    <input
                      id="register-username"
                      type="text"
                      className="form-input"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="contoh: trader_monad"
                      autoComplete="off"
                      autoCapitalize="none"
                      spellCheck={false}
                      required
                      style={{
                        width: '100%',
                        padding: '13px 14px 13px 28px',
                        background: 'rgba(255,255,255,0.04)',
                        border: '1px solid rgba(255,255,255,0.10)',
                        borderRadius: '12px',
                        fontSize: '14px',
                        color: '#F5F5FF',
                        fontFamily: 'inherit',
                        transition: 'border-color 0.2s, box-shadow 0.2s',
                      }}
                    />

                    {/* Availability indicator */}
                    {avail && (
                      <div
                        style={{
                          position: 'absolute',
                          right: '12px',
                          top: '50%',
                          transform: 'translateY(-50%)',
                          fontSize: '13px',
                          color: avail.color,
                          fontWeight: 600,
                        }}
                      >
                        {avail.icon}
                      </div>
                    )}
                  </div>

                  {/* Availability message */}
                  {avail && (
                    <div
                      style={{
                        marginTop: '6px',
                        fontSize: '12px',
                        color: avail.color,
                        animation: 'fadeInUp 0.2s ease',
                      }}
                    >
                      {avail.label}
                    </div>
                  )}

                  <div style={{ marginTop: '5px', fontSize: '11px', color: '#4B4B6E' }}>
                    Hanya huruf kecil, angka, dan underscore. 3–30 karakter.
                  </div>
                </div>

                {/* Display Name Field */}
                <div>
                  <label
                    htmlFor="register-display-name"
                    style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#C4C4E0', marginBottom: '8px' }}
                  >
                    Display Name{' '}
                    <span style={{ color: '#4B4B6E', fontWeight: 400 }}>(opsional)</span>
                  </label>
                  <input
                    id="register-display-name"
                    type="text"
                    className="form-input"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    placeholder="Nama tampilan di profil"
                    maxLength={100}
                    style={{
                      width: '100%',
                      padding: '13px 14px',
                      background: 'rgba(255,255,255,0.04)',
                      border: '1px solid rgba(255,255,255,0.10)',
                      borderRadius: '12px',
                      fontSize: '14px',
                      color: '#F5F5FF',
                      fontFamily: 'inherit',
                      transition: 'border-color 0.2s, box-shadow 0.2s',
                    }}
                  />
                </div>

                {/* Submit Error */}
                {submitError && (
                  <div
                    style={{
                      padding: '12px 14px',
                      background: 'rgba(239,68,68,0.08)',
                      border: '1px solid rgba(239,68,68,0.25)',
                      borderRadius: '12px',
                      fontSize: '13px',
                      color: '#EF4444',
                      animation: 'fadeInUp 0.3s ease',
                    }}
                  >
                    ⚠️ {submitError}
                  </div>
                )}

                {/* Submit Button */}
                <button
                  id="register-submit-btn"
                  type="submit"
                  className="submit-btn"
                  disabled={
                    submitting ||
                    !username.trim() ||
                    availability === 'taken' ||
                    availability === 'invalid' ||
                    availability === 'checking'
                  }
                  style={{
                    width: '100%',
                    padding: '15px',
                    background: 'linear-gradient(135deg, #836EF9 0%, #4F7FFF 100%)',
                    border: 'none',
                    borderRadius: '14px',
                    fontSize: '16px',
                    fontWeight: 700,
                    color: '#fff',
                    cursor: 'pointer',
                    fontFamily: 'inherit',
                    letterSpacing: '-0.2px',
                    boxShadow: '0 0 28px rgba(131,110,249,0.35)',
                    transition: 'all 0.3s cubic-bezier(0.34,1.56,0.64,1)',
                    marginTop: '4px',
                  }}
                >
                  {submitting ? '⏳ Mendaftarkan Akun...' : '🚀 Buat Akun & Mulai Trading'}
                </button>
              </form>
            </div>

            {/* Terms note */}
            <p style={{ textAlign: 'center', marginTop: '16px', fontSize: '12px', color: '#4B4B6E', lineHeight: 1.6 }}>
              Dengan membuat akun, kamu setuju dengan{' '}
              <span style={{ color: '#836EF9' }}>Syarat & Ketentuan</span> platform.
              Wallet kamu tetap sepenuhnya dalam kendali kamu.
            </p>

            {/* Back link */}
            <div style={{ textAlign: 'center', marginTop: '12px' }}>
              <Link
                href="/connect"
                style={{ fontSize: '13px', color: '#4B4B6E', textDecoration: 'none' }}
                onMouseEnter={(e) => ((e.currentTarget as HTMLAnchorElement).style.color = '#8B8BAE')}
                onMouseLeave={(e) => ((e.currentTarget as HTMLAnchorElement).style.color = '#4B4B6E')}
              >
                ← Ganti wallet
              </Link>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
