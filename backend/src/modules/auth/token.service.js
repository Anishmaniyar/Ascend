import crypto from "node:crypto";
import jwt from "jsonwebtoken";
import AppError from "../../utils/AppError.js";
import { env } from "../../config/env.js";

const requireSecret = (value, name) => {
  if (!value) {
    throw new AppError(
      `${name} is not configured. Set it in your environment.`,
      500,
    );
  }
  return value;
};

// Accepts "15m" | "1h" | "7d" | "30s" | seconds. Returns milliseconds.
export const parseDurationToMs = (value, fallbackMs) => {
  if (typeof value === "number" && Number.isFinite(value)) return value * 1000;
  if (typeof value !== "string") return fallbackMs;

  const match = value.trim().match(/^(\d+)\s*([smhd])?$/i);
  if (!match) return fallbackMs;

  const amount = Number(match[1]);
  const unit = (match[2] || "s").toLowerCase();
  const multipliers = { s: 1000, m: 60 * 1000, h: 3600 * 1000, d: 24 * 3600 * 1000 };
  return amount * multipliers[unit];
};

export const getRefreshLifetimeMs = () =>
  parseDurationToMs(env.jwt.refreshExpiresIn, 7 * 24 * 3600 * 1000);

// Short-lived JWT proving "this request acts as this user".
export const generateAccessToken = (user) => {
  const secret = requireSecret(env.jwt.accessSecret, "JWT_ACCESS_SECRET");

  return jwt.sign(
    { id: user.id, email: user.email },
    secret,
    { expiresIn: env.jwt.accessExpiresIn || "15m" },
  );
};

export const verifyAccessToken = (token) => {
  const secret = requireSecret(env.jwt.accessSecret, "JWT_ACCESS_SECRET");

  try {
    return jwt.verify(token, secret);
  } catch {
    throw new AppError("Session expired or token is invalid", 401);
  }
};

// Opaque refresh token. The raw value goes to the cookie only;
// its SHA-256 hash is what gets stored/looked up in AuthSession.
export const generateRefreshToken = () => {
  requireSecret(env.jwt.refreshSecret, "JWT_REFRESH_SECRET");

  const token = crypto.randomBytes(48).toString("hex");
  const tokenHash = crypto.createHash("sha256").update(token).digest("hex");
  const expiresAt = new Date(Date.now() + getRefreshLifetimeMs());

  return { token, tokenHash, expiresAt };
};

export const hashRefreshToken = (token) => {
  return crypto.createHash("sha256").update(token).digest("hex");
};
