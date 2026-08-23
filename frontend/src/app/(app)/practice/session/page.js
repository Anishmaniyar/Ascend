"use client";

import { useState, useEffect } from "react";
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
import {
  questionOptions,
  formatTime,
  calculateResult,
} from "@/lib/mock/practiceSession";
import { practiceSheets } from "@/lib/mock/dashboard";
import { topics } from "@/lib/mock/landing";

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
                  className={`hidden sm:inline-flex items-center gap-1.5 rounded-tags px-2 py-0.5 font-polysans text-13 tracking-[-0.02em] ${DIFF_COLORS[meta?.difficulty] ?? ""}`}
                >
                  <span
                    className={`h-1.5 w-1.5 rounded-full ${DIFF_DOT_COLORS[meta?.difficulty] ?? ""}`}
                  />
                  {meta?.difficulty}
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
              <div className="flex items-center gap-1.5 rounded-full bg-fog px-3 py-1.5">
                <ClockIcon className="h-3.5 w-3.5 text-ember" />
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
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-graphite/40 backdrop-blur-sm">
          <div className="mx-4 w-full max-w-sm rounded-2xl border border-mist bg-canvas p-6 shadow-xl">
            <h2 className="font-polysans text-subheading tracking-[-0.02em] text-graphite">
              Exit Practice Session?
            </h2>
            <p className="mt-2 text-15 text-steel leading-[1.6]">
              Your progress has been saved. You can resume this session later from the sheet page.
            </p>
            <div className="mt-6 flex gap-3">
              <button
                type="button"
                onClick={() => setShowExitConfirm(false)}
                className="flex-1 rounded-buttons border border-mist px-4 py-2.5 font-polysans text-15 tracking-[-0.02em] text-graphite transition-colors hover:bg-fog"
              >
                Continue Session
              </button>
              <Link
                href={`/topics`}
                onClick={() => onExit()}
                className="flex-1 rounded-buttons bg-graphite px-4 py-2.5 text-center font-polysans text-15 tracking-[-0.02em] text-inverse transition-opacity hover:opacity-85"
              >
                Exit
              </Link>
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

  const opts = questionOptions[currentQuestion.id];
  const optionLabels = ["A", "B", "C", "D"];
  const isLast = currentIndex === total - 1;
  const hasAnswer = currentAnswer !== undefined && currentAnswer !== null;

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
              {currentQuestion.difficulty}
            </span>
          </div>
          <button
            type="button"
            onClick={() => toggleMark(currentQuestion.id)}
            className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-13 font-polysans transition-colors ${
              currentMarked
                ? "bg-ember/10 text-ember"
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
        {opts && (
          <div className="mt-6 space-y-3">
            {opts.options.map((option, i) => {
              const isSelected = currentAnswer === i;
              return (
                <button
                  key={i}
                  type="button"
                  onClick={() => selectOption(currentQuestion.id, i)}
                  className={`group flex w-full items-center gap-4 rounded-xl border px-5 py-3.5 text-left transition-all ${
                    isSelected
                      ? "border-ember bg-ember/5 shadow-sm"
                      : "border-mist hover:border-graphite hover:shadow-sm"
                  }`}
                >
                  {/* Option label */}
                  <span
                    className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full font-polysans text-13 ${
                      isSelected
                        ? "bg-ember text-inverse"
                        : "bg-fog text-slate group-hover:bg-graphite group-hover:text-inverse"
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
                    {option}
                  </span>
                  {/* Selected check */}
                  {isSelected && (
                    <CheckIcon className="ml-auto h-4 w-4 shrink-0 text-ember" />
                  )}
                </button>
              );
            })}
          </div>
        )}

        {/* Clear answer */}
        {hasAnswer && (
          <button
            type="button"
            onClick={() => clearAnswer(currentQuestion.id)}
            className="mt-4 font-polysans text-13 text-slate hover:text-graphite"
          >
            Clear selection
          </button>
        )}
      </div>

      {/* Bottom navigation */}
      <div className="mt-4 flex items-center justify-between">
        <button
          type="button"
          onClick={goPrev}
          disabled={currentIndex === 0}
          className="flex items-center gap-2 rounded-buttons border border-mist px-4 py-2.5 font-polysans text-15 tracking-[-0.02em] text-graphite transition-colors hover:bg-fog disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <ArrowLeftIcon className="h-4 w-4" />
          Previous
        </button>

        {isLast ? (
          <button
            type="button"
            onClick={submit}
            className="flex items-center gap-2 rounded-buttons bg-graphite px-6 py-2.5 font-polysans text-15 tracking-[-0.02em] text-inverse transition-opacity hover:opacity-85"
          >
            Submit Session
            <CheckIcon className="h-4 w-4" />
          </button>
        ) : (
          <button
            type="button"
            onClick={goNext}
            className="flex items-center gap-2 rounded-buttons bg-graphite px-5 py-2.5 font-polysans text-15 tracking-[-0.02em] text-inverse transition-opacity hover:opacity-85"
          >
            Next
            <ArrowRightIcon className="h-4 w-4" />
          </button>
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
      <div className="rounded-2xl border border-mist bg-canvas p-5">
        <h3 className="font-polysans text-subheading tracking-[-0.02em] text-graphite">
          Session Progress
        </h3>

        {/* Progress bar */}
        <div className="mt-3">
          <div className="flex items-center justify-between text-13">
            <span className="text-slate">Progress</span>
            <span className="font-polysans text-graphite">{progress}%</span>
          </div>
          <div className="mt-2 h-2 w-full rounded-full bg-fog">
            <div
              className="h-full rounded-full bg-ember transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Stats */}
        <div className="mt-4 grid grid-cols-3 gap-2">
          <div className="rounded-xl bg-fog px-2 py-2.5 text-center">
            <p className="font-polysans text-subheading tracking-[-0.02em] text-success">
              {answeredCount}
            </p>
            <p className="text-13 text-slate">Answered</p>
          </div>
          <div className="rounded-xl bg-fog px-2 py-2.5 text-center">
            <p className="font-polysans text-subheading tracking-[-0.02em] text-ember">
              {unanswered}
            </p>
            <p className="text-13 text-slate">Remaining</p>
          </div>
          <div className="rounded-xl bg-fog px-2 py-2.5 text-center">
            <p className="font-polysans text-subheading tracking-[-0.02em] text-brass">
              {markedCount}
            </p>
            <p className="text-13 text-slate">Marked</p>
          </div>
        </div>
      </div>

      {/* Question grid */}
      <div className="mt-4 rounded-2xl border border-mist bg-canvas p-5">
        <h3 className="font-polysans text-subheading tracking-[-0.02em] text-graphite">
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
                className={`relative flex h-9 w-full items-center justify-center rounded-lg font-polysans text-13 transition-all ${
                  isCurrent
                    ? "bg-graphite text-inverse shadow-sm"
                    : isAnswered
                    ? "bg-success/10 text-success hover:bg-success/20"
                    : "bg-fog text-slate hover:bg-mist"
                }`}
                aria-label={`Question ${i + 1}${isAnswered ? " (answered)" : ""}${isMarked ? " (marked)" : ""}`}
              >
                {i + 1}
                {isMarked && (
                  <span className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-ember" />
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
            <span className="h-3 w-3 rounded bg-success/10" />
            Answered
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-3 w-3 rounded bg-fog" />
            Unanswered
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-ember" />
            Marked
          </span>
        </div>
      </div>

      {/* Submit button */}
      <div className="mt-4">
        <button
          type="button"
          onClick={() => setShowConfirmSubmit(true)}
          className="flex w-full items-center justify-center gap-2 rounded-buttons bg-graphite px-5 py-3 font-polysans text-15 tracking-[-0.02em] text-inverse transition-opacity hover:opacity-85"
        >
          Submit Session
          <CheckIcon className="h-4 w-4" />
        </button>
        <p className="mt-2 text-center text-13 text-slate">
          {remaining} question{remaining !== 1 ? "s" : ""} remaining
        </p>
      </div>

      {/* Confirm submit modal */}
      {showConfirmSubmit && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-graphite/40 backdrop-blur-sm">
          <div className="mx-4 w-full max-w-sm rounded-2xl border border-mist bg-canvas p-6 shadow-xl">
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
              <button
                type="button"
                onClick={() => setShowConfirmSubmit(false)}
                className="flex-1 rounded-buttons border border-mist px-4 py-2.5 font-polysans text-15 tracking-[-0.02em] text-graphite transition-colors hover:bg-fog"
              >
                Go Back
              </button>
              <button
                type="button"
                onClick={() => {
                  submit();
                  setShowConfirmSubmit(false);
                }}
                className="flex-1 rounded-buttons bg-graphite px-4 py-2.5 font-polysans text-15 tracking-[-0.02em] text-inverse transition-opacity hover:opacity-85"
              >
                Confirm Submit
              </button>
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
function PracticeSessionInner() {
  const router = useRouter();
  const { exit, isSubmitted } = usePracticeSession();
  const [showExitConfirm, setShowExitConfirm] = useState(false);

  // If session was submitted, redirect to results
  useEffect(() => {
    if (isSubmitted) {
      router.push(`/practice/session/result`);
    }
  }, [isSubmitted, router]);

  return (
    <div className="min-h-screen bg-canvas">
      <SessionHeader
        onExit={exit}
        showExitConfirm={showExitConfirm}
        setShowExitConfirm={setShowExitConfirm}
      />

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
// Exported page — sets up session from URL params
// ═══════════════════════════════════════════════════════════════════════
export default function PracticeSessionPage({ params, searchParams }) {
  // Parse sheet info from query string
  // URL: /practice/session?topicId=quant&subtopicId=quant-1&sheetId=q1-s1&mode=PRACTICE
  const { topicId, subtopicId, sheetId, mode } = useSearchParams();

  const topic = topics.find((t) => t.id === topicId);
  const subtopic = topic?.subtopics.find((s) => s.id === subtopicId);
  const allSheets = practiceSheets[subtopicId] ?? [];
  const sheet = allSheets.find((s) => s.id === sheetId);

  // Fallback: if no search params, show a "start session" page
  if (!sheet || !topic || !subtopic) {
    return (
      <div className="mx-auto w-full max-w-[var(--page-max-width)] px-6 py-10">
        <p className="text-15 text-steel">No active session.</p>
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

  const sessionId = `${sheetId}-${Date.now()}`;

  return (
    <PracticeProvider
      sessionId={sessionId}
      questions={sheet.questions}
      meta={{
        sheetName: `${subtopic.name} — Session ${sheet.session}`,
        topicName: topic.title,
        subtopicName: subtopic.name,
        difficulty: sheet.difficulty,
        mode: mode ?? "PRACTICE",
      }}
    >
      <PracticeSessionInner />
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
