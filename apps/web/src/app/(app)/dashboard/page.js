"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import {
  ArrowRightIcon,
  LockIcon,
  FootprintIcon,
  TargetIcon,
  ZapIcon,
  BrainIcon,
  FlameIcon,
  TrophyIcon,
  ClipboardCheckIcon,
  CrownIcon,
} from "@/components/ui/icons";
import SectionCard from "@/components/dashboard/SectionCard";
import ContinueCard from "@/components/dashboard/ContinueCard";
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

const BADGE_ICON_MAP = {
  FootprintIcon,
  TargetIcon,
  ZapIcon,
  BrainIcon,
  FlameIcon,
  TrophyIcon,
  ClipboardCheckIcon,
  CrownIcon,
};

const ViewAll = ({ href }) => (
  <Link
    href={href}
    className="inline-flex items-center gap-1 font-inter text-[12px] text-slate transition-colors hover:text-graphite"
  >
    View all
    <ArrowRightIcon className="h-3.5 w-3.5" />
  </Link>
);

export default function DashboardPage() {
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
      <div className="page-enter mx-auto w-full max-w-[var(--page-max-width)] px-6 py-12 md:py-16">
        <p className="font-inter text-[14px] text-slate">Loading your dashboard…</p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="page-enter mx-auto w-full max-w-[var(--page-max-width)] px-6 py-12 md:py-16">
        <div className="rounded-2xl bg-ash p-6 text-13 text-steel">
          <p>Couldn&apos;t load your dashboard: {error}</p>
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

  const firstName = (profile.displayName || "").split(" ")[0];
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

  const historyItems = history.slice(0, 5).map((h) => ({
    id: h.sessionId,
    subtopic: h.subtopic,
    topic: h.topic,
    mode: h.mode,
    score: h.score,
    total: h.questionsAttempted,
    accuracy: h.accuracy,
    date: h.completedAt,
  }));

  const orderedBadges = [...(badges || [])].sort(
    (a, b) => Number(b.earned) - Number(a.earned),
  );
  const earnedCount = orderedBadges.filter((b) => b.earned).length;

  return (
    <div className="page-enter mx-auto w-full max-w-[var(--page-max-width)] px-6 py-12 md:py-16">
      {/* Welcome / current goal */}
      <div className="max-w-[640px]">
        <p className="font-inter text-[11px] uppercase tracking-[0.08em] text-slate">
          Dashboard
        </p>
        <h1 className="editorial-heading mt-3 text-[32px] leading-[36px] text-graphite">
          Welcome back{firstName ? `, ${firstName}` : ""}.
        </h1>
        <p className="mt-2.5 font-inter text-[14px] leading-[22px] text-steel">
          {cont ? (
            <>
              {cont.subtopic} is waiting — {cont.done} of {cont.total}{" "}
              questions done.
            </>
          ) : (
            <>Pick a topic and start your first practice session.</>
          )}
        </p>
      </div>

      <div className="mt-10 flex flex-col gap-8 lg:flex-row">
        {/* ── Sidebar ───────────────────────────────────────────────── */}
        <DashboardSidebar user={toSidebarUser(profile)} skills={skills} />

        {/* ── Main content ──────────────────────────────────────────── */}
        <div className="min-w-0 flex-1 space-y-6">
          {/* 1. Resume Practice + Badges — side by side */}
          <div className="flex flex-col gap-6 lg:flex-row">
            <ContinueCard session={cont} />

            {/* Compact Badges — fills remaining space */}
            <Link
              href="/badges"
              className="flex flex-1 items-center gap-4 rounded-cards border border-mist bg-canvas px-5 py-4 transition-colors duration-150 hover:border-mist-strong"
            >
              <div className="flex -space-x-2">
                {orderedBadges.slice(0, 3).map((badge) => {
                  const Icon = BADGE_ICON_MAP[badge.icon] ?? TargetIcon;
                  return (
                    <div
                      key={badge.code}
                      className={`flex h-10 w-10 items-center justify-center rounded-full border-2 border-canvas ${
                        badge.earned ? "bg-ash" : "bg-fog"
                      }`}
                    >
                      {badge.earned ? (
                        <Icon className="h-5 w-5 text-graphite" />
                      ) : (
                        <LockIcon className="h-4 w-4 text-slate" />
                      )}
                    </div>
                  );
                })}
              </div>
              <div className="min-w-0">
                <p className="font-polysans text-15 tracking-[-0.02em] text-graphite">
                  Badges
                </p>
                <p className="mt-0.5 text-13 text-slate">
                  {earnedCount} earned
                </p>
              </div>
              <ArrowRightIcon className="ml-auto h-4 w-4 shrink-0 text-slate" />
            </Link>
          </div>

          {/* 2. Practice Statistics — full width horizontal row */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            {/* Questions Solved — 3 segments: Easy / Medium / Hard */}
            <DonutMetricCard
              label="Questions Solved"
              centerText={solved}
              centerLabel="Solved"
              segments={[
                { value: easy.attempted, color: "var(--color-graphite)", label: "Easy" },
                { value: medium.attempted, color: "var(--color-slate)", label: "Medium" },
                { value: hard.attempted, color: "var(--color-faint)", label: "Hard" },
              ]}
              details={[
                { label: "Easy", value: easy.attempted, color: "var(--color-graphite)", percent: safePct(easy.attempted, easy.total), subtext: "/ " + easy.total },
                { label: "Medium", value: medium.attempted, color: "var(--color-slate)", percent: safePct(medium.attempted, medium.total), subtext: "/ " + medium.total },
                { label: "Hard", value: hard.attempted, color: "var(--color-faint)", percent: safePct(hard.attempted, hard.total), subtext: "/ " + hard.total },
              ]}
            />

            {/* Accuracy — 2 segments: Correct / Mistakes */}
            <DonutMetricCard
              label="Accuracy"
              centerText={`${accuracy}%`}
              centerLabel="Accuracy"
              segments={[
                { value: accuracy, color: "var(--color-graphite)", label: "Correct" },
                { value: 100 - accuracy, color: "var(--color-mist-strong)", label: "Mistakes" },
              ]}
              details={[
                { label: "Correct answers", value: correct, color: "var(--color-graphite)", percent: accuracy },
                { label: "Incorrect / Skipped", value: solved - correct, color: "var(--color-mist-strong)", percent: 100 - accuracy },
              ]}
            />

            {/* Sessions — 2 segments: Practice / Test */}
            <DonutMetricCard
              label="Sessions"
              centerText={totalSessions}
              centerLabel="Total"
              segments={[
                { value: practiceCount, color: "var(--color-graphite)", label: "Practice" },
                { value: testCount, color: "var(--color-slate)", label: "Test" },
              ]}
              details={[
                { label: "Practice sessions", value: practiceCount, color: "var(--color-graphite)", percent: safePct(practiceCount, totalSessions), subtext: safePct(practiceCount, totalSessions) + "%" },
                { label: "Test sessions", value: testCount, color: "var(--color-slate)", percent: safePct(testCount, totalSessions), subtext: safePct(testCount, totalSessions) + "%" },
              ]}
            />
          </div>

          {/* 3. Activity Heatmap — full width with stats */}
          <SectionCard title="Activity">
            <Heatmap weeks={weeks} stats={heatStats} />
          </SectionCard>

          {/* 4. Practice History */}
          <SectionCard title="Practice History" action={<ViewAll href="/practice-history" />}>
            <PracticeHistoryList sessions={historyItems} />
          </SectionCard>

          {/* 5. Recommended weak topics */}
          <SectionCard
            title="Recommended for you"
            action={
              <span className="font-polysans text-13 tracking-[-0.02em] text-slate">
                Based on your accuracy
              </span>
            }
          >
            <RecommendedTopics topics={recommendations} />
          </SectionCard>
        </div>
      </div>
    </div>
  );
}
