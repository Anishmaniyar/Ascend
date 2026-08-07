import Link from "next/link";
import { ArrowRightIcon } from "@/components/ui/icons";
import WelcomeHeader from "@/components/dashboard/WelcomeHeader";
import ContinueCard from "@/components/dashboard/ContinueCard";
import DailyGoal from "@/components/dashboard/DailyGoal";
import StatCard from "@/components/dashboard/StatCard";
import SectionCard from "@/components/dashboard/SectionCard";
import SkillsOverview from "@/components/dashboard/SkillsOverview";
import CompanySheetsGrid from "@/components/dashboard/CompanySheetsGrid";
import PracticeHistoryList from "@/components/dashboard/PracticeHistoryList";
import RecentDiscussions from "@/components/dashboard/RecentDiscussions";
import RecommendedTopics from "@/components/dashboard/RecommendedTopics";
import Heatmap from "@/components/charts/Heatmap";
import { quickStats, buildHeatmap } from "@/lib/mock/dashboard";

const ViewAll = ({ href }) => (
  <Link
    href={href}
    className="inline-flex items-center gap-1 font-polysans text-13 tracking-[-0.02em] text-slate transition-colors hover:text-ember"
  >
    View all
    <ArrowRightIcon className="h-3.5 w-3.5" />
  </Link>
);

export default function DashboardPage() {
  const weeks = buildHeatmap(26);

  return (
    <div className="mx-auto w-full max-w-[var(--page-max-width)] space-y-6 px-6 py-10">
      <WelcomeHeader />

      {/* Continue practice + daily goal */}
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <ContinueCard />
        </div>
        <DailyGoal />
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-2 gap-6 xl:grid-cols-4">
        {quickStats.map((stat) => (
          <StatCard key={stat.id} {...stat} />
        ))}
      </div>

      {/* Heatmap + skills */}
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <SectionCard title="Daily Activity" action={<ViewAll href="/profile" />}>
            <Heatmap weeks={weeks} />
          </SectionCard>
        </div>
        <SectionCard title="Skills Overview" action={<ViewAll href="/profile" />}>
          <SkillsOverview />
        </SectionCard>
      </div>

      {/* Company sheets */}
      <SectionCard title="Company Sheets" action={<ViewAll href="/sheets" />}>
        <CompanySheetsGrid />
      </SectionCard>

      {/* History + discussions */}
      <div className="grid gap-6 lg:grid-cols-2">
        <SectionCard title="Practice History" action={<ViewAll href="/practice-history" />}>
          <PracticeHistoryList />
        </SectionCard>
        <SectionCard title="Recent Discussions" action={<ViewAll href="/discussions" />}>
          <RecentDiscussions />
        </SectionCard>
      </div>

      {/* Recommended weak topics */}
      <SectionCard
        title="Recommended for you"
        action={
          <span className="font-polysans text-13 tracking-[-0.02em] text-slate">
            Based on your accuracy
          </span>
        }
      >
        <RecommendedTopics />
      </SectionCard>
    </div>
  );
}
