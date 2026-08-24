"use client";

import { useState, useMemo } from "react";
import {
  ClockIcon,
  UsersIcon,
  TrophyIcon,
  PlayIcon,
  RotateCcwIcon,
  FlameIcon,
} from "@/components/ui/icons";
import {
  contests,
  CONTEST_TYPES,
  CONTEST_STATUS,
  STATUS_COLORS,
  STATUS_DOT_COLORS,
  DIFF_COLORS,
  DIFF_DOT_COLORS,
  userContests,
} from "@/lib/mock/contests";
import Button from "@/components/ui/Button";

// ─── Helper: format date ──────────────────────────────────────────────
function formatDate(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-IN", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

// ─── Helper: time until contest ───────────────────────────────────────
function timeUntil(dateStr) {
  const now = new Date();
  const target = new Date(dateStr);
  const diff = target - now;
  if (diff < 0) return null;
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  if (days > 0) return `${days}d ${hours}h`;
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  return `${hours}h ${minutes}m`;
}

// ─── Component ────────────────────────────────────────────────────────
export default function ContestsPage() {
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    let list = contests;

    if (typeFilter !== "all") {
      list = list.filter((c) => c.type === typeFilter);
    }
    if (statusFilter !== "all") {
      list = list.filter((c) => c.status === statusFilter);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (c) =>
          c.title.toLowerCase().includes(q) ||
          c.description.toLowerCase().includes(q) ||
          c.tags.some((t) => t.toLowerCase().includes(q)),
      );
    }

    // Sort: live first, then upcoming, then completed
    const statusOrder = { live: 0, upcoming: 1, completed: 2 };
    list = [...list].sort(
      (a, b) => statusOrder[a.status] - statusOrder[b.status],
    );

    return list;
  }, [typeFilter, statusFilter, search]);

  const clearAll = () => {
    setTypeFilter("all");
    setStatusFilter("all");
    setSearch("");
  };

  const hasActiveFilters =
    typeFilter !== "all" || statusFilter !== "all" || search;

  // Stats
  const stats = useMemo(() => {
    const live = contests.filter((c) => c.status === "live").length;
    const upcoming = contests.filter((c) => c.status === "upcoming").length;
    const participated = userContests.participated.length;
    const avgScore =
      userContests.participated.length > 0
        ? Math.round(
            userContests.participated.reduce((sum, id) => {
              const r = userContests.results[id];
              return sum + (r ? r.accuracy : 0);
            }, 0) / userContests.participated.length,
          )
        : 0;
    return { live, upcoming, participated, avgScore };
  }, []);

  return (
    <div className="mx-auto w-full max-w-[var(--page-max-width)] px-6 py-10">
      {/* ════════════════════════════════════════════════════════════════
          1. PAGE HEADER
          ════════════════════════════════════════════════════════════════ */}
      <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="font-polysans text-heading-lg tracking-[-0.02em] text-graphite">
            Contests
          </h1>
          <p className="mt-2 max-w-[56ch] text-15 leading-[1.5] text-steel">
            Compete in timed aptitude contests, test your speed, and earn
            recognition. Join live contests or prepare for upcoming ones.
          </p>
        </div>

        {/* How it works */}
        <div className="shrink-0 rounded-2xl border border-mist bg-canvas p-5 sm:w-64">
          <p className="font-polysans text-15 tracking-[-0.02em] text-graphite">
            How contests work
          </p>
          <div className="mt-3 space-y-2">
            {[
              "Join a contest",
              "Solve questions under time limit",
              "Compete on the leaderboard",
              "Earn badges & recognition",
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
          2. CONTEST STATISTICS
          ════════════════════════════════════════════════════════════════ */}
      <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div className="rounded-2xl border border-mist bg-canvas p-5">
          <div className="flex items-center gap-2.5">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-success/10">
              <PlayIcon className="h-4 w-4 text-success" />
            </span>
            <div>
              <p className="font-polysans text-subheading tracking-[-0.02em] text-graphite">
                {stats.live}
              </p>
              <p className="text-13 text-slate">Live Now</p>
            </div>
          </div>
          <p className="mt-2 text-13 text-slate">Contests in progress</p>
        </div>

        <div className="rounded-2xl border border-mist bg-canvas p-5">
          <div className="flex items-center gap-2.5">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brass/10">
              <ClockIcon className="h-4 w-4 text-brass" />
            </span>
            <div>
              <p className="font-polysans text-subheading tracking-[-0.02em] text-graphite">
                {stats.upcoming}
              </p>
              <p className="text-13 text-slate">Upcoming</p>
            </div>
          </div>
          <p className="mt-2 text-13 text-slate">Starting soon</p>
        </div>

        <div className="rounded-2xl border border-mist bg-canvas p-5">
          <div className="flex items-center gap-2.5">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-ember/10">
              <TrophyIcon className="h-4 w-4 text-ember" />
            </span>
            <div>
              <p className="font-polysans text-subheading tracking-[-0.02em] text-graphite">
                {stats.participated}
              </p>
              <p className="text-13 text-slate">Participated</p>
            </div>
          </div>
          <p className="mt-2 text-13 text-slate">Total contests</p>
        </div>

        <div className="rounded-2xl border border-mist bg-canvas p-5">
          <div className="flex items-center gap-2.5">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-graphite/10">
              <FlameIcon className="h-4 w-4 text-graphite" />
            </span>
            <div>
              <p className="font-polysans text-subheading tracking-[-0.02em] text-graphite">
                {stats.avgScore}%
              </p>
              <p className="text-13 text-slate">Avg. Accuracy</p>
            </div>
          </div>
          <p className="mt-2 text-13 text-slate">Across contests</p>
        </div>
      </div>

      {/* ════════════════════════════════════════════════════════════════
          3. FILTERS
          ════════════════════════════════════════════════════════════════ */}
      <div className="mt-8 flex flex-wrap items-center gap-3">
        {/* Search */}
        <div className="relative min-w-[200px] flex-1">
          <svg
            className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.3-4.3" />
          </svg>
          <input
            type="text"
            placeholder="Search contests..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-9 w-full rounded-lg border border-mist bg-canvas pl-9 pr-3 text-13 text-graphite placeholder:text-slate focus:border-graphite focus:outline-none"
          />
        </div>

        {/* Type filter */}
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="h-9 cursor-pointer rounded-lg border border-mist bg-canvas px-3 text-13 text-graphite focus:border-graphite focus:outline-none"
        >
          {CONTEST_TYPES.map((opt) => (
            <option key={opt.id} value={opt.id}>
              {opt.label}
            </option>
          ))}
        </select>

        {/* Status filter */}
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="h-9 cursor-pointer rounded-lg border border-mist bg-canvas px-3 text-13 text-graphite focus:border-graphite focus:outline-none"
        >
          {CONTEST_STATUS.map((opt) => (
            <option key={opt.id} value={opt.id}>
              {opt.label}
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
          4. CONTEST LIST
          ════════════════════════════════════════════════════════════════ */}
      <div className="mt-6">
        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((contest) => {
              const isParticipated = userContests.participated.includes(
                contest.id,
              );
              const result = userContests.results[contest.id];
              const countdown = contest.status === "upcoming" ? timeUntil(contest.startDate) : null;

              return (
                <div
                  key={contest.id}
                  className={`group flex flex-col rounded-2xl border bg-canvas p-5 transition-all hover:shadow-sm ${
                    contest.status === "live"
                      ? "border-success/30 hover:border-success"
                      : "border-mist hover:border-graphite"
                  }`}
                >
                  {/* Header: Status + Type */}
                  <div className="flex items-center justify-between">
                    <span
                      className={`inline-flex items-center gap-1.5 rounded-tags px-2.5 py-0.5 font-polysans text-13 tracking-[-0.02em] ${STATUS_COLORS[contest.status]}`}
                    >
                      <span
                        className={`h-1.5 w-1.5 rounded-full ${STATUS_DOT_COLORS[contest.status]}`}
                      />
                      {contest.status === "live"
                        ? "Live"
                        : contest.status === "upcoming"
                          ? "Upcoming"
                          : "Completed"}
                    </span>
                    <span
                      className={`inline-flex items-center gap-1 rounded-tags px-2 py-0.5 font-polysans text-13 tracking-[-0.02em] ${DIFF_COLORS[contest.difficulty]}`}
                    >
                      <span
                        className={`h-1.5 w-1.5 rounded-full ${DIFF_DOT_COLORS[contest.difficulty]}`}
                      />
                      {contest.difficulty}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="mt-3 font-polysans text-15 tracking-[-0.02em] text-graphite">
                    {contest.title}
                  </h3>
                  <p className="mt-1 text-13 leading-[1.4] text-steel line-clamp-2">
                    {contest.description}
                  </p>

                  {/* Tags */}
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {contest.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-tags bg-fog px-2 py-0.5 text-11 text-slate"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Stats */}
                  <div className="mt-4 flex items-center gap-4 text-13 text-slate">
                    <span className="inline-flex items-center gap-1">
                      <ClockIcon className="h-3 w-3" />
                      {contest.duration} min
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <svg
                        className="h-3 w-3"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
                        <rect width="8" height="4" x="8" y="2" rx="1" ry="1" />
                      </svg>
                      {contest.questions} Questions
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <UsersIcon className="h-3 w-3" />
                      {contest.participants}/{contest.maxParticipants}
                    </span>
                  </div>

                  {/* Prize */}
                  {contest.prize && (
                    <p className="mt-2 text-13 text-brass">
                      🏆 {contest.prize}
                    </p>
                  )}

                  {/* Countdown for upcoming */}
                  {countdown && (
                    <div className="mt-3 rounded-lg bg-ember/5 px-3 py-2">
                      <p className="text-13 text-ember">
                        Starts in {countdown}
                      </p>
                    </div>
                  )}

                  {/* User result for completed */}
                  {isParticipated && result && contest.status === "completed" && (
                    <div className="mt-3 rounded-lg bg-fog px-3 py-2">
                      <div className="flex items-center justify-between text-13">
                        <span className="text-slate">Your Result</span>
                        <span className="font-polysans text-graphite">
                          Rank #{result.rank}
                        </span>
                      </div>
                      <div className="mt-1 flex items-center gap-3 text-13 text-steel">
                        <span>{result.score}/{contest.questions}</span>
                        <span>{result.accuracy}%</span>
                        <span>{result.time}</span>
                      </div>
                    </div>
                  )}

                  {/* Action button */}
                  <div className="mt-auto pt-4">
                    {contest.status === "live" && (
                      <Button variant="primary" size="sm" className="w-full bg-success hover:brightness-110">
                        <PlayIcon className="h-3.5 w-3.5" />
                        Join Now
                      </Button>
                    )}
                    {contest.status === "upcoming" && (
                      <Button variant="primary" size="sm" className="w-full">
                        Register
                      </Button>
                    )}
                    {contest.status === "completed" && !isParticipated && (
                      <Button variant="secondary" size="sm" className="w-full">
                        View Results
                      </Button>
                    )}
                    {contest.status === "completed" && isParticipated && (
                      <Button variant="secondary" size="sm" className="w-full">
                        <RotateCcwIcon className="h-3.5 w-3.5" />
                        Review
                      </Button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="mt-16 text-center">
            <p className="text-15 text-steel">
              {hasActiveFilters
                ? "No contests match your filters."
                : "No contests available yet."}
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

      {/* ════════════════════════════════════════════════════════════════
          5. YOUR CONTEST HISTORY
          ════════════════════════════════════════════════════════════════ */}
      {userContests.participated.length > 0 && (
        <div className="mt-10">
          <h2 className="font-polysans text-subheading tracking-[-0.02em] text-graphite">
            Your Contest History
          </h2>

          {/* Desktop table */}
          <div className="mt-4 hidden overflow-hidden rounded-2xl border border-mist bg-canvas lg:block">
            <div className="grid grid-cols-[1fr_80px_100px_80px_100px_90px] items-center gap-4 border-b border-mist bg-fog/50 px-5 py-3">
              <span className="text-13 font-polysans text-slate">Contest</span>
              <span className="text-13 font-polysans text-slate">Rank</span>
              <span className="text-13 font-polysans text-slate">Score</span>
              <span className="text-13 font-polysans text-slate">Accuracy</span>
              <span className="text-13 font-polysans text-slate">Time</span>
              <span className="text-13 font-polysans text-slate">Action</span>
            </div>
            {userContests.participated.map((contestId) => {
              const contest = contests.find((c) => c.id === contestId);
              const result = userContests.results[contestId];
              if (!contest || !result) return null;
              return (
                <div
                  key={contestId}
                  className="grid grid-cols-[1fr_80px_100px_80px_100px_90px] items-center gap-4 border-b border-mist px-5 py-4 transition-colors last:border-b-0 hover:bg-fog/30"
                >
                  <div className="min-w-0">
                    <p className="truncate font-polysans text-15 tracking-[-0.02em] text-graphite">
                      {contest.title}
                    </p>
                    <p className="mt-0.5 text-13 text-slate">
                      {formatDate(contest.startDate)}
                    </p>
                  </div>
                  <span className="font-polysans text-15 text-graphite">
                    #{result.rank}
                  </span>
                  <span className="font-polysans text-15 text-graphite">
                    {result.score}/{contest.questions}
                  </span>
                  <span className="font-polysans text-15 text-graphite">
                    {result.accuracy}%
                  </span>
                  <span className="text-13 text-steel">{result.time}</span>
                  <Button variant="secondary" size="sm">
                    <RotateCcwIcon className="h-3.5 w-3.5" />
                    Review
                  </Button>
                </div>
              );
            })}
          </div>

          {/* Mobile cards */}
          <div className="mt-4 space-y-3 lg:hidden">
            {userContests.participated.map((contestId) => {
              const contest = contests.find((c) => c.id === contestId);
              const result = userContests.results[contestId];
              if (!contest || !result) return null;
              return (
                <div
                  key={contestId}
                  className="rounded-2xl border border-mist bg-canvas p-4"
                >
                  <div className="flex items-start justify-between">
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-polysans text-15 tracking-[-0.02em] text-graphite">
                        {contest.title}
                      </p>
                      <p className="mt-0.5 text-13 text-slate">
                        {formatDate(contest.startDate)}
                      </p>
                    </div>
                    <span className="ml-3 shrink-0 font-polysans text-subheading tracking-[-0.02em] text-graphite">
                      #{result.rank}
                    </span>
                  </div>
                  <div className="mt-3 flex items-center gap-4 text-13 text-steel">
                    <span>
                      {result.score}/{contest.questions}
                    </span>
                    <span>{result.accuracy}%</span>
                    <span>{result.time}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
