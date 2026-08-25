"use client";

import { useState, use } from "react";
import Link from "next/link";
import {
  ClockIcon,
  CheckIcon,
  XIcon,
  CalendarIcon,
  UsersIcon,
  BarChart3Icon,
  TargetIcon,
  TrophyIcon,
  BrainIcon,
  ArrowLeftIcon,
} from "@/components/ui/icons";
import GoBack from "@/components/ui/GoBack";
import Button from "@/components/ui/Button";
import { contestDetails } from "@/lib/mock/contests";

// ─── Helpers ───────────────────────────────────────────────────────────
function formatDate(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-IN", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function getAccuracyColor(accuracy) {
  if (accuracy >= 80) return "var(--color-success)";
  if (accuracy >= 50) return "var(--color-brass)";
  return "var(--color-ember)";
}

function getAccuracyLabel(accuracy) {
  if (accuracy >= 80) return "Excellent";
  if (accuracy >= 60) return "Good";
  if (accuracy >= 40) return "Average";
  return "Needs Work";
}

// ─── Accuracy Ring ────────────────────────────────────────────────────
function AccuracyRing({ accuracy, size = 120 }) {
  const radius = (size - 10) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (accuracy / 100) * circumference;
  const color = getAccuracyColor(accuracy);

  return (
    <div
      className="relative inline-flex items-center justify-center"
      style={{ width: size, height: size }}
    >
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="var(--color-mist)"
          strokeWidth={8}
        />
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
        <span className="font-polysans text-[28px] leading-none tracking-[-0.02em] text-graphite">
          {accuracy}%
        </span>
        <span className="mt-1 text-[11px] text-slate">Accuracy</span>
      </div>
    </div>
  );
}

// ─── Mini Progress Bar ────────────────────────────────────────────────
function MiniBar({ correct, total, color = "var(--color-success)" }) {
  const pct = total > 0 ? (correct / total) * 100 : 0;
  return (
    <div className="h-1.5 w-full overflow-hidden rounded-full bg-mist">
      <div
        className="h-full rounded-full transition-all duration-500"
        style={{ width: `${pct}%`, backgroundColor: color }}
      />
    </div>
  );
}

