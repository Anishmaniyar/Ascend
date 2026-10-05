import AppError from "../../utils/AppError.js";
import * as ProfileRepository from "./profile.repository.js";

// ---------------------------------------------------------------------------
// Skill levels (Phase 8). Product rules live HERE, not in the DB and not in
// the frontend. A level is derived from (solved, accuracy) on every read.
// ---------------------------------------------------------------------------

export const SKILL_MIN_SOLVED = 10;

export const resolveSkillLevel = (solved, accuracy) => {
  if (solved < SKILL_MIN_SOLVED) return "fundamental"; // developing
  if (accuracy < 50) return "fundamental";
  if (accuracy <= 75) return "intermediate";
  return "advanced";
};

// ---------------------------------------------------------------------------
// Helpers (pure, unit-testable).
// ---------------------------------------------------------------------------

export const buildInitials = (displayName, name) => {
  const source = (displayName || name || "").trim();
  if (!source) return "?";
  const parts = source.split(/\s+/);
  return (parts[0][0] + (parts.length > 1 ? parts[parts.length - 1][0] : ""))
    .toUpperCase();
};

// Max run of consecutive UTC calendar days in ["2026-10-01", ...].
export const maxConsecutiveDayStreak = (dateStrings) => {
  if (dateStrings.length === 0) return 0;
  const days = [...new Set(dateStrings)].sort();
  let max = 1;
  let run = 1;
  for (let i = 1; i < days.length; i++) {
    const prev = new Date(`${days[i - 1]}T00:00:00Z`).getTime();
    const curr = new Date(`${days[i]}T00:00:00Z`).getTime();
    if (curr - prev === 86_400_000) {
      run++;
      max = Math.max(max, run);
    } else {
      run = 1;
    }
  }
  return max;
};

const toProfileDTO = (user) => {
  const p = user.profile || {};
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    memberSince: user.createdAt,
    displayName: p.displayName ?? user.name,
    handle: p.handle ?? null,
    avatarUrl: p.avatarUrl ?? user.avatar ?? null,
    bio: p.bio ?? user.bio ?? null,
    gender: p.gender ?? null,
    dateOfBirth: p.dateOfBirth ?? null,
    location: p.location ?? null,
    githubUrl: p.githubUrl ?? null,
    linkedinUrl: p.linkedinUrl ?? null,
    leetcodeUrl: p.leetcodeUrl ?? null,
    xUrl: p.xUrl ?? null,
    websiteUrl: p.websiteUrl ?? null,
    targetCompanies: p.targetCompanies ?? [],
    dailyQuestionGoal: p.dailyQuestionGoal ?? 20,
    initials: buildInitials(p.displayName, user.name),
  };
};

// ---------------------------------------------------------------------------
// getProfile / updateProfile (Phase 10).
// getProfile: repository (User + Profile) → DTO. Never exposes roleId,
// password material, or Google IDs.
// ---------------------------------------------------------------------------

export const getProfileService = async (userId) => {
  const user = await ProfileRepository.findUserWithProfile(userId);

  if (!user) {
    throw new AppError("User profile not found", 404);
  }

  if (!user.profile) {
    // Self-healing for rows predating the Profile table (same guarantee as
    // the login-time backfill in auth.service).
    const base =
      (user.email?.split("@")[0] || user.name || "user")
        .toLowerCase()
        .replace(/[^a-z0-9_]/g, "_")
        .slice(0, 20) || "user";
    let created = false;
    for (let attempt = 0; attempt < 10 && !created; attempt++) {
      try {
        await ProfileRepository.createProfileForUser(userId, {
          displayName: user.name,
          handle: attempt === 0 ? base : `${base}${attempt}`.slice(0, 50),
        });
        created = true;
      } catch (error) {
        if (error?.code !== "P2002") throw error;
      }
    }
    if (!created) {
      await ProfileRepository.createProfileForUser(userId, {
        displayName: user.name,
      });
    }
    return getProfileService(userId);
  }

  return toProfileDTO(user);
};

const buildHandleBase = (handle) =>
  handle
    .toLowerCase()
    .replace(/[^a-z0-9_]/g, "_")
    .slice(0, 50) || "user";

// Columns writable via PATCH /profile. Everything else (userId, email,
// roleId, streaks) is rejected even if it reaches the service.
const UPDATABLE_PROFILE_FIELDS = [
  "displayName",
  "handle",
  "bio",
  "gender",
  "dateOfBirth",
  "location",
  "avatarUrl",
  "githubUrl",
  "linkedinUrl",
  "leetcodeUrl",
  "xUrl",
  "websiteUrl",
  "targetCompanies",
  "dailyQuestionGoal",
];

const pickUpdatable = (data) =>
  Object.fromEntries(
    Object.entries(data).filter(([k]) => UPDATABLE_PROFILE_FIELDS.includes(k)),
  );

