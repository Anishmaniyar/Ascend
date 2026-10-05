import * as LeaderboardRepository from "./leaderboard.repository.js";

const RESET_INFO = {
  weekly: "Resets every Monday",
  monthly: "Resets on the 1st of each month",
  alltime: "All-time standings",
};

const initialsOf = (name) => {
  const parts = (name || "").trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  return (
    parts[0][0] + (parts.length > 1 ? parts[parts.length - 1][0] : "")
  ).toUpperCase();
};

export const getLeaderboardService = async (userId, period, sort) => {
  const rows = await LeaderboardRepository.aggregateForLeaderboard(period);

  const active = rows.filter((r) => r.solved > 0 || r.sessions > 0);

  const sorters = {
    score: (a, b) => b.score - a.score,
    questions: (a, b) => b.solved - a.solved,
    accuracy: (a, b) => b.accuracy - a.accuracy || b.solved - a.solved,
    streak: (a, b) => b.streak - a.streak,
  };
  active.sort(sorters[sort]);

  const entries = active.slice(0, 100).map((r, i) => ({
    rank: i + 1,
    userId: r.userId,
    name: r.name,
    initials: initialsOf(r.name),
    questionsSolved: r.solved,
    accuracy: r.accuracy,
    sessions: r.sessions,
    streak: r.streak,
    score: r.score,
    isCurrentUser: r.userId === userId,
  }));

  const mine = entries.find((e) => e.isCurrentUser) || null;

  return {
    entries,
    currentUserRank: mine,
    resetInfo: RESET_INFO[period],
    period,
    sort,
  };
};
