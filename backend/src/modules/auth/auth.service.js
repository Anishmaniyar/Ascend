import AppError from "../../utils/AppError.js";
import * as authRepository from "./auth.repository.js";
import { findRoleByName } from "../authorization/permission.repository.js";
import {
  exchangeAuthorizationCode,
  verifyGoogleIdentity,
} from "./google.service.js";
import {
  generateAccessToken,
  generateRefreshToken,
  hashRefreshToken,
} from "./token.service.js";

// NOTE: email/password registration & login were intentionally removed.
// Google authentication is the only way in. It yields either a new user
// (signup) or an existing user (login) — both continue into the same
// application session below.

// Find-or-create by (provider + providerUserId).
export const handleGoogleSignup = async (googleIdentity) => {
  const { provider, providerUserId, email, name, picture } = googleIdentity;

  if (!providerUserId || !email) {
    throw new AppError("Incomplete Google identity", 400);
  }

  const existing = await authRepository.findAuthAccountByProviderId(
    provider,
    providerUserId,
  );

  if (existing) {
    const { user } = existing;
    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
      },
      isNewUser: false,
    };
  }

  // New Google identities always start as USER. Role elevation happens
  // out-of-band (direct DB) until a user-management API exists.
  const userRole = await findRoleByName("USER");
  if (!userRole) {
    throw new AppError("Authorization is not seeded", 500);
  }

  const newUser = await authRepository.createUser({
    name,
    email,
    avatar: picture,
    roleId: userRole.id,
  });

  await authRepository.createAuthAccount({
    userId: newUser.id,
    provider,
    providerUserId,
  });

  return {
    user: {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      avatar: newUser.avatar,
    },
    isNewUser: true,
  };
};

// One operation: Google authentication -> app session.
// code -> Google tokens -> verified identity -> find/create user ->
// create AuthSession -> access + refresh tokens.
export const handleGoogleAuthentication = async (code) => {
  if (!code) {
    throw new AppError("Missing authorization code", 400);
  }

  const tokens = await exchangeAuthorizationCode(code);
  const identity = await verifyGoogleIdentity(tokens.id_token);
  const { user, isNewUser } = await handleGoogleSignup(identity);

  const refresh = generateRefreshToken();
  await authRepository.createAuthSession({
    userId: user.id,
    refreshTokenHash: refresh.tokenHash,
    expiresAt: refresh.expiresAt,
  });

  const accessToken = generateAccessToken(user);

  return {
    user,
    isNewUser,
    accessToken,
    refreshToken: refresh.token,
    refreshExpiresAt: refresh.expiresAt,
  };
};

const getActiveSessionOrThrow = async (refreshToken) => {
  if (!refreshToken) {
    throw new AppError("Refresh token is missing", 401);
  }

  const session = await authRepository.findAuthSessionByTokenHash(
    hashRefreshToken(refreshToken),
  );

  if (!session || session.revokedAt || session.expiresAt < new Date()) {
    throw new AppError("Session expired or token is invalid", 401);
  }

  return session;
};

// Refresh rotation: validate old -> revoke old -> issue new pair.
export const refreshSession = async (refreshToken) => {
  const session = await getActiveSessionOrThrow(refreshToken);

  await authRepository.revokeAuthSession(session.id);

  const refresh = generateRefreshToken();
  await authRepository.createAuthSession({
    userId: session.userId,
    refreshTokenHash: refresh.tokenHash,
    expiresAt: refresh.expiresAt,
  });

  const accessToken = generateAccessToken(session.user);

  return {
    accessToken,
    refreshToken: refresh.token,
    refreshExpiresAt: refresh.expiresAt,
  };
};

// Logout: revoke the session behind the refresh cookie. Idempotent.
export const logoutSession = async (refreshToken) => {
  if (!refreshToken) return;

  const session = await authRepository.findAuthSessionByTokenHash(
    hashRefreshToken(refreshToken),
  );

  if (session && !session.revokedAt) {
    await authRepository.revokeAuthSession(session.id);
  }
};

export const getCurrentUser = async (userId) => {
  const response = await authRepository.findUserById(userId);

  if (!response) {
    throw new AppError("User not found", 404);
  }

  return {
    user: {
      id: response.id,
      name: response.name,
      email: response.email,
      avatar: response.avatar,
    },
  };
};
