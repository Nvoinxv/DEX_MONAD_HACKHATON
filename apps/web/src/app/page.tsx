'use client';

/**
 * app/page.tsx
 *
 * Landing Page — Nvoin SmartDEX
 *
 * Halaman pertama yang dilihat user. Menampilkan:
 *  - Hero section dengan branding & CTA
 *  - Feature highlights (6 fitur utama)
 *  - Stats platform (mock)
 *  - Navbar global
 */

import React from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';

// ─────────────────────────────────────────────
// Data
// ─────────────────────────────────────────────

const FEATURES = [
  {
    icon: '🔄',
    title: 'Smart DEX',
    subtitle: 'Spot Trading',
    desc: 'Swap token MON/USDC langsung on-chain di Monad. Latensi rendah, biaya minimal, eksekusi transparan.',
    color: '#836EF9',
    href: '/trade/spot',
  },
  {
    icon: '🤖',
    title: 'Trading Bot',
    subtitle: 'Otomatis 24/7',
    desc: 'Jalankan bot trading tanpa harus terus memantau chart. Set strategi sekali, biarkan bot bekerja.',
    color: '#4F7FFF',
    href: '/bot/dashboard',
  },
  {
    icon: '🧩',
    title: 'Strategy Builder',
    subtitle: 'No-Code',
    desc: 'Bangun logika trading visual — gabungkan RSI, EMA, dan indikator lain tanpa satu baris kode.',
    color: '#22C55E',
    href: '/strategy-builder',
  },
  {
    icon: '📊',
    title: 'Backtesting',
    subtitle: 'Uji Strategi',
    desc: 'Test strategi di data historis sebelum pakai uang sungguhan. Lihat P&L, win rate, dan drawdown.',
    color: '#F59E0B',
    href: '/backtest',
  },
  {
    icon: '🚀',
    title: 'One-Click Deploy',
    subtitle: 'Deploy Instan',
    desc: 'Setelah strategi siap, klik satu tombol dan bot langsung jalan. Tanpa terminal, tanpa scripting.',
    color: '#EF4444',
    href: '/bot/new',
  },
  {
    icon: '🪙',
    title: 'Token Launch',
    subtitle: 'Luncurkan Token',
    desc: 'Deploy token ERC-20 kamu sendiri di Monad dengan antarmuka yang ramah pemula.',
    color: '#EC4899',
    href: '/launch',
  },
];

const STATS = [
  { label: 'Total Volume', value: '$2.4M', change: '+12.5%', up: true },
  { label: 'Liquidity Pool', value: '$750K', change: '+3.2%', up: true },
  { label: 'Bot Aktif', value: '128', change: '+8', up: true },
  { label: 'Strategi Dibuat', value: '342', change: '+24', up: true },
];

// ─────────────────────────────────────────────
// Page Component
// ─────────────────────────────────────────────

