'use client';

/**
 * context/WalletContext.tsx
 *
 * Global state untuk wallet & user session di seluruh aplikasi.
 *
 * State yang dikelola:
 *  - walletAddress  : address EVM yang sedang terconnect (null = belum connect)
 *  - walletType     : 'metamask' | 'walletconnect' | null
 *  - user           : data profil user dari backend (null = belum login)
 *  - isConnecting   : loading state saat proses koneksi wallet
 *  - isRegistered   : apakah wallet sudah punya akun di platform
 *
 * Flow:
 *  1. connectWallet(type) → simulasi connect (mock) → set walletAddress
 *  2. Setelah address ada, cek backend → isRegistered?
 *  3. Kalau belum → redirect ke /register
 *  4. Kalau sudah → fetch profil, set user
 */

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  type ReactNode,
} from 'react';

// ─────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────

export type WalletType = 'metamask' | 'walletconnect';

export interface UserProfile {
  id: string;
  username: string;
  display_name?: string;
  wallet_address: string;
  created_at: string;
}

export interface WalletContextValue {
  walletAddress: string | null;
  walletType: WalletType | null;
  user: UserProfile | null;
  isConnecting: boolean;
  isRegistered: boolean;
  connectWallet: (type: WalletType) => Promise<{ address: string; isRegistered: boolean }>;
  disconnectWallet: () => void;
  setUser: (user: UserProfile) => void;
  refreshUser: () => Promise<void>;
}

// ─────────────────────────────────────────────────────────
// Context
// ─────────────────────────────────────────────────────────

const WalletContext = createContext<WalletContextValue | null>(null);

// ─────────────────────────────────────────────────────────
// Mock Wallet Addresses (untuk simulasi)
// ─────────────────────────────────────────────────────────

const MOCK_ADDRESSES: Record<WalletType, string> = {
  metamask: '0x1A2b3C4d5E6f7A8b9C0d1E2f3A4b5C6d7E8f9A3c',
  walletconnect: '0xDeAdBeEf1234567890abcDEF1234567890AbCdEf',
};

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
const SESSION_KEY = 'nvoin_wallet_session';

// ─────────────────────────────────────────────────────────
// Provider
// ─────────────────────────────────────────────────────────

export function WalletProvider({ children }: { children: ReactNode }) {
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [walletType, setWalletType] = useState<WalletType | null>(null);
  const [user, setUserState] = useState<UserProfile | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);

  // ── Restore session dari localStorage saat mount ──
  useEffect(() => {
    try {
      const raw = localStorage.getItem(SESSION_KEY);
      if (!raw) return;
      const session = JSON.parse(raw) as {
        walletAddress: string;
        walletType: WalletType;
        user: UserProfile | null;
        isRegistered: boolean;
      };
      setWalletAddress(session.walletAddress);
      setWalletType(session.walletType);
      setUserState(session.user);
      setIsRegistered(session.isRegistered);
    } catch {
      localStorage.removeItem(SESSION_KEY);
    }
  }, []);

  // ── Simpan session ke localStorage setiap kali berubah ──
  useEffect(() => {
    if (!walletAddress) return;
    localStorage.setItem(
      SESSION_KEY,
      JSON.stringify({ walletAddress, walletType, user, isRegistered }),
    );
  }, [walletAddress, walletType, user, isRegistered]);

  // ── Cek status registrasi wallet di backend ──
  const checkRegistration = useCallback(async (address: string) => {
    try {
      const res = await fetch(`${API_BASE}/api/user/check/${address}`, {
        signal: AbortSignal.timeout(3000),
      });
      if (!res.ok) return { isRegistered: false, user: null };
      const json = await res.json();
      return {
        isRegistered: json.data?.is_registered ?? false,
        user: json.data?.user ?? null,
      };
    } catch {
      // Backend offline → anggap belum terdaftar agar flow tetap jalan
      return { isRegistered: false, user: null };
    }
  }, []);

  // ── Refresh profil user dari backend ──
  const refreshUser = useCallback(async () => {
    if (!walletAddress) return;
    try {
      const res = await fetch(`${API_BASE}/api/user/profile/${walletAddress}`, {
        signal: AbortSignal.timeout(3000),
      });
      if (!res.ok) return;
      const json = await res.json();
      if (json.data) setUserState(json.data);
    } catch {
      // Tetap pakai data yang ada
    }
  }, [walletAddress]);

  // ── Connect Wallet ──
  const connectWallet = useCallback(
    async (type: WalletType): Promise<{ address: string; isRegistered: boolean }> => {
      setIsConnecting(true);
      try {
        // Simulasi delay koneksi wallet (0.8 detik)
        await new Promise((r) => setTimeout(r, 800));

        const address = MOCK_ADDRESSES[type];

        // Cek backend apakah wallet sudah terdaftar
        const { isRegistered: registered, user: fetchedUser } =
          await checkRegistration(address);

        setWalletAddress(address);
        setWalletType(type);
        setIsRegistered(registered);
        if (fetchedUser) setUserState(fetchedUser);

        return { address, isRegistered: registered };
      } finally {
        setIsConnecting(false);
      }
    },
    [checkRegistration],
  );

  // ── Disconnect Wallet ──
  const disconnectWallet = useCallback(() => {
    setWalletAddress(null);
    setWalletType(null);
    setUserState(null);
    setIsRegistered(false);
    localStorage.removeItem(SESSION_KEY);
  }, []);

  // ── Set User (setelah register berhasil) ──
  const setUser = useCallback((newUser: UserProfile) => {
    setUserState(newUser);
    setIsRegistered(true);
  }, []);

  return (
    <WalletContext.Provider
      value={{
        walletAddress,
        walletType,
        user,
        isConnecting,
        isRegistered,
        connectWallet,
        disconnectWallet,
        setUser,
        refreshUser,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
}

// ─────────────────────────────────────────────────────────
// Hook
// ─────────────────────────────────────────────────────────

export function useWallet(): WalletContextValue {
  const ctx = useContext(WalletContext);
  if (!ctx) {
    throw new Error('useWallet harus dipakai di dalam <WalletProvider>.');
  }
  return ctx;
}
