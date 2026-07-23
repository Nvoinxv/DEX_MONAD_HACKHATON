# 🚀 Nvoin SmartDEX

🌐 [English](./README.md) | **[Bahasa Indonesia](./README.id.md)**

> Bangun. Backtest. Deploy.
>
> Platform trading no-code generasi baru yang dibangun di atas Monad.

---

## 📖 Apa itu Nvoin SmartDEX?

Nvoin SmartDEX bukan sekadar decentralized exchange biasa.

Platform ini memungkinkan siapa pun untuk membangun, menguji, dan menjalankan strategi trading otomatis **tanpa perlu menulis kode**.

Daripada memantau chart secara manual setiap hari, user bisa membuat logika trading mereka sendiri lewat antarmuka visual, lalu membiarkan bot mengeksekusi trading secara otomatis di Monad.

Baik lu pemula maupun trader berpengalaman, Nvoin SmartDEX membuat algorithmic trading jadi mudah diakses.

---

## ❓ Kenapa Kami Membangun Ini

Kebanyakan DEX hanya memungkinkan user untuk swap token. Kalau user ingin trading otomatis, biasanya mereka harus:

- Belajar programming
- Menulis smart contract
- Menggunakan bahasa scripting yang rumit
- Percaya pada bot pihak ketiga

Ini menciptakan hambatan besar bagi kebanyakan trader. Kami percaya otomasi trading seharusnya sederhana. Itulah kenapa kami membangun Nvoin SmartDEX.

---

## ✨ Fitur Utama

### 🎛️ Mode Trading

User bisa memilih cara mereka ingin trading:

|                | **Manual** | **Dikelola Bot** |
|----------------|------------|------------------|
| **Spot**       | Swap manual langsung lewat Smart DEX | Eksekusi otomatis berdasarkan strategi yang sudah disetup |

