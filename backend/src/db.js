import { PrismaNeon } from "@prisma/adapter-neon";
import { PrismaClient } from "@prisma/client";

// NOTE: PrismaNeon is a factory taking a *config object*, not a Pool
// instance. Passing a Pool here silently produces an unconfigured pool
// ("No database host or connection string" on first query).
const adapter = new PrismaNeon({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({
  adapter,
});

export default prisma;
