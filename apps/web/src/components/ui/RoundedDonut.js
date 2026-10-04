"use client";

/**
 * RoundedDonut — a multi-segment donut chart with rounded stroke-linecap.
 *
 * @param {object} props
 * @param {number}  props.size       — overall SVG width/height (px)
 * @param {number}  props.stroke     — thickness of the ring
 * @param {Array}   props.segments   — [{ value, color, label }]
 * @param {string}  props.centerText — main value in the center
 * @param {string}  props.centerLabel— label below center text
 * @param {number}  props.gap        — degrees of gap between segments
 */
export default function RoundedDonut({
  size = 120,
  stroke = 12,
  segments = [],
  centerText = "",
  centerLabel = "",
  gap = 4,
}) {
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const center = size / 2;

  // Calculate total and percentages
  const total = segments.reduce((sum, s) => sum + s.value, 0);
  if (total === 0) return null;

  // Convert gap from degrees to a fraction of circumference
  const gapLength = (gap / 360) * circumference;
  const totalGaps = segments.length * gapLength;
  const availableLength = circumference - totalGaps;

  // Build segment data with dash arrays
  let accumulated = 0;
  const segmentData = segments.map((seg) => {
    const fraction = seg.value / total;
    const segLength = fraction * availableLength;
    const dashArray = `${segLength} ${circumference - segLength}`;
    const dashOffset = -accumulated;
    accumulated += segLength + gapLength;
    return { ...seg, dashArray, dashOffset, fraction };
  });

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        {/* Background track */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke="var(--color-mist)"
          strokeWidth={stroke}
          opacity={0.3}
        />
        {/* Segments */}
        {segmentData.map((seg, i) => (
          <circle
            key={i}
            cx={center}
            cy={center}
            r={radius}
            fill="none"
            stroke={seg.color}
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeDasharray={seg.dashArray}
            strokeDashoffset={seg.dashOffset}
            className="transition-all duration-700 ease-out"
          />
        ))}
      </svg>
      {/* Center text */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        {centerText && (
          <span className="font-polysans text-graphite" style={{ fontSize: size * 0.18, lineHeight: 1.1 }}>
            {centerText}
          </span>
        )}
        {centerLabel && (
          <span className="text-slate" style={{ fontSize: size * 0.09 }}>
            {centerLabel}
          </span>
        )}
      </div>
    </div>
  );
}
