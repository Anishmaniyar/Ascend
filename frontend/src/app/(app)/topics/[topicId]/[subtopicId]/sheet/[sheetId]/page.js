"use client";

import { use } from "react";
import Link from "next/link";
import { ArrowLeftIcon, ClockIcon, ZapIcon } from "@/components/ui/icons";
import { getSubtopicIcon } from "@/lib/subtopicIcons";
import { topics } from "@/lib/mock/landing";
import { practiceSheets } from "@/lib/mock/dashboard";
import Button from "@/components/ui/Button";

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

export default function SheetDetailPage({ params }) {
  const { topicId, subtopicId, sheetId } = use(params);
  const topic = topics.find((t) => t.id === topicId);
  const subtopic = topic?.subtopics.find((s) => s.id === subtopicId);
  const allSheets = practiceSheets[subtopicId] ?? [];
  const sheet = allSheets.find((s) => s.id === sheetId);

  if (!topic || !subtopic || !sheet) {
    return (
      <div className="mx-auto w-full max-w-[var(--page-max-width)] px-6 py-10">
        <p className="text-15 text-steel">Sheet not found.</p>
        <Link
          href={`/topics/${topicId}/${subtopicId}`}
          className="mt-4 inline-flex items-center gap-1 font-polysans text-13 tracking-[-0.02em] text-ember hover:underline"
        >
          <ArrowLeftIcon className="h-3.5 w-3.5" />
          Back to {subtopic?.name ?? "Subtopic"}
        </Link>
      </div>
    );
  }

  const SubtopicIcon = getSubtopicIcon(subtopicId);
  const total = sheet.questions.length;
  const hasStarted = sheet.solved > 0;
  const isCompleted = sheet.solved === total && total > 0;
  const progressPct = total > 0 ? Math.round((sheet.solved / total) * 100) : 0;
  const remaining = total - sheet.solved;

  // Determine action button state
  let actionLabel = "Start Practice";
  if (isCompleted) {
    actionLabel = "Practice Again";
  } else if (hasStarted) {
    actionLabel = "Resume Practice";
  }

  // Build the practice session URL
  const practiceUrl = `/practice/session?topicId=${topicId}&subtopicId=${subtopicId}&sheetId=${sheetId}&mode=PRACTICE`;

  return (
    <div className="mx-auto w-full max-w-[var(--page-max-width)] px-6 py-10">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 font-polysans text-13 tracking-[-0.02em] text-slate">
        <Link href="/topics" className="transition-colors hover:text-ember">
          Topics
        </Link>
        <span>/</span>
        <Link href={`/topics/${topicId}`} className="transition-colors hover:text-ember">
          {topic.title}
        </Link>
        <span>/</span>
        <Link href={`/topics/${topicId}/${subtopicId}`} className="transition-colors hover:text-ember">
          {subtopic.name}
        </Link>
        <span>/</span>
        <span className="text-graphite">Session {sheet.session}</span>
      </nav>

      {/* Main layout */}
      <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-[1fr_340px] lg:items-start">

        {/* LEFT — Sheet content */}
        <div>
          {/* Sheet header */}
          <div className="flex items-start gap-4">
            {SubtopicIcon && (
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-ash text-graphite">
                <SubtopicIcon className="h-6 w-6" />
              </span>
            )}
            <div className="min-w-0">
              <h1 className="font-polysans text-heading-lg tracking-[-0.02em] text-graphite">
                {subtopic.name} — Session {sheet.session}
              </h1>
              <div className="mt-2 flex flex-wrap items-center gap-3">
                <span
                  className={`inline-flex items-center gap-1.5 rounded-tags px-2.5 py-0.5 font-polysans text-13 tracking-[-0.02em] ${DIFF_COLORS[sheet.difficulty]}`}
                >
                  <span className={`h-1.5 w-1.5 rounded-full ${DIFF_DOT_COLORS[sheet.difficulty]}`} />
                  {sheet.difficulty}
                </span>
                <span className="text-13 text-slate">{total} Questions</span>
                <span className="inline-flex items-center gap-1.5 text-13 text-slate">
                  <ClockIcon className="h-3.5 w-3.5" />
                  ~{sheet.estimatedMinutes} min
                </span>
              </div>
            </div>
          </div>

          {/* Description */}
          {sheet.description && (
            <p className="mt-4 max-w-[60ch] text-15 leading-[1.6] text-steel">
              {sheet.description}
            </p>
          )}

          {/* Progress bar when started */}
          {hasStarted && (
            <div className="mt-6 rounded-2xl border border-mist bg-canvas p-5">
              <div className="flex items-center justify-between text-13">
                <span className="text-slate">Progress</span>
                <span className="font-polysans text-graphite">{sheet.solved} / {total}</span>
              </div>
              <div className="mt-2 h-2 w-full rounded-full bg-fog">
                <div
                  className={`h-full rounded-full transition-all ${isCompleted ? "bg-success" : "bg-ember"}`}
                  style={{ width: `${progressPct}%` }}
                />
              </div>
            </div>
          )}

          {/* Question list */}
          <div className="mt-8">
            <h2 className="font-polysans text-subheading tracking-[-0.02em] text-graphite">
              Questions
            </h2>

            <div className="mt-4 divide-y divide-mist rounded-2xl border border-mist bg-canvas">
              {sheet.questions.map((q, i) => {
                // Mock: questions up to `solved` count are marked as solved
                const attempted = i < sheet.solved;
                return (
                  <div key={q.id} className="flex items-start gap-4 px-5 py-4">
                    <span className="mt-0.5 font-polysans text-13 text-slate">
                      {i + 1}.
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="text-15 leading-[1.5] text-graphite">
                        {q.title}
                      </p>
                      <div className="mt-1.5 flex items-center gap-2">
                        <span className="inline-block rounded-tags bg-fog px-2 py-0.5 text-13 text-slate">
                          {q.difficulty}
                        </span>
                        <span className={`text-13 ${attempted ? "text-success" : "text-slate"}`}>
                          {attempted ? "Solved" : "Not attempted"}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* RIGHT — Sidebar */}
        <div className="lg:sticky lg:top-20">
          <div className="rounded-2xl border border-mist bg-canvas p-6">
            {/* Sheet info summary */}
            <h3 className="font-polysans text-subheading tracking-[-0.02em] text-graphite">
              Sheet Info
            </h3>

            <div className="mt-4 space-y-3">
              <div className="flex items-center justify-between text-15">
                <span className="text-slate">Difficulty</span>
                <span
                  className={`inline-flex items-center gap-1.5 rounded-tags px-2.5 py-0.5 font-polysans text-13 tracking-[-0.02em] ${DIFF_COLORS[sheet.difficulty]}`}
                >
                  <span className={`h-1.5 w-1.5 rounded-full ${DIFF_DOT_COLORS[sheet.difficulty]}`} />
                  {sheet.difficulty}
                </span>
              </div>
              <div className="flex items-center justify-between text-15">
                <span className="text-slate">Questions</span>
                <span className="font-polysans text-graphite">{total}</span>
              </div>
              <div className="flex items-center justify-between text-15">
                <span className="text-slate">Est. Time</span>
                <span className="font-polysans text-graphite">~{sheet.estimatedMinutes} min</span>
              </div>
            </div>

            {/* Divider */}
            <div className="my-5 h-px bg-mist" />

            {/* User progress */}
            <h3 className="font-polysans text-subheading tracking-[-0.02em] text-graphite">
              Your Progress
            </h3>

            {hasStarted ? (
              <div className="mt-4 space-y-3">
                <div className="flex items-center justify-between text-15">
                  <span className="text-slate">Completed</span>
                  <span className="font-polysans text-graphite">{sheet.solved} / {total}</span>
                </div>
                <div className="flex items-center justify-between text-15">
                  <span className="text-slate">Remaining</span>
                  <span className="font-polysans text-graphite">{remaining}</span>
                </div>
                <div className="flex items-center justify-between text-15">
                  <span className="text-slate">Accuracy</span>
                  <span className="font-polysans text-graphite">{sheet.accuracy}%</span>
                </div>
                <div className="flex items-center justify-between text-15">
                  <span className="text-slate">Attempts</span>
                  <span className="font-polysans text-graphite">{sheet.attempts}</span>
                </div>
                {sheet.lastPracticed && (
                  <div className="flex items-center justify-between text-15">
                    <span className="text-slate">Last practiced</span>
                    <span className="font-polysans text-graphite">{sheet.lastPracticed}</span>
                  </div>
                )}
              </div>
            ) : (
              <p className="mt-4 text-15 text-slate">Not attempted yet</p>
            )}

            {/* Divider */}
            <div className="my-5 h-px bg-mist" />

            {/* Action button — now links to practice session */}
            <Button render={<Link href={practiceUrl} />} variant="primary" className="w-full">
              {hasStarted && !isCompleted && <ZapIcon className="h-4 w-4" />}
              {actionLabel}
            </Button>

            {/* Status hint */}
            {hasStarted && !isCompleted && (
              <p className="mt-3 text-center text-13 text-slate">
                {sheet.solved} / {total} completed
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
