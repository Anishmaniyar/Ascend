"use client";

import { useState, useMemo, use, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  SearchIcon,
  SparklesIcon,
} from "@/components/ui/icons";
import { getSubtopicIcon, getTopicIcon } from "@/lib/subtopicIcons";
import { getTopics, getSubtopics } from "@/lib/api/topics";
import { getProgress } from "@/lib/api/profile";
import Button from "@/components/ui/Button";

const SORT_OPTIONS = [
  { value: "az", label: "A – Z" },
  { value: "za", label: "Z – A" },
  { value: "most", label: "Most Questions" },
  { value: "least", label: "Least Questions" },
];

export default function SubtopicsPage({ params }) {
  const { topicId } = use(params);

  const [topics, setTopics] = useState(null);
  const [subtopics, setSubtopics] = useState(null);
  const [progressBySubtopic, setProgressBySubtopic] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("az");
  const [subtopicFilter, setSubtopicFilter] = useState("all");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const [allTopics, subs, progress] = await Promise.all([
        getTopics(),
        getSubtopics(topicId),
        getProgress().catch(() => null),
      ]);
      setTopics(allTopics);
      setSubtopics(subs);
      const map = {};
      for (const s of progress?.subtopics || []) map[s.id] = s;
      setProgressBySubtopic(map);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [topicId]);

  useEffect(() => {
    load();
  }, [load]);

  const topic = (topics || []).find((t) => t.id === topicId);

  const filtered = useMemo(() => {
    if (!subtopics) return [];
    let list = subtopics.filter((s) =>
      s.title.toLowerCase().includes(search.toLowerCase()),
    );
    if (subtopicFilter !== "all" && subtopicFilter !== "__all-expanded") {
      list = list.filter((s) => s.id === subtopicFilter);
    }
    const count = (s) => s._count?.questions ?? 0;
    switch (sort) {
      case "za":
        list = [...list].sort((a, b) => b.title.localeCompare(a.title));
        break;
      case "most":
        list = [...list].sort((a, b) => count(b) - count(a));
        break;
      case "least":
        list = [...list].sort((a, b) => count(a) - count(b));
        break;
      default:
        list = [...list].sort((a, b) => a.title.localeCompare(b.title));
    }
    return list;
  }, [subtopics, search, sort, subtopicFilter]);

  if (loading) {
    return (
      <div className="mx-auto w-full max-w-[var(--page-max-width)] px-6 py-10">
        <p className="text-13 text-slate">Loading subtopics…</p>
      </div>
    );
  }

  if (error || !subtopics || !topic) {
    return (
      <div className="mx-auto w-full max-w-[var(--page-max-width)] px-6 py-10">
        <p className="text-15 text-steel">
          {error ? `Couldn't load this topic: ${error}` : "Topic not found."}
        </p>
        <div className="mt-4 flex items-center gap-4">
          <Link
            href="/topics"
            className="inline-flex items-center gap-1 font-polysans text-13 tracking-[-0.02em] text-ember hover:underline"
          >
            <ArrowLeftIcon className="h-3.5 w-3.5" />
            Back to Topics
          </Link>
          {error && (
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

  const TopicIcon = getTopicIcon(topic.id);

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
        <div className="flex items-start gap-4">
          {TopicIcon && (
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-ash text-graphite">
              <TopicIcon className="h-6 w-6" />
            </span>
          )}
          <div>
            <h1 className="font-polysans text-heading-lg tracking-[-0.02em] text-graphite">
              {topic.title}
            </h1>
            <p className="mt-2 max-w-[56ch] text-15 leading-[1.5] text-steel">
              {topic.description || "Choose a subtopic to start practicing."}
            </p>
          </div>
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
        <Button render={<Link href="/progress" />} variant="primary" size="sm" className="hidden shrink-0 sm:inline-flex">
          View My Progress
          <ArrowRightIcon className="h-3.5 w-3.5" />
        </Button>
      </div>

      {/* ── 3. Topic Navigation (live topics) ──────────────────────────── */}
      <div className="mt-8 flex flex-wrap items-center gap-2">
        <Link
          href="/topics"
          className="rounded-tags border border-mist bg-canvas px-3 py-1 font-polysans text-13 tracking-[-0.02em] text-slate transition-colors hover:border-graphite hover:text-graphite"
        >
          All Topics
        </Link>
        {(topics || []).map((t) => (
          <Link
            key={t.id}
            href={`/topics/${t.id}`}
            className={`rounded-tags border px-3 py-1 font-polysans text-13 tracking-[-0.02em] transition-colors ${
              t.id === topicId
                ? "border-graphite bg-graphite text-inverse"
                : "border-mist bg-canvas text-slate hover:border-graphite hover:text-graphite"
            }`}
          >
            {t.title}
          </Link>
        ))}
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
            ? subtopics
            : subtopics.slice(0, 6)
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
              {s.title}
            </button>
          ))}
          {subtopics.length > 6 && (
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
                : `+ ${subtopics.length - 6} more`}
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

      {/* ── 5. Subtopic List ────────────────────────────────────────────── */}
      {filtered.length > 0 ? (
        <div className="mt-6 overflow-hidden rounded-2xl border border-mist bg-canvas">
          {/* Table header */}
          <div className="grid grid-cols-[1fr_90px_140px] gap-4 border-b border-mist bg-fog/50 px-5 py-3">
            <span className="text-13 font-polysans text-slate">Subtopic</span>
            <span className="text-13 font-polysans text-slate">Questions</span>
            <span className="text-13 font-polysans text-slate">Progress</span>
          </div>

          {/* Table rows */}
          {filtered.map((subtopic) => {
            const Icon = getSubtopicIcon(subtopic.id);
            const p = progressBySubtopic[subtopic.id];
            const solved = p?.solved ?? 0;
            const total = p?.total ?? subtopic._count?.questions ?? 0;
            const pct = total > 0 ? Math.round((solved / total) * 100) : 0;

            return (
              <Link
                key={subtopic.id}
                href={`/topics/${topicId}/${subtopic.id}`}
                className="group grid grid-cols-[1fr_90px_140px] items-center gap-4 border-b border-mist px-5 py-4 transition-colors last:border-b-0 hover:bg-fog/30"
              >
                {/* Subtopic info */}
                <div className="flex items-center gap-3">
                  {Icon && (
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-ash text-graphite transition-colors group-hover:bg-graphite group-hover:text-inverse">
                      <Icon className="h-4 w-4" />
                    </span>
                  )}
                  <div className="min-w-0">
                    <p className="truncate font-polysans text-15 tracking-[-0.02em] text-graphite">
                      {subtopic.title}
                    </p>
                    {subtopic.description && (
                      <p className="mt-0.5 truncate text-13 text-steel">
                        {subtopic.description}
                      </p>
                    )}
                  </div>
                </div>

                {/* Questions */}
                <span className="text-13 text-steel">
                  {subtopic._count?.questions ?? 0}
                </span>

                {/* Progress */}
                <div className="flex items-center gap-2">
                  <div className="h-1.5 w-full rounded-full bg-fog">
                    <div
                      className="h-full rounded-full bg-ember transition-all"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <span className="shrink-0 font-polysans text-13 text-graphite">
                    {pct}%
                  </span>
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
