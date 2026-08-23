"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  ArrowRightIcon,
  SearchIcon,
  ClockIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  FilterIcon,
  PlayIcon,
  RotateCcwIcon,
  BarChart3Icon,
  LayersIcon,
} from "@/components/ui/icons";
import { companies } from "@/lib/mock/landing";

// ─── Color maps ───────────────────────────────────────────────────────
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

// ─── Mock sheet data ──────────────────────────────────────────────────
const companySheetRows = [
  {
    id: "tcs-1",
    companyId: "tcs",
    companyName: "TCS",
    title: "TCS Aptitude Set 1",
    description: "Quantitative, Logical & Verbal",
    questions: 20,
    estimatedMinutes: 30,
    difficulty: "Medium",
    solved: 14,
    attempts: 2,
    lastPracticed: "Yesterday",
  },
  {
    id: "tcs-2",
    companyId: "tcs",
    companyName: "TCS",
    title: "TCS Aptitude Set 2",
    description: "Quantitative & Logical",
    questions: 25,
    estimatedMinutes: 35,
    difficulty: "Hard",
    solved: 5,
    attempts: 1,
    lastPracticed: "2 days ago",
  },
  {
    id: "tcs-3",
    companyId: "tcs",
    companyName: "TCS",
    title: "TCS Verbal Ability Set",
    description: "Verbal & English Language",
    questions: 15,
    estimatedMinutes: 20,
    difficulty: "Easy",
    solved: 0,
    attempts: 0,
    lastPracticed: null,
  },
  {
    id: "infosys-1",
    companyId: "infosys",
    companyName: "Infosys",
    title: "Infosys Placement Set 1",
    description: "Quantitative, Logical & Verbal",
    questions: 20,
    estimatedMinutes: 30,
    difficulty: "Medium",
    solved: 20,
    attempts: 3,
    lastPracticed: "3 days ago",
  },
  {
    id: "infosys-2",
    companyId: "infosys",
    companyName: "Infosys",
    title: "Infosys Placement Set 2",
    description: "Quantitative & Logical Reasoning",
    questions: 25,
    estimatedMinutes: 40,
    difficulty: "Hard",
    solved: 0,
    attempts: 0,
    lastPracticed: null,
  },
  {
    id: "infosys-3",
    companyId: "infosys",
    companyName: "Infosys",
    title: "Infosys Practice Set 3",
    description: "Logical Reasoning & Puzzles",
    questions: 18,
    estimatedMinutes: 25,
    difficulty: "Easy",
    solved: 12,
    attempts: 1,
    lastPracticed: "Last week",
  },
  {
    id: "accenture-1",
    companyId: "accenture",
    companyName: "Accenture",
    title: "Accenture Cognito Set 1",
    description: "Quantitative & Logical",
    questions: 18,
    estimatedMinutes: 25,
    difficulty: "Hard",
    solved: 8,
    attempts: 1,
    lastPracticed: "2 days ago",
  },
  {
    id: "accenture-2",
    companyId: "accenture",
    companyName: "Accenture",
    title: "Accenture Cognito Set 2",
    description: "Quantitative, Logical & Verbal",
    questions: 22,
    estimatedMinutes: 30,
    difficulty: "Medium",
    solved: 0,
    attempts: 0,
    lastPracticed: null,
  },
  {
    id: "capgemini-1",
    companyId: "capgemini",
    companyName: "Capgemini",
    title: "Capgemini Foundation Set 1",
    description: "Quantitative, Logical & Verbal",
    questions: 22,
    estimatedMinutes: 35,
    difficulty: "Easy",
    solved: 22,
    attempts: 3,
    lastPracticed: "Last week",
  },
  {
    id: "capgemini-2",
    companyId: "capgemini",
    companyName: "Capgemini",
    title: "Capgemini Foundation Set 2",
    description: "Quantitative & Logical",
    questions: 18,
    estimatedMinutes: 25,
    difficulty: "Medium",
    solved: 6,
    attempts: 1,
    lastPracticed: "5 days ago",
  },
  {
    id: "wipro-1",
    companyId: "wipro",
    companyName: "Wipro",
    title: "Wipro NLTH Set 1",
    description: "Quantitative, Logical & Verbal",
    questions: 20,
    estimatedMinutes: 30,
    difficulty: "Medium",
    solved: 0,
    attempts: 0,
    lastPracticed: null,
  },
  {
    id: "wipro-2",
    companyId: "wipro",
    companyName: "Wipro",
    title: "Wipro NLTH Set 2",
    description: "Logical Reasoning & Quantitative",
    questions: 25,
    estimatedMinutes: 35,
    difficulty: "Hard",
    solved: 0,
    attempts: 0,
    lastPracticed: null,
  },
];

