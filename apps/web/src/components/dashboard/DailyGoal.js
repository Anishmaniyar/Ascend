import { dailyGoal } from "@/lib/mock/dashboard";

export default function DailyGoal() {
  const pct = Math.round((dailyGoal.done / dailyGoal.target) * 100);
  return (
    <div className="flex h-full flex-col rounded-2xl bg-ash p-6">
      <p className="font-polysans text-13 tracking-[-0.02em] text-slate">
        {dailyGoal.label}
      </p>
      <p className="mt-3 font-polysans text-heading tracking-[-0.02em] text-graphite">
        {dailyGoal.done}
        <span className="text-heading text-steel"> / {dailyGoal.target}</span>
      </p>
      <p className="mt-1 text-13 text-slate">{dailyGoal.unit}</p>
      <div className="mt-5 h-2 w-full rounded-full bg-canvas">
        <div
          className="h-full rounded-full bg-ember"
          style={{ width: `${pct}%` }}
        />
      </div>
      <p className="mt-3 text-13 text-steel">
        {pct}% complete — {dailyGoal.target - dailyGoal.done} to go
      </p>
    </div>
  );
}
