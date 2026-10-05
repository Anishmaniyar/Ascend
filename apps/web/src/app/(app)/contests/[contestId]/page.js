"use client";

import { useState, useEffect, useCallback, use } from "react";
import {
  ClockIcon,
  CalendarIcon,
  UsersIcon,
  ClipboardCheckIcon,
  TrophyIcon,
} from "@/components/ui/icons";
import GoBack from "@/components/ui/GoBack";
import Button from "@/components/ui/Button";
import {
  getContest,
  registerForContest,
  unregisterFromContest,
} from "@/lib/api/contests";

// ─── Helpers ───────────────────────────────────────────────────────────
function formatDate(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-IN", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function formatTime(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });
}

const TYPE_LABEL = { WEEKLY: "Weekly", COMPANY: "Company" };
const DIFF_LABEL = { EASY: "Easy", MEDIUM: "Medium", HARD: "Hard" };

export default function ContestDetailPage({ params }) {
  const { contestId } = use(params);
  const [contest, setContest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      setContest(await getContest(contestId));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [contestId]);

  useEffect(() => {
    load();
  }, [load]);

  const toggleRegistration = async () => {
    if (busy || !contest) return;
    setBusy(true);
    try {
      if (contest.registered) {
        await unregisterFromContest(contest.id);
      } else {
        await registerForContest(contest.id);
      }
      await load();
    } catch {
      await load();
    } finally {
      setBusy(false);
    }
  };

  if (loading) {
    return (
      <div className="mx-auto w-full max-w-[var(--page-max-width)] px-6 py-10">
        <GoBack className="mb-6" />
        <p className="text-13 text-slate">Loading contest…</p>
      </div>
    );
  }

  if (error || !contest) {
    return (
      <div className="mx-auto w-full max-w-[var(--page-max-width)] px-6 py-10">
        <GoBack className="mb-6" />
        <div className="rounded-2xl bg-ash p-6 text-13 text-steel">
          <p>
            {error ? `Couldn't load this contest: ${error}` : "Contest not found."}
          </p>
          {error && (
            <button
              type="button"
              onClick={load}
              className="mt-3 font-polysans text-graphite underline underline-offset-2 hover:text-ember"
            >
              Try again
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-[var(--page-max-width)] px-6 py-10">
      <GoBack className="mb-6" />

      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
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
            {contest.status === "ended" && (
              <span className="inline-flex items-center rounded-full bg-fog px-2.5 py-0.5 text-[11px] font-medium text-slate">
                Ended
              </span>
            )}
          </div>
          <h1 className="mt-3 font-polysans text-heading-lg tracking-[-0.02em] text-graphite">
            {contest.title}
          </h1>
          {contest.description && (
            <p className="mt-2 max-w-[56ch] text-15 leading-[1.5] text-steel">
              {contest.description}
            </p>
          )}
          {contest.company && (
            <p className="mt-1 text-13 text-slate">{contest.company}</p>
          )}
        </div>

        <div className="shrink-0">
          {contest.status === "ended" ? (
            <p className="text-13 text-slate">
              {contest.registered
                ? "You participated in this contest."
                : "Registration is closed."}
            </p>
          ) : contest.status === "live" ? (
            <p className="text-13 text-slate">
              {contest.registered
                ? "You're registered — taking goes live with the contest engine."
                : "This contest is live — registration is closed."}
            </p>
          ) : contest.registered ? (
            <Button variant="secondary" onClick={toggleRegistration}>
              {busy ? "…" : "Registered — Cancel"}
            </Button>
          ) : (
            <Button variant="primary" onClick={toggleRegistration}>
              {busy ? "…" : "Register Now"}
            </Button>
          )}
        </div>
      </div>

      {/* Info grid */}
      <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3">
        {[
          { label: "Starts", value: `${formatDate(contest.startsAt)} · ${formatTime(contest.startsAt)}`, icon: CalendarIcon },
          { label: "Ends", value: `${formatDate(contest.endsAt)} · ${formatTime(contest.endsAt)}`, icon: CalendarIcon },
          { label: "Duration", value: `${contest.durationMin} minutes`, icon: ClockIcon },
          { label: "Questions", value: contest.totalQuestions, icon: ClipboardCheckIcon },
          { label: "Participants", value: contest.participants, icon: UsersIcon },
          { label: "Difficulty", value: DIFF_LABEL[contest.difficulty] || contest.difficulty, icon: TrophyIcon },
        ].map((row) => {
          const Icon = row.icon;
          return (
            <div key={row.label} className="rounded-2xl bg-ash p-5">
              <div className="flex items-center gap-2">
                <Icon className="h-4 w-4 text-slate" />
                <span className="font-polysans text-13 tracking-[-0.02em] text-slate">
                  {row.label}
                </span>
              </div>
              <p className="mt-2 font-polysans text-subheading tracking-[-0.02em] text-graphite">
                {row.value}
              </p>
            </div>
          );
        })}
      </div>

      {/* Scoring note */}
      <div className="mt-8 rounded-2xl border border-dashed border-mist px-6 py-5">
        <p className="text-13 leading-[1.6] text-slate">
          Rankings for this contest are determined by score, then by time taken.
          Live contest-taking and per-contest leaderboards arrive with the
          contest engine — registration and scheduling are live today.
        </p>
      </div>
    </div>
  );
}
