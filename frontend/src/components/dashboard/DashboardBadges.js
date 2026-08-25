import Link from "next/link";
import { ArrowRightIcon } from "@/components/ui/icons";
import BadgeCard from "@/components/dashboard/BadgeCard";
import { getDashboardBadges, badges } from "@/lib/mock/dashboard";

const MAX_DISPLAY = 3;

export default function DashboardBadges() {
  const displayBadges = getDashboardBadges(MAX_DISPLAY);
  const totalBadges = badges.length;
  const remaining = totalBadges - MAX_DISPLAY;

  return (
    <section className="rounded-2xl bg-ash p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="font-polysans text-subheading tracking-[-0.02em] text-graphite">
          Badges
        </h3>
        <Link
          href="/badges"
          className="inline-flex items-center gap-1 font-polysans text-13 tracking-[-0.02em] text-slate transition-colors hover:text-ember"
        >
          View All
          <ArrowRightIcon className="h-3.5 w-3.5" />
        </Link>
      </div>

      {/* Badge grid — 3 big cards equally spaced */}
      <div className="mt-5 grid grid-cols-3 gap-5">
        {displayBadges.map((badge) => (
          <BadgeCard key={badge.id} badge={badge} size="sm" />
        ))}
      </div>

      {/* More badges indicator */}
      {remaining > 0 && (
        <Link
          href="/badges"
          className="mt-4 flex items-center justify-center gap-1.5 rounded-xl border border-dashed border-mist py-2.5 text-13 text-slate transition-colors hover:border-ember hover:text-ember"
        >
          <span className="font-polysans">{remaining} more badges</span>
          <ArrowRightIcon className="h-3.5 w-3.5" />
        </Link>
      )}
    </section>
  );
}
