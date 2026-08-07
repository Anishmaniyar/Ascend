import Link from "next/link";
import {
  LayersIcon,
  BuildingIcon,
  ChartIcon,
  FlameIcon,
  ChatIcon,
  PencilIcon,
  TargetIcon,
  LightbulbIcon,
  ArrowRightIcon,
} from "@/components/ui/icons";
import { continueSession } from "@/lib/mock/dashboard";

const RINGS = [
  { icon: LayersIcon, label: "Topics" },
  { icon: BuildingIcon, label: "Company Sheets" },
  { icon: ChartIcon, label: "Analytics" },
  { icon: FlameIcon, label: "Streak" },
  { icon: ChatIcon, label: "Discussion" },
  { icon: PencilIcon, label: "Practice" },
  { icon: TargetIcon, label: "Accuracy" },
  { icon: LightbulbIcon, label: "Learning" },
];

function FloatingCard() {
  const pct = Math.round((continueSession.done / continueSession.total) * 100);
  return (
    <div className="w-full max-w-[290px] rounded-2xl border border-mist bg-canvas p-5 text-left">
      <div className="flex items-center justify-between">
        <p className="font-polysans text-13 tracking-[-0.02em] text-slate">
          Today&apos;s Progress
        </p>
        <span className="h-2 w-2 animate-pulse rounded-full bg-ember" />
      </div>
      <p className="mt-4 font-polysans text-heading tracking-[-0.02em] text-graphite">
        {continueSession.subtopic}
      </p>
      <p className="mt-1 text-13 text-steel">{continueSession.topic}</p>
      <div className="mt-5">
        <div className="flex items-center justify-between text-13">
          <span className="text-slate">
            {continueSession.done} / {continueSession.total} Solved
          </span>
          <span className="font-medium text-graphite">{continueSession.accuracy}%</span>
        </div>
        <div className="mt-2 h-1.5 w-full rounded-full bg-fog">
          <div
            className="h-full rounded-full bg-ember"
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>
      <div className="mt-5 flex items-center justify-between">
        <span className="flex items-center gap-1.5 text-13 text-slate">
          <FlameIcon className="h-4 w-4 text-ember" />
          7 day streak
        </span>
        <span className="inline-flex items-center gap-1.5 rounded-buttons bg-graphite px-3.5 py-1.5 font-polysans text-13 tracking-[-0.02em] text-inverse">
          Continue
          <ArrowRightIcon className="h-3.5 w-3.5" />
        </span>
      </div>
    </div>
  );
}

export default function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="mx-auto max-w-[var(--page-max-width)] px-6 pb-24 pt-20 text-center">
        {/* Badge */}
        <p className="mx-auto inline-flex items-center gap-2.5 rounded-tags bg-ash px-4 py-1.5 text-13 text-steel">
          <span className="h-1.5 w-1.5 rounded-full bg-ember" />
          Structured preparation, not random PDFs
        </p>

        {/* Headline */}
        <h1 className="mx-auto mt-8 max-w-[14ch] text-display text-graphite">
          Master Aptitude.
          <br />
          <span className="relative inline-block">
            One Topic at a Time.
            <span className="absolute -bottom-3 left-0 h-[3px] w-full rounded-full bg-ember" />
          </span>
        </h1>

        {/* Subheading */}
        <p className="mx-auto mt-10 max-w-[56ch] text-subheading text-steel">
          Learn aptitude through structured topics, company-specific sheets,
          practice sessions, and detailed progress tracking — all in one place.
        </p>

        {/* CTAs */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/dashboard"
            className="rounded-buttons bg-graphite px-7 py-3 font-polysans text-base tracking-[-0.02em] text-inverse transition-opacity hover:opacity-85"
          >
            Start Practicing
          </Link>
          <Link
            href="/topics"
            className="rounded-buttons border border-graphite px-7 py-3 font-polysans text-base tracking-[-0.02em] text-graphite transition-colors hover:bg-graphite hover:text-inverse"
          >
            Explore Topics
          </Link>
        </div>

        {/* Visual: floating card + icon rings */}
        <div className="mx-auto mt-20 grid max-w-[560px] grid-cols-3 items-center gap-4 md:gap-8">
          {RINGS.slice(0, 3).map((ring, i) => (
            <Ring key={ring.label} ring={ring} index={i} />
          ))}
          <Ring ring={RINGS[3]} index={3} />
          <div className="animate-float flex justify-center" style={{ animationDelay: "0.6s" }}>
            <FloatingCard />
          </div>
          <Ring ring={RINGS[4]} index={4} />
          {RINGS.slice(5).map((ring, i) => (
            <Ring key={ring.label} ring={ring} index={5 + i} />
          ))}
        </div>
      </div>
    </section>
  );
}

function Ring({ ring, index }) {
  const Icon = ring.icon;
  return (
    <div
      className="animate-float flex justify-center"
      style={{ animationDelay: `${index * 0.45}s` }}
    >
      {/* Decorative — feature glyphs around the card, not controls */}
      <span
        aria-hidden="true"
        title={ring.label}
        className="flex h-12 w-12 items-center justify-center rounded-full border border-mist bg-canvas text-graphite transition-colors hover:border-graphite hover:text-ember md:h-14 md:w-14"
      >
        <Icon className="h-5 w-5" />
      </span>
    </div>
  );
}
