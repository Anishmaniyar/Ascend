"use client";

import { useState, useMemo, use } from "react";
import Link from "next/link";
import { ArrowLeftIcon, SearchIcon, ArrowRightIcon } from "@/components/ui/icons";
import { getSubtopicIcon } from "@/lib/subtopicIcons";
import { topics } from "@/lib/mock/landing";
import {
  practiceSheets,
  getSubtopicSheetStats,
  subtopicProgress,
} from "@/lib/mock/dashboard";

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

const FILTER_OPTIONS = [
  { value: "all", label: "All" },
  { value: "Easy", label: "Easy" },
  { value: "Medium", label: "Medium" },
  { value: "Hard", label: "Hard" },
];

export default function SubtopicPracticePage({ params }) {
  const { topicId, subtopicId } = use(params);
  const topic = topics.find((t) => t.id === topicId);
  const subtopic = topic?.subtopics.find((s) => s.id === subtopicId);

  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");

  const stats = useMemo(
    () => getSubtopicSheetStats(subtopicId),
    [subtopicId],
  );

  const progress = subtopicProgress[subtopicId] ?? { solved: 0, total: subtopic?.questions ?? 0 };

  const sheets = useMemo(() => {
    const all = practiceSheets[subtopicId] ?? [];
    let filtered = all;
    if (filter !== "all") {
      filtered = filtered.filter((s) => s.difficulty === filter);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      filtered = filtered.filter((s) =>
        `session ${s.session}`.toLowerCase().includes(q) ||
        s.difficulty.toLowerCase().includes(q)
      );
    }
    return filtered;
  }, [subtopicId, filter, search]);

  if (!topic || !subtopic) {
    return (
      <div className="mx-auto w-full max-w-[var(--page-max-width)] px-6 py-10">
        <p className="text-15 text-steel">Subtopic not found.</p>
        <Link
          href="/topics"
          className="mt-4 inline-flex items-center gap-1 font-polysans text-13 tracking-[-0.02em] text-ember hover:underline"
        >
          <ArrowLeftIcon className="h-3.5 w-3.5" />
          Back to Topics
        </Link>
      </div>
    );
  }

  const SubtopicIcon = getSubtopicIcon(subtopicId);
  const pct = progress.total > 0 ? Math.round((progress.solved / progress.total) * 100) : 0;

  return (
    <div className="mx-auto w-full max-w-[var(--page-max-width)] px-6 py-10">
      {/* Breadcrumb */}
      <Link
        href={`/topics/${topicId}`}
        className="inline-flex items-center gap-1 font-polysans text-13 tracking-[-0.02em] text-slate transition-colors hover:text-ember"
      >
        <ArrowLeftIcon className="h-3.5 w-3.5" />
        {topic.title}
      </Link>

      {/* Two-column layout */}
      <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-[340px_1fr] lg:items-start">

        {/* LEFT — Subtopic Info Card */}
        <div className="rounded-2xl border border-mist bg-canvas p-6 lg:sticky lg:top-20">
          {/* Header: Icon + Name + Topic */}
          <div className="flex items-start gap-4">
            {SubtopicIcon && (
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-ash text-graphite">
                <SubtopicIcon className="h-6 w-6" />
              </span>
            )}
            <div className="min-w-0">
              <h1 className="font-polysans text-subheading tracking-[-0.02em] text-graphite">
                {subtopic.name}
              </h1>
              <p className="mt-0.5 text-13 text-slate">{topic.title}</p>
            </div>
          </div>

          {/* Question count */}
          <p className="mt-4 text-15 text-steel">
            {progress.total} Questions
          </p>

          {/* Divider */}
          <div className="my-6 h-px bg-mist" />

          {/* Progress gauge */}
          <div className="flex flex-col items-center">
            <div className="relative inline-flex items-center justify-center" style={{ width: 140, height: 140 }}>
              <svg width={140} height={140} className="-rotate-90">
                <circle cx={70} cy={70} r={60} fill="none" stroke="var(--color-mist)" strokeWidth={10} strokeLinecap="round" />
                <circle
                  cx={70}
                  cy={70}
                  r={60}
                  fill="none"
                  stroke="var(--color-ember)"
                  strokeWidth={10}
                  strokeLinecap="round"
                  strokeDasharray={2 * Math.PI * 60}
                  strokeDashoffset={2 * Math.PI * 60 - (pct / 100) * 2 * Math.PI * 60}
                  style={{ transition: "stroke-dashoffset 0.6s ease" }}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="font-polysans text-heading tracking-[-0.02em] text-graphite">
                  {progress.solved}/{progress.total}
                </span>
                <span className="text-13 text-slate">Solved</span>
              </div>
            </div>
          </div>

          {/* Stats grid */}
          <div className="mt-6 grid grid-cols-3 gap-3">
            <div className="rounded-xl bg-fog px-3 py-3 text-center">
              <p className="font-polysans text-subheading tracking-[-0.02em] text-graphite">
                {stats.completedSessions}
              </p>
              <p className="mt-0.5 text-13 text-slate">Sessions</p>
            </div>
            <div className="rounded-xl bg-fog px-3 py-3 text-center">
              <p className="font-polysans text-subheading tracking-[-0.02em] text-graphite">
                {progress.solved}
              </p>
              <p className="mt-0.5 text-13 text-slate">Solved</p>
            </div>
            <div className="rounded-xl bg-fog px-3 py-3 text-center">
              <p className="font-polysans text-subheading tracking-[-0.02em] text-graphite">
                {stats.accuracy}%
              </p>
              <p className="mt-0.5 text-13 text-slate">Accuracy</p>
            </div>
          </div>
        </div>

        {/* RIGHT — Practice Sheets */}
        <div className="min-w-0">
          {/* Section header + filter + search */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="font-polysans text-subheading tracking-[-0.02em] text-graphite">
              Practice Sheets
            </h2>

            <div className="flex items-center gap-3">
              {/* Difficulty filter pills */}
              <div className="flex items-center gap-1 rounded-full bg-fog p-1">
                {FILTER_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setFilter(opt.value)}
                    className={`rounded-full px-3 py-1 font-polysans text-13 tracking-[-0.02em] transition-colors ${
                      filter === opt.value
                        ? "bg-canvas text-graphite shadow-sm"
                        : "text-slate hover:text-graphite"
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>

              {/* Search */}
              <div className="relative">
                <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate" />
                <input
                  type="text"
                  placeholder="Search sheets"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="h-9 w-40 rounded-lg border border-mist bg-canvas pl-9 pr-3 text-13 text-graphite placeholder:text-slate focus:border-graphite focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Sheet count */}
          {sheets.length > 0 && (
            <p className="mt-4 text-13 text-slate">
              {sheets.length} sheet{sheets.length !== 1 ? "s" : ""}
            </p>
          )}

          {/* Sheet list */}
          {sheets.length > 0 ? (
            <div className="mt-4 space-y-3">
              {sheets.map((sheet) => {
                const total = sheet.questions.length;
                const completed = sheet.solved === total && total > 0;
                const inProgress = sheet.solved > 0 && !completed;

                return (
                  <Link
                    key={sheet.id}
                    href={`/topics/${topicId}/${subtopicId}/sheet/${sheet.id}`}
                    className="group flex w-full items-center justify-between rounded-2xl border border-mist bg-canvas p-5 text-left transition-all hover:border-graphite hover:shadow-sm"
                  >
                    <div className="min-w-0 flex-1">
                      {/* Session number + difficulty badge */}
                      <div className="flex items-center gap-3">
                        <p className="font-polysans text-15 tracking-[-0.02em] text-graphite">
                          Session {sheet.session}
                        </p>
                        <span
                          className={`inline-flex items-center gap-1.5 rounded-tags px-2.5 py-0.5 font-polysans text-13 tracking-[-0.02em] ${DIFF_COLORS[sheet.difficulty]}`}
                        >
                          <span className={`h-1.5 w-1.5 rounded-full ${DIFF_DOT_COLORS[sheet.difficulty]}`} />
                          {sheet.difficulty}
                        </span>
                      </div>

                      {/* Question count */}
                      <p className="mt-1.5 text-13 text-slate">
                        {total} Questions
                      </p>

                      {/* Completion status */}
                      <div className="mt-2">
                        {completed ? (
                          <span className="inline-flex items-center gap-1.5 text-13 font-polysans text-success">
                            <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M20 6 9 17l-5-5" />
                            </svg>
                            {sheet.solved} / {total} Completed
                          </span>
                        ) : inProgress ? (
                          <span className="text-13 font-polysans text-graphite">
                            {sheet.solved} / {total} Completed
                          </span>
                        ) : (
                          <span className="text-13 text-slate">Not Started</span>
                        )}
                      </div>
                    </div>

                    {/* Arrow */}
                    <ArrowRightIcon className="ml-4 h-4 w-4 shrink-0 text-slate transition-colors group-hover:text-ember" />
                  </Link>
                );
              })}
            </div>
          ) : (
            <div className="mt-16 rounded-2xl border border-dashed border-mist px-6 py-16 text-center">
              <p className="text-15 text-steel">
                {filter === "all" && !search
                  ? "No practice sheets available yet."
                  : "No sheets match your filters."}
              </p>
              {(filter !== "all" || search) && (
                <button
                  type="button"
                  onClick={() => { setFilter("all"); setSearch(""); }}
                  className="mt-3 font-polysans text-13 text-ember hover:underline"
                >
                  Clear filters
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
