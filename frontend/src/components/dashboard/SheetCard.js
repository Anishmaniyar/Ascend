import { ArrowRightIcon } from "@/components/ui/icons";

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
 * SheetCard — compact row card for a single practice sheet/session.
 *
 * @param {object}  sheet     — { id, session, difficulty, questions, solved, accuracy }
 * @param {function} onClick  — click handler
 */
export default function SheetCard({ sheet, onClick }) {
  const { session, difficulty, questions, solved } = sheet;
  const total = questions.length;
  const completed = solved === total && total > 0;
  const inProgress = solved > 0 && !completed;

  return (
    <button
      type="button"
      onClick={onClick}
      className="group flex w-full items-center justify-between rounded-2xl border border-mist bg-canvas p-5 text-left transition-all hover:border-graphite hover:shadow-sm"
    >
      <div className="min-w-0 flex-1">
        {/* Session number + difficulty badge */}
        <div className="flex items-center gap-3">
          <p className="font-polysans text-15 tracking-[-0.02em] text-graphite">
            Session {session}
          </p>
          <span
            className={`inline-flex items-center gap-1.5 rounded-tags px-2.5 py-0.5 font-polysans text-13 tracking-[-0.02em] ${DIFF_COLORS[difficulty]}`}
          >
            <span className={`h-1.5 w-1.5 rounded-full ${DIFF_DOT_COLORS[difficulty]}`} />
            {difficulty}
          </span>
        </div>

        {/* Question count */}
        <p className="mt-1.5 text-13 text-slate">
          {total} Questions
        </p>

        {/* Completion status */}
        <div className="mt-2">
          {completed ? (
            <span className="inline-flex items-center gap-1.5 text-13 font-polysans text-success">
              <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 6 9 17l-5-5" />
              </svg>
              {solved} / {total} Completed
            </span>
          ) : inProgress ? (
            <span className="text-13 font-polysans text-graphite">
              {solved} / {total} Completed
            </span>
          ) : (
            <span className="text-13 text-slate">Not Started</span>
          )}
        </div>
      </div>

      {/* Arrow */}
      <ArrowRightIcon className="ml-4 h-4 w-4 shrink-0 text-slate transition-colors group-hover:text-ember" />
    </button>
  );
}