export const updateProfileService = async (userId, data) => {
  data = pickUpdatable(data);
  const user = await ProfileRepository.findUserWithProfile(userId);

  if (!user) {
    throw new AppError("User profile not found", 404);
  }

  if (data.handle !== undefined && data.handle !== null) {
    const normalized = buildHandleBase(data.handle);
    const taken = await ProfileRepository.findProfileByHandle(normalized);
    if (taken && taken.userId !== userId) {
      throw new AppError("Handle is already taken", 409);
    }
    data = { ...data, handle: normalized };
  }

  try {
    await ProfileRepository.updateProfileByUserId(userId, data);
  } catch (error) {
    if (error?.code === "P2025") {
      // No Profile row yet (legacy user) → create it with this data.
      const { handle, ...rest } = data;
      await ProfileRepository.createProfileForUser(userId, {
        displayName: user.name,
        ...rest,
        ...(handle ? { handle } : {}),
      });
    } else if (error?.code === "P2002") {
      throw new AppError("Handle is already taken", 409);
    } else {
      throw error;
    }
  }

  return getProfileService(userId);
};

export const clearAvatarService = async (userId) => {
  const user = await ProfileRepository.findUserWithProfile(userId);

  if (!user) {
    throw new AppError("User profile not found", 404);
  }

  if (!user.profile) {
    return getProfileService(userId);
  }

  await ProfileRepository.updateProfileByUserId(userId, { avatarUrl: null });
  return getProfileService(userId);
};

// ---------------------------------------------------------------------------
// Derived reads (Phases 17–20). No new tables; everything aggregates
// PracticeSession + Attempt (+ Question difficulty for the breakdown).
// ---------------------------------------------------------------------------

export const getProfileStatsService = async (userId) => {
  const [
    userStats,
    questionsSolved,
    correctAnswers,
    practiceSessions,
    practiceCount,
    testCount,
    difficultyTotals,
    difficultyAttempts,
  ] = await Promise.all([
    ProfileRepository.findUserStats(userId),
    ProfileRepository.countUniqueQuestionsSolved(userId),
    ProfileRepository.countCorrectAttempts(userId),
    ProfileRepository.countPracticeSessions(userId),
    ProfileRepository.countSessionsByMode(userId, "PRACTICE"),
    ProfileRepository.countSessionsByMode(userId, "TEST"),
    ProfileRepository.countQuestionsByDifficulty(),
    ProfileRepository.findAttemptsWithDifficulty(userId),
  ]);

  if (!userStats) {
    throw new AppError("User profile not found", 404);
  }

  const accuracy =
    questionsSolved === 0
      ? 0
      : Number(((correctAnswers / questionsSolved) * 100).toFixed(2));

  // Attempts per difficulty (denominators for donut segments; unique-count
  // variants stay out until a product surface needs them).
  const byDifficulty = { easy: 0, medium: 0, hard: 0 };
  const correctByDifficulty = { easy: 0, medium: 0, hard: 0 };
  for (const a of difficultyAttempts) {
    const key = a.question.difficulty.toLowerCase();
    byDifficulty[key]++;
    if (a.isCorrect) correctByDifficulty[key]++;
  }

  return {
    questionsSolved,
    practiceSessions,
    accuracy,
    currentStreak: userStats.currentStreak,
    longestStreak: userStats.longestStreak,
    byMode: { practice: practiceCount, test: testCount },
    byDifficulty: {
      easy: { attempted: byDifficulty.easy, correct: correctByDifficulty.easy, total: difficultyTotals.EASY },
      medium: { attempted: byDifficulty.medium, correct: correctByDifficulty.medium, total: difficultyTotals.MEDIUM },
      hard: { attempted: byDifficulty.hard, correct: correctByDifficulty.hard, total: difficultyTotals.HARD },
    },
  };
};

export const getPracticeHistoryService = async (userId) => {
  const sessions = await ProfileRepository.findPracticeHistory(userId);

  return sessions.map((session) => {
    const questionsAttempted = session.attempts.length;

    const correctAnswers = session.attempts.filter(
      (attempt) => attempt.isCorrect,
    ).length;

    const accuracy =
      questionsAttempted === 0
        ? 0
        : Number(((correctAnswers / questionsAttempted) * 100).toFixed(2));

    const durationMs =
      session.startedAt && session.completedAt
        ? session.completedAt.getTime() - session.startedAt.getTime()
        : null;

    return {
      sessionId: session.id,
      topic: session.subtopic.topic.title,
      subtopic: session.subtopic.title,
      mode: session.mode,
      questionsAttempted,
      correctAnswers,
      score: correctAnswers,
      accuracy,
      durationMs,
      completedAt: session.completedAt,
    };
  });
};

