"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowRightIcon,
  ChevronDownIcon,
  TrendingUpIcon,
  BrainIcon,
  LightbulbIcon,
  BarChart3Icon,
  ChatIcon,
  GlobeIcon,
  PencilIcon,
  DownloadIcon,
  ClockIcon,
  CalendarIcon,
  TargetIcon,
} from "@/components/ui/icons";
import RingProgress from "@/components/charts/RingProgress";
import MonoRoundedStreamChart from "@/components/charts/MonoRoundedStreamChart";
import Button from "@/components/ui/Button";
import {
  radialMetrics,
  performanceTrendMonthly,
  difficultyAccuracy,
  topicProgress,
  getClassifiedSubtopics,
  timePracticeAnalysis,
} from "@/lib/mock/progress";

// ── Icon map for topic icons ──────────────────────────────────────────
const TOPIC_ICON_MAP = {
  BrainIcon,
  LightbulbIcon,
  BarChart3Icon,
  ChatIcon,
  GlobeIcon,
  PencilIcon,
};

const TIME_RANGES = [
  { id: "6m", label: "Last 6 Months" },
  { id: "1y", label: "Last Year" },
  { id: "3m", label: "Last 3 Months" },
  { id: "all", label: "All Time" },
];

const TREND_PERIODS = [
  { id: "monthly", label: "Monthly" },
  { id: "weekly", label: "Weekly" },
];

// ═══════════════════════════════════════════════════════════════════════
// MAIN PAGE
// ═══════════════════════════════════════════════════════════════════════

