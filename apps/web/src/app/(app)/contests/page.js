"use client";

import { useState, useEffect, useCallback, use } from "react";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  ClockIcon,
  UsersIcon,
  CalendarIcon,
  ClipboardCheckIcon,
} from "@/components/ui/icons";
import GoBack from "@/components/ui/GoBack";
import Button from "@/components/ui/Button";
import { getContests, registerForContest, unregisterFromContest } from "@/lib/api/contests";

// ─── Helpers ───────────────────────────────────────────────────────────
function formatDate(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-IN", { month: "short", day: "numeric", year: "numeric" });
}

function formatDay(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-IN", { weekday: "long" });
}

function formatTime(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });
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

const PAST_PAGE_SIZE = 8;
const TYPE_LABEL = { WEEKLY: "Weekly", COMPANY: "Company" };

// ─── Component ─────────────────────────────────────────────────────────
export default function ContestsPage() {
  const [activeTab, setActiveTab] = useState("upcoming");
  const [pastPage, setPastPage] = useState(1);
  const [rulesOpen, setRulesOpen] = useState(false);
  const [contests, setContests] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [busyId, setBusyId] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      setContests(await getContests());
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const toggleRegistration = async (contest) => {
    if (busyId) return;
    setBusyId(contest.id);
    try {
      if (contest.registered) {
        await unregisterFromContest(contest.id);
      } else {
        await registerForContest(contest.id);
      }
      setContests((prev) =>
        (prev || []).map((c) =>
          c.id === contest.id
            ? {
                ...c,
                registered: !c.registered,
                participants: c.participants + (c.registered ? -1 : 1),
              }
            : c,
        ),
      );
    } catch {
      // Banner-free: reload to reconcile state.
      load();
    } finally {
      setBusyId(null);
    }
  };

  const upcoming = (contests || []).filter((c) => c.status !== "ended");
  const past = (contests || []).filter((c) => c.status === "ended");

  // Past contests pagination
  const totalPastPages = Math.ceil(past.length / PAST_PAGE_SIZE);
  const paginatedPast = past.slice(
    (pastPage - 1) * PAST_PAGE_SIZE,
    pastPage * PAST_PAGE_SIZE
  );

  const pageNumbers = (() => {
    const pages = [];
    const maxVisible = 5;
    let start = Math.max(1, pastPage - Math.floor(maxVisible / 2));
    let end = Math.min(totalPastPages, start + maxVisible - 1);
    start = Math.max(1, end - maxVisible + 1);
    for (let i = start; i <= end; i++) pages.push(i);
    return pages;
  })();

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
            <p>• Register before the start time to take part.</p>
            <p>• You cannot pause or restart a contest once started.</p>
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

      {loading ? (
        <p className="mt-8 text-13 text-slate">Loading contests…</p>
      ) : error ? (
        <div className="mt-8 rounded-2xl bg-ash p-6 text-13 text-steel">
          <p>Couldn&apos;t load contests: {error}</p>
          <button
            type="button"
            onClick={load}
            className="mt-3 font-polysans text-graphite underline underline-offset-2 hover:text-ember"
          >
            Try again
          </button>
        </div>
      ) : (
        <>
          {/* UPCOMING CONTESTS */}
          {activeTab === "upcoming" && (
            <div className="mt-8">
              {upcoming.length > 0 ? (
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                  {upcoming.map((contest) => (
                    <ContestCard
                      key={contest.id}
                      contest={contest}
                      busy={busyId === contest.id}
                      onToggle={() => toggleRegistration(contest)}
                    />
                  ))}
                </div>
              ) : (
                <div className="rounded-2xl bg-ash px-6 py-16 text-center">
                  <p className="text-[15px] text-steel">
                    No upcoming contests right now — check back soon.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* PAST CONTESTS */}
          {activeTab === "past" && (
            <div className="mt-8">
              {past.length > 0 ? (
                <>
                  {/* Desktop table */}
                  <div className="hidden overflow-hidden rounded-2xl border border-mist bg-canvas lg:block">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-mist bg-fog/50">
                          <th className="px-6 py-3 text-left text-[12px] font-normal uppercase tracking-wider text-slate">Contest</th>
                          <th className="px-4 py-3 text-left text-[12px] font-normal uppercase tracking-wider text-slate">Type</th>
                          <th className="px-4 py-3 text-left text-[12px] font-normal uppercase tracking-wider text-slate">Date</th>
                          <th className="px-4 py-3 text-left text-[12px] font-normal uppercase tracking-wider text-slate">Participants</th>
                          <th className="px-4 py-3 text-left text-[12px] font-normal uppercase tracking-wider text-slate">Status</th>
                          <th className="px-4 py-3 text-right text-[12px] font-normal uppercase tracking-wider text-slate">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-mist">
                        {paginatedPast.map((c) => (
                          <tr key={c.id} className="transition-colors hover:bg-fog/30">
                            <td className="px-6 py-4">
                              <p className="font-polysans text-[15px] tracking-[-0.02em] text-graphite">{c.title}</p>
                              {c.company && (
                                <p className="mt-0.5 text-[13px] text-slate">{c.company}</p>
                              )}
                            </td>
                            <td className="px-4 py-4">
                              <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium ${
                                c.type === "WEEKLY" ? "bg-ember/10 text-ember" : "bg-brass/10 text-brass"
                              }`}>
                                {TYPE_LABEL[c.type] || c.type}
                              </span>
                            </td>
                            <td className="px-4 py-4 text-[13px] text-steel">{formatDate(c.endsAt)}</td>
                            <td className="px-4 py-4">
                              <span className="font-polysans text-[15px] text-graphite">{formatParticipants(c.participants)}</span>
                            </td>
                            <td className="px-4 py-4">
                              <span className="font-polysans text-[15px] text-slate">
                                {c.registered ? "Participated" : "Ended"}
                              </span>
                            </td>
                            <td className="px-4 py-4 text-right">
                              <Button
                                render={<a href={`/contests/${c.id}`} />}
                                variant="secondary"
                                size="sm"
                              >
                                View Details
                              </Button>
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
                            <p className="font-polysans text-[15px] tracking-[-0.02em] text-graphite">{c.title}</p>
                            <div className="mt-1 flex items-center gap-2">
                              <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium ${
                                c.type === "WEEKLY" ? "bg-ember/10 text-ember" : "bg-brass/10 text-brass"
                              }`}>
                                {TYPE_LABEL[c.type] || c.type}
                              </span>
                              <span className="text-[13px] text-slate">{formatDate(c.endsAt)}</span>
                            </div>
                          </div>
                          <a
                            href={`/contests/${c.id}`}
                            className="ml-3 shrink-0 text-[13px] text-ember hover:underline"
                          >
                            View
                          </a>
                        </div>
                        <div className="mt-3 grid grid-cols-2 gap-3">
                          <div>
                            <p className="text-[11px] uppercase tracking-wider text-slate">Participants</p>
                            <p className="mt-0.5 font-polysans text-[14px] text-graphite">{formatParticipants(c.participants)}</p>
                          </div>
                          <div>
                            <p className="text-[11px] uppercase tracking-wider text-slate">Status</p>
                            <p className="mt-0.5 font-polysans text-[14px] text-graphite">
                              {c.registered ? "Participated" : "Ended"}
                            </p>
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
                    {Math.min(pastPage * PAST_PAGE_SIZE, past.length)} of {past.length} contests
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
        </>
      )}
    </div>
  );
}

// ─── Contest Card Component ────────────────────────────────────────────
function ContestCard({ contest, busy, onToggle }) {
  const countdown = contest.status === "upcoming" ? timeUntil(contest.startsAt) : null;

  return (
    <div className="flex flex-col rounded-2xl border border-mist bg-canvas p-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center rounded-full bg-ember/10 px-2.5 py-0.5 text-[11px] font-medium text-ember">
              {TYPE_LABEL[contest.type] || contest.type}
            </span>
            {contest.status === "live" && (
              <span className="inline-flex items-center rounded-full bg-success/10 px-2.5 py-0.5 text-[11px] font-medium text-success">
                Live now
              </span>
            )}
          </div>
          <h3 className="mt-3 font-polysans text-[20px] tracking-[-0.02em] text-graphite">
            {contest.title}
          </h3>
          {contest.description && (
            <p className="mt-1 text-[14px] text-steel">{contest.description}</p>
          )}
          {contest.company && (
            <p className="mt-1 text-[13px] text-slate">{contest.company}</p>
          )}
        </div>
      </div>

      {/* Info row */}
      <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3">
        <div className="flex items-center gap-2 text-[13px] text-steel">
          <CalendarIcon className="h-3.5 w-3.5" />
          <span>{formatDate(contest.startsAt)}</span>
        </div>
        <div className="flex items-center gap-2 text-[13px] text-steel">
          <span className="text-[13px]">{formatDay(contest.startsAt)}</span>
        </div>
        <div className="flex items-center gap-2 text-[13px] text-steel">
          <ClockIcon className="h-3.5 w-3.5" />
          <span>{formatTime(contest.startsAt)}</span>
        </div>
        <div className="flex items-center gap-2 text-[13px] text-steel">
          <ClockIcon className="h-3.5 w-3.5" />
          <span>{contest.durationMin} minutes</span>
        </div>
        <div className="flex items-center gap-2 text-[13px] text-steel">
          <ClipboardCheckIcon className="h-3.5 w-3.5" />
          <span>{contest.totalQuestions} Questions</span>
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

        {contest.status === "live" ? (
          <p className="text-[13px] text-steel">
            {contest.registered
              ? "You're in — taking goes live with the contest engine."
              : "Registration is closed while live."}
          </p>
        ) : contest.registered ? (
          <Button variant="secondary" size="sm" onClick={onToggle}>
            {busy ? "…" : "Registered — Cancel"}
          </Button>
        ) : (
          <Button variant="primary" size="sm" onClick={onToggle}>
            {busy ? "…" : "Register Now"}
          </Button>
        )}
      </div>
    </div>
  );
}
