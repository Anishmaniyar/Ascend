/**
 * LineChart — flat mini line/area chart. Ember primary series with a brass
 * secondary line, thin strokes, mist grid — the "charts ARE the imagery"
 * style of the design system.
 */
const W = 320;
const H = 120;
const PAD = 6;
const SERIES = [
  { values: [12, 18, 15, 22, 28, 24, 32, 38, 35, 42, 48, 52], color: "var(--color-ember)" },
  { values: [20, 22, 25, 24, 28, 30, 33, 32, 36, 40, 41, 45], color: "var(--color-brass)" },
];
const MAX = 60;

function points(values) {
  return values
    .map((v, i) => {
      const x = PAD + (i / (values.length - 1)) * (W - PAD * 2);
      const y = H - PAD - (v / MAX) * (H - PAD * 2);
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");
}

export default function LineChart({ className = "" }) {
  const primary = SERIES[0];
  const area = points(primary.values);

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      className={`w-full ${className}`}
      role="img"
      aria-label="Progress over time"
    >
      {/* Horizontal grid */}
      {[0.25, 0.5, 0.75].map((f) => (
        <line
          key={f}
          x1={PAD}
          x2={W - PAD}
          y1={H - f * (H - PAD * 2)}
          y2={H - f * (H - PAD * 2)}
          stroke="var(--color-mist)"
          strokeWidth="1"
        />
      ))}

      {/* Area under the primary series */}
      <polygon
        points={`${PAD},${H - PAD} ${area} ${W - PAD},${H - PAD}`}
        fill="var(--color-ember)"
        opacity="0.08"
      />

      {SERIES.map((s) => (
        <polyline
          key={s.color}
          points={points(s.values)}
          fill="none"
          stroke={s.color}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      ))}

      {/* End dots */}
      {SERIES.map((s) => {
        const last = s.values[s.values.length - 1];
        const x = W - PAD;
        const y = H - PAD - (last / MAX) * (H - PAD * 2);
        return <circle key={s.color} cx={x} cy={y} r="3" fill={s.color} />;
      })}
    </svg>
  );
}
