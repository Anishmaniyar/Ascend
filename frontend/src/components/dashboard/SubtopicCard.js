import Link from "next/link";
import { ArrowRightIcon } from "@/components/ui/icons";
import { getSubtopicIcon } from "@/lib/subtopicIcons";

/**
 * SubtopicCard — compact, scannable card for a single subtopic.
 *
 * @param {object}  subtopic     — { id, name, questions }
 * @param {object}  progress     — { solved, total } or null
 * @param {string}  topicId      — parent topic id for the link
 */
export default function SubtopicCard({ subtopic, progress, topicId }) {
  const solved = progress?.solved ?? 0;
  const total = progress?.total ?? subtopic.questions;
  const pct = total > 0 ? Math.round((solved / total) * 100) : 0;
  const Icon = getSubtopicIcon(subtopic.id);

  return (
    <Link
      href={`/topics/${topicId}/${subtopic.id}`}
      className="group flex flex-col rounded-2xl border border-mist bg-canvas p-5 transition-colors hover:border-graphite"
    >
      {/* Top row: icon + name + arrow */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-3 min-w-0">
          {/* Subtopic icon */}
          {Icon && (
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-ash text-graphite">
              <Icon className="h-4.5 w-4.5" />
            </span>
          )}
          <p className="font-polysans text-15 tracking-[-0.02em] text-graphite truncate">
            {subtopic.name}
          </p>
        </div>
        <ArrowRightIcon className="mt-0.5 h-4 w-4 shrink-0 text-slate transition-colors group-hover:text-ember" />
      </div>

      {/* Question count */}
      <p className="mt-2 ml-0 pl-0 text-13 text-slate" style={Icon ? { marginLeft: "48px" } : {}}>
        {total} Question{total !== 1 ? "s" : ""}
      </p>

      {/* Progress bar — only show if user has progress */}
      {solved > 0 && (
        <div className="mt-auto pt-3" style={{ marginLeft: Icon ? "48px" : "0" }}>
          <div className="flex items-center justify-between text-13">
            <div className="h-1.5 flex-1 rounded-full bg-fog">
              <div
                className="h-full rounded-full bg-ember"
                style={{ width: `${pct}%` }}
              />
            </div>
            <span className="ml-2 font-polysans text-graphite">{pct}%</span>
          </div>
        </div>
      )}

      {/* Zero progress */}
      {solved === 0 && (
        <p className="mt-auto pt-3 text-13 text-slate" style={Icon ? { marginLeft: "48px" } : {}}>
          0% complete
        </p>
      )}
    </Link>
  );
}
