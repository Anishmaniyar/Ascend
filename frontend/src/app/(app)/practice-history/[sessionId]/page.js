"use client";

import { useState, use } from "react";
import Link from "next/link";
import {
  ArrowLeftIcon,
  RotateCcwIcon,
  ClipboardCheckIcon,
  ClockIcon,
  TargetIcon,
  CalendarIcon,
  BarChart3Icon,
  CheckIcon,
  XIcon,
} from "@/components/ui/icons";
import Button from "@/components/ui/Button";
import { sessionDetails } from "@/lib/mock/dashboard";

// ─── Helpers ───────────────────────────────────────────────────────────
function formatDate(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-IN", { month: "short", day: "numeric", year: "numeric" });
}

function formatTime(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });
}

function getAccuracyColor(accuracy) {
  if (accuracy >= 80) return "var(--color-success)";
  if (accuracy >= 50) return "var(--color-brass)";
  return "var(--color-ember)";
}

function AccuracyRing({ accuracy, size = 120 }) {
  const radius = (size - 10) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (accuracy / 100) * circumference;
  const color = getAccuracyColor(accuracy);

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="var(--color-mist)" strokeWidth={8} />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={8}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="transition-all duration-700"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-polysans text-[28px] leading-none tracking-[-0.02em] text-graphite">{accuracy}%</span>
        <span className="mt-1 text-[11px] text-slate">Accuracy</span>
      </div>
    </div>
  );
}

function MiniRing({ accuracy, size = 20 }) {
  const radius = (size - 3) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (accuracy / 100) * circumference;
  const color = getAccuracyColor(accuracy);

  return (
    <svg width={size} height={size} className="-rotate-90">
      <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="var(--color-mist)" strokeWidth={3} />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke={color}
        strokeWidth={3}
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
      />
    </svg>
  );
}

// ─── Tabs ──────────────────────────────────────────────────────────────
const TABS = ["Overview", "Question Review", "Performance", "Time Analysis"];

