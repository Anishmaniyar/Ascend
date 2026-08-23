import Link from "next/link";
import { ArrowRightIcon, FlameIcon } from "@/components/ui/icons";
import { continueSession } from "@/lib/mock/dashboard";

export default function ContinueCard() {
  const pct = Math.round((continueSession.done / continueSession.total) * 100);

  return (
    <div className="rounded-2xl border border-mist bg-canvas p-5 transition-all hover:border-graphite hover:shadow-sm">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        {/* Left: Info */}
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <p className="font-polysans text-13 tracking-[-0.02em] text-slate">
              Continue Practice
            </p>
            <span className="rounded-tags bg-fog px-2 py-0.5 text-11 text-brass">
              {continueSession.mode}
            </span>
          </div>
          <p className="mt-2 truncate font-polysans text-15 tracking-[-0.02em] text-graphite">
            {continueSession.subtopic}
          </p>
          <p className="mt-0.5 text-13 text-steel">{continueSession.topic}</p>

          {/* Progress bar */}
          <div className="mt-3 max-w-[280px]">
            <div className="flex items-center justify-between text-13">
              <span className="text-slate">
                {continueSession.done}/{continueSession.total}
              </span>
              <span className="font-polysans text-graphite">{pct}%</span>
            </div>
            <div className="mt-1.5 h-1.5 w-full rounded-full bg-fog">
              <div
                className="h-full rounded-full bg-ember"
                style={{ width: `${pct}%` }}
              />
            </div>
          </div>
        </div>

        {/* Right: Streak + CTA */}
        <div className="flex items-center gap-4">
          <span className="hidden items-center gap-1.5 text-13 text-slate sm:inline-flex">
            <FlameIcon className="h-3.5 w-3.5 text-ember" />
            {continueSession.streak || 7} day streak
          </span>
          <Link
            href="#"
            className="inline-flex shrink-0 items-center gap-1.5 rounded-buttons bg-graphite px-4 py-2 font-polysans text-13 tracking-[-0.02em] text-inverse transition-opacity hover:opacity-85"
          >
            Resume
            <ArrowRightIcon className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
