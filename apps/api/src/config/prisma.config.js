// src/config/prisma.config.js
import "dotenv/config";
import { defineConfig } from "prisma/config";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig({
  schema: path.resolve(__dirname, "../../prisma/schema.prisma"),
  datasource: {
    // Prisma CLI commands like db push will use this directly!
    url: process.env.DATABASE_URL ?? "",
  },
});
