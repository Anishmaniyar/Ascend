"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Reveal from "./Reveal";

/* ═══════════════════════════════════════════════════════════════════
   SHOWCASE — "One platform, every way you practice."
   Wide interactive product window (max 1248px) with 6 tabs:
   Practice · Topics · Companies · Tests · Progress · History.
   Tab switches crossfade: exit (fade/slide/scale) → enter (staggered).
   ═══════════════════════════════════════════════════════════════════ */

const TABS = [
  { id: "Practice", caption: "A focused question interface — difficulty, options, timer and navigation." },
  { id: "Topics", caption: "Four tracks with subtopic progress and question counts." },
  { id: "Companies", caption: "Company sheets modelled on real placement patterns." },
  { id: "Tests", caption: "Timed test mode with duration, difficulty and attempt controls." },
  { id: "Progress", caption: "Accuracy, streaks and activity — restrained, glanceable." },
  { id: "History", caption: "Every session and test, with scores ready to review." },
];

const SIDEBAR = [
  { label: "Practice", tab: "Practice" },
  { label: "Topics", tab: "Topics" },
  { label: "Companies", tab: "Companies" },
  { label: "Tests", tab: "Tests" },
  { label: "Progress", tab: "Progress" },
  { label: "History", tab: "History" },
];

/* ── shared bits ─────────────────────────────────────────────────── */

function Track({ value, className = "" }) {
  return (
    <div className={`h-1 overflow-hidden rounded-full bg-mist ${className}`}>
      <div className="h-full rounded-full bg-graphite" style={{ width: value }} />
    </div>
  );
}

function Stagger({ children, index = 0 }) {
  return (
    <div className="showcase-stagger" style={{ "--d": `${index * 55}ms` }}>
      {children}
    </div>
  );
}

/* ── TAB PANELS ──────────────────────────────────────────────────── */

function PracticePanel() {
  return (
    <div className="grid lg:grid-cols-[1fr_248px]">
      <div className="min-w-0 p-5 sm:p-8">
        <Stagger index={0}>
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-inter text-[11px] text-slate">Time &amp; Work</span>
            <span className="font-inter text-[11px] text-faint">·</span>
            <span className="font-inter text-[11px] text-slate">Question 7 of 20</span>
            <span className="ml-auto rounded-md border border-mist px-2 py-0.5 font-inter text-[11px] text-steel">
              Medium
            </span>
          </div>
        </Stagger>
        <Stagger index={1}>
          <p className="mt-4 max-w-[52ch] font-inter text-[14px] leading-[1.7] text-graphite sm:text-[15px]">
            A and B together can complete a work in 12 days. B alone takes 20
            days to complete the same work. How long will A alone take?
          </p>
        </Stagger>
        <Stagger index={2}>
          <div className="mt-5 grid gap-2 sm:grid-cols-2">
            {["24 days", "30 days", "28 days", "32 days"].map((o, i) => (
              <div
                key={o}
                className={`flex items-center gap-2.5 rounded-lg border px-3.5 py-3 ${
                  i === 1 ? "border-graphite bg-canvas" : "border-mist bg-canvas"
                }`}
              >
                <span
                  className={`flex h-5 w-5 items-center justify-center rounded-full font-inter text-[10px] ${
                    i === 1 ? "bg-graphite text-canvas" : "bg-ash text-slate"
                  }`}
                >
                  {String.fromCharCode(65 + i)}
                </span>
                <span className="font-inter text-[13px] text-graphite">{o}</span>
                {i === 1 && (
                  <span className="ml-auto font-inter text-[10px] text-slate">Selected</span>
                )}
              </div>
            ))}
          </div>
        </Stagger>
        <Stagger index={3}>
          <div className="mt-5 flex items-center gap-3 border-t border-mist pt-5">
            <Track value="35%" className="flex-1" />
            <span className="font-inter text-[11px] tabular-nums text-slate">7 / 20</span>
            <span className="rounded-buttons bg-graphite px-4 py-2 font-inter text-[12px] text-canvas">
              Next
            </span>
          </div>
        </Stagger>
      </div>

      <div className="border-t border-mist p-5 sm:p-6 lg:border-l lg:border-t-0">
        <Stagger index={1}>
          <div className="rounded-xl bg-ash p-3.5">
            <div className="flex items-center justify-between">
              <p className="font-inter text-[10px] uppercase tracking-[0.08em] text-slate">Time left</p>
              <p className="font-inter text-[12px] tabular-nums text-graphite">24:16</p>
            </div>
            <div className="mt-2.5">
              <Track value="35%" />
            </div>
            <div className="mt-3 grid grid-cols-2 gap-2">
              <div className="rounded-lg bg-canvas p-2 text-center">
                <p className="font-inter text-[13px] font-medium text-graphite">7</p>
                <p className="font-inter text-[10px] text-slate">Answered</p>
              </div>
              <div className="rounded-lg bg-canvas p-2 text-center">
                <p className="font-inter text-[13px] font-medium text-graphite">84%</p>
                <p className="font-inter text-[10px] text-slate">Accuracy</p>
              </div>
            </div>
          </div>
        </Stagger>
        <Stagger index={2}>
          <div className="mt-3 grid grid-cols-5 gap-1.5">
            {Array.from({ length: 10 }).map((_, i) => (
              <span
                key={i}
                className={`flex h-7 items-center justify-center rounded-md font-inter text-[10px] ${
                  i === 6 ? "bg-graphite text-canvas" : i < 6 ? "bg-ash text-graphite" : "bg-ash text-slate"
                }`}
              >
                {i + 1}
              </span>
            ))}
          </div>
          <p className="mt-2.5 font-inter text-[10px] text-slate">Showing 1–10 of 20</p>
        </Stagger>
      </div>
    </div>
  );
}

