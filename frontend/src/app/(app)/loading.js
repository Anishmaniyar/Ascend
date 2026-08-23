import RadarSweep from "@/components/ui/RadarSweep";

export default function AppLoading() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <RadarSweep size={72} />
      <p className="mt-4 text-13 text-slate">Loading…</p>
    </div>
  );
}
