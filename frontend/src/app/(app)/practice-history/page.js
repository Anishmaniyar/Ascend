import { practiceHistory } from "@/lib/mock/dashboard";

export default function PracticeHistoryPage() {
  return (
    <div className="mx-auto w-full max-w-[var(--page-max-width)] px-6 py-10">
      <header>
        <h1 className="text-heading-lg text-graphite">Practice History</h1>
        <p className="mt-2 max-w-[56ch] text-15 leading-[1.5] text-steel">
          Every session you&apos;ve completed — what you solved, how you did,
          and when.
        </p>
      </header>

      <div className="mt-10 divide-y divide-mist rounded-2xl bg-ash px-6">
        {practiceHistory.map((session) => (
          <div
            key={session.id}
            className="flex flex-wrap items-center gap-4 py-5 first:pt-7 last:pb-7"
          >
            <div className="min-w-0 flex-1">
              <p className="text-15 text-graphite">{session.subtopic}</p>
              <p className="mt-0.5 text-13 text-slate">
                {session.topic} · {session.mode} Mode · {session.when}
              </p>
            </div>
            <p className="text-13 text-slate">
              {session.score}/{session.total} correct
            </p>
            <span className="rounded-tags bg-canvas px-3 py-1 text-13 font-medium text-graphite">
              {session.accuracy}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
