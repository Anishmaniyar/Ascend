import RingProgress from "@/components/charts/RingProgress";
import { performanceSummary } from "@/lib/mock/dashboard";

export default function PerformanceCard() {
  const { questionsSolved, totalSessions, overallAccuracy, questionsAttempted } =
    performanceSummary;

  return (
    <section className="rounded-2xl bg-ash p-6">
      <h3 className="font-polysans text-subheading tracking-[-0.02em] text-graphite">
        Performance Summary
      </h3>

      <div className="mt-5 flex items-center gap-8">
        {/* Ring progress with accuracy */}
        <div className="shrink-0">
          <RingProgress value={overallAccuracy} size={100} strokeWidth={7}>
            <span className="font-polysans text-heading tracking-[-0.02em] text-graphite">
              {overallAccuracy}%
            </span>
          </RingProgress>
          <p className="mt-2 text-center text-13 text-slate">Accuracy</p>
        </div>

        {/* Metrics */}
        <div className="min-w-0 flex-1 space-y-4">
          <div>
            <p className="font-polysans text-heading-lg tracking-[-0.02em] text-graphite">
              {questionsSolved}
            </p>
            <p className="text-13 text-slate">Questions Solved</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="font-polysans text-subheading tracking-[-0.02em] text-graphite">
                {totalSessions}
              </p>
              <p className="text-13 text-slate">Sessions</p>
            </div>
            <div>
              <p className="font-polysans text-subheading tracking-[-0.02em] text-graphite">
                {questionsAttempted}
              </p>
              <p className="text-13 text-slate">Attempted</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
