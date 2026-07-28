'use client';

/**
 * components/PriceImpactBadge.tsx
 *
 * "Stiker Peringatan Harga" — Badge berwarna yang kasih tau user
 * seberapa besar efek swap mereka terhadap harga di pool.
 *
 * Warna:
 * 🟢 Hijau  = < 1%  → Aman, lanjut!
 * 🟡 Kuning = 1–3%  → Waspada
 * 🔴 Merah  = > 3%  → Berbahaya! Pertimbangkan lagi.
 */

import React from 'react';

interface PriceImpactBadgeProps {
  priceImpact: number; // nilai numerik, misal: 0.30
  percentage: string;  // string tampilan, misal: "0.30%"
}

export default function PriceImpactBadge({
  priceImpact,
  percentage,
}: PriceImpactBadgeProps) {
  const getConfig = () => {
    if (priceImpact < 1) {
      return {
        color: '#22C55E',
        bg: 'rgba(34,197,94,0.1)',
        border: 'rgba(34,197,94,0.25)',
        label: 'Rendah',
        icon: '✓',
      };
    } else if (priceImpact < 3) {
      return {
        color: '#F59E0B',
        bg: 'rgba(245,158,11,0.1)',
        border: 'rgba(245,158,11,0.25)',
        label: 'Sedang',
        icon: '⚠',
      };
    } else {
      return {
        color: '#EF4444',
        bg: 'rgba(239,68,68,0.1)',
        border: 'rgba(239,68,68,0.25)',
        label: 'Tinggi!',
        icon: '✕',
      };
    }
  };

  const config = getConfig();

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <span style={{ fontSize: '13px', color: '#8B8BAE' }}>Price Impact</span>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          background: config.bg,
          border: `1px solid ${config.border}`,
          borderRadius: '8px',
          padding: '4px 10px',
        }}
      >
        <span style={{ fontSize: '11px', fontWeight: 700, color: config.color }}>
          {config.icon}
        </span>
        <span style={{ fontSize: '13px', fontWeight: 600, color: config.color }}>
          {percentage}{' '}
          <span style={{ fontWeight: 400, opacity: 0.8 }}>({config.label})</span>
        </span>
      </div>
    </div>
  );
}