function TopicsPanel() {
  const rows = [
    ["Quantitative Aptitude", "12 subtopics · 320 questions", "48%"],
    ["Logical Reasoning", "10 subtopics · 210 questions", "35%"],
    ["Verbal Ability", "8 subtopics · 160 questions", "62%"],
    ["Data Interpretation", "6 subtopics · 120 questions", "27%"],
  ];
  return (
    <div className="grid gap-6 p-5 sm:p-8 lg:grid-cols-[220px_1fr]">
      <Stagger index={0}>
        <div className="rounded-xl bg-ash p-5 text-center lg:text-left">
          <p className="font-inter text-[10px] uppercase tracking-[0.08em] text-slate">Overall</p>
          <p className="mt-2 font-inter text-[26px] font-medium leading-none text-graphite">43%</p>
          <p className="mt-1.5 font-inter text-[11px] text-slate">486 of 810 questions</p>
          <div className="mt-3">
            <Track value="43%" />
          </div>
        </div>
      </Stagger>
      <div className="grid gap-2.5 sm:grid-cols-2">
        {rows.map(([t, m, p], i) => (
          <Stagger key={t} index={i}>
            <div className="rounded-xl border border-mist bg-canvas p-4">
              <div className="flex items-center justify-between gap-2">
                <p className="font-inter text-[13px] font-medium text-graphite">{t}</p>
                <span className="shrink-0 font-inter text-[11px] tabular-nums text-slate">{p}</span>
              </div>
              <p className="mt-1 font-inter text-[11px] text-slate">{m}</p>
              <div className="mt-3">
                <Track value={p} />
              </div>
            </div>
          </Stagger>
        ))}
      </div>
    </div>
  );
}