export default function LandingPage() {
  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(160deg, #07071A 0%, #0D0A2E 50%, #07071A 100%)',
        fontFamily: "'Inter', 'Geist', sans-serif",
        color: '#F5F5FF',
        overflowX: 'hidden',
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');
        * { box-sizing: border-box; }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulse-dot {
          0%, 100% { opacity: 1; box-shadow: 0 0 6px #836EF9; }
          50% { opacity: 0.5; box-shadow: 0 0 14px #836EF9; }
        }
        @keyframes shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
        @keyframes orb-spin {
          0% { transform: rotate(0deg) translateX(120px) rotate(0deg); }
          100% { transform: rotate(360deg) translateX(120px) rotate(-360deg); }
        }
        .feature-card:hover {
          transform: translateY(-6px) !important;
          border-color: rgba(131,110,249,0.4) !important;
        }
        .cta-btn:hover {
          transform: translateY(-3px) !important;
          box-shadow: 0 0 50px rgba(131,110,249,0.65) !important;
        }
      `}</style>

      {/* ── Navbar ── */}
      <Navbar activePath="/" />

      {/* ── Background Decoration ── */}
      <div
        style={{
          position: 'fixed',
          inset: 0,
          pointerEvents: 'none',
          zIndex: 0,
          overflow: 'hidden',
        }}
      >
        {/* Glow utama */}
        <div
          style={{
            position: 'absolute',
            top: '10%',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '700px',
            height: '700px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(131,110,249,0.08) 0%, transparent 70%)',
          }}
        />
        {/* Glow kiri */}
        <div
          style={{
            position: 'absolute',
            top: '40%',
            left: '-10%',
            width: '400px',
            height: '400px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(79,127,255,0.06) 0%, transparent 70%)',
          }}
        />
        {/* Glow kanan */}
        <div
          style={{
            position: 'absolute',
            top: '20%',
            right: '-10%',
            width: '400px',
            height: '400px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(131,110,249,0.06) 0%, transparent 70%)',
          }}
        />
      </div>

      {/* ── Hero Section ── */}
      <section
        style={{
          position: 'relative',
          zIndex: 1,
          textAlign: 'center',
          padding: '100px 24px 80px',
          maxWidth: '900px',
          margin: '0 auto',
        }}
      >
        {/* Badge */}
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '6px 16px',
            background: 'rgba(131,110,249,0.10)',
            border: '1px solid rgba(131,110,249,0.25)',
            borderRadius: '100px',
            fontSize: '13px',
            color: '#836EF9',
            fontWeight: 600,
            marginBottom: '32px',
            animation: 'fadeInUp 0.6s ease',
          }}
        >
          <div
            style={{
              width: '6px',
              height: '6px',
              borderRadius: '50%',
              background: '#836EF9',
              animation: 'pulse-dot 2s infinite',
            }}
          />
          Dibangun untuk Monad Hackathon
        </div>

        {/* Headline */}
        <h1
          style={{
            fontSize: 'clamp(40px, 7vw, 80px)',
            fontWeight: 900,
            letterSpacing: '-2px',
            lineHeight: 1.05,
            margin: '0 0 24px',
            animation: 'fadeInUp 0.7s ease 0.1s both',
          }}
        >
          Trading Otomatis
          <br />
          <span
            style={{
              background: 'linear-gradient(135deg, #836EF9 0%, #4F7FFF 50%, #836EF9 100%)',
              backgroundSize: '200% auto',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              animation: 'shimmer 4s linear infinite',
            }}
          >
            Tanpa Kode
          </span>
        </h1>

        {/* Subtitle */}
        <p
          style={{
            fontSize: '18px',
            color: '#8B8BAE',
            lineHeight: 1.7,
            maxWidth: '580px',
            margin: '0 auto 48px',
            animation: 'fadeInUp 0.7s ease 0.2s both',
          }}
        >
          Bangun strategi trading visual, uji di data historis, dan deploy bot 24/7 di
          Monad — tanpa terminal, tanpa programming.
        </p>

        {/* CTA Buttons */}
        <div
          style={{
            display: 'flex',
            gap: '16px',
            justifyContent: 'center',
            flexWrap: 'wrap',
            animation: 'fadeInUp 0.7s ease 0.3s both',
          }}
        >
          <Link
            href="/connect"
            className="cta-btn"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '16px 36px',
              background: 'linear-gradient(135deg, #836EF9 0%, #4F7FFF 100%)',
              borderRadius: '14px',
              fontSize: '16px',
              fontWeight: 700,
              color: '#fff',
              textDecoration: 'none',
              boxShadow: '0 0 32px rgba(131,110,249,0.4)',
              transition: 'all 0.3s cubic-bezier(0.34,1.56,0.64,1)',
            }}
          >
            🚀 Mulai Sekarang
          </Link>

          <Link
            href="/trade/spot"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '16px 36px',
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.12)',
              borderRadius: '14px',
              fontSize: '16px',
              fontWeight: 600,
              color: '#C4C4E0',
              textDecoration: 'none',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.background = 'rgba(255,255,255,0.08)';
              (e.currentTarget as HTMLAnchorElement).style.color = '#F5F5FF';
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.background = 'rgba(255,255,255,0.04)';
              (e.currentTarget as HTMLAnchorElement).style.color = '#C4C4E0';
            }}
          >
            🔄 Coba Spot Trading
          </Link>
        </div>

        {/* Floating badge stats */}
        <div
          style={{
            display: 'flex',
            gap: '12px',
            justifyContent: 'center',
            marginTop: '48px',
            flexWrap: 'wrap',
            animation: 'fadeInUp 0.7s ease 0.4s both',
          }}
        >
          {STATS.map((s) => (
            <div
              key={s.label}
              style={{
                padding: '10px 18px',
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.07)',
                borderRadius: '12px',
                textAlign: 'center',
              }}
            >
              <div style={{ fontSize: '18px', fontWeight: 800, color: '#F5F5FF' }}>
                {s.value}
              </div>
              <div style={{ fontSize: '11px', color: '#8B8BAE', marginTop: '2px' }}>
                {s.label}
              </div>
              <div style={{ fontSize: '11px', color: s.up ? '#22C55E' : '#EF4444', marginTop: '1px', fontWeight: 600 }}>
                {s.change}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Features Grid ── */}
      <section
        style={{
          position: 'relative',
          zIndex: 1,
          maxWidth: '1100px',
          margin: '0 auto',
          padding: '0 24px 120px',
        }}
      >
        {/* Section Header */}
        <div style={{ textAlign: 'center', marginBottom: '60px' }}>
          <h2
            style={{
              fontSize: '36px',
              fontWeight: 800,
              letterSpacing: '-1px',
              color: '#F5F5FF',
              margin: '0 0 12px',
            }}
          >
            Semua yang Kamu Butuhkan
          </h2>
          <p style={{ fontSize: '15px', color: '#8B8BAE', margin: 0 }}>
            Dari trading manual hingga bot otomatis — semuanya dalam satu platform.
          </p>
        </div>

        {/* Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '20px',
          }}
        >
          {FEATURES.map((f) => (
            <Link
              key={f.title}
              href={f.href}
              className="feature-card"
              style={{
                display: 'block',
                padding: '28px',
                background: 'rgba(10,10,32,0.7)',
                border: '1px solid rgba(255,255,255,0.07)',
                borderRadius: '20px',
                textDecoration: 'none',
                transition: 'all 0.3s cubic-bezier(0.34,1.56,0.64,1)',
                backdropFilter: 'blur(12px)',
                WebkitBackdropFilter: 'blur(12px)',
                cursor: 'pointer',
              }}
            >
              {/* Icon */}
              <div
                style={{
                  width: '52px',
                  height: '52px',
                  borderRadius: '14px',
                  background: `${f.color}18`,
                  border: `1px solid ${f.color}30`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '26px',
                  marginBottom: '18px',
                }}
              >
                {f.icon}
              </div>

              {/* Title + Subtitle */}
              <div style={{ marginBottom: '10px' }}>
                <div style={{ fontSize: '18px', fontWeight: 700, color: '#F5F5FF', marginBottom: '3px' }}>
                  {f.title}
                </div>
                <div
                  style={{
                    display: 'inline-block',
                    padding: '2px 9px',
                    background: `${f.color}18`,
                    border: `1px solid ${f.color}30`,
                    borderRadius: '6px',
                    fontSize: '11px',
                    fontWeight: 600,
                    color: f.color,
                  }}
                >
                  {f.subtitle}
                </div>
              </div>

              {/* Description */}
              <p
                style={{
                  fontSize: '14px',
                  color: '#8B8BAE',
                  lineHeight: 1.6,
                  margin: 0,
                }}
              >
                {f.desc}
              </p>
            </Link>
          ))}
        </div>
      </section>

      {/* ── Footer CTA ── */}
      <section
        style={{
          position: 'relative',
          zIndex: 1,
          textAlign: 'center',
          padding: '80px 24px 120px',
          borderTop: '1px solid rgba(255,255,255,0.05)',
        }}
      >
        <div
          style={{
            maxWidth: '600px',
            margin: '0 auto',
            padding: '60px 40px',
            background: 'rgba(131,110,249,0.06)',
            border: '1px solid rgba(131,110,249,0.15)',
            borderRadius: '28px',
          }}
        >
          <div style={{ fontSize: '48px', marginBottom: '20px', animation: 'float 3s ease-in-out infinite' }}>
            ⚡
          </div>
          <h2 style={{ fontSize: '32px', fontWeight: 800, letterSpacing: '-1px', color: '#F5F5FF', margin: '0 0 12px' }}>
            Siap Mulai Trading?
          </h2>
          <p style={{ fontSize: '15px', color: '#8B8BAE', margin: '0 0 32px', lineHeight: 1.6 }}>
            Hubungkan wallet kamu dan mulai membangun strategi trading pertamamu di Monad — gratis.
          </p>
          <Link
            href="/connect"
            className="cta-btn"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '16px 40px',
              background: 'linear-gradient(135deg, #836EF9 0%, #4F7FFF 100%)',
              borderRadius: '14px',
              fontSize: '16px',
              fontWeight: 700,
              color: '#fff',
              textDecoration: 'none',
              boxShadow: '0 0 32px rgba(131,110,249,0.35)',
              transition: 'all 0.3s cubic-bezier(0.34,1.56,0.64,1)',
            }}
          >
            🔌 Hubungkan Wallet Sekarang
          </Link>
        </div>

        {/* Bottom label */}
        <p style={{ marginTop: '40px', fontSize: '13px', color: '#4B4B6E' }}>
          Dibangun dengan ❤️ untuk Monad Hackathon · Non-custodial · Open Source
        </p>
      </section>
    </div>
  );
}
