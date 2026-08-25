import RoundedDonut from "@/components/ui/RoundedDonut";

/**
 * DonutMetricCard — a card with a multi-segment rounded donut chart.
 *
 * @param {string}  label       — Card title (e.g. "Questions Solved")
 * @param {string}  centerText  — Main value in donut center
 * @param {string}  centerLabel — Label below center value
 * @param {Array}   segments    — [{ value, color, label }] for donut segments
 * @param {Array}   details     — [{ label, value, color, subtext }] for breakdown below
 * @param {number}  donutSize   — donut diameter in px (default 130)
 */
export default function DonutMetricCard({
  label,
  centerText = "",
  centerLabel = "",
  segments = [],
  details = [],
  donutSize = 130,
}) {
  return (
    <section className="flex flex-col items-center rounded-2xl bg-ash p-6">
      {/* Title */}
      <p className="font-polysans text-13 tracking-[0.08em] uppercase text-slate">
        {label}
      </p>

      {/* Donut chart */}
      <div className="mt-5">
        <RoundedDonut
          size={donutSize}
          stroke={10}
          segments={segments}
          centerText={centerText}
          centerLabel={centerLabel}
          gap={5}
        />
      </div>

      {/* Segment legend — dots + labels */}
      {segments.length > 0 && (
        <div className="mt-4 flex flex-wrap items-center justify-center gap-x-4 gap-y-1">
          {segments.map((seg, i) => (
            <div key={i} className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full" style={{ backgroundColor: seg.color }} />
              <span className="text-11 text-slate">{seg.label}</span>
            </div>
          ))}
        </div>
      )}

      {/* Detailed breakdown below */}
      {details.length > 0 && (
        <div className="mt-4 w-full space-y-3 border-t border-mist pt-4">
          {details.map((d, i) => (
            <div key={i}>
              <div className="flex items-center justify-between text-13">
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full" style={{ backgroundColor: d.color }} />
                  <span className="text-steel">{d.label}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="font-polysans text-graphite">{d.value}</span>
                  {d.subtext && (
                    <span className="text-11 text-slate">{d.subtext}</span>
                  )}
                </div>
              </div>
              {d.percent !== undefined && (
                <div className="mt-1.5 h-1.5 w-full rounded-full bg-fog">
                  <div
                    className="h-full rounded-full"
                    style={{ width: `${d.percent}%`, backgroundColor: d.color }}
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
