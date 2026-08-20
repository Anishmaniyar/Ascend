import Link from "next/link";
import { ArrowRightIcon, FlameIcon, CalendarIcon, AwardIcon } from "@/components/ui/icons";
import { streakData } from "@/lib/mock/dashboard";

export default function StreakCard() {
  const { currentStreak, longestStreak, totalActiveDays, badgesEarned, recentBadge, badges } =
    streakData;

  return (
    <section className="rounded-2xl bg-ash p-6">
      <h3 className="font-polysans text-subheading tracking-[-0.02em] text-graphite">
        Streak & Badges
      </h3>

      {/* Current streak — hero */}
      <div className="mt-5 flex items-center gap-3">
        <FlameIcon className="h-8 w-8 text-ember" />
        <div>
          <p className="font-polysans text-heading-lg tracking-[-0.02em] text-graphite">
            {currentStreak} <span className="text-heading text-steel">Days</span>
          </p>
          <p className="text-13 text-slate">Current Streak</p>
        </div>
      </div>

      {/* Secondary stats */}
      <div className="mt-5 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FlameIcon className="h-4 w-4 text-slate" />
            <span className="text-15 text-steel">Longest Streak</span>
          </div>
          <span className="font-polysans text-15 tracking-[-0.02em] text-graphite">
            {longestStreak} Days
          </span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CalendarIcon className="h-4 w-4 text-slate" />
            <span className="text-15 text-steel">Active Days</span>
          </div>
          <span className="font-polysans text-15 tracking-[-0.02em] text-graphite">
            {totalActiveDays}
          </span>
        </div>
      </div>

      {/* Badges section */}
      <div className="mt-5 border-t border-mist pt-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AwardIcon className="h-4 w-4 text-ember" />
            <span className="font-polysans text-15 tracking-[-0.02em] text-graphite">
              {badgesEarned} Badges
            </span>
          </div>
          <Link
            href="/profile"
            className="inline-flex items-center gap-1 text-13 text-slate transition-colors hover:text-ember"
          >
            View all
            <ArrowRightIcon className="h-3.5 w-3.5" />
          </Link>
        </div>

        {/* Recent badge */}
        {recentBadge && (
          <div className="mt-3 flex items-center gap-2">
            <span className="text-lg">{recentBadge.emoji}</span>
            <span className="text-15 text-steel">{recentBadge.name}</span>
          </div>
        )}

        {/* Badge icons row */}
        <div className="mt-3 flex gap-2">
          {badges.map((badge) => (
            <span
              key={badge.name}
              title={badge.name}
              className="flex h-8 w-8 items-center justify-center rounded-full bg-fog text-sm"
            >
              {badge.emoji}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
