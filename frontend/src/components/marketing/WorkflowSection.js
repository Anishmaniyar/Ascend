import SectionHeading from "@/components/ui/SectionHeading";
import { ChevronDownIcon, ArrowRightIcon } from "@/components/ui/icons";
import { topics } from "@/lib/mock/landing";

export default function WorkflowSection() {
  const selected = topics[0];
  const activeSubtopic = selected.subtopics[0];

  return (
    <section id="structured" className="bg-ash py-20">
      <div className="mx-auto max-w-[var(--page-max-width)] px-6">
        <SectionHeading
          kicker="How it works"
          title="Preparation shouldn't feel random."
          description="Every question on LeetAptitude lives inside a clear path — topic, subtopic, question, practice. No more jumping between scattered PDFs and random question banks."
        />

        {/* Flow chips */}
        <div className="mt-12 flex flex-wrap items-center justify-center gap-2 font-polysans text-13 tracking-[-0.02em] text-brass">
          {["Choose Topic", "Pick a Subtopic", "Solve Questions", "Review Progress"].map(
            (step, i) => (
              <span key={step} className="flex items-center gap-2">
                <span className="rounded-tags bg-canvas px-3 py-1.5">{step}</span>
                {i < 3 && <ArrowRightIcon className="h-3.5 w-3.5" />}
              </span>
            ),
          )}
        </div>

        {/* Product preview — mini topic browser */}
        <div className="mt-8 grid gap-6 rounded-2xl border border-mist bg-canvas p-6 md:grid-cols-3 md:p-8">
          {/* Topics column */}
          <div className="md:border-r md:border-mist md:pr-6">
            <p className="font-polysans text-13 tracking-[-0.02em] text-slate">Topics</p>
            <div className="mt-4 space-y-2">
              {topics.map((topic) => (
                <div
                  key={topic.id}
                  className={`flex items-center justify-between rounded-lg px-3 py-2.5 text-15 ${
                    topic.id === selected.id
                      ? "bg-ash text-graphite"
                      : "text-steel"
                  }`}
                >
                  {topic.title}
                  {topic.id === selected.id && (
                    <ChevronDownIcon className="h-4 w-4 rotate-[-90deg] text-ember" />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Subtopics column */}
          <div className="md:border-r md:border-mist md:pr-6">
            <p className="font-polysans text-13 tracking-[-0.02em] text-slate">
              {selected.title}
            </p>
            <div className="mt-4 space-y-2">
              {selected.subtopics.map((subtopic) => (
                <div
                  key={subtopic.name}
                  className={`flex items-center justify-between rounded-lg px-3 py-2.5 text-15 ${
                    subtopic.name === activeSubtopic.name
                      ? "bg-fog text-graphite"
                      : "text-steel"
                  }`}
                >
                  {subtopic.name}
                  <span className="text-13 text-slate">{subtopic.questions}Q</span>
                </div>
              ))}
            </div>
          </div>

          {/* Question preview column */}
          <div className="md:pl-2">
            <div className="flex items-center justify-between">
              <p className="font-polysans text-13 tracking-[-0.02em] text-slate">
                Question 3 of {activeSubtopic.questions}
              </p>
              <span className="rounded-tags bg-fog px-2.5 py-1 text-13 text-brass">
                MEDIUM
              </span>
            </div>
            <p className="mt-4 text-15 leading-[1.5] text-graphite">
              A shopkeeper sells an article for ₹1,080 at a profit of 20%. What
              was its cost price?
            </p>
            <div className="mt-4 space-y-2">
              {["₹860", "₹900", "₹940", "₹1,000"].map((option, i) => (
                <div
                  key={option}
                  className={`flex items-center gap-3 rounded-lg border px-3 py-2.5 text-15 ${
                    i === 1
                      ? "border-graphite bg-fog text-graphite"
                      : "border-mist text-steel"
                  }`}
                >
                  <span className="font-polysans text-13 text-slate">
                    {String.fromCharCode(65 + i)}
                  </span>
                  {option}
                </div>
              ))}
            </div>
            <div className="mt-5 flex items-center justify-between">
              <span className="text-13 text-slate">12 / {activeSubtopic.questions} solved</span>
              <span className="inline-flex items-center gap-1.5 rounded-buttons bg-graphite px-4 py-2 font-polysans text-13 tracking-[-0.02em] text-inverse">
                Submit
                <ArrowRightIcon className="h-3.5 w-3.5" />
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
