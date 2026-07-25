import { db } from "../index";

export async function up() {
    await db.query(`
        CREATE TABLE IF NOT EXISTS strategies (
            id UUID PRIMARY KEY,

            name VARCHAR(100) NOT NULL,

            description TEXT,

            type VARCHAR(50) NOT NULL,

            parameters JSONB NOT NULL,

            created_at TIMESTAMP DEFAULT NOW(),

            updated_at TIMESTAMP DEFAULT NOW()
        );
    `);
}

export async function down() {
    await db.query(`
        DROP TABLE IF EXISTS strategies;
    `);
}