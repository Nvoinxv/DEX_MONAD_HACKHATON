import { db } from "../index";

export async function up() {
    await db.query(`
        CREATE TABLE IF NOT EXISTS swaps (

            id UUID PRIMARY KEY,

            wallet_address VARCHAR(255) NOT NULL,

            strategy_id UUID REFERENCES strategies(id),

            token_in VARCHAR(50) NOT NULL,

            token_out VARCHAR(50) NOT NULL,

            amount_in NUMERIC(38,18) NOT NULL,

            amount_out NUMERIC(38,18),

            minimum_amount_out NUMERIC(38,18) NOT NULL,

            tx_hash VARCHAR(66),

            source VARCHAR(20) NOT NULL,

            status VARCHAR(20) NOT NULL,

            created_at TIMESTAMP DEFAULT NOW()
        );
    `);
}

export async function down() {
    await db.query(`
        DROP TABLE IF EXISTS swaps;
    `);
}