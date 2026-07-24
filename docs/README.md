# 🚀 Nvoin SmartDEX

> Build. Backtest. Deploy.
>
> A next-generation no-code trading platform built on Monad.

---

## 📖 What is Nvoin SmartDEX?

Nvoin SmartDEX is more than just a decentralized exchange.

It allows anyone to build, test, and deploy automated trading strategies **without writing code**.

Instead of manually watching charts every day, users can create their own trading logic using a visual interface and let the bot execute trades automatically on Monad.

Whether you're a beginner or an experienced trader, Nvoin SmartDEX makes algorithmic trading accessible.

---

## ❓ Why We Built This

Most DEXs only allow users to swap tokens. If users want automated trading, they usually have to:

- Learn programming
- Write smart contracts
- Use complicated scripting languages
- Trust third-party bots

This creates a huge barrier for most traders. We believe trading automation should be simple. That's why we built Nvoin SmartDEX.

---

## ✨ Core Features

### 🔄 Smart DEX

Fast token swaps powered by Monad smart contracts.

- Low latency
- Low transaction costs
- Wallet connection
- Secure on-chain execution

### 🤖 Trading Bot

Automate trades using custom strategies. Users can:

- Run bots 24/7
- Execute Buy/Sell automatically
- Configure Stop Loss
- Configure Take Profit
- Configure Trailing Stop

No coding required.

### 🧩 Strategy Builder

Instead of writing code, users simply build logic visually.

Example:

```
IF
  RSI < 30
  AND
  Price > EMA 200
THEN
  BUY
```

Users can combine multiple indicators into one strategy.

### 📊 Backtesting

Before risking real money, users can test their strategy. Backtesting provides:

- Profit/Loss
- Win Rate
- Drawdown
- Trade History
- Performance Summary

This helps users improve their strategies before deployment.

### 🚀 One-Click Deploy

Once users are satisfied with their strategy:

```
Click Deploy → Trading Bot starts running
```

No scripting. No terminal. No coding.

### 🪙 One-Click Token Launch

Users can launch their own tokens directly from the platform. Perfect for:

- Communities
- Gaming
- Memecoins
- Startups
- Experiments

Deployment is simple and beginner-friendly.

---

## 🎯 Who Is This For?

- ✅ **Beginner traders** — people who understand trading but don't know programming.
- ✅ **Advanced traders** — people who want to automate their existing strategies.
- ✅ **Web3 builders** — developers and communities launching tokens on Monad.

---

## 💡 What Makes This Different?

Most platforms focus on trading. We focus on making algorithmic trading accessible.

Instead of writing this:

```python
if rsi < 30 and ema50 > ema200:
    buy()
```

Users simply build:

```
RSI < 30
+
EMA50 > EMA200
↓
BUY
```

This removes one of the biggest barriers in algorithmic trading.

---

## ⚙️ Technology Stack

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

## 📂 Project Structure

> Struktur di bawah ini adalah usulan berdasarkan tech stack di atas (Next.js frontend, Node.js/TypeScript backend, Solidity contracts). Sesuaikan dengan struktur repo aktual lu jika berbeda.

```
nvoin-smartdex/
├── apps/
│   ├── web/                      # Frontend - Next.js app
│   │   ├── app/                  # App router pages
│   │   │   ├── dex/              # Smart DEX swap page
│   │   │   ├── bot/              # Trading bot dashboard
│   │   │   ├── strategy-builder/ # Visual strategy builder UI
│   │   │   ├── backtest/         # Backtesting results page
│   │   │   └── launch/           # Token launch page
│   │   ├── components/           # Reusable UI components
│   │   ├── hooks/                # Custom React hooks
│   │   ├── lib/                  # Wallet, API client, utils
│   │   ├── styles/                # TailwindCSS config & globals
│   │   └── public/                # Static assets
│   │
│   └── api/                      # Backend - Node.js/TypeScript
│       ├── src/
│       │   ├── modules/
│       │   │   ├── dex/          # Swap execution logic
│       │   │   ├── bot/          # Trading bot engine (Stop Loss, Take Profit, Trailing Stop)
│       │   │   ├── strategy/     # Strategy Builder logic + indicator engine
│       │   │   ├── backtest/     # Backtesting engine
│       │   │   └── token/        # One-Click Token Launch
│       │   ├── routes/           # REST/API routes
│       │   ├── services/         # Business logic layer
│       │   ├── jobs/             # Cron jobs / bot scheduler (24/7 execution)
│       │   ├── db/                # PostgreSQL models & migrations
│       │   ├── cache/             # Redis integration
│       │   └── config/            # Env & app config
│       └── tests/
│
├── contracts/                    # Blockchain - Solidity smart contracts
│   ├── src/
│   │   ├── SmartDEX.sol
│   │   ├── TradingBotVault.sol
│   │   └── TokenFactory.sol
│   ├── scripts/                  # Deployment scripts (Monad)
│   ├── test/                     # Contract tests
│   └── hardhat.config.ts         # or foundry.toml
│
├── packages/                     # Shared code across apps
│   ├── types/                    # Shared TypeScript types/interfaces
│   ├── indicators/               # Shared indicator calculations (RSI, EMA, etc.)
│   └── config/                   # Shared lint/tsconfig
│
├── docs/                         # Documentation
├── .env.example
├── package.json                  # Monorepo root (Turborepo/Nx/Yarn workspaces)
└── README.md
```

**Catatan struktur:**
- `apps/web` dan `apps/api` dipisah agar frontend & backend bisa di-deploy independen.
- `contracts/` terpisah dari `apps/` karena punya siklus build & test sendiri (Hardhat/Foundry).
- `packages/indicators` sengaja dipisah supaya logika indikator (RSI, EMA, dll.) bisa dipakai bareng oleh Strategy Builder di frontend maupun Backtesting engine di backend, tanpa duplikasi logic.

---

## 🔒 Security

- Non-custodial wallets
- On-chain execution
- Transparent transactions
- User-controlled assets

Users always maintain ownership of their funds.

---

## 🌍 Future Roadmap

**Phase 1**
- Smart DEX
- Trading Bot
- Strategy Builder
- Backtesting

**Phase 2**
- AI Strategy Assistant
- Strategy Marketplace
- Copy Trading
- Analytics Dashboard

**Phase 3**
- DAO Governance
- Mobile Application
- Cross-chain Support
- Institutional Features

---

## ❤️ Built for Monad Hackathon

Nvoin SmartDEX is built to showcase how Monad's high-performance blockchain can power the next generation of automated on-chain trading.

**Fast. Simple. Accessible. For everyone.**