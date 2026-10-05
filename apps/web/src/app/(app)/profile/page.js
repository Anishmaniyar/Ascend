"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { ArrowRightIcon } from "@/components/ui/icons";
import SectionCard from "@/components/dashboard/SectionCard";
import ContinueCard from "@/components/dashboard/ContinueCard";
import DashboardBadges from "@/components/dashboard/DashboardBadges";
import DonutMetricCard from "@/components/dashboard/DonutMetricCard";
import PracticeHistoryList from "@/components/dashboard/PracticeHistoryList";
import RecommendedTopics from "@/components/dashboard/RecommendedTopics";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import Heatmap from "@/components/charts/Heatmap";
import {
  getProfile,
  getProfileStats,
  getContinueSession,
  getPracticeHistory,
  getHeatmap,
  getSkills,
  getRecommendations,
  getBadges,
} from "@/lib/api/profile";
import {
  safePct,
  toSidebarUser,
  daysToWeeks,
} from "@/lib/profileView";

const ViewAll = ({ href }) => (
  <Link
    href={href}
    className="inline-flex items-center gap-1 font-polysans text-13 tracking-[-0.02em] text-slate transition-colors hover:text-ember"
  >
    View all
    <ArrowRightIcon className="h-3.5 w-3.5" />
  </Link>
);

// ── Page ──────────────────────────────────────────────────────────────