function CompaniesPanel() {
  const rows = [
    ["TCS", "TCS NQT · 12 sheets · 150 Qs", "Medium", "64%"],
    ["Infosys", "Infosys SP · 10 sheets · 120 Qs", "Medium", "41%"],
    ["Accenture", "Accenture ADF · 8 sheets · 90 Qs", "Hard", "28%"],
    ["Deloitte", "Deloitte Aptitude · 7 sheets · 84 Qs", "Medium", "52%"],
    ["Capgemini", "Capgemini Exceller · 6 sheets · 75 Qs", "Easy", "73%"],
  ];
  return (
    <div className="grid gap-6 p-5 sm:p-8 lg:grid-cols-[1fr_240px]">
      <div className="divide-y divide-mist rounded-xl border border-mist bg-canvas">
        {rows.map(([c, m, d, p], i) => (
          <Stagger key={c} index={i}>
            <div className="flex items-center gap-3.5 px-4 py-3.5">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-ash font-inter text-[13px] font-medium text-graphite">
                {c.charAt(0)}
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <p className="truncate font-inter text-[13px] font-medium text-graphite">{c}</p>
                  <span className="shrink-0 rounded-md bg-ash px-1.5 py-0.5 font-inter text-[10px] text-steel">{d}</span>
                </div>
                <p className="mt-0.5 truncate font-inter text-[11px] text-slate">{m}</p>
                <div className="mt-2 max-w-[280px]">
                  <Track value={p} />
                </div>
              </div>
              <span className="shrink-0 font-inter text-[11px] tabular-nums text-slate">{p}</span>
            </div>
          </Stagger>
        ))}
      </div>
      <Stagger index={2}>
        <div className="h-full rounded-xl bg-ash p-5">
          <p className="font-inter text-[10px] uppercase tracking-[0.08em] text-slate">Up next</p>
          <p className="mt-2 font-inter text-[14px] font-medium text-graphite">TCS NQT · Set 08</p>
          <p className="mt-1 font-inter text-[11px] leading-relaxed text-slate">25 questions · 60 min · Test mode</p>
          <div className="mt-4 rounded-buttons bg-graphite py-2 text-center font-inter text-[12px] text-canvas">
            Continue sheet
          </div>
          <p className="mt-3 font-inter text-[11px] text-slate">5 of 12 sheets complete</p>
        </div>
      </Stagger>
    </div>
  );
}

function TestsPanel() {
  return (
    <div className="grid gap-6 p-5 sm:p-8 lg:grid-cols-[1fr_240px]">
      <div>
        <Stagger index={0}>
          <div className="rounded-xl border border-mist bg-canvas p-5 sm:p-6">
            <div className="flex flex-wrap items-center gap-2">
              <p className="font-inter text-[15px] font-medium text-graphite">Aptitude Mock · 04</p>
              <span className="rounded-md bg-ash px-2 py-0.5 font-inter text-[10px] text-steel">Hard</span>
              <span className="ml-auto font-inter text-[11px] tabular-nums text-slate">30 Qs · 60 min</span>
            </div>
            <p className="mt-1.5 font-inter text-[12px] text-slate">Mixed quant, logical and verbal · negative marking off</p>
            <div className="mt-4 flex flex-wrap items-center gap-2.5">
              <span className="rounded-buttons bg-graphite px-4 py-2 font-inter text-[12px] text-canvas">Start attempt</span>
              <span className="rounded-buttons border border-mist px-4 py-2 font-inter text-[12px] text-graphite">View syllabus</span>
            </div>
          </div>
        </Stagger>
        <div className="mt-3 grid gap-2 sm:grid-cols-2">
          {[
            ["Aptitude Mock · 03", "Completed · 81%"],
            ["Company Sprint · TCS", "Completed · 76%"],
          ].map(([t, m], i) => (
            <Stagger key={t} index={i + 1}>
              <div className="flex items-center justify-between rounded-xl bg-ash px-4 py-3.5">
                <div>
                  <p className="font-inter text-[12px] font-medium text-graphite">{t}</p>
                  <p className="mt-0.5 font-inter text-[11px] text-slate">{m}</p>
                </div>
                <span className="font-inter text-[11px] text-steel">Review →</span>
              </div>
            </Stagger>
          ))}
        </div>
      </div>
      <Stagger index={2}>
        <div className="rounded-xl bg-ash p-5">
          <p className="font-inter text-[10px] uppercase tracking-[0.08em] text-slate">This week</p>
          <p className="mt-2 font-inter text-[26px] font-medium leading-none text-graphite">3<span className="text-[14px] text-slate">/4</span></p>
          <p className="mt-1.5 font-inter text-[11px] text-slate">Tests attempted</p>
          <div className="mt-3">
            <Track value="75%" />
          </div>
          <div className="mt-4 space-y-2 border-t border-mist pt-4">
            {[["Best score", "84%"], ["Avg. pace", "1.8 min/Q"]].map(([k, v]) => (
              <div key={k} className="flex items-center justify-between">
                <span className="font-inter text-[11px] text-slate">{k}</span>
                <span className="font-inter text-[12px] font-medium text-graphite">{v}</span>
              </div>
            ))}
          </div>
        </div>
      </Stagger>
    </div>
  );
}

