import crypto from "node:crypto";
import { google } from "googleapis";
import AppError from "../../utils/AppError.js";
import { env } from "../../config/env.js";

// Scopes: minimal identity only. No Gmail / Drive / Calendar.
const GOOGLE_SCOPES = ["openid", "email", "profile"];

const getOAuthClient = () => {
  const { clientId, clientSecret, callbackUrl } = env.google;

  if (!clientId || !clientSecret) {
    throw new AppError(
      "Google OAuth is not configured. Set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET.",
      500,
    );
  }

  return new google.auth.OAuth2(clientId, clientSecret, callbackUrl);
};

// Cryptographically random `state` for CSRF protection.
// Stored in a short-lived httpOnly cookie on start,
// then compared with the `state` Google returns on callback.
export const generateState = () => {
  return crypto.randomBytes(32).toString("hex");
};

// GET /api/v1/auth/google -> redirect target
export const createGoogleAuthorizationUrl = (state) => {
  const client = getOAuthClient();

  return client.generateAuthUrl({
    access_type: "online",
    scope: GOOGLE_SCOPES,
    state,
  });
};

// Exchange temporary authorization `code` for Google tokens (server-side).
export const exchangeAuthorizationCode = async (code) => {
  const client = getOAuthClient();

  try {
    const { tokens } = await client.getToken(code);
    return tokens;
  } catch {
    throw new AppError("Failed to exchange Google authorization code", 401);
  }
};

// Verify Google identity via the OIDC id_token.
// Returns normalized identity used by auth.service (NOT app tokens).
export const verifyGoogleIdentity = async (idToken) => {
  const client = getOAuthClient();

  if (!idToken) {
    throw new AppError("Missing Google identity token", 401);
  }

  try {
    const ticket = await client.verifyIdToken({
      idToken,
      audience: env.google.clientId,
    });

    const payload = ticket.getPayload();

    if (!payload || !payload.sub || !payload.email) {
      throw new AppError("Invalid Google identity", 401);
    }

    return {
      provider: "GOOGLE",
      providerUserId: payload.sub,
      email: payload.email,
      name: payload.name || payload.email.split("@")[0],
      picture: payload.picture || null,
    };
  } catch (error) {
    if (error instanceof AppError) throw error;
    throw new AppError("Failed to verify Google identity", 401);
  }
};
