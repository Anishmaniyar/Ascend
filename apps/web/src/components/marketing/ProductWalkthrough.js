"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import {
  ArrowRightIcon,
  CheckIcon,
  ClockIcon,
  ChevronRightIcon,
  ChevronLeftIcon,
  ChevronDownIcon,
  PlayIcon,
  BarChart3Icon,
  TargetIcon,
  TrophyIcon,
  FlameIcon,
  SearchIcon,
  SparklesIcon,
  RotateCcwIcon,
} from "@/components/ui/icons";
import Button from "@/components/ui/Button";
import { topics } from "@/lib/mock/landing";
import {
  subtopicProgress,
  practiceSheets,
  getSubtopicSheetStats,
  getTopicProgress,
  recommendedTopics,
} from "@/lib/mock/dashboard";
import { leaderboardData } from "@/lib/mock/leaderboard";
import { upcomingContests } from "@/lib/mock/contests";

/* ═══════════════════════════════════════════════════════════════════════
   HOOKS
   ═══════════════════════════════════════════════════════════════════════ */

function useScrollReveal(threshold = 0.15) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setVisible(true);
          obs.unobserve(el);
        }
      },
      { threshold, rootMargin: "0px 0px -60px 0px" }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);

  return { ref, visible };
}

function useCountUp(target, duration = 1200, active = false) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!active) return;
    const start = Date.now();
    const tick = () => {
      const p = Math.min((Date.now() - start) / duration, 1);
      setVal(Math.round(target * p));
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [active, target, duration]);
  return val;
}

/* ═══════════════════════════════════════════════════════════════════════
   SECTION 1 — THE PROBLEM → THE SOLUTION
   ═══════════════════════════════════════════════════════════════════════ */

const SCATTERED_ITEMS = [
  { label: "Profit & Loss", type: "topic" },
  { label: "24 Qs", type: "stat" },
  { label: "MEDIUM", type: "tag" },
  { label: "Percentage", type: "topic" },
  { label: "12 Qs", type: "stat" },
  { label: "HARD", type: "tag" },
  { label: "Seating Arr.", type: "topic" },
  { label: "81%", type: "stat" },
  { label: "EASY", type: "tag" },
  { label: "Probability", type: "topic" },
  { label: "15 Qs", type: "stat" },
  { label: "Blood Rel.", type: "topic" },
];

const STRUCTURED_STEPS = ["Topic", "Subtopic", "Practice", "Result", "Improve"];