function ProgressPanel() {
  return (
    <div className="p-5 sm:p-8">
      <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
        {[
          ["Accuracy", "78%", "+4% this month"],
          ["Solved", "486", "32 this week"],
          ["Topics done", "9/36", "3 in progress"],
          ["Streak", "6 days", "Best 14"],
        ].map(([k, v, s], i) => (
          <Stagger key={k} index={i}>
            <div className="rounded-xl bg-ash p-4">
              <p className="font-inter text-[10px] uppercase tracking-[0.08em] text-slate">{k}</p>
              <p className="mt-1.5 font-inter text-[20px] font-medium leading-none text-graphite">{v}</p>
              <p className="mt-1.5 font-inter text-[11px] text-slate">{s}</p>
            </div>
          </Stagger>
        ))}
      </div>
      <Stagger index={3}>
        <div className="mt-3 rounded-xl border border-mist bg-canvas p-4 sm:p-5">
          <div className="flex items-baseline justify-between">
            <p className="font-inter text-[12px] font-medium text-graphite">Performance trend</p>
            <p className="font-inter text-[11px] text-slate">Last 12 weeks</p>
          </div>
          <div className="mt-4 flex h-[96px] items-end gap-1.5">
            {[34, 48, 40, 58, 52, 66, 60, 72, 68, 78, 74, 86].map((h, i) => (
              <div
                key={i}
                className={`flex-1 rounded-[3px] ${i === 11 ? "bg-graphite" : "bg-mist-strong"}`}
                style={{ height: `${h}%` }}
              />
            ))}
          </div>
        </div>
      </Stagger>
    </div>
  );
}

function HistoryPanel() {
  const rows = [
    ["Quantitative Aptitude", "25 questions · Yesterday", "84%"],
    ["Logical Reasoning", "20 questions · 2 days ago", "76%"],
    ["TCS NQT · Company Test", "30 questions · 4 days ago", "81%"],
    ["Verbal Ability", "15 questions · Last week", "88%"],
    ["Aptitude Mock · 03", "30 questions · Last week", "79%"],
  ];
  return (
    <div className="p-5 sm:p-8">
      <Stagger index={0}>
        <div className="flex flex-wrap gap-1.5">
          {["All", "Practice", "Tests", "Company"].map((f, i) => (
            <span
              key={f}
              className={`rounded-tags px-3 py-1 font-inter text-[11px] ${
                i === 0 ? "bg-graphite text-canvas" : "bg-ash text-steel"
              }`}
            >
              {f}
            </span>
          ))}
        </div>
      </Stagger>
      <div className="mt-3 divide-y divide-mist rounded-xl border border-mist bg-canvas">
        {rows.map(([t, m, a], i) => (
          <Stagger key={t} index={i + 1}>
            <div className="flex items-center gap-3 px-4 py-3.5 sm:px-5">
              <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-graphite" />
              <div className="min-w-0 flex-1">
                <p className="truncate font-inter text-[13px] font-medium text-graphite">{t}</p>
                <p className="mt-0.5 font-inter text-[11px] text-slate">{m}</p>
              </div>
              <span className="shrink-0 font-inter text-[12px] tabular-nums text-graphite">{a}</span>
              <span className="hidden shrink-0 font-inter text-[11px] text-steel sm:block">Review →</span>
            </div>
          </Stagger>
        ))}
      </div>
    </div>
  );
}

const PANELS = {
  Practice: PracticePanel,
  Topics: TopicsPanel,
  Companies: CompaniesPanel,
  Tests: TestsPanel,
  Progress: ProgressPanel,
  History: HistoryPanel,
};

const URLS = {
  Practice: "leetaptitude.app/practice",
  Topics: "leetaptitude.app/topics",
  Companies: "leetaptitude.app/companies",
  Tests: "leetaptitude.app/tests",
  Progress: "leetaptitude.app/progress",
  History: "leetaptitude.app/history",
};

/* ── section ─────────────────────────────────────────────────────── */

