/**
 * ChartTooltip — recharts tooltip content component.
 * Adapted from @subhanhq/amicro DitherChartTooltipContent.
 */
export function ChartTooltipContent({
  active,
  payload,
  label,
  indicator = "dot",
  formatter,
}) {
  if (!active || !payload || payload.length === 0) return null;

  return (
    <div className="pointer-events-none z-50 rounded-xl border border-mist bg-graphite/95 px-3 py-2 text-xs text-inverse shadow-2xl backdrop-blur-md">
      {label && (
        <div className="mb-1.5 border-b border-white/10 pb-1 font-medium tracking-tight text-neutral-300">
          {label}
        </div>
      )}
      <div className="flex flex-col gap-1">
        {payload.map((item, idx) => {
          const color = item.color || item.fill || "#FFFFFF";
          const valueDisplay = formatter
            ? formatter(item.value, item.name)
            : typeof item.value === "number"
              ? item.value.toLocaleString()
              : item.value;

          return (
            <div key={idx} className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-1.5">
                {indicator === "dot" && (
                  <span
                    className="h-2 w-2 rounded-full ring-1 ring-white/20"
                    style={{ backgroundColor: color }}
                  />
                )}
                {indicator === "line" && (
                  <span
                    className="h-0.5 w-2.5 rounded-full"
                    style={{ backgroundColor: color }}
                  />
                )}
                <span className="font-normal text-neutral-400">
                  {item.name || item.dataKey}:
                </span>
              </div>
              <span className="font-semibold tabular-nums">{valueDisplay}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
