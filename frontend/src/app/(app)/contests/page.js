"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  ClockIcon,
  UsersIcon,
  CalendarIcon,
  ClipboardCheckIcon,
} from "@/components/ui/icons";

function InfoIcon(props) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden {...props}>
      <circle cx="12" cy="12" r="10" />
      <path d="M12 16v-4" />
      <path d="M12 8h.01" />
    </svg>
  );
}
import GoBack from "@/components/ui/GoBack";
import Button from "@/components/ui/Button";
import { upcomingContests, pastContests, PAST_PAGE_SIZE } from "@/lib/mock/contests";

// ─── Helpers ───────────────────────────────────────────────────────────
function formatDate(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-IN", { month: "short", day: "numeric", year: "numeric" });
}

function formatDay(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-IN", { weekday: "long" });
}

function timeUntil(dateStr) {
  const now = new Date();
  const target = new Date(dateStr);
  const diff = target - now;
  if (diff < 0) return null;
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  if (days > 0) return `${days}d ${hours}h`;
  if (hours > 0) return `${hours}h ${minutes}m`;
  return `${minutes}m`;
}

function formatParticipants(n) {
  if (n >= 1000) return `${(n / 1000).toFixed(1)}K+`;
  return `${n}`;
}

// ─── Component ─────────────────────────────────────────────────────────
export default function ContestsPage() {
  const [activeTab, setActiveTab] = useState("upcoming");
  const [pastPage, setPastPage] = useState(1);
  const [rulesOpen, setRulesOpen] = useState(false);

  // Past contests pagination
  const totalPastPages = Math.ceil(pastContests.length / PAST_PAGE_SIZE);
  const paginatedPast = pastContests.slice(
    (pastPage - 1) * PAST_PAGE_SIZE,
    pastPage * PAST_PAGE_SIZE
  );

  const pageNumbers = useMemo(() => {
    const pages = [];
    const maxVisible = 5;
    let start = Math.max(1, pastPage - Math.floor(maxVisible / 2));
    let end = Math.min(totalPastPages, start + maxVisible - 1);
    start = Math.max(1, end - maxVisible + 1);
    for (let i = start; i <= end; i++) pages.push(i);
    return pages;
  }, [pastPage, totalPastPages]);

  return (
    <div className="mx-auto w-full max-w-[var(--page-max-width)] px-6 py-10">
      {/* ── Go back ────────────────────────────────────────────────── */}
      <GoBack className="mb-6" />

      {/* ── Page Header ────────────────────────────────────────────── */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="font-polysans text-heading-lg tracking-[-0.02em] text-graphite">
            Contests
          </h1>
          <p className="mt-2 max-w-[56ch] text-[15px] leading-[1.5] text-steel">
            Compete with peers and improve your aptitude skills.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setRulesOpen(!rulesOpen)}
          className="inline-flex items-center gap-1.5 rounded-lg border border-mist bg-canvas px-3 py-2 text-[13px] text-graphite transition-colors hover:border-graphite"
        >
          <InfoIcon className="h-3.5 w-3.5" />
          Contest Rules
        </button>
      </div>

      {/* ── Rules panel ────────────────────────────────────────────── */}
      {rulesOpen && (
        <div className="mt-4 rounded-2xl border border-mist bg-ash p-6">
          <h3 className="font-polysans text-[18px] tracking-[-0.02em] text-graphite">
            Contest Rules
          </h3>
          <div className="mt-3 space-y-2 text-[14px] text-steel">
            <p>• All contests are timed aptitude assessments.</p>
            <p>• Questions are automatically selected from the contest topic pool.</p>
            <p>• You cannot pause or restart a contest once started.</p>
            <p>• Results are based on correct answers, with negative marking where applicable.</p>
            <p>• Rankings are determined by score, then by time taken.</p>
            <p>• Weekly contests cover all aptitude topics. Company contests focus on specific placement patterns.</p>
          </div>
        </div>
      )}

      {/* ── Tab Navigation ─────────────────────────────────────────── */}
      <div className="mt-8 flex items-center gap-1 overflow-x-auto border-b border-mist">
        {[
          { id: "upcoming", label: "Upcoming Contests" },
          { id: "past", label: "Past Contests" },
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={`shrink-0 border-b-2 px-4 py-2.5 text-[14px] font-medium transition-colors ${
              activeTab === tab.id
                ? "border-graphite text-graphite"
                : "border-transparent text-slate hover:text-graphite"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ═══════════════════════════════════════════════════════════════
          UPCOMING CONTESTS
          ═══════════════════════════════════════════════════════════════ */}
      {activeTab === "upcoming" && (
        <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Weekly Contest */}
          <ContestCard contest={upcomingContests.weekly} />

          {/* Company Contest */}
          <ContestCard contest={upcomingContests.company} />
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════
          PAST CONTESTS
          ═══════════════════════════════════════════════════════════════ */}
      {activeTab === "past" && (
        <div className="mt-8">
          {pastContests.length > 0 ? (
            <>
              {/* Desktop table */}
              <div className="hidden overflow-hidden rounded-2xl border border-mist bg-canvas lg:block">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-mist bg-fog/50">
                      <th className="px-6 py-3 text-left text-[12px] font-normal uppercase tracking-wider text-slate">Contest</th>
                      <th className="px-4 py-3 text-left text-[12px] font-normal uppercase tracking-wider text-slate">Type</th>
                      <th className="px-4 py-3 text-left text-[12px] font-normal uppercase tracking-wider text-slate">Date</th>
                      <th className="px-4 py-3 text-left text-[12px] font-normal uppercase tracking-wider text-slate">Score</th>
                      <th className="px-4 py-3 text-left text-[12px] font-normal uppercase tracking-wider text-slate">Rank</th>
                      <th className="px-4 py-3 text-left text-[12px] font-normal uppercase tracking-wider text-slate">Percentile</th>
                      <th className="px-4 py-3 text-right text-[12px] font-normal uppercase tracking-wider text-slate">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-mist">
                    {paginatedPast.map((c) => (
                      <tr key={c.id} className="transition-colors hover:bg-fog/30">
                        <td className="px-6 py-4">
                          <p className="font-polysans text-[15px] tracking-[-0.02em] text-graphite">{c.name}</p>
                        </td>
                        <td className="px-4 py-4">
                          <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium ${
                            c.type === "Weekly" ? "bg-ember/10 text-ember" : "bg-brass/10 text-brass"
                          }`}>
                            {c.type}
                          </span>
                        </td>
                        <td className="px-4 py-4 text-[13px] text-steel">{formatDate(c.date)}</td>
                        <td className="px-4 py-4">
                          <span className="font-polysans text-[15px] text-graphite">{c.score} / {c.total}</span>
                        </td>
                        <td className="px-4 py-4">
                          <span className="font-polysans text-[15px] text-graphite">#{c.rank} / {c.totalParticipants}</span>
                        </td>
                        <td className="px-4 py-4">
                          <span className="font-polysans text-[15px] text-graphite">{c.percentile}%</span>
                        </td>
                        <td className="px-4 py-4 text-right">
                          <Link
                            href={`/contests/${c.id}`}
                            className="inline-flex items-center gap-1.5 rounded-lg border border-mist bg-canvas px-3 py-1.5 text-[13px] text-graphite transition-colors hover:border-graphite hover:shadow-sm"
                          >
                            View Details
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile cards */}
              <div className="divide-y divide-mist rounded-2xl border border-mist bg-canvas lg:hidden">
                {paginatedPast.map((c) => (
                  <div key={c.id} className="px-5 py-4">
                    <div className="flex items-start justify-between">
                      <div className="min-w-0 flex-1">
                        <p className="font-polysans text-[15px] tracking-[-0.02em] text-graphite">{c.name}</p>
                        <div className="mt-1 flex items-center gap-2">
                          <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium ${
                            c.type === "Weekly" ? "bg-ember/10 text-ember" : "bg-brass/10 text-brass"
                          }`}>
                            {c.type}
                          </span>
                          <span className="text-[13px] text-slate">{formatDate(c.date)}</span>
                        </div>
                      </div>
                      <Link
                        href={`/contests/${c.id}`}
                        className="ml-3 shrink-0 text-[13px] text-ember hover:underline"
                      >
                        View
                      </Link>
                    </div>
                    <div className="mt-3 grid grid-cols-3 gap-3">
                      <div>
                        <p className="text-[11px] uppercase tracking-wider text-slate">Score</p>
                        <p className="mt-0.5 font-polysans text-[14px] text-graphite">{c.score}/{c.total}</p>
                      </div>
                      <div>
                        <p className="text-[11px] uppercase tracking-wider text-slate">Rank</p>
                        <p className="mt-0.5 font-polysans text-[14px] text-graphite">#{c.rank}</p>
                      </div>
                      <div>
                        <p className="text-[11px] uppercase tracking-wider text-slate">Percentile</p>
                        <p className="mt-0.5 font-polysans text-[14px] text-graphite">{c.percentile}%</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              {totalPastPages > 1 && (
                <div className="mt-6 flex items-center justify-center gap-2">
                  <button
                    type="button"
                    onClick={() => setPastPage((p) => Math.max(1, p - 1))}
                    disabled={pastPage === 1}
                    className="flex h-8 items-center gap-1 rounded-lg border border-mist bg-canvas px-3 text-[13px] text-slate transition-colors hover:border-graphite hover:text-graphite disabled:opacity-40"
                  >
                    <ChevronLeftIcon className="h-3.5 w-3.5" />
                    Previous
                  </button>
                  {pageNumbers.map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setPastPage(p)}
                      className={`flex h-8 w-8 items-center justify-center rounded-lg font-polysans text-[13px] transition-colors ${
                        pastPage === p
                          ? "border-graphite bg-graphite text-inverse"
                          : "border border-mist bg-canvas text-slate hover:border-graphite hover:text-graphite"
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                  <button
                    type="button"
                    onClick={() => setPastPage((p) => Math.min(totalPastPages, p + 1))}
                    disabled={pastPage === totalPastPages}
                    className="flex h-8 items-center gap-1 rounded-lg border border-mist bg-canvas px-3 text-[13px] text-slate transition-colors hover:border-graphite hover:text-graphite disabled:opacity-40"
                  >
                    Next
                    <ChevronRightIcon className="h-3.5 w-3.5" />
                  </button>
                </div>
              )}

              <p className="mt-4 text-center text-[13px] text-slate">
                Showing {(pastPage - 1) * PAST_PAGE_SIZE + 1}–
                {Math.min(pastPage * PAST_PAGE_SIZE, pastContests.length)} of {pastContests.length} contests
              </p>
            </>
          ) : (
            <div className="rounded-2xl bg-ash px-6 py-16 text-center">
              <p className="text-[15px] text-steel">No contest history yet.</p>
              <button
                type="button"
                onClick={() => setActiveTab("upcoming")}
                className="mt-3 font-polysans text-[13px] text-ember hover:underline"
              >
                Explore Upcoming Contests
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Contest Card Component ────────────────────────────────────────────
function ContestCard({ contest }) {
  const countdown = timeUntil(contest.date);

  return (
    <div className="flex flex-col rounded-2xl border border-mist bg-canvas p-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <span className="inline-flex items-center rounded-full bg-ember/10 px-2.5 py-0.5 text-[11px] font-medium text-ember">
            {contest.type}
          </span>
          <h3 className="mt-3 font-polysans text-[20px] tracking-[-0.02em] text-graphite">
            {contest.title}
          </h3>
          <p className="mt-1 text-[14px] text-steel">{contest.description}</p>
          <p className="mt-1 text-[13px] text-slate">{contest.secondaryDescription}</p>
        </div>
      </div>

      {/* Info row */}
      <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3">
        <div className="flex items-center gap-2 text-[13px] text-steel">
          <CalendarIcon className="h-3.5 w-3.5" />
          <span>{formatDate(contest.date)}</span>
        </div>
        <div className="flex items-center gap-2 text-[13px] text-steel">
          <span className="text-[13px]">{contest.day}</span>
        </div>
        <div className="flex items-center gap-2 text-[13px] text-steel">
          <ClockIcon className="h-3.5 w-3.5" />
          <span>{contest.startTime}</span>
        </div>
        <div className="flex items-center gap-2 text-[13px] text-steel">
          <ClockIcon className="h-3.5 w-3.5" />
          <span>{contest.duration} minutes</span>
        </div>
        <div className="flex items-center gap-2 text-[13px] text-steel">
          <ClipboardCheckIcon className="h-3.5 w-3.5" />
          <span>{contest.questions} Questions</span>
        </div>
        <div className="flex items-center gap-2 text-[13px] text-steel">
          <UsersIcon className="h-3.5 w-3.5" />
          <span>{formatParticipants(contest.participants)} Participants</span>
        </div>
      </div>

      {/* Countdown + Action */}
      <div className="mt-5 flex items-center justify-between border-t border-mist pt-4">
        {countdown ? (
          <div className="rounded-lg bg-ember/5 px-3 py-1.5">
            <p className="text-[13px] font-medium text-ember">
              Starts in {countdown}
            </p>
          </div>
        ) : (
          <div />
        )}

        {contest.registered ? (
          <Button variant="secondary" size="sm">
            Registered
          </Button>
        ) : (
          <Button variant="primary" size="sm">
            Register Now
          </Button>
        )}
      </div>
    </div>
  );
}
