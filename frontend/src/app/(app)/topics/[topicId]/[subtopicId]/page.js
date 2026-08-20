"use client";

import { useState, useMemo, use } from "react";
import Link from "next/link";
import { ArrowLeftIcon, SearchIcon } from "@/components/ui/icons";
import RadialGauge from "@/components/charts/RadialGauge";
import SheetCard from "@/components/dashboard/SheetCard";
import SheetDetail from "@/components/dashboard/SheetDetail";
import { topics } from "@/lib/mock/landing";
import {
  practiceSheets,
  getSubtopicSheetStats,
} from "@/lib/mock/dashboard";
import { getSubtopicIcon } from "@/lib/subtopicIcons";

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
  const [selectedSheet, setSelectedSheet] = useState(null);

  const stats = useMemo(
    () => getSubtopicSheetStats(subtopicId),
    [subtopicId],
  );

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
  const hasAnySessions = (practiceSheets[subtopicId] ?? []).length > 0;

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
            {subtopic.questions} Questions
          </p>

          {/* Practice button */}
          <button
            type="button"
            onClick={() => {
              if (hasAnySessions) {
                const allSheets = practiceSheets[subtopicId] ?? [];
                const resumeSheet = allSheets.find(
                  (s) => s.solved > 0 && s.solved < s.questions.length,
                );
                const nextSheet = allSheets.find(
                  (s) => s.solved === 0,
                );
                const target = resumeSheet ?? nextSheet ?? allSheets[0];
                if (target) setSelectedSheet(target);
              }
            }}
            className="mt-5 w-full rounded-buttons bg-graphite px-5 py-2.5 font-polysans text-15 tracking-[-0.02em] text-inverse transition-opacity hover:opacity-85"
          >
            Practice
          </button>

          {/* Divider */}
          <div className="my-6 h-px bg-mist" />

          {/* Progress section */}
          <div className="flex flex-col items-center">
            <RadialGauge solved={stats.solved} total={stats.totalQuestions} size={140} strokeWidth={10} />
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
                {stats.solved}
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
              {sheets.map((sheet) => (
                <SheetCard
                  key={sheet.id}
                  sheet={sheet}
                  onClick={() => setSelectedSheet(sheet)}
                />
              ))}
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

      {/* Sheet detail modal */}
      {selectedSheet && (
        <SheetDetail
          sheet={selectedSheet}
          subtopicName={subtopic.name}
          onClose={() => setSelectedSheet(null)}
          onStart={() => {
            alert(
              `Starting "${subtopic.name} — Session ${selectedSheet.session}"!\nThis will launch a practice session.`,
            );
            setSelectedSheet(null);
          }}
        />
      )}
    </div>
  );
}
