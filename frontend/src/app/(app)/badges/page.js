import BadgeCard from "@/components/dashboard/BadgeCard";
import GoBack from "@/components/ui/GoBack";
import { badges } from "@/lib/mock/dashboard";

export default function BadgesPage() {
  const earned = badges.filter((b) => b.earned);
  const locked = badges.filter((b) => !b.earned);

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
          Track your LeetAptitude achievements.
        </p>
      </div>

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
    </div>
  );
}
