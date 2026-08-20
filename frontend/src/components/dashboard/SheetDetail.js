"use client";

import { XIcon } from "@/components/ui/icons";

const DIFF_COLORS = {
  Easy: "bg-success/10 text-success",
  Medium: "bg-brass/10 text-brass",
  Hard: "bg-ember/10 text-ember",
};

const DIFF_DOT_COLORS = {
  Easy: "bg-success",
  Medium: "bg-brass",
  Hard: "bg-ember",
};

/**
 * SheetDetail — modal overlay showing question preview and start/resume button.
 *
 * @param {object}  sheet        — { id, session, difficulty, questions, solved }
 * @param {string}  subtopicName — e.g. "Profit & Loss"
 * @param {function} onClose     — close handler
 * @param {function} onStart     — start/resume handler
 */
export default function SheetDetail({ sheet, subtopicName, onClose, onStart }) {
  if (!sheet) return null;

  const { session, difficulty, questions, solved } = sheet;
  const total = questions.length;
  const hasStarted = solved > 0;
  const isCompleted = solved === total;
  const progressPct = total > 0 ? Math.round((solved / total) * 100) : 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-graphite/40 p-4 backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-2xl bg-canvas shadow-xl">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 border-b border-mist px-6 py-5">
          <div className="min-w-0 flex-1">
            <p className="text-13 text-slate">{subtopicName}</p>
            <h3 className="mt-1 font-polysans text-subheading tracking-[-0.02em] text-graphite">
              Session {session}
            </h3>
            <div className="mt-2 flex items-center gap-2.5">
              <span
                className={`inline-flex items-center gap-1.5 rounded-tags px-2.5 py-0.5 font-polysans text-13 tracking-[-0.02em] ${DIFF_COLORS[difficulty]}`}
              >
                <span className={`h-1.5 w-1.5 rounded-full ${DIFF_DOT_COLORS[difficulty]}`} />
                {difficulty}
              </span>
              <span className="text-13 text-slate">{total} Questions</span>
            </div>

            {/* Progress indicator when started */}
            {hasStarted && (
              <div className="mt-3">
                <div className="flex items-center justify-between text-13">
                  <span className="text-slate">Progress</span>
                  <span className="font-polysans text-graphite">{solved} / {total}</span>
                </div>
                <div className="mt-1.5 h-1.5 w-full rounded-full bg-fog">
                  <div
                    className={`h-full rounded-full transition-all ${isCompleted ? "bg-success" : "bg-ember"}`}
                    style={{ width: `${progressPct}%` }}
                  />
                </div>
              </div>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-1 text-slate transition-colors hover:bg-ash hover:text-graphite"
          >
            <XIcon className="h-5 w-5" />
          </button>
        </div>

        {/* Question list */}
        <div className="max-h-[50vh] overflow-y-auto px-6 py-4">
          <div className="divide-y divide-mist">
            {questions.map((q, i) => (
              <div key={q.id} className="flex items-start gap-3 py-3">
                <span className="mt-0.5 font-polysans text-13 text-slate">
                  {i + 1}.
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-15 leading-[1.5] text-graphite">{q.title}</p>
                  <span className="mt-1 inline-block rounded-tags bg-fog px-2 py-0.5 text-13 text-slate">
                    {q.difficulty}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-mist px-6 py-4">
          <button
            type="button"
            onClick={onStart}
            className="w-full rounded-buttons bg-graphite px-5 py-2.5 font-polysans text-15 tracking-[-0.02em] text-inverse transition-opacity hover:opacity-85"
          >
            {isCompleted
              ? "Practice Again"
              : hasStarted
              ? `Resume Practice — ${solved} / ${total} completed`
              : "Start Practice"}
          </button>
        </div>
      </div>
    </div>
  );
}
