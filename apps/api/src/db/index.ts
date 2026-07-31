import { Pool } from "pg";
import dotenv from "dotenv";

dotenv.config();

console.log("============================================================");
console.log("                 PostgreSQL Configuration");
console.log("============================================================");
console.log(`Host     : ${process.env.POSTGRES_HOST}`);
console.log(`Port     : ${process.env.POSTGRES_PORT}`);
console.log(`Database : ${process.env.POSTGRES_DB}`);
console.log(`User     : ${process.env.POSTGRES_USER}`);
console.log(`Password : ${process.env.POSTGRES_PASSWORD ? "[SET]" : "[NOT SET]"}`);
console.log("============================================================");

export const db = new Pool({
  host: process.env.POSTGRES_HOST,
  port: Number(process.env.POSTGRES_PORT),
  user: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB,
});

(async () => {
  try {
    const client = await db.connect();

    console.log("[DB] Connection established successfully.");
    console.log("[DB] PostgreSQL is ready to accept queries.");

    client.release();
  } catch (err) {
    console.error("[DB] Failed to connect to PostgreSQL.");
    console.error(err);
  }
})();

db.on("error", (err) => {
  console.error("[DB] Unexpected error on idle client.");
  console.error(err);
  process.exit(-1);
});