"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeftIcon, CheckIcon, XIcon, ClockIcon } from "@/components/ui/icons";
import { getResults, getSession, startSession } from "@/lib/api/practice";
import Button from "@/components/ui/Button";

// ═══════════════════════════════════════════════════════════════════════
// DIFFICULTY COLORS
// ═══════════════════════════════════════════════════════════════════════
const DIFF_COLORS = {
  Easy: "bg-ash text-steel",
  Medium: "bg-ash text-steel",
  Hard: "bg-ash text-steel",
};

const DIFF_DOT_COLORS = {
  Easy: "bg-success",
  Medium: "bg-brass",
  Hard: "bg-ember",
};

const DIFF_LABEL = { EASY: "Easy", MEDIUM: "Medium", HARD: "Hard" };

function formatDuration(ms) {
  if (ms == null || ms < 0) return "—";
  const totalSec = Math.round(ms / 1000);
  const m = Math.floor(totalSec / 60);
  const s = totalSec % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

// ═══════════════════════════════════════════════════════════════════════
// Result Page Component
// ═══════════════════════════════════════════════════════════════════════
export default function PracticeSessionResultPage({ searchParams }) {
  const router = useRouter();
  const [showReview, setShowReview] = useState(false);
  const [filterReview, setFilterReview] = useState("all");
  const [results, setResults] = useState(null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [practicingAgain, setPracticingAgain] = useState(false);

  const [sessionId, setSessionId] = useState(null);
  useEffect(() => {
    if (typeof window === "undefined") return;
    setSessionId(new URLSearchParams(window.location.search).get("sessionId"));
  }, []);

  const load = useCallback(async () => {
    if (!sessionId) return;
    setLoading(true);
    setError("");
    try {
      const [res, sess] = await Promise.all([
        getResults(sessionId),
        getSession(sessionId),
      ]);
      setResults(res);
      setSession(sess);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [sessionId]);

  useEffect(() => {
    if (sessionId) load();
    else setLoading(false);
  }, [sessionId, load]);

  const handlePracticeAgain = async () => {
    if (!session || practicingAgain) return;
    setPracticingAgain(true);
    try {
      const created = await startSession(
        session.sheetId
          ? { sheetId: session.sheetId, mode: session.mode }
          : { subtopicId: session.subtopic.id, mode: session.mode },
      );
      router.push(`/practice/session?sessionId=${created.id}`);
    } catch {
      setPracticingAgain(false);
    }
  };

  const backHref = !session
    ? "/topics"
    : session.sheetId
      ? `/sheets/${session.sheetId}`
      : `/topics`;

  const filteredReview = useMemo(() => {
    const review = results?.review || [];
    if (filterReview === "correct") return review.filter((r) => r.isCorrect);
    if (filterReview === "incorrect")
      return review.filter((r) => !r.isCorrect);
    if (filterReview === "unanswered") return [];
    return review;
  }, [results, filterReview]);

  if (loading) {
    return (
      <div className="mx-auto w-full max-w-[var(--page-max-width)] px-6 py-10">
        <p className="text-13 text-slate">Loading results…</p>
      </div>
    );
  }

  if (!sessionId || error || !results) {
    return (
      <div className="mx-auto w-full max-w-[var(--page-max-width)] px-6 py-10">
        <p className="text-15 text-steel">
          {error ? `Couldn't load results: ${error}` : "No session results available."}
        </p>
        <div className="mt-4 flex items-center gap-4">
          <Link
            href="/topics"
            className="inline-flex items-center gap-1 font-inter text-[12px] text-steel transition-colors hover:text-graphite"
          >
            <ArrowLeftIcon className="h-3.5 w-3.5" />
            Browse Topics
          </Link>
          {error && sessionId && (
            <button
              type="button"
              onClick={load}
              className="font-polysans text-13 text-graphite underline underline-offset-2 hover:text-ember"
            >
              Try again
            </button>
          )}
        </div>
      </div>
    );
  }

  const unanswered =
    (session?.questions.length || results.totalQuestion) - results.totalQuestion;

  return (
    <div className="min-h-screen bg-canvas">
      {/* Top bar */}
      <header className="border-b border-mist bg-canvas/95 backdrop-blur">
        <div className="mx-auto flex h-14 max-w-[var(--page-max-width)] items-center px-6">
          <Link
            href={backHref}
            className="flex items-center gap-2 font-polysans text-15 tracking-[-0.02em] text-slate transition-colors hover:text-graphite"
          >
            <ArrowLeftIcon className="h-4 w-4" />
            Back
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
            {results.subtopic} — {results.topic}
          </p>
        </div>

        {/* Score card */}
        <div className="mt-8 rounded-2xl border border-mist bg-canvas p-6 sm:p-8">
          <div className="text-center">
            <p className="text-13 text-slate uppercase tracking-wider">Your Score</p>
            <p className="mt-2 font-polysans text-heading-lg tracking-[-0.02em] text-graphite">
              {results.score}
              <span className="text-heading text-slate">/{results.totalQuestion}</span>
            </p>
          </div>

          {/* Stats grid */}
          <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="rounded-xl bg-success/5 px-4 py-4 text-center border border-success/10">
              <p className="font-polysans text-heading tracking-[-0.02em] text-success">
                {results.correctAnswers}
              </p>
              <p className="mt-1 text-13 text-slate">Correct</p>
            </div>
            <div className="rounded-xl bg-danger/5 px-4 py-4 text-center border border-danger/10">
              <p className="font-polysans text-heading tracking-[-0.02em] text-danger">
                {results.wrongAnswers}
              </p>
              <p className="mt-1 text-13 text-slate">Incorrect</p>
            </div>
            <div className="rounded-xl bg-fog px-4 py-4 text-center border border-mist">
              <p className="font-polysans text-heading tracking-[-0.02em] text-slate">
                {unanswered}
              </p>
              <p className="mt-1 text-13 text-slate">Unanswered</p>
            </div>
            <div className="rounded-xl bg-ash px-4 py-4 text-center border border-mist">
              <p className="font-polysans text-heading tracking-[-0.02em] text-graphite">
                {results.accuracy}%
              </p>
              <p className="mt-1 text-13 text-slate">Accuracy</p>
            </div>
          </div>

          {/* Time taken */}
          <div className="mt-6 flex items-center justify-center gap-2 text-15 text-steel">
            <ClockIcon className="h-4 w-4" />
            Time taken: <span className="font-polysans text-graphite">{formatDuration(results.timeTaken)}</span>
          </div>
        </div>

        {/* Action buttons */}
        <div className="mt-6 flex flex-col sm:flex-row gap-3">
          <Button variant="primary" className="flex-1" onClick={handlePracticeAgain}>
            {practicingAgain ? "Starting…" : "Practice Again"}
          </Button>
          <Button render={<Link href={backHref} />} variant="secondary" className="flex-1">
            Back
          </Button>
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
              className="font-inter text-[12px] text-steel transition-colors hover:text-graphite"
            >
              {showReview ? "Hide Review" : "Show Review"}
            </button>
          </div>

          {showReview && (
            <>
              {/* Filter pills */}
              <div className="mt-4 flex items-center gap-2">
                {[
                  { value: "all", label: "All", count: results.review.length },
                  { value: "correct", label: "Correct", count: results.correctAnswers },
                  { value: "incorrect", label: "Incorrect", count: results.wrongAnswers },
                  { value: "unanswered", label: "Unanswered", count: unanswered },
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
                {filteredReview.length === 0 ? (
                  <p className="text-13 text-slate">
                    {filterReview === "unanswered"
                      ? "Unanswered questions aren't listed — every question below was attempted."
                      : "Nothing in this filter."}
                  </p>
                ) : (
                  filteredReview.map((q) => (
                    <div
                      key={q.questionId}
                      className={`rounded-2xl border bg-canvas p-5 ${
                        q.isCorrect ? "border-success/20" : "border-danger/20"
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        {/* Status icon */}
                        <span
                          className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full ${
                            q.isCorrect
                              ? "bg-success/10 text-success"
                              : "bg-danger/10 text-danger"
                          }`}
                        >
                          {q.isCorrect ? (
                            <CheckIcon className="h-3.5 w-3.5" />
                          ) : (
                            <XIcon className="h-3.5 w-3.5" />
                          )}
                        </span>

                        <div className="min-w-0 flex-1">
                          {/* Question text */}
                          <p className="text-15 leading-[1.5] text-graphite">
                            {q.title}
                          </p>

                          {/* Options (show correct/selected) */}
                          <div className="mt-3 space-y-2">
                            {q.options.map((option, oi) => {
                              const isThisCorrect = option.id === q.correctOptionId;
                              const isThisSelected = option.id === q.selectedOptionId;
                              return (
                                <div
                                  key={option.id}
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
                                  <span className="flex-1">{option.text}</span>
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

                          {/* Solution */}
                          {q.solution && (
                            <div className="mt-3 rounded-lg bg-fog px-3 py-2">
                              <p className="text-13 text-steel leading-[1.5]">
                                <span className="font-polysans text-graphite">Solution:</span>{" "}
                                {q.solution}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
