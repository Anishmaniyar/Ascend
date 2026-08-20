"use client";

import { useState, useMemo, use } from "react";
import Link from "next/link";
import { ArrowLeftIcon, SearchIcon } from "@/components/ui/icons";
import SubtopicCard from "@/components/dashboard/SubtopicCard";
import { topics } from "@/lib/mock/landing";
import { subtopicProgress } from "@/lib/mock/dashboard";

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

  const filtered = useMemo(() => {
    if (!topic) return [];

    let list = topic.subtopics.filter((s) =>
      s.name.toLowerCase().includes(search.toLowerCase()),
    );

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
      default: // "az"
        list = [...list].sort((a, b) => a.name.localeCompare(b.name));
    }

    return list;
  }, [topic, search, sort]);

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
      {/* Back link */}
      <Link
        href="/topics"
        className="inline-flex items-center gap-1 font-polysans text-13 tracking-[-0.02em] text-slate transition-colors hover:text-ember"
      >
        <ArrowLeftIcon className="h-3.5 w-3.5" />
        All Topics
      </Link>

      {/* Header */}
      <div className="mt-4 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-polysans text-heading-lg tracking-[-0.02em] text-graphite">
            {topic.title}
          </h1>
          <p className="mt-2 text-15 text-steel">
            Choose a subtopic to start practicing.
          </p>
        </div>

        {/* Search + Sort */}
        <div className="flex items-center gap-3">
          {/* Search */}
          <div className="relative">
            <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate" />
            <input
              type="text"
              placeholder="Search subtopics"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-9 w-48 rounded-lg border border-mist bg-canvas pl-9 pr-3 text-13 text-graphite placeholder:text-slate focus:border-graphite focus:outline-none"
            />
          </div>

          {/* Sort */}
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="h-9 cursor-pointer rounded-lg border border-mist bg-canvas px-3 text-13 text-graphite focus:border-graphite focus:outline-none"
          >
            {SORT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Subtopic grid */}
      {filtered.length > 0 ? (
        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map((subtopic) => (
            <SubtopicCard
              key={subtopic.id}
              subtopic={subtopic}
              progress={subtopicProgress[subtopic.id] ?? null}
              topicId={topicId}
            />
          ))}
        </div>
      ) : (
        <div className="mt-16 text-center">
          <p className="text-15 text-steel">No subtopics match your search.</p>
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
