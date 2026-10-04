import SectionHeading from "@/components/ui/SectionHeading";
import Heatmap from "@/components/charts/Heatmap";
import LineChart from "@/components/charts/LineChart";
import RingProgress from "@/components/charts/RingProgress";
import { buildHeatmap, skills, quickStats } from "@/lib/mock/dashboard";

export default function AnalyticsSection() {
  const weeks = buildHeatmap(22);
  const stat = quickStats.find((s) => s.id === "accuracy") ?? { value: 0 };

  return (
    <section id="analytics" className="bg-canvas py-20">
      <div className="mx-auto max-w-[var(--page-max-width)] px-6">
        <SectionHeading
          align="center"
          kicker="Progress tracking"
          title="Track your improvement."
          description="Accuracy, streaks, heatmaps and skill breakdowns update after every session — so you always know what to work on next."
        />

        {/* Analytics panel */}
        <div className="mx-auto mt-14 max-w-4xl rounded-2xl bg-ash p-6 md:p-8">
          {/* Stat chips */}
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            <Chip value="7" label="Current Streak" />
            <Chip value="21" label="Longest Streak" />
            <Chip value="81%" label="Accuracy" />
            <Chip value="324" label="Questions" />
          </div>

          {/* Heatmap + line chart */}
          <div className="mt-6 grid gap-6 lg:grid-cols-3">
            <div className="rounded-2xl bg-canvas p-5 lg:col-span-2">
              <p className="font-polysans text-13 tracking-[-0.02em] text-slate">
                Daily Activity
              </p>
              <div className="mt-4">
                <Heatmap weeks={weeks} />
              </div>
            </div>
            <div className="rounded-2xl bg-canvas p-5">
              <p className="font-polysans text-13 tracking-[-0.02em] text-slate">
                Accuracy Trend
              </p>
              <div className="mt-4">
                <LineChart />
              </div>
            </div>
          </div>

          {/* Skills */}
          <div className="mt-6 grid items-center gap-6 rounded-2xl bg-canvas p-5 sm:grid-cols-[auto_1fr]">
            <div className="mx-auto">
              <RingProgress value={stat.value} size={72} strokeWidth={6}>
                <span className="font-polysans text-15 text-graphite">{stat.value}%</span>
              </RingProgress>
              <p className="mt-2 text-center text-13 text-slate">Overall</p>
            </div>
            <div className="space-y-4">
              {skills.map((skill) => (
                <div key={skill.topic}>
                  <div className="flex items-center justify-between">
                    <p className="text-15 text-graphite">{skill.topic}</p>
                    <p className="font-polysans text-13 text-graphite">{skill.accuracy}%</p>
                  </div>
                  <div className="mt-1.5 h-1.5 w-full rounded-full bg-fog">
                    <div
                      className="h-full rounded-full bg-ember"
                      style={{ width: `${skill.accuracy}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <p className="mt-6 text-center font-polysans text-13 tracking-[-0.02em] text-slate">
            Live from your dashboard — updated after every session.
          </p>
        </div>
      </div>
    </section>
  );
}

function Chip({ value, label }) {
  return (
    <div className="rounded-lg bg-canvas px-4 py-3 text-center">
      <p className="font-polysans text-heading tracking-[-0.02em] text-graphite">{value}</p>
      <p className="mt-1 text-13 text-slate">{label}</p>
    </div>
  );
}
