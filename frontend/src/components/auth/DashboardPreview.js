/**
 * DashboardPreview — a static, non-interactive representation of the
 * LeetAptitude dashboard used on the sign-up page's right column.
 *
 * It communicates the product at a glance: metrics, heatmap, recent practice,
 * and topic progress — all rendered with the real design-system tokens so it
 * feels like the actual app.
 */
import RingProgress from "@/components/charts/RingProgress";

/* ── Tiny helper sub-components (all inline, no external deps) ────────── */

function MetricRing({ label, value, valueLabel, percent }) {
  return (
    <div className="flex flex-col items-center gap-2">
      <RingProgress value={percent} size={72} strokeWidth={5}>
        <span className="font-polysans text-[15px] tracking-[-0.02em] text-graphite">
          {value}
        </span>
      </RingProgress>
      <span className="text-[11px] uppercase tracking-[0.06em] text-slate">
        {label}
      </span>
      {valueLabel && (
        <span className="text-[11px] text-slate">{valueLabel}</span>
      )}
    </div>
  );
}

function StatPill({ icon, value, label }) {
  return (
    <div className="flex items-center gap-2 rounded-[8px] bg-fog px-3 py-2">
      <span className="text-ember">{icon}</span>
      <div className="flex flex-col">
        <span className="font-polysans text-[13px] tracking-[-0.02em] text-graphite">
          {value}
        </span>
        <span className="text-[10px] text-slate">{label}</span>
      </div>
    </div>
  );
}

function DifficultyBar({ label, solved, total, color }) {
  const pct = total > 0 ? Math.round((solved / total) * 100) : 0;
  return (
    <div className="flex items-center gap-2">
      <span className={`h-1.5 w-1.5 rounded-full ${color}`} />
      <span className="w-12 text-[10px] text-slate">{label}</span>
      <div className="h-1 flex-1 rounded-full bg-fog">
        <div className={`h-full rounded-full ${color}`} style={{ width: `${pct}%` }} />
      </div>
      <span className="w-6 text-right font-polysans text-[10px] text-graphite">
        {solved}
      </span>
    </div>
  );
}

