"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  CheckIcon,
  ClockIcon,
  XIcon,
  BookmarkIcon,
} from "@/components/ui/icons";
import {
  PracticeProvider,
  usePracticeSession,
} from "@/context/PracticeContext";
import { formatTime } from "@/lib/mock/practiceSession";
import {
  getSession,
  submitAttempt,
  completeSession,
} from "@/lib/api/practice";
import Button from "@/components/ui/Button";

// ═══════════════════════════════════════════════════════════════════════
// Custom BookmarkIcon (flag for mark-for-review)
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
// DIFFICULTY — restrained monochrome chips; correctness alone uses color.
// (API sends EASY/MEDIUM/HARD; display labels stay capitalized.)
// ═══════════════════════════════════════════════════════════════════════
const DIFF_LABEL = { EASY: "Easy", MEDIUM: "Medium", HARD: "Hard" };
const diffLabel = (d) => DIFF_LABEL[d] || d;
const DIFF_COLORS = {
  Easy: "bg-ash text-steel",
  Medium: "bg-ash text-steel",
  Hard: "bg-ash text-steel",
};

const DIFF_DOT_COLORS = {
  Easy: "bg-faint",
  Medium: "bg-slate",
  Hard: "bg-graphite",
};

// ═══════════════════════════════════════════════════════════════════════
// Session Header
// ═══════════════════════════════════════════════════════════════════════
function SessionHeader({ onExit, showExitConfirm, setShowExitConfirm }) {
  const {
    meta,
    currentIndex,
    total,
    answeredCount,
    elapsedSeconds,
    mode,
  } = usePracticeSession();

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-mist bg-canvas/95 backdrop-blur">
        <div className="mx-auto flex h-14 max-w-[var(--page-max-width)] items-center justify-between px-6">
          {/* Left: back link + sheet info */}
          <div className="flex items-center gap-4 min-w-0">
            <button
              type="button"
              onClick={() => setShowExitConfirm(true)}
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-slate transition-colors hover:bg-ash hover:text-graphite"
              aria-label="Exit session"
            >
              <XIcon className="h-4 w-4" />
            </button>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h1 className="truncate font-polysans text-15 tracking-[-0.02em] text-graphite">
                  {meta?.sheetName ?? "Practice Session"}
                </h1>
                <span
                  className={`hidden sm:inline-flex items-center gap-1.5 rounded-tags px-2 py-0.5 font-polysans text-13 tracking-[-0.02em] ${DIFF_COLORS[diffLabel(meta?.difficulty)] ?? ""}`}
                >
                  <span
                    className={`h-1.5 w-1.5 rounded-full ${DIFF_DOT_COLORS[diffLabel(meta?.difficulty)] ?? ""}`}
                  />
                  {diffLabel(meta?.difficulty)}
                </span>
              </div>
              <p className="text-13 text-slate hidden sm:block">
                {meta?.subtopicName} · {meta?.topicName}
              </p>
            </div>
          </div>

          {/* Center: question counter */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 rounded-full bg-fog px-4 py-1.5">
              <span className="font-polysans text-15 tracking-[-0.02em] text-graphite">
                {currentIndex + 1}
              </span>
              <span className="text-slate">/</span>
              <span className="font-polysans text-15 tracking-[-0.02em] text-slate">
                {total}
              </span>
            </div>

            {/* Timer (test mode only) */}
            {mode === "TEST" && (
              <div className="flex items-center gap-1.5 rounded-full bg-ash px-3 py-1.5">
                <ClockIcon className="h-3.5 w-3.5 text-steel" />
                <span className="font-polysans text-15 tracking-[-0.02em] text-graphite tabular-nums">
                  {formatTime(elapsedSeconds)}
                </span>
              </div>
            )}
          </div>

          {/* Right: answered count */}
          <div className="flex items-center gap-3">
            <span className="text-13 text-slate hidden sm:block">
              {answeredCount}/{total} answered
            </span>
          </div>
        </div>
      </header>

      {/* Exit confirmation modal */}
      {showExitConfirm && (
        <div className="modal-overlay fixed inset-0 z-[100] flex items-center justify-center bg-graphite/40">
          <div className="modal-panel mx-4 w-full max-w-sm rounded-cards border border-mist bg-canvas p-6 shadow-[0_16px_48px_-16px_rgba(0,0,0,0.25)]">
            <h2 className="font-polysans text-subheading tracking-[-0.02em] text-graphite">
              Exit Practice Session?
            </h2>
            <p className="mt-2 text-15 text-steel leading-[1.6]">
              Your progress has been saved. You can resume this session later from your profile or dashboard.
            </p>
            <div className="mt-6 flex gap-3">
              <Button variant="secondary" className="flex-1" onClick={() => setShowExitConfirm(false)}>
                Continue Session
              </Button>
              <Button render={<Link href={`/topics`} onClick={() => onExit()} />} variant="primary" className="flex-1 text-center">
                Exit
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

// ═══════════════════════════════════════════════════════════════════════
// Question Display + MCQ Options
// ═══════════════════════════════════════════════════════════════════════
function QuestionDisplay() {
  const {
    currentQuestion,
    currentAnswer,
    currentMarked,
    isLocked,
    selectOption,
    toggleMark,
    clearAnswer,
    goNext,
    goPrev,
    currentIndex,
    total,
    submit,
    isSubmitted,
    mode,
  } = usePracticeSession();

  if (!currentQuestion) return null;

  // Live options come with the question (id/text, never answers).
  const opts = currentQuestion.options || [];
  const optionLabels = ["A", "B", "C", "D"];
  const isLast = currentIndex === total - 1;
  const hasAnswer = currentAnswer !== undefined && currentAnswer !== null;
  const locked = isLocked(currentQuestion.id);

  return (
    <div className="flex-1 min-w-0">
      {/* Question card */}
      <div className="rounded-2xl border border-mist bg-canvas p-6 sm:p-8">
        {/* Question number + mark for review */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-ash font-polysans text-13 text-graphite">
              {currentIndex + 1}
            </span>
            <span className="text-13 text-slate">
              {diffLabel(currentQuestion.difficulty)}
            </span>
          </div>
          <button
            type="button"
            onClick={() => toggleMark(currentQuestion.id)}
            className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-13 font-polysans transition-colors ${
              currentMarked
                ? "bg-ash font-medium text-graphite"
                : "text-slate hover:bg-ash hover:text-graphite"
            }`}
            aria-label={currentMarked ? "Unmark for review" : "Mark for review"}
          >
            <FlagIcon className="h-3.5 w-3.5" filled={currentMarked} />
            {currentMarked ? "Marked" : "Mark for Review"}
          </button>
        </div>

        {/* Question text */}
        <p className="mt-5 text-17 sm:text-lg leading-[1.6] text-graphite">
          {currentQuestion.title}
        </p>

        {/* MCQ options */}
        {opts.length > 0 && (
          <div className="mt-6 space-y-3">
            {opts.map((option, i) => {
              const isSelected = currentAnswer === i;
              return (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => selectOption(currentQuestion.id, i)}
                  disabled={locked}
                  className={`group flex w-full items-center gap-4 rounded-xl border px-5 py-3.5 text-left transition-colors duration-150 ${
                    isSelected
                      ? "border-graphite bg-canvas"
                      : "border-mist hover:border-mist-strong"
                  }`}
                >
                  {/* Option label */}
                  <span
                    className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full font-polysans text-13 ${
                      isSelected
                        ? "bg-graphite text-inverse"
                        : "bg-ash text-slate group-hover:text-graphite"
                    }`}
                  >
                    {optionLabels[i]}
                  </span>
                  {/* Option text */}
                  <span
                    className={`text-15 ${
                      isSelected ? "font-polysans text-graphite" : "text-graphite"
                    }`}
                  >
                    {option.text}
                  </span>
                  {/* Selected check */}
                  {isSelected && (
                    <CheckIcon className="ml-auto h-4 w-4 shrink-0 text-graphite" />
                  )}
                </button>
              );
            })}
          </div>
        )}

        {/* Recorded note / Clear answer */}
        {locked ? (
          <p className="mt-4 font-polysans text-13 text-success">
            Answer recorded
          </p>
        ) : (
          hasAnswer && (
            <button
              type="button"
              onClick={() => clearAnswer(currentQuestion.id)}
              className="mt-4 font-polysans text-13 text-slate hover:text-graphite"
            >
              Clear selection
            </button>
          )
        )}
      </div>

      {/* Bottom navigation */}
      <div className="mt-4 flex items-center justify-between">
        <Button variant="secondary" onClick={goPrev} disabled={currentIndex === 0}>
          <ArrowLeftIcon className="h-4 w-4" />
          Previous
        </Button>

        {isLast ? (
          <Button variant="primary" onClick={() => submit().catch(() => {})}>
            Submit Session
            <CheckIcon className="h-4 w-4" />
          </Button>
        ) : (
          <Button variant="primary" onClick={goNext}>
            Next
            <ArrowRightIcon className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════
// Question Navigator (right sidebar)
// ═══════════════════════════════════════════════════════════════════════
function QuestionNavigator() {
  const {
    questions,
    currentIndex,
    answers,
    marks,
    goTo,
    answeredCount,
    markedCount,
    total,
    progress,
    submit,
    isSubmitted,
    mode,
    elapsedSeconds,
  } = usePracticeSession();

  const [showConfirmSubmit, setShowConfirmSubmit] = useState(false);

  const unanswered = total - answeredCount;
  const remaining = total - answeredCount;

  return (
    <div className="lg:sticky lg:top-20 w-full lg:w-[300px] shrink-0">
      {/* Progress card */}
      <div className="rounded-cards border border-mist bg-canvas p-5">
        <h3 className="font-inter text-[13px] font-medium text-graphite">
          Session Progress
        </h3>

        {/* Progress bar */}
        <div className="mt-3">
          <div className="flex items-center justify-between text-13">
            <span className="text-slate">Progress</span>
            <span className="font-polysans text-graphite">{progress}%</span>
          </div>
          <div className="mt-2 h-1.5 w-full rounded-full bg-mist">
            <div
              className="h-full rounded-full bg-graphite transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Stats */}
        <div className="mt-4 grid grid-cols-3 gap-2">
          <div className="rounded-lg bg-ash px-2 py-2.5 text-center">
            <p className="font-inter text-[15px] font-medium text-graphite">
              {answeredCount}
            </p>
            <p className="text-13 text-slate">Answered</p>
          </div>
          <div className="rounded-lg bg-ash px-2 py-2.5 text-center">
            <p className="font-inter text-[15px] font-medium text-graphite">
              {unanswered}
            </p>
            <p className="text-13 text-slate">Remaining</p>
          </div>
          <div className="rounded-lg bg-ash px-2 py-2.5 text-center">
            <p className="font-inter text-[15px] font-medium text-graphite">
              {markedCount}
            </p>
            <p className="text-13 text-slate">Marked</p>
          </div>
        </div>
      </div>

      {/* Question grid */}
      <div className="mt-4 rounded-cards border border-mist bg-canvas p-5">
        <h3 className="font-inter text-[13px] font-medium text-graphite">
          Questions
        </h3>

        <div className="mt-3 grid grid-cols-5 gap-2">
          {questions.map((q, i) => {
            const isAnswered = answers[q.id] !== undefined && answers[q.id] !== null;
            const isMarked = marks[q.id];
            const isCurrent = i === currentIndex;

            return (
              <button
                key={q.id}
                type="button"
                onClick={() => goTo(i)}
                className={`relative flex h-9 w-full items-center justify-center rounded-lg font-inter text-[12px] transition-colors duration-150 ${
                  isCurrent
                    ? "bg-graphite text-inverse"
                    : isAnswered
                    ? "bg-ash font-medium text-graphite"
                    : "border border-mist bg-canvas text-slate hover:border-mist-strong hover:text-graphite"
                }`}
                aria-label={`Question ${i + 1}${isAnswered ? " (answered)" : ""}${isMarked ? " (marked)" : ""}`}
              >
                {i + 1}
                {isMarked && (
                  <span className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-graphite" />
                )}
              </button>
            );
          })}
        </div>

        {/* Legend */}
        <div className="mt-4 flex flex-wrap items-center gap-3 text-13 text-slate">
          <span className="flex items-center gap-1.5">
            <span className="h-3 w-3 rounded bg-graphite" />
            Current
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-3 w-3 rounded bg-ash" />
            Answered
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-3 w-3 rounded border border-mist bg-canvas" />
            Unanswered
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-graphite" />
            Marked
          </span>
        </div>
      </div>

      {/* Submit button */}
      <div className="mt-4">
        <Button variant="primary" className="w-full" onClick={() => setShowConfirmSubmit(true)}>
          Submit Session
          <CheckIcon className="h-4 w-4" />
        </Button>
        <p className="mt-2 text-center text-13 text-slate">
          {remaining} question{remaining !== 1 ? "s" : ""} remaining
        </p>
      </div>

      {/* Confirm submit modal */}
      {showConfirmSubmit && (
        <div className="modal-overlay fixed inset-0 z-[100] flex items-center justify-center bg-graphite/40">
          <div className="modal-panel mx-4 w-full max-w-sm rounded-cards border border-mist bg-canvas p-6 shadow-[0_16px_48px_-16px_rgba(0,0,0,0.25)]">
            <h2 className="font-polysans text-subheading tracking-[-0.02em] text-graphite">
              Submit Practice Session?
            </h2>
            <div className="mt-3 space-y-2">
              <p className="text-15 text-steel leading-[1.6]">
                You have answered{" "}
                <span className="font-polysans text-graphite">{answeredCount}</span> out of{" "}
                <span className="font-polysans text-graphite">{total}</span> questions.
              </p>
              {unanswered > 0 && (
                <p className="text-15 text-danger leading-[1.6]">
                  {unanswered} question{unanswered !== 1 ? "s" : ""} will be marked as unanswered.
                </p>
              )}
              {mode === "TEST" && (
                <p className="text-15 text-steel leading-[1.6]">
                  Time taken: <span className="font-polysans text-graphite">{formatTime(elapsedSeconds)}</span>
                </p>
              )}
            </div>
            <div className="mt-6 flex gap-3">
              <Button variant="secondary" className="flex-1" onClick={() => setShowConfirmSubmit(false)}>
                Go Back
              </Button>
              <Button
                variant="primary"
                className="flex-1"
                onClick={() => {
                  submit()
                    .then(() => setShowConfirmSubmit(false))
                    .catch(() => {});
                }}
              >
                Confirm Submit
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════
// PracticeSessionPage (inner — needs provider)
// ═══════════════════════════════════════════════════════════════════════
function PracticeSessionInner({ apiError }) {
  const router = useRouter();
  const { exit, isSubmitted, sessionId } = usePracticeSession();
  const [showExitConfirm, setShowExitConfirm] = useState(false);

  // If session was submitted, redirect to results
  useEffect(() => {
    if (isSubmitted) {
      router.push(`/practice/session/result?sessionId=${sessionId}`);
    }
  }, [isSubmitted, router, sessionId]);

  return (
    <div className="min-h-screen bg-canvas">
      <SessionHeader
        onExit={exit}
        showExitConfirm={showExitConfirm}
        setShowExitConfirm={setShowExitConfirm}
      />

      {apiError && (
        <div className="mx-auto max-w-[var(--page-max-width)] px-4 sm:px-6 pt-4">
          <div className="rounded-xl border border-ember/40 bg-ash px-5 py-3 text-13 text-ember">
            {apiError}
          </div>
        </div>
      )}

      <div className="mx-auto max-w-[var(--page-max-width)] px-4 sm:px-6 py-6">
        <div className="flex flex-col lg:flex-row gap-6 lg:items-start">
          {/* Main: Question + Nav */}
          <QuestionDisplay />

          {/* Sidebar: Navigator + Progress */}
          <QuestionNavigator />
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════
// Exported page — loads a live session from ?sessionId=
// ═══════════════════════════════════════════════════════════════════════
export default function PracticeSessionPage({ params, searchParams }) {
  const router = useRouter();
  const { sessionId } = useSearchParams();
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [apiError, setApiError] = useState("");

  useEffect(() => {
    if (!sessionId) {
      setLoading(false);
      return;
    }
    let cancelled = false;
    (async () => {
      try {
        const data = await getSession(sessionId);
        if (cancelled) return;
        if (data.completed) {
          router.replace(`/practice/session/result?sessionId=${sessionId}`);
          return;
        }
        setSession(data);
      } catch (err) {
        if (!cancelled) setError(err.message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [sessionId, router]);

  const handleAnswer = useCallback(
    (questionId, optionId) => submitAttempt(sessionId, questionId, optionId),
    [sessionId],
  );

  const handleSubmit = useCallback(async () => {
    await completeSession(sessionId);
    router.push(`/practice/session/result?sessionId=${sessionId}`);
  }, [sessionId, router]);

  const handleError = useCallback((err) => {
    setApiError(err?.message || "Something went wrong. Please try again.");
  }, []);

  if (loading) {
    return (
      <div className="mx-auto w-full max-w-[var(--page-max-width)] px-6 py-10">
        <p className="text-13 text-slate">Loading session…</p>
      </div>
    );
  }

  // No session in URL — point at real entry points.
  if (!sessionId || error || !session) {
    return (
      <div className="mx-auto w-full max-w-[var(--page-max-width)] px-6 py-10">
        <p className="text-15 text-steel">
          {error ? `Couldn't load this session: ${error}` : "No active session."}
        </p>
        <Link
          href="/topics"
          className="mt-4 inline-flex items-center gap-1 font-inter text-[12px] text-steel transition-colors hover:text-graphite"
        >
          <ArrowLeftIcon className="h-3.5 w-3.5" />
          Browse Topics
        </Link>
      </div>
    );
  }

  if (session.questions.length === 0) {
    return (
      <div className="mx-auto w-full max-w-[var(--page-max-width)] px-6 py-10">
        <p className="text-15 text-steel">This session has no questions.</p>
        <Link
          href="/topics"
          className="mt-4 inline-flex items-center gap-1 font-inter text-[12px] text-steel transition-colors hover:text-graphite"
        >
          <ArrowLeftIcon className="h-3.5 w-3.5" />
          Browse Topics
        </Link>
      </div>
    );
  }

  return (
    <PracticeProvider
      sessionId={session.id}
      questions={session.questions}
      meta={{
        sheetName: session.sheet
          ? `${session.sheet.title} — ${session.sheet.companyName}`
          : `${session.subtopic.title} Practice`,
        topicName: session.subtopic.topic?.title || "",
        subtopicName: session.subtopic.title,
        difficulty: undefined,
        mode: session.mode,
      }}
      onAnswer={handleAnswer}
      onSubmit={handleSubmit}
      onError={handleError}
    >
      <PracticeSessionInner apiError={apiError} />
    </PracticeProvider>
  );
}

// ═══════════════════════════════════════════════════════════════════════
// Helper hook: useSearchParams (simple client-side parse)
// ═══════════════════════════════════════════════════════════════════════
function useSearchParams() {
  const [params, setParams] = useState({});

  useEffect(() => {
    if (typeof window === "undefined") return;
    const sp = new URLSearchParams(window.location.search);
    const obj = {};
    for (const [k, v] of sp.entries()) {
      obj[k] = v;
    }
    setParams(obj);
  }, []);

  return params;
}
