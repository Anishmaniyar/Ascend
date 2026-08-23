"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  ArrowRightIcon,
  SearchIcon,
  SparklesIcon,
} from "@/components/ui/icons";
import { getTopicIcon } from "@/lib/subtopicIcons";
import { topics } from "@/lib/mock/landing";
import { getTopicProgress } from "@/lib/mock/dashboard";

// All filterable topic labels (for the nav pills)
const TOPIC_FILTERS = [
  { id: "all", label: "All Topics" },
  { id: "quant", label: "Quantitative" },
  { id: "logical", label: "Logical" },
  { id: "verbal", label: "Verbal" },
  { id: "di", label: "Data Interpretation" },
  { id: "ga", label: "General Awareness" },
  { id: "english", label: "English Language" },
];

export default function TopicsPage() {
  const [activeFilter, setActiveFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("az");

  const filtered = useMemo(() => {
    let list = topics;

    // Filter by category pill
    if (activeFilter !== "all") {
      list = list.filter((t) => t.id === activeFilter);
    }

    // Search across title, description, and subtopic names
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (t) =>
          t.title.toLowerCase().includes(q) ||
          t.description.toLowerCase().includes(q) ||
          t.subtopics.some((s) => s.name.toLowerCase().includes(q)),
      );
    }

    // Sort
    switch (sort) {
      case "za":
        list = [...list].sort((a, b) => b.title.localeCompare(a.title));
        break;
      case "most":
        list = [...list].sort(
          (a, b) =>
            b.subtopics.reduce((s, sub) => s + sub.questions, 0) -
            a.subtopics.reduce((s, sub) => s + sub.questions, 0),
        );
        break;
      case "least":
        list = [...list].sort(
          (a, b) =>
            a.subtopics.reduce((s, sub) => s + sub.questions, 0) -
            b.subtopics.reduce((s, sub) => s + sub.questions, 0),
        );
        break;
      default:
        list = [...list].sort((a, b) => a.title.localeCompare(b.title));
    }

    return list;
  }, [activeFilter, search, sort]);

  return (
    <div className="mx-auto w-full max-w-[var(--page-max-width)] px-6 py-10">
      {/* ── 1. Page Header ───────────────────────────────────────────── */}
      <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="font-polysans text-heading-lg tracking-[-0.02em] text-graphite">
            Topics
          </h1>
          <p className="mt-2 max-w-[56ch] text-15 leading-[1.5] text-steel">
            Explore aptitude topics and start your practice journey.
          </p>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-72">
          <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate" />
          <input
            type="text"
            placeholder="Search topics or subtopics..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-10 w-full rounded-lg border border-mist bg-canvas pl-10 pr-3 text-15 text-graphite placeholder:text-slate focus:border-graphite focus:outline-none"
          />
        </div>
      </div>

      {/* ── 2. Preparation CTA Banner ────────────────────────────────── */}
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

      {/* ── 3. Topic Navigation / Filters ─────────────────────────────── */}
      <div className="mt-8 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          {TOPIC_FILTERS.map((filter) => (
            <button
              key={filter.id}
              type="button"
              onClick={() => setActiveFilter(filter.id)}
              className={`rounded-tags border px-3 py-1 font-polysans text-13 tracking-[-0.02em] transition-colors ${
                activeFilter === filter.id
                  ? "border-graphite bg-graphite text-inverse"
                  : "border-mist bg-canvas text-slate hover:border-graphite hover:text-graphite"
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>

        {/* Sort */}
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="h-8 cursor-pointer rounded-lg border border-mist bg-canvas px-3 text-13 text-graphite focus:border-graphite focus:outline-none"
        >
          <option value="az">Sort: A – Z</option>
          <option value="za">Sort: Z – A</option>
          <option value="most">Sort: Most Questions</option>
          <option value="least">Sort: Least Questions</option>
        </select>
      </div>

      {/* ── 4. Topic Grid ─────────────────────────────────────────────── */}
      {filtered.length > 0 ? (
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((topic) => {
            const totalQuestions = topic.subtopics.reduce(
              (s, sub) => s + sub.questions,
              0,
            );
            const progress = getTopicProgress(topic);
            const Icon = getTopicIcon(topic.id);

            return (
              <Link
                key={topic.id}
                href={`/topics/${topic.id}`}
                className="group flex flex-col rounded-2xl border border-mist bg-canvas p-5 transition-all hover:border-graphite hover:shadow-sm"
              >
                {/* Top: Icon + Topic Name + Description */}
                <div className="flex items-start gap-3">
                  {Icon && (
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-ash text-graphite transition-colors group-hover:bg-graphite group-hover:text-inverse">
                      <Icon className="h-5 w-5" />
                    </span>
                  )}
                  <div className="min-w-0">
                    <p className="font-polysans text-15 tracking-[-0.02em] text-graphite">
                      {topic.title}
                    </p>
                    <p className="mt-1 text-13 leading-[1.4] text-steel line-clamp-2">
                      {topic.description}
                    </p>
                  </div>
                </div>

                {/* Metadata row */}
                <p className="mt-4 text-13 text-slate">
                  {topic.subtopics.length} Subtopics · {totalQuestions} Questions
                </p>

                {/* Bottom: Progress */}
                <div className="mt-auto pt-4">
                  <div className="flex items-center justify-between text-13">
                    <span className="text-slate">Your Progress</span>
                    <span className="font-polysans text-graphite">
                      {progress.percent}%
                    </span>
                  </div>
                  <div className="mt-2 h-1.5 w-full rounded-full bg-fog">
                    <div
                      className="h-full rounded-full bg-ember transition-all"
                      style={{ width: `${progress.percent}%` }}
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
            {search
              ? "No topics match your search."
              : "No topics available yet."}
          </p>
          {search && (
            <button
              type="button"
              onClick={() => setSearch("")}
              className="mt-3 font-polysans text-13 text-ember hover:underline"
            >
              Clear search
            </button>
          )}
        </div>
      )}

      {/* Count */}
      {filtered.length > 0 && (
        <p className="mt-6 text-13 text-slate">
          {filtered.length} topic{filtered.length !== 1 ? "s" : ""}
        </p>
      )}
    </div>
  );
}
