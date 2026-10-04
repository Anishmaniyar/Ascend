"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  ClockIcon,
  ClipboardCheckIcon,
  ArrowRightIcon,
} from "@/components/ui/icons";

function BookIcon(props) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden {...props}>
      <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20" />
    </svg>
  );
}

function EyeIcon(props) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden {...props}>
      <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}
import GoBack from "@/components/ui/GoBack";
import Button from "@/components/ui/Button";
import { practiceHistory } from "@/lib/mock/dashboard";

// ─── Constants ─────────────────────────────────────────────────────────
const TOPICS = ["All Topics", "Quantitative Aptitude", "Logical Reasoning", "Verbal Ability", "Data Interpretation"];
const SUBTOPICS = ["All Subtopics", "Profit & Loss", "Time & Work", "Number System", "Probability", "Seating Arrangement", "Coding-Decoding", "Synonyms & Antonyms", "Sentence Correction", "Bar Graphs", "Pie Charts", "Averages", "Syllogisms", "Simple & Compound Interest", "Time, Speed & Distance", "Reading Comprehension", "Ratio & Proportion", "Blood Relations", "Percentages", "Error Spotting", "Permutation & Combination", "Direction Sense", "Mixtures & Alligations", "Tables", "Fill in the Blanks", "HCF & LCM", "Puzzles", "Algebra", "Para Jumbles"];
const DIFFICULTIES = ["All Difficulty", "Easy", "Medium", "Hard"];
const ROWS_PER_PAGE = 8;

// ─── Helpers ───────────────────────────────────────────────────────────
function formatDate(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-IN", { month: "short", day: "numeric", year: "numeric" });
}

function formatTime(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });
}

function getPerformanceLabel(accuracy) {
  if (accuracy >= 85) return { text: "Excellent", color: "text-success" };
  if (accuracy >= 70) return { text: "Good", color: "text-graphite" };
  if (accuracy >= 50) return { text: "Average", color: "text-brass" };
  return { text: "Needs Work", color: "text-ember" };
}

function MiniAccuracyRing({ accuracy, size = 28 }) {
  const radius = (size - 4) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (accuracy / 100) * circumference;
  const color = accuracy >= 80 ? "var(--color-success)" : accuracy >= 50 ? "var(--color-brass)" : "var(--color-ember)";

  return (
    <svg width={size} height={size} className="-rotate-90">
      <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="var(--color-mist)" strokeWidth={3} />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke={color}
        strokeWidth={3}
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
      />
    </svg>
  );
}