> 📌 Futures trading direncanakan untuk fase berikutnya — lihat [Roadmap Masa Depan](#-roadmap-masa-depan). Versi saat ini fokus penuh ke spot trading (manual & bot) agar bisa dikirim dengan aman dan solid dalam timeline hackathon.

Manual trading tidak butuh setup apa pun — langsung eksekusi seperti exchange biasa. Trading yang dikelola bot mengharuskan user melakukan setup strategi terlebih dahulu lewat Strategy Builder sebelum bot bisa berjalan.

### 🔄 Smart DEX (Spot)

Swap token cepat yang didukung smart contract Monad.

- Latensi rendah
- Biaya transaksi rendah
- Koneksi wallet
- Eksekusi on-chain yang aman

### 🤖 Trading Bot

Otomatisasi trading spot menggunakan strategi custom. User bisa:

- Menjalankan bot 24/7
- Eksekusi Buy/Sell secara otomatis
- Mengatur Stop Loss
- Mengatur Take Profit
- Mengatur Trailing Stop
- **Menyimpan konfigurasi bot ke database** — bisa dipakai ulang atau diedit kapan saja tanpa perlu setup dari 0
- Start / Pause / Stop bot kapan saja

Tanpa perlu coding.

### 🧩 Strategy Builder

Daripada menulis kode, user cukup membangun logika secara visual.

Contoh:

```
IF
  RSI < 30
  AND
  Price > EMA 200
THEN
  BUY
```

User bisa menggabungkan beberapa indikator jadi satu strategi.

### 📊 Backtesting

Sebelum mempertaruhkan uang sungguhan, user bisa menguji strategi mereka. Backtesting menyediakan:

- Profit/Loss
- Win Rate
- Drawdown
- Riwayat Trade
- Ringkasan Performa

Ini membantu user menyempurnakan strategi mereka sebelum deployment.

### 🚀 One-Click Deploy

Setelah user puas dengan strategi mereka:

```
Klik Deploy → Trading Bot mulai berjalan
```

Tanpa scripting. Tanpa terminal. Tanpa coding.

### 🪙 One-Click Token Launch

User bisa meluncurkan token mereka sendiri langsung dari platform. Cocok untuk:

- Komunitas
- Gaming
- Memecoin
- Startup
- Eksperimen

Deployment-nya simpel dan ramah pemula.

---

## 🎯 Untuk Siapa Platform Ini?

- ✅ **Trader pemula** — orang yang paham trading tapi tidak bisa programming.
- ✅ **Trader berpengalaman** — orang yang ingin mengotomatisasi strategi yang sudah mereka punya.
- ✅ **Web3 builder** — developer dan komunitas yang meluncurkan token di Monad.

---

## 💡 Apa yang Membuat Ini Berbeda?

Kebanyakan platform fokus ke trading. Kami fokus membuat algorithmic trading mudah diakses.

Daripada menulis ini:

```python
if rsi < 30 and ema50 > ema200:
    buy()
```

User cukup membangun:

```
RSI < 30
+
EMA50 > EMA200
↓
BUY
```

Ini menghilangkan salah satu hambatan terbesar dalam algorithmic trading.

---

## ⚙️ Tech Stack

**Frontend**
- React
- Next.js
- TailwindCSS

**Backend**
- Node.js
- TypeScript

**Blockchain**
- Monad
- Solidity Smart Contracts

**Wallet**
- MetaMask
- WalletConnect

**Storage**
- PostgreSQL
- Redis

---

## 📂 Struktur Project

> Struktur di bawah ini adalah usulan berdasarkan tech stack di atas (Next.js frontend, Node.js/TypeScript backend, Solidity contracts). Sesuaikan dengan struktur repo aktual lu jika berbeda.

```
nvoin-smartdex/
├── apps/
│   ├── web/                          # Frontend - Next.js app
│   │   ├── app/
│   │   │   ├── trade/
│   │   │   │   └── spot/             # UI trading spot manual
│   │   │   ├── bot/
│   │   │   │   ├── dashboard/        # List & status semua bot milik user (running/paused/stopped)
│   │   │   │   ├── [botId]/          # Detail bot: performa, edit config, start/stop
│   │   │   │   └── new/              # Setup bot baru (pilih pair + strategi)
│   │   │   ├── strategy-builder/     # UI visual strategy builder
│   │   │   │   ├── new/              # Buat strategi baru
│   │   │   │   └── [strategyId]/edit/# Edit strategi tersimpan
│   │   │   ├── backtest/             # Halaman hasil backtesting
│   │   │   └── launch/               # Halaman token launch
│   │   ├── components/               # Reusable UI components
│   │   ├── hooks/                    # Custom React hooks
│   │   ├── lib/                      # Wallet, API client, utils
│   │   ├── styles/                   # TailwindCSS config & globals
│   │   └── public/                   # Static assets
│   │
│   └── api/                          # Backend - Node.js/TypeScript
│       ├── src/
│       │   ├── modules/
│       │   │   ├── trade/
│       │   │   │   └── spot/         # Eksekusi order spot manual
│       │   │   ├── bot/
│       │   │   │   ├── engine/       # Core engine eksekusi bot
│       │   │   │   ├── config/       # CRUD untuk bot config (create/read/update/delete, clone)
│       │   │   │   └── runtime/      # State bot yang sedang berjalan (running/paused/stopped)
│       │   │   ├── strategy/         # Logika Strategy Builder + indicator engine + CRUD strategi
│       │   │   ├── backtest/         # Backtesting engine
│       │   │   └── token/            # One-Click Token Launch
│       │   ├── routes/               # REST/API routes
│       │   ├── services/             # Business logic layer
│       │   ├── jobs/                 # Cron/queue - bot scheduler untuk eksekusi 24/7
│       │   ├── db/
│       │   │   ├── models/
│       │   │   │   ├── strategy.model.ts   # Strategi (kondisi indikator, entry/exit rules)
│       │   │   │   ├── bot-config.model.ts # Config bot tersimpan (strategy_id, pair, risk params)
│       │   │   │   ├── order.model.ts      # Riwayat order (manual & bot)
│       │   │   │   └── backtest-result.model.ts
│       │   │   └── migrations/
│       │   ├── cache/                # Redis - live price, bot runtime state
│       │   └── config/               # Env & app config
│       └── tests/
│
├── contracts/                        # Blockchain - Solidity smart contracts
│   ├── src/
│   │   ├── spot/
│   │   │   └── SmartDEX.sol          # AMM swap (spot)
│   │   ├── bot/
│   │   │   └── TradingBotVault.sol   # Vault non-custodial untuk eksekusi bot
│   │   └── token/
│   │       └── TokenFactory.sol
│   ├── scripts/                      # Script deployment (Monad)
│   ├── test/                         # Test contract
│   └── hardhat.config.ts             # atau foundry.toml
│
├── packages/                         # Shared code antar apps
│   ├── types/                        # Shared TypeScript types (Strategy, BotConfig, Order, dll.)
│   ├── indicators/                   # Perhitungan indikator bersama (RSI, EMA, dll.)
│   └── config/                       # Shared lint/tsconfig
│
├── docs/                             # Dokumentasi
├── .env.example
├── package.json                      # Root monorepo (Turborepo/Nx/Yarn workspaces)
└── README.md
```

**Catatan struktur:**
- Scope saat ini **spot-only** (manual + bot). Futures sengaja dikeluarkan dari struktur ini karena butuh subsistem terpisah (perp engine, liquidation, funding rate, oracle) yang risikonya terlalu besar untuk dibangun dalam timeline hackathon tanpa audit — lihat [Roadmap Masa Depan](#-roadmap-masa-depan).
- `trade/spot` (manual) dipisah dari `bot/` (otomatis) baik di frontend maupun backend — karena flow-nya beda: manual = eksekusi langsung, bot = harus lewat setup strategi dulu.
- `bot/config/` adalah layer khusus untuk **menyimpan bot config ke database** (`bot-config.model.ts`), supaya user bisa reuse atau edit setup bot tanpa mulai dari 0. Terpisah dari `bot/engine/` (logika eksekusi) dan `bot/runtime/` (status bot yang lagi jalan).
- `strategy/` punya CRUD sendiri (bukan cuma builder), karena strategi juga perlu disimpan & di-attach ke bot config.

> Kalau timeline atau kebutuhan berubah dan futures jadi prioritas, struktur `trade/futures`, modul futures di `bot/`, dan `contracts/futures/` (PerpEngine, LiquidationManager, FundingRateOracle) bisa ditambahkan kembali sebagai fase terpisah — bukan disisipkan ke scope yang sudah jalan, supaya nggak mengganggu stabilitas fitur spot yang sudah ada.

---

## 🔒 Keamanan

- Wallet non-custodial
- Eksekusi on-chain
- Transaksi transparan
- Aset dikontrol user

User selalu memegang kepemilikan penuh atas dana mereka.

---

## 🌍 Roadmap Masa Depan

**Fase 1**
- Smart DEX
- Trading Bot
- Strategy Builder
- Backtesting

**Fase 2**
- AI Strategy Assistant
- Strategy Marketplace
- Copy Trading
- Analytics Dashboard
- **Futures Trading** (manual & dikelola bot) — perpetual/leverage trading, dibangun sebagai fase terpisah setelah spot stabil & (idealnya) melalui security review, karena melibatkan margin, liquidation, dan funding rate engine

**Fase 3**
- DAO Governance
- Aplikasi Mobile
- Cross-chain Support
- Fitur Institutional

---

## ❤️ Dibangun untuk Monad Hackathon

Nvoin SmartDEX dibangun untuk menunjukkan bagaimana blockchain Monad yang berperforma tinggi bisa mendukung generasi baru automated on-chain trading.

**Cepat. Sederhana. Mudah diakses. Untuk semua orang.**