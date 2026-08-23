"use client";

/**
 * RadarSweep — animated radar-sweep loading indicator.
 * Uses the app's theme tokens (ember, mist, graphite) for consistent styling.
 *
 * @param {number} size — diameter in px (default 80)
 */
export default function RadarSweep({ size = 80 }) {
  const center = size / 2;
  const trackR = center - 4;
  const sweepR = center - 4;

  return (
    <div className="flex flex-col items-center gap-4">
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="animate-radar-spin"
      >
        {/* Track ring */}
        <circle
          cx={center}
          cy={center}
          r={trackR}
          fill="none"
          stroke="var(--color-mist)"
          strokeWidth={2}
        />

        {/* Cross-hairs */}
        <line
          x1={center}
          y1={4}
          x2={center}
          y2={size - 4}
          stroke="var(--color-mist)"
          strokeWidth={1}
          opacity={0.5}
        />
        <line
          x1={4}
          y1={center}
          x2={size - 4}
          y2={center}
          stroke="var(--color-mist)"
          strokeWidth={1}
          opacity={0.5}
        />

        {/* Inner ring */}
        <circle
          cx={center}
          cy={center}
          r={trackR / 2}
          fill="none"
          stroke="var(--color-mist)"
          strokeWidth={1}
          opacity={0.4}
        />

        {/* Sweep wedge (rotating) */}
        <defs>
          <linearGradient id="sweepGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="var(--color-ember)" stopOpacity={0.9} />
            <stop offset="100%" stopColor="var(--color-ember)" stopOpacity={0} />
          </linearGradient>
        </defs>
        <path
          d={`M ${center} ${center} L ${center} ${4} A ${sweepR} ${sweepR} 0 0 1 ${center + sweepR * 0.38} ${center - sweepR * 0.92} Z`}
          fill="url(#sweepGrad)"
          opacity={0.7}
        />

        {/* Center dot */}
        <circle cx={center} cy={center} r={3} fill="var(--color-ember)" />
      </svg>
    </div>
  );
}
