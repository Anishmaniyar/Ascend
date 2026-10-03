import AppError from "../utils/AppError.js";
import asyncHandler from "../utils/asyncHandler.js";
import { findSessionById } from "../modules/practiceSession/practice-session.repository.js";

// Ownership gate for routes carrying a practice-session `:id` param.
// Establishes: session exists (404) AND caller owns it (403).
// Attaches a light session summary as req.practiceSession.
//
// Business state (completed/active/duplicate) stays in the service layer —
// middleware answers only "may this user touch this session?".
// Existing service-level ownership checks are kept as defense in depth.
export const requirePracticeSessionOwnership = asyncHandler(
  async (req, res, next) => {
    if (!req.user) {
      throw new AppError("Authentication required", 401);
    }

    const session = await findSessionById(req.params.id);

    if (!session) {
      throw new AppError("Practice session not found", 404);
    }

    if (session.userId !== req.user.id) {
      throw new AppError("Access Denied: You do not own this session", 403);
    }

    req.practiceSession = session;
    next();
  },
);
