/**
 * RadialGauge — rounded radial progress gauge (mono-rounded style).
 * Shows solved / total in the center with a thick ember track.
 *
 * @param {number} solved  — Questions solved
 * @param {number} total   — Total questions
 * @param {number} size    — Diameter in px (default 140)
 * @param {number} strokeWidth — Track thickness (default 10)
 */
export default function RadialGauge({
  solved = 0,
  total = 1,
  size = 140,
  strokeWidth = 10,
}) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const safeTotal = total || 1;
  const percent = Math.min(100, Math.max(0, (solved / safeTotal) * 100));
  const offset = circumference - (percent / 100) * circumference;

  return (
    <div
      className="relative inline-flex items-center justify-center"
      style={{ width: size, height: size }}
    >
      <svg width={size} height={size} className="-rotate-90">
        {/* Track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="var(--color-mist)"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
        />
        {/* Fill */}
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

      {/* Center label */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-polysans text-heading tracking-[-0.02em] text-graphite">
          {solved}/{total}
        </span>
        <span className="text-13 text-slate">Solved</span>
      </div>
    </div>
  );
}