/* ── Fake heatmap (deterministic pattern) ─────────────────────────────── */
function MiniHeatmap() {
  // 12 weeks × 7 days — deterministic pattern
  const pattern = [
    [0,0,2,1,0,3,0],
    [1,0,0,2,0,1,0],
    [0,3,1,0,2,0,1],
    [0,0,0,1,3,0,2],
    [2,1,0,0,0,2,0],
    [0,0,3,1,0,0,1],
    [1,0,0,0,2,3,0],
    [0,2,0,1,0,0,2],
    [3,0,1,0,0,2,0],
    [0,1,0,0,3,0,1],
    [0,0,2,1,0,0,3],
    [1,0,0,0,2,1,0],
  ];
  const OPACITY = [0.25, 0.45, 0.7, 1];

  return (
    <div className="flex flex-col gap-[2px]">
      {pattern.map((week, wi) => (
        <div key={wi} className="flex gap-[2px]">
          {week.map((level, di) => (
            <div
              key={di}
              className="h-[10px] w-[10px] rounded-[2px]"
              style={{
                backgroundColor: level ? "var(--color-ember)" : "var(--color-fog)",
                opacity: level ? OPACITY[level - 1] : 1,
              }}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

/* ── Main preview ─────────────────────────────────────────────────────── */
export default function DashboardPreview() {
  return (
    <div className="pointer-events-none select-none relative w-full max-w-[680px]">
      {/* Gradient masks: top, bottom, and sides fade into canvas */}
      <div
        className="absolute inset-0 z-20"
        style={{
          background: `
            linear-gradient(to bottom, var(--color-canvas) 0%, transparent 12%),
            linear-gradient(to top, var(--color-canvas) 0%, transparent 30%),
            linear-gradient(to right, var(--color-canvas) 0%, transparent 18%),
            linear-gradient(to left, transparent 80%, var(--color-canvas) 100%)
          `,
        }}
      />

      {/* Dashboard card content */}
      <div className="relative z-10 space-y-4 rounded-2xl bg-ash p-5 opacity-80">
        {/* Header row */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-fog font-polysans text-[11px] text-graphite">
              AM
            </div>
            <div>
              <p className="font-polysans text-[13px] tracking-[-0.02em] text-graphite">
                Anish Maniyar
              </p>
              <p className="text-[10px] text-slate">7 day streak 🔥</p>
            </div>
          </div>
          <div className="flex gap-2">
            <span className="rounded-full bg-fog px-2.5 py-0.5 text-[10px] text-slate">
              Dashboard
            </span>
          </div>
        </div>

        {/* Continue Practice card */}
        <div className="rounded-xl border border-mist bg-canvas p-3.5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[11px] uppercase tracking-[0.06em] text-slate">
                Continue Practice
              </p>
              <p className="mt-1 font-polysans text-[13px] tracking-[-0.02em] text-graphite">
                Profit &amp; Loss
              </p>
              <p className="text-[10px] text-slate">Quantitative Aptitude</p>
            </div>
            <div className="flex flex-col items-end gap-1.5">
              <span className="font-polysans text-[11px] text-graphite">12/20</span>
              <div className="h-1 w-16 rounded-full bg-fog">
                <div className="h-full w-[60%] rounded-full bg-ember" />
              </div>
            </div>
          </div>
        </div>

        {/* Metric rings row */}
        <div className="grid grid-cols-3 gap-3">
          <MetricRing label="Solved" value="324" percent={32} />
          <MetricRing label="Accuracy" value="81%" percent={81} />
          <MetricRing label="Sessions" value="28" percent={56} />
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-4 gap-2">
          <StatPill icon="📈" value="142" label="Easy" />
          <StatPill icon="📊" value="138" label="Medium" />
          <StatPill icon="🔥" value="44" label="Hard" />
          <StatPill icon="⭐" value="7" label="Streak" />
        </div>

        {/* Heatmap + topic progress row */}
        <div className="grid grid-cols-[1fr_1fr] gap-4">
          {/* Activity */}
          <div className="rounded-xl bg-fog/50 p-3">
            <p className="mb-2 text-[11px] uppercase tracking-[0.06em] text-slate">
              Activity
            </p>
            <MiniHeatmap />
          </div>

          {/* Topic progress */}
          <div className="space-y-2.5 rounded-xl bg-fog/50 p-3">
            <p className="text-[11px] uppercase tracking-[0.06em] text-slate">
              Topic Progress
            </p>
            <DifficultyBar label="Quant" solved={145} total={250} color="bg-ember" />
            <DifficultyBar label="Logic" solved={63} total={120} color="bg-brass" />
            <DifficultyBar label="Verbal" solved={42} total={100} color="bg-success" />
            <DifficultyBar label="DI" solved={16} total={80} color="bg-slate" />
          </div>
        </div>

        {/* Recent practice */}
        <div className="rounded-xl bg-fog/50 p-3">
          <p className="mb-2 text-[11px] uppercase tracking-[0.06em] text-slate">
            Recent Practice
          </p>
          <div className="space-y-1.5">
            {[
              { sub: "Profit & Loss", score: "15/18", acc: "83%", when: "Yesterday" },
              { sub: "Time & Work", score: "11/12", acc: "92%", when: "2 days ago" },
              { sub: "Number System", score: "15/20", acc: "75%", when: "Last week" },
            ].map((row) => (
              <div
                key={row.sub}
                className="flex items-center justify-between rounded-lg bg-canvas px-2.5 py-1.5"
              >
                <span className="font-polysans text-[11px] text-graphite">
                  {row.sub}
                </span>
                <div className="flex items-center gap-3 text-[10px] text-slate">
                  <span>{row.score}</span>
                  <span className="text-success">{row.acc}</span>
                  <span>{row.when}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