export default function ProfilePage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const [
        profile,
        stats,
        cont,
        history,
        heatmap,
        skills,
        recommendations,
        badges,
      ] = await Promise.all([
        getProfile(),
        getProfileStats(),
        getContinueSession(),
        getPracticeHistory(),
        getHeatmap(),
        getSkills(),
        getRecommendations(),
        getBadges(),
      ]);
      setData({
        profile,
        stats,
        cont,
        history,
        heatmap,
        skills,
        recommendations,
        badges,
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  if (loading) {
    return (
      <div className="mx-auto w-full max-w-[var(--page-max-width)] px-6 py-10">
        <p className="text-13 text-slate">Loading your profile…</p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="mx-auto w-full max-w-[var(--page-max-width)] px-6 py-10">
        <div className="rounded-2xl bg-ash p-6 text-13 text-steel">
          <p>Couldn&apos;t load your profile: {error}</p>
          <button
            type="button"
            onClick={load}
            className="mt-3 font-polysans text-graphite underline underline-offset-2 hover:text-ember"
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  const { profile, stats, cont, history, heatmap, skills, recommendations, badges } = data;

  const solved = stats.questionsSolved;
  const accuracy = stats.accuracy;
  const correct = Math.round((accuracy / 100) * solved);
  const totalSessions = stats.practiceSessions;
  const practiceCount = stats.byMode?.practice ?? totalSessions;
  const testCount = stats.byMode?.test ?? 0;
  const diff = stats.byDifficulty || {};
  const easy = diff.easy || { attempted: 0, total: 0 };
  const medium = diff.medium || { attempted: 0, total: 0 };
  const hard = diff.hard || { attempted: 0, total: 0 };

  const weeks = daysToWeeks(heatmap.days || []);
  const heatStats = {
    questionsSolved: solved,
    totalActiveDays: heatmap.totalActiveDays,
    maxStreak: heatmap.maxStreak,
    currentStreak: stats.currentStreak,
  };

  const historyItems = history.map((h) => ({
    id: h.sessionId,
    subtopic: h.subtopic,
    topic: h.topic,
    mode: h.mode,
    score: h.score,
    total: h.questionsAttempted,
    accuracy: h.accuracy,
    date: h.completedAt,
  }));

  return (
    <div className="mx-auto w-full max-w-[var(--page-max-width)] px-6 py-10">
      {/* ── Two-column layout ──────────────────────────────────────── */}
      <div className="flex flex-col gap-8 lg:flex-row">
        {/* ── Left: Profile sidebar (sticky) ──────────────────────── */}
        <DashboardSidebar user={toSidebarUser(profile)} skills={skills} />

        {/* ── Right: Main content ─────────────────────────────────── */}
        <div className="min-w-0 flex-1 space-y-6">
          {/* 1. Resume Practice — full width (hidden when none active) */}
          <ContinueCard session={cont} />

          {/* 2. Practice Statistics + Badges — side by side */}
          <div className="border-t border-mist pt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
            {/* Left: Practice Statistics */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
              <DonutMetricCard
                label="Questions Solved"
                centerText={solved}
                centerLabel="Solved"
                segments={[
                  { value: easy.attempted, color: "#3f8f62", label: "Easy" },
                  { value: medium.attempted, color: "#c9a348", label: "Medium" },
                  { value: hard.attempted, color: "#e07a5f", label: "Hard" },
                ]}
                details={[
                  { label: "Easy", value: easy.attempted, color: "#3f8f62", percent: safePct(easy.attempted, easy.total), subtext: "/ " + easy.total },
                  { label: "Medium", value: medium.attempted, color: "#c9a348", percent: safePct(medium.attempted, medium.total), subtext: "/ " + medium.total },
                  { label: "Hard", value: hard.attempted, color: "#e07a5f", percent: safePct(hard.attempted, hard.total), subtext: "/ " + hard.total },
                ]}
              />

              <DonutMetricCard
                label="Accuracy"
                centerText={`${accuracy}%`}
                centerLabel="Accuracy"
                segments={[
                  { value: accuracy, color: "#3f8f62", label: "Correct" },
                  { value: 100 - accuracy, color: "#c95c5c", label: "Mistakes" },
                ]}
                details={[
                  { label: "Correct answers", value: correct, color: "#3f8f62", percent: accuracy },
                  { label: "Incorrect / Skipped", value: solved - correct, color: "#c95c5c", percent: 100 - accuracy },
                ]}
              />

              <DonutMetricCard
                label="Sessions"
                centerText={totalSessions}
                centerLabel="Total"
                segments={[
                  { value: practiceCount, color: "#d9b45b", label: "Practice" },
                  { value: testCount, color: "#3f8f62", label: "Test" },
                ]}
                details={[
                  { label: "Practice sessions", value: practiceCount, color: "#d9b45b", percent: safePct(practiceCount, totalSessions), subtext: safePct(practiceCount, totalSessions) + "%" },
                  { label: "Test sessions", value: testCount, color: "#3f8f62", percent: safePct(testCount, totalSessions), subtext: safePct(testCount, totalSessions) + "%" },
                ]}
              />
            </div>

            {/* Right: Badges */}
            <DashboardBadges badges={badges} />
          </div>

          {/* 3. Activity Heatmap */}
          <div className="border-t border-mist pt-6">
            <h3 className="font-polysans text-subheading tracking-[-0.02em] text-graphite">
              Activity
            </h3>
            <div className="mt-5">
              <Heatmap weeks={weeks} stats={heatStats} />
            </div>
          </div>

          {/* 4. Practice History */}
          <div className="border-t border-mist pt-6">
            <div className="flex items-center justify-between gap-4">
              <h3 className="font-polysans text-subheading tracking-[-0.02em] text-graphite">
                Practice History
              </h3>
              <ViewAll href="/practice-history" />
            </div>
            <div className="mt-5">
              <PracticeHistoryList sessions={historyItems} />
            </div>
          </div>

          {/* 5. Recommended weak topics */}
          <div className="border-t border-mist pt-6">
            <div className="flex items-center justify-between gap-4">
              <h3 className="font-polysans text-subheading tracking-[-0.02em] text-graphite">
                Recommended for you
              </h3>
              <span className="font-polysans text-13 tracking-[-0.02em] text-slate">
                Based on your accuracy
              </span>
            </div>
            <div className="mt-5">
              <RecommendedTopics topics={recommendations} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
