import Link from "next/link";
import {
  ArrowRightIcon,
  LockIcon,
  FootprintIcon,
  TargetIcon,
  ZapIcon,
  BrainIcon,
  FlameIcon,
  TrophyIcon,
  ClipboardCheckIcon,
  CrownIcon,
} from "@/components/ui/icons";
import SectionCard from "@/components/dashboard/SectionCard";
import ContinueCard from "@/components/dashboard/ContinueCard";
import DonutMetricCard from "@/components/dashboard/DonutMetricCard";
import PracticeHistoryList from "@/components/dashboard/PracticeHistoryList";
import RecommendedTopics from "@/components/dashboard/RecommendedTopics";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import Heatmap from "@/components/charts/Heatmap";
import { buildHeatmap, heatmapStats, performanceSummary, getDashboardBadges, continueSession } from "@/lib/mock/dashboard";
import { user } from "@/lib/mock/dashboard";

const BADGE_ICON_MAP = {
  FootprintIcon,
  TargetIcon,
  ZapIcon,
  BrainIcon,
  FlameIcon,
  TrophyIcon,
  ClipboardCheckIcon,
  CrownIcon,
};

const ViewAll = ({ href }) => (
  <Link
    href={href}
    className="inline-flex items-center gap-1 font-inter text-[12px] text-slate transition-colors hover:text-graphite"
  >
    View all
    <ArrowRightIcon className="h-3.5 w-3.5" />
  </Link>
);

export default function DashboardPage() {
  const weeks = buildHeatmap(52);
  const {
    questionsSolved,
    totalSessions,
    overallAccuracy,
    easy,
    medium,
    hard,
    practiceSessions,
    testSessions,
  } = performanceSummary;

  return (
    <div className="page-enter mx-auto w-full max-w-[var(--page-max-width)] px-6 py-12 md:py-16">
      {/* Welcome / current goal */}
      <div className="max-w-[640px]">
        <p className="font-inter text-[11px] uppercase tracking-[0.08em] text-slate">
          Dashboard
        </p>
        <h1 className="editorial-heading mt-3 text-[32px] leading-[36px] text-graphite">
          Welcome back{user.name ? `, ${user.name.split(" ")[0]}` : ""}.
        </h1>
        <p className="mt-2.5 font-inter text-[14px] leading-[22px] text-steel">
          {continueSession.subtopic} is waiting — {continueSession.done} of{" "}
          {continueSession.total} questions done.
        </p>
      </div>

      <div className="mt-10 flex flex-col gap-8 lg:flex-row">
        {/* ── Sidebar ───────────────────────────────────────────────── */}
        <DashboardSidebar />

        {/* ── Main content ──────────────────────────────────────────── */}
        <div className="min-w-0 flex-1 space-y-6">
          {/* 1. Resume Practice + Badges — side by side */}
          <div className="flex flex-col gap-6 lg:flex-row">
            <ContinueCard />

            {/* Compact Badges — fills remaining space */}
            <Link
              href="/badges"
              className="flex flex-1 items-center gap-4 rounded-cards border border-mist bg-canvas px-5 py-4 transition-colors duration-150 hover:border-mist-strong"
            >
              <div className="flex -space-x-2">
                {getDashboardBadges(3).map((badge) => {
                  const Icon = BADGE_ICON_MAP[badge.icon] ?? TargetIcon;
                  return (
                    <div
                      key={badge.id}
                      className={`flex h-10 w-10 items-center justify-center rounded-full border-2 border-canvas ${
                        badge.earned ? "bg-ash" : "bg-fog"
                      }`}
                    >
                      {badge.earned ? (
                        <Icon className="h-5 w-5 text-graphite" />
                      ) : (
                        <LockIcon className="h-4 w-4 text-slate" />
                      )}
                    </div>
                  );
                })}
              </div>
              <div className="min-w-0">
                <p className="font-polysans text-15 tracking-[-0.02em] text-graphite">
                  Badges
                </p>
                <p className="mt-0.5 text-13 text-slate">
                  {getDashboardBadges(10).filter((b) => b.earned).length} earned
                </p>
              </div>
              <ArrowRightIcon className="ml-auto h-4 w-4 shrink-0 text-slate" />
            </Link>
          </div>

          {/* 2. Practice Statistics — full width horizontal row */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            {/* Questions Solved — 3 segments: Easy / Medium / Hard */}
            <DonutMetricCard
              label="Questions Solved"
              centerText={questionsSolved}
              centerLabel="Solved"
              segments={[
                { value: easy.solved, color: "var(--color-graphite)", label: "Easy" },
                { value: medium.solved, color: "var(--color-slate)", label: "Medium" },
                { value: hard.solved, color: "var(--color-faint)", label: "Hard" },
              ]}
              details={[
                { label: "Easy", value: easy.solved, color: "var(--color-graphite)", percent: Math.round((easy.solved / easy.total) * 100), subtext: "/ " + easy.total },
                { label: "Medium", value: medium.solved, color: "var(--color-slate)", percent: Math.round((medium.solved / medium.total) * 100), subtext: "/ " + medium.total },
                { label: "Hard", value: hard.solved, color: "var(--color-faint)", percent: Math.round((hard.solved / hard.total) * 100), subtext: "/ " + hard.total },
              ]}
            />

            {/* Accuracy — 2 segments: Correct / Mistakes */}
            <DonutMetricCard
              label="Accuracy"
              centerText={`${overallAccuracy}%`}
              centerLabel="Accuracy"
              segments={[
                { value: overallAccuracy, color: "var(--color-graphite)", label: "Correct" },
                { value: 100 - overallAccuracy, color: "var(--color-mist-strong)", label: "Mistakes" },
              ]}
              details={[
                { label: "Correct answers", value: Math.round((overallAccuracy / 100) * questionsSolved), color: "var(--color-graphite)", percent: overallAccuracy },
                { label: "Incorrect / Skipped", value: questionsSolved - Math.round((overallAccuracy / 100) * questionsSolved), color: "var(--color-mist-strong)", percent: 100 - overallAccuracy },
              ]}
            />

            {/* Sessions — 2 segments: Practice / Completed */}
            <DonutMetricCard
              label="Sessions"
              centerText={totalSessions}
              centerLabel="Total"
              segments={[
                { value: practiceSessions, color: "var(--color-graphite)", label: "Practice" },
                { value: testSessions, color: "var(--color-slate)", label: "Test" },
              ]}
              details={[
                { label: "Practice sessions", value: practiceSessions, color: "var(--color-graphite)", percent: Math.round((practiceSessions / totalSessions) * 100), subtext: Math.round((practiceSessions / totalSessions) * 100) + "%" },
                { label: "Test sessions", value: testSessions, color: "var(--color-slate)", percent: Math.round((testSessions / totalSessions) * 100), subtext: Math.round((testSessions / totalSessions) * 100) + "%" },
              ]}
            />
          </div>

          {/* 3. Activity Heatmap — full width with stats */}
          <SectionCard title="Activity">
            <Heatmap weeks={weeks} stats={heatmapStats} />
          </SectionCard>

          {/* 4. Practice History */}
          <SectionCard title="Practice History" action={<ViewAll href="/practice-history" />}>
            <PracticeHistoryList />
          </SectionCard>

          {/* 5. Recommended weak topics */}
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
      </div>
    </div>
  );
}


