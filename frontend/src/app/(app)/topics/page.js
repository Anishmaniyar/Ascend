import { topics } from "@/lib/mock/landing";

export default function TopicsPage() {
  return (
    <div className="mx-auto w-full max-w-[var(--page-max-width)] px-6 py-10">
      <header>
        <h1 className="text-heading-lg text-graphite">Topics</h1>
        <p className="mt-2 max-w-[56ch] text-15 leading-[1.5] text-steel">
          Learn aptitude topic by topic. Pick a topic, drill into subtopics,
          and start a practice session.
        </p>
      </header>

      <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {topics.map((topic) => (
          <article
            key={topic.id}
            className="rounded-2xl border border-transparent bg-ash p-6 transition-colors hover:border-graphite"
          >
            <p className="font-polysans text-subheading tracking-[-0.02em] text-graphite">
              {topic.title}
            </p>
            <p className="mt-2 text-15 leading-[1.5] text-steel">
              {topic.description}
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              {topic.subtopics.map((subtopic) => (
                <span
                  key={subtopic.name}
                  className="rounded-tags bg-canvas px-3 py-1 text-13 text-slate"
                >
                  {subtopic.name} · {subtopic.questions}
                </span>
              ))}
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
