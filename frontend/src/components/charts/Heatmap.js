/**
 * Heatmap — GitHub-style daily activity grid.
 * Expects `weeks`: array of { date: Date, days: number[7] } where each day
 * is an intensity level 0–4. Levels render as ember shades (light → dark).
 *
 * Optional `stats` prop: { questionsSolved, totalActiveDays, maxStreak, currentStreak }
 */
const CELL = 11;
const GAP = 3;
const OPACITY = [0.25, 0.45, 0.7, 1];

export default function Heatmap({ weeks, stats, className = "" }) {
  // Month labels — show the month of the first week of each month.
  const months = [];
  let lastMonth = -1;
  weeks.forEach((week, i) => {
    const m = week.date.getMonth();
    if (m !== lastMonth) {
      months.push({
        index: i,
        label: week.date.toLocaleString("en", { month: "short" }),
      });
      lastMonth = m;
    }
  });

  return (
    <div className={className}>
      {/* Summary stats header */}
      {stats && (
        <div className="mb-5 flex flex-wrap items-baseline justify-between gap-4">
          <p className="font-polysans text-subheading tracking-[-0.02em] text-graphite">
            <span className="text-heading">{stats.questionsSolved}</span>{" "}
            questions solved in the past year
          </p>
          <div className="flex flex-wrap items-center gap-5 text-13 text-slate">
            <span>
              Active Days:{" "}
              <span className="font-polysans text-graphite">{stats.totalActiveDays}</span>
            </span>
            <span>
              Max Streak:{" "}
              <span className="font-polysans text-graphite">{stats.maxStreak}</span>
            </span>
            <span>
              Current Streak:{" "}
              <span className="font-polysans text-ember">{stats.currentStreak}</span>
            </span>
          </div>
        </div>
      )}

      <div className="flex gap-2">
        {/* Day labels */}
        <div
          className="flex shrink-0 flex-col text-[10px] leading-[11px] text-slate"
          style={{ gap: GAP }}
        >
          {["", "Mon", "", "Wed", "", "Fri", ""].map((label, i) => (
            <span key={i} className="flex h-[11px] items-center">
              {label}
            </span>
          ))}
        </div>

        {/* Heatmap grid — responsive, fills available width */}
        <div className="min-w-0 flex-1 overflow-x-auto pb-1">
          <div
            className="flex flex-col"
            style={{ gap: GAP }}
          >
            {/* Month labels row */}
            <div className="relative h-4">
              {months.map((m, i) => (
                <span
                  key={`${m.label}-${i}`}
                  className="absolute top-0 text-[10px] text-slate"
                  style={{ left: `calc(${(m.index / weeks.length) * 100}% - 0.5px)` }}
                >
                  {m.label}
                </span>
              ))}
            </div>

            {/* Grid cells — columns stretch to fill full width */}
            <div
              className="grid"
              style={{
                gridAutoFlow: "column",
                gridTemplateRows: `repeat(7, ${CELL}px)`,
                gridTemplateColumns: `repeat(${weeks.length}, 1fr)`,
                gap: GAP,
              }}
            >
              {weeks.map((week, wi) =>
                week.days.map((level, di) => (
                  <div
                    key={`${wi}-${di}`}
                    title={level ? `${level} sessions` : "No sessions"}
                    className="rounded-[3px]"
                    style={{
                      backgroundColor: level
                        ? "var(--color-ember)"
                        : "var(--color-fog)",
                      opacity: level ? OPACITY[level - 1] : 1,
                    }}
                  />
                )),
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="mt-3 flex items-center justify-end gap-1.5 text-[10px] text-slate">
        Less
        {[0, 1, 2, 3, 4].map((l) => (
          <span
            key={l}
            className="rounded-[3px]"
            style={{
              width: CELL,
              height: CELL,
              backgroundColor: l ? "var(--color-ember)" : "var(--color-fog)",
              opacity: l ? OPACITY[l - 1] : 1,
            }}
          />
        ))}
        More
      </div>
    </div>
  );
}
