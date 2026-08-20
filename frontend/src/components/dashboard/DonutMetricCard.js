import RingProgress from "@/components/charts/RingProgress";

/**
 * DonutMetricCard — a card with a large donut ring showing a metric.
 *
 * @param {string}  label      — Card title (e.g. "Questions Solved")
 * @param {number|string} value — The main numeric value to display
 * @param {string}  valueLabel — Label under the value (e.g. "Solved")
 * @param {string}  subtitle   — Bottom subtitle (e.g. "324 / 1000")
 * @param {number}  percent    — Progress percentage for the ring (0-100)
 * @param {ReactNode} children — Optional breakdown details below the ring
 */
export default function DonutMetricCard({
  label,
  value,
  valueLabel,
  subtitle,
  percent = 0,
  children,
}) {
  return (
    <section className="flex flex-col items-center rounded-2xl bg-ash p-6">
      {/* Title */}
      <p className="font-polysans text-13 tracking-[0.08em] uppercase text-slate">
        {label}
      </p>

      {/* Donut */}
      <div className="mt-5">
        <RingProgress
          value={percent}
          size={120}
          strokeWidth={8}
          className="mx-auto"
        >
          <div className="flex flex-col items-center">
            <span className="font-polysans text-heading tracking-[-0.02em] text-graphite">
              {value}
            </span>
            {valueLabel && (
              <span className="text-13 text-slate">{valueLabel}</span>
            )}
          </div>
        </RingProgress>
      </div>

      {/* Breakdown details (e.g. Easy/Medium/Hard, Practice/Test) */}
      {children && <div className="mt-4 w-full">{children}</div>}

      {/* Bottom subtitle */}
      {subtitle && !children && (
        <p className="mt-4 text-13 text-slate">{subtitle}</p>
      )}
    </section>
  );
}
