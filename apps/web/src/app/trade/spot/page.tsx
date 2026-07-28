/**
 * app/trade/spot/page.tsx
 *
 * Halaman Spot Trading — Nvoin SmartDEX
 *
 * Layout:
 * ┌─────────────────────────────────────────────────────────┐
 * │  Navbar (Logo + Nav Links + Network Badge)              │
 * ├────────────────────────────┬────────────────────────────┤
 * │  Kiri: Info Market         │  Kanan: Swap Card          │
 * │  - Header pair MON/USDC   │  - SpotSwapCard            │
 * │  - Stats (Vol, Liq, Txn)  │  - Pool Info               │
 * │  - Chart (SVG mock)        │                            │
 * │  - Recent Trades           │                            │
 * └────────────────────────────┴────────────────────────────┘
 */

import type { Metadata } from 'next';
import SpotSwapCard from '@/components/SpotSwapCard';

export const metadata: Metadata = {
  title: 'Spot Trading — Nvoin SmartDEX',
  description:
    'Trade token MON/USDC secara langsung di Nvoin SmartDEX. Swap cepat, aman, dan terdesentralisasi di blockchain Monad.',
};

// ============================================================
// Data Mock untuk tampilan (akan diganti data real nantinya)
// ============================================================

const STATS = [
  { label: '24h Volume', value: '$2.4M', change: '+12.5%', positive: true },
  { label: 'Liquidity', value: '$750K', change: '+3.2%', positive: true },
  { label: 'Total Txn', value: '1,240', change: '-2.1%', positive: false },
];

const RECENT_TRADES = [
  { amount: '500 MON', price: '$0.4997', time: '2 min lalu', type: 'buy' },
  { amount: '1,200 MON', price: '$0.5002', time: '5 min lalu', type: 'sell' },
  { amount: '300 MON', price: '$0.4995', time: '8 min lalu', type: 'buy' },
  { amount: '780 MON', price: '$0.5010', time: '12 min lalu', type: 'sell' },
  { amount: '2,000 MON', price: '$0.4988', time: '18 min lalu', type: 'sell' },
];

const NAV_LINKS = [
  { label: 'Spot', href: '/trade/spot', active: true },
  { label: 'Bot', href: '/bot/dashboard', active: false },
  { label: 'Strategy', href: '/strategy-builder', active: false },
  { label: 'Backtest', href: '/backtest', active: false },
  { label: 'Launch', href: '/launch', active: false },
];

// ============================================================
// Page Component
// ============================================================

