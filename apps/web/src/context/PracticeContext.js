"use client";

import { createContext, useContext, useState, useCallback, useEffect, useRef } from "react";
import {
  saveSessionState,
  loadSessionState,
  clearSessionState,
  questionOptions,
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
}) {
  const total = questions.length;

  // ── Try restoring persisted state ────────────────────────────────────
  const persisted = typeof window !== "undefined" ? loadSessionState(sessionId) : null;

  const [currentIndex, setCurrentIndex] = useState(persisted?.currentIndex ?? 0);
  const [answers, setAnswers] = useState(persisted?.answers ?? {});
  const [marks, setMarks] = useState(persisted?.marks ?? {}); // questionId → true
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
      elapsedSeconds,
    });
  }, [currentIndex, answers, marks, elapsedSeconds, sessionId, isSubmitted]);

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

  const selectOption = useCallback(
    (questionId, optionIndex) => {
      setAnswers((prev) => ({ ...prev, [questionId]: optionIndex }));
    },
    [],
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
    setAnswers((prev) => {
      const next = { ...prev };
      delete next[questionId];
      return next;
    });
  }, []);

  const submit = useCallback(() => {
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