export const getUserHeatmapData = async (userId) => {
  const rawData =
    await ProfileRepository.getUserDailyActivityCounts(userId);

  const dateMap = new Map();

  rawData.forEach((item) => {
    const dateString = item.startedAt.toISOString().split("T")[0];

    const currentCount = dateMap.get(dateString) || 0;
    dateMap.set(dateString, currentCount + 1);
  });

  const days = Array.from(dateMap.entries()).map(([date, count]) => ({
    date,
    count,
  }));

  return {
    days,
    totalActiveDays: days.length,
    maxStreak: maxConsecutiveDayStreak(days.map((d) => d.date)),
  };
};

export const calculateSkills = async (userId) => {
  const attempts = await ProfileRepository.findAttemptsWithTopics(userId);

  const topicStats = {};

  for (const attempt of attempts) {
    const topic = attempt.question.subtopic.topic;

    if (!topicStats[topic.id]) {
      topicStats[topic.id] = {
        topic: topic.title,
        solved: 0,
        correct: 0,
      };
    }

    topicStats[topic.id].solved++;

    if (attempt.isCorrect) {
      topicStats[topic.id].correct++;
    }
  }

  return Object.values(topicStats).map((topic) => {
    const accuracy = Math.round((topic.correct / topic.solved) * 100);
    return {
      topic: topic.topic,
      solved: topic.solved,
      accuracy,
      level: resolveSkillLevel(topic.solved, accuracy),
    };
  });
};

export const getContinueSessionService = async (userId) => {
  const session =
    await ProfileRepository.findMostRecentActiveSession(userId);

  if (!session) return null;

  const done = session.attempts.length;
  const correct = session.attempts.filter((a) => a.isCorrect).length;
  const total = await ProfileRepository.countQuestionsInSubtopic(
    session.subtopic.id,
  );

  return {
    sessionId: session.id,
    topic: session.subtopic.topic.title,
    subtopic: session.subtopic.title,
    mode: session.mode,
    done,
    total,
    accuracy: done === 0 ? 0 : Number(((correct / done) * 100).toFixed(2)),
    startedAt: session.startedAt,
  };
};

export const getRecommendationsService = async (userId, limit = 3) => {
  const skills = await calculateSkills(userId);

  return skills
    .filter((s) => s.solved > 0)
    .sort((a, b) => a.accuracy - b.accuracy || b.solved - a.solved)
    .slice(0, limit)
    .map((s, i) => ({
      topic: s.topic,
      accuracy: s.accuracy,
      solved: s.solved,
      reason: i === 0 ? "Lowest accuracy" : "Needs practice",
    }));
};

// ---------------------------------------------------------------------------
// Progress composite (one request powers the progress page + topic cards).
// Convention mirrors getProfileStatsService: accuracy = correct attempts /
// unique questions solved; solved = distinct questionIds.
// ---------------------------------------------------------------------------

const monthKey = (d) =>
  `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, "0")}`;

const monthLabel = (d) =>
  d.toLocaleString("en-US", { month: "short", timeZone: "UTC" });

