import { trustStats } from "@/lib/mock/landing";

export default function TrustBar() {
  return (
    <section className="border-y border-mist bg-canvas">
      <div className="mx-auto grid max-w-[var(--page-max-width)] grid-cols-2 gap-x-6 gap-y-10 px-6 py-12 md:grid-cols-4">
        {trustStats.map((stat) => (
          <div key={stat.label} className="text-center">
            <p className="font-polysans text-heading-lg tracking-[-0.02em] text-graphite">
              {stat.value}
            </p>
            <p className="mt-1.5 text-caption text-slate">{stat.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