// ─── Component ─────────────────────────────────────────────────────────
export default function ContestDetailPage({ params }) {
  const { contestId } = use(params);
  const [showQuestions, setShowQuestions] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState(null);

  const contest = contestDetails[contestId];

  if (!contest) {
    return (
      <div className="mx-auto w-full max-w-[var(--page-max-width)] px-6 py-10">
        <GoBack href="/contests" label="Back to Contests" className="mb-6" />
        <div className="rounded-2xl bg-ash px-6 py-16 text-center">
          <p className="text-[15px] text-steel">Result not available yet.</p>
          <p className="mt-2 text-[13px] text-slate">
            The contest result may still be processing.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-[var(--page-max-width)] px-6 py-10">
      {/* ── Back navigation ────────────────────────────────────────── */}
      <GoBack href="/contests" label="Back to Contests" className="mb-6" />

      {/* ── 1. Page Header ─────────────────────────────────────────── */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="font-polysans text-heading-lg tracking-[-0.02em] text-graphite">
              {contest.name}
            </h1>
            <span className="inline-flex items-center gap-1 rounded-full bg-success/10 px-2.5 py-0.5 text-[11px] font-medium text-success">
              {contest.status}
            </span>
          </div>
          <p className="mt-2 text-[15px] text-steel">
            {contest.type === "Company"
              ? `${contest.company}-focused aptitude assessment`
              : "Weekly aptitude assessment"}{" "}
            · {formatDate(contest.date)} · {contest.duration} minutes ·{" "}
            {contest.total} questions
          </p>
        </div>
      </div>

      {/* ── 2. Result Summary ──────────────────────────────────────── */}
      <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
        {[
          {
            label: "Score",
            value: `${contest.score} / ${contest.total}`,
            icon: TargetIcon,
            color: "text-graphite",
          },
          {
            label: "Accuracy",
            value: `${contest.accuracy}%`,
            sub: getAccuracyLabel(contest.accuracy),
            icon: BarChart3Icon,
            color:
              contest.accuracy >= 80
                ? "text-success"
                : contest.accuracy >= 50
                  ? "text-brass"
                  : "text-ember",
          },
          {
            label: "Rank",
            value: `#${contest.rank}`,
            sub: `out of ${contest.totalParticipants.toLocaleString()}`,
            icon: TrophyIcon,
            color: "text-graphite",
          },
          {
            label: "Percentile",
            value: `${contest.percentile}%`,
            sub: `Ahead of ${contest.percentile}% of participants`,
            icon: TrophyIcon,
            color: "text-graphite",
          },
        ].map((m) => {
          const Icon = m.icon;
          return (
            <div key={m.label} className="rounded-xl bg-ash px-4 py-4">
              <div className="flex items-center gap-2">
                <Icon className="h-3.5 w-3.5 text-slate" />
                <span className="text-[11px] uppercase tracking-wider text-slate">
                  {m.label}
                </span>
              </div>
              <p
                className={`mt-2 font-polysans text-[22px] tracking-[-0.02em] ${m.color}`}
              >
                {m.value}
              </p>
              {m.sub && (
                <p className="mt-0.5 text-[12px] text-slate">{m.sub}</p>
              )}
            </div>
          );
        })}
      </div>

      {/* ── 3. Performance Overview ─────────────────────────────────── */}
      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-[1fr_320px]">
        {/* LEFT: Main content */}
        <div className="space-y-6">
          <section className="rounded-2xl bg-ash p-6">
            <h2 className="font-polysans text-[18px] tracking-[-0.02em] text-graphite">
              Performance Overview
            </h2>

            <div className="mt-5 flex flex-col items-center gap-6 sm:flex-row sm:items-start">
              {/* Accuracy ring */}
              <div className="shrink-0">
                <AccuracyRing accuracy={contest.accuracy} />
              </div>

              {/* Breakdown */}
              <div className="flex-1 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className="h-2.5 w-2.5 rounded-full bg-success" />
                    <span className="text-[14px] text-steel">
                      Correct Answers
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-polysans text-[15px] text-graphite">
                      {contest.correct}
                    </span>
                    <span className="text-[12px] text-slate">
                      ({Math.round((contest.correct / contest.total) * 100)}%)
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className="h-2.5 w-2.5 rounded-full bg-ember" />
                    <span className="text-[14px] text-steel">
                      Incorrect Answers
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-polysans text-[15px] text-graphite">
                      {contest.incorrect}
                    </span>
                    <span className="text-[12px] text-slate">
                      (
                      {Math.round(
                        (contest.incorrect / contest.total) * 100,
                      )}
                      %)
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className="h-2.5 w-2.5 rounded-full bg-mist" />
                    <span className="text-[14px] text-steel">
                      Unattempted
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-polysans text-[15px] text-graphite">
                      {contest.unattempted}
                    </span>
                    <span className="text-[12px] text-slate">
                      ({Math.round((contest.unattempted / contest.total) * 100)}
                      %)
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between border-t border-mist pt-3">
                  <div className="flex items-center gap-2.5">
                    <span className="h-2.5 w-2.5 rounded-full bg-graphite" />
                    <span className="text-[14px] text-steel">Total</span>
                  </div>
                  <span className="font-polysans text-[15px] text-graphite">
                    {contest.total}
                  </span>
                </div>

                {/* Time info */}
                <div className="flex items-center justify-between border-t border-mist pt-3">
                  <div className="flex items-center gap-2.5">
                    <ClockIcon className="h-3.5 w-3.5 text-slate" />
                    <span className="text-[14px] text-steel">Time Taken</span>
                  </div>
                  <span className="font-polysans text-[15px] text-graphite">
                    {contest.timeTaken} min
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <ClockIcon className="h-3.5 w-3.5 text-slate" />
                    <span className="text-[14px] text-steel">
                      Total Time
                    </span>
                  </div>
                  <span className="font-polysans text-[15px] text-graphite">
                    {contest.duration} min
                  </span>
                </div>
              </div>
            </div>
          </section>

          {/* ── 4. Difficulty Breakdown ──────────────────────────────── */}
          <section className="rounded-2xl bg-ash p-6">
            <h2 className="font-polysans text-[18px] tracking-[-0.02em] text-graphite">
              Difficulty Breakdown
            </h2>

            <div className="mt-5 space-y-4">
              {contest.difficultyBreakdown.map((d) => (
                <div key={d.level}>
                  <div className="flex items-center justify-between">
                    <span className="text-[14px] font-medium text-graphite">
                      {d.level}
                    </span>
                    <div className="flex items-center gap-3">
                      <span className="font-polysans text-[14px] text-graphite">
                        {d.correct} / {d.total}
                      </span>
                      <span
                        className="text-[12px]"
                        style={{
                          color: getAccuracyColor(d.accuracy),
                        }}
                      >
                        {d.accuracy}% accuracy
                      </span>
                    </div>
                  </div>
                  <div className="mt-2">
                    <MiniBar
                      correct={d.correct}
                      total={d.total}
                      color={getAccuracyColor(d.accuracy)}
                    />
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* ── 5. Topic Performance ────────────────────────────────── */}
          <section className="rounded-2xl bg-ash p-6">
            <h2 className="font-polysans text-[18px] tracking-[-0.02em] text-graphite">
              Topic Performance
            </h2>

            <div className="mt-5 space-y-4">
              {contest.topicPerformance.map((t) => (
                <div key={t.topic}>
                  <div className="flex items-center justify-between">
                    <span className="text-[14px] font-medium text-graphite">
                      {t.topic}
                    </span>
                    <div className="flex items-center gap-3">
                      <span className="font-polysans text-[14px] text-graphite">
                        {t.correct} / {t.total}
                      </span>
                      <span
                        className="text-[12px]"
                        style={{
                          color: getAccuracyColor(t.accuracy),
                        }}
                      >
                        {t.accuracy}%
                      </span>
                    </div>
                  </div>
                  <div className="mt-2">
                    <MiniBar
                      correct={t.correct}
                      total={t.total}
                      color={getAccuracyColor(t.accuracy)}
                    />
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* RIGHT: Sidebar */}
        <div className="space-y-6">
          {/* ── 6. Performance Insight ──────────────────────────────── */}
          <section className="rounded-2xl bg-ash p-6">
            <h2 className="font-polysans text-[18px] tracking-[-0.02em] text-graphite">
              Performance Insight
            </h2>
            <div className="mt-4 space-y-2.5">
              {contest.insights.map((insight, i) => (
                <div
                  key={i}
                  className="flex items-start gap-2.5 text-[13px] leading-[1.5] text-steel"
                >
                  <span className="mt-0.5 h-1.5 w-1.5 shrink-0 rounded-full bg-ember" />
                  {insight}
                </div>
              ))}
            </div>
          </section>

          {/* ── 7. Rank / Percentile ───────────────────────────────── */}
          <section className="rounded-2xl bg-ash p-6">
            <h2 className="font-polysans text-[18px] tracking-[-0.02em] text-graphite">
              Rank &amp; Percentile
            </h2>

            <div className="mt-5 text-center">
              {/* Simple visual: percentile bar */}
              <div className="relative mx-auto h-3 w-full overflow-hidden rounded-full bg-mist">
                <div
                  className="absolute inset-y-0 left-0 rounded-full bg-ember transition-all duration-700"
                  style={{ width: `${contest.percentile}%` }}
                />
                {/* User marker */}
                <div
                  className="absolute -top-1 h-5 w-1 rounded-full bg-graphite"
                  style={{ left: `${contest.percentile}%`, transform: "translateX(-50%)" }}
                />
              </div>
              <div className="mt-2 flex items-center justify-between text-[11px] text-slate">
                <span>0%</span>
                <span>50%</span>
                <span>100%</span>
              </div>
            </div>

            <div className="mt-5 space-y-3">
              <div className="flex items-center justify-between text-[13px]">
                <span className="text-slate">Your Rank</span>
                <span className="font-polysans text-graphite">
                  #{contest.rank} / {contest.totalParticipants.toLocaleString()}
                </span>
              </div>
              <div className="flex items-center justify-between text-[13px]">
                <span className="text-slate">Percentile</span>
                <span className="font-polysans text-graphite">
                  {contest.percentile}%
                </span>
              </div>
              <div className="flex items-center justify-between text-[13px]">
                <span className="text-slate">Ahead of</span>
                <span className="font-polysans text-graphite">
                  {Math.round(contest.percentile)}% of participants
                </span>
              </div>
            </div>
          </section>

          {/* ── 8. Contest Information ─────────────────────────────── */}
          <section className="rounded-2xl bg-ash p-6">
            <h2 className="font-polysans text-[18px] tracking-[-0.02em] text-graphite">
              Contest Information
            </h2>

            <div className="mt-4 space-y-3">
              {[
                { label: "Contest Type", value: contest.type },
                {
                  label: "Contest Date",
                  value: formatDate(contest.date),
                },
                {
                  label: "Duration",
                  value: `${contest.duration} minutes`,
                },
                {
                  label: "Total Questions",
                  value: contest.total,
                },
                ...(contest.company
                  ? [{ label: "Company", value: contest.company }]
                  : []),
                {
                  label: "Topics Covered",
                  value: contest.topicPerformance
                    .map((t) => t.topic)
                    .join(", "),
                },
              ].map((row) => (
                <div
                  key={row.label}
                  className="flex items-center justify-between text-[13px]"
                >
                  <span className="text-slate">{row.label}</span>
                  <span className="max-w-[60%] text-right font-polysans text-graphite">
                    {row.value}
                  </span>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>

      {/* ── 9. Question Review ──────────────────────────────────────── */}
      {contest.questions && contest.questions.length > 0 && (
        <div className="mt-8">
          <section className="rounded-2xl bg-ash p-6">
            <div className="flex items-center justify-between">
              <h2 className="font-polysans text-[18px] tracking-[-0.02em] text-graphite">
                Question Review
              </h2>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setShowQuestions(!showQuestions)}
              >
                {showQuestions ? "Hide Questions" : "Review Questions"}
              </Button>
            </div>

            {showQuestions && (
              <div className="mt-5">
                {/* Question list */}
                <div className="space-y-3">
                  {contest.questions.map((q) => (
                    <div
                      key={q.id}
                      className={`rounded-xl border p-4 transition-colors ${
                        selectedQuestion === q.id
                          ? "border-graphite bg-canvas"
                          : "border-mist bg-canvas hover:border-graphite/30"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-polysans text-[13px] text-graphite">
                              Q{q.id}
                            </span>
                            <span
                              className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium ${
                                q.status === "correct"
                                  ? "bg-success/10 text-success"
                                  : q.status === "incorrect"
                                    ? "bg-ember/10 text-ember"
                                    : "bg-mist text-slate"
                              }`}
                            >
                              {q.status === "correct"
                                ? "Correct"
                                : q.status === "incorrect"
                                  ? "Incorrect"
                                  : "Unattempted"}
                            </span>
                            <span
                              className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium ${
                                q.difficulty === "Easy"
                                  ? "bg-success/10 text-success"
                                  : q.difficulty === "Medium"
                                    ? "bg-brass/10 text-brass"
                                    : "bg-ember/10 text-ember"
                              }`}
                            >
                              {q.difficulty}
                            </span>
                            <span className="text-[11px] text-slate">
                              {q.topic}
                            </span>
                          </div>
                          <p className="mt-2 text-[14px] leading-[1.5] text-graphite">
                            {q.question}
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() =>
                            setSelectedQuestion(
                              selectedQuestion === q.id ? null : q.id,
                            )
                          }
                          className="shrink-0 text-[13px] text-ember hover:underline"
                        >
                          {selectedQuestion === q.id ? "Collapse" : "Expand"}
                        </button>
                      </div>

                      {/* Expanded: options & answer */}
                      {selectedQuestion === q.id && (
                        <div className="mt-4 space-y-2 border-t border-mist pt-4">
                          {q.options.map((opt, i) => {
                            const isCorrect = i === q.correct;
                            const isUserAnswer = i === q.userAnswer;
                            let optClass = "text-[13px] text-steel";
                            let indicator = null;

                            if (isCorrect) {
                              optClass = "text-[13px] font-medium text-success";
                              indicator = (
                                <CheckIcon className="h-3.5 w-3.5 text-success" />
                              );
                            }
                            if (isUserAnswer && !isCorrect) {
                              optClass = "text-[13px] font-medium text-ember";
                              indicator = (
                                <XIcon className="h-3.5 w-3.5 text-ember" />
                              );
                            }

                            return (
                              <div
                                key={i}
                                className={`flex items-center gap-2.5 rounded-lg px-3 py-2 ${
                                  isCorrect
                                    ? "bg-success/5"
                                    : isUserAnswer
                                      ? "bg-ember/5"
                                      : ""
                                }`}
                              >
                                <span className="h-5 w-5 shrink-0 rounded-full border border-mist bg-canvas text-center text-[11px] leading-5 text-slate">
                                  {String.fromCharCode(65 + i)}
                                </span>
                                <span className={optClass}>{opt}</span>
                                {indicator}
                              </div>
                            );
                          })}

                          {q.userAnswer === null && (
                            <p className="mt-1 text-[12px] italic text-slate">
                              You did not attempt this question.
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </section>
        </div>
      )}

      {/* ── 10. Navigation / Actions ───────────────────────────────── */}
      <div className="mt-8 flex items-center justify-between border-t border-mist pt-6">
        <Link
          href="/contests"
          className="inline-flex items-center gap-1.5 text-[13px] text-slate transition-colors hover:text-graphite"
        >
          <ArrowLeftIcon className="h-3.5 w-3.5" />
          Back to Contests
        </Link>

        {contest.questions && contest.questions.length > 0 && !showQuestions && (
          <Button
            variant="secondary"
            size="sm"
            onClick={() => {
              setShowQuestions(true);
              window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
            }}
          >
            Review Questions
          </Button>
        )}
      </div>
    </div>
  );
}
