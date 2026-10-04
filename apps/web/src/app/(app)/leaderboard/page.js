"use client";

import { useState, useMemo } from "react";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronDownIcon,
  TrophyIcon,
  TargetIcon,
  FlameIcon,
  ZapIcon,
} from "@/components/ui/icons";
import { leaderboardData, currentUserRank, resetInfo, LEADERBOARD_PAGE_SIZE } from "@/lib/mock/leaderboard";

// ─── Ranking filter tabs ──────────────────────────────────────────────
const RANKING_FILTERS = [
  { id: "overall", label: "Overall", icon: TrophyIcon },
  { id: "questions", label: "Questions Solved", icon: ZapIcon },
  { id: "accuracy", label: "Accuracy", icon: TargetIcon },
  { id: "streak", label: "Streak", icon: FlameIcon },
];

// ─── Time periods ─────────────────────────────────────────────────────
const TIME_PERIODS = [
  { id: "weekly", label: "Weekly" },
  { id: "monthly", label: "Monthly" },
  { id: "alltime", label: "All Time" },
];

// ─── Component ────────────────────────────────────────────────────────
export default function LeaderboardPage() {
  const [timePeriod, setTimePeriod] = useState("weekly");
  const [activeFilter, setActiveFilter] = useState("overall");
  const [page, setPage] = useState(1);

  // Sort leaderboard based on active filter
  const sortedData = useMemo(() => {
    const data = [...leaderboardData];
    switch (activeFilter) {
      case "questions":
        data.sort((a, b) => b.questionsSolved - a.questionsSolved || b.score - a.score);
        break;
      case "accuracy":
        data.sort((a, b) => b.accuracy - a.accuracy || b.score - a.score);
        break;
      case "streak":
        data.sort((a, b) => b.streak - a.streak || b.score - a.score);
        break;
      default:
        data.sort((a, b) => b.score - a.score);
    }
    data.forEach((e, i) => (e.rank = i + 1));
    return data;
  }, [activeFilter]);

  // Pagination
  const totalPages = Math.ceil(sortedData.length / LEADERBOARD_PAGE_SIZE);
  const paginatedData = sortedData.slice(
    (page - 1) * LEADERBOARD_PAGE_SIZE,
    page * LEADERBOARD_PAGE_SIZE,
  );

  // Generate visible page numbers
  const pageNumbers = useMemo(() => {
    const pages = [];
    const maxVisible = 5;
    let start = Math.max(1, page - Math.floor(maxVisible / 2));
    let end = Math.min(totalPages, start + maxVisible - 1);
    start = Math.max(1, end - maxVisible + 1);
    for (let i = start; i <= end; i++) pages.push(i);
    return pages;
  }, [page, totalPages]);

  return (
    <div className="mx-auto w-full max-w-[var(--page-max-width)] px-6 py-10">
      {/* ════════════════════════════════════════════════════════════════
          1. PAGE HEADER
          ════════════════════════════════════════════════════════════════ */}
      <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="font-polysans text-heading-lg tracking-[-0.02em] text-graphite">
            Leaderboard
          </h1>
          <p className="mt-2 max-w-[56ch] text-15 leading-[1.5] text-steel">
            See how your practice performance compares with other users. Rankings
            are based on questions solved, accuracy, sessions completed, and
            streak consistency.
          </p>
        </div>

        {/* Time period selector */}
        <div className="shrink-0">
          <div className="relative inline-block">
            <select
              value={timePeriod}
              onChange={(e) => {
                setTimePeriod(e.target.value);
                setPage(1);
              }}
              className="h-10 cursor-pointer appearance-none rounded-lg border border-mist bg-canvas pr-10 pl-4 font-polysans text-15 tracking-[-0.02em] text-graphite focus:border-graphite focus:outline-none"
            >
              {TIME_PERIODS.map((period) => (
                <option key={period.id} value={period.id}>
                  {period.label}
                </option>
              ))}
            </select>
            <ChevronDownIcon className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate" />
          </div>
          <p className="mt-2 text-13 text-slate">{resetInfo[timePeriod]}</p>
        </div>
      </div>

      {/* ════════════════════════════════════════════════════════════════
          2. RANKING FILTERS
          ════════════════════════════════════════════════════════════════ */}
      <div className="mt-8 flex flex-wrap items-center gap-2">
        {RANKING_FILTERS.map((filter) => {
          const Icon = filter.icon;
          return (
            <button
              key={filter.id}
              type="button"
              onClick={() => {
                setActiveFilter(filter.id);
                setPage(1);
              }}
              className={`inline-flex items-center gap-2 rounded-tags border px-3 py-1 font-polysans text-13 tracking-[-0.02em] transition-colors ${
                activeFilter === filter.id
                  ? "border-graphite bg-graphite text-inverse"
                  : "border-mist bg-canvas text-slate hover:border-graphite hover:text-graphite"
              }`}
            >
              <Icon className="h-3.5 w-3.5" />
              {filter.label}
            </button>
          );
        })}
      </div>

      {/* ════════════════════════════════════════════════════════════════
          3. MAIN LEADERBOARD TABLE
          ════════════════════════════════════════════════════════════════ */}
      <div className="mt-6">
        {sortedData.length > 0 ? (
          <>
            {/* Desktop table */}
            <div className="hidden overflow-hidden rounded-2xl border border-mist bg-canvas lg:block">
              {/* Table header */}
              <div className="grid grid-cols-[60px_1fr_120px_100px_100px_80px_100px] items-center gap-4 border-b border-mist bg-fog/50 px-5 py-3">
                <span className="text-13 font-polysans text-slate">Rank</span>
                <span className="text-13 font-polysans text-slate">User</span>
                <span className="text-13 font-polysans text-slate">Questions</span>
                <span className="text-13 font-polysans text-slate">Accuracy</span>
                <span className="text-13 font-polysans text-slate">Sessions</span>
                <span className="text-13 font-polysans text-slate">Streak</span>
                <span className="text-13 font-polysans text-slate">Score</span>
              </div>

              {/* Table rows */}
              {paginatedData.map((entry) => (
                <div
                  key={entry.rank}
                  className={`group grid grid-cols-[60px_1fr_120px_100px_100px_80px_100px] items-center gap-4 border-b border-mist px-5 py-4 transition-colors last:border-b-0 hover:bg-fog/30 ${
                    entry.isCurrentUser ? "bg-ember/5" : ""
                  }`}
                >
                  {/* Rank */}
                  <div className="flex items-center">
                    {entry.rank <= 3 ? (
                      <span
                        className={`flex h-7 w-7 items-center justify-center rounded-full font-polysans text-13 ${
                          entry.rank === 1
                            ? "bg-amber-100 text-amber-700"
                            : entry.rank === 2
                              ? "bg-gray-100 text-gray-600"
                              : "bg-orange-100 text-orange-700"
                        }`}
                      >
                        {entry.rank}
                      </span>
                    ) : (
                      <span className="font-polysans text-15 text-graphite">
                        {entry.rank}
                      </span>
                    )}
                  </div>

                  {/* User */}
                  <div className="flex items-center gap-3">
                    <span
                      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full font-polysans text-13 ${entry.avatarBg} ${entry.avatarColor}`}
                    >
                      {entry.initials}
                    </span>
                    <div className="min-w-0">
                      <p className="truncate font-polysans text-15 tracking-[-0.02em] text-graphite">
                        {entry.name}
                        {entry.isCurrentUser && (
                          <span className="ml-2 inline-flex items-center rounded-tags bg-ember/10 px-2 py-0.5 font-polysans text-11 text-ember">
                            You
                          </span>
                        )}
                      </p>
                    </div>
                  </div>

                  {/* Questions Solved */}
                  <span className="font-polysans text-15 text-graphite">
                    {entry.questionsSolved}
                  </span>

                  {/* Accuracy */}
                  <span className="font-polysans text-15 text-graphite">
                    {entry.accuracy}%
                  </span>

                  {/* Sessions */}
                  <span className="font-polysans text-15 text-graphite">
                    {entry.sessions}
                  </span>

                  {/* Streak */}
                  <span className="inline-flex items-center gap-1 font-polysans text-15 text-graphite">
                    <FlameIcon className="h-3.5 w-3.5 text-ember" />
                    {entry.streak}
                  </span>

                  {/* Score */}
                  <span className="font-polysans text-15 font-medium text-graphite">
                    {entry.score.toLocaleString()}
                  </span>
                </div>
              ))}
            </div>

            {/* Mobile cards */}
            <div className="space-y-3 lg:hidden">
              {paginatedData.map((entry) => (
                <div
                  key={entry.rank}
                  className={`rounded-2xl border border-mist bg-canvas p-4 ${
                    entry.isCurrentUser ? "border-ember/30 bg-ember/5" : ""
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      {/* Rank */}
                      {entry.rank <= 3 ? (
                        <span
                          className={`flex h-8 w-8 items-center justify-center rounded-full font-polysans text-15 ${
                            entry.rank === 1
                              ? "bg-amber-100 text-amber-700"
                              : entry.rank === 2
                                ? "bg-gray-100 text-gray-600"
                                : "bg-orange-100 text-orange-700"
                          }`}
                        >
                          {entry.rank}
                        </span>
                      ) : (
                        <span className="flex h-8 w-8 items-center justify-center font-polysans text-15 text-slate">
                          {entry.rank}
                        </span>
                      )}

                      {/* Avatar + Name */}
                      <div className="flex items-center gap-3">
                        <span
                          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full font-polysans text-13 ${entry.avatarBg} ${entry.avatarColor}`}
                        >
                          {entry.initials}
                        </span>
                        <div>
                          <p className="font-polysans text-15 tracking-[-0.02em] text-graphite">
                            {entry.name}
                            {entry.isCurrentUser && (
                              <span className="ml-2 inline-flex items-center rounded-tags bg-ember/10 px-2 py-0.5 font-polysans text-11 text-ember">
                                You
                              </span>
                            )}
                          </p>
                          <div className="mt-1 flex items-center gap-3 text-13 text-slate">
                            <span>{entry.questionsSolved} Qs</span>
                            <span>{entry.accuracy}%</span>
                            <span>{entry.sessions} sessions</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Score */}
                    <div className="text-right">
                      <p className="font-polysans text-subheading tracking-[-0.02em] text-graphite">
                        {entry.score.toLocaleString()}
                      </p>
                      <p className="text-13 text-slate">Score</p>
                    </div>
                  </div>

                  {/* Streak bar */}
                  <div className="mt-3 ml-11 flex items-center gap-2 text-13">
                    <FlameIcon className="h-3.5 w-3.5 text-ember" />
                    <span className="text-steel">{entry.streak} day streak</span>
                  </div>
                </div>
              ))}
            </div>

            {/* ══════════════════════════════════════════════════════════
                5. PAGINATION
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
                  className="flex h-8 w-8 items-center justify-center rounded-lg border border-mist bg-canvas text-slate transition-colors hover:border-graphite hover:text-graphite disabled:opacity-40 disabled:hover:border-mist disabled:hover:text-slate"
                >
                  <ChevronRightIcon className="h-4 w-4" />
                </button>
              </div>
            )}

            {/* Count */}
            <p className="mt-4 text-center text-13 text-slate">
              Showing {(page - 1) * LEADERBOARD_PAGE_SIZE + 1}–
              {Math.min(page * LEADERBOARD_PAGE_SIZE, sortedData.length)} of{" "}
              {sortedData.length} users
            </p>
          </>
        ) : (
          <div className="mt-16 text-center">
            <p className="text-15 text-steel">No leaderboard data available.</p>
          </div>
        )}
      </div>

      {/* ════════════════════════════════════════════════════════════════
          4. YOUR RANK SECTION
          ════════════════════════════════════════════════════════════════ */}
      <div className="mt-8 overflow-hidden rounded-2xl border border-ember/30 bg-ember/5">
        <div className="px-6 py-4">
          <h2 className="font-polysans text-subheading tracking-[-0.02em] text-graphite">
            Your Rank
          </h2>
        </div>
        <div className="border-t border-ember/20 px-6 py-5">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            {/* Left: Rank + User */}
            <div className="flex items-center gap-4">
              <span className="font-polysans text-heading-lg tracking-[-0.02em] text-graphite">
                #{currentUserRank.rank}
              </span>
              <span
                className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full font-polysans text-15 ${currentUserRank.avatarBg} ${currentUserRank.avatarColor}`}
              >
                {currentUserRank.initials}
              </span>
              <div>
                <p className="font-polysans text-15 tracking-[-0.02em] text-graphite">
                  {currentUserRank.name}
                </p>
                <p className="mt-0.5 text-13 text-slate">Your current position</p>
              </div>
            </div>

            {/* Right: Stats */}
            <div className="flex flex-wrap items-center gap-6">
              <div className="text-center">
                <p className="font-polysans text-subheading tracking-[-0.02em] text-graphite">
                  {currentUserRank.questionsSolved}
                </p>
                <p className="text-13 text-slate">Questions</p>
              </div>
              <div className="text-center">
                <p className="font-polysans text-subheading tracking-[-0.02em] text-graphite">
                  {currentUserRank.accuracy}%
                </p>
                <p className="text-13 text-slate">Accuracy</p>
              </div>
              <div className="text-center">
                <p className="font-polysans text-subheading tracking-[-0.02em] text-graphite">
                  {currentUserRank.sessions}
                </p>
                <p className="text-13 text-slate">Sessions</p>
              </div>
              <div className="text-center">
                <p className="inline-flex items-center gap-1 font-polysans text-subheading tracking-[-0.02em] text-graphite">
                  <FlameIcon className="h-4 w-4 text-ember" />
                  {currentUserRank.streak}
                </p>
                <p className="text-13 text-slate">Streak</p>
              </div>
              <div className="ml-4 border-l border-mist pl-6">
                <p className="font-polysans text-heading tracking-[-0.02em] text-ember">
                  {currentUserRank.score.toLocaleString()}
                </p>
                <p className="text-13 text-slate">Score</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
