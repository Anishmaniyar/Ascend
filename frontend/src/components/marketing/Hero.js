import Link from "next/link";
import { ArrowRightIcon, FlameIcon, CheckIcon, ClockIcon } from "@/components/ui/icons";
import Button from "@/components/ui/Button";

/* ═══════════════════════════════════════════════════════════════════════
   HERO COMPOSITION — Four corner cards framing central content.
   
   Desktop: absolute-positioned cards in corners, centered content.
   Mobile:  cards in a 2×2 grid below the center content.
   
   Each card represents a real piece of the Ascend experience:
     Top-left     → Streak card (fire streak + daily goal)
     Top-right    → Session card (upcoming practice + progress)
     Bottom-left  → Practice history (recent sessions + accuracy)
     Bottom-right → Topics overview (aptitude categories + counts)
   
   Cards use slight rotations, layered shadows, and overlapping
   elements to create a physical, tactile desk-like composition.
   ═══════════════════════════════════════════════════════════════════════ */

/* ── Pushpin SVG ───────────────────────────────────────────────────── */
function Pushpin({ className = "" }) {
  return (
    <svg
      width="28"
      height="36"
      viewBox="0 0 28 36"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <circle cx="14" cy="10" r="9" fill="var(--color-ember)" />
      <circle cx="14" cy="10" r="9" fill="url(#pinGrad)" />
      <circle cx="11" cy="7" r="2.5" fill="white" opacity="0.3" />
      <line x1="14" y1="19" x2="14" y2="34" stroke="var(--color-slate)" strokeWidth="1.5" />
      <defs>
        <radialGradient id="pinGrad" cx="0.35" cy="0.3" r="0.65">
          <stop offset="0%" stopColor="var(--color-ember)" />
          <stop offset="100%" stopColor="var(--color-brass)" />
        </radialGradient>
      </defs>
    </svg>
  );
}

/* ── Clock SVG ─────────────────────────────────────────────────────── */
function ClockIcon2({ className = "" }) {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <circle cx="32" cy="32" r="30" fill="var(--color-canvas)" stroke="var(--color-mist)" strokeWidth="2" />
      {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((deg) => {
        const rad = (deg * Math.PI) / 180;
        const main = deg % 90 === 0;
        return (
          <line
            key={deg}
            x1={32 + (main ? 22 : 24) * Math.sin(rad)}
            y1={32 - (main ? 22 : 24) * Math.cos(rad)}
            x2={32 + 26 * Math.sin(rad)}
            y2={32 - 26 * Math.cos(rad)}
            stroke="var(--color-slate)"
            strokeWidth={main ? 2 : 1}
            strokeLinecap="round"
          />
        );
      })}
      <line x1="32" y1="32" x2="32" y2="14" stroke="var(--color-graphite)" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="32" y1="32" x2="44" y2="26" stroke="var(--color-graphite)" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="32" cy="32" r="2.5" fill="var(--color-ember)" />
    </svg>
  );
}

/* ═══════════════════════════════════════════════════════════════════════
   COMPONENT 1 — STICKY NOTE (top-left)
   
   A physical sticky note pinned to the workspace showing the user's
   current streak and daily practice goal. Warm paper tones matching
   the app's light mode palette.
   ═══════════════════════════════════════════════════════════════════════ */

