import SectionCard from "@/components/dashboard/SectionCard";
import SkillsOverview from "@/components/dashboard/SkillsOverview";
import StatCard from "@/components/dashboard/StatCard";
import { user, quickStats } from "@/lib/mock/dashboard";

export default function ProfilePage() {
  return (
    <div className="mx-auto w-full max-w-[var(--page-max-width)] px-6 py-10">
      <header>
        <h1 className="text-heading-lg text-graphite">Profile</h1>
      </header>

      <div className="mt-10 grid gap-6 lg:grid-cols-3">
        {/* User card */}
        <div className="rounded-asymmetric bg-ash p-7">
          <span className="flex h-16 w-16 items-center justify-center rounded-full bg-graphite font-polysans text-heading tracking-[-0.02em] text-inverse">
            {user.initials}
          </span>
          <p className="mt-5 font-polysans text-heading tracking-[-0.02em] text-graphite">
            {user.name}
          </p>
          <p className="mt-1 text-15 text-steel">{user.email}</p>
          <p className="mt-4 text-13 leading-[1.5] text-slate">{user.bio}</p>
          <p className="mt-4 border-t border-mist pt-4 text-13 text-slate">
            Member since {user.memberSince}
          </p>
        </div>

        {/* Stats + skills */}
        <div className="space-y-6 lg:col-span-2">
          <div className="grid grid-cols-2 gap-6">
            {quickStats.map((stat) => (
              <StatCard key={stat.id} {...stat} />
            ))}
          </div>
          <SectionCard title="Skills Overview">
            <SkillsOverview />
          </SectionCard>
        </div>
      </div>
    </div>
  );
}
