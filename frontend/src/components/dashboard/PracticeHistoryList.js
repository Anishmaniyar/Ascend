import { practiceHistory } from "@/lib/mock/dashboard";

export default function PracticeHistoryList() {
  return (
    <div className="divide-y divide-mist">
      {practiceHistory.map((session) => (
        <div key={session.id} className="flex items-center gap-4 py-3.5 first:pt-0 last:pb-0">
          <div className="min-w-0 flex-1">
            <p className="truncate text-15 text-graphite">{session.subtopic}</p>
            <p className="mt-0.5 text-13 text-slate">
              {session.topic} · {session.mode} Mode
            </p>
          </div>
          <div className="hidden text-right sm:block">
            <p className="text-13 text-slate">
              {session.score}/{session.total} correct
            </p>
            <p className="mt-0.5 text-13 text-slate">{session.when}</p>
          </div>
          <span className="rounded-tags bg-canvas px-2.5 py-1 text-13 font-medium text-graphite">
            {session.accuracy}%
          </span>
        </div>
      ))}
    </div>
  );
}
