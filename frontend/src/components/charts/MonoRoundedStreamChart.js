"use client";

import { useId } from "react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";
import { ChartTooltipContent } from "./ChartTooltip";

/**
 * MonoRoundedStreamChart — stream/area chart for subtopic performance.
 * Adapted from @subhanhq/amicro MonoRoundedStreamChart.
 *
 * Props:
 *   data     — array of { name, accuracy, attempted, solved }
 *   compact  — smaller height variant
 */
export default function MonoRoundedStreamChart({
  data = [],
  compact = false,
}) {
  const idPrefix = useId().replace(/:/g, "");

  // Transform data for recharts — use accuracy as primary wave,
  // normalize attempted for secondary wave
  const maxAttempted = Math.max(...data.map((d) => d.attempted), 1);
  const chartData = data.map((d) => ({
    t: d.name.length > 10 ? d.name.slice(0, 10) + "…" : d.name,
    fullName: d.name,
    accuracy: d.accuracy,
    activity: Math.round((d.attempted / maxAttempted) * 100),
    attempted: d.attempted,
    solved: d.solved,
  }));

  return (
    <div
      className={`relative flex w-full flex-col justify-between overflow-hidden rounded-[24px] border border-mist bg-ash p-4 transition-all duration-300 sm:p-5 ${
        compact ? "h-[220px] sm:h-[268px]" : "min-h-[290px]"
      }`}
    >
      {/* Header */}
      <div className="mb-1 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate">
              Stream Wave
            </span>
            <span className="inline-flex items-center rounded-full border border-mist bg-canvas px-1.5 py-0.5 font-mono text-[10px] text-graphite">
              Fluid
            </span>
          </div>
          <div className="mt-0.5 font-sans text-xl font-bold tracking-tight tabular-nums text-graphite">
            {data.length}{" "}
            <span className="text-xs font-normal text-slate">subtopics</span>
          </div>
        </div>
      </div>

      {/* Main Stage */}
      <div className="relative flex-1 overflow-hidden rounded-[14px] bg-fog/50 p-2 transition-colors duration-300">
        {/* Gradient defs */}
        <svg className="pointer-events-none absolute h-0 w-0">
          <defs>
            <linearGradient
              id={`${idPrefix}-stream-g1`}
              x1="0"
              y1="0"
              x2="0"
              y2="1"
            >
              <stop
                offset="0%"
                stopColor="var(--color-ember)"
                stopOpacity={0.35}
              />
              <stop
                offset="100%"
                stopColor="var(--color-ember)"
                stopOpacity={0.03}
              />
            </linearGradient>
            <linearGradient
              id={`${idPrefix}-stream-g2`}
              x1="0"
              y1="0"
              x2="0"
              y2="1"
            >
              <stop
                offset="0%"
                stopColor="var(--color-brass)"
                stopOpacity={0.2}
              />
              <stop
                offset="100%"
                stopColor="var(--color-brass)"
                stopOpacity={0.0}
              />
            </linearGradient>
          </defs>
        </svg>

        <ResponsiveContainer width="100%" height={compact ? 130 : 160}>
          <AreaChart
            data={chartData}
            margin={{ top: 12, right: 12, left: -22, bottom: 0 }}
          >
            <XAxis
              dataKey="t"
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 10, fill: "var(--color-slate)" }}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 10, fill: "var(--color-slate)" }}
            />
            <Tooltip
              content={({ active, payload, label }) => {
                if (!active || !payload || payload.length === 0) return null;
                const item = chartData.find((d) => d.t === label);
                return (
                  <div className="pointer-events-none z-50 rounded-xl border border-mist bg-graphite/95 px-3 py-2.5 text-xs text-inverse shadow-2xl backdrop-blur-md">
                    <div className="mb-1.5 border-b border-white/10 pb-1 font-medium tracking-tight">
                      {item?.fullName ?? label}
                    </div>
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center justify-between gap-4">
                        <span className="flex items-center gap-1.5 text-neutral-400">
                          <span className="h-2 w-2 rounded-full bg-ember" />
                          Accuracy
                        </span>
                        <span className="font-semibold tabular-nums">
                          {item?.accuracy}%
                        </span>
                      </div>
                      <div className="flex items-center justify-between gap-4">
                        <span className="flex items-center gap-1.5 text-neutral-400">
                          <span className="h-2 w-2 rounded-full bg-brass" />
                          Attempted
                        </span>
                        <span className="font-semibold tabular-nums">
                          {item?.attempted}
                        </span>
                      </div>
                      <div className="flex items-center justify-between gap-4">
                        <span className="flex items-center gap-1.5 text-neutral-400">
                          <span className="h-2 w-2 rounded-full bg-success" />
                          Solved
                        </span>
                        <span className="font-semibold tabular-nums">
                          {item?.solved}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              }}
            />
            <Area
              type="natural"
              dataKey="accuracy"
              name="Accuracy"
              stroke="var(--color-ember)"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
              fill={`url(#${idPrefix}-stream-g1)`}
              animationDuration={800}
            />
            <Area
              type="natural"
              dataKey="activity"
              name="Activity"
              stroke="var(--color-brass)"
              strokeWidth={1.5}
              strokeLinecap="round"
              strokeLinejoin="round"
              fill={`url(#${idPrefix}-stream-g2)`}
              animationDuration={900}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Footer */}
      <div className="mt-3 flex items-center justify-between border-t border-mist pt-1 font-mono text-[11px]">
        <span className="text-slate">Rounded Natural Spline</span>
        <span className="font-medium text-graphite">
          Accuracy · Activity Stream
        </span>
      </div>
    </div>
  );
}