export default function SpotTradePage() {
  return (
    <main
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(160deg, #07071A 0%, #0E0A2E 45%, #07071A 100%)',
        fontFamily: "'Inter', 'Geist', sans-serif",
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* ── Animasi & Font ── */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');

        * { box-sizing: border-box; }

        /* Hilangkan spinner di number input */
        input[type=number]::-webkit-inner-spin-button,
        input[type=number]::-webkit-outer-spin-button { -webkit-appearance: none; margin: 0; }
        input[type=number] { -moz-appearance: textfield; }

        /* Keyframe Animations */
        @keyframes shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.92); }
          to { opacity: 1; transform: scale(1); }
        }
        @keyframes pulse-dot {
          0%, 100% { opacity: 1; box-shadow: 0 0 6px #836EF9; }
          50% { opacity: 0.5; box-shadow: 0 0 14px #836EF9; }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-6px); }
        }

        /* Spot input: glowing border saat focus */
        .spot-input-wrap:focus-within {
          border-color: rgba(131, 110, 249, 0.50) !important;
          background: rgba(131, 110, 249, 0.04) !important;
        }

        /* Nav link hover */
        .nav-link:hover {
          color: #C4B5FD !important;
          background: rgba(131,110,249,0.08) !important;
        }

        /* Scrollbar custom */
        ::-webkit-scrollbar { width: 6px; height: 6px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(131,110,249,0.3); border-radius: 3px; }
        ::-webkit-scrollbar-thumb:hover { background: rgba(131,110,249,0.5); }
      `}</style>

      {/* ── Dekorasi: Grid Background ── */}
      <div
        aria-hidden="true"
        style={{
          position: 'fixed',
          inset: 0,
          backgroundImage:
            'linear-gradient(rgba(131,110,249,0.035) 1px, transparent 1px),' +
            'linear-gradient(90deg, rgba(131,110,249,0.035) 1px, transparent 1px)',
          backgroundSize: '44px 44px',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />

      {/* ── Dekorasi: Glow Orbs ── */}
      <div
        aria-hidden="true"
        style={{
          position: 'fixed',
          top: '5%',
          left: '8%',
          width: '500px',
          height: '500px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(131,110,249,0.07) 0%, transparent 70%)',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />
      <div
        aria-hidden="true"
        style={{
          position: 'fixed',
          bottom: '5%',
          right: '8%',
          width: '420px',
          height: '420px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(79,127,255,0.06) 0%, transparent 70%)',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />

      {/* ── Navbar ── */}
      <nav
        style={{
          position: 'relative',
          zIndex: 20,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 40px',
          height: '64px',
          borderBottom: '1px solid rgba(255,255,255,0.07)',
          background: 'rgba(7,7,26,0.85)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
        }}
      >
        {/* Logo + Links */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
          {/* Logo */}
          <a
            href="/"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              textDecoration: 'none',
            }}
          >
            <div
              style={{
                width: '34px',
                height: '34px',
                borderRadius: '10px',
                background: 'linear-gradient(135deg, #836EF9, #4F7FFF)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '18px',
                boxShadow: '0 0 16px rgba(131,110,249,0.4)',
                animation: 'float 3s ease-in-out infinite',
              }}
            >
              ⚡
            </div>
            <span
              style={{
                fontSize: '18px',
                fontWeight: 800,
                color: '#F5F5FF',
                letterSpacing: '-0.5px',
                whiteSpace: 'nowrap',
              }}
            >
              Nvoin{' '}
              <span style={{ color: '#836EF9' }}>SmartDEX</span>
            </span>
          </a>

          {/* Nav Links */}
          <div style={{ display: 'flex', gap: '4px' }}>
            {NAV_LINKS.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="nav-link"
                style={{
                  padding: '7px 16px',
                  borderRadius: '10px',
                  fontSize: '14px',
                  fontWeight: 600,
                  textDecoration: 'none',
                  color: item.active ? '#A78BFA' : '#8B8BAE',
                  background: item.active ? 'rgba(131,110,249,0.14)' : 'transparent',
                  border: item.active
                    ? '1px solid rgba(131,110,249,0.28)'
                    : '1px solid transparent',
                  transition: 'all 0.2s ease',
                }}
              >
                {item.label}
              </a>
            ))}
          </div>
        </div>

        {/* Network Badge */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            background: 'rgba(131,110,249,0.10)',
            border: '1px solid rgba(131,110,249,0.22)',
            borderRadius: '10px',
            padding: '8px 16px',
          }}
        >
          <div
            style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              background: '#836EF9',
              animation: 'pulse-dot 2s ease-in-out infinite',
            }}
          />
          <span style={{ fontSize: '13px', fontWeight: 600, color: '#836EF9' }}>
            Monad Testnet
          </span>
        </div>
      </nav>

      {/* ── Breadcrumb ── */}
      <div
        style={{
          position: 'relative',
          zIndex: 10,
          padding: '12px 40px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          fontSize: '13px',
        }}
      >
        <a href="/" style={{ color: '#8B8BAE', textDecoration: 'none' }}>Home</a>
        <span style={{ color: '#4A4A6A' }}>›</span>
        <a href="/trade" style={{ color: '#8B8BAE', textDecoration: 'none' }}>Trade</a>
        <span style={{ color: '#4A4A6A' }}>›</span>
        <span style={{ color: '#A78BFA', fontWeight: 600 }}>Spot</span>
      </div>

      {/* ── Main Content ── */}
      <div
        style={{
          position: 'relative',
          zIndex: 10,
          display: 'flex',
          gap: '28px',
          padding: '12px 40px 60px',
          maxWidth: '1320px',
          margin: '0 auto',
          alignItems: 'flex-start',
        }}
      >
        {/* ──────────────────────────────────────────────────── */}
        {/* Panel KIRI: Informasi Market                         */}
        {/* ──────────────────────────────────────────────────── */}
        <div
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            gap: '20px',
            minWidth: 0,
          }}
        >
          {/* ── Pair Header Card ── */}
          <div
            style={{
              background: 'rgba(10,10,32,0.88)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(131,110,249,0.15)',
              borderRadius: '20px',
              padding: '24px',
              animation: 'fadeInUp 0.4s ease',
            }}
          >
            {/* Pair Info */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
                marginBottom: '20px',
              }}
            >
              {/* Token Pair Icons */}
              <div style={{ position: 'relative', width: '56px', height: '34px', flexShrink: 0 }}>
                <div
                  style={{
                    width: '34px',
                    height: '34px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #836EF9, #836EF999)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 800,
                    color: '#fff',
                    fontSize: '14px',
                    position: 'absolute',
                    left: 0,
                    zIndex: 2,
                    border: '2px solid rgba(10,10,32,0.88)',
                    boxShadow: '0 0 10px rgba(131,110,249,0.4)',
                  }}
                >
                  M
                </div>
                <div
                  style={{
                    width: '34px',
                    height: '34px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #2775CA, #2775CA99)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 800,
                    color: '#fff',
                    fontSize: '14px',
                    position: 'absolute',
                    left: '22px',
                    zIndex: 1,
                    border: '2px solid rgba(10,10,32,0.88)',
                  }}
                >
                  U
                </div>
              </div>

              {/* Pair Name */}
              <div>
                <h1
                  style={{
                    margin: 0,
                    fontSize: '22px',
                    fontWeight: 800,
                    color: '#F5F5FF',
                    letterSpacing: '-0.5px',
                  }}
                >
                  MON / USDC
                </h1>
                <p style={{ margin: '2px 0 0 0', fontSize: '13px', color: '#8B8BAE' }}>
                  Monad · USD Coin · Monad Testnet
                </p>
              </div>

              {/* Change Badge */}
              <div
                style={{
                  marginLeft: 'auto',
                  background: 'rgba(34,197,94,0.10)',
                  border: '1px solid rgba(34,197,94,0.25)',
                  borderRadius: '8px',
                  padding: '5px 12px',
                  fontSize: '13px',
                  fontWeight: 700,
                  color: '#22C55E',
                }}
              >
                ▲ +2.34%
              </div>
            </div>

            {/* Harga Saat Ini */}
            <div style={{ marginBottom: '22px' }}>
              <div
                style={{
                  fontSize: '38px',
                  fontWeight: 900,
                  color: '#F5F5FF',
                  letterSpacing: '-1.5px',
                  lineHeight: 1,
                }}
              >
                $0.5000
              </div>
              <div style={{ fontSize: '14px', color: '#8B8BAE', marginTop: '6px' }}>
                1 MON = 0.5000 USDC{' '}
                <span style={{ color: '#22C55E', marginLeft: '8px' }}>+$0.0114 hari ini</span>
              </div>
            </div>

            {/* Stats Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
              {STATS.map((stat) => (
                <div
                  key={stat.label}
                  style={{
                    background: 'rgba(255,255,255,0.03)',
                    border: '1px solid rgba(255,255,255,0.07)',
                    borderRadius: '12px',
                    padding: '12px',
                    textAlign: 'center',
                  }}
                >
                  <div style={{ fontSize: '11px', color: '#8B8BAE', marginBottom: '5px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    {stat.label}
                  </div>
                  <div style={{ fontSize: '17px', fontWeight: 800, color: '#F5F5FF' }}>
                    {stat.value}
                  </div>
                  <div
                    style={{
                      fontSize: '11px',
                      marginTop: '3px',
                      color: stat.positive ? '#22C55E' : '#EF4444',
                      fontWeight: 600,
                    }}
                  >
                    {stat.change}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ── Price Chart Card (SVG Mock) ── */}
          <div
            style={{
              background: 'rgba(10,10,32,0.88)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(131,110,249,0.15)',
              borderRadius: '20px',
              padding: '24px',
              animation: 'fadeInUp 0.5s ease',
            }}
          >
            {/* Chart Header */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '16px',
              }}
            >
              <div>
                <h2 style={{ margin: 0, fontSize: '15px', fontWeight: 700, color: '#F5F5FF' }}>
                  Price Chart
                </h2>
                <div style={{ fontSize: '12px', color: '#8B8BAE', marginTop: '2px' }}>
                  MON/USDC · Harga historis (mock data)
                </div>
              </div>
              <div style={{ display: 'flex', gap: '4px' }}>
                {['1H', '4H', '1D', '1W'].map((tf, i) => (
                  <button
                    key={tf}
                    style={{
                      padding: '5px 12px',
                      borderRadius: '7px',
                      border: 'none',
                      cursor: 'pointer',
                      fontFamily: 'inherit',
                      fontSize: '12px',
                      fontWeight: 700,
                      background: i === 2 ? 'rgba(131,110,249,0.18)' : 'transparent',
                      color: i === 2 ? '#A78BFA' : '#8B8BAE',
                      transition: 'all 0.2s',
                    }}
                  >
                    {tf}
                  </button>
                ))}
              </div>
            </div>

            {/* SVG Chart */}
            <div style={{ position: 'relative', height: '180px' }}>
              <svg
                width="100%"
                height="180"
                viewBox="0 0 600 180"
                preserveAspectRatio="none"
                aria-label="MON/USDC price chart"
              >
                <defs>
                  <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#836EF9" stopOpacity="0.35" />
                    <stop offset="100%" stopColor="#836EF9" stopOpacity="0" />
                  </linearGradient>
                  <linearGradient id="lineGrad" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#4F7FFF" />
                    <stop offset="100%" stopColor="#836EF9" />
                  </linearGradient>
                </defs>

                {/* Grid lines */}
                {[40, 80, 120, 160].map((y) => (
                  <line
                    key={y}
                    x1="0" y1={y} x2="600" y2={y}
                    stroke="rgba(255,255,255,0.04)"
                    strokeWidth="1"
                  />
                ))}

                {/* Chart Area Fill */}
                <path
                  d="M0,140 C40,130 70,150 110,125 C150,100 180,160 220,118
                     C260,76 290,108 330,85 C370,62 400,90 440,68
                     C470,50 510,62 550,40 C568,30 585,34 600,28
                     L600,180 L0,180 Z"
                  fill="url(#chartGrad)"
                />

                {/* Chart Line */}
                <path
                  d="M0,140 C40,130 70,150 110,125 C150,100 180,160 220,118
                     C260,76 290,108 330,85 C370,62 400,90 440,68
                     C470,50 510,62 550,40 C568,30 585,34 600,28"
                  fill="none"
                  stroke="url(#lineGrad)"
                  strokeWidth="2.5"
                  vectorEffect="non-scaling-stroke"
                />

                {/* Titik terakhir (harga sekarang) */}
                <circle cx="600" cy="28" r="5" fill="#836EF9" opacity="0.9" />
                <circle cx="600" cy="28" r="10" fill="#836EF9" opacity="0.2" />
              </svg>

              {/* Label harga Y-axis */}
              <div
                style={{
                  position: 'absolute',
                  top: 0,
                  right: 0,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  height: '100%',
                  paddingBottom: '8px',
                }}
              >
                {['$0.52', '$0.51', '$0.50', '$0.49', '$0.48'].map((p) => (
                  <span key={p} style={{ fontSize: '10px', color: '#4A4A6A' }}>{p}</span>
                ))}
              </div>
            </div>
          </div>

          {/* ── Recent Trades Card ── */}
          <div
            style={{
              background: 'rgba(10,10,32,0.88)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(131,110,249,0.15)',
              borderRadius: '20px',
              padding: '24px',
              animation: 'fadeInUp 0.6s ease',
            }}
          >
            <h2
              style={{
                margin: '0 0 16px 0',
                fontSize: '15px',
                fontWeight: 700,
                color: '#F5F5FF',
              }}
            >
              Recent Trades
            </h2>

            {/* Header tabel */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr 1fr',
                marginBottom: '10px',
              }}
            >
              {['Jumlah', 'Harga', 'Waktu'].map((h) => (
                <span
                  key={h}
                  style={{
                    fontSize: '11px',
                    color: '#8B8BAE',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                    textAlign: h === 'Harga' ? 'center' : h === 'Waktu' ? 'right' : 'left',
                  }}
                >
                  {h}
                </span>
              ))}
            </div>

            {/* Baris trade */}
            {RECENT_TRADES.map((trade, i) => (
              <div
                key={i}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr 1fr',
                  alignItems: 'center',
                  padding: '10px 0',
                  borderTop: i > 0 ? '1px solid rgba(255,255,255,0.05)' : 'none',
                }}
              >
                <span
                  style={{
                    fontSize: '13px',
                    fontWeight: 700,
                    color: trade.type === 'buy' ? '#22C55E' : '#EF4444',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                  }}
                >
                  <span style={{ fontSize: '9px' }}>
                    {trade.type === 'buy' ? '▲' : '▼'}
                  </span>
                  {trade.amount}
                </span>
                <span
                  style={{
                    fontSize: '13px',
                    color: '#C4C4E0',
                    textAlign: 'center',
                    fontWeight: 500,
                  }}
                >
                  {trade.price}
                </span>
                <span
                  style={{
                    fontSize: '12px',
                    color: '#8B8BAE',
                    textAlign: 'right',
                  }}
                >
                  {trade.time}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* ──────────────────────────────────────────────────── */}
        {/* Panel KANAN: Swap Card + Pool Info                  */}
        {/* ──────────────────────────────────────────────────── */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '20px',
            width: '480px',
            flexShrink: 0,
          }}
        >
          {/* Swap Card Utama */}
          <div style={{ animation: 'fadeInUp 0.4s ease' }}>
            <SpotSwapCard />
          </div>

          {/* Pool Info Card */}
          <div
            style={{
              background: 'rgba(10,10,32,0.88)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(131,110,249,0.15)',
              borderRadius: '20px',
              padding: '22px 24px',
              animation: 'fadeInUp 0.5s ease',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
              <h2
                style={{
                  margin: 0,
                  fontSize: '13px',
                  fontWeight: 700,
                  color: '#8B8BAE',
                  textTransform: 'uppercase',
                  letterSpacing: '0.8px',
                }}
              >
                Pool Info
              </h2>
              <span
                style={{
                  background: 'rgba(245,158,11,0.12)',
                  border: '1px solid rgba(245,158,11,0.25)',
                  borderRadius: '5px',
                  padding: '2px 7px',
                  fontSize: '10px',
                  color: '#F59E0B',
                  fontWeight: 700,
                }}
              >
                MOCK
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {[
                {
                  label: 'MON Reserve',
                  value: '500,000 MON',
                  color: '#836EF9',
                },
                {
                  label: 'USDC Reserve',
                  value: '250,000 USDC',
                  color: '#2775CA',
                },
                { label: 'LP Fee', value: '0.3%', color: '#C4C4E0' },
                { label: 'Formula', value: 'x · y = k (AMM)', color: '#C4C4E0' },
                { label: 'Smart Contract', value: 'SmartDEX.sol', color: '#C4C4E0' },
              ].map((item) => (
                <div
                  key={item.label}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <span style={{ fontSize: '13px', color: '#8B8BAE' }}>{item.label}</span>
                  <span
                    style={{
                      fontSize: '13px',
                      color: item.color,
                      fontWeight: 600,
                    }}
                  >
                    {item.value}
                  </span>
                </div>
              ))}
            </div>

            {/* Catatan */}
            <div
              style={{
                marginTop: '16px',
                padding: '10px 12px',
                background: 'rgba(245,158,11,0.06)',
                border: '1px solid rgba(245,158,11,0.15)',
                borderRadius: '10px',
                fontSize: '12px',
                color: '#A0895A',
                lineHeight: 1.5,
              }}
            >
              ⚠️ Reserve saat ini adalah nilai hardcoded untuk testing.
              Dalam produksi, data ini akan diambil langsung dari Smart Contract di Monad.
            </div>
          </div>

          {/* Tips Card */}
          <div
            style={{
              background: 'rgba(131,110,249,0.05)',
              border: '1px solid rgba(131,110,249,0.15)',
              borderRadius: '16px',
              padding: '16px 20px',
              animation: 'fadeInUp 0.6s ease',
            }}
          >
            <div style={{ fontSize: '13px', fontWeight: 700, color: '#A78BFA', marginBottom: '8px' }}>
              💡 Tips Trading
            </div>
            <ul style={{ margin: 0, padding: '0 0 0 16px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {[
                'Price impact < 1% itu aman, di atas 3% hati-hati!',
                'Fee 0.3% otomatis dipotong dari setiap swap.',
                'Selalu cek "Minimum Diterima" sebelum konfirmasi.',
              ].map((tip) => (
                <li key={tip} style={{ fontSize: '12px', color: '#8B8BAE', lineHeight: 1.5 }}>
                  {tip}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </main>
  );
}
