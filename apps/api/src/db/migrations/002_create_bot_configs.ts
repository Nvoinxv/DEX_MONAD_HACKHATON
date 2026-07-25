import { db } from "../index";

export async function up() {
    await db.query(`
        CREATE TABLE IF NOT EXISTS bot_configs (

            id UUID PRIMARY KEY,

            strategy_id UUID REFERENCES strategies(id),

            name VARCHAR(100) NOT NULL,

            symbol VARCHAR(30) NOT NULL,

            timeframe VARCHAR(20) NOT NULL,

            capital DOUBLE PRECISION NOT NULL,

            risk_per_trade DOUBLE PRECISION NOT NULL,

            max_open_trades INTEGER NOT NULL,

            status VARCHAR(20) NOT NULL,

            created_at TIMESTAMP DEFAULT NOW(),

            updated_at TIMESTAMP DEFAULT NOW()
        );
    `);
}

export async function down() {
    await db.query(`
        DROP TABLE IF EXISTS bot_configs;
    `);
}