export function TheProblemSection() {
  const { ref, visible } = useScrollReveal(0.1);
  const [phase, setPhase] = useState("scattered");

  useEffect(() => {
    if (!visible) return;
    const t1 = setTimeout(() => setPhase("converging"), 800);
    const t2 = setTimeout(() => setPhase("structured"), 1800);
    const t3 = setTimeout(() => setPhase("revealed"), 3000);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, [visible]);

  return (
    <section className="relative overflow-hidden bg-canvas py-24 md:py-32">
      <div className="mx-auto max-w-[var(--page-max-width)] px-6">
        {/* ── Headline ──────────────────────────────────────────────── */}
        <div
          ref={ref}
          className={`mx-auto max-w-[640px] text-center transition-all duration-700 ${
            visible ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
          }`}
        >
          <h2 className="font-polysans text-heading-lg font-normal tracking-[-0.02em] text-graphite">
            Aptitude preparation becomes difficult when you don&apos;t know
            what to practice next.
          </h2>
        </div>

        {/* ── Visual: Scattered → Converge → Structured → Product ──── */}
        <div className="relative mx-auto mt-16 h-[300px] max-w-[800px] overflow-hidden md:h-[340px]">

          {/* Phase 1 & 2: Scattered chips that converge */}
          <div
            className={`absolute inset-0 flex flex-wrap items-center justify-center gap-3 transition-all duration-1000 ${
              phase === "revealed"
                ? "scale-95 opacity-0"
                : "scale-100 opacity-100"
            }`}
          >
            {SCATTERED_ITEMS.map((item, i) => {
              const typeStyles = {
                topic: "border-mist bg-ash text-graphite",
                stat: "border-ember/30 bg-ember/5 text-ember",
                tag: "border-brass/30 bg-brass/5 text-brass",
              };

              // When converging, chips cluster to center
              const convergeStyle = phase === "converging" || phase === "structured"
                ? {
                    transform: `translate(${
                      (i % 3 - 1) * 8 - (i % 3 - 1) * 40
                    }px, ${
                      (Math.floor(i / 3) - 1.5) * 6 - (Math.floor(i / 3) - 1.5) * 30
                    }px)`,
                    opacity: phase === "structured" ? 0 : 0.7,
                  }
                : {};

              return (
                <div
                  key={i}
                  className={`rounded-lg border px-3 py-1.5 text-13 font-medium transition-all duration-700 ease-out ${
                    typeStyles[item.type]
                  }`}
                  style={{
                    ...convergeStyle,
                    transitionDelay: `${i * 30}ms`,
                  }}
                >
                  {item.label}
                </div>
              );
            })}
          </div>

          {/* Phase 2 & 3: Structured flow */}
          <div
            className={`absolute inset-0 flex flex-col items-center justify-center transition-all duration-700 ${
              phase === "structured" || phase === "revealed"
                ? "translate-y-0 opacity-100"
                : "translate-y-6 opacity-0"
            }`}
          >
            <div className="flex flex-wrap items-center justify-center gap-2 md:gap-3">
              {STRUCTURED_STEPS.map((step, i) => (
                <span key={step} className="flex items-center gap-2">
                  <span
                    className="rounded-xl border border-mist bg-ash px-4 py-2.5 font-polysans text-15 tracking-[-0.02em] text-graphite transition-all duration-500"
                    style={{ transitionDelay: `${i * 100}ms` }}
                  >
                    {step}
                  </span>
                  {i < STRUCTURED_STEPS.length - 1 && (
                    <ChevronRightIcon className="hidden h-4 w-4 text-slate md:block" />
                  )}
                </span>
              ))}
            </div>
          </div>

          {/* Phase 3: Product reveal — real topics page mockup */}
          <div
            className={`absolute inset-0 flex items-center justify-center transition-all duration-700 ${
              phase === "revealed"
                ? "translate-y-0 opacity-100"
                : "translate-y-8 opacity-0"
            }`}
          >
            <div className="w-full max-w-[700px] rounded-2xl border border-mist bg-canvas p-5 shadow-sm md:p-6">
              {/* Mini browser chrome */}
              <div className="mb-4 flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-mist" />
                <span className="h-2.5 w-2.5 rounded-full bg-mist" />
                <span className="h-2.5 w-2.5 rounded-full bg-mist" />
                <span className="ml-2 flex-1 rounded-lg bg-fog px-3 py-1 text-13 text-slate">
                  ascend.app/topics
                </span>
              </div>

              {/* Mini topic cards */}
              <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
                {topics.slice(0, 3).map((t, i) => (
                  <div
                    key={t.id}
                    className="rounded-xl border border-mist bg-fog p-3 transition-all duration-500"
                    style={{ transitionDelay: `${i * 100 + 200}ms` }}
                  >
                    <div className="flex items-center gap-2">
                      <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-canvas text-13 text-graphite">
                        {t.title.charAt(0)}
                      </span>
                      <span className="font-polysans text-13 tracking-[-0.02em] text-graphite">
                        {t.title}
                      </span>
                    </div>
                    <div className="mt-2.5 h-1 w-full rounded-full bg-canvas">
                      <div className="h-full w-[45%] rounded-full bg-ember" />
                    </div>
                  </div>
                ))}
              </div>

              <p className="mt-4 text-center text-13 text-slate">
                One clear path from topic selection to measurable progress.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════════════
   SECTION 2 — THE CORE LEARNING LOOP
   ═══════════════════════════════════════════════════════════════════════ */

const LOOP_PHASES = [
  { step: 0, label: "Topic", desc: "Choose the aptitude area you want to work on." },
  { step: 1, label: "Subtopic", desc: "Focus on a specific concept to practice." },
  { step: 2, label: "Practice", desc: "Start a structured practice session." },
  { step: 3, label: "Result", desc: "Finish and see your performance." },
  { step: 4, label: "Improve", desc: "Use your results to guide what to practice next." },
];

import {
  Calculator,
  Brain,
  BookOpen,
  TrendingUp,
  Percent,
  Scale,
  Clock,
  Route,
  Hash,
  Dice5,
} from "lucide-react";

const TOPIC_ICONS = { quant: Calculator, logical: Brain, verbal: BookOpen, di: BarChart3Icon, ga: SparklesIcon, english: BookOpen };
const SUBTOPIC_ICONS = {
  "quant-1": TrendingUp, "quant-2": Percent, "quant-3": Scale,
  "quant-4": Clock, "quant-5": Route, "quant-6": Calculator,
  "quant-7": Hash, "quant-8": Dice5,
};

const MOCK_QUESTION = {
  title: "A shopkeeper buys goods at 20% discount on the marked price. He marks it 30% above the price he paid. After giving a 10% discount on the marked price, find his overall profit percent.",
  difficulty: "Hard",
  options: ["12.4%", "14.4%", "16.8%", "18.2%"],
  correctIndex: 1,
};

export function CoreLearningLoopSection() {
  const { ref: headerRef, visible: headerVisible } = useScrollReveal(0.1);
  const { ref: loopRef, visible: loopVisible } = useScrollReveal(0.05);
  const [phase, setPhase] = useState(0);
  const [paused, setPaused] = useState(false);
  const timersRef = useRef([]);

  const startLoop = useCallback(() => {
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];
    setPhase(0);
    for (let i = 1; i <= 4; i++) {
      timersRef.current.push(
        setTimeout(() => {
          if (!paused) setPhase(i);
        }, i * 2200)
      );
    }
    timersRef.current.push(
      setTimeout(() => {
        if (!paused) setPhase(0);
      }, 5 * 2200)
    );
  }, [paused]);

  useEffect(() => {
    if (!loopVisible) return;
    startLoop();
    return () => timersRef.current.forEach(clearTimeout);
  }, [loopVisible, startLoop]);

  return (
    <section className="bg-ash py-24 md:py-32">
      <div className="mx-auto max-w-[var(--page-max-width)] px-6">
        {/* ── Section header ───────────────────────────────── */}
        <div
          ref={headerRef}
          className={`mx-auto max-w-[640px] text-center transition-all duration-700 ${
            headerVisible ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
          }`}
        >
          <p className="text-13 uppercase tracking-[0.08em] text-brass">How it works</p>
          <h2 className="mt-6 font-polysans text-heading-lg font-normal tracking-[-0.02em] text-graphite">
            One learning loop. Every time.
          </h2>
          <p className="mx-auto mt-5 max-w-[52ch] text-subheading font-normal leading-relaxed text-steel">
            Choose a topic, focus on a concept, practice through a session, see
            your result, and know exactly what to improve next.
          </p>
        </div>

        {/* ── Step indicator bar ───────────────────────────── */}
        <div
          ref={loopRef}
          className={`mx-auto mt-16 max-w-[700px] transition-all duration-700 ${
            loopVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
          }`}
        >
          <div className="flex items-center">
            {LOOP_PHASES.map((lp, i) => (
              <div key={lp.step} className="flex flex-1 items-center">
                <div className="flex flex-col items-center">
                  <span
                    className={`flex h-9 w-9 items-center justify-center rounded-full text-13 font-normal transition-all duration-500 ${
                      i <= phase ? "bg-ember text-inverse" : "bg-fog text-slate"
                    }`}
                  >
                    {i < phase ? <CheckIcon className="h-4 w-4" /> : i + 1}
                  </span>
                  <span className={`mt-2 text-13 font-normal transition-colors duration-500 ${i <= phase ? "text-graphite" : "text-slate"}`}>
                    {lp.label}
                  </span>
                </div>
                {i < LOOP_PHASES.length - 1 && (
                  <div className="mx-1 h-px flex-1 bg-mist">
                    <div className="h-full bg-ember transition-all duration-700" style={{ width: i < phase ? "100%" : "0%" }} />
                  </div>
                )}
              </div>
            ))}
          </div>
          <p className="mt-6 text-center text-15 text-steel">{LOOP_PHASES[phase].desc}</p>
        </div>

        {/* ── Product interface — transforms per phase ─────── */}
        <div
          className={`mx-auto mt-12 max-w-[860px] overflow-hidden rounded-2xl border border-mist bg-canvas transition-all duration-700 delay-200 ${
            loopVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
          }`}
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => { setPaused(false); startLoop(); }}
        >
          {/* Browser chrome */}
          <div className="flex items-center gap-2 border-b border-mist bg-fog px-4 py-2.5">
            <span className="h-2.5 w-2.5 rounded-full bg-mist" />
            <span className="h-2.5 w-2.5 rounded-full bg-mist" />
            <span className="h-2.5 w-2.5 rounded-full bg-mist" />
            <span className="ml-3 flex-1 rounded-lg bg-canvas px-3 py-1 text-13 text-slate">ascend.app</span>
          </div>

          {/* Phase content with cross-fade */}
          <div className="min-h-[380px] transition-opacity duration-300 md:min-h-[440px]">
            {phase === 0 && <LoopPhaseTopic />}
            {phase === 1 && <LoopPhaseSubtopic />}
            {phase === 2 && <LoopPhasePractice />}
            {phase === 3 && <LoopPhaseResult />}
            {phase === 4 && <LoopPhaseImprove />}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── Phase 0: Topic Selection ──────────────────────────────────────── */

function LoopPhaseTopic() {
  const [selected, setSelected] = useState(0);

  useEffect(() => {
    const t = setTimeout(() => setSelected(1), 1200);
    return () => clearTimeout(t);
  }, []);

  const displayTopics = topics.slice(0, 4);

  return (
    <div className="p-6 md:p-8">
      <div className="flex items-center justify-between">
        <div>
          <p className="font-polysans text-subheading font-normal tracking-[-0.02em] text-graphite">Topics</p>
          <p className="mt-1 text-13 text-steel">Explore aptitude topics and start your practice journey.</p>
        </div>
        <div className="relative hidden sm:block">
          <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate" />
          <div className="h-9 w-48 rounded-lg border border-mist bg-fog pl-9 pr-3 text-13 text-slate">Search topics...</div>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        {["All Topics", "Quantitative", "Logical", "Verbal"].map((f, i) => (
          <span key={f} className={`rounded-tags border px-3 py-1 font-polysans text-13 ${i === 0 ? "border-graphite bg-graphite text-inverse" : "border-mist bg-canvas text-slate"}`}>
            {f}
          </span>
        ))}
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        {displayTopics.map((t, i) => {
          const Icon = TOPIC_ICONS[t.id] || Calculator;
          const progress = getTopicProgress(t);
          const totalQ = t.subtopics.reduce((s, sub) => s + sub.questions, 0);
          return (
            <div
              key={t.id}
              className={`group flex flex-col rounded-2xl border p-4 transition-all duration-500 ${
                i === selected
                  ? "border-ember bg-ember/5 shadow-sm"
                  : "border-mist bg-fog hover:border-graphite"
              }`}
            >
              <div className="flex items-start gap-3">
                <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl transition-colors ${
                  i === selected ? "bg-ember/10 text-ember" : "bg-canvas text-graphite"
                }`}>
                  <Icon className="h-4.5 w-4.5" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="font-polysans text-15 tracking-[-0.02em] text-graphite">{t.title}</p>
                  <p className="mt-0.5 text-13 leading-[1.4] text-steel line-clamp-1">{t.description}</p>
                </div>
              </div>
              <p className="mt-3 text-13 text-slate">{t.subtopics.length} Subtopics · {totalQ} Questions</p>
              <div className="mt-auto pt-3">
                <div className="flex items-center justify-between text-13">
                  <span className="text-slate">Progress</span>
                  <span className="font-polysans text-graphite">{progress.percent}%</span>
                </div>
                <div className="mt-1.5 h-1.5 w-full rounded-full bg-canvas">
                  <div className="h-full rounded-full bg-ember transition-all" style={{ width: `${progress.percent}%` }} />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ── Phase 1: Subtopic Selection ───────────────────────────────────── */

function LoopPhaseSubtopic() {
  const [selected, setSelected] = useState(0);

  useEffect(() => {
    const t = setTimeout(() => setSelected(2), 1200);
    return () => clearTimeout(t);
  }, []);

  const topic = topics[0];
  const subtopics = topic.subtopics.slice(0, 6);
  const topicProg = getTopicProgress(topic);

  return (
    <div className="p-6 md:p-8">
      <p className="text-13 text-slate">← All Topics</p>
      <div className="mt-2 flex items-start justify-between">
        <div>
          <p className="font-polysans text-subheading font-normal tracking-[-0.02em] text-graphite">{topic.title}</p>
          <p className="mt-1 text-13 text-steel">Practice {topic.title.toLowerCase()} topic by topic.</p>
        </div>
      </div>

      <div className="mt-5 grid grid-cols-1 gap-5 lg:grid-cols-[200px_1fr]">
        <div className="rounded-2xl border border-mist bg-fog p-4 text-center">
          <div className="relative inline-flex items-center justify-center" style={{ width: 100, height: 100 }}>
            <svg width={100} height={100} className="-rotate-90">
              <circle cx={50} cy={50} r={42} fill="none" stroke="var(--color-mist)" strokeWidth={7} />
              <circle cx={50} cy={50} r={42} fill="none" stroke="var(--color-ember)" strokeWidth={7} strokeLinecap="round"
                strokeDasharray={2 * Math.PI * 42}
                strokeDashoffset={2 * Math.PI * 42 - (topicProg.percent / 100) * 2 * Math.PI * 42}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="font-polysans text-15 tracking-[-0.02em] text-graphite">{topicProg.solved}/{topicProg.total}</span>
              <span className="text-11 text-slate">Solved</span>
            </div>
          </div>
          <div className="mt-3 grid grid-cols-2 gap-2">
            <div className="rounded-lg bg-canvas px-2 py-1.5 text-center">
              <p className="font-polysans text-13 text-graphite">3</p>
              <p className="text-11 text-slate">Sessions</p>
            </div>
            <div className="rounded-lg bg-canvas px-2 py-1.5 text-center">
              <p className="font-polysans text-13 text-graphite">82%</p>
              <p className="text-11 text-slate">Accuracy</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {subtopics.map((st, i) => {
            const Icon = SUBTOPIC_ICONS[st.id] || Calculator;
            const prog = subtopicProgress[st.id] ?? { solved: 0, total: st.questions };
            const pct = prog.total > 0 ? Math.round((prog.solved / prog.total) * 100) : 0;
            const sheetCount = (practiceSheets[st.id] ?? []).length;
            return (
              <div
                key={st.id}
                className={`group flex flex-col rounded-2xl border p-4 transition-all duration-500 ${
                  i === selected
                    ? "border-ember bg-ember/5 shadow-sm"
                    : "border-mist bg-fog hover:border-graphite"
                }`}
              >
                <div className="flex items-start gap-3">
                  <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl transition-colors ${
                    i === selected ? "bg-ember/10 text-ember" : "bg-canvas text-graphite"
                  }`}>
                    <Icon className="h-4.5 w-4.5" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="font-polysans text-15 tracking-[-0.02em] text-graphite">{st.name}</p>
                  </div>
                </div>
                <div className="mt-3 flex items-center gap-3 text-13 text-slate">
                  <span>{st.questions} Questions</span>
                  {sheetCount > 0 && <><span>·</span><span>{sheetCount} Sheets</span></>}
                </div>
                <div className="mt-auto pt-3">
                  <div className="flex items-center justify-between text-13">
                    <span className="text-slate">Progress</span>
                    <span className="font-polysans text-graphite">{pct}%</span>
                  </div>
                  <div className="mt-1.5 h-1.5 w-full rounded-full bg-canvas">
                    <div className="h-full rounded-full bg-ember transition-all" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* ── Phase 2: Practice Session ─────────────────────────────────────── */

function LoopPhasePractice() {
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    const t = setTimeout(() => setSelected(1), 1000);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="flex flex-col lg:flex-row">
      <div className="flex-1 p-6 lg:p-8">
        <div className="rounded-2xl border border-mist bg-fog p-5 md:p-6">
          <div className="flex items-center gap-3">
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-canvas font-polysans text-13 text-graphite">1</span>
            <span className="rounded-tags bg-ember/10 px-2 py-0.5 font-polysans text-11 text-ember">Hard</span>
          </div>
          <p className="mt-4 text-15 leading-[1.6] text-graphite">{MOCK_QUESTION.title}</p>
          <div className="mt-4 space-y-2">
            {MOCK_QUESTION.options.map((opt, i) => (
              <button
                key={opt}
                type="button"
                className={`group flex w-full items-center gap-3 rounded-xl border px-4 py-3 text-left transition-all ${
                  selected === i
                    ? i === MOCK_QUESTION.correctIndex
                      ? "border-success bg-success/5"
                      : "border-danger bg-danger/5"
                    : "border-mist bg-canvas hover:border-graphite hover:shadow-sm"
                }`}
              >
                <span className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full font-polysans text-13 ${
                  selected === i
                    ? i === MOCK_QUESTION.correctIndex
                      ? "bg-success text-inverse"
                      : "bg-danger text-inverse"
                    : "bg-fog text-slate group-hover:bg-graphite group-hover:text-inverse"
                }`}>
                  {String.fromCharCode(65 + i)}
                </span>
                <span className="text-15 text-graphite">{opt}</span>
                {selected === i && i === MOCK_QUESTION.correctIndex && (
                  <CheckIcon className="ml-auto h-4 w-4 text-success" />
                )}
              </button>
            ))}
          </div>
          <div className="mt-4 flex items-center justify-between">
            <span className="text-13 text-slate">1 / 10 answered</span>
            <div className="flex gap-2">
              <button className="flex h-9 items-center gap-1.5 rounded-buttons border border-mist bg-canvas px-4 text-13 text-graphite">
                <ChevronLeftIcon className="h-3.5 w-3.5" /> Previous
              </button>
              <button className="flex h-9 items-center gap-1.5 rounded-buttons bg-ember px-4 text-13 text-inverse">
                Next <ArrowRightIcon className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full shrink-0 border-t border-mist p-5 lg:w-[260px] lg:border-t-0 lg:border-l">
        <div className="rounded-2xl border border-mist bg-fog p-4">
          <p className="font-polysans text-15 tracking-[-0.02em] text-graphite">Session Progress</p>
          <div className="mt-2">
            <div className="flex items-center justify-between text-13">
              <span className="text-slate">Progress</span>
              <span className="font-polysans text-graphite">10%</span>
            </div>
            <div className="mt-1.5 h-2 w-full rounded-full bg-canvas">
              <div className="h-full rounded-full bg-ember" style={{ width: "10%" }} />
            </div>
          </div>
          <div className="mt-3 grid grid-cols-3 gap-2">
            <div className="rounded-lg bg-canvas px-2 py-2 text-center">
              <p className="font-polysans text-13 text-success">1</p>
              <p className="text-11 text-slate">Answered</p>
            </div>
            <div className="rounded-lg bg-canvas px-2 py-2 text-center">
              <p className="font-polysans text-13 text-ember">9</p>
              <p className="text-11 text-slate">Remaining</p>
            </div>
            <div className="rounded-lg bg-canvas px-2 py-2 text-center">
              <p className="font-polysans text-13 text-brass">0</p>
              <p className="text-11 text-slate">Marked</p>
            </div>
          </div>
        </div>

        <div className="mt-3 rounded-2xl border border-mist bg-fog p-4">
          <p className="font-polysans text-15 tracking-[-0.02em] text-graphite">Questions</p>
          <div className="mt-2 grid grid-cols-5 gap-1.5">
            {Array.from({ length: 10 }).map((_, i) => (
              <button
                key={i}
                className={`flex h-7 w-full items-center justify-center rounded-lg font-polysans text-12 ${
                  i === 0
                    ? "bg-graphite text-inverse"
                    : i < 3
                      ? "bg-success/10 text-success"
                      : "bg-canvas text-slate hover:bg-mist"
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>
          <div className="mt-3 flex flex-wrap items-center gap-2 text-11 text-slate">
            <span className="flex items-center gap-1"><span className="h-2 w-2 rounded bg-graphite" /> Current</span>
            <span className="flex items-center gap-1"><span className="h-2 w-2 rounded bg-success/30" /> Done</span>
            <span className="flex items-center gap-1"><span className="h-2 w-2 rounded bg-canvas" /> Pending</span>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Phase 3: Result ───────────────────────────────────────────────── */

function LoopPhaseResult() {
  return (
    <div className="p-6 md:p-8">
      <div className="text-center">
        <div className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-success/10">
          <CheckIcon className="h-7 w-7 text-success" />
        </div>
        <p className="mt-3 font-polysans text-subheading font-normal tracking-[-0.02em] text-graphite">Session Complete!</p>
        <p className="mt-1 text-13 text-steel">Profit &amp; Loss — Session 3</p>
      </div>

      <div className="mt-5 rounded-2xl border border-mist bg-fog p-5">
        <div className="text-center">
          <p className="text-13 uppercase tracking-wider text-slate">Your Score</p>
          <p className="mt-1 font-polysans text-heading-lg font-normal tracking-[-0.02em] text-graphite">
            7<span className="text-heading text-slate">/10</span>
          </p>
        </div>
        <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <div className="rounded-xl bg-success/5 px-3 py-3 text-center border border-success/10">
            <p className="font-polysans text-15 tracking-[-0.02em] text-success">7</p>
            <p className="mt-0.5 text-13 text-slate">Correct</p>
          </div>
          <div className="rounded-xl bg-danger/5 px-3 py-3 text-center border border-danger/10">
            <p className="font-polysans text-15 tracking-[-0.02em] text-danger">2</p>
            <p className="mt-0.5 text-13 text-slate">Incorrect</p>
          </div>
          <div className="rounded-xl bg-fog px-3 py-3 text-center border border-mist">
            <p className="font-polysans text-15 tracking-[-0.02em] text-slate">1</p>
            <p className="mt-0.5 text-13 text-slate">Unanswered</p>
          </div>
          <div className="rounded-xl bg-ember/5 px-3 py-3 text-center border border-ember/10">
            <p className="font-polysans text-15 tracking-[-0.02em] text-ember">78%</p>
            <p className="mt-0.5 text-13 text-slate">Accuracy</p>
          </div>
        </div>
      </div>

      <div className="mt-4 flex gap-3">
        <button className="flex flex-1 items-center justify-center gap-2 rounded-buttons bg-ember px-4 py-2.5 text-13 text-inverse">
          Practice Again
        </button>
        <button className="flex flex-1 items-center justify-center gap-2 rounded-buttons border border-mist bg-canvas px-4 py-2.5 text-13 text-graphite">
          Back to Sheet
        </button>
      </div>
    </div>
  );
}

/* ── Phase 4: Improve ──────────────────────────────────────────────── */

function LoopPhaseImprove() {
  return (
    <div className="p-6 md:p-8">
      <p className="font-polysans text-subheading font-normal tracking-[-0.02em] text-graphite">What to practice next</p>
      <p className="mt-1 text-13 text-steel">Based on your accuracy</p>

      <div className="mt-4 space-y-3">
        {[
          { topic: "Probability", accuracy: 52, solved: 15, reason: "Lowest accuracy" },
          { topic: "Syllogisms", accuracy: 58, solved: 9, reason: "Needs practice" },
          { topic: "Number System", accuracy: 62, solved: 12, reason: "Below target" },
        ].map((t) => (
          <div key={t.topic} className="flex items-center gap-4 rounded-2xl border border-mist bg-fog p-4">
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <span className="font-polysans text-15 tracking-[-0.02em] text-graphite">{t.topic}</span>
                <span className="text-13 text-slate">{t.accuracy}%</span>
              </div>
              <div className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-canvas">
                <div
                  className={`h-full rounded-full transition-all duration-1000 ${
                    t.accuracy >= 70 ? "bg-success" : t.accuracy >= 50 ? "bg-brass" : "bg-ember"
                  }`}
                  style={{ width: `${t.accuracy}%` }}
                />
              </div>
              <p className="mt-1.5 text-13 text-slate">{t.solved} solved · {t.reason}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-5 flex items-center justify-center gap-2 text-13 text-slate">
        <RotateCcwIcon className="h-3.5 w-3.5" />
        Practice again or move to the next subtopic
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════
   SECTION 3 — PREPARE FOR THE REAL TEST
   ═══════════════════════════════════════════════════════════════════════ */

const COMPANY_SHEETS = [
  { id: "tcs", name: "TCS", initial: "T", difficulty: "MEDIUM", time: "1:30", questions: 150, sheets: 12 },
  { id: "infosys", name: "Infosys", initial: "I", difficulty: "MEDIUM", time: "1:15", questions: 120, sheets: 10 },
  { id: "accenture", name: "Accenture", initial: "A", difficulty: "HARD", time: "1:00", questions: 90, sheets: 8 },
  { id: "capgemini", name: "Capgemini", initial: "C", difficulty: "EASY", time: "0:50", questions: 75, sheets: 6 },
  { id: "wipro", name: "Wipro", initial: "W", difficulty: "MEDIUM", time: "1:10", questions: 100, sheets: 9 },
];

export function PlacementSection() {
  const { ref: textRef, visible: textVisible } = useScrollReveal(0.15);
  const { ref: visRef, visible: visVisible } = useScrollReveal(0.08);

  return (
    <section className="bg-canvas py-24 md:py-32">
      <div className="mx-auto max-w-[var(--page-max-width)] px-6">
        <div
          ref={textRef}
          className={`mx-auto max-w-[640px] text-center transition-all duration-700 ${
            textVisible ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
          }`}
        >
          <h2 className="font-polysans text-heading-lg font-normal tracking-[-0.02em] text-graphite">
            Practice for the test that actually matters.
          </h2>
          <p className="mx-auto mt-5 max-w-[52ch] text-subheading font-normal leading-relaxed text-steel">
            Have a placement test coming up? Pick your target company and start
            practicing with patterns modeled on real assessments.
          </p>
        </div>

        <div ref={visRef} className="mx-auto mt-16 grid max-w-[900px] gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {COMPANY_SHEETS.map((co, i) => (
            <div
              key={co.id}
              className="group flex flex-col rounded-2xl border border-mist bg-ash p-5 transition-all duration-500 hover:border-graphite"
              style={{
                animation: visVisible
                  ? `content-fade-up 0.6s ease-out ${i * 100}ms both`
                  : "none",
              }}
            >
              <div className="flex items-center justify-between">
                <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-fog font-polysans text-subheading font-normal tracking-[-0.02em] text-graphite">
                  {co.initial}
                </span>
                <span className={`rounded-tags px-2 py-0.5 font-polysans text-13 tracking-[-0.02em] ${
                  co.difficulty === "EASY" ? "bg-success/10 text-success" : co.difficulty === "MEDIUM" ? "bg-brass/10 text-brass" : "bg-danger/10 text-danger"
                }`}>
                  {co.difficulty}
                </span>
              </div>
              <p className="mt-4 font-polysans text-15 tracking-[-0.02em] text-graphite">{co.name}</p>
              <div className="mt-4 flex items-center gap-4 text-13 text-slate">
                <span className="flex items-center gap-1.5"><BarChart3Icon className="h-3.5 w-3.5" />{co.sheets} sheets</span>
                <span className="flex items-center gap-1.5"><TargetIcon className="h-3.5 w-3.5" />{co.questions} Qs</span>
                <span className="flex items-center gap-1.5"><ClockIcon className="h-3.5 w-3.5" />{co.time}</span>
              </div>
              <div className="mt-4 border-t border-mist pt-3">
                <Button variant="secondary" size="sm" className="w-full">
                  <PlayIcon className="h-3.5 w-3.5" />Practice
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════════════
   SECTION 4 — COMPETE & STAY ENGAGED
   ═══════════════════════════════════════════════════════════════════════ */

const LEADERBOARD_TOP5 = leaderboardData.slice(0, 5);
const UPCOMING_CONTESTS = Object.values(upcomingContests);

export function CompetitionSection() {
  const { ref: textRef, visible: textVisible } = useScrollReveal(0.15);
  const { ref: boardRef, visible: boardVisible } = useScrollReveal(0.08);
  const { ref: contestRef, visible: contestVisible } = useScrollReveal(0.1);

  return (
    <section className="bg-ash py-24 md:py-32">
      <div className="mx-auto max-w-[var(--page-max-width)] px-6">
        <div
          ref={textRef}
          className={`mx-auto max-w-[640px] text-center transition-all duration-700 ${
            textVisible ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
          }`}
        >
          <h2 className="font-polysans text-heading-lg font-normal tracking-[-0.02em] text-graphite">
            Practice doesn&apos;t have to happen alone.
          </h2>
          <p className="mx-auto mt-5 max-w-[52ch] text-subheading font-normal leading-relaxed text-steel">
            Compete on the leaderboard. Join timed contests. Stay consistent by
            challenging yourself and others.
          </p>
        </div>

        <div className="mx-auto mt-16 grid max-w-[960px] gap-6 md:grid-cols-[1fr_340px]">
          {/* ── Leaderboard ──────────────────────────────── */}
          <div
            ref={boardRef}
            className={`overflow-hidden rounded-2xl border border-mist bg-canvas transition-all duration-700 ${
              boardVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
            }`}
          >
            <div className="flex items-center gap-2 border-b border-mist px-5 py-3">
              <TrophyIcon className="h-4 w-4 text-ember" />
              <span className="font-polysans text-15 tracking-[-0.02em] text-graphite">Leaderboard</span>
              <span className="ml-auto flex items-center gap-1.5 text-13 text-slate">
                <FlameIcon className="h-3.5 w-3.5 text-ember" /> Weekly
              </span>
            </div>

            <div className="grid grid-cols-[48px_1fr_70px_60px_70px_50px] items-center gap-2 border-b border-mist bg-fog/50 px-5 py-2.5 text-13 text-slate">
              <span>#</span>
              <span>User</span>
              <span className="text-right">Questions</span>
              <span className="text-right">Acc.</span>
              <span className="text-right">Sessions</span>
              <span className="text-right"><FlameIcon className="inline h-3.5 w-3.5" /></span>
            </div>

            <div>
              {LEADERBOARD_TOP5.map((row, i) => (
                <div
                  key={row.rank}
                  className={`grid grid-cols-[48px_1fr_70px_60px_70px_50px] items-center gap-2 border-b border-mist px-5 py-3 transition-colors last:border-b-0 ${
                    i === 0 ? "bg-ember/5" : "hover:bg-fog"
                  }`}
                >
                  <span className={`font-polysans text-13 ${
                    row.rank <= 3 ? "font-semibold text-ember" : "text-slate"
                  }`}>
                    {row.rank <= 3 ? (
                      <span className={`inline-flex h-6 w-6 items-center justify-center rounded-full text-11 font-polysans ${
                        row.rank === 1 ? "bg-ember/10 text-ember" : row.rank === 2 ? "bg-fog text-graphite" : "bg-brass/10 text-brass"
                      }`}>{row.rank}</span>
                    ) : row.rank}
                  </span>
                  <div className="flex items-center gap-2.5">
                    <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full font-polysans text-11 ${row.avatarBg} ${row.avatarColor}`}>
                      {row.initials}
                    </span>
                    <span className="truncate font-polysans text-15 tracking-[-0.02em] text-graphite">{row.name}</span>
                  </div>
                  <span className="text-right text-13 text-graphite">{row.questionsSolved}</span>
                  <span className="text-right text-13 text-graphite">{row.accuracy}%</span>
                  <span className="text-right text-13 text-graphite">{row.sessions}</span>
                  <span className="text-right text-13 text-graphite">{row.streak}</span>
                </div>
              ))}
            </div>
          </div>

          {/* ── Upcoming Contests ────────────────────────── */}
          <div
            ref={contestRef}
            className={`rounded-2xl border border-mist bg-canvas transition-all duration-700 ${
              contestVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
            }`}
          >
            <div className="flex items-center gap-2 border-b border-mist px-5 py-3">
              <TrophyIcon className="h-4 w-4 text-ember" />
              <span className="font-polysans text-15 tracking-[-0.02em] text-graphite">Upcoming Contests</span>
            </div>

            <div className="p-4">
              {UPCOMING_CONTESTS.slice(0, 3).map((contest, i) => (
                <div
                  key={contest.id}
                  className={`rounded-xl border border-mist bg-fog p-4 transition-all ${
                    i > 0 ? "mt-3" : ""
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-polysans text-15 tracking-[-0.02em] text-graphite">{contest.title}</span>
                    <span className={`rounded-tags px-2 py-0.5 font-polysans text-11 ${
                      contest.difficulty === "Easy"
                        ? "bg-success/10 text-success"
                        : contest.difficulty === "Medium"
                          ? "bg-brass/10 text-brass"
                          : "bg-danger/10 text-danger"
                    }`}>
                      {contest.difficulty}
                    </span>
                  </div>
                  <p className="mt-1 text-13 text-slate">{contest.description}</p>
                  <div className="mt-3 flex items-center gap-3 text-13 text-slate">
                    <span className="flex items-center gap-1">
                      <ClockIcon className="h-3 w-3" />
                      {contest.duration}
                    </span>
                    <span className="flex items-center gap-1">
                      <TargetIcon className="h-3 w-3" />
                      {contest.questions} Qs
                    </span>
                  </div>
                  <div className="mt-3">
                    <Button variant="secondary" size="sm" className="w-full">
                      Register
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-2 flex justify-center border-t border-mist px-5 py-3">
              <Link href="/contests" className="flex items-center gap-1.5 text-13 font-medium text-ember hover:text-brass transition-colors">
                View all contests
                <ArrowRightIcon className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════════════
   SECTION 5 — FINAL CTA
   ═══════════════════════════════════════════════════════════════════════ */

export function CTASection() {
  const { ref, visible } = useScrollReveal(0.15);

  return (
    <section className="relative overflow-hidden bg-canvas py-28 md:py-36">
      {/* Subtle product visual backdrop */}
      <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none">
        <div className="flex gap-4">
          {["Quantitative", "Logical", "Verbal", "Data Interp."].map((t) => (
            <div key={t} className="flex h-40 w-48 items-center justify-center rounded-2xl border border-graphite/20">
              <span className="font-polysans text-subheading text-graphite/30">{t}</span>
            </div>
          ))}
        </div>
      </div>

      <div
        ref={ref}
        className={`relative mx-auto max-w-[var(--page-max-width)] px-6 text-center transition-all duration-700 ${
          visible ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
        }`}
      >
        <h2 className="font-polysans text-heading-lg font-normal tracking-[-0.02em] text-graphite">
          Know what to practice.
          <br />
          Practice with purpose.
        </h2>
        <p className="mx-auto mt-6 max-w-[48ch] text-subheading font-normal leading-relaxed text-steel">
          Build your aptitude one focused session at a time.
        </p>
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
    </section>
  );
}
