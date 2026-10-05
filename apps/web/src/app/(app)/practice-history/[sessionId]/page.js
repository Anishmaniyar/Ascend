"use client";

import { useState, useEffect, use, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeftIcon,
  RotateCcwIcon,
  ClipboardCheckIcon,
  ClockIcon,
  TargetIcon,
  CalendarIcon,
  CheckIcon,
  XIcon,
} from "@/components/ui/icons";
import Button from "@/components/ui/Button";
import { getResults, getSession, startSession } from "@/lib/api/practice";

// ─── Helpers ─────────────────────────────────────────────────────────
function formatDate(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-IN", { month: "short", day: "numeric", year: "numeric" });
}

function formatTime(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });
}

function formatDuration(ms) {
  if (ms == null || ms < 0) return "—";
  const totalSec = Math.round(ms / 1000);
  const m = Math.floor(totalSec / 60);
  const s = totalSec % 60;
  if (m === 0) return `${s}s`;
  return `${m}m ${String(s).padStart(2, "0")}s`;
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
        <span className="font-polysans text-heading tracking-[-0.02em] text-graphite">{accuracy}%</span>
        <span className="mt-1 font-polysans text-11 text-slate">Accuracy</span>
      </div>
    </div>
  );
}

// ─── Tabs ──────────────────────────────────────────────────────────────
const TABS = ["Overview", "Question Review"];

