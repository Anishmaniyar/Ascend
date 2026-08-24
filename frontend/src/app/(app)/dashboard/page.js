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
import { buildHeatmap, heatmapStats, performanceSummary, getDashboardBadges } from "@/lib/mock/dashboard";

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
    className="inline-flex items-center gap-1 font-polysans text-13 tracking-[-0.02em] text-slate transition-colors hover:text-ember"
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
    <div className="mx-auto w-full max-w-[var(--page-max-width)] px-6 py-10">
      <div className="flex flex-col gap-8 lg:flex-row">
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
              className="flex flex-1 items-center gap-4 rounded-2xl border border-mist bg-ash px-5 py-4 transition-all hover:border-graphite hover:shadow-sm"
            >
              <div className="flex -space-x-2">
                {getDashboardBadges(3).map((badge) => {
                  const Icon = BADGE_ICON_MAP[badge.icon] ?? TargetIcon;
                  return (
                    <div
                      key={badge.id}
                      className={`flex h-10 w-10 items-center justify-center rounded-full border-2 border-ash ${
                        badge.earned ? "bg-ember/10" : "bg-fog"
                      }`}
                    >
                      {badge.earned ? (
                        <Icon className="h-5 w-5 text-ember" />
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
            <DonutMetricCard
              label="Questions Solved"
              value={questionsSolved}
              valueLabel="Solved"
              percent={(questionsSolved / 1000) * 100}
            >
              <div className="space-y-2">
                <DifficultyRow label="Easy" solved={easy.solved} total={easy.total} color="bg-success" />
                <DifficultyRow label="Medium" solved={medium.solved} total={medium.total} color="bg-brass" />
                <DifficultyRow label="Hard" solved={hard.solved} total={hard.total} color="bg-ember" />
              </div>
            </DonutMetricCard>

            <DonutMetricCard
              label="Accuracy"
              value={`${overallAccuracy}%`}
              valueLabel="Accuracy"
              subtitle="Overall Performance"
              percent={overallAccuracy}
            />

            <DonutMetricCard
              label="Practice Sessions"
              value={totalSessions}
              valueLabel="Sessions"
              percent={(totalSessions / 50) * 100}
            >
              <div className="space-y-2">
                <SessionRow label="Practice" count={practiceSessions} total={totalSessions} color="bg-ember" />
                <SessionRow label="Test" count={testSessions} total={totalSessions} color="bg-brass" />
              </div>
            </DonutMetricCard>
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

/* ── Breakdown row helpers ──────────────────────────────────────────── */

function DifficultyRow({ label, solved, total, color }) {
  const pct = total > 0 ? Math.round((solved / total) * 100) : 0;
  return (
    <div>
      <div className="flex items-center justify-between text-13">
        <div className="flex items-center gap-2">
          <span className={`h-2 w-2 rounded-full ${color}`} />
          <span className="text-steel">{label}</span>
        </div>
        <span className="font-polysans text-graphite">{solved}</span>
      </div>
      <div className="mt-1.5 h-1.5 w-full rounded-full bg-fog">
        <div
          className={`h-full rounded-full ${color}`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

function SessionRow({ label, count, total, color }) {
  const pct = total > 0 ? Math.round((count / total) * 100) : 0;
  return (
    <div>
      <div className="flex items-center justify-between text-13">
        <div className="flex items-center gap-2">
          <span className={`h-2 w-2 rounded-full ${color}`} />
          <span className="text-steel">{label}</span>
        </div>
        <span className="font-polysans text-graphite">
          {count} <span className="text-slate">({pct}%)</span>
        </span>
      </div>
      <div className="mt-1.5 h-1.5 w-full rounded-full bg-fog">
        <div
          className={`h-full rounded-full ${color}`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
