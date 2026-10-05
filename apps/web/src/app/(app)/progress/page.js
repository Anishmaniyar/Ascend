"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  ArrowRightIcon,
  TrendingUpIcon,
  BrainIcon,
  ClockIcon,
  CalendarIcon,
  TargetIcon,
} from "@/components/ui/icons";
import RingProgress from "@/components/charts/RingProgress";
import MonoRoundedStreamChart from "@/components/charts/MonoRoundedStreamChart";
import GoBack from "@/components/ui/GoBack";
import { getProgress } from "@/lib/api/profile";
import { getTopicIcon } from "@/lib/subtopicIcons";

function formatDurationMs(ms) {
  if (!ms || ms <= 0) return "0m";
  const totalMin = Math.round(ms / 60000);
  if (totalMin < 60) return `${totalMin}m`;
  const h = Math.floor(totalMin / 60);
  const m = totalMin % 60;
  return m === 0 ? `${h}h` : `${h}h ${m}m`;
}

// ═══════════════════════════════════════════════════════════════════════
// MAIN PAGE
// ═══════════════════════════════════════════════════════════════════════

export default function ProgressPage() {
  const [progress, setProgress] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [trendMetric, setTrendMetric] = useState("accuracy");
  const [hoveredRing, setHoveredRing] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      setProgress(await getProgress());
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
        <GoBack className="mb-6" />
        <p className="text-13 text-slate">Loading progress…</p>
      </div>
    );
  }

  if (error || !progress) {
    return (
      <div className="mx-auto w-full max-w-[var(--page-max-width)] px-6 py-10">
        <GoBack className="mb-6" />
        <div className="rounded-2xl bg-ash p-6 text-13 text-steel">
          <p>Couldn&apos;t load progress: {error}</p>
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

  const { radial, monthlyTrend, difficulty, topics, subtopics, strengths, weaknesses, time } = progress;
  const solvedPct =
    radial.questionsSolved.total > 0
      ? (radial.questionsSolved.solved / radial.questionsSolved.total) * 100
      : 0;
  const sessionPct =
    radial.practiceSessions.total > 0
      ? (radial.practiceSessions.completed / radial.practiceSessions.total) * 100
      : 0;
  const trend = monthlyTrend.map((m) => ({ ...m, month: m.label }));
  const practiced = subtopics.filter((s) => s.attempted > 0);

  return (
    <div className="mx-auto w-full max-w-[var(--page-max-width)] px-6 py-10">
      {/* Go back */}
      <GoBack className="mb-6" />

      {/* 1. PAGE HEADER */}
      <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="font-polysans text-heading-lg tracking-[-0.02em] text-graphite">
            Progress Overview
          </h1>
          <p className="mt-2 max-w-[56ch] text-15 leading-[1.5] text-steel">
            Track your learning journey and improvement
          </p>
        </div>
      </div>

      {/* 2. PROGRESS OVERVIEW — Three Radial Rings (flat, no cards) */}
      <div className="mt-8 flex flex-wrap items-start justify-center gap-10 sm:justify-around">
        {/* Questions Solved */}
        <div
          className="flex flex-col items-center"
          onMouseEnter={() => setHoveredRing("questions")}
          onMouseLeave={() => setHoveredRing(null)}
        >
          <RingProgress
            value={solvedPct}
            size={140}
            strokeWidth={10}
          >
            <div className="flex flex-col items-center">
              <span className="font-polysans text-heading tracking-[-0.02em] text-graphite">
                {radial.questionsSolved.solved}
              </span>
              <span className="text-13 text-slate">/ {radial.questionsSolved.total}</span>
            </div>
          </RingProgress>
          <p className="mt-4 font-polysans text-15 tracking-[-0.02em] text-graphite">
            Questions Solved
          </p>
          {hoveredRing === "questions" && (
            <p className="mt-1 text-13 text-slate">
              {radial.questionsSolved.solved} of {radial.questionsSolved.total} available
            </p>
          )}
        </div>

        {/* Overall Accuracy */}
        <div
          className="flex flex-col items-center"
          onMouseEnter={() => setHoveredRing("accuracy")}
          onMouseLeave={() => setHoveredRing(null)}
        >
          <RingProgress
            value={radial.accuracy}
            size={140}
            strokeWidth={10}
          >
            <div className="flex flex-col items-center">
              <span className="font-polysans text-heading tracking-[-0.02em] text-graphite">
                {radial.accuracy}%
              </span>
            </div>
          </RingProgress>
          <p className="mt-4 font-polysans text-15 tracking-[-0.02em] text-graphite">
            Overall Accuracy
          </p>
          {hoveredRing === "accuracy" && (
            <p className="mt-1 text-13 text-slate">
              Based on completed question outcomes
            </p>
          )}
        </div>

        {/* Practice Sessions */}
        <div
          className="flex flex-col items-center"
          onMouseEnter={() => setHoveredRing("sessions")}
          onMouseLeave={() => setHoveredRing(null)}
        >
          <RingProgress
            value={sessionPct}
            size={140}
            strokeWidth={10}
          >
            <div className="flex flex-col items-center">
              <span className="font-polysans text-heading tracking-[-0.02em] text-graphite">
                {radial.practiceSessions.completed}
              </span>
              <span className="text-13 text-slate">/ {radial.practiceSessions.total}</span>
            </div>
          </RingProgress>
          <p className="mt-4 font-polysans text-15 tracking-[-0.02em] text-graphite">
            Practice Sessions
          </p>
          {hoveredRing === "sessions" && (
            <p className="mt-1 text-13 text-slate">
              Completed sessions out of started
            </p>
          )}
        </div>
      </div>

      {/* 3. TIME / PRACTICE ANALYSIS — Inline rows, not cards */}
      <div className="mt-8 border-t border-mist pt-6">
        <h3 className="font-polysans text-subheading tracking-[-0.02em] text-graphite">
          Practice Overview
        </h3>
        <div className="mt-4 flex flex-wrap items-center gap-8">
          <div className="flex items-center gap-3">
            <ClockIcon className="h-4 w-4 text-ember" />
            <div>
              <span className="font-polysans text-15 font-medium text-graphite">{formatDurationMs(time.totalPracticeTimeMs)}</span>
              <span className="ml-2 text-13 text-slate">Total Practice Time</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <ClockIcon className="h-4 w-4 text-ember" />
            <div>
              <span className="font-polysans text-15 font-medium text-graphite">{formatDurationMs(time.avgSessionDurationMs)}</span>
              <span className="ml-2 text-13 text-slate">Avg. Session Duration</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <CalendarIcon className="h-4 w-4 text-ember" />
            <div>
              <span className="font-polysans text-15 font-medium text-graphite">{time.sessionsPerWeek} / week</span>
              <span className="ml-2 text-13 text-slate">Practice Frequency</span>
            </div>
          </div>
        </div>
      </div>

      {/* 4. PERFORMANCE TREND + ACCURACY BY DIFFICULTY */}
      <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-2">
        {/* ── Performance Trend ──────────────────────────────── */}
        <section className="border-t border-mist pt-6">
          <div className="flex items-center justify-between gap-4">
            <h3 className="font-polysans text-subheading tracking-[-0.02em] text-graphite">
              Performance Trend
            </h3>
            <span className="font-polysans text-13 tracking-[-0.02em] text-slate">
              Monthly
            </span>
          </div>

          {/* Metric toggle */}
          <div className="mt-4 flex gap-2">
            <button
              type="button"
              onClick={() => setTrendMetric("accuracy")}
              className={`rounded-tags border px-3 py-1 font-polysans text-13 tracking-[-0.02em] transition-colors ${
                trendMetric === "accuracy"
                  ? "border-graphite bg-graphite text-inverse"
                  : "border-mist bg-canvas text-slate hover:border-graphite hover:text-graphite"
              }`}
            >
              Accuracy
            </button>
            <button
              type="button"
              onClick={() => setTrendMetric("questionsSolved")}
              className={`rounded-tags border px-3 py-1 font-polysans text-13 tracking-[-0.02em] transition-colors ${
                trendMetric === "questionsSolved"
                  ? "border-graphite bg-graphite text-inverse"
                  : "border-mist bg-canvas text-slate hover:border-graphite hover:text-graphite"
              }`}
            >
              Questions Solved
            </button>
          </div>

          {/* Chart area */}
          <div className="mt-5">
            <PerformanceChart
              data={trend}
              metric={trendMetric}
            />
          </div>
        </section>

        {/* ── Accuracy by Difficulty ─────────────────────────── */}
        <section className="border-t border-mist pt-6 lg:border-t-0 lg:border-l lg:pl-8">
          <h3 className="font-polysans text-subheading tracking-[-0.02em] text-graphite">
            Accuracy by Difficulty
          </h3>

          <div className="mt-6 flex flex-col items-center gap-6 sm:flex-row sm:items-start sm:justify-center">
            {/* Donut visualization */}
            <div className="flex flex-col items-center">
              <RingProgress
                value={difficulty.overall}
                size={140}
                strokeWidth={10}
              >
                <div className="flex flex-col items-center">
                  <span className="font-polysans text-heading tracking-[-0.02em] text-graphite">
                    {difficulty.overall}%
                  </span>
                  <span className="text-13 text-slate">Overall</span>
                </div>
              </RingProgress>
            </div>

            {/* Difficulty breakdown */}
            <div className="flex flex-1 flex-col gap-5">
              <DifficultyRow
                label="Easy"
                accuracy={difficulty.easy.accuracy}
                attempted={difficulty.easy.attempted}
                total={difficulty.easy.total}
                color="bg-success"
              />
              <DifficultyRow
                label="Medium"
                accuracy={difficulty.medium.accuracy}
                attempted={difficulty.medium.attempted}
                total={difficulty.medium.total}
                color="bg-brass"
              />
              <DifficultyRow
                label="Hard"
                accuracy={difficulty.hard.accuracy}
                attempted={difficulty.hard.attempted}
                total={difficulty.hard.total}
                color="bg-ember"
              />
            </div>
          </div>
        </section>
      </div>

      {/* 5. PROGRESS BY TOPIC — table layout */}
      <section className="mt-8 border-t border-mist pt-6">
        <div className="flex items-center justify-between gap-4">
          <h3 className="font-polysans text-subheading tracking-[-0.02em] text-graphite">
            Progress by Topic
          </h3>
        </div>

        {topics.length > 0 ? (
          <>
            {/* Table header */}
            <div className="mt-5 grid grid-cols-[1fr_80px_70px_90px] gap-2 text-13 text-slate">
              <span>Topic</span>
              <span className="text-right">Progress</span>
              <span className="text-right">Accuracy</span>
              <span className="text-right">Questions</span>
            </div>

            {/* Topic rows */}
            <div className="mt-3 divide-y divide-mist">
              {topics.map((topic) => {
                const Icon = getTopicIcon(topic.id) ?? BrainIcon;
                return (
                  <Link
                    key={topic.id}
                    href={`/topics/${topic.id}`}
                    className="group grid grid-cols-[1fr_80px_70px_90px] items-center gap-2 py-3 transition-colors hover:bg-fog/50"
                  >
                    {/* Topic name + icon */}
                    <div className="flex items-center gap-3">
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-canvas text-graphite">
                        <Icon className="h-4 w-4" />
                      </span>
                      <span className="truncate font-polysans text-15 tracking-[-0.02em] text-graphite">
                        {topic.name}
                      </span>
                    </div>

                    {/* Progress */}
                    <div className="flex items-center gap-2">
                      <div className="h-1.5 w-full rounded-full bg-fog">
                        <div
                          className="h-full rounded-full bg-ember transition-all"
                          style={{ width: `${topic.progress}%` }}
                        />
                      </div>
                      <span className="shrink-0 font-polysans text-13 text-graphite">
                        {topic.progress}%
                      </span>
                    </div>

                    {/* Accuracy */}
                    <span className="text-right font-polysans text-13 text-graphite">
                      {topic.accuracy}%
                    </span>

                    {/* Questions */}
                    <div className="flex items-center justify-end gap-1">
                      <span className="font-polysans text-13 text-graphite">
                        {topic.solved}/{topic.total}
                      </span>
                      <ArrowRightIcon className="h-3.5 w-3.5 text-slate opacity-0 transition-opacity group-hover:opacity-100" />
                    </div>
                  </Link>
                );
              })}
            </div>
          </>
        ) : (
          <p className="mt-5 text-13 text-slate">
            No curriculum yet — add topics from the admin API (see docs/content-guide.md).
          </p>
        )}

        {/* View all */}
        <div className="mt-4 flex justify-end">
          <Link
            href="/topics"
            className="inline-flex items-center gap-1 font-polysans text-13 tracking-[-0.02em] text-slate transition-colors hover:text-ember"
          >
            View all topics
            <ArrowRightIcon className="h-3.5 w-3.5" />
          </Link>
        </div>
      </section>

      {/* 6. STRENGTHS & WEAKNESSES — Steam Wave */}
      <div className="mt-8 border-t border-mist pt-6">
        <SteamWaveSection
          strengths={strengths}
          weaknesses={weaknesses}
          all={practiced}
        />
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════
// SUB-COMPONENTS
// ═══════════════════════════════════════════════════════════════════════

function DifficultyRow({ label, accuracy, attempted, total, color }) {
  return (
    <div>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className={`h-2 w-2 rounded-full ${color}`} />
          <span className="font-polysans text-15 tracking-[-0.02em] text-graphite">
            {label}
          </span>
        </div>
        <span className="font-polysans text-15 font-medium text-graphite">
          {accuracy}%
        </span>
      </div>
      <p className="mt-1 text-13 text-slate">
        {attempted}/{total} attempted
      </p>
    </div>
  );
}

function PerformanceChart({ data, metric }) {
  const values = data.map((d) => d[metric]);
  const max = Math.max(...values);
  const min = Math.min(...values);
  const range = max - min || 1;

  const chartHeight = 180;

  return (
    <div className="relative">
      <div className="flex items-end gap-2">
        <div className="flex h-[180px] flex-col justify-between text-13 text-slate">
          <span>{max}</span>
          <span>{Math.round((max + min) / 2)}</span>
          <span>{min}</span>
        </div>

        <div className="relative min-w-0 flex-1">
          <svg
            viewBox={`0 0 ${data.length * 60} ${chartHeight}`}
            className="h-[180px] w-full"
            preserveAspectRatio="none"
          >
            {[0, 0.25, 0.5, 0.75, 1].map((pct) => (
              <line
                key={pct}
                x1={0}
                y1={chartHeight * pct}
                x2={data.length * 60}
                y2={chartHeight * pct}
                stroke="var(--color-mist)"
                strokeWidth={1}
              />
            ))}

            <defs>
              <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--color-ember)" stopOpacity={0.15} />
                <stop offset="100%" stopColor="var(--color-ember)" stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <path
              d={`M ${data
                .map(
                  (d, i) =>
                    `${i * 60 + 30},${chartHeight - ((d[metric] - min) / range) * (chartHeight - 20) - 10}`
                )
                .join(" L ")} L ${(data.length - 1) * 60 + 30},${chartHeight} L 30,${chartHeight} Z`}
              fill="url(#areaGrad)"
            />

            <polyline
              points={data
                .map(
                  (d, i) =>
                    `${i * 60 + 30},${chartHeight - ((d[metric] - min) / range) * (chartHeight - 20) - 10}`
                )
                .join(" ")}
              fill="none"
              stroke="var(--color-ember)"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {data.map((d, i) => {
              const cy =
                chartHeight - ((d[metric] - min) / range) * (chartHeight - 20) - 10;
              return (
                <circle
                  key={i}
                  cx={i * 60 + 30}
                  cy={cy}
                  r={4}
                  fill="var(--color-ember)"
                  stroke="var(--color-ash)"
                  strokeWidth={2}
                  title={`${d.month}: ${metric === "accuracy" ? `${d.accuracy}%` : d.questionsSolved}`}
                />
              );
            })}
          </svg>

          <div className="mt-2 flex justify-between text-13 text-slate">
            {data.map((d) => (
              <span key={d.month}>{d.month}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════
// STEAM WAVE — Strengths & Weaknesses
// ═══════════════════════════════════════════════════════════════════════

function SteamWaveSection({ strengths, weaknesses, all }) {
  return (
    <section>
      <div className="flex items-center justify-between gap-4">
        <div>
          <h3 className="font-polysans text-subheading tracking-[-0.02em] text-graphite">
            Strengths & Weaknesses
          </h3>
          <p className="mt-1 text-13 text-slate">
            Performance across aptitude subtopics
          </p>
        </div>
        <div className="flex items-center gap-4 text-13 text-slate">
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-ember" />
            Accuracy
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-brass" />
            Activity
          </span>
        </div>
      </div>

      {/* ── MonoRoundedStreamChart ──────────────────────────── */}
      <div className="mt-6">
        {all.length > 0 ? (
          <MonoRoundedStreamChart data={all} />
        ) : (
          <p className="rounded-2xl bg-ash px-6 py-8 text-center text-13 text-slate">
            Practice a few sessions and your performance stream will appear here.
          </p>
        )}
      </div>

      {/* ── Strengths & Weaknesses Lists ────────────────────── */}
      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Top Strengths */}
        <div>
          <div className="mb-4 flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-md bg-success/10">
              <TrendingUpIcon className="h-3.5 w-3.5 text-success" />
            </span>
            <p className="font-polysans text-13 tracking-[0.06em] uppercase text-success">
              Top Strengths
            </p>
          </div>
          {strengths.length > 0 ? (
            <div className="space-y-3">
              {strengths.map((item, idx) => (
                <div key={item.name}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-success/10 font-polysans text-13 font-medium text-success">
                        {idx + 1}
                      </span>
                      <div>
                        <span className="font-polysans text-15 tracking-[-0.02em] text-graphite">
                          {item.name}
                        </span>
                        <span className="ml-2 font-polysans text-13 font-medium text-success">
                          {item.accuracy}%
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="mt-2 ml-10">
                    <div className="h-2 w-full overflow-hidden rounded-full bg-fog">
                      <div
                        className="h-full rounded-full bg-success transition-all duration-500"
                        style={{ width: `${item.accuracy}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-13 text-slate">
              Solve at least 3 questions in a subtopic to unlock strengths.
            </p>
          )}
        </div>

        {/* Needs Practice */}
        <div>
          <div className="mb-4 flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-md bg-ember/10">
              <TargetIcon className="h-3.5 w-3.5 text-ember" />
            </span>
            <p className="font-polysans text-13 tracking-[0.06em] uppercase text-ember">
              Needs Practice
            </p>
          </div>
          {weaknesses.length > 0 ? (
            <div className="space-y-3">
              {weaknesses.map((item, idx) => (
                <div key={item.name}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-ember/10 font-polysans text-13 font-medium text-ember">
                        {idx + 1}
                      </span>
                      <div>
                        <span className="font-polysans text-15 tracking-[-0.02em] text-graphite">
                          {item.name}
                        </span>
                        <span className="ml-2 font-polysans text-13 font-medium text-ember">
                          {item.accuracy}%
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="mt-2 ml-10">
                    <div className="h-2 w-full overflow-hidden rounded-full bg-fog">
                      <div
                        className="h-full rounded-full bg-ember transition-all duration-500"
                        style={{ width: `${item.accuracy}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-13 text-slate">
              Solve at least 3 questions in a subtopic to unlock weaknesses.
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
