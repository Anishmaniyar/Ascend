import {
  TrendingUpIcon,
  TargetIcon,
  FlameIcon,
  ClockIcon,
} from "@/components/ui/icons";

const ICONS = {
  trend: TrendingUpIcon,
  target: TargetIcon,
  flame: FlameIcon,
  clock: ClockIcon,
};

export default function StatCard({ label, value, suffix = "", icon }) {
  const Icon = ICONS[icon] ?? TrendingUpIcon;
  return (
    <div className="group rounded-2xl bg-ash p-5 transition-colors hover:bg-fog">
      <div className="flex items-center justify-between">
        <p className="text-13 text-slate">{label}</p>
        <Icon className="h-4 w-4 text-steel transition-colors group-hover:text-ember" />
      </div>
      <p className="mt-3 font-polysans text-heading-lg tracking-[-0.02em] text-graphite">
        {value}
        {suffix && <span className="text-heading text-steel">{suffix}</span>}
      </p>
    </div>
  );
}
