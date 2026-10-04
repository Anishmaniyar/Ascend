import Reveal from "./Reveal";

/* ── Miniature product UIs — monochrome, hairline, quiet ── */

function Bar({ w, strong = false }) {
  return (
    <div className="h-1 rounded-full bg-mist">
      <div
        className={`h-full rounded-full ${strong ? "bg-graphite" : "bg-mist-strong"}`}
        style={{ width: w }}
      />
    </div>
  );
}

const MINIS = {
  topics: (
    <div className="space-y-2">
      {[
        ["Quantitative Aptitude", "320 Qs", "48%"],
        ["Logical Reasoning", "210 Qs", "35%"],
        ["Verbal Ability", "160 Qs", "62%"],
      ].map(([t, q, p]) => (
        <div key={t} className="rounded-lg border border-mist bg-canvas p-2.5">
          <div className="flex items-center justify-between">
            <span className="font-inter text-[11px] font-medium text-graphite">{t}</span>
            <span className="font-inter text-[10px] text-slate">{q}</span>
          </div>
          <div className="mt-2">
            <Bar w={p} strong />
          </div>
        </div>
      ))}
    </div>
  ),
  practice: (
    <div className="rounded-lg border border-mist bg-canvas p-3">
      <div className="h-1.5 w-3/4 rounded-full bg-mist-strong" />
      <div className="mt-2.5 space-y-1.5">
        {["A", "B", "C"].map((o, i) => (
          <div
            key={o}
            className={`flex items-center gap-2 rounded-md border px-2 py-1.5 ${
              i === 1 ? "border-graphite" : "border-mist"
            }`}
          >
            <span
              className={`flex h-4 w-4 items-center justify-center rounded-full font-inter text-[8px] ${
                i === 1 ? "bg-graphite text-canvas" : "bg-ash text-slate"
              }`}
            >
              {o}
            </span>
            <div className="h-1 flex-1 rounded-full bg-mist" />
          </div>
        ))}
      </div>
    </div>
  ),
  companies: (
    <div className="space-y-1.5">
      {[
        ["TCS NQT", "12 sheets"],
        ["Infosys", "10 sheets"],
        ["Accenture", "8 sheets"],
      ].map(([c, s]) => (
        <div
          key={c}
          className="flex items-center gap-2 rounded-lg border border-mist bg-canvas px-2.5 py-2"
        >
          <span className="flex h-6 w-6 items-center justify-center rounded-md bg-ash font-inter text-[10px] font-medium text-graphite">
            {c.charAt(0)}
          </span>
          <span className="font-inter text-[11px] font-medium text-graphite">{c}</span>
          <span className="ml-auto font-inter text-[10px] text-slate">{s}</span>
        </div>
      ))}
    </div>
  ),
  difficulty: (
    <div className="grid grid-cols-3 gap-1.5">
      {[
        ["Easy", "120"],
        ["Medium", "240"],
        ["Hard", "96"],
      ].map(([d, n], i) => (
        <div
          key={d}
          className={`rounded-lg border p-2.5 text-center ${
            i === 1 ? "border-graphite bg-canvas" : "border-mist bg-canvas"
          }`}
        >
          <p className="font-inter text-[11px] font-medium text-graphite">{d}</p>
          <p className="mt-0.5 font-inter text-[10px] text-slate">{n} Qs</p>
        </div>
      ))}
    </div>
  ),
  sessions: (
    <div className="rounded-lg border border-mist bg-canvas p-3">
      <div className="flex items-baseline justify-between">
        <span className="font-inter text-[16px] font-medium text-graphite">18/20</span>
        <span className="font-inter text-[10px] text-slate">Session 14</span>
      </div>
      <div className="mt-2">
        <Bar w="90%" strong />
      </div>
      <div className="mt-2 flex gap-1.5">
        <span className="rounded-md bg-ash px-1.5 py-0.5 font-inter text-[10px] text-steel">82% acc.</span>
        <span className="rounded-md bg-ash px-1.5 py-0.5 font-inter text-[10px] text-steel">~30 min</span>
      </div>
    </div>
  ),
  progress: (
    <div className="rounded-lg border border-mist bg-canvas p-3">
      <div className="flex items-end gap-1">
        {[30, 52, 40, 66, 48, 78, 60].map((h, i) => (
          <div
            key={i}
            className={`flex-1 rounded-[3px] ${i === 5 ? "bg-graphite" : "bg-mist-strong"}`}
            style={{ height: `${h * 0.5}px` }}
          />
        ))}
      </div>
      <p className="mt-2 font-inter text-[10px] text-slate">142 questions this week</p>
    </div>
  ),
  streaks: (
    <div className="rounded-lg border border-mist bg-canvas p-3">
      <div className="grid grid-cols-7 gap-1">
        {Array.from({ length: 14 }).map((_, i) => (
          <span
            key={i}
            className={`h-4 rounded-[3px] ${i % 5 === 4 ? "bg-mist" : "bg-graphite"}`}
            style={{ opacity: i % 5 === 4 ? 1 : 0.25 + (i / 14) * 0.75 }}
          />
        ))}
      </div>
      <p className="mt-2 font-inter text-[10px] text-slate">6-day streak · best 14</p>
    </div>
  ),
  accuracy: (
    <div className="flex items-center gap-3 rounded-lg border border-mist bg-canvas p-3">
      <div className="relative flex h-14 w-14 items-center justify-center">
        <svg width={56} height={56} className="-rotate-90">
          <circle cx={28} cy={28} r={23} fill="none" strokeWidth={5} className="stroke-mist" stroke="var(--color-mist)" />
          <circle
            cx={28}
            cy={28}
            r={23}
            fill="none"
            strokeWidth={5}
            strokeLinecap="round"
            strokeDasharray={2 * Math.PI * 23}
            strokeDashoffset={2 * Math.PI * 23 * (1 - 0.78)}
            stroke="var(--color-graphite)"
          />
        </svg>
        <span className="absolute font-inter text-[11px] font-medium text-graphite">78%</span>
      </div>
      <div>
        <p className="font-inter text-[11px] font-medium text-graphite">Overall accuracy</p>
        <p className="font-inter text-[10px] text-slate">+4% this month</p>
      </div>
    </div>
  ),
  history: (
    <div className="space-y-1.5">
      {[
        ["Profit & Loss", "83%"],
        ["Time & Work", "92%"],
        ["Number System", "71%"],
      ].map(([s, a]) => (
        <div key={s} className="flex items-center justify-between rounded-md bg-canvas px-2 py-1.5">
          <span className="font-inter text-[11px] text-graphite">{s}</span>
          <span className="font-inter text-[10px] text-slate">{a}</span>
        </div>
      ))}
    </div>
  ),
  discussions: (
    <div className="rounded-lg border border-mist bg-canvas p-3">
      <div className="h-1.5 w-2/3 rounded-full bg-mist-strong" />
      <div className="mt-2 space-y-1.5">
        <div className="rounded-md bg-ash px-2 py-1.5">
          <div className="h-1 w-4/5 rounded-full bg-mist-strong" />
        </div>
        <div className="rounded-md border border-mist px-2 py-1.5">
          <div className="h-1 w-3/5 rounded-full bg-mist" />
        </div>
      </div>
      <p className="mt-2 font-inter text-[10px] text-slate">4 replies · Solutions</p>
    </div>
  ),
  solutions: (
    <div className="rounded-lg border border-mist bg-canvas p-3">
      <div className="flex items-center gap-1.5">
        <span className="flex h-4 w-4 items-center justify-center rounded-full bg-graphite font-inter text-[8px] text-canvas">✓</span>
        <span className="font-inter text-[11px] font-medium text-graphite">14.4%</span>
      </div>
      <div className="mt-2 space-y-1">
        <div className="h-1 rounded-full bg-mist" />
        <div className="h-1 w-4/5 rounded-full bg-mist" />
        <div className="h-1 w-3/5 rounded-full bg-mist" />
      </div>
      <p className="mt-2 font-inter text-[10px] text-slate">Step-by-step explanation</p>
    </div>
  ),
  companyPrep: (
    <div className="rounded-lg border border-mist bg-canvas p-3">
      <div className="flex items-center gap-2">
        <span className="flex h-7 w-7 items-center justify-center rounded-md bg-ash font-inter text-[11px] font-medium text-graphite">T</span>
        <div>
          <p className="font-inter text-[11px] font-medium text-graphite">TCS NQT · Set 04</p>
          <p className="font-inter text-[10px] text-slate">25 Qs · 60 min · Test mode</p>
        </div>
      </div>
      <div className="mt-2">
        <Bar w="64%" strong />
      </div>
    </div>
  ),
};

