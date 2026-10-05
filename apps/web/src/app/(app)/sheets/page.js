"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  ArrowRightIcon,
  SearchIcon,
  ClockIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  PlayIcon,
  RotateCcwIcon,
} from "@/components/ui/icons";
import { getSheets } from "@/lib/api/topics";
import Button from "@/components/ui/Button";

// ─── Color maps (API difficulties are EASY/MEDIUM/HARD) ────────────────
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

const SHEETS_PER_PAGE = 6;

// ─── Filter options ───────────────────────────────────────────────────
const DIFF_FILTER_OPTIONS = [
  { value: "all", label: "All Difficulties" },
  { value: "EASY", label: "Easy" },
  { value: "MEDIUM", label: "Medium" },
  { value: "HARD", label: "Hard" },
];

const QUESTION_FILTER_OPTIONS = [
  { value: "all", label: "All Questions" },
  { value: "small", label: "1 – 15" },
  { value: "medium", label: "16 – 22" },
  { value: "large", label: "23 +" },
];

const STATUS_FILTER_OPTIONS = [
  { value: "all", label: "All Status" },
  { value: "not-started", label: "Not Started" },
  { value: "in-progress", label: "In Progress" },
  { value: "completed", label: "Completed" },
];

const SORT_OPTIONS = [
  { value: "az", label: "A – Z" },
  { value: "za", label: "Z – A" },
  { value: "difficulty-asc", label: "Difficulty ↑" },
  { value: "difficulty-desc", label: "Difficulty ↓" },
  { value: "progress", label: "Progress" },
];

const DIFF_ORDER = { EASY: 1, MEDIUM: 2, HARD: 3 };

