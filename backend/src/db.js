// src/db.js
import pg from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";
import "dotenv/config";

// 1. Establish a standard PostgreSQL connection pool
const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
});

// 2. Initialize the Prisma v7 Driver Adapter wrapper
const adapter = new PrismaPg(pool);

// 3. Construct the clean client instance by explicitly injecting the adapter
const prisma = new PrismaClient({ adapter });

export default prisma;
