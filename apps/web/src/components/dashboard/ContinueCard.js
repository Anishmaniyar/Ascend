import Link from "next/link";
import { ArrowRightIcon } from "@/components/ui/icons";
import { continueSession as mockSession } from "@/lib/mock/dashboard";
import Button from "@/components/ui/Button";

// Props: `session` tri-state —
//   undefined → mock (dashboard), object → live active session,
//   null → no active session (renders nothing).
export default function ContinueCard({ session } = {}) {
  if (session === null) return null;

  const data = session || mockSession;
  const pct =
    data.total > 0 ? Math.round((data.done / data.total) * 100) : 0;

  return (
    <div className="w-fit max-w-full rounded-cards border border-mist bg-canvas px-5 py-4 transition-colors duration-150 hover:border-mist-strong">
      <div className="flex items-start justify-between gap-6">
        {/* Left: Info */}
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <p className="font-polysans text-13 tracking-[-0.02em] text-slate">
              Continue Practice
            </p>
            <span className="rounded-tags bg-ash px-2 py-0.5 text-11 text-steel">
              {data.mode}
            </span>
          </div>
          <p className="mt-1.5 truncate font-polysans text-15 tracking-[-0.02em] text-graphite">
            {data.subtopic}
          </p>
          <p className="mt-0.5 text-13 text-steel">{data.topic}</p>

          {/* Progress bar */}
          <div className="mt-3 max-w-[220px]">
            <div className="flex items-center justify-between text-13">
              <span className="text-slate">
                {data.done}/{data.total}
              </span>
              <span className="font-polysans text-graphite">{pct}%</span>
            </div>
            <div className="mt-1.5 h-1.5 w-full rounded-full bg-mist">
              <div
                className="h-full rounded-full bg-graphite"
                style={{ width: `${pct}%` }}
              />
            </div>
          </div>
        </div>

        {/* Right: CTA */}
        <div className="flex shrink-0 items-center pt-1">
          {/* Live resume needs the practice runner wired to real sessions
              (separate task) — for now it leads back to topic browsing. */}
          <Button
            render={<Link href={session ? "/topics" : "#"} />}
            variant="primary"
            size="sm"
          >
            Resume
            <ArrowRightIcon className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>
    </div>
  );
}