export default function ProgressPage() {
  const [timeRange, setTimeRange] = useState("6m");
  const [trendMetric, setTrendMetric] = useState("accuracy");
  const [trendPeriod, setTrendPeriod] = useState("monthly");
  const [timeRangeOpen, setTimeRangeOpen] = useState(false);
  const [hoveredRing, setHoveredRing] = useState(null);

  const selectedRange = TIME_RANGES.find((r) => r.id === timeRange);
  const timeData = timePracticeAnalysis[timeRange];
  const { strengths, weaknesses, all: allSubtopics } = getClassifiedSubtopics();

  return (
    <div className="mx-auto w-full max-w-[var(--page-max-width)] px-6 py-10">
      {/* ═══════════════════════════════════════════════════════════════
          1. PAGE HEADER
          ═══════════════════════════════════════════════════════════════ */}
      <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="font-polysans text-heading-lg tracking-[-0.02em] text-graphite">
            Progress Overview
          </h1>
          <p className="mt-2 max-w-[56ch] text-15 leading-[1.5] text-steel">
            Track your learning journey and improvement
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Time-range selector */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setTimeRangeOpen((v) => !v)}
              className="flex items-center gap-2 rounded-lg border border-mist bg-canvas px-4 py-2 font-polysans text-13 tracking-[-0.02em] text-graphite transition-colors hover:border-graphite"
            >
              {selectedRange?.label}
              <ChevronDownIcon className="h-3.5 w-3.5 text-slate" />
            </button>
            {timeRangeOpen && (
              <div className="absolute right-0 top-full z-10 mt-1 w-44 rounded-lg border border-mist bg-canvas py-1.5 shadow-lg">
                {TIME_RANGES.map((range) => (
                  <button
                    key={range.id}
                    type="button"
                    onClick={() => {
                      setTimeRange(range.id);
                      setTimeRangeOpen(false);
                    }}
                    className={`flex w-full items-center px-4 py-2 text-left font-polysans text-13 tracking-[-0.02em] transition-colors ${
                      timeRange === range.id
                        ? "bg-ash text-graphite"
                        : "text-slate hover:bg-ash hover:text-graphite"
                    }`}
                  >
                    {range.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Download Report */}
          <Button variant="secondary" size="sm">
            <DownloadIcon className="h-3.5 w-3.5" />
            Download Report
          </Button>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════
          2. PROGRESS OVERVIEW — Three Radial Rings
          ═══════════════════════════════════════════════════════════════ */}
      <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-3">
        {/* Questions Solved */}
        <div
          className="flex flex-col items-center rounded-2xl bg-ash px-5 py-7"
          onMouseEnter={() => setHoveredRing("questions")}
          onMouseLeave={() => setHoveredRing(null)}
        >
          <RingProgress
            value={(radialMetrics.questionsSolved.solved / radialMetrics.questionsSolved.total) * 100}
            size={140}
            strokeWidth={10}
          >
            <div className="flex flex-col items-center">
              <span className="font-polysans text-heading tracking-[-0.02em] text-graphite">
                {radialMetrics.questionsSolved.solved}
              </span>
              <span className="text-13 text-slate">/ {radialMetrics.questionsSolved.total}</span>
            </div>
          </RingProgress>
          <p className="mt-4 font-polysans text-15 tracking-[-0.02em] text-graphite">
            Questions Solved
          </p>
          {hoveredRing === "questions" && (
            <p className="mt-1 text-13 text-slate">
              {radialMetrics.questionsSolved.solved} of {radialMetrics.questionsSolved.total} available
            </p>
          )}
        </div>

        {/* Overall Accuracy */}
        <div
          className="flex flex-col items-center rounded-2xl bg-ash px-5 py-7"
          onMouseEnter={() => setHoveredRing("accuracy")}
          onMouseLeave={() => setHoveredRing(null)}
        >
          <RingProgress
            value={radialMetrics.accuracy}
            size={140}
            strokeWidth={10}
          >
            <div className="flex flex-col items-center">
              <span className="font-polysans text-heading tracking-[-0.02em] text-graphite">
                {radialMetrics.accuracy}%
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
          className="flex flex-col items-center rounded-2xl bg-ash px-5 py-7"
          onMouseEnter={() => setHoveredRing("sessions")}
          onMouseLeave={() => setHoveredRing(null)}
        >
          <RingProgress
            value={(radialMetrics.practiceSessions.completed / radialMetrics.practiceSessions.total) * 100}
            size={140}
            strokeWidth={10}
          >
            <div className="flex flex-col items-center">
              <span className="font-polysans text-heading tracking-[-0.02em] text-graphite">
                {radialMetrics.practiceSessions.completed}
              </span>
              <span className="text-13 text-slate">/ {radialMetrics.practiceSessions.total}</span>
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

      {/* ═══════════════════════════════════════════════════════════════
          3. TIME / PRACTICE ANALYSIS — Compact row
          ═══════════════════════════════════════════════════════════════ */}
      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="flex items-center gap-4 rounded-2xl bg-ash px-5 py-4">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-ember/10">
            <ClockIcon className="h-5 w-5 text-ember" />
          </span>
          <div>
            <p className="font-polysans text-heading tracking-[-0.02em] text-graphite">
              {timeData.totalPracticeTime}
            </p>
            <p className="mt-0.5 text-13 text-slate">Total Practice Time</p>
          </div>
        </div>

        <div className="flex items-center gap-4 rounded-2xl bg-ash px-5 py-4">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-ember/10">
            <ClockIcon className="h-5 w-5 text-ember" />
          </span>
          <div>
            <p className="font-polysans text-heading tracking-[-0.02em] text-graphite">
              {timeData.avgSessionDuration}
            </p>
            <p className="mt-0.5 text-13 text-slate">Avg. Session Duration</p>
          </div>
        </div>

        <div className="flex items-center gap-4 rounded-2xl bg-ash px-5 py-4">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-ember/10">
            <CalendarIcon className="h-5 w-5 text-ember" />
          </span>
          <div>
            <p className="font-polysans text-heading tracking-[-0.02em] text-graphite">
              {timeData.practiceFrequency.value} {timeData.practiceFrequency.unit}
            </p>
            <p className="mt-0.5 text-13 text-slate">Practice Frequency</p>
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════
          4. PERFORMANCE TREND + ACCURACY BY DIFFICULTY
          ═══════════════════════════════════════════════════════════════ */}
      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* ── Performance Trend ──────────────────────────────── */}
        <section className="rounded-2xl bg-ash p-6">
          <div className="flex items-center justify-between gap-4">
            <h3 className="font-polysans text-subheading tracking-[-0.02em] text-graphite">
              Performance Trend
            </h3>
            {/* Period selector */}
            <div className="flex items-center gap-1 rounded-lg border border-mist bg-canvas p-0.5">
              {TREND_PERIODS.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setTrendPeriod(p.id)}
                  className={`rounded-md px-3 py-1 font-polysans text-13 tracking-[-0.02em] transition-colors ${
                    trendPeriod === p.id
                      ? "bg-graphite text-inverse"
                      : "text-slate hover:text-graphite"
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
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
              data={performanceTrendMonthly}
              metric={trendMetric}
            />
          </div>
        </section>

        {/* ── Accuracy by Difficulty ─────────────────────────── */}
        <section className="rounded-2xl bg-ash p-6">
          <h3 className="font-polysans text-subheading tracking-[-0.02em] text-graphite">
            Accuracy by Difficulty
          </h3>

          <div className="mt-6 flex flex-col items-center gap-6 sm:flex-row sm:items-start sm:justify-center">
            {/* Donut visualization */}
            <div className="flex flex-col items-center">
              <RingProgress
                value={difficultyAccuracy.overall}
                size={140}
                strokeWidth={10}
              >
                <div className="flex flex-col items-center">
                  <span className="font-polysans text-heading tracking-[-0.02em] text-graphite">
                    {difficultyAccuracy.overall}%
                  </span>
                  <span className="text-13 text-slate">Overall</span>
                </div>
              </RingProgress>
            </div>

            {/* Difficulty breakdown */}
            <div className="flex flex-1 flex-col gap-5">
              <DifficultyRow
                label="Easy"
                accuracy={difficultyAccuracy.easy.accuracy}
                attempted={difficultyAccuracy.easy.attempted}
                total={difficultyAccuracy.easy.total}
                color="bg-success"
              />
              <DifficultyRow
                label="Medium"
                accuracy={difficultyAccuracy.medium.accuracy}
                attempted={difficultyAccuracy.medium.attempted}
                total={difficultyAccuracy.medium.total}
                color="bg-brass"
              />
              <DifficultyRow
                label="Hard"
                accuracy={difficultyAccuracy.hard.accuracy}
                attempted={difficultyAccuracy.hard.attempted}
                total={difficultyAccuracy.hard.total}
                color="bg-ember"
              />
            </div>
          </div>
        </section>
      </div>

      {/* ═══════════════════════════════════════════════════════════════
          5. PROGRESS BY TOPIC
          ═══════════════════════════════════════════════════════════════ */}
      <section className="mt-6 rounded-2xl bg-ash p-6">
        <div className="flex items-center justify-between gap-4">
          <h3 className="font-polysans text-subheading tracking-[-0.02em] text-graphite">
            Progress by Topic
          </h3>
        </div>

        {/* Table header */}
        <div className="mt-5 grid grid-cols-[1fr_80px_70px_90px] gap-2 text-13 text-slate">
          <span>Topic</span>
          <span className="text-right">Progress</span>
          <span className="text-right">Accuracy</span>
          <span className="text-right">Questions</span>
        </div>

        {/* Topic rows */}
        <div className="mt-3 divide-y divide-mist">
          {topicProgress.map((topic) => {
            const Icon = TOPIC_ICON_MAP[topic.icon] ?? BrainIcon;
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

      {/* ═══════════════════════════════════════════════════════════════
          6. STRENGTHS & WEAKNESSES — Steam Wave
          ═══════════════════════════════════════════════════════════════ */}
      <SteamWaveSection />
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

function SteamWaveSection() {
  const { strengths, weaknesses, all } = getClassifiedSubtopics();

  return (
    <section className="mt-6 rounded-2xl bg-ash p-6">
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
        <MonoRoundedStreamChart data={all} />
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
        </div>
      </div>
    </section>
  );
}
