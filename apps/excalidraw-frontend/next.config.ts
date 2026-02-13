import type { NextConfig } from "next";
import path from "path";
import { config as dotenvConfig } from "dotenv";

// Load environment variables from root .env file
dotenvConfig({ path: path.resolve(__dirname, "../../.env") });

const nextConfig: NextConfig = {
  /* config options here */
  env: {
    DATABASE_URL: process.env.DATABASE_URL,
    JWT_SECRET: process.env.JWT_SECRET,
    PLAIN_TEXT_SECRET: process.env.PLAIN_TEXT_SECRET,
  },
};

export default nextConfig;
