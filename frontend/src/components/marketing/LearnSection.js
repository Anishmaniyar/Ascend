import SectionHeading from "@/components/ui/SectionHeading";

const POINTS = [
  "Topics — organized into major areas: Quantitative, Logical, Verbal.",
  "Subtopics — drill into focused concepts like Profit & Loss or Probability.",
  "Progress — watch completion grow at every level.",
  "Difficulty levels — Easy → Medium → Hard, so you can ramp up.",
];

const TOPIC_ROWS = [
  { name: "Profit & Loss", progress: 82, level: "MEDIUM" },
  { name: "Time & Work", progress: 64, level: "EASY" },
  { name: "Number System", progress: 45, level: "HARD" },
];

export default function LearnSection() {
  return (
    <section className="bg-canvas py-20">
      <div className="mx-auto grid max-w-[var(--page-max-width)] items-center gap-16 px-6 lg:grid-cols-2">
        {/* Text */}
        <div>
          <SectionHeading
            kicker="Structured learning"
            title="Learn in a structured way."
            description="No random question dumps. Every concept has a home — a topic, a subtopic, and a clear path to mastery."
          />
          <ul className="mt-8 space-y-5">
            {POINTS.map((point) => (
              <li key={point} className="flex gap-4">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-sm bg-ember" />
                <p className="text-15 leading-[1.5] text-steel">{point}</p>
              </li>
            ))}
          </ul>
        </div>

        {/* Dashboard mockup */}
        <div className="rounded-2xl bg-ash p-6 md:p-8">
          <div className="flex items-center justify-between">
            <p className="font-polysans text-13 tracking-[-0.02em] text-slate">
              Your Topics
            </p>
            <span className="rounded-tags bg-canvas px-3 py-1 font-polysans text-13 tracking-[-0.02em] text-brass">
              Progress
            </span>
          </div>
          <div className="mt-6 space-y-5">
            {TOPIC_ROWS.map((row) => (
              <div key={row.name}>
                <div className="flex items-center justify-between gap-3">
                  <p className="text-15 text-graphite">{row.name}</p>
                  <span className="rounded-tags bg-canvas px-2.5 py-0.5 text-13 text-steel">
                    {row.level}
                  </span>
                </div>
                <div className="mt-2 h-1.5 w-full rounded-full bg-canvas">
                  <div
                    className="h-full rounded-full bg-ember"
                    style={{ width: `${row.progress}%` }}
                  />
                </div>
                <p className="mt-1.5 text-13 text-slate">{row.progress}% complete</p>
              </div>
            ))}
          </div>
          <div className="mt-6 border-t border-mist pt-5">
            <p className="font-polysans text-13 tracking-[-0.02em] text-slate">
              Suggested next: Probability
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
