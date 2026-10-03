import { Router } from "express";
import {
  getCurrentUser,
  googleAuthStart,
  googleCallback,
  logout,
  refresh,
} from "./auth.controllers.js";
import { authenticate } from "../../middleware/authenticate.middleware.js";

const router = Router();

// NOTE: POST /register and POST /login (email/password) removed for V1.
// Google is the only way in; the callback completes login AND signup.

// Start Google OAuth flow -> redirects to Google
router.get("/google", googleAuthStart);

// Google redirect URI -> session creation -> refresh cookie -> frontend redirect
router.get("/google/callback", googleCallback);

// Rotate refresh token -> new access token + new refresh cookie
router.post("/refresh", refresh);

// Revoke session -> clear refresh cookie
router.post("/logout", logout);

router.get("/me", authenticate, getCurrentUser);

export default router;
