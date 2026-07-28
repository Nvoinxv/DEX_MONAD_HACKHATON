'use client';

/**
 * components/TokenAmountInput.tsx
 *
 * "Kotak Input Pintar" — Komponen input token yang lebih keren dari biasa.
 * Menampilkan: badge nama token, field input angka, dan saldo wallet.
 *
 * Props:
 * - label: teks kecil di atas (misal: "Kamu Kirim" / "Kamu Terima")
 * - token: info token (symbol, warna)
 * - value: nilai input saat ini
 * - onChange: callback saat user mengetik (tidak ada kalau readOnly)
 * - readOnly: kalau true, field tidak bisa diedit (untuk output)
 * - balance: saldo wallet yang ditampilkan
 * - loading: kalau true, tampilkan skeleton loader
 */

import React from 'react';
import { TokenInfo } from '@/hooks/useSpotQuote';

interface TokenAmountInputProps {
  label: string;
  token: TokenInfo;
  value: string;
  onChange?: (value: string) => void;
  readOnly?: boolean;
  balance?: string;
  loading?: boolean;
}

export default function TokenAmountInput({
  label,
  token,
  value,
  onChange,
  readOnly = false,
  balance = '0.00',
  loading = false,
}: TokenAmountInputProps) {
  return (
    <div
      className={readOnly ? '' : 'spot-input-wrap'}
      style={{
        background: 'rgba(255,255,255,0.04)',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: '16px',
        padding: '16px 20px',
        transition: 'border-color 0.2s, background 0.2s',
      }}
    >
      {/* Label dan Saldo */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '12px',
        }}
      >
        <span style={{ fontSize: '12px', color: '#8B8BAE', fontWeight: 500, letterSpacing: '0.3px' }}>
          {label}
        </span>
        <span style={{ fontSize: '12px', color: '#8B8BAE' }}>
          Saldo:{' '}
          <span style={{ color: '#C4C4E0', fontWeight: 600 }}>
            {balance} {token.symbol}
          </span>
        </span>
      </div>

      {/* Token Badge + Input */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        {/* Token Badge */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            background: 'rgba(255,255,255,0.06)',
            border: '1px solid rgba(255,255,255,0.10)',
            borderRadius: '12px',
            padding: '8px 14px',
            flexShrink: 0,
            minWidth: 'fit-content',
          }}
        >
          {/* Avatar Token */}
          <div
            style={{
              width: '26px',
              height: '26px',
              borderRadius: '50%',
              background: `linear-gradient(135deg, ${token.color}, ${token.color}99)`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '11px',
              fontWeight: 800,
              color: '#fff',
              flexShrink: 0,
              boxShadow: `0 0 8px ${token.color}44`,
            }}
          >
            {token.symbol[0]}
          </div>
          <div>
            <div style={{ fontWeight: 700, color: '#F5F5FF', fontSize: '16px', lineHeight: 1 }}>
              {token.symbol}
            </div>
            <div style={{ fontSize: '10px', color: '#8B8BAE', lineHeight: 1, marginTop: '2px' }}>
              {token.name}
            </div>
          </div>
        </div>

        {/* Angka Input */}
        <div style={{ flex: 1, textAlign: 'right' }}>
          {loading ? (
            // Skeleton loader saat menunggu quote
            <div
              style={{
                height: '32px',
                width: '100%',
                borderRadius: '8px',
                background: 'linear-gradient(90deg, rgba(131,110,249,0.08), rgba(131,110,249,0.15), rgba(131,110,249,0.08))',
                backgroundSize: '200% 100%',
                animation: 'shimmer 1.5s infinite',
              }}
            />
          ) : (
            <input
              type="number"
              value={value}
              onChange={(e) => onChange?.(e.target.value)}
              readOnly={readOnly}
              placeholder="0.000000"
              min="0"
              style={{
                width: '100%',
                background: 'transparent',
                border: 'none',
                outline: 'none',
                fontSize: '26px',
                fontWeight: 700,
                color: readOnly ? '#7070A0' : '#F5F5FF',
                textAlign: 'right',
                fontFamily: 'inherit',
                cursor: readOnly ? 'default' : 'text',
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
}
