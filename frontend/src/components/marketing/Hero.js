import Link from "next/link";
import { ArrowRightIcon } from "@/components/ui/icons";
import Button from "@/components/ui/Button";

/* ── Floating product-context pills ───────────────────────────────────────
   Small, real pieces of LeetAptitude data that communicate what the
   product contains — NOT feature cards, just lightweight context. */

const PRODUCT_PILLS = [
  { label: "Quantitative Aptitude", detail: "12 Subtopics", side: "left", row: 0 },
  { label: "Logical Reasoning", detail: "9 Subtopics", side: "right", row: 0 },
  { label: "Profit & Loss", detail: "24 Questions", side: "left", row: 1 },
  { label: "TCS", detail: "Aptitude Set", side: "right", row: 1 },
  { label: "Practice Session", detail: "18 / 20 Completed", side: "left", row: 2 },
  { label: "Accuracy", detail: "82%", side: "right", row: 2 },
];

function ProductPill({ label, detail, side }) {
  return (
    <div
      className={`animate-fade-up flex items-center gap-3 rounded-xl border border-mist bg-canvas/80 px-4 py-3 backdrop-blur-sm ${
        side === "right" ? "flex-row-reverse text-right" : ""
      }`}
    >
      <div>
        <p className="font-polysans text-13 tracking-[-0.02em] text-graphite">
          {label}
        </p>
        <p className="text-13 text-slate">{detail}</p>
      </div>
    </div>
  );
}

export default function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="mx-auto max-w-[var(--page-max-width)] px-6 pb-24 pt-20 md:pt-28">
        {/* ── Main content — centered ─────────────────────────────────── */}
        <div className="relative mx-auto max-w-[720px] text-center">
          {/* Eyebrow */}
          <p className="inline-flex items-center gap-2.5 rounded-tags bg-ash px-4 py-1.5 text-13 uppercase tracking-[0.08em] text-slate">
            <span className="h-1.5 w-1.5 rounded-full bg-ember" />
            Placement Aptitude Practice
          </p>

          {/* Headline */}
          <h1 className="mx-auto mt-8 max-w-[16ch] font-polysans text-heading-lg tracking-[-0.03em] text-graphite">
            Prepare smarter.
            <br />
            <span className="relative inline-block">
              Practice with purpose.
              <span className="absolute -bottom-3 left-0 h-[3px] w-full rounded-full bg-ember" />
            </span>
          </h1>

          {/* Description */}
          <p className="mx-auto mt-10 max-w-[54ch] text-subheading leading-relaxed text-steel">
            Master aptitude topic by topic, practice through realistic sessions,
            and prepare for the companies you want to crack.
          </p>

          {/* CTAs */}
          <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
            <Button render={<Link href="/register" />} variant="primary" size="lg">
              Start Practicing
              <ArrowRightIcon className="h-4 w-4 btn-arrow transition-transform duration-150" />
            </Button>
            <Button render={<Link href="/topics" />} variant="secondary" size="lg">
              Explore Topics
            </Button>
          </div>
        </div>

        {/* ── Floating product-context pills ──────────────────────────── */}
        <div className="relative mx-auto mt-20 hidden max-w-[800px] md:block">
          {/* Left column */}
          <div className="absolute left-0 top-0 flex w-[260px] flex-col gap-4">
            {PRODUCT_PILLS.filter((p) => p.side === "left").map((pill, i) => (
              <div
                key={pill.label}
                className="animate-fade-up"
                style={{ animationDelay: `${0.2 + i * 0.12}s` }}
              >
                <ProductPill {...pill} />
              </div>
            ))}
          </div>

          {/* Right column */}
          <div className="absolute right-0 top-0 flex w-[260px] flex-col gap-4">
            {PRODUCT_PILLS.filter((p) => p.side === "right").map((pill, i) => (
              <div
                key={pill.label}
                className="animate-fade-up"
                style={{ animationDelay: `${0.35 + i * 0.12}s` }}
              >
                <ProductPill {...pill} />
              </div>
            ))}
          </div>

          {/* Center — bottom positioning statement */}
          <div className="flex min-h-[280px] items-center justify-center">
            <p className="max-w-[36ch] text-center text-15 leading-relaxed text-slate">
              Practice by topic. Prepare by company. Improve every session.
            </p>
          </div>
        </div>

        {/* ── Mobile: pills as a compact list ─────────────────────────── */}
        <div className="mt-16 md:hidden">
          <div className="mx-auto grid max-w-[400px] grid-cols-2 gap-3">
            {PRODUCT_PILLS.map((pill) => (
              <ProductPill key={pill.label} {...pill} />
            ))}
          </div>
          <p className="mt-8 text-center text-15 leading-relaxed text-slate">
            Practice by topic. Prepare by company. Improve every session.
          </p>
        </div>
      </div>
    </section>
  );
}
