import Link from "next/link";
import { ArrowRightIcon } from "@/components/ui/icons";
import SectionCard from "@/components/dashboard/SectionCard";
import ContinueCard from "@/components/dashboard/ContinueCard";
import DashboardBadges from "@/components/dashboard/DashboardBadges";
import DonutMetricCard from "@/components/dashboard/DonutMetricCard";
import PracticeHistoryList from "@/components/dashboard/PracticeHistoryList";
import RecommendedTopics from "@/components/dashboard/RecommendedTopics";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import Heatmap from "@/components/charts/Heatmap";
import {
  buildHeatmap,
  heatmapStats,
  performanceSummary,
} from "@/lib/mock/dashboard";

const ViewAll = ({ href }) => (
  <Link
    href={href}
    className="inline-flex items-center gap-1 font-polysans text-13 tracking-[-0.02em] text-slate transition-colors hover:text-ember"
  >
    View all
    <ArrowRightIcon className="h-3.5 w-3.5" />
  </Link>
);

export default function ProfilePage() {
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
    <div className="mx-auto w-full max-w-[var(--page-max-width)] px-6 py-10">
      {/* ── Two-column layout ──────────────────────────────────────── */}
      <div className="flex flex-col gap-8 lg:flex-row">
        {/* ── Left: Profile sidebar (sticky) ──────────────────────── */}
        <DashboardSidebar />

        {/* ── Right: Main content ─────────────────────────────────── */}
        <div className="min-w-0 flex-1 space-y-6">
          {/* 1. Resume Practice — full width */}
          <ContinueCard />

          {/* 2. Practice Statistics + Badges — side by side */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {/* Left: Practice Statistics */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
              <DonutMetricCard
                label="Questions Solved"
                centerText={questionsSolved}
                centerLabel="Solved"
                segments={[
                  { value: easy.solved, color: "#3f8f62", label: "Easy" },
                  { value: medium.solved, color: "#c9a348", label: "Medium" },
                  { value: hard.solved, color: "#e07a5f", label: "Hard" },
                ]}
                details={[
                  { label: "Easy", value: easy.solved, color: "#3f8f62", percent: Math.round((easy.solved / easy.total) * 100), subtext: "/ " + easy.total },
                  { label: "Medium", value: medium.solved, color: "#c9a348", percent: Math.round((medium.solved / medium.total) * 100), subtext: "/ " + medium.total },
                  { label: "Hard", value: hard.solved, color: "#e07a5f", percent: Math.round((hard.solved / hard.total) * 100), subtext: "/ " + hard.total },
                ]}
              />

              <DonutMetricCard
                label="Accuracy"
                centerText={`${overallAccuracy}%`}
                centerLabel="Accuracy"
                segments={[
                  { value: overallAccuracy, color: "#3f8f62", label: "Correct" },
                  { value: 100 - overallAccuracy, color: "#c95c5c", label: "Mistakes" },
                ]}
                details={[
                  { label: "Correct answers", value: Math.round((overallAccuracy / 100) * questionsSolved), color: "#3f8f62", percent: overallAccuracy },
                  { label: "Incorrect / Skipped", value: questionsSolved - Math.round((overallAccuracy / 100) * questionsSolved), color: "#c95c5c", percent: 100 - overallAccuracy },
                ]}
              />

              <DonutMetricCard
                label="Sessions"
                centerText={totalSessions}
                centerLabel="Total"
                segments={[
                  { value: practiceSessions, color: "#d9b45b", label: "Practice" },
                  { value: testSessions, color: "#3f8f62", label: "Test" },
                ]}
                details={[
                  { label: "Practice sessions", value: practiceSessions, color: "#d9b45b", percent: Math.round((practiceSessions / totalSessions) * 100), subtext: Math.round((practiceSessions / totalSessions) * 100) + "%" },
                  { label: "Test sessions", value: testSessions, color: "#3f8f62", percent: Math.round((testSessions / totalSessions) * 100), subtext: Math.round((testSessions / totalSessions) * 100) + "%" },
                ]}
              />
            </div>

            {/* Right: Badges */}
            <DashboardBadges />
          </div>

          {/* 3. Activity Heatmap */}
          <SectionCard title="Activity">
            <Heatmap weeks={weeks} stats={heatmapStats} />
          </SectionCard>

          {/* 4. Practice History */}
          <SectionCard
            title="Practice History"
            action={<ViewAll href="/practice-history" />}
          >
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

