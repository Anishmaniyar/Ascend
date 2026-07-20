import AppError from "../../utils/AppError.js";
import * as ProfileRepository from "./profile.repository.js";

import {
  findUserStats,
  countUniqueQuestionsSolved,
  countCorrectAttempts,
  countPracticeSessions,
} from "./profile.repository.js";

export const getProfileService = async (userId) => {
  const data = await ProfileRepository.findProfileById(userId);

  if (!data) {
    throw new AppError("User profile not found", 404);
  }

  return data;
};

export const getProfileStatsService = async (userId) => {
  const [userStats, questionsSolved, correctAnswers, practiceSessions] =
    await Promise.all([
      findUserStats(userId),
      countUniqueQuestionsSolved(userId),
      countCorrectAttempts(userId),
      countPracticeSessions(userId),
    ]);

  const accuracy =
    questionsSolved === 0
      ? 0
      : Number(((correctAnswers / questionsSolved) * 100).toFixed(2));

  return {
    questionsSolved,
    practiceSessions,
    accuracy,
    currentStreak: userStats.currentStreak,
    longestStreak: userStats.longestStreak,
  };
};

export const getPracticeHistoryService = async (userId) => {
  const sessions = await ProfileRepository.findPracticeHistory(userId);

  return sessions.map((session) => {
    const totalQuestions = session.attempts.length;

    const score = session.attempts.filter(
      (attempt) => attempt.isCorrect,
    ).length;

    const accuracy =
      totalQuestions === 0
        ? 0
        : Number(((score / totalQuestions) * 100).toFixed(2));

    return {
      sessionId: session.id,
      subtopic: session.subtopic.title,
      mode: session.mode,
      score,
      accuracy,
      completedAt: session.completedAt,
    };
  });
};

export const getUserHeatmapData = async (userId) => {
  const rawData = await ActivityRepository.getUserDailyActivityCounts(userId);

  const dateMap = new Map();

  rawData.forEach((item) => {
    const dateString = item.startedAt.toISOString().split("T")[0];

    const currentCount = dateMap.get(dateString) || 0;
    dateMap.set(dateString, currentCount + item._count.id);
  });

  return Array.from(dateMap.entries()).map(([date, count]) => ({
    date,
    count,
  }));
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

  return Object.values(topicStats).map((topic) => ({
    topic: topic.topic,
    solved: topic.solved,
    accuracy: Math.round((topic.correct / topic.solved) * 100),
  }));
};
