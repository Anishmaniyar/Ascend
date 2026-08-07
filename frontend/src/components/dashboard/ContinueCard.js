import Link from "next/link";
import { ArrowRightIcon } from "@/components/ui/icons";
import { continueSession } from "@/lib/mock/dashboard";

export default function ContinueCard() {
  const pct = Math.round((continueSession.done / continueSession.total) * 100);

  return (
    <div className="h-full rounded-asymmetric bg-ash p-7 md:p-9">
      <div className="flex items-center justify-between gap-4">
        <p className="font-polysans text-13 tracking-[-0.02em] text-slate">
          Continue Practice
        </p>
        <span className="rounded-tags bg-canvas px-3 py-1 text-13 text-brass">
          {continueSession.mode} Mode
        </span>
      </div>

      <p className="mt-6 font-polysans text-heading tracking-[-0.02em] text-graphite">
        {continueSession.subtopic}
      </p>
      <p className="mt-1 text-15 text-steel">{continueSession.topic}</p>

      <div className="mt-7 flex flex-wrap items-end justify-between gap-5">
        <div className="min-w-[200px] flex-1">
          <div className="flex items-center justify-between text-13">
            <span className="text-slate">
              {continueSession.done} / {continueSession.total} Questions
            </span>
            <span className="font-medium text-graphite">{pct}%</span>
          </div>
          <div className="mt-2 h-2 w-full rounded-full bg-canvas">
            <div
              className="h-full rounded-full bg-ember"
              style={{ width: `${pct}%` }}
            />
          </div>
        </div>
        {/* TODO: wire to the real practice session route */}
        <Link
          href="#"
          className="inline-flex items-center gap-1.5 rounded-buttons bg-graphite px-5 py-2.5 font-polysans text-13 tracking-[-0.02em] text-inverse transition-opacity hover:opacity-85"
        >
          Continue
          <ArrowRightIcon className="h-3.5 w-3.5" />
        </Link>
      </div>
    </div>
  );
}