const CARDS = [
  { key: "topics", title: "Topics", desc: "Quant, Logical and Verbal tracks with subtopic-level progress." },
  { key: "practice", title: "Focused Practice", desc: "One question at a time, with clean MCQ controls." },
  { key: "companies", title: "Company Sheets", desc: "Curated sets modelled on real placement patterns." },
  { key: "difficulty", title: "Difficulty", desc: "Easy, Medium and Hard tiers for every subtopic." },
  { key: "sessions", title: "Practice Sessions", desc: "Structured sets with progress, timer and resume." },
  { key: "progress", title: "Progress", desc: "Questions solved and accuracy, week over week." },
  { key: "streaks", title: "Streaks", desc: "A quiet calendar that rewards showing up daily." },
  { key: "accuracy", title: "Accuracy", desc: "Per-topic accuracy that points to what needs work." },
  { key: "history", title: "History", desc: "Every past session, score and revisit in one place." },
  { key: "discussions", title: "Discussions", desc: "Ask why an answer works and learn from others." },
  { key: "solutions", title: "Solutions", desc: "Every answer paired with a short explanation." },
  { key: "companyPrep", title: "Company Preparation", desc: "Test-mode sets for the companies you target." },
];

export function FeatureIntro() {
  return (
    <section id="topics" className="bg-canvas px-6 pt-[160px] md:pt-[184px]">
      <div className="mx-auto max-w-[1112px] text-center">
        <Reveal>
          <h2
            className="editorial-heading mx-auto max-w-[620px] text-graphite"
            style={{ fontSize: "clamp(30px, 4vw, 38px)", lineHeight: "42px" }}
          >
            Everything you need to practice better.
          </h2>
        </Reveal>
        <Reveal delay={100}>
          <p className="mx-auto mt-4 max-w-[560px] font-inter text-[15px] leading-[24px] text-steel">
            Topics lead to subtopics, subtopics to company sheets, sheets to
            practice sessions — and every session feeds your progress.
          </p>
        </Reveal>
      </div>
    </section>
  );
}

export function BentoGrid() {
  return (
    <section className="bg-canvas px-6 pt-14 md:pt-16">
      <div className="mx-auto grid max-w-[1112px] grid-cols-1 gap-3.5 sm:grid-cols-2 lg:grid-cols-3">
        {CARDS.map((card, i) => (
          <Reveal key={card.key} delay={(i % 3) * 70}>
            <div className="flex h-full flex-col rounded-cards bg-ash p-4">
              <div className="min-h-[148px] flex-1">{MINIS[card.key]}</div>
              <div className="mt-4 px-1 pb-1">
                <p className="font-inter text-[14px] font-medium leading-[25px] text-graphite">
                  {card.title}
                </p>
                <p className="mt-0.5 font-inter text-[12px] font-normal leading-relaxed text-steel">
                  {card.desc}
                </p>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
