"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { ArrowLeftIcon, CheckIcon, XIcon, ClockIcon } from "@/components/ui/icons";
import { questionOptions, calculateResult, formatTime } from "@/lib/mock/practiceSession";
import { practiceSheets } from "@/lib/mock/dashboard";
import { topics } from "@/lib/mock/landing";

// ═══════════════════════════════════════════════════════════════════════
// DIFFICULTY COLORS
// ═══════════════════════════════════════════════════════════════════════
const DIFF_COLORS = {
  Easy: "bg-success/10 text-success",
  Medium: "bg-brass/10 text-brass",
  Hard: "bg-ember/10 text-ember",
};

const DIFF_DOT_COLORS = {
  Easy: "bg-success",
  Medium: "bg-brass",
  Hard: "bg-ember",
};

// ═══════════════════════════════════════════════════════════════════════
// FlagIcon (for mark-for-review indicator)
// ═══════════════════════════════════════════════════════════════════════
function FlagIcon({ className, filled }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill={filled ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" />
      <line x1="4" y1="22" x2="4" y2="15" />
    </svg>
  );
}

// ═══════════════════════════════════════════════════════════════════════
// Result Page Component
// ═══════════════════════════════════════════════════════════════════════
export default function PracticeSessionResultPage({ searchParams }) {
  const [showReview, setShowReview] = useState(false);
  const [filterReview, setFilterReview] = useState("all");

  // Get session data from URL params
  const { topicId, subtopicId, sheetId } = useSearchParams();

  // Try to find the sheet and questions
  const topic = topics.find((t) => t.id === topicId);
  const subtopic = topic?.subtopics.find((s) => s.id === subtopicId);
  const allSheets = practiceSheets[subtopicId] ?? [];
  const sheet = allSheets.find((s) => s.id === sheetId);

  // For demo purposes, use first available sheet if no params
  const displaySheet = sheet ?? allSheets[0];
  const displayTopic = topic ?? topics[0];
  const displaySubtopic = subtopic ?? displayTopic?.subtopics[0];

  // Mock results for demo (since we don't have actual session state in results page)
  const mockAnswers = useMemo(() => {
    if (!displaySheet) return {};
    const answers = {};
    displaySheet.questions.forEach((q, i) => {
      // Simulate: answer first 70% correctly
      if (i < Math.floor(displaySheet.questions.length * 0.7)) {
        const opts = questionOptions[q.id];
        if (opts) {
          answers[q.id] = opts.correctIndex;
        }
      } else if (i < Math.floor(displaySheet.questions.length * 0.85)) {
        // Some incorrect
        const opts = questionOptions[q.id];
        if (opts) {
          answers[q.id] = (opts.correctIndex + 1) % 4;
        }
      }
      // Rest unanswered
    });
    return answers;
  }, [displaySheet]);

  const result = useMemo(() => {
    if (!displaySheet) return null;
    return calculateResult(displaySheet.questions, mockAnswers);
  }, [displaySheet, mockAnswers]);

  if (!displaySheet || !result) {
    return (
      <div className="mx-auto w-full max-w-[var(--page-max-width)] px-6 py-10">
        <p className="text-15 text-steel">No session results available.</p>
        <Link
          href="/topics"
          className="mt-4 inline-flex items-center gap-1 font-polysans text-13 tracking-[-0.02em] text-ember hover:underline"
        >
          <ArrowLeftIcon className="h-3.5 w-3.5" />
          Browse Topics
        </Link>
      </div>
    );
  }

  // Mock time for demo
  const timeTaken = 420; // 7 minutes
  const mockMode = "PRACTICE";

  // Filter questions for review
  const filteredQuestions = displaySheet.questions.filter((q) => {
    if (filterReview === "all") return true;
    const selected = mockAnswers[q.id];
    const opts = questionOptions[q.id];
    if (filterReview === "correct") {
      return opts && selected === opts.correctIndex;
    }
    if (filterReview === "incorrect") {
      return opts && selected !== undefined && selected !== opts.correctIndex;
    }
    if (filterReview === "unanswered") {
      return selected === undefined || selected === null;
    }
    return true;
  });

  return (
    <div className="min-h-screen bg-canvas">
      {/* Top bar */}
      <header className="border-b border-mist bg-canvas/95 backdrop-blur">
        <div className="mx-auto flex h-14 max-w-[var(--page-max-width)] items-center px-6">
          <Link
            href={`/topics/${displayTopic?.id}/${displaySubtopic?.id}`}
            className="flex items-center gap-2 font-polysans text-15 tracking-[-0.02em] text-slate transition-colors hover:text-graphite"
          >
            <ArrowLeftIcon className="h-4 w-4" />
            Back to Sheet
          </Link>
        </div>
      </header>

      <div className="mx-auto max-w-[var(--page-max-width)] px-4 sm:px-6 py-8">
        {/* Result header */}
        <div className="text-center">
          <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-success/10">
            <CheckIcon className="h-8 w-8 text-success" />
          </div>
          <h1 className="mt-4 font-polysans text-heading tracking-[-0.02em] text-graphite">
            Session Complete!
          </h1>
          <p className="mt-2 text-15 text-steel">
            {displaySubtopic?.name} — Session {displaySheet.session}
          </p>
        </div>

        {/* Score card */}
        <div className="mt-8 rounded-2xl border border-mist bg-canvas p-6 sm:p-8">
          <div className="text-center">
            <p className="text-13 text-slate uppercase tracking-wider">Your Score</p>
            <p className="mt-2 font-polysans text-display tracking-[-0.02em] text-graphite">
              {result.score}
              <span className="text-heading text-slate">/{result.total}</span>
            </p>
          </div>

          {/* Stats grid */}
          <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="rounded-xl bg-success/5 px-4 py-4 text-center border border-success/10">
              <p className="font-polysans text-heading tracking-[-0.02em] text-success">
                {result.correct}
              </p>
              <p className="mt-1 text-13 text-slate">Correct</p>
            </div>
            <div className="rounded-xl bg-danger/5 px-4 py-4 text-center border border-danger/10">
              <p className="font-polysans text-heading tracking-[-0.02em] text-danger">
                {result.incorrect}
              </p>
              <p className="mt-1 text-13 text-slate">Incorrect</p>
            </div>
            <div className="rounded-xl bg-fog px-4 py-4 text-center border border-mist">
              <p className="font-polysans text-heading tracking-[-0.02em] text-slate">
                {result.unanswered}
              </p>
              <p className="mt-1 text-13 text-slate">Unanswered</p>
            </div>
            <div className="rounded-xl bg-ember/5 px-4 py-4 text-center border border-ember/10">
              <p className="font-polysans text-heading tracking-[-0.02em] text-ember">
                {result.accuracy}%
              </p>
              <p className="mt-1 text-13 text-slate">Accuracy</p>
            </div>
          </div>

          {/* Time taken (test mode) */}
          {mockMode === "TEST" && (
            <div className="mt-6 flex items-center justify-center gap-2 text-15 text-steel">
              <ClockIcon className="h-4 w-4" />
              Time taken: <span className="font-polysans text-graphite">{formatTime(timeTaken)}</span>
            </div>
          )}
        </div>

        {/* Action buttons */}
        <div className="mt-6 flex flex-col sm:flex-row gap-3">
          <Link
            href={`/practice/session?topicId=${displayTopic?.id}&subtopicId=${displaySubtopic?.id}&sheetId=${displaySheet.id}&mode=PRACTICE`}
            className="flex-1 flex items-center justify-center gap-2 rounded-buttons bg-graphite px-5 py-3 font-polysans text-15 tracking-[-0.02em] text-inverse transition-opacity hover:opacity-85"
          >
            Practice Again
          </Link>
          <Link
            href={`/topics/${displayTopic?.id}/${displaySubtopic?.id}`}
            className="flex-1 flex items-center justify-center gap-2 rounded-buttons border border-mist px-5 py-3 font-polysans text-15 tracking-[-0.02em] text-graphite transition-colors hover:bg-fog"
          >
            Back to Sheet
          </Link>
        </div>

        {/* Question-by-question review */}
        <div className="mt-10">
          <div className="flex items-center justify-between">
            <h2 className="font-polysans text-subheading tracking-[-0.02em] text-graphite">
              Question Review
            </h2>
            <button
              type="button"
              onClick={() => setShowReview((v) => !v)}
              className="font-polysans text-13 text-ember hover:underline"
            >
              {showReview ? "Hide Review" : "Show Review"}
            </button>
          </div>

          {showReview && (
            <>
              {/* Filter pills */}
              <div className="mt-4 flex items-center gap-2">
                {[
                  { value: "all", label: "All", count: result.total },
                  { value: "correct", label: "Correct", count: result.correct },
                  { value: "incorrect", label: "Incorrect", count: result.incorrect },
                  { value: "unanswered", label: "Unanswered", count: result.unanswered },
                ].map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setFilterReview(opt.value)}
                    className={`rounded-full px-3 py-1.5 font-polysans text-13 tracking-[-0.02em] transition-colors ${
                      filterReview === opt.value
                        ? "bg-graphite text-inverse"
                        : "bg-fog text-slate hover:text-graphite"
                    }`}
                  >
                    {opt.label} ({opt.count})
                  </button>
                ))}
              </div>

              {/* Questions list */}
              <div className="mt-4 space-y-3">
                {filteredQuestions.map((q, i) => {
                  const selected = mockAnswers[q.id];
                  const opts = questionOptions[q.id];
                  const isCorrect = opts && selected === opts.correctIndex;
                  const isIncorrect = opts && selected !== undefined && selected !== opts.correctIndex;
                  const isUnanswered = selected === undefined || selected === null;

                  return (
                    <div
                      key={q.id}
                      className={`rounded-2xl border bg-canvas p-5 ${
                        isCorrect
                          ? "border-success/20"
                          : isIncorrect
                          ? "border-danger/20"
                          : "border-mist"
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        {/* Status icon */}
                        <span
                          className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full ${
                            isCorrect
                              ? "bg-success/10 text-success"
                              : isIncorrect
                              ? "bg-danger/10 text-danger"
                              : "bg-fog text-slate"
                          }`}
                        >
                          {isCorrect ? (
                            <CheckIcon className="h-3.5 w-3.5" />
                          ) : isIncorrect ? (
                            <XIcon className="h-3.5 w-3.5" />
                          ) : (
                            <span className="text-13">—</span>
                          )}
                        </span>

                        <div className="min-w-0 flex-1">
                          {/* Question text */}
                          <p className="text-15 leading-[1.5] text-graphite">
                            {q.title}
                          </p>

                          {/* Options (show correct/selected) */}
                          {opts && (
                            <div className="mt-3 space-y-2">
                              {opts.options.map((option, oi) => {
                                const isThisCorrect = oi === opts.correctIndex;
                                const isThisSelected = oi === selected;
                                return (
                                  <div
                                    key={oi}
                                    className={`flex items-center gap-2 rounded-lg px-3 py-2 text-13 ${
                                      isThisCorrect
                                        ? "bg-success/5 text-success"
                                        : isThisSelected && !isThisCorrect
                                        ? "bg-danger/5 text-danger"
                                        : "text-slate"
                                    }`}
                                  >
                                    <span className="font-polysans">
                                      {String.fromCharCode(65 + oi)}.
                                    </span>
                                    <span className="flex-1">{option}</span>
                                    {isThisCorrect && (
                                      <CheckIcon className="h-3.5 w-3.5 text-success" />
                                    )}
                                    {isThisSelected && !isThisCorrect && (
                                      <XIcon className="h-3.5 w-3.5 text-danger" />
                                    )}
                                  </div>
                                );
                              })}
                            </div>
                          )}

                          {/* Explanation */}
                          {opts?.explanation && (
                            <div className="mt-3 rounded-lg bg-fog px-3 py-2">
                              <p className="text-13 text-steel leading-[1.5]">
                                <span className="font-polysans text-graphite">Explanation:</span>{" "}
                                {opts.explanation}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════
// Helper hook: useSearchParams (simple client-side parse)
// ═══════════════════════════════════════════════════════════════════════
function useSearchParams() {
  const [params, setParams] = useState({});

  if (typeof window !== "undefined" && Object.keys(params).length === 0) {
    const sp = new URLSearchParams(window.location.search);
    const obj = {};
    for (const [k, v] of sp.entries()) {
      obj[k] = v;
    }
    if (Object.keys(obj).length > 0) {
      setParams(obj);
    }
  }

  return params;
}
