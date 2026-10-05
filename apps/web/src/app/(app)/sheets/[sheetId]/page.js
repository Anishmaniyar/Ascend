"use client";

import { useState, useMemo, use, useEffect, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeftIcon, SearchIcon, ArrowRightIcon } from "@/components/ui/icons";
import { getSheetQuestions } from "@/lib/api/topics";
import { startSession } from "@/lib/api/practice";
import Button from "@/components/ui/Button";

const DIFF_LABEL = { EASY: "Easy", MEDIUM: "Medium", HARD: "Hard" };
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
  { value: "EASY", label: "Easy" },
  { value: "MEDIUM", label: "Medium" },
  { value: "HARD", label: "Hard" },
];

export default function CompanySheetDetailPage({ params }) {
  const { sheetId } = use(params);
  const router = useRouter();

  const [sheet, setSheet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [starting, setStarting] = useState(false);
  const [startError, setStartError] = useState("");
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [mode, setMode] = useState("PRACTICE");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      setSheet(await getSheetQuestions(sheetId));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [sheetId]);

  useEffect(() => {
    load();
  }, [load]);

  const filtered = useMemo(() => {
    let list = sheet?.questions || [];
    if (filter !== "all") list = list.filter((q) => q.difficulty === filter);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter((item) => item.title.toLowerCase().includes(q));
    }
    return list;
  }, [sheet, filter, search]);

  const handleStart = async () => {
    if (starting) return;
    setStarting(true);
    setStartError("");
    try {
      const session = await startSession({ sheetId, mode });
      router.push(`/practice/session?sessionId=${session.id}`);
    } catch (err) {
      setStartError(err.message);
      setStarting(false);
    }
  };

  if (loading) {
    return (
      <div className="mx-auto w-full max-w-[var(--page-max-width)] px-6 py-10">
        <p className="text-13 text-slate">Loading sheet…</p>
      </div>
    );
  }

  if (error || !sheet) {
    return (
      <div className="mx-auto w-full max-w-[var(--page-max-width)] px-6 py-10">
        <p className="text-15 text-steel">
          {error ? `Couldn't load this sheet: ${error}` : "Sheet not found."}
        </p>
        <div className="mt-4 flex items-center gap-4">
          <Link
            href="/sheets"
            className="inline-flex items-center gap-1 font-polysans text-13 tracking-[-0.02em] text-ember hover:underline"
          >
            <ArrowLeftIcon className="h-3.5 w-3.5" />
            Back to Sheets
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

  const label = DIFF_LABEL[sheet.difficulty] || sheet.difficulty;
  const pct = sheet.progress?.percent ?? 0;

  return (
    <div className="mx-auto w-full max-w-[var(--page-max-width)] px-6 py-10">
      {/* Breadcrumb */}
      <Link
        href="/sheets"
        className="inline-flex items-center gap-1 font-polysans text-13 tracking-[-0.02em] text-slate transition-colors hover:text-ember"
      >
        <ArrowLeftIcon className="h-3.5 w-3.5" />
        All Sheets
      </Link>

      {/* Two-column layout */}
      <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-[340px_1fr] lg:items-start">
        {/* LEFT — Sheet Info Card */}
        <div className="rounded-2xl border border-mist bg-canvas p-6 lg:sticky lg:top-20">
          <div className="flex items-start gap-4">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-ash font-polysans text-subheading text-graphite">
              {sheet.companyName.charAt(0)}
            </span>
            <div className="min-w-0">
              <h1 className="font-polysans text-subheading tracking-[-0.02em] text-graphite">
                {sheet.title}
              </h1>
              <p className="mt-0.5 text-13 text-slate">{sheet.companyName}</p>
            </div>
          </div>

          {sheet.description && (
            <p className="mt-4 text-13 leading-[1.6] text-steel">
              {sheet.description}
            </p>
          )}

          <div className="mt-4 flex flex-wrap items-center gap-2 text-13">
            <span
              className={`inline-flex items-center gap-1.5 rounded-tags px-2.5 py-0.5 font-polysans text-13 tracking-[-0.02em] ${DIFF_COLORS[label] || ""}`}
            >
              <span className={`h-1.5 w-1.5 rounded-full ${DIFF_DOT_COLORS[label] || ""}`} />
              {label}
            </span>
            <span className="text-slate">
              {sheet.questions.length} Questions
            </span>
            <span className="text-slate">· {sheet.estimatedTime}</span>
          </div>

          {/* Progress */}
          <div className="my-6 h-px bg-mist" />
          <div className="flex items-center justify-between text-13">
            <span className="text-slate">Your progress</span>
            <span className="font-polysans text-graphite">
              {sheet.progress?.solved ?? 0}/{sheet.progress?.total ?? 0} ({pct}%)
            </span>
          </div>
          <div className="mt-2 h-1.5 w-full rounded-full bg-fog">
            <div
              className="h-full rounded-full bg-ember transition-all"
              style={{ width: `${pct}%` }}
            />
          </div>

          {/* Start practice */}
          <div className="my-6 h-px bg-mist" />
          <div className="flex items-center gap-1 rounded-full bg-fog p-1">
            {["PRACTICE", "TEST"].map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => setMode(m)}
                className={`flex-1 rounded-full px-3 py-1.5 font-polysans text-13 tracking-[-0.02em] transition-colors ${
                  mode === m
                    ? "bg-canvas text-graphite shadow-sm"
                    : "text-slate hover:text-graphite"
                }`}
              >
                {m === "PRACTICE" ? "Practice" : "Test"}
              </button>
            ))}
          </div>
          <Button
            variant="primary"
            className="mt-3 w-full"
            onClick={handleStart}
          >
            {starting ? "Starting…" : "Start Sheet Session"}
            <ArrowRightIcon className="h-3.5 w-3.5" />
          </Button>
          {startError && (
            <p className="mt-3 text-13 text-ember">{startError}</p>
          )}
        </div>

        {/* RIGHT — Questions */}
        <div className="min-w-0">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="font-polysans text-subheading tracking-[-0.02em] text-graphite">
              Questions
            </h2>

            <div className="flex items-center gap-3">
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

              <div className="relative">
                <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate" />
                <input
                  type="text"
                  placeholder="Search questions"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="h-9 w-40 rounded-lg border border-mist bg-canvas pl-9 pr-3 text-13 text-graphite placeholder:text-slate focus:border-graphite focus:outline-none"
                />
              </div>
            </div>
          </div>

          {filtered.length > 0 ? (
            <div className="mt-4 space-y-3">
              {filtered.map((q, i) => {
                const qLabel = DIFF_LABEL[q.difficulty] || q.difficulty;
                return (
                  <div
                    key={q.id}
                    className="flex w-full items-center justify-between gap-4 rounded-2xl border border-mist bg-canvas p-5"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="font-polysans text-15 tracking-[-0.02em] text-graphite">
                        <span className="text-slate">Q{i + 1}.</span> {q.title}
                      </p>
                      <p className="mt-1.5 text-13 text-slate">
                        {q.options?.length ?? 0} options
                      </p>
                    </div>
                    <span
                      className={`inline-flex shrink-0 items-center gap-1.5 rounded-tags px-2.5 py-0.5 font-polysans text-13 tracking-[-0.02em] ${DIFF_COLORS[qLabel] || ""}`}
                    >
                      <span className={`h-1.5 w-1.5 rounded-full ${DIFF_DOT_COLORS[qLabel] || ""}`} />
                      {qLabel}
                    </span>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="mt-16 rounded-2xl border border-dashed border-mist px-6 py-16 text-center">
              <p className="text-15 text-steel">
                {filter === "all" && !search
                  ? "This sheet has no questions yet."
                  : "No questions match your filters."}
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
