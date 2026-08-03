'use client';

/**
 * components/Navbar.tsx
 *
 * Navbar global yang muncul di semua halaman Nvoin SmartDEX.
 * Menampilkan logo, nav links, network badge, dan status wallet.
 */

import React, { useState } from 'react';
import Link from 'next/link';
import { useWallet } from '@/context/WalletContext';

interface NavLink {
  label: string;
  href: string;
}

const NAV_LINKS: NavLink[] = [
  { label: 'Spot', href: '/trade/spot' },
  { label: 'Bot', href: '/bot/dashboard' },
  { label: 'Strategy', href: '/strategy-builder' },
  { label: 'Backtest', href: '/backtest' },
  { label: 'Launch', href: '/launch' },
];

/** Potong address wallet jadi format pendek: 0x1234...abcd */
function shortenAddress(addr: string): string {
  return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
}

export default function Navbar({ activePath = '' }: { activePath?: string }) {
  const { walletAddress, user, walletType, disconnectWallet } = useWallet();
  const [showDropdown, setShowDropdown] = useState(false);

  const walletIcon = walletType === 'metamask' ? '🦊' : walletType === 'walletconnect' ? '🔗' : '';

  return (
    <nav
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 100,
        background: 'rgba(7,7,26,0.85)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(131,110,249,0.15)',
        padding: '0 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: '64px',
        fontFamily: "'Inter', 'Geist', sans-serif",
      }}
    >
      {/* ── Logo ── */}
      <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '10px' }}>
        <div
          style={{
            width: '32px',
            height: '32px',
            borderRadius: '10px',
            background: 'linear-gradient(135deg, #836EF9, #4F7FFF)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '16px',
            boxShadow: '0 0 16px rgba(131,110,249,0.4)',
          }}
        >
          ⚡
        </div>
        <span style={{ fontWeight: 800, fontSize: '16px', color: '#F5F5FF', letterSpacing: '-0.3px' }}>
          Nvoin<span style={{ color: '#836EF9' }}>DEX</span>
        </span>
      </Link>

      {/* ── Nav Links ── */}
      <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
        {NAV_LINKS.map((link) => {
          const isActive = activePath === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              style={{
                padding: '6px 14px',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: isActive ? 600 : 400,
                color: isActive ? '#836EF9' : '#8B8BAE',
                textDecoration: 'none',
                background: isActive ? 'rgba(131,110,249,0.12)' : 'transparent',
                border: isActive ? '1px solid rgba(131,110,249,0.25)' : '1px solid transparent',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => {
                if (!isActive) {
                  (e.currentTarget as HTMLAnchorElement).style.color = '#C4C4E0';
                  (e.currentTarget as HTMLAnchorElement).style.background = 'rgba(255,255,255,0.04)';
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  (e.currentTarget as HTMLAnchorElement).style.color = '#8B8BAE';
                  (e.currentTarget as HTMLAnchorElement).style.background = 'transparent';
                }
              }}
            >
              {link.label}
            </Link>
          );
        })}
      </div>

      {/* ── Right: Network Badge + Wallet ── */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        {/* Network Badge */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '5px 10px',
            background: 'rgba(131,110,249,0.08)',
            border: '1px solid rgba(131,110,249,0.2)',
            borderRadius: '8px',
            fontSize: '12px',
            color: '#836EF9',
            fontWeight: 600,
          }}
        >
          <div
            style={{
              width: '6px',
              height: '6px',
              borderRadius: '50%',
              background: '#836EF9',
              boxShadow: '0 0 6px #836EF9',
              animation: 'pulse-dot 2s infinite',
            }}
          />
          Monad Testnet
        </div>

        {/* Wallet Button */}
        {walletAddress ? (
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => setShowDropdown((v) => !v)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '7px 14px',
                background: 'rgba(34,197,94,0.08)',
                border: '1px solid rgba(34,197,94,0.25)',
                borderRadius: '10px',
                cursor: 'pointer',
                fontFamily: 'inherit',
                fontSize: '13px',
                color: '#22C55E',
                fontWeight: 600,
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.background = 'rgba(34,197,94,0.13)';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.background = 'rgba(34,197,94,0.08)';
              }}
            >
              <span>{walletIcon}</span>
              <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#22C55E', boxShadow: '0 0 6px #22C55E' }} />
              <span>{user?.username ? `@${user.username}` : shortenAddress(walletAddress)}</span>
              <span style={{ fontSize: '10px', color: '#22C55E', opacity: 0.6 }}>▼</span>
            </button>

            {/* Dropdown */}
            {showDropdown && (
              <div
                style={{
                  position: 'absolute',
                  top: 'calc(100% + 8px)',
                  right: 0,
                  minWidth: '200px',
                  background: 'rgba(10,10,32,0.98)',
                  border: '1px solid rgba(131,110,249,0.2)',
                  borderRadius: '14px',
                  padding: '8px',
                  boxShadow: '0 8px 40px rgba(0,0,0,0.5)',
                  animation: 'scaleIn 0.2s ease',
                  zIndex: 200,
                }}
              >
                {user && (
                  <div
                    style={{
                      padding: '10px 12px 8px',
                      borderBottom: '1px solid rgba(255,255,255,0.06)',
                      marginBottom: '6px',
                    }}
                  >
                    <div style={{ fontSize: '13px', fontWeight: 700, color: '#F5F5FF' }}>
                      {user.display_name || user.username}
                    </div>
                    <div style={{ fontSize: '11px', color: '#8B8BAE', marginTop: '2px' }}>
                      @{user.username}
                    </div>
                    <div style={{ fontSize: '11px', color: '#4B4B6E', marginTop: '3px', fontFamily: 'monospace' }}>
                      {shortenAddress(walletAddress)}
                    </div>
                  </div>
                )}

                <button
                  onClick={() => {
                    disconnectWallet();
                    setShowDropdown(false);
                  }}
                  style={{
                    width: '100%',
                    padding: '9px 12px',
                    background: 'rgba(239,68,68,0.06)',
                    border: '1px solid rgba(239,68,68,0.15)',
                    borderRadius: '9px',
                    cursor: 'pointer',
                    fontFamily: 'inherit',
                    fontSize: '13px',
                    color: '#EF4444',
                    fontWeight: 600,
                    textAlign: 'left',
                    transition: 'all 0.2s ease',
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.background = 'rgba(239,68,68,0.12)';
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.background = 'rgba(239,68,68,0.06)';
                  }}
                >
                  ✕ Putuskan Wallet
                </button>
              </div>
            )}

            {/* Overlay to close dropdown */}
            {showDropdown && (
              <div
                style={{ position: 'fixed', inset: 0, zIndex: 150 }}
                onClick={() => setShowDropdown(false)}
              />
            )}
          </div>
        ) : (
          <Link
            href="/connect"
            style={{
              padding: '8px 18px',
              background: 'linear-gradient(135deg, #836EF9, #4F7FFF)',
              borderRadius: '10px',
              fontSize: '13px',
              fontWeight: 700,
              color: '#fff',
              textDecoration: 'none',
              boxShadow: '0 0 20px rgba(131,110,249,0.3)',
              transition: 'all 0.3s ease',
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.boxShadow = '0 0 32px rgba(131,110,249,0.55)';
              (e.currentTarget as HTMLAnchorElement).style.transform = 'translateY(-1px)';
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.boxShadow = '0 0 20px rgba(131,110,249,0.3)';
              (e.currentTarget as HTMLAnchorElement).style.transform = 'translateY(0)';
            }}
          >
            🔌 Hubungkan Wallet
          </Link>
        )}
      </div>
    </nav>
  );
}