// ─── Component ─────────────────────────────────────────────────────────
export default function PracticeHistoryPage() {
  const [topicFilter, setTopicFilter] = useState("All Topics");
  const [subtopicFilter, setSubtopicFilter] = useState("All Subtopics");
  const [difficultyFilter, setDifficultyFilter] = useState("All Difficulty");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    let rows = [...practiceHistory];

    if (topicFilter !== "All Topics") {
      rows = rows.filter((r) => r.topic === topicFilter);
    }
    if (subtopicFilter !== "All Subtopics") {
      rows = rows.filter((r) => r.subtopic === subtopicFilter);
    }
    if (difficultyFilter !== "All Difficulty") {
      rows = rows.filter((r) => r.difficulty === difficultyFilter);
    }
    if (dateFrom) {
      rows = rows.filter((r) => new Date(r.date) >= new Date(dateFrom));
    }
    if (dateTo) {
      rows = rows.filter((r) => new Date(r.date) <= new Date(dateTo + "T23:59:59"));
    }

    return rows;
  }, [topicFilter, subtopicFilter, difficultyFilter, dateFrom, dateTo]);

  const totalPages = Math.ceil(filtered.length / ROWS_PER_PAGE);
  const paginatedRows = filtered.slice((page - 1) * ROWS_PER_PAGE, page * ROWS_PER_PAGE);

  const pageNumbers = useMemo(() => {
    const pages = [];
    const maxVisible = 5;
    let start = Math.max(1, page - Math.floor(maxVisible / 2));
    let end = Math.min(totalPages, start + maxVisible - 1);
    start = Math.max(1, end - maxVisible + 1);
    for (let i = start; i <= end; i++) pages.push(i);
    return pages;
  }, [page, totalPages]);

  const clearFilters = () => {
    setTopicFilter("All Topics");
    setSubtopicFilter("All Subtopics");
    setDifficultyFilter("All Difficulty");
    setDateFrom("");
    setDateTo("");
    setPage(1);
  };

  const hasFilters = topicFilter !== "All Topics" || subtopicFilter !== "All Subtopics" || difficultyFilter !== "All Difficulty" || dateFrom || dateTo;

  return (
    <div className="mx-auto w-full max-w-[var(--page-max-width)] px-6 py-10">
      {/* Go back */}
      <GoBack className="mb-6" />

      {/* ── Page Header ─────────────────────────────────────────────── */}
      <header>
        <h1 className="font-polysans text-heading-lg tracking-[-0.02em] text-graphite">
          Practice History
        </h1>
        <p className="mt-2 max-w-[56ch] text-15 leading-[1.5] text-steel">
          Review your practice sessions and track your learning journey.
        </p>
      </header>

      {/* ── Main Container ──────────────────────────────────────────── */}
      <div className="mt-8 overflow-hidden rounded-2xl border border-mist bg-canvas">
        {/* ── Filter Row ────────────────────────────────────────────── */}
        <div className="flex flex-wrap items-center gap-3 border-b border-mist px-6 py-4">
          {/* Topic */}
          <select
            value={topicFilter}
            onChange={(e) => { setTopicFilter(e.target.value); setPage(1); }}
            className="h-9 cursor-pointer rounded-lg border border-mist bg-fog px-3 text-13 text-graphite focus:border-graphite focus:outline-none"
          >
            {TOPICS.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>

          {/* Subtopic */}
          <select
            value={subtopicFilter}
            onChange={(e) => { setSubtopicFilter(e.target.value); setPage(1); }}
            className="h-9 cursor-pointer rounded-lg border border-mist bg-fog px-3 text-13 text-graphite focus:border-graphite focus:outline-none"
          >
            {SUBTOPICS.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>

          {/* Difficulty */}
          <select
            value={difficultyFilter}
            onChange={(e) => { setDifficultyFilter(e.target.value); setPage(1); }}
            className="h-9 cursor-pointer rounded-lg border border-mist bg-fog px-3 text-13 text-graphite focus:border-graphite focus:outline-none"
          >
            {DIFFICULTIES.map((d) => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>

          {/* Date Range */}
          <div className="flex items-center gap-2">
            <input
              type="date"
              value={dateFrom}
              onChange={(e) => { setDateFrom(e.target.value); setPage(1); }}
              className="h-9 cursor-pointer rounded-lg border border-mist bg-fog px-3 text-13 text-graphite focus:border-graphite focus:outline-none"
            />
            <span className="text-13 text-slate">to</span>
            <input
              type="date"
              value={dateTo}
              onChange={(e) => { setDateTo(e.target.value); setPage(1); }}
              className="h-9 cursor-pointer rounded-lg border border-mist bg-fog px-3 text-13 text-graphite focus:border-graphite focus:outline-none"
            />
          </div>

          {/* Clear */}
          {hasFilters && (
            <button
              type="button"
              onClick={clearFilters}
              className="font-polysans text-13 text-ember hover:underline"
            >
              Clear
            </button>
          )}
        </div>

        {/* ── Session Table ──────────────────────────────────────────── */}
        {filtered.length > 0 ? (
          <>
            {/* Desktop table */}
            <div className="hidden overflow-x-auto lg:block">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-mist bg-fog/50">
                    <th className="px-6 py-3 text-left text-13 font-polysans font-normal text-slate">Session</th>
                    <th className="px-4 py-3 text-left text-13 font-polysans font-normal text-slate">Topic</th>
                    <th className="px-4 py-3 text-left text-13 font-polysans font-normal text-slate">Score</th>
                    <th className="px-4 py-3 text-left text-13 font-polysans font-normal text-slate">Accuracy</th>
                    <th className="px-4 py-3 text-left text-13 font-polysans font-normal text-slate">Time Taken</th>
                    <th className="px-4 py-3 text-left text-13 font-polysans font-normal text-slate">Date</th>
                    <th className="px-4 py-3 text-right text-13 font-polysans font-normal text-slate">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-mist">
                  {paginatedRows.map((session) => {
                    const perf = getPerformanceLabel(session.accuracy);
                    return (
                      <tr key={session.id} className="transition-colors hover:bg-fog/30">
                        {/* Session */}
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-ash">
                              <BookIcon className="h-4 w-4 text-graphite" />
                            </span>
                            <div>
                              <p className="font-polysans text-15 tracking-[-0.02em] text-graphite">
                                Session #{session.sessionNumber}
                              </p>
                              <p className="text-13 text-slate">{session.total} Questions</p>
                            </div>
                          </div>
                        </td>

                        {/* Topic */}
                        <td className="px-4 py-4">
                          <p className="font-polysans text-15 tracking-[-0.02em] text-graphite">
                            {session.topic}
                          </p>
                          <p className="text-13 text-slate">{session.subtopic}</p>
                        </td>

                        {/* Score */}
                        <td className="px-4 py-4">
                          <p className="font-polysans text-15 tracking-[-0.02em] text-graphite">
                            {session.score} / {session.total}
                          </p>
                          <p className={`text-13 ${perf.color}`}>{perf.text}</p>
                        </td>

                        {/* Accuracy */}
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-2">
                            <MiniAccuracyRing accuracy={session.accuracy} />
                            <span className="font-polysans text-15 text-graphite">{session.accuracy}%</span>
                          </div>
                        </td>

                        {/* Time Taken */}
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-1.5 text-13 text-steel">
                            <ClockIcon className="h-3.5 w-3.5" />
                            {session.timeTaken}
                          </div>
                        </td>

                        {/* Date */}
                        <td className="px-4 py-4">
                          <p className="text-13 text-graphite">{formatDate(session.date)}</p>
                          <p className="text-13 text-slate">{formatTime(session.date)}</p>
                        </td>

                        {/* Action */}
                        <td className="px-4 py-4 text-right">
                          <Link
                            href={`/practice-history/${session.id}`}
                            className="inline-flex items-center gap-1.5 rounded-lg border border-mist bg-canvas px-3 py-1.5 text-13 text-graphite transition-colors hover:border-graphite hover:shadow-sm"
                          >
                            <EyeIcon className="h-3.5 w-3.5" />
                            View
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Mobile cards */}
            <div className="divide-y divide-mist lg:hidden">
              {paginatedRows.map((session) => {
                const perf = getPerformanceLabel(session.accuracy);
                return (
                  <div key={session.id} className="px-6 py-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-ash">
                          <BookIcon className="h-4 w-4 text-graphite" />
                        </span>
                        <div>
                          <p className="font-polysans text-15 tracking-[-0.02em] text-graphite">
                            Session #{session.sessionNumber}
                          </p>
                          <p className="text-13 text-slate">{session.total} Questions</p>
                        </div>
                      </div>
                      <Link
                        href={`/practice-history/${session.id}`}
                        className="inline-flex items-center gap-1 rounded-lg border border-mist bg-canvas px-2.5 py-1 text-13 text-graphite"
                      >
                        <EyeIcon className="h-3 w-3" />
                        View
                      </Link>
                    </div>

                    <div className="mt-3 ml-12 grid grid-cols-2 gap-3">
                      <div>
                        <p className="text-11 uppercase tracking-wider text-slate">Topic</p>
                        <p className="mt-0.5 text-13 text-graphite">{session.topic}</p>
                        <p className="text-13 text-slate">{session.subtopic}</p>
                      </div>
                      <div>
                        <p className="text-11 uppercase tracking-wider text-slate">Score</p>
                        <p className="mt-0.5 font-polysans text-13 text-graphite">
                          {session.score} / {session.total}
                        </p>
                        <p className={`text-13 ${perf.color}`}>{perf.text}</p>
                      </div>
                      <div>
                        <p className="text-11 uppercase tracking-wider text-slate">Accuracy</p>
                        <div className="mt-0.5 flex items-center gap-1.5">
                          <MiniAccuracyRing accuracy={session.accuracy} size={20} />
                          <span className="text-13 text-graphite">{session.accuracy}%</span>
                        </div>
                      </div>
                      <div>
                        <p className="text-11 uppercase tracking-wider text-slate">Time / Date</p>
                        <div className="mt-0.5 flex items-center gap-1 text-13 text-steel">
                          <ClockIcon className="h-3 w-3" />
                          {session.timeTaken}
                        </div>
                        <p className="text-13 text-slate">{formatDate(session.date)}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* ── Pagination ──────────────────────────────────────────── */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 border-t border-mist px-6 py-4">
                <button
                  type="button"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="flex h-8 items-center gap-1 rounded-lg border border-mist bg-canvas px-3 text-13 text-slate transition-colors hover:border-graphite hover:text-graphite disabled:opacity-40"
                >
                  <ChevronLeftIcon className="h-3.5 w-3.5" />
                  Previous
                </button>
                {pageNumbers.map((p) => (
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
                ))}
                <button
                  type="button"
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="flex h-8 items-center gap-1 rounded-lg border border-mist bg-canvas px-3 text-13 text-slate transition-colors hover:border-graphite hover:text-graphite disabled:opacity-40"
                >
                  Next
                  <ChevronRightIcon className="h-3.5 w-3.5" />
                </button>
              </div>
            )}

            {/* Count */}
            <p className="border-t border-mist px-6 py-3 text-center text-13 text-slate">
              Showing {(page - 1) * ROWS_PER_PAGE + 1}–
              {Math.min(page * ROWS_PER_PAGE, filtered.length)} of {filtered.length} sessions
            </p>
          </>
        ) : (
          <div className="px-6 py-16 text-center">
            <p className="text-15 text-steel">
              {hasFilters ? "No sessions match your filters." : "No practice history yet."}
            </p>
            {hasFilters && (
              <button
                type="button"
                onClick={clearFilters}
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
