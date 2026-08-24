import Link from "next/link";
import { ArrowRightIcon } from "@/components/ui/icons";
import { continueSession } from "@/lib/mock/dashboard";
import Button from "@/components/ui/Button";

export default function ContinueCard() {
  const pct = Math.round((continueSession.done / continueSession.total) * 100);

  return (
    <div className="w-fit max-w-full rounded-2xl border border-mist bg-canvas px-5 py-4 transition-all hover:border-graphite hover:shadow-sm">
      <div className="flex items-start justify-between gap-6">
        {/* Left: Info */}
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <p className="font-polysans text-13 tracking-[-0.02em] text-slate">
              Continue Practice
            </p>
            <span className="rounded-tags bg-fog px-2 py-0.5 text-11 text-brass">
              {continueSession.mode}
            </span>
          </div>
          <p className="mt-1.5 truncate font-polysans text-15 tracking-[-0.02em] text-graphite">
            {continueSession.subtopic}
          </p>
          <p className="mt-0.5 text-13 text-steel">{continueSession.topic}</p>

          {/* Progress bar */}
          <div className="mt-3 max-w-[220px]">
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

        {/* Right: CTA */}
        <div className="flex shrink-0 items-center pt-1">
          <Button render={<Link href="#" />} variant="primary" size="sm">
            Resume
            <ArrowRightIcon className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>
    </div>
  );
}
