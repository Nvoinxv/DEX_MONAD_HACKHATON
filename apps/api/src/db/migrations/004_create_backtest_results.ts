import { db } from "../index";

export async function up() {
    await db.query(`
        CREATE TABLE IF NOT EXISTS backtest_results (

            id UUID PRIMARY KEY,

            strategy_id UUID REFERENCES strategies(id),

            symbol VARCHAR(30) NOT NULL,

            timeframe VARCHAR(20) NOT NULL,

            start_date TIMESTAMP,

            end_date TIMESTAMP,

            initial_capital DOUBLE PRECISION,

            final_capital DOUBLE PRECISION,

            total_trades INTEGER,

            winning_trades INTEGER,

            losing_trades INTEGER,

            win_rate DOUBLE PRECISION,

            net_profit DOUBLE PRECISION,

            max_drawdown DOUBLE PRECISION,

            sharpe_ratio DOUBLE PRECISION,

            created_at TIMESTAMP DEFAULT NOW()
        );
    `);
}

export async function down() {
    await db.query(`
        DROP TABLE IF EXISTS backtest_results;
    `);
}