export const getProgressService = async (userId) => {
  const [tree, attempts, sessions, totalSessions] = await Promise.all([
    ProfileRepository.findCurriculumTree(),
    ProfileRepository.findAttemptsForProgress(userId),
    ProfileRepository.findCompletedSessionsForProgress(userId),
    ProfileRepository.countAllSessions(userId),
  ]);

  // Totals from the curriculum.
  let totalQuestions = 0;
  const subtopicTotals = new Map();
  const topicTotals = new Map();
  for (const t of tree) {
    let topicTotal = 0;
    for (const s of t.subtopics) {
      const n = s._count.questions;
      subtopicTotals.set(s.id, { topicId: t.id, name: s.title, total: n });
      topicTotal += n;
      totalQuestions += n;
    }
    topicTotals.set(t.id, { name: t.title, total: topicTotal });
  }

  // Per-question correctness (ever-correct) + per-attempt tallies.
  const uniqueSolved = new Set();
  const correctQuestions = new Set();
  const subStats = new Map(); // subtopicId -> {attempted, correct, unique:Set}
  const topicStats = new Map(); // topicId -> {attempted, correct, unique:Set}
  const diffStats = {
    EASY: { attempted: 0, correct: 0 },
    MEDIUM: { attempted: 0, correct: 0 },
    HARD: { attempted: 0, correct: 0 },
  };
  const byMonth = new Map(); // monthKey -> {unique:Set, correct, attempted}
  for (const a of attempts) {
    uniqueSolved.add(a.questionId);
    if (a.isCorrect) correctQuestions.add(a.questionId);
    const sub = a.question.subtopic;
    const top = sub.topic;
    if (!subStats.has(sub.id))
      subStats.set(sub.id, { attempted: 0, correct: 0, unique: new Set() });
    if (!topicStats.has(top.id))
      topicStats.set(top.id, { attempted: 0, correct: 0, unique: new Set() });
    const ss = subStats.get(sub.id);
    const ts = topicStats.get(top.id);
    ss.attempted++;
    ts.attempted++;
    ss.unique.add(a.questionId);
    ts.unique.add(a.questionId);
    if (a.isCorrect) {
      ss.correct++;
      ts.correct++;
    }
    const dd = diffStats[a.question.difficulty];
    dd.attempted++;
    if (a.isCorrect) dd.correct++;
    const mk = monthKey(a.createdAt);
    if (!byMonth.has(mk))
      byMonth.set(mk, { unique: new Set(), correct: 0, attempted: 0 });
    const mm = byMonth.get(mk);
    mm.unique.add(a.questionId);
    mm.attempted++;
    if (a.isCorrect) mm.correct++;
  }

  const accuracy =
    uniqueSolved.size === 0
      ? 0
      : Number(((correctQuestions.size / uniqueSolved.size) * 100).toFixed(2));

  // Last 6 calendar months (oldest → newest), zero-filled for chart continuity.
  const now = new Date();
  const monthlyTrend = [];
  for (let i = 5; i >= 0; i--) {
    const d = new Date(
      Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - i, 1),
    );
    const key = monthKey(d);
    const m = byMonth.get(key);
    const solved = m ? m.unique.size : 0;
    monthlyTrend.push({
      month: key,
      label: monthLabel(d),
      questionsSolved: solved,
      accuracy:
        solved === 0 ? 0 : Number(((m.correct / solved) * 100).toFixed(2)),
    });
  }

  const pct = (n, t) => (t === 0 ? 0 : Math.round((n / t) * 100));

  const topics = [...topicTotals.entries()].map(([id, t]) => {
    const s = topicStats.get(id);
    const solved = s ? s.unique.size : 0;
    const correct = s ? s.correct : 0;
    const attempted = s ? s.attempted : 0;
    return {
      id,
      name: t.name,
      solved,
      total: t.total,
      progress: pct(solved, t.total),
      accuracy: attempted === 0 ? 0 : Math.round((correct / attempted) * 100),
    };
  });

  const subtopics = [...subtopicTotals.entries()].map(([id, s]) => {
    const st = subStats.get(id);
    const solved = st ? st.unique.size : 0;
    const correct = st ? st.correct : 0;
    const attempted = st ? st.attempted : 0;
    return {
      id,
      topicId: s.topicId,
      name: s.name,
      solved,
      total: s.total,
      attempted,
      accuracy: attempted === 0 ? 0 : Math.round((correct / attempted) * 100),
    };
  });

  const eligible = subtopics.filter((s) => s.attempted >= 3);
  const byAccDesc = [...eligible].sort((a, b) => b.accuracy - a.accuracy);
  const strengths = byAccDesc.slice(0, 3);
  const weaknesses = [...eligible]
    .sort((a, b) => a.accuracy - b.accuracy)
    .slice(0, 3);

  let totalPracticeTimeMs = 0;
  for (const s of sessions) {
    if (s.startedAt && s.completedAt) {
      totalPracticeTimeMs += s.completedAt.getTime() - s.startedAt.getTime();
    }
  }
  const avgSessionDurationMs =
    sessions.length === 0
      ? 0
      : Math.round(totalPracticeTimeMs / sessions.length);
  const spanDays =
    sessions.length <= 1
      ? 7
      : Math.max(
          7,
          Math.ceil(
            (sessions[sessions.length - 1].completedAt.getTime() -
              sessions[0].completedAt.getTime()) /
              86_400_000,
          ),
        );
  const sessionsPerWeek = Number(
    ((sessions.length / spanDays) * 7).toFixed(1),
  );

  const diffTotals = await ProfileRepository.countQuestionsByDifficulty();
  const diffAccuracy = {};
  for (const [k, v] of Object.entries(diffStats)) {
    const key = k.toLowerCase();
    diffAccuracy[key] = {
      accuracy:
        v.attempted === 0 ? 0 : Math.round((v.correct / v.attempted) * 100),
      attempted: v.attempted,
      total: diffTotals[k],
    };
  }

  return {
    radial: {
      questionsSolved: { solved: uniqueSolved.size, total: totalQuestions },
      accuracy,
      practiceSessions: { completed: sessions.length, total: totalSessions },
    },
    monthlyTrend,
    difficulty: { overall: accuracy, ...diffAccuracy },
    topics,
    subtopics,
    strengths,
    weaknesses,
    time: {
      totalPracticeTimeMs,
      avgSessionDurationMs,
      sessionsPerWeek,
      completedSessions: sessions.length,
    },
  };
};
