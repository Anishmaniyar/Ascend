import SectionHeading from "@/components/ui/SectionHeading";
import { CheckIcon, ClockIcon, ZapIcon, ArrowRightIcon } from "@/components/ui/icons";

const MODES = [
  {
    icon: CheckIcon,
    title: "Practice Mode",
    text: "Learn while solving — see the explanation after every question.",
  },
  {
    icon: ZapIcon,
    title: "Test Mode",
    text: "Simulates the real aptitude test. Results at the end.",
  },
];

const POINTS = ["Instant solutions after every attempt", "Difficulty levels from Easy to Hard", "Timed sessions that mirror the real test"];

export default function PracticeSection() {
  return (
    <section className="bg-ash py-20">
      <div className="mx-auto grid max-w-[var(--page-max-width)] items-center gap-16 px-6 lg:grid-cols-2">
        {/* Question player mockup */}
        <div className="order-2 rounded-2xl border border-mist bg-canvas p-6 md:p-8 lg:order-1">
          <div className="flex items-center justify-between gap-4">
            <p className="font-polysans text-13 tracking-[-0.02em] text-slate">
              Profit &amp; Loss · Question 3 of 10
            </p>
            <span className="flex items-center gap-1.5 rounded-tags bg-fog px-2.5 py-1 text-13 text-steel">
              <ClockIcon className="h-3.5 w-3.5" />
              02:14
            </span>
          </div>
          <p className="mt-5 text-15 leading-[1.5] text-graphite">
            The marked price of a shirt is ₹800. A shopkeeper offers a 25%
            discount and still makes a 20% profit. Find the cost price.
          </p>
          <div className="mt-5 space-y-2.5">
            {["₹400", "₹480", "₹500", "₹600"].map((option, i) => (
              <div
                key={option}
                className={`flex items-center gap-3 rounded-lg border px-3.5 py-2.5 text-15 transition-colors ${
                  i === 2
                    ? "border-ember bg-fog text-graphite"
                    : "border-mist text-steel"
                }`}
              >
                <span className="font-polysans text-13 text-slate">
                  {String.fromCharCode(65 + i)}
                </span>
                {option}
                {i === 2 && <CheckIcon className="ml-auto h-4 w-4 text-ember" />}
              </div>
            ))}
          </div>
          <div className="mt-6 flex items-center justify-between">
            <span className="text-13 text-slate">Answer saved — explanation shown instantly</span>
            <span className="inline-flex items-center gap-1.5 rounded-buttons bg-graphite px-5 py-2.5 font-polysans text-13 tracking-[-0.02em] text-inverse">
              Next
              <ArrowRightIcon className="h-3.5 w-3.5" />
            </span>
          </div>
        </div>

        {/* Text */}
        <div className="order-1 lg:order-2">
          <SectionHeading
            kicker="Practice sessions"
            title="Practice like the real placement test."
            description="Two modes for two goals — build understanding first, then simulate test-day pressure."
          />
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {MODES.map((mode) => {
              const Icon = mode.icon;
              return (
                <div key={mode.title} className="rounded-asymmetric bg-canvas p-5">
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-fog text-ember">
                    <Icon className="h-4 w-4" />
                  </span>
                  <p className="mt-4 font-polysans text-base tracking-[-0.02em] text-graphite">
                    {mode.title}
                  </p>
                  <p className="mt-2 text-13 leading-[1.5] text-steel">{mode.text}</p>
                </div>
              );
            })}
          </div>
          <ul className="mt-8 space-y-4">
            {POINTS.map((point) => (
              <li key={point} className="flex gap-4">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-sm bg-ember" />
                <p className="text-15 leading-[1.5] text-steel">{point}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
