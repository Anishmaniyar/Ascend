/**
 * RingProgress — flat SVG circular progress indicator.
 * Ember stroke on a mist track; no shadows, per the design system.
 */
export default function RingProgress({
  value = 0,
  size = 56,
  strokeWidth = 5,
  className = "",
  labelClassName = "",
  children,
}) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const clamped = Math.min(100, Math.max(0, value));
  const offset = circumference - (clamped / 100) * circumference;

  return (
    <div
      className={`relative inline-flex items-center justify-center ${className}`}
      style={{ width: size, height: size }}
    >
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="var(--color-mist)"
          strokeWidth={strokeWidth}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="var(--color-ember)"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ transition: "stroke-dashoffset 0.6s ease" }}
        />
      </svg>
      <div
        className={`absolute inset-0 flex items-center justify-center ${labelClassName}`}
      >
        {children ?? `${Math.round(clamped)}%`}
      </div>
    </div>
  );
}
