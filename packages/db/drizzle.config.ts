import dotenv from 'dotenv';
import path from 'path';
import { defineConfig } from 'drizzle-kit';

// Load .env from root directory
dotenv.config({ path: path.resolve(__dirname, "../../.env") });

export default defineConfig({
  out: './drizzle',
  schema: './schema.ts',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});
