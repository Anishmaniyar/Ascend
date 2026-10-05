"use client";

import { createContext, useContext, useState, useCallback, useEffect, useRef } from "react";
import {
  saveSessionState,
  loadSessionState,
  clearSessionState,
} from "@/lib/mock/practiceSession";

const PracticeContext = createContext(null);

export function usePracticeSession() {
  const ctx = useContext(PracticeContext);
  if (!ctx) throw new Error("usePracticeSession must be used within PracticeProvider");
  return ctx;
}

// ═══════════════════════════════════════════════════════════════════════
// PracticeProvider
// ═══════════════════════════════════════════════════════════════════════

export function PracticeProvider({
  children,
  sessionId,
  questions,
  meta, // { sheetName, topicName, subtopicName, difficulty, mode }
  // Live hooks (optional — when omitted the provider is a pure local mock).
  // onAnswer(questionId, optionId): POST the attempt; 409 (already recorded)
  // is treated as success. onSubmit(): complete the session (must throw on
  // failure so local submitted state stays untouched). onError(err): surface.
  onAnswer,
  onSubmit,
  onError,
}) {
  const total = questions.length;

  // ── Try restoring persisted state ────────────────────────────────────
  const persisted = typeof window !== "undefined" ? loadSessionState(sessionId) : null;

  const [currentIndex, setCurrentIndex] = useState(persisted?.currentIndex ?? 0);
  const [answers, setAnswers] = useState(persisted?.answers ?? {});
  const [marks, setMarks] = useState(persisted?.marks ?? {}); // questionId → true
  // Locked = recorded server-side (backend allows one attempt per question).
  // Restored answers were posted when first selected, so they start locked.
  const [locked, setLocked] = useState(() => ({
    ...Object.fromEntries(
      Object.keys(persisted?.answers ?? {}).map((k) => [k, true]),
    ),
    ...(persisted?.locked ?? {}),
  }));
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(persisted?.elapsedSeconds ?? 0);
  const [mode, setMode] = useState(meta?.mode ?? "PRACTICE");

  // Timer ref
  const timerRef = useRef(null);

  // ── Persist on every meaningful change ────────────────────────────────
  useEffect(() => {
    if (isSubmitted) return;
    saveSessionState(sessionId, {
      currentIndex,
      answers,
      marks,
      locked,
      elapsedSeconds,
    });
  }, [currentIndex, answers, marks, locked, elapsedSeconds, sessionId, isSubmitted]);

  // ── Timer (runs in TEST mode) ────────────────────────────────────────
  useEffect(() => {
    if (mode !== "TEST" || isSubmitted) return;
    timerRef.current = setInterval(() => {
      setElapsedSeconds((s) => s + 1);
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [mode, isSubmitted]);

  // ── Actions ──────────────────────────────────────────────────────────
  const goTo = useCallback(
    (idx) => {
      if (idx >= 0 && idx < total) setCurrentIndex(idx);
    },
    [total],
  );

  const goNext = useCallback(() => goTo(currentIndex + 1), [currentIndex, goTo]);
  const goPrev = useCallback(() => goTo(currentIndex - 1), [currentIndex, goTo]);

  // Refs for stable callbacks (questions/hooks arrive from the page).
  const questionsRef = useRef(questions);
  questionsRef.current = questions;
  const onAnswerRef = useRef(onAnswer);
  onAnswerRef.current = onAnswer;
  const onSubmitRef = useRef(onSubmit);
  onSubmitRef.current = onSubmit;
  const onErrorRef = useRef(onError);
  onErrorRef.current = onError;
  const lockedRef = useRef(locked);
  lockedRef.current = locked;

  const lockQuestion = useCallback((questionId) => {
    setLocked((prev) =>
      prev[questionId] ? prev : { ...prev, [questionId]: true },
    );
  }, []);

  const selectOption = useCallback(
    (questionId, optionIndex) => {
      if (lockedRef.current[questionId]) return; // recorded — immutable
      setAnswers((prev) => ({ ...prev, [questionId]: optionIndex }));
      if (!onAnswerRef.current) return;
      const q = questionsRef.current.find((item) => item.id === questionId);
      const optionId = q?.options?.[optionIndex]?.id;
      if (!optionId) return;
      onAnswerRef.current(questionId, optionId).then(
        () => lockQuestion(questionId),
        (err) => {
          // Already recorded server-side (e.g. restored state) → lock.
          if (/already attempted/i.test(err?.message || "")) {
            lockQuestion(questionId);
          } else {
            onErrorRef.current?.(err);
          }
        },
      );
    },
    [lockQuestion],
  );

  const toggleMark = useCallback(
    (questionId) => {
      setMarks((prev) => {
        const next = { ...prev };
        if (next[questionId]) {
          delete next[questionId];
        } else {
          next[questionId] = true;
        }
        return next;
      });
    },
    [],
  );

  const clearAnswer = useCallback((questionId) => {
    if (lockedRef.current[questionId]) return; // recorded — immutable
    setAnswers((prev) => {
      const next = { ...prev };
      delete next[questionId];
      return next;
    });
  }, []);

  const submit = useCallback(async () => {
    // Live completion first: a failure leaves local state untouched so the
    // user can retry instead of losing the session.
    if (onSubmitRef.current) {
      try {
        await onSubmitRef.current();
      } catch (err) {
        onErrorRef.current?.(err);
        throw err;
      }
    }
    setIsSubmitted(true);
    clearInterval(timerRef.current);
    clearSessionState(sessionId);
  }, [sessionId]);

  const exit = useCallback(() => {
    clearSessionState(sessionId);
  }, [sessionId]);

  // ── Derived stats ────────────────────────────────────────────────────
  const answeredCount = Object.keys(answers).length;
  const markedCount = Object.keys(marks).length;
  const currentQuestion = questions[currentIndex];
  const currentAnswer = currentQuestion ? answers[currentQuestion.id] : undefined;
  const currentMarked = currentQuestion ? !!marks[currentQuestion.id] : false;
  const progress = total > 0 ? Math.round((answeredCount / total) * 100) : 0;

  const value = {
    sessionId,
    meta,
    questions,
    total,
    currentIndex,
    currentQuestion,
    currentAnswer,
    currentMarked,
    answers,
    marks,
    locked,
    isLocked: (questionId) => !!locked[questionId],
    answeredCount,
    markedCount,
    progress,
    isSubmitted,
    elapsedSeconds,
    mode,
    goTo,
    goNext,
    goPrev,
    selectOption,
    toggleMark,
    clearAnswer,
    submit,
    exit,
  };

  return (
    <PracticeContext.Provider value={value}>{children}</PracticeContext.Provider>
  );
}
