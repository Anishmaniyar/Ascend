import { practiceHistory as mockHistory } from "@/lib/mock/dashboard";

function formatDate(value) {
  if (!value) return "";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

// Props: `sessions` — live API rows { id, subtopic, topic, mode, score,
// total, accuracy, date }. Falls back to mocks when omitted (dashboard).
export default function PracticeHistoryList({ sessions } = {}) {
  const list = sessions || mockHistory;

  if (sessions && sessions.length === 0) {
    return (
      <p className="text-13 leading-[1.5] text-slate">
        No practice sessions yet — pick a topic and start your first one.
      </p>
    );
  }

  return (
    <div className="divide-y divide-mist">
      {list.map((session) => (
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
            <p className="mt-0.5 text-13 text-slate">
              {session.when || formatDate(session.date)}
            </p>
          </div>
          <span className="rounded-tags bg-canvas px-2.5 py-1 text-13 font-medium text-graphite">
            {session.accuracy}%
          </span>
        </div>
      ))}
    </div>
  );
}