export function Showcase() {
  const [active, setActive] = useState("Practice");
  const [shown, setShown] = useState("Practice");
  const [phase, setPhase] = useState("idle");
  const timers = useRef([]);
  const reduceMotion = useRef(false);

  useEffect(() => {
    try {
      reduceMotion.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    } catch {
      reduceMotion.current = false;
    }
    return () => timers.current.forEach(clearTimeout);
  }, []);

  const select = useCallback(
    (id) => {
      if (id === active || phase === "exiting") return;
      if (reduceMotion.current) {
        setActive(id);
        setShown(id);
        return;
      }
      setActive(id);
      setPhase("exiting");
      timers.current.forEach(clearTimeout);
      timers.current = [
        setTimeout(() => {
          setShown(id);
          setPhase("entering");
        }, 190),
        setTimeout(() => setPhase("idle"), 190 + 460),
      ];
    },
    [active, phase]
  );

  const onKeyDown = (e) => {
    const i = TABS.findIndex((t) => t.id === active);
    if (e.key === "ArrowRight") select(TABS[(i + 1) % TABS.length].id);
    if (e.key === "ArrowLeft") select(TABS[(i - 1 + TABS.length) % TABS.length].id);
  };

  const Panel = PANELS[shown];
  const caption = TABS.find((t) => t.id === shown)?.caption;

  return (
    <section id="practice" className="bg-canvas px-4 sm:px-6 pt-[160px] md:pt-[184px]">
      <div className="mx-auto max-w-[1248px] text-center">
        <Reveal>
          <h2
            className="editorial-heading mx-auto max-w-[640px] text-graphite"
            style={{ fontSize: "clamp(30px, 4vw, 38px)", lineHeight: "42px" }}
          >
            One platform, every way you practice.
          </h2>
        </Reveal>
        <Reveal delay={100}>
          <p className="mx-auto mt-4 max-w-[560px] font-inter text-[15px] leading-[24px] text-steel">
            Topic study, timed company sets and progress tracking — one calm
            workspace, six ways to prepare.
          </p>
        </Reveal>

        <Reveal delay={160}>
          <div
            role="tablist"
            aria-label="Product areas"
            onKeyDown={onKeyDown}
            className="mt-8 inline-flex max-w-full flex-wrap justify-center gap-1 overflow-x-auto rounded-lg border border-mist bg-canvas p-1"
          >
            {TABS.map((t) => (
              <button
                key={t.id}
                role="tab"
                aria-selected={active === t.id}
                type="button"
                onClick={() => select(t.id)}
                className={`shrink-0 rounded-md px-3.5 py-1.5 font-inter text-[12px] transition-colors duration-200 sm:px-4 ${
                  active === t.id
                    ? "bg-ash font-medium text-graphite"
                    : "text-steel hover:text-graphite"
                }`}
              >
                {t.id}
              </button>
            ))}
          </div>
        </Reveal>

        <Reveal delay={200} className="mt-8 text-left">
          <div className="overflow-hidden rounded-2xl border border-mist bg-ivory shadow-[0_1px_2px_rgba(0,0,0,0.04),0_24px_64px_-24px_rgba(0,0,0,0.14)]">
            {/* window chrome */}
            <div className="flex items-center gap-1.5 border-b border-mist bg-canvas px-4 py-2.5">
              <span className="h-2 w-2 rounded-full bg-faint" />
              <span className="h-2 w-2 rounded-full bg-faint" />
              <span className="h-2 w-2 rounded-full bg-faint" />
              <span className="ml-3 hidden rounded-md bg-ash px-2.5 py-1 font-inter text-[10px] text-slate sm:block">
                {URLS[shown]}
              </span>
              <span className="ml-auto hidden items-center gap-2 md:flex">
                <span className="rounded-md bg-ash px-2 py-0.5 font-inter text-[10px] text-steel">
                  {shown}
                </span>
              </span>
            </div>

            <div className="flex">
              {/* app sidebar */}
              <aside className="hidden w-[196px] shrink-0 flex-col gap-0.5 border-r border-mist bg-canvas p-3 md:flex">
                <p className="px-2 pb-2 pt-1 font-inter text-[10px] uppercase tracking-[0.08em] text-faint">
                  LeetAptitude
                </p>
                {SIDEBAR.map((item) => {
                  const on = active === item.tab;
                  return (
                    <button
                      key={item.label}
                      type="button"
                      onClick={() => select(item.tab)}
                      className={`flex items-center gap-2 rounded-md px-2.5 py-[7px] text-left font-inter text-[12px] transition-colors duration-150 ${
                        on ? "bg-ash font-medium text-graphite" : "text-steel hover:bg-ash hover:text-graphite"
                      }`}
                    >
                      <span className={`h-1 w-1 rounded-full ${on ? "bg-graphite" : "bg-faint"}`} />
                      {item.label}
                    </button>
                  );
                })}
                <div className="mt-auto rounded-xl bg-ash p-3">
                  <p className="font-inter text-[11px] font-medium text-graphite">6-day streak</p>
                  <p className="mt-0.5 font-inter text-[10px] text-slate">142 Qs this week</p>
                  <div className="mt-2.5">
                    <Track value="68%" />
                  </div>
                </div>
              </aside>

              {/* panel */}
              <div className="min-w-0 flex-1">
                <div
                  key={shown}
                  className={
                    phase === "exiting"
                      ? "showcase-exit"
                      : phase === "entering"
                        ? "showcase-enter"
                        : undefined
                  }
                >
                  <div className="min-h-[420px] md:min-h-[480px]">
                    <Panel />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <p className="mt-4 text-center font-inter text-[11px] text-slate">{caption}</p>
        </Reveal>
      </div>
    </section>
  );
}

