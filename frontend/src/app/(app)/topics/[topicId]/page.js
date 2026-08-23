"use client";

import { useState, useMemo, use } from "react";
import Link from "next/link";
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  SearchIcon,
  SparklesIcon,
} from "@/components/ui/icons";
import { getSubtopicIcon, getTopicIcon } from "@/lib/subtopicIcons";
import { topics } from "@/lib/mock/landing";
import {
  subtopicProgress,
  practiceSheets,
  getSubtopicSheetStats,
} from "@/lib/mock/dashboard";

// ── Top-level topic filters (same as main topics page) ──────────────────
const TOPIC_FILTERS = [
  { id: "all", label: "All Topics" },
  { id: "quant", label: "Quantitative" },
  { id: "logical", label: "Logical" },
  { id: "verbal", label: "Verbal" },
  { id: "di", label: "Data Interpretation" },
  { id: "ga", label: "General Awareness" },
  { id: "english", label: "English Language" },
];

const SORT_OPTIONS = [
  { value: "az", label: "A – Z" },
  { value: "za", label: "Z – A" },
  { value: "most", label: "Most Questions" },
  { value: "least", label: "Least Questions" },
];

export default function SubtopicsPage({ params }) {
  const { topicId } = use(params);
  const topic = topics.find((t) => t.id === topicId);

  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("az");
  const [subtopicFilter, setSubtopicFilter] = useState("all");

  // Topic navigation filter (shows which main topic is active)
  const activeTopicFilter = topicId;

  const filtered = useMemo(() => {
    if (!topic) return [];

    let list = topic.subtopics.filter((s) =>
      s.name.toLowerCase().includes(search.toLowerCase()),
    );

    // Subtopic pill filter (skip if showing all expanded)
    if (subtopicFilter !== "all" && subtopicFilter !== "__all-expanded") {
      list = list.filter((s) => s.id === subtopicFilter);
    }

    switch (sort) {
      case "za":
        list = [...list].sort((a, b) => b.name.localeCompare(a.name));
        break;
      case "most":
        list = [...list].sort((a, b) => b.questions - a.questions);
        break;
      case "least":
        list = [...list].sort((a, b) => a.questions - b.questions);
        break;
      default:
        list = [...list].sort((a, b) => a.name.localeCompare(b.name));
    }

    return list;
  }, [topic, search, sort, subtopicFilter]);

  if (!topic) {
    return (
      <div className="mx-auto w-full max-w-[var(--page-max-width)] px-6 py-10">
        <p className="text-15 text-steel">Topic not found.</p>
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

  return (
    <div className="mx-auto w-full max-w-[var(--page-max-width)] px-6 py-10">
      {/* ── Breadcrumb ─────────────────────────────────────────────────── */}
      <Link
        href="/topics"
        className="inline-flex items-center gap-1 font-polysans text-13 tracking-[-0.02em] text-slate transition-colors hover:text-ember"
      >
        <ArrowLeftIcon className="h-3.5 w-3.5" />
        All Topics
      </Link>

      {/* ── 1. Page Header ─────────────────────────────────────────────── */}
      <div className="mt-4 flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="font-polysans text-heading-lg tracking-[-0.02em] text-graphite">
            {topic.title}
          </h1>
          <p className="mt-2 max-w-[56ch] text-15 leading-[1.5] text-steel">
            Practice {topic.title.toLowerCase()} topic by topic. Choose a
            subtopic to start practicing.
          </p>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-72">
          <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate" />
          <input
            type="text"
            placeholder="Search subtopics..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-10 w-full rounded-lg border border-mist bg-canvas pl-10 pr-3 text-15 text-graphite placeholder:text-slate focus:border-graphite focus:outline-none"
          />
        </div>
      </div>

      {/* ── 2. Preparation CTA Banner ──────────────────────────────────── */}
      <div className="mt-8 flex items-center justify-between gap-6 rounded-asymmetric bg-ash p-6 sm:p-8">
        <div className="flex items-start gap-4">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-canvas text-ember">
            <SparklesIcon className="h-5 w-5" />
          </span>
          <div>
            <h2 className="font-polysans text-subheading tracking-[-0.02em] text-graphite">
              Prepare for your next placement
            </h2>
            <p className="mt-1 max-w-[48ch] text-13 leading-[1.5] text-steel">
              Follow a structured path — pick a topic, drill subtopics, and
              track your progress toward placement readiness.
            </p>
          </div>
        </div>
        <Link
          href="#"
          className="hidden shrink-0 items-center gap-2 rounded-buttons bg-graphite px-5 py-2.5 font-polysans text-13 tracking-[-0.02em] text-inverse transition-opacity hover:opacity-85 sm:inline-flex"
        >
          Plan My Preparation
          <ArrowRightIcon className="h-3.5 w-3.5" />
        </Link>
      </div>

      {/* ── 3. Main Topic Navigation ───────────────────────────────────── */}
      <div className="mt-8 flex flex-wrap items-center gap-2">
        {TOPIC_FILTERS.map((filter) => {
          const isActive =
            filter.id === "all"
              ? false
              : filter.id === activeTopicFilter;
          // "All Topics" always links back to /topics
          const href =
            filter.id === "all" ? "/topics" : `/topics/${filter.id}`;

          return (
            <Link
              key={filter.id}
              href={href}
              className={`rounded-tags border px-3 py-1 font-polysans text-13 tracking-[-0.02em] transition-colors ${
                isActive
                  ? "border-graphite bg-graphite text-inverse"
                  : "border-mist bg-canvas text-slate hover:border-graphite hover:text-graphite"
              }`}
            >
              {filter.label}
            </Link>
          );
        })}
      </div>

      {/* ── 4. Subtopic Navigation (pills) ─────────────────────────────── */}
      <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setSubtopicFilter("all")}
            className={`rounded-full px-3 py-1 font-polysans text-13 tracking-[-0.02em] transition-colors ${
              subtopicFilter === "all"
                ? "bg-fog text-graphite"
                : "text-slate hover:text-graphite"
            }`}
          >
            All Subtopics
          </button>
          {(subtopicFilter === "__all-expanded"
            ? topic.subtopics
            : topic.subtopics.slice(0, 6)
          ).map((s) => (
            <button
              key={s.id}
              type="button"
              onClick={() =>
                setSubtopicFilter(subtopicFilter === s.id ? "all" : s.id)
              }
              className={`rounded-full px-3 py-1 font-polysans text-13 tracking-[-0.02em] transition-colors ${
                subtopicFilter === s.id
                  ? "bg-fog text-graphite"
                  : "text-slate hover:text-graphite"
              }`}
            >
              {s.name}
            </button>
          ))}
          {topic.subtopics.length > 6 && (
            <button
              type="button"
              onClick={() =>
                setSubtopicFilter(
                  subtopicFilter === "__all-expanded" ? "all" : "__all-expanded",
                )
              }
              className="rounded-full px-3 py-1 font-polysans text-13 tracking-[-0.02em] text-ember"
            >
              {subtopicFilter === "__all-expanded"
                ? "Show less"
                : `+ ${topic.subtopics.length - 6} more`}
            </button>
          )}
        </div>

        {/* Sort */}
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="h-8 cursor-pointer rounded-lg border border-mist bg-canvas px-3 text-13 text-graphite focus:border-graphite focus:outline-none"
        >
          {SORT_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      {/* ── 5. Subtopic Grid ────────────────────────────────────────────── */}
      {filtered.length > 0 ? (
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((subtopic) => {
            const Icon = getSubtopicIcon(subtopic.id);
            const progress = subtopicProgress[subtopic.id] ?? null;
            const solved = progress?.solved ?? 0;
            const total = progress?.total ?? subtopic.questions;
            const pct = total > 0 ? Math.round((solved / total) * 100) : 0;

            // Sheet count for this subtopic
            const sheetCount = (practiceSheets[subtopic.id] ?? []).length;

            return (
              <Link
                key={subtopic.id}
                href={`/topics/${topicId}/${subtopic.id}`}
                className="group flex flex-col rounded-2xl border border-mist bg-canvas p-5 transition-all hover:border-graphite hover:shadow-sm"
              >
                {/* Top: Icon + Name */}
                <div className="flex items-start gap-3">
                  {Icon && (
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-ash text-graphite transition-colors group-hover:bg-graphite group-hover:text-inverse">
                      <Icon className="h-5 w-5" />
                    </span>
                  )}
                  <div className="min-w-0">
                    <p className="font-polysans text-15 tracking-[-0.02em] text-graphite">
                      {subtopic.name}
                    </p>
                  </div>
                </div>

                {/* Metadata */}
                <div className="mt-4 flex items-center gap-4 text-13 text-slate">
                  <span>{subtopic.questions} Questions</span>
                  {sheetCount > 0 && (
                    <>
                      <span>·</span>
                      <span>
                        {sheetCount} Sheet{sheetCount !== 1 ? "s" : ""}
                      </span>
                    </>
                  )}
                </div>

                {/* Bottom: Progress */}
                <div className="mt-auto pt-4">
                  <div className="flex items-center justify-between text-13">
                    <span className="text-slate">Your Progress</span>
                    <span className="font-polysans text-graphite">{pct}%</span>
                  </div>
                  <div className="mt-2 h-1.5 w-full rounded-full bg-fog">
                    <div
                      className="h-full rounded-full bg-ember transition-all"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>

                {/* Arrow */}
                <div className="mt-4 flex justify-end">
                  <ArrowRightIcon className="h-4 w-4 text-slate transition-colors group-hover:text-ember" />
                </div>
              </Link>
            );
          })}
        </div>
      ) : (
        <div className="mt-16 text-center">
          <p className="text-15 text-steel">
            {search ? "No subtopics match your search." : "No subtopics found."}
          </p>
          {(search || subtopicFilter !== "all") && (
            <button
              type="button"
              onClick={() => {
                setSearch("");
                setSubtopicFilter("all");
              }}
              className="mt-3 font-polysans text-13 text-ember hover:underline"
            >
              Clear filters
            </button>
          )}
        </div>
      )}

      {/* Count */}
      {filtered.length > 0 && (
        <p className="mt-6 text-13 text-slate">
          {filtered.length} subtopic{filtered.length !== 1 ? "s" : ""}
        </p>
      )}
    </div>
  );
}
