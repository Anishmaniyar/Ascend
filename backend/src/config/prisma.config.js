// src/config/prisma.config.js
import "dotenv/config";
import { defineConfig } from "prisma/config";
import path from "node:path";
import { fileURLToPath } from "node:url";

// Get absolute path matching ES Modules (type: module)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig({
  // Force an absolute path directly to your target root schema file 🛠️
  schema: path.resolve(__dirname, "../../prisma/schema.prisma"),

  datasource: {
    url: process.env.DATABASE_URL ?? "",
  },
});
