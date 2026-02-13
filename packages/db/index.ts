// Environment variables should be loaded by the consuming app (Next.js, Bun, etc.)
// Don't load dotenv here as it causes issues in Next.js server components

import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "./schema";

let poolInstance: Pool | null = null;
let dbInstance: ReturnType<typeof drizzle> | null = null;

function initializeDb() {
  if (dbInstance) return dbInstance;

  const DATABASE_URL = process.env.DATABASE_URL;

  if (!DATABASE_URL) {
    console.error("❌ DATABASE_URL is not set in environment variables");
    throw new Error("DATABASE_URL environment variable is required");
  }

  console.log("📊 Database connecting to: ✅ URL configured");

  poolInstance = new Pool({
    connectionString: DATABASE_URL,
  });

  dbInstance = drizzle(poolInstance, { schema });
  return dbInstance;
}

export const db = new Proxy({} as ReturnType<typeof drizzle>, {
  get(target, prop) {
    const instance = initializeDb();
    return instance[prop as keyof typeof instance];
  }
});
