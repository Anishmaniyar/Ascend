/* Large realistic LeetAptitude practice-session window + miniature thumbnails.
   Pure CSS/Tailwind — no images. Monochrome, hairline borders. */

const SIDEBAR_ITEMS = [
  { label: "Topics", active: false },
  { label: "Subtopics", active: false },
  { label: "Practice", active: true },
  { label: "Company Sheets", active: false },
  { label: "Progress", active: false },
  { label: "History", active: false },
];

const OPTIONS = ["640 km", "720 km", "840 km", "960 km"];

export function HeroPreview() {
  return (
    <div className="overflow-hidden rounded-2xl border border-mist bg-ivory shadow-[0_1px_2px_rgba(0,0,0,0.04),0_12px_40px_-16px_rgba(0,0,0,0.12)]">
      {/* Window chrome */}
      <div className="flex items-center gap-1.5 border-b border-mist bg-canvas px-4 py-2.5">
        <span className="h-2 w-2 rounded-full bg-faint" />
        <span className="h-2 w-2 rounded-full bg-faint" />
        <span className="h-2 w-2 rounded-full bg-faint" />
        <span className="ml-3 hidden rounded-md bg-ash px-2.5 py-1 font-inter text-[10px] text-slate sm:block">
          leetaptitude.app/practice
        </span>
        <span className="ml-auto hidden items-center gap-2 sm:flex">
          <span className="rounded-md bg-ash px-2 py-0.5 font-inter text-[10px] text-steel">
            Medium
          </span>
          <span className="font-inter text-[10px] text-slate">Q 12 / 20</span>
        </span>
      </div>

      <div className="flex">
        {/* Sidebar */}
        <aside className="hidden w-[168px] shrink-0 flex-col gap-0.5 border-r border-mist bg-canvas p-3 md:flex">
          <p className="px-2 pb-2 font-inter text-[10px] uppercase tracking-[0.08em] text-faint">
            Prepare
          </p>
          {SIDEBAR_ITEMS.map((item) => (
            <div
              key={item.label}
              className={`flex items-center gap-2 rounded-md px-2 py-1.5 font-inter text-[11px] ${
                item.active
                  ? "bg-ash font-medium text-graphite"
                  : "text-steel"
              }`}
            >
              <span
                className={`h-1 w-1 rounded-full ${
                  item.active ? "bg-graphite" : "bg-faint"
                }`}
              />
              {item.label}
            </div>
          ))}
          <div className="mt-auto rounded-lg bg-ash p-2.5">
            <p className="font-inter text-[10px] font-medium text-graphite">
              Session 14
            </p>
            <p className="mt-0.5 font-inter text-[10px] text-slate">
              11 of 20 · 78% acc.
            </p>
            <div className="mt-2 h-1 overflow-hidden rounded-full bg-mist">
              <div className="h-full w-[55%] rounded-full bg-graphite" />
            </div>
          </div>
        </aside>

        {/* Question */}
        <div className="min-w-0 flex-1 p-4 sm:p-6">
          <div className="flex items-center gap-2">
            <span className="font-inter text-[10px] text-slate">
              Time &amp; Distance
            </span>
            <span className="font-inter text-[10px] text-faint">·</span>
            <span className="font-inter text-[10px] text-slate">
              Question 12
            </span>
            <span className="ml-auto rounded-md border border-mist px-1.5 py-0.5 font-inter text-[10px] text-steel">
              Medium
            </span>
          </div>

          <p className="mt-3 max-w-[52ch] font-inter text-[13px] leading-[1.65] text-graphite sm:text-[14px]">
            A train running at 72 km/h crosses a pole in 25 seconds. What is
            the length of the train? If the same train crosses a 360 m bridge,
            how much time will it take?
          </p>

          <div className="mt-4 space-y-2">
            {OPTIONS.map((opt, i) => (
              <div
                key={opt}
                className={`flex items-center gap-2.5 rounded-lg border px-3 py-2.5 ${
                  i === 1
                    ? "border-graphite bg-canvas"
                    : "border-mist bg-canvas"
                }`}
              >
                <span
                  className={`flex h-5 w-5 items-center justify-center rounded-full border font-inter text-[10px] ${
                    i === 1
                      ? "border-graphite bg-graphite text-canvas"
                      : "border-mist-strong text-slate"
                  }`}
                >
                  {String.fromCharCode(65 + i)}
                </span>
                <span className="font-inter text-[12px] text-graphite">
                  {opt}
                </span>
                {i === 1 && (
                  <span className="ml-auto font-inter text-[10px] text-slate">
                    Selected
                  </span>
                )}
              </div>
            ))}
          </div>

          <div className="mt-4 flex items-center gap-3 border-t border-mist pt-4">
            <div className="h-1 flex-1 overflow-hidden rounded-full bg-mist">
              <div className="h-full w-[60%] rounded-full bg-graphite" />
            </div>
            <span className="font-inter text-[10px] text-slate">12 / 20</span>
            <span className="rounded-buttons bg-graphite px-3.5 py-2 font-inter text-[11px] text-canvas">
              Next question
            </span>
          </div>
        </div>

        {/* Right progress rail */}
        <aside className="hidden w-[172px] shrink-0 flex-col gap-3 border-l border-mist bg-canvas p-3 lg:flex">
          <div className="rounded-lg bg-ash p-3">
            <p className="font-inter text-[10px] uppercase tracking-[0.08em] text-slate">
              Progress
            </p>
            <p className="mt-1.5 font-inter text-[18px] font-medium leading-none text-graphite">
              60%
            </p>
            <div className="mt-2 grid grid-cols-5 gap-1">
              {Array.from({ length: 10 }).map((_, i) => (
                <span
                  key={i}
                  className={`h-4 rounded-[3px] ${
                    i < 6 ? "bg-graphite" : "bg-mist"
                  }`}
                />
              ))}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div className="rounded-lg border border-mist p-2.5 text-center">
              <p className="font-inter text-[13px] font-medium text-graphite">
                78%
              </p>
              <p className="font-inter text-[10px] text-slate">Accuracy</p>
            </div>
            <div className="rounded-lg border border-mist p-2.5 text-center">
              <p className="font-inter text-[13px] font-medium text-graphite">
                6
              </p>
              <p className="font-inter text-[10px] text-slate">Streak</p>
            </div>
          </div>
          <div className="rounded-lg border border-mist p-2.5">
            <p className="font-inter text-[10px] text-slate">Difficulty</p>
            <div className="mt-1.5 flex gap-1">
              {["E", "M", "H"].map((d, i) => (
                <span
                  key={d}
                  className={`flex-1 rounded-[4px] py-1 text-center font-inter text-[10px] ${
                    i === 1
                      ? "bg-graphite text-canvas"
                      : "bg-ash text-slate"
                  }`}
                >
                  {d}
                </span>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

const THUMBS = [
  {
    label: "Practice",
    meta: "Q 12 / 20 · 78%",
    body: (
      <div className="space-y-1">
        <div className="h-1.5 w-4/5 rounded-full bg-mist-strong" />
        <div className="space-y-1 pt-1">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className={`rounded-[4px] border px-1.5 py-1 ${
                i === 1 ? "border-graphite" : "border-mist"
              }`}
            >
              <div className="h-1 w-2/3 rounded-full bg-mist-strong" />
            </div>
          ))}
        </div>
      </div>
    ),
  },
  {
    label: "Topics",
    meta: "3 tracks · 640 Qs",
    body: (
      <div className="space-y-1 pt-0.5">
        {["Quantitative", "Logical", "Verbal"].map((t, i) => (
          <div key={t} className="flex items-center gap-1.5">
            <span className="h-3.5 w-3.5 rounded-[4px] bg-ash" />
            <div className="h-1 flex-1 rounded-full bg-mist" />
            <span className="font-inter text-[8px] text-slate">
              {[42, 35, 28][i]}%
            </span>
          </div>
        ))}
      </div>
    ),
  },
  {
    label: "Company Sheets",
    meta: "TCS · Infosys · Wipro",
    body: (
      <div className="grid grid-cols-3 gap-1 pt-0.5">
        {["T", "I", "W"].map((c) => (
          <div
            key={c}
            className="rounded-[4px] border border-mist py-1.5 text-center font-inter text-[9px] text-graphite"
          >
            {c}
          </div>
        ))}
      </div>
    ),
  },
  {
    label: "Progress",
    meta: "This week",
    body: (
      <div className="flex items-end gap-1 pt-1">
        {[35, 55, 40, 70, 52, 85, 64].map((h, i) => (
          <div
            key={i}
            className={`flex-1 rounded-[2px] ${i === 5 ? "bg-graphite" : "bg-mist-strong"}`}
            style={{ height: `${h * 0.32}px` }}
          />
        ))}
      </div>
    ),
  },
  {
    label: "History",
    meta: "14 sessions",
    body: (
      <div className="space-y-1 pt-0.5">
        {[
          ["P&L · 15/18", "83%"],
          ["T&W · 11/12", "92%"],
        ].map(([a, b]) => (
          <div key={a} className="flex items-center justify-between">
            <div className="h-1 w-16 rounded-full bg-mist-strong" />
            <span className="font-inter text-[8px] text-slate">{b}</span>
          </div>
        ))}
      </div>
    ),
  },
];

export function HeroThumbnails() {
  return (
    <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
      {THUMBS.map((t) => (
        <div
          key={t.label}
          className="rounded-cards border border-mist bg-canvas p-3"
        >
          <div className="min-h-[56px]">{t.body}</div>
          <p className="mt-2 font-inter text-[11px] font-medium text-graphite">
            {t.label}
          </p>
          <p className="font-inter text-[10px] text-slate">{t.meta}</p>
        </div>
      ))}
    </div>
  );
}
