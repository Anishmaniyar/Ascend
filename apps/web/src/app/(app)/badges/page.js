"use client";

import { useEffect, useState, useCallback } from "react";
import BadgeCard from "@/components/dashboard/BadgeCard";
import GoBack from "@/components/ui/GoBack";
import { getBadges } from "@/lib/api/profile";
import { formatDate } from "@/lib/profileView";

export default function BadgesPage() {
  const [badges, setBadges] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const rows = await getBadges();
      setBadges(
        rows.map((b) => ({
          id: b.code,
          name: b.name,
          description: b.description,
          icon: b.icon,
          earned: b.earned,
          earnedAt: b.earnedAt ? formatDate(b.earnedAt) : null,
        })),
      );
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const earned = (badges || []).filter((b) => b.earned);
  const locked = (badges || []).filter((b) => !b.earned);

  return (
    <div className="mx-auto w-full max-w-[var(--page-max-width)] px-6 py-10">
      {/* Go back */}
      <GoBack className="mb-6" />

      {/* Page header */}
      <div>
        <h1 className="font-polysans text-heading-lg tracking-[-0.02em] text-graphite">
          Badges
        </h1>
        <p className="mt-2 text-15 text-steel">
          Track your Ascend achievements.
        </p>
      </div>

      {loading ? (
        <p className="mt-10 text-13 text-slate">Loading badges…</p>
      ) : error ? (
        <div className="mt-10 rounded-2xl bg-ash p-6 text-13 text-steel">
          <p>Couldn&apos;t load badges: {error}</p>
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
          {/* Earned section */}
          {earned.length > 0 && (
            <div className="mt-10">
              <div className="flex items-center gap-4">
                <h2 className="font-polysans text-subheading tracking-[-0.02em] text-graphite">
                  Earned
                </h2>
                <span className="rounded-tags bg-ember/10 px-3 py-1 font-polysans text-13 tracking-[-0.02em] text-ember">
                  {earned.length}
                </span>
              </div>
              <div className="mt-5 grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
                {earned.map((badge) => (
                  <BadgeCard key={badge.id} badge={badge} size="lg" />
                ))}
              </div>
            </div>
          )}

          {/* Locked section */}
          {locked.length > 0 && (
            <div className="mt-12">
              <div className="flex items-center gap-4">
                <h2 className="font-polysans text-subheading tracking-[-0.02em] text-graphite">
                  Locked
                </h2>
                <span className="rounded-tags bg-mist px-3 py-1 font-polysans text-13 tracking-[-0.02em] text-slate">
                  {locked.length}
                </span>
              </div>
              <div className="mt-5 grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
                {locked.map((badge) => (
                  <BadgeCard key={badge.id} badge={badge} size="lg" />
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