// ─── Component ────────────────────────────────────────────────────────
export default function SheetsPage() {
  const [rows, setRows] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeCompany, setActiveCompany] = useState(null);
  const [diffFilter, setDiffFilter] = useState("all");
  const [questionFilter, setQuestionFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sort, setSort] = useState("az");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      setRows(await getSheets());
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const companies = useMemo(
    () => [...new Set((rows || []).map((r) => r.companyName))].sort(),
    [rows],
  );

  const statusOf = (r) => {
    if (r.questionCount > 0 && r.solved >= r.questionCount) return "completed";
    if (r.solved > 0) return "in-progress";
    return "not-started";
  };

  const filtered = useMemo(() => {
    let list = [...(rows || [])];

    if (activeCompany) {
      list = list.filter((r) => r.companyName === activeCompany);
    }
    if (diffFilter !== "all") {
      list = list.filter((r) => r.difficulty === diffFilter);
    }
    if (questionFilter !== "all") {
      list = list.filter((r) => {
        if (questionFilter === "small") return r.questionCount <= 15;
        if (questionFilter === "medium")
          return r.questionCount >= 16 && r.questionCount <= 22;
        if (questionFilter === "large") return r.questionCount >= 23;
        return true;
      });
    }
    if (statusFilter !== "all") {
      list = list.filter((r) => statusOf(r) === statusFilter);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (r) =>
          r.title.toLowerCase().includes(q) ||
          r.companyName.toLowerCase().includes(q) ||
          (r.description || "").toLowerCase().includes(q),
      );
    }

    switch (sort) {
      case "za":
        list.sort((a, b) => b.title.localeCompare(a.title));
        break;
      case "difficulty-asc":
        list.sort((a, b) => DIFF_ORDER[a.difficulty] - DIFF_ORDER[b.difficulty]);
        break;
      case "difficulty-desc":
        list.sort((a, b) => DIFF_ORDER[b.difficulty] - DIFF_ORDER[a.difficulty]);
        break;
      case "progress":
        list.sort((a, b) => {
          const pctA = a.questionCount > 0 ? a.solved / a.questionCount : 0;
          const pctB = b.questionCount > 0 ? b.solved / b.questionCount : 0;
          return pctB - pctA;
        });
        break;
      default:
        list.sort((a, b) => a.title.localeCompare(b.title));
    }

    return list;
  }, [rows, activeCompany, diffFilter, questionFilter, statusFilter, sort, search]);

  // Pagination
  const totalPages = Math.ceil(filtered.length / SHEETS_PER_PAGE);
  const paginatedRows = filtered.slice(
    (page - 1) * SHEETS_PER_PAGE,
    page * SHEETS_PER_PAGE,
  );

  const clearAll = () => {
    setActiveCompany(null);
    setDiffFilter("all");
    setQuestionFilter("all");
    setStatusFilter("all");
    setSort("az");
    setSearch("");
    setPage(1);
  };

  const hasActiveFilters =
    activeCompany || diffFilter !== "all" || questionFilter !== "all" || statusFilter !== "all" || search;

  const handleCompanyFilter = (name) => {
    setActiveCompany(name);
    setPage(1);
  };

  if (loading) {
    return (
      <div className="mx-auto w-full max-w-[var(--page-max-width)] px-6 py-10">
        <p className="text-13 text-slate">Loading company sheets…</p>
      </div>
    );
  }

  if (error || !rows) {
    return (
      <div className="mx-auto w-full max-w-[var(--page-max-width)] px-6 py-10">
        <div className="rounded-2xl bg-ash p-6 text-13 text-steel">
          <p>Couldn&apos;t load company sheets: {error}</p>
          <button
            type="button"
            onClick={load}
            className="mt-3 font-polysans text-graphite underline underline-offset-2 hover:text-ember"
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  const renderRowMeta = (sheet) => {
    const label = DIFF_LABEL[sheet.difficulty] || sheet.difficulty;
    return { label };
  };

  return (
    <div className="mx-auto w-full max-w-[var(--page-max-width)] px-6 py-10">
      {/* 1. PAGE HEADER */}
      <div>
        <h1 className="font-polysans text-heading-lg tracking-[-0.02em] text-graphite">
          Company Sheets
        </h1>
        <p className="mt-2 max-w-[56ch] text-15 leading-[1.5] text-steel">
          Practice curated aptitude question sets modeled on real placement
          tests from top companies.
        </p>
      </div>

      {/* 2. COMPANY NAVIGATION (from live data) */}
      <div className="mt-8 flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => handleCompanyFilter(null)}
          className={`rounded-tags border px-3 py-1 font-polysans text-13 tracking-[-0.02em] transition-colors ${
            activeCompany === null
              ? "border-graphite bg-graphite text-inverse"
              : "border-mist bg-canvas text-slate hover:border-graphite hover:text-graphite"
          }`}
        >
          All Companies
        </button>
        {companies.map((name) => (
          <button
            key={name}
            type="button"
            onClick={() =>
              handleCompanyFilter(activeCompany === name ? null : name)
            }
            className={`inline-flex items-center gap-1.5 rounded-tags border px-3 py-1 font-polysans text-13 tracking-[-0.02em] transition-colors ${
              activeCompany === name
                ? "border-graphite bg-graphite text-inverse"
                : "border-mist bg-canvas text-slate hover:border-graphite hover:text-graphite"
            }`}
          >
            <span
              className={`font-polysans ${
                activeCompany === name ? "text-inverse" : "text-graphite"
              }`}
            >
              {name.charAt(0)}
            </span>
            {name}
          </button>
        ))}
      </div>

      {/* 3. SEARCH & FILTERS */}
      <div className="mt-5 flex flex-wrap items-center gap-3">
        {/* Search */}
        <div className="relative min-w-[200px] flex-1">
          <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate" />
          <input
            type="text"
            placeholder="Search sheets..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="h-9 w-full rounded-lg border border-mist bg-canvas pl-9 pr-3 text-13 text-graphite placeholder:text-slate focus:border-graphite focus:outline-none"
          />
        </div>

        {/* Difficulty */}
        <select
          value={diffFilter}
          onChange={(e) => { setDiffFilter(e.target.value); setPage(1); }}
          className="h-9 cursor-pointer rounded-lg border border-mist bg-canvas px-3 text-13 text-graphite focus:border-graphite focus:outline-none"
        >
          {DIFF_FILTER_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>

        {/* Questions */}
        <select
          value={questionFilter}
          onChange={(e) => { setQuestionFilter(e.target.value); setPage(1); }}
          className="h-9 cursor-pointer rounded-lg border border-mist bg-canvas px-3 text-13 text-graphite focus:border-graphite focus:outline-none"
        >
          {QUESTION_FILTER_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>

        {/* Status */}
        <select
          value={statusFilter}
          onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
          className="h-9 cursor-pointer rounded-lg border border-mist bg-canvas px-3 text-13 text-graphite focus:border-graphite focus:outline-none"
        >
          {STATUS_FILTER_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>

        {/* Sort */}
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="h-9 cursor-pointer rounded-lg border border-mist bg-canvas px-3 text-13 text-graphite focus:border-graphite focus:outline-none"
        >
          {SORT_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              Sort: {opt.label}
            </option>
          ))}
        </select>

        {/* Clear */}
        {hasActiveFilters && (
          <button
            type="button"
            onClick={clearAll}
            className="shrink-0 font-polysans text-13 text-ember hover:underline"
          >
            Clear
          </button>
        )}
      </div>

      {/* 5. SHEET LIBRARY — TABLE */}
      <div className="mt-8">
        <h2 className="font-polysans text-subheading tracking-[-0.02em] text-graphite">
          Sheets
        </h2>

        {filtered.length > 0 ? (
          <>
            {/* Desktop table */}
            <div className="mt-4 hidden overflow-hidden rounded-2xl border border-mist bg-canvas lg:block">
              {/* Table header */}
              <div className="grid grid-cols-[1fr_100px_100px_90px_80px_140px_90px] gap-4 border-b border-mist bg-fog/50 px-5 py-3">
                <span className="text-13 font-polysans text-slate">Sheet</span>
                <span className="text-13 font-polysans text-slate">Company</span>
                <span className="text-13 font-polysans text-slate">Difficulty</span>
                <span className="text-13 font-polysans text-slate">Questions</span>
                <span className="text-13 font-polysans text-slate">Time</span>
                <span className="text-13 font-polysans text-slate">Your Progress</span>
                <span className="text-13 font-polysans text-slate">Action</span>
              </div>

              {/* Table rows */}
              {paginatedRows.map((sheet) => {
                const { label } = renderRowMeta(sheet);
                const status = statusOf(sheet);
                const completed = status === "completed";
                const inProgress = status === "in-progress";
                const pct =
                  sheet.questionCount > 0
                    ? Math.round((sheet.solved / sheet.questionCount) * 100)
                    : 0;

                let actionLabel = "Start";
                let ActionIcon = PlayIcon;
                if (completed) {
                  actionLabel = "Review";
                  ActionIcon = RotateCcwIcon;
                } else if (inProgress) {
                  actionLabel = "Continue";
                  ActionIcon = PlayIcon;
                }

                return (
                  <Link
                    key={sheet.id}
                    href={`/sheets/${sheet.id}`}
                    className="group grid grid-cols-[1fr_100px_100px_90px_80px_140px_90px] items-center gap-4 border-b border-mist px-5 py-4 transition-colors last:border-b-0 hover:bg-fog/30"
                  >
                    {/* Sheet info */}
                    <div className="min-w-0">
                      <div className="flex items-center gap-2.5">
                        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-ash font-polysans text-13 text-graphite">
                          {sheet.companyName.charAt(0)}
                        </span>
                        <div className="min-w-0">
                          <p className="truncate font-polysans text-15 tracking-[-0.02em] text-graphite">
                            {sheet.title}
                          </p>
                          <p className="mt-0.5 truncate text-13 text-slate">
                            {sheet.description}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Company */}
                    <span className="text-13 text-steel">{sheet.companyName}</span>

                    {/* Difficulty */}
                    <span
                      className={`inline-flex w-fit items-center gap-1.5 rounded-tags px-2.5 py-0.5 font-polysans text-13 tracking-[-0.02em] ${DIFF_COLORS[label]}`}
                    >
                      <span
                        className={`h-1.5 w-1.5 rounded-full ${DIFF_DOT_COLORS[label]}`}
                      />
                      {label}
                    </span>

                    {/* Questions */}
                    <span className="text-13 text-steel">
                      {sheet.questionCount}
                    </span>

                    {/* Time */}
                    <span className="inline-flex items-center gap-1 text-13 text-steel">
                      <ClockIcon className="h-3 w-3" />
                      {sheet.estimatedTime}
                    </span>

                    {/* Progress */}
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-polysans text-13 text-graphite">
                          {pct}%
                        </span>
                        <span className="text-13 text-slate">
                          {sheet.solved}/{sheet.questionCount}
                        </span>
                      </div>
                      <div className="mt-1.5 h-1.5 w-full rounded-full bg-fog">
                        <div
                          className={`h-full rounded-full transition-all ${
                            completed ? "bg-success" : "bg-ember"
                          }`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>

                    {/* Action */}
                    <Button variant={completed ? "secondary" : "primary"} size="sm" className="pointer-events-none">
                      <ActionIcon className="h-3.5 w-3.5" />
                      {actionLabel}
                    </Button>
                  </Link>
                );
              })}
            </div>

            {/* Mobile cards */}
            <div className="mt-4 space-y-3 lg:hidden">
              {paginatedRows.map((sheet) => {
                const { label } = renderRowMeta(sheet);
                const status = statusOf(sheet);
                const completed = status === "completed";
                const pct =
                  sheet.questionCount > 0
                    ? Math.round((sheet.solved / sheet.questionCount) * 100)
                    : 0;

                return (
                  <Link
                    key={sheet.id}
                    href={`/sheets/${sheet.id}`}
                    className="group flex items-center justify-between rounded-2xl border border-mist bg-canvas p-4 transition-all hover:border-graphite hover:shadow-sm"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2.5">
                        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-ash font-polysans text-13 text-graphite">
                          {sheet.companyName.charAt(0)}
                        </span>
                        <div className="min-w-0">
                          <p className="truncate font-polysans text-15 tracking-[-0.02em] text-graphite">
                            {sheet.title}
                          </p>
                          <p className="mt-0.5 text-13 text-slate">
                            {sheet.description}
                          </p>
                        </div>
                      </div>

                      {/* Meta row */}
                      <div className="mt-2.5 ml-10.5 flex flex-wrap items-center gap-2.5 text-13">
                        <span
                          className={`inline-flex items-center gap-1 rounded-tags px-2 py-0.5 font-polysans text-13 tracking-[-0.02em] ${DIFF_COLORS[label]}`}
                        >
                          <span
                            className={`h-1.5 w-1.5 rounded-full ${DIFF_DOT_COLORS[label]}`}
                          />
                          {label}
                        </span>
                        <span className="text-slate">
                          {sheet.questionCount} Qs
                        </span>
                        <span className="inline-flex items-center gap-1 text-slate">
                          <ClockIcon className="h-3 w-3" />
                          {sheet.estimatedTime}
                        </span>
                      </div>

                      {/* Progress */}
                      <div className="mt-2.5 ml-10.5">
                        <div className="flex items-center gap-2">
                          <span className="font-polysans text-13 text-graphite">
                            {sheet.solved}/{sheet.questionCount}
                          </span>
                          <div className="h-1.5 w-24 rounded-full bg-fog">
                            <div
                              className={`h-full rounded-full ${
                                completed ? "bg-success" : "bg-ember"
                              }`}
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                          <span className="text-13 text-slate">{pct}%</span>
                        </div>
                      </div>
                    </div>

                    <ArrowRightIcon className="ml-3 h-4 w-4 shrink-0 text-slate transition-colors group-hover:text-ember" />
                  </Link>
                );
              })}
            </div>

            {/* 6. PAGINATION */}
            {totalPages > 1 && (
              <div className="mt-6 flex items-center justify-center gap-2">
                <button
                  type="button"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="flex h-8 w-8 items-center justify-center rounded-lg border border-mist bg-canvas text-slate transition-colors hover:border-graphite hover:text-graphite disabled:opacity-40 disabled:hover:border-mist disabled:hover:text-slate"
                >
                  <ChevronLeftIcon className="h-4 w-4" />
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setPage(p)}
                      className={`flex h-8 w-8 items-center justify-center rounded-lg font-polysans text-13 transition-colors ${
                        page === p
                          ? "border-graphite bg-graphite text-inverse"
                          : "border border-mist bg-canvas text-slate hover:border-graphite hover:text-graphite"
                      }`}
                    >
                      {p}
                    </button>
                  ),
                )}
                <button
                  type="button"
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="flex h-8 w-8 items-center justify-center rounded-lg border border-mist bg-canvas text-slate transition-colors hover:border-graphite hover:text-graphite disabled:opacity-40 disabled:hover:border-mist disabled:hover:text-slate"
                >
                  <ChevronRightIcon className="h-4 w-4" />
                </button>
              </div>
            )}

            {/* Count */}
            <p className="mt-4 text-center text-13 text-slate">
              Showing {(page - 1) * SHEETS_PER_PAGE + 1}–
              {Math.min(page * SHEETS_PER_PAGE, filtered.length)} of{" "}
              {filtered.length} sheet{filtered.length !== 1 ? "s" : ""}
            </p>
          </>
        ) : (
          <div className="mt-16 text-center">
            <p className="text-15 text-steel">
              {hasActiveFilters
                ? "No sheets match your filters."
                : "No company sheets yet — add them from the admin API (see docs/content-guide.md)."}
            </p>
            {hasActiveFilters && (
              <button
                type="button"
                onClick={clearAll}
                className="mt-3 font-polysans text-13 text-ember hover:underline"
              >
                Clear all filters
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
