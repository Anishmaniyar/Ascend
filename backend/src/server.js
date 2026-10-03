// Must be first: ESM hoists all imports, so dotenv has to load via a
// side-effect import to populate process.env before app/db evaluate.
import "dotenv/config";
import app from "./app.js";
import prisma from "./db.js";

const PORT = process.env.PORT || 3000;

async function startServer() {
  try {
    console.log("Connecting to Neon PostgreSQL database...");
    await prisma.$connect();
    console.log("Successfully connected to Neon DB via Prisma Client.");

    const server = app.listen(PORT, () => {
      console.log(
        `🚀 Server smoothly running on port ${PORT} in development mode`,
      );
    });

    const gracefulShutdown = async (signal) => {
      console.log(`\nReceived ${signal}. Shutting down backend gracefully...`);
      server.close(async () => {
        console.log("HTTP server closed.");
        await prisma.$disconnect();
        console.log("Database connections closed.");
        process.exit(0);
      });
    };

    process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
    process.on("SIGINT", () => gracefulShutdown("SIGINT"));
  } catch (error) {
    console.error("CRITICAL ERROR: Failed to start the backend system:", error);
    await prisma.$disconnect();
    process.exit(1);
  }
}

startServer();
