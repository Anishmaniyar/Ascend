import asyncHandler from "../../utils/asyncHandler.js";
import * as authService from "./auth.service.js";
import {
  createGoogleAuthorizationUrl,
  generateState,
} from "./google.service.js";
import { getRefreshLifetimeMs } from "./token.service.js";
import { env } from "../../config/env.js";

const STATE_COOKIE_NAME = "oauth_state";
const REFRESH_COOKIE_NAME = "refresh_token";

const baseCookieOptions = () => ({
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax",
  path: "/",
});

const setRefreshCookie = (res, refreshToken) => {
  res.cookie(REFRESH_COOKIE_NAME, refreshToken, {
    ...baseCookieOptions(),
    maxAge: getRefreshLifetimeMs(), // 7 days, matches AuthSession.expiresAt
  });
};

const clearRefreshCookie = (res) => {
  res.clearCookie(REFRESH_COOKIE_NAME, { path: "/" });
};

// GET /api/v1/auth/google — start Google auth, redirect to Google.
export const googleAuthStart = asyncHandler(async (req, res) => {
  const state = generateState();

  // Short-lived httpOnly cookie so callback can verify request integrity.
  res.cookie(STATE_COOKIE_NAME, state, {
    ...baseCookieOptions(),
    maxAge: 5 * 60 * 1000, // 5 minutes
  });

  const authorizationUrl = createGoogleAuthorizationUrl(state);

  return res.redirect(authorizationUrl);
});

// GET /api/v1/auth/google/callback — Google redirects here with ?code=&state=
// Completion point: verify state -> authenticate -> create AuthSession ->
// set refresh cookie -> redirect to frontend. No tokens in the URL.
//
// This endpoint is always hit by browser navigation, so failures redirect
// to the frontend with a generic error code instead of returning JSON.
// (No failure details in the URL — they would leak via history/logs.)
export const googleCallback = asyncHandler(async (req, res) => {
  const { code, state } = req.query;
  const stateCookie = req.cookies?.[STATE_COOKIE_NAME];

  // Single-use: clear immediately.
  res.clearCookie(STATE_COOKIE_NAME, { path: "/" });

  // State must match what we issued — mitigates CSRF.
  if (!state || !stateCookie || state !== stateCookie) {
    return res.redirect(`${env.frontendUrl}/register?error=oauth_state`);
  }

  try {
    const { refreshToken } = await authService.handleGoogleAuthentication(code);

    setRefreshCookie(res, refreshToken);

    return res.redirect(`${env.frontendUrl}/dashboard`);
  } catch (error) {
    // Logged server-side only; the browser gets a generic code.
    console.error("Google callback failed:", error?.message);
    return res.redirect(`${env.frontendUrl}/register?error=oauth_failed`);
  }
});

// POST /api/v1/auth/refresh — rotate refresh token, return fresh access token.
// The frontend calls this after the OAuth redirect (and whenever the
// access token expires), keeping the access token in memory.
export const refresh = asyncHandler(async (req, res) => {
  const refreshToken = req.cookies?.[REFRESH_COOKIE_NAME];

  const result = await authService.refreshSession(refreshToken);

  setRefreshCookie(res, result.refreshToken);

  return res.status(200).json({
    success: true,
    message: "Tokens refreshed successfully",
    data: { accessToken: result.accessToken },
  });
});

// POST /api/v1/auth/logout — revoke session, clear cookie. Always 200.
export const logout = asyncHandler(async (req, res) => {
  const refreshToken = req.cookies?.[REFRESH_COOKIE_NAME];

  await authService.logoutSession(refreshToken);

  clearRefreshCookie(res);

  return res.status(200).json({
    success: true,
    message: "Logged out successfully",
  });
});

export const getCurrentUser = asyncHandler(async (req, res) => {
  const userId = req.user.id;

  const response = await authService.getCurrentUser(userId);

  return res.status(200).json({
    success: true,
    message: "User fetched successfully",
    data: response,
  });
});
