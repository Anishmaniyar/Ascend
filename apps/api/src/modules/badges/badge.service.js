import * as BadgeRepository from "./badge.repository.js";
import { BADGE_DEFINITIONS } from "./badge.constants.js";

// ---------------------------------------------------------------------------
// Achievement evaluation (Phase 16).
//
// Flow: attempt created (or session completed) → evaluateAchievements(userId)
// → rule met? → UserBadge row. Runs synchronously inside the request for now;
// promote to a background job only when it shows up in latency profiles
// (no BullMQ for badges in V1 — deliberate, see design doc).
//
// Guarantees: idempotent (checks existing grant first), race-safe (P2002 on
// UNIQUE(userId, badgeId) is swallowed), and never throws — badge failures
// must not fail the practice request. Callers still wrap in catch.
// ---------------------------------------------------------------------------

export const PERFECT_SESSION_MIN_QUESTIONS = 5;
export const STREAK_BADGE_DAYS = 7;

export const currentStreakFromDates = (dateStrings) => {
  const days = [...new Set(dateStrings)].sort();
  if (days.length === 0) return 0;
  // Streak ending today (or yesterday — still alive until end of today).
  const today = new Date().toISOString().split("T")[0];
  const yesterday = new Date(Date.now() - 86_400_000)
    .toISOString()
    .split("T")[0];
  if (days[days.length - 1] !== today && days[days.length - 1] !== yesterday) {
    return 0;
  }
  let streak = 1;
  for (let i = days.length - 1; i > 0; i--) {
    const curr = new Date(`${days[i]}T00:00:00Z`).getTime();
    const prev = new Date(`${days[i - 1]}T00:00:00Z`).getTime();
    if (curr - prev === 86_400_000) streak++;
    else break;
  }
  return streak;
};

const grantBadge = async (userId, code) => {
  const badge = await BadgeRepository.findBadgeByCode(code);
  if (!badge) return null; // Unseeded DB — skip silently.

  const existing = await BadgeRepository.findUserBadge(userId, badge.id);
  if (existing) return null;

  try {
    await BadgeRepository.createUserBadge(userId, badge.id);
    return code;
  } catch (error) {
    // Lost a grant race with another request — the other row wins.
    if (error?.code === "P2002") return null;
    throw error;
  }
};

export const evaluateAchievements = async (userId) => {
  const earned = [];
  try {
    const [
      attemptCount,
      uniqueSolved,
      testSessions,
      perfectSession,
      activityDates,
    ] = await Promise.all([
      BadgeRepository.countAttempts(userId),
      BadgeRepository.countUniqueSolved(userId),
      BadgeRepository.countCompletedSessionsByMode(userId, "TEST"),
      BadgeRepository.findPerfectCompletedSession(
        userId,
        PERFECT_SESSION_MIN_QUESTIONS,
      ),
      BadgeRepository.findActivityDates(userId),
    ]);

    const checks = [
      [attemptCount >= 1, "FIRST_SOLVE"],
      [uniqueSolved >= 10, "TEN_SOLVES"],
      [uniqueSolved >= 100, "HUNDRED_SOLVES"],
      [testSessions >= 1, "FIRST_TEST"],
      [perfectSession !== null, "PERFECT_SESSION"],
      [
        currentStreakFromDates(activityDates) >= STREAK_BADGE_DAYS,
        "SEVEN_DAY_STREAK",
      ],
    ];

    for (const [met, code] of checks) {
      if (!met) continue;
      const granted = await grantBadge(userId, code);
      if (granted) earned.push(granted);
    }
  } catch {
    // Badge evaluation is best-effort by design; practice data is already
    // persisted at this point, so swallow and let the next event retry.
  }
  return earned;
};

// GET /profile/badges shape (Phase 14). The frontend never learns how
// badges are stored — earned flag + earnedAt only.
export const listBadgesForUser = async (userId) => {
  const [all, earned] = await Promise.all([
    BadgeRepository.findAllBadges(),
    BadgeRepository.findUserBadgesWithDetails(userId),
  ]);

  const earnedByBadgeId = new Map(
    earned.map((e) => [e.badgeId, e.earnedAt]),
  );

  return all.map((b) => ({
    code: b.code,
    name: b.name,
    description: b.description,
    icon: b.icon,
    category: b.category,
    earned: earnedByBadgeId.has(b.id),
    earnedAt: earnedByBadgeId.get(b.id) ?? null,
  }));
};

export { BADGE_DEFINITIONS };