// ─── Component ─────────────────────────────────────────────────────────
export default function SessionDetailPage({ params }) {
  const { sessionId } = use(params);
  const [activeTab, setActiveTab] = useState("Overview");

  const session = sessionDetails[sessionId] || sessionDetails["h1"];
  if (!session) {
    return (
      <div className="mx-auto w-full max-w-[var(--page-max-width)] px-6 py-10">
        <p className="text-15 text-steel">Session not found.</p>
      </div>
    );
  }

  const incorrectPct = Math.round((session.incorrect / session.total) * 100);
  const unattemptedPct = Math.round((session.unattempted / session.total) * 100);

  return (
    <div className="mx-auto w-full max-w-[var(--page-max-width)] px-6 py-10">
      {/* ── Back navigation ────────────────────────────────────────── */}
      <Link
        href="/practice-history"
        className="mb-6 inline-flex items-center gap-1.5 text-[13px] text-slate transition-colors hover:text-graphite"
      >
        <ArrowLeftIcon className="h-3.5 w-3.5" />
        Back to Practice History
      </Link>

      {/* ── Page Header ────────────────────────────────────────────── */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="font-polysans text-heading-lg tracking-[-0.02em] text-graphite">
              Session #{session.sessionNumber}
            </h1>
            <span className="inline-flex items-center gap-1 rounded-full bg-success/10 px-2.5 py-0.5 text-[11px] font-medium text-success">
              Completed
            </span>
          </div>
          <p className="mt-2 text-[15px] text-steel">
            {session.topic} • {session.subtopic} • {session.total} Questions
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="secondary" size="sm">
            <RotateCcwIcon className="h-3.5 w-3.5" />
            Retry Session
          </Button>
          <Button variant="primary" size="sm">
            Review Mistakes
          </Button>
        </div>
      </div>

      {/* ── Session Summary ────────────────────────────────────────── */}
      <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-5">
        {[
          { label: "Score", value: `${session.score} / ${session.total}`, sub: session.score >= session.total * 0.8 ? "Good" : "Average", icon: ClipboardCheckIcon },
          { label: "Accuracy", value: `${session.accuracy}%`, sub: session.accuracy >= 80 ? "Good" : session.accuracy >= 50 ? "Average" : "Needs Work", icon: TargetIcon },
          { label: "Time Taken", value: session.timeTaken, sub: "Fast", icon: ClockIcon },
          { label: "Percentile", value: `${session.percentile}nd`, sub: "Above Average", icon: BarChart3Icon },
          { label: "Attempted On", value: formatDate(session.date), sub: formatTime(session.date), icon: CalendarIcon },
        ].map((m) => {
          const Icon = m.icon;
          return (
            <div key={m.label} className="rounded-xl bg-ash px-4 py-3">
              <div className="flex items-center gap-2">
                <Icon className="h-3.5 w-3.5 text-slate" />
                <span className="text-[11px] uppercase tracking-wider text-slate">{m.label}</span>
              </div>
              <p className="mt-1.5 font-polysans text-[18px] tracking-[-0.02em] text-graphite">{m.value}</p>
              <p className="mt-0.5 text-[12px] text-slate">{m.sub}</p>
            </div>
          );
        })}
      </div>

      {/* ── Tab Navigation ─────────────────────────────────────────── */}
      <div className="mt-8 flex items-center gap-1 overflow-x-auto border-b border-mist">
        {TABS.map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setActiveTab(tab)}
            className={`shrink-0 border-b-2 px-4 py-2.5 text-[13px] font-medium transition-colors ${
              activeTab === tab
                ? "border-graphite text-graphite"
                : "border-transparent text-slate hover:text-graphite"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* ── Overview Content ───────────────────────────────────────── */}
      {activeTab === "Overview" && (
        <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-[1fr_320px]">
          {/* LEFT COLUMN */}
          <div className="space-y-6">
            {/* Performance Overview */}
            <section className="rounded-2xl bg-ash p-6">
              <h2 className="font-polysans text-[18px] tracking-[-0.02em] text-graphite">
                Performance Overview
              </h2>

              <div className="mt-5 flex flex-col items-center gap-6 sm:flex-row sm:items-start">
                {/* Accuracy ring */}
                <div className="shrink-0">
                  <AccuracyRing accuracy={session.accuracy} />
                </div>

                {/* Breakdown */}
                <div className="flex-1 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <span className="h-2.5 w-2.5 rounded-full bg-success" />
                      <span className="text-[14px] text-steel">Correct Answers</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-polysans text-[15px] text-graphite">{session.correct}</span>
                      <span className="text-[12px] text-slate">({Math.round((session.correct / session.total) * 100)}%)</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <span className="h-2.5 w-2.5 rounded-full bg-ember" />
                      <span className="text-[14px] text-steel">Incorrect Answers</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-polysans text-[15px] text-graphite">{session.incorrect}</span>
                      <span className="text-[12px] text-slate">({incorrectPct}%)</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <span className="h-2.5 w-2.5 rounded-full bg-mist" />
                      <span className="text-[14px] text-steel">Unattempted</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-polysans text-[15px] text-graphite">{session.unattempted}</span>
                      <span className="text-[12px] text-slate">({unattemptedPct}%)</span>
                    </div>
                  </div>

                  {/* Insight */}
                  <div className="mt-4 rounded-lg border border-success/20 bg-success/5 px-4 py-3">
                    <p className="text-[13px] leading-[1.5] text-success">
                      Great job! You performed better than {session.percentile}% of users who attempted this session.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Section Breakdown */}
            <section className="rounded-2xl bg-ash p-6">
              <h2 className="font-polysans text-[18px] tracking-[-0.02em] text-graphite">
                Section Breakdown
              </h2>

              <div className="mt-5 overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-mist">
                      <th className="pb-2.5 text-left text-[12px] font-normal uppercase tracking-wider text-slate">Section</th>
                      <th className="pb-2.5 text-left text-[12px] font-normal uppercase tracking-wider text-slate">Questions</th>
                      <th className="pb-2.5 text-left text-[12px] font-normal uppercase tracking-wider text-slate">Correct</th>
                      <th className="pb-2.5 text-left text-[12px] font-normal uppercase tracking-wider text-slate">Accuracy</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-mist">
                    {session.sections.map((sec) => (
                      <tr key={sec.name}>
                        <td className="py-3 text-[14px] text-graphite">{sec.name}</td>
                        <td className="py-3 text-[14px] text-graphite">{sec.questions}</td>
                        <td className="py-3 text-[14px] text-graphite">{sec.correct}</td>
                        <td className="py-3">
                          <div className="flex items-center gap-2.5">
                            <MiniRing accuracy={sec.accuracy} />
                            <span className="text-[14px] text-graphite">{sec.accuracy}%</span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          </div>

          {/* RIGHT COLUMN */}
          <div className="space-y-6">
            {/* Session Details */}
            <section className="rounded-2xl bg-ash p-6">
              <h2 className="font-polysans text-[18px] tracking-[-0.02em] text-graphite">
                Session Details
              </h2>

              <div className="mt-4 space-y-3">
                {[
                  { label: "Session ID", value: `#${session.sessionNumber}` },
                  { label: "Questions", value: session.total },
                  { label: "Difficulty", value: session.difficulty },
                  { label: "Total Marks", value: session.total },
                  { label: "Negative Marking", value: `${session.negativeMarking} per wrong` },
                  { label: "Max Score", value: session.total },
                  { label: "Started At", value: `${formatDate(session.startedAt)} ${formatTime(session.startedAt)}` },
                  { label: "Completed At", value: `${formatDate(session.date)} ${formatTime(session.date)}` },
                ].map((row) => (
                  <div key={row.label} className="flex items-center justify-between text-[13px]">
                    <span className="text-slate">{row.label}</span>
                    <span className="font-polysans text-graphite">{row.value}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* Topics */}
            <section className="rounded-2xl bg-ash p-6">
              <h2 className="font-polysans text-[18px] tracking-[-0.02em] text-graphite">
                Topics
              </h2>

              <div className="mt-4 space-y-3">
                <div className="flex items-center justify-between text-[13px]">
                  <span className="text-slate">Primary Topic</span>
                  <span className="font-polysans text-graphite">{session.topic}</span>
                </div>
                <div className="flex items-center justify-between text-[13px]">
                  <span className="text-slate">Subtopic</span>
                  <span className="font-polysans text-graphite">{session.subtopic}</span>
                </div>
              </div>
            </section>
          </div>
        </div>
      )}

      {/* ── Other tabs placeholder ─────────────────────────────────── */}
      {activeTab !== "Overview" && (
        <div className="mt-16 rounded-2xl bg-ash px-6 py-12 text-center">
          <p className="text-[15px] text-steel">{activeTab} content coming soon.</p>
        </div>
      )}
    </div>
  );
}
