import Link from "next/link";
import { ArrowRightIcon } from "@/components/ui/icons";
import BadgeCard from "@/components/dashboard/BadgeCard";
import { getDashboardBadges } from "@/lib/mock/dashboard";

export default function DashboardBadges() {
  const displayBadges = getDashboardBadges(3);

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

      {/* Badge grid — 3 cards */}
      <div className="mt-5 grid grid-cols-3 gap-4">
        {displayBadges.map((badge) => (
          <BadgeCard key={badge.id} badge={badge} size="sm" />
        ))}
      </div>
    </section>
  );
}