// ─── Component ─────────────────────────────────────────────────────────
export default function SessionDetailPage({ params }) {
  const { sessionId } = use(params);
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("Overview");
  const [reviewFilter, setReviewFilter] = useState("all");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [retrying, setRetrying] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const [results, session] = await Promise.all([
        getResults(sessionId),
        getSession(sessionId),
      ]);
      setData({ results, session });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [sessionId]);

  useEffect(() => {
    load();
  }, [load]);

  const handleRetry = async () => {
    if (!data || retrying) return;
    setRetrying(true);
    try {
      const created = await startSession(
        data.session.sheetId
          ? { sheetId: data.session.sheetId, mode: data.results.mode }
          : {
              subtopicId: data.session.subtopic.id,
              mode: data.results.mode,
            },
      );
      router.push(`/practice/session?sessionId=${created.id}`);
    } catch (err) {
      setError(err.message);
      setRetrying(false);
    }
  };

  if (loading) {
    return (
      <div className="mx-auto w-full max-w-[var(--page-max-width)] px-6 py-10">
        <p className="text-13 text-slate">Loading session results…</p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="mx-auto w-full max-w-[var(--page-max-width)] px-6 py-10">
        <Link
          href="/practice-history"
          className="mb-6 inline-flex items-center gap-1.5 text-13 text-slate transition-colors hover:text-graphite"
        >
          <ArrowLeftIcon className="h-3.5 w-3.5" />
          Back to Practice History
        </Link>
        <div className="mt-6 rounded-2xl bg-ash p-6 text-13 text-steel">
          <p>Couldn&apos;t load this session: {error}</p>
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

  const { results, session } = data;
  const totalInSession = session.questions.length;
  const unattempted = Math.max(0, totalInSession - results.totalQuestion);
  const incorrectPct =
    results.totalQuestion === 0
      ? 0
      : Math.round((results.wrongAnswers / results.totalQuestion) * 100);
  const unattemptedPct =
    totalInSession === 0
      ? 0
      : Math.round((unattempted / totalInSession) * 100);

  const reviewItems =
    reviewFilter === "all"
      ? results.review
      : results.review.filter((r) =>
          reviewFilter === "correct" ? r.isCorrect : !r.isCorrect,
        );

  return (
    <div className="mx-auto w-full max-w-[var(--page-max-width)] px-6 py-10">
      {/* ── Back navigation ────────────────────────────────────────── */}
      <Link
        href="/practice-history"
        className="mb-6 inline-flex items-center gap-1.5 text-13 text-slate transition-colors hover:text-graphite"
      >
        <ArrowLeftIcon className="h-3.5 w-3.5" />
        Back to Practice History
      </Link>

      {/* ── Page Header ────────────────────────────────────────────── */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="font-polysans text-heading-lg tracking-[-0.02em] text-graphite">
              {results.mode === "TEST" ? "Test" : "Practice"} Session
            </h1>
            <span className="inline-flex items-center gap-1 rounded-full bg-success/10 px-2.5 py-0.5 font-polysans text-11 text-success">
              Completed
            </span>
          </div>
          <p className="mt-2 text-15 text-steel">
            {results.topic} • {results.subtopic} • {results.totalQuestion} Questions
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="secondary" size="sm" onClick={handleRetry}>
            <RotateCcwIcon className="h-3.5 w-3.5" />
            {retrying ? "Starting…" : "Retry Session"}
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={() => {
              setReviewFilter("incorrect");
              setActiveTab("Question Review");
            }}
          >
            Review Mistakes
          </Button>
        </div>
      </div>

      {/* ── Session Summary ────────────────────────────────────────── */}
      <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
        {[
          { label: "Score", value: `${results.score} / ${results.totalQuestion}`, sub: results.score >= results.totalQuestion * 0.8 ? "Good" : "Average", icon: ClipboardCheckIcon },
          { label: "Accuracy", value: `${results.accuracy}%`, sub: results.accuracy >= 80 ? "Good" : results.accuracy >= 50 ? "Average" : "Needs Work", icon: TargetIcon },
          { label: "Time Taken", value: formatDuration(results.timeTaken), sub: `${totalInSession} in session`, icon: ClockIcon },
          { label: "Attempted On", value: formatDate(results.completedAt), sub: formatTime(results.completedAt), icon: CalendarIcon },
        ].map((m) => {
          const Icon = m.icon;
          return (
            <div key={m.label} className="rounded-xl bg-ash px-4 py-3">
              <div className="flex items-center gap-2">
                <Icon className="h-3.5 w-3.5 text-slate" />
                <span className="font-polysans text-11 uppercase tracking-wider text-slate">{m.label}</span>
              </div>
              <p className="mt-1.5 font-polysans text-subheading tracking-[-0.02em] text-graphite">{m.value}</p>
              <p className="mt-0.5 font-polysans text-11 text-slate">{m.sub}</p>
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
            className={`shrink-0 border-b-2 px-4 py-2.5 font-polysans text-13 tracking-[-0.02em] transition-colors ${
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
              <h2 className="font-polysans text-subheading tracking-[-0.02em] text-graphite">
                Performance Overview
              </h2>

              <div className="mt-5 flex flex-col items-center gap-6 sm:flex-row sm:items-start">
                {/* Accuracy ring */}
                <div className="shrink-0">
                  <AccuracyRing accuracy={results.accuracy} />
                </div>

                {/* Breakdown */}
                <div className="flex-1 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <span className="h-2.5 w-2.5 rounded-full bg-success" />
                      <span className="text-15 text-steel">Correct Answers</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-polysans text-15 text-graphite">{results.correctAnswers}</span>
                      <span className="text-11 text-slate">({results.accuracy}%)</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <span className="h-2.5 w-2.5 rounded-full bg-ember" />
                      <span className="text-15 text-steel">Incorrect Answers</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-polysans text-15 text-graphite">{results.wrongAnswers}</span>
                      <span className="text-11 text-slate">({incorrectPct}%)</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <span className="h-2.5 w-2.5 rounded-full bg-mist" />
                      <span className="text-15 text-steel">Unattempted</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-polysans text-15 text-graphite">{unattempted}</span>
                      <span className="text-11 text-slate">({unattemptedPct}%)</span>
                    </div>
                  </div>

                  {/* Insight */}
                  <div className="mt-4 rounded-lg border border-success/20 bg-success/5 px-4 py-3">
                    <p className="text-13 leading-[1.5] text-success">
                      {results.accuracy >= 80
                        ? "Great job! A strong session — keep the streak going."
                        : results.accuracy >= 50
                          ? "Solid progress. Review the mistakes below to push higher."
                          : "Every expert was once a beginner — review each mistake below."}
                    </p>
                  </div>
                </div>
              </div>
            </section>
          </div>

          {/* RIGHT COLUMN */}
          <div className="space-y-6">
            {/* Session Details */}
            <section className="rounded-2xl bg-ash p-6">
              <h2 className="font-polysans text-subheading tracking-[-0.02em] text-graphite">
                Session Details
              </h2>

              <div className="mt-4 space-y-3">
                {[
                  { label: "Questions", value: totalInSession },
                  { label: "Attempted", value: results.totalQuestion },
                  { label: "Mode", value: results.mode },
                  { label: "Started At", value: `${formatDate(results.startedAt)} ${formatTime(results.startedAt)}` },
                  { label: "Completed At", value: `${formatDate(results.completedAt)} ${formatTime(results.completedAt)}` },
                ].map((row) => (
                  <div key={row.label} className="flex items-center justify-between text-13">
                    <span className="text-slate">{row.label}</span>
                    <span className="font-polysans text-graphite">{row.value}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* Topics */}
            <section className="rounded-2xl bg-ash p-6">
              <h2 className="font-polysans text-subheading tracking-[-0.02em] text-graphite">
                Topics
              </h2>

              <div className="mt-4 space-y-3">
                <div className="flex items-center justify-between text-13">
                  <span className="text-slate">Primary Topic</span>
                  <span className="font-polysans text-graphite">{results.topic}</span>
                </div>
                <div className="flex items-center justify-between text-13">
                  <span className="text-slate">Subtopic</span>
                  <span className="font-polysans text-graphite">{results.subtopic}</span>
                </div>
              </div>
            </section>
          </div>
        </div>
      )}

      {/* ── Question Review ────────────────────────────────────────── */}
      {activeTab === "Question Review" && (
        <div className="mt-8 space-y-5">
          <div className="flex items-center gap-2">
            {["all", "correct", "incorrect"].map((f) => (
              <button
                key={f}
                type="button"
                onClick={() => setReviewFilter(f)}
                className={`rounded-tags px-3.5 py-1.5 font-polysans text-13 tracking-[-0.02em] transition-colors ${
                  reviewFilter === f
                    ? "bg-graphite text-inverse"
                    : "bg-fog text-steel hover:text-graphite"
                }`}
              >
                {f === "all" ? "All" : f === "correct" ? "Correct" : "Incorrect"}
              </button>
            ))}
          </div>

          {reviewItems.length === 0 ? (
            <p className="text-13 text-slate">
              {reviewFilter === "incorrect"
                ? "No mistakes — a flawless session."
                : "Nothing to review here."}
            </p>
          ) : (
            reviewItems.map((q, i) => (
              <section key={q.questionId} className="rounded-2xl bg-ash p-6">
                <div className="flex items-start justify-between gap-4">
                  <p className="font-polysans text-15 tracking-[-0.02em] text-graphite">
                    Q{i + 1}. {q.title}
                  </p>
                  <span
                    className={`shrink-0 rounded-tags px-2.5 py-1 font-polysans text-11 ${
                      q.isCorrect
                        ? "bg-success/10 text-success"
                        : "bg-ember/10 text-ember"
                    }`}
                  >
                    {q.isCorrect ? "Correct" : "Incorrect"}
                  </span>
                </div>

                <div className="mt-4 space-y-2">
                  {q.options.map((opt) => {
                    const isCorrect = opt.id === q.correctOptionId;
                    const isSelected = opt.id === q.selectedOptionId;
                    return (
                      <div
                        key={opt.id}
                        className={`flex items-center gap-2.5 rounded-xl border px-4 py-2.5 text-13 ${
                          isCorrect
                            ? "border-success/40 bg-success/5 text-graphite"
                            : isSelected
                              ? "border-ember/40 bg-ember/5 text-graphite"
                              : "border-mist text-steel"
                        }`}
                      >
                        {isCorrect ? (
                          <CheckIcon className="h-4 w-4 shrink-0 text-success" />
                        ) : isSelected ? (
                          <XIcon className="h-4 w-4 shrink-0 text-ember" />
                        ) : (
                          <span className="h-4 w-4 shrink-0" />
                        )}
                        <span>{opt.text}</span>
                      </div>
                    );
                  })}
                </div>

                {q.solution && (
                  <div className="mt-4 rounded-xl bg-fog px-4 py-3">
                    <p className="font-polysans text-13 text-graphite">Solution</p>
                    <p className="mt-1 text-13 leading-[1.6] text-steel">{q.solution}</p>
                  </div>
                )}
              </section>
            ))
          )}
        </div>
      )}
    </div>
  );
}