const SHEETS_PER_PAGE = 6;

// ─── Filter options ───────────────────────────────────────────────────
const DIFF_FILTER_OPTIONS = [
  { value: "all", label: "All Difficulties" },
  { value: "Easy", label: "Easy" },
  { value: "Medium", label: "Medium" },
  { value: "Hard", label: "Hard" },
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
  { value: "latest", label: "Latest" },
  { value: "az", label: "A – Z" },
  { value: "za", label: "Z – A" },
  { value: "difficulty-asc", label: "Difficulty ↑" },
  { value: "difficulty-desc", label: "Difficulty ↓" },
  { value: "progress", label: "Progress" },
];

const DIFF_ORDER = { Easy: 1, Medium: 2, Hard: 3 };

// ─── Component ────────────────────────────────────────────────────────
export default function SheetsPage() {
  const [activeCompanyId, setActiveCompanyId] = useState(null);
  const [diffFilter, setDiffFilter] = useState("all");
  const [questionFilter, setQuestionFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sort, setSort] = useState("latest");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    let rows = companySheetRows;

    // Company
    if (activeCompanyId) {
      rows = rows.filter((r) => r.companyId === activeCompanyId);
    }

    // Difficulty
    if (diffFilter !== "all") {
      rows = rows.filter((r) => r.difficulty === diffFilter);
    }

    // Question count
    if (questionFilter !== "all") {
      rows = rows.filter((r) => {
        if (questionFilter === "small") return r.questions <= 15;
        if (questionFilter === "medium") return r.questions >= 16 && r.questions <= 22;
        if (questionFilter === "large") return r.questions >= 23;
        return true;
      });
    }

    // Status
    if (statusFilter !== "all") {
      rows = rows.filter((r) => {
        const completed = r.solved === r.questions && r.questions > 0;
        const inProgress = r.solved > 0 && !completed;
        if (statusFilter === "completed") return completed;
        if (statusFilter === "in-progress") return inProgress;
        if (statusFilter === "not-started") return r.solved === 0;
        return true;
      });
    }

    // Search
    if (search.trim()) {
      const q = search.toLowerCase();
      rows = rows.filter(
        (r) =>
          r.title.toLowerCase().includes(q) ||
          r.companyName.toLowerCase().includes(q) ||
          r.description.toLowerCase().includes(q),
      );
    }

    // Sort
    switch (sort) {
      case "az":
        rows = [...rows].sort((a, b) => a.title.localeCompare(b.title));
        break;
      case "za":
        rows = [...rows].sort((a, b) => b.title.localeCompare(a.title));
        break;
      case "difficulty-asc":
        rows = [...rows].sort((a, b) => DIFF_ORDER[a.difficulty] - DIFF_ORDER[b.difficulty]);
        break;
      case "difficulty-desc":
        rows = [...rows].sort((a, b) => DIFF_ORDER[b.difficulty] - DIFF_ORDER[a.difficulty]);
        break;
      case "progress":
        rows = [...rows].sort((a, b) => {
          const pctA = a.questions > 0 ? a.solved / a.questions : 0;
          const pctB = b.questions > 0 ? b.solved / b.questions : 0;
          return pctB - pctA;
        });
        break;
      default:
        break;
    }

    return rows;
  }, [activeCompanyId, diffFilter, questionFilter, statusFilter, sort, search]);

  // Pagination
  const totalPages = Math.ceil(filtered.length / SHEETS_PER_PAGE);
  const paginatedRows = filtered.slice(
    (page - 1) * SHEETS_PER_PAGE,
    page * SHEETS_PER_PAGE,
  );

  // Stats
  const stats = useMemo(() => {
    const total = companySheetRows.length;
    const attempted = companySheetRows.filter((r) => r.solved > 0).length;
    const completed = companySheetRows.filter(
      (r) => r.solved === r.questions && r.questions > 0,
    ).length;
    const totalAttempted = companySheetRows.filter((r) => r.solved > 0);
    const avgAccuracy =
      totalAttempted.length > 0
        ? Math.round(
            totalAttempted.reduce((sum, r) => {
              const pct = r.questions > 0 ? (r.solved / r.questions) * 100 : 0;
              return sum + pct;
            }, 0) / totalAttempted.length,
          )
        : 0;
    return { total, attempted, completed, avgAccuracy };
  }, []);

  const clearAll = () => {
    setActiveCompanyId(null);
    setDiffFilter("all");
    setQuestionFilter("all");
    setStatusFilter("all");
    setSort("latest");
    setSearch("");
    setPage(1);
  };

  const hasActiveFilters =
    activeCompanyId || diffFilter !== "all" || questionFilter !== "all" || statusFilter !== "all" || search;

  // Reset page when filters change
  const handleCompanyFilter = (id) => {
    setActiveCompanyId(id);
    setPage(1);
  };

  return (
    <div className="mx-auto w-full max-w-[var(--page-max-width)] px-6 py-10">
      {/* ════════════════════════════════════════════════════════════════
          1. PAGE HEADER
          ════════════════════════════════════════════════════════════════ */}
      <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="font-polysans text-heading-lg tracking-[-0.02em] text-graphite">
            Company Sheets
          </h1>
          <p className="mt-2 max-w-[56ch] text-15 leading-[1.5] text-steel">
            Practice curated aptitude question sets modeled on real placement
            tests from top companies.
          </p>
        </div>

        {/* How it works panel */}
        <div className="shrink-0 rounded-2xl border border-mist bg-canvas p-5 sm:w-64">
          <p className="font-polysans text-15 tracking-[-0.02em] text-graphite">
            How it works?
          </p>
          <div className="mt-3 space-y-2">
            {[
              "Choose a company",
              "Pick a sheet",
              "Practice",
              "Improve your score",
            ].map((step, i) => (
              <div key={i} className="flex items-center gap-2.5 text-13 text-steel">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-ash font-polysans text-11 text-graphite">
                  {i + 1}
                </span>
                {step}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ════════════════════════════════════════════════════════════════
          2. COMPANY NAVIGATION
          ════════════════════════════════════════════════════════════════ */}
      <div className="mt-8 flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => handleCompanyFilter(null)}
          className={`rounded-tags border px-3 py-1 font-polysans text-13 tracking-[-0.02em] transition-colors ${
            activeCompanyId === null
              ? "border-graphite bg-graphite text-inverse"
              : "border-mist bg-canvas text-slate hover:border-graphite hover:text-graphite"
          }`}
        >
          All Companies
        </button>
        {companies.map((company) => (
          <button
            key={company.id}
            type="button"
            onClick={() =>
              handleCompanyFilter(activeCompanyId === company.id ? null : company.id)
            }
            className={`inline-flex items-center gap-1.5 rounded-tags border px-3 py-1 font-polysans text-13 tracking-[-0.02em] transition-colors ${
              activeCompanyId === company.id
                ? "border-graphite bg-graphite text-inverse"
                : "border-mist bg-canvas text-slate hover:border-graphite hover:text-graphite"
            }`}
          >
            <span
              className={`font-polysans ${
                activeCompanyId === company.id ? "text-inverse" : "text-graphite"
              }`}
            >
              {company.initial}
            </span>
            {company.name}
          </button>
        ))}
      </div>

      {/* ════════════════════════════════════════════════════════════════
          3. SEARCH & FILTERS
          ════════════════════════════════════════════════════════════════ */}
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

      {/* ════════════════════════════════════════════════════════════════
          4. SHEET STATISTICS
          ════════════════════════════════════════════════════════════════ */}
      <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div className="rounded-2xl border border-mist bg-canvas p-5">
          <div className="flex items-center gap-2.5">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-ash">
              <LayersIcon className="h-4 w-4 text-graphite" />
            </span>
            <div>
              <p className="font-polysans text-subheading tracking-[-0.02em] text-graphite">
                {stats.total}
              </p>
              <p className="text-13 text-slate">Total Sheets</p>
            </div>
          </div>
          <p className="mt-2 text-13 text-slate">Across all companies</p>
        </div>

        <div className="rounded-2xl border border-mist bg-canvas p-5">
          <div className="flex items-center gap-2.5">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-ash">
              <PlayIcon className="h-4 w-4 text-graphite" />
            </span>
            <div>
              <p className="font-polysans text-subheading tracking-[-0.02em] text-graphite">
                {stats.attempted}
              </p>
              <p className="text-13 text-slate">Attempted</p>
            </div>
          </div>
          <p className="mt-2 text-13 text-slate">Sheets started</p>
        </div>

        <div className="rounded-2xl border border-mist bg-canvas p-5">
          <div className="flex items-center gap-2.5">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-ash">
              <BarChart3Icon className="h-4 w-4 text-graphite" />
            </span>
            <div>
              <p className="font-polysans text-subheading tracking-[-0.02em] text-graphite">
                {stats.completed}
              </p>
              <p className="text-13 text-slate">Completed</p>
            </div>
          </div>
          <p className="mt-2 text-13 text-slate">Sheets completed</p>
        </div>

        <div className="rounded-2xl border border-mist bg-canvas p-5">
          <div className="flex items-center gap-2.5">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-ash">
              <BarChart3Icon className="h-4 w-4 text-graphite" />
            </span>
            <div>
              <p className="font-polysans text-subheading tracking-[-0.02em] text-graphite">
                {stats.avgAccuracy}%
              </p>
              <p className="text-13 text-slate">Avg. Accuracy</p>
            </div>
          </div>
          <p className="mt-2 text-13 text-slate">Across all attempts</p>
        </div>
      </div>

      {/* ════════════════════════════════════════════════════════════════
          5. SHEET LIBRARY — TABLE
          ════════════════════════════════════════════════════════════════ */}
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
                const completed =
                  sheet.solved === sheet.questions && sheet.questions > 0;
                const inProgress = sheet.solved > 0 && !completed;
                const pct =
                  sheet.questions > 0
                    ? Math.round((sheet.solved / sheet.questions) * 100)
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
                      className={`inline-flex w-fit items-center gap-1.5 rounded-tags px-2.5 py-0.5 font-polysans text-13 tracking-[-0.02em] ${DIFF_COLORS[sheet.difficulty]}`}
                    >
                      <span
                        className={`h-1.5 w-1.5 rounded-full ${DIFF_DOT_COLORS[sheet.difficulty]}`}
                      />
                      {sheet.difficulty}
                    </span>

                    {/* Questions */}
                    <span className="text-13 text-steel">
                      {sheet.questions}
                    </span>

                    {/* Time */}
                    <span className="inline-flex items-center gap-1 text-13 text-steel">
                      <ClockIcon className="h-3 w-3" />
                      {sheet.estimatedMinutes} min
                    </span>

                    {/* Progress */}
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-polysans text-13 text-graphite">
                          {pct}%
                        </span>
                        <span className="text-13 text-slate">
                          {sheet.solved}/{sheet.questions}
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
                    <span
                      className={`inline-flex items-center gap-1.5 rounded-buttons px-3 py-1.5 font-polysans text-13 tracking-[-0.02em] transition-opacity ${
                        completed
                          ? "border border-mist bg-canvas text-graphite hover:bg-fog"
                          : "bg-graphite text-inverse hover:opacity-85"
                      }`}
                    >
                      <ActionIcon className="h-3.5 w-3.5" />
                      {actionLabel}
                    </span>
                  </Link>
                );
              })}
            </div>

            {/* Mobile cards */}
            <div className="mt-4 space-y-3 lg:hidden">
              {paginatedRows.map((sheet) => {
                const completed =
                  sheet.solved === sheet.questions && sheet.questions > 0;
                const inProgress = sheet.solved > 0 && !completed;
                const pct =
                  sheet.questions > 0
                    ? Math.round((sheet.solved / sheet.questions) * 100)
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
                          className={`inline-flex items-center gap-1 rounded-tags px-2 py-0.5 font-polysans text-13 tracking-[-0.02em] ${DIFF_COLORS[sheet.difficulty]}`}
                        >
                          <span
                            className={`h-1.5 w-1.5 rounded-full ${DIFF_DOT_COLORS[sheet.difficulty]}`}
                          />
                          {sheet.difficulty}
                        </span>
                        <span className="text-slate">
                          {sheet.questions} Qs
                        </span>
                        <span className="inline-flex items-center gap-1 text-slate">
                          <ClockIcon className="h-3 w-3" />
                          {sheet.estimatedMinutes} min
                        </span>
                      </div>

                      {/* Progress */}
                      <div className="mt-2.5 ml-10.5">
                        <div className="flex items-center gap-2">
                          <span className="font-polysans text-13 text-graphite">
                            {sheet.solved}/{sheet.questions}
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

            {/* ══════════════════════════════════════════════════════════
                6. PAGINATION
                ══════════════════════════════════════════════════════════ */}
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
                : "No company sheets available yet."}
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