function StickyNote() {
  return (
    <div
      className="hero-card absolute left-0 top-0 z-10 w-[200px] sm:w-[220px] md:w-[240px]"
      style={{
        transform: "rotate(-2deg)",
        animation: "hero-card-tl 0.8s ease-out 0.2s both",
      }}
    >
      {/* Backing paper */}
      <div
        className="absolute -left-2 -top-2 rounded-xl bg-fog"
        style={{
          width: "calc(100% + 8px)",
          height: "calc(100% + 8px)",
          transform: "rotate(1.5deg)",
          boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
        }}
      />

      {/* Main note */}
      <div className="relative rounded-xl bg-[#FDF8EE] p-5 pb-6 shadow-[0_2px_8px_rgba(0,0,0,0.06),0_1px_2px_rgba(0,0,0,0.04)]">
        <Pushpin className="absolute -top-4 left-1/2 -translate-x-1/2" />

        {/* Streak */}
        <div className="flex items-center gap-2.5">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-ember/10">
            <FlameIcon className="h-4 w-4 text-ember" />
          </span>
          <div>
            <p className="font-polysans text-15 font-normal tracking-[-0.02em] text-graphite">
              7 day streak
            </p>
            <p className="text-11 text-steel">Keep it going!</p>
          </div>
        </div>

        {/* Divider */}
        <div className="my-3 border-t border-mist/60" />

        {/* Daily goal */}
        <div>
          <p className="text-11 uppercase tracking-[0.06em] text-slate">
            Daily Goal
          </p>
          <div className="mt-1.5 flex items-center justify-between">
            <span className="text-13 text-graphite">14 / 20 questions</span>
            <span className="text-11 font-medium text-ember">70%</span>
          </div>
          <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-mist/50">
            <div className="h-full w-[70%] rounded-full bg-ember" />
          </div>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════
   COMPONENT 2 — SESSION CARD (top-right)
   
   A folder-tab card showing an upcoming practice session with a clock
   element floating in front. Uses the app's real card patterns.
   ═══════════════════════════════════════════════════════════════════════ */

function SessionCard() {
  return (
    <div
      className="hero-card absolute right-0 top-0 z-10"
      style={{
        width: "min(250px, 27vw)",
        transform: "rotate(1.5deg)",
        animation: "hero-card-tr 0.8s ease-out 0.4s both",
      }}
    >
      {/* Clock — floating in front */}
      <div
        className="absolute -left-8 top-3 z-30 h-14 w-14 sm:-left-9 sm:h-16 sm:w-16 md:-left-10 md:h-[72px] md:w-[72px]"
        style={{ transform: "rotate(-4deg)" }}
      >
        <ClockIcon2 className="h-full w-full rounded-full shadow-[0_2px_8px_rgba(0,0,0,0.08)]" />
      </div>

      {/* Card body with folder tab */}
      <div className="relative">
        <div className="absolute -top-2.5 left-4 h-5 w-16 rounded-t-lg bg-fog" />

        <div className="overflow-hidden rounded-xl border border-mist bg-canvas shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
          <div className="border-b border-mist bg-fog/50 px-4 py-2.5">
            <p className="font-polysans text-13 font-normal tracking-[-0.01em] text-graphite">
              Upcoming
            </p>
          </div>

          <div className="p-4">
            <div className="rounded-lg border border-mist bg-fog p-3">
              <div className="flex items-center justify-between">
                <span className="rounded-full bg-ember/10 px-2 py-0.5 text-11 font-medium text-ember">
                  Practice
                </span>
                <span className="text-11 text-slate">Today</span>
              </div>
              <p className="mt-2 font-polysans text-15 font-normal tracking-[-0.02em] text-graphite">
                Profit &amp; Loss
              </p>
              <p className="mt-0.5 text-13 text-steel">
                Quantitative · 20 questions
              </p>
              <div className="mt-3 flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-11 text-slate">
                  <ClockIcon className="h-3 w-3" />
                  ~30 min
                </div>
                <span className="text-11 font-medium text-success">
                  82% accuracy
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════
   COMPONENT 3 — PRACTICE HISTORY CARD (bottom-left)
   
   Recent practice sessions with accuracy indicators. Matches the
   app's real practice history list pattern.
   ═══════════════════════════════════════════════════════════════════════ */

function PracticeHistoryCard() {
  const sessions = [
    {
      subtopic: "Profit & Loss",
      score: "15/18",
      accuracy: 83,
      when: "Yesterday",
      color: "bg-success",
    },
    {
      subtopic: "Time & Work",
      score: "11/12",
      accuracy: 92,
      when: "2 days ago",
      color: "bg-success",
    },
    {
      subtopic: "Number System",
      score: "15/20",
      accuracy: 75,
      when: "Last week",
      color: "bg-brass",
    },
  ];

  return (
    <div
      className="hero-card absolute bottom-0 left-0 z-10 w-[230px] sm:w-[260px] md:w-[290px]"
      style={{
        transform: "rotate(1deg)",
        animation: "hero-card-bl 0.8s ease-out 0.6s both",
      }}
    >
      {/* Folder tab */}
      <div className="absolute -top-2.5 left-4 h-5 w-20 rounded-t-lg bg-fog" />

      <div className="overflow-hidden rounded-xl border border-mist bg-canvas shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
        <div className="border-b border-mist bg-fog/50 px-4 py-2.5">
          <p className="font-polysans text-13 font-normal tracking-[-0.01em] text-graphite">
            Recent Practice
          </p>
        </div>

        <div className="divide-y divide-mist">
          {sessions.map((s) => (
            <div key={s.subtopic} className="flex items-center gap-3 px-4 py-3">
              <span className={`h-2 w-2 shrink-0 rounded-full ${s.color}`} />
              <div className="min-w-0 flex-1">
                <p className="truncate font-polysans text-13 font-normal tracking-[-0.01em] text-graphite">
                  {s.subtopic}
                </p>
                <p className="text-11 text-slate">{s.when}</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-11 text-slate">{s.score}</span>
                <span className={`text-11 font-medium ${
                  s.accuracy >= 80 ? "text-success" : "text-brass"
                }`}>
                  {s.accuracy}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════
   COMPONENT 4 — TOPICS CARD (bottom-right)
   
   Shows the three main aptitude categories as icon tiles with
   question counts. Uses the app's real topic colors and patterns.
   ═══════════════════════════════════════════════════════════════════════ */

function TopicsCard() {
  const categories = [
    { letter: "Q", label: "Quant", count: "320 Qs", color: "bg-ember", rotate: "-rotate-3" },
    { letter: "L", label: "Logic", count: "180 Qs", color: "bg-graphite", rotate: "" },
    { letter: "V", label: "Verbal", count: "140 Qs", color: "bg-brass", rotate: "rotate-3" },
  ];

  return (
    <div
      className="hero-card absolute bottom-0 right-0 z-10 w-[210px] sm:w-[230px] md:w-[260px]"
      style={{
        transform: "rotate(-1.5deg)",
        animation: "hero-card-br 0.8s ease-out 0.8s both",
      }}
    >
      {/* Folder tab */}
      <div className="absolute -top-2.5 left-4 h-5 w-16 rounded-t-lg bg-fog" />

      <div className="overflow-hidden rounded-xl border border-mist bg-canvas shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
        <div className="border-b border-mist bg-fog/50 px-4 py-2.5">
          <p className="font-polysans text-13 font-normal tracking-[-0.01em] text-graphite">
            Topics
          </p>
        </div>

        <div className="flex items-center justify-center gap-4 px-5 py-5">
          {categories.map((cat) => (
            <div key={cat.letter} className={`flex flex-col items-center gap-2 ${cat.rotate}`}>
              <div
                className={`flex h-12 w-12 items-center justify-center rounded-xl ${cat.color} shadow-[0_2px_6px_rgba(0,0,0,0.08)] transition-transform duration-200 hover:scale-105`}
              >
                <span className="font-polysans text-base font-semibold text-inverse">
                  {cat.letter}
                </span>
              </div>
              <div className="text-center">
                <p className="font-polysans text-11 font-normal text-graphite">{cat.label}</p>
                <p className="text-10 text-slate">{cat.count}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════
   HERO COMPOSITION — Main export
   ═══════════════════════════════════════════════════════════════════════ */

export default function Hero() {
  return (
    <section className="relative overflow-hidden px-4 py-6 sm:px-6 sm:py-10 md:px-8 md:py-14">
      {/* ── Desktop composition ──────────────────────────────────── */}
      <div className="relative mx-auto hidden min-h-[520px] max-w-[1100px] md:block lg:min-h-[580px]">
        <StickyNote />
        <SessionCard />
        <PracticeHistoryCard />
        <TopicsCard />

        {/* ── Center content ────────────────────────────────────── */}
        <div
          className="absolute inset-0 flex flex-col items-center justify-center px-[120px] lg:px-[160px]"
          style={{ animation: "content-fade-up 0.9s ease-out 0.5s both" }}
        >
          <p className="inline-flex items-center gap-2.5 rounded-tags bg-ash px-4 py-1.5 text-13 uppercase tracking-[0.08em] text-slate">
            <span className="h-1.5 w-1.5 rounded-full bg-ember" />
            Placement Aptitude Practice
          </p>

          <h1 className="mx-auto mt-7 max-w-[14ch] text-center font-polysans text-[clamp(32px,4vw,48px)] font-normal leading-[1.08] tracking-[-0.03em] text-graphite">
            Prepare smarter.
            <br />
            <span className="relative inline-block">
              Practice with purpose.
              <span
                className="absolute -bottom-2 left-0 h-[3px] w-full origin-left rounded-full bg-ember"
                style={{ animation: "underline-scale 0.8s ease-out 2s both" }}
              />
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-[42ch] text-center text-15 leading-relaxed text-steel">
            Master aptitude topic by topic, practice through realistic
            sessions, and prepare for the companies you want to crack.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Button render={<Link href="/register" />} variant="primary" size="lg">
              Start Practicing
              <ArrowRightIcon className="h-4 w-4 btn-arrow transition-transform duration-150" />
            </Button>
            <Button render={<Link href="/topics" />} variant="secondary" size="lg">
              Explore Topics
            </Button>
          </div>
        </div>
      </div>

      {/* ── Mobile composition ──────────────────────────────────── */}
      <div className="mx-auto max-w-[480px] md:hidden">
        <div
          className="text-center"
          style={{ animation: "content-fade-up 0.9s ease-out 0.2s both" }}
        >
          <p className="inline-flex items-center gap-2.5 rounded-tags bg-ash px-4 py-1.5 text-13 uppercase tracking-[0.08em] text-slate">
            <span className="h-1.5 w-1.5 rounded-full bg-ember" />
            Placement Aptitude Practice
          </p>

          <h1 className="mx-auto mt-6 max-w-[14ch] font-polysans text-[32px] font-normal leading-[1.08] tracking-[-0.03em] text-graphite">
            Prepare smarter.
            <br />
            <span className="relative inline-block">
              Practice with purpose.
              <span className="absolute -bottom-2 left-0 h-[3px] w-full origin-left rounded-full bg-ember" />
            </span>
          </h1>

          <p className="mx-auto mt-5 max-w-[42ch] text-15 leading-relaxed text-steel">
            Master aptitude topic by topic, practice through realistic
            sessions, and prepare for the companies you want to crack.
          </p>

          <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
            <Button render={<Link href="/register" />} variant="primary" size="md">
              Start Practicing
              <ArrowRightIcon className="h-4 w-4 btn-arrow transition-transform duration-150" />
            </Button>
            <Button render={<Link href="/topics" />} variant="secondary" size="md">
              Explore Topics
            </Button>
          </div>
        </div>

        {/* App preview cards — 2×2 grid */}
        <div className="mt-8 grid grid-cols-2 gap-3">
          {/* Streak card */}
          <div className="rounded-xl border border-mist bg-canvas p-4 shadow-[0_1px_4px_rgba(0,0,0,0.04)]">
            <div className="flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-ember/10">
                <FlameIcon className="h-3.5 w-3.5 text-ember" />
              </span>
              <div>
                <p className="font-polysans text-13 font-normal text-graphite">7 day streak</p>
                <p className="text-11 text-slate">Daily goal: 70%</p>
              </div>
            </div>
          </div>

          {/* Upcoming session */}
          <div className="rounded-xl border border-mist bg-canvas p-4 shadow-[0_1px_4px_rgba(0,0,0,0.04)]">
            <span className="rounded-full bg-ember/10 px-2 py-0.5 text-11 text-ember">Today</span>
            <p className="mt-1.5 font-polysans text-13 font-normal text-graphite">P&amp;L Practice</p>
            <p className="text-11 text-slate">20 questions · ~30 min</p>
          </div>

          {/* Recent sessions */}
          <div className="rounded-xl border border-mist bg-canvas p-4 shadow-[0_1px_4px_rgba(0,0,0,0.04)]">
            <p className="font-polysans text-13 font-normal text-graphite">Recent</p>
            <div className="mt-2 space-y-1.5">
              {[
                { name: "P&L", acc: 83 },
                { name: "T&W", acc: 92 },
              ].map((s) => (
                <div key={s.name} className="flex items-center justify-between">
                  <span className="text-13 text-graphite">{s.name}</span>
                  <span className={`text-11 font-medium ${s.acc >= 80 ? "text-success" : "text-brass"}`}>
                    {s.acc}%
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Topics */}
          <div className="rounded-xl border border-mist bg-canvas p-4 shadow-[0_1px_4px_rgba(0,0,0,0.04)]">
            <p className="font-polysans text-13 font-normal text-graphite">Topics</p>
            <div className="mt-2 flex items-center justify-center gap-2">
              {[
                { l: "Q", bg: "bg-ember" },
                { l: "L", bg: "bg-graphite" },
                { l: "V", bg: "bg-brass" },
              ].map((t) => (
                <div key={t.l} className={`flex h-9 w-9 items-center justify-center rounded-lg ${t.bg}`}>
                  <span className="font-polysans text-xs font-semibold text-inverse">{t.l}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