export function ContentFormats() {
  const groups = [
    {
      title: "Subjects",
      items: ["Quantitative", "Logical Reasoning", "Verbal Ability", "Data Interpretation"],
    },
    {
      title: "Difficulty",
      items: ["Easy", "Medium", "Hard"],
    },
    {
      title: "Modes",
      items: ["Practice", "Test", "Company Sheet"],
    },
    {
      title: "Learning",
      items: ["Questions", "Solutions", "Explanations"],
    },
    {
      title: "Tracking",
      items: ["Sessions", "Accuracy", "Streaks", "History"],
    },
  ];
  return (
    <section id="companies" className="bg-canvas px-6 pt-[140px] md:pt-[168px]">
      <div className="mx-auto max-w-[1112px]">
        <Reveal className="mx-auto max-w-[600px] text-center">
          <h2
            className="editorial-heading text-graphite"
            style={{ fontSize: "clamp(28px, 3.6vw, 34px)", lineHeight: "38px" }}
          >
            Practice content, organised.
          </h2>
          <p className="mt-4 font-inter text-[14px] leading-[24px] text-steel">
            Small, consistent building blocks — not endless question dumps.
          </p>
        </Reveal>
        <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {groups.map((g, gi) => (
            <Reveal key={g.title} delay={gi * 60}>
              <div className="rounded-cards border border-mist bg-canvas p-4">
                <p className="font-inter text-[10px] uppercase tracking-[0.08em] text-slate">
                  {g.title}
                </p>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {g.items.map((item) => (
                    <span
                      key={item}
                      className="rounded-tags bg-ash px-2.5 py-1 font-inter text-[11px] text-graphite"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

export function Philosophy() {
  return (
    <section id="progress" className="bg-canvas px-6 pt-[140px] md:pt-[168px]">
      <div className="mx-auto max-w-[1112px]">
        <Reveal>
          <div className="rounded-2xl bg-ash px-6 py-16 text-center md:py-20">
            <h2
              className="editorial-heading mx-auto max-w-[560px] text-graphite"
              style={{ fontSize: "clamp(28px, 3.6vw, 34px)", lineHeight: "38px" }}
            >
              Built around how you actually prepare.
            </h2>
            <p className="mx-auto mt-4 max-w-[480px] font-inter text-[14px] leading-[24px] text-steel">
              Practice by topic. Prepare by company. Track your progress.
              Repeat until placement-ready.
            </p>
            <div className="mt-7 flex flex-wrap items-center justify-center gap-1.5">
              {["Topics → Sessions", "Sheets → Tests", "Accuracy → Streaks"].map((t) => (
                <span
                  key={t}
                  className="rounded-tags border border-mist bg-canvas px-3 py-1.5 font-inter text-[11px] text-steel"
                >
                  {t}
                </span>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
