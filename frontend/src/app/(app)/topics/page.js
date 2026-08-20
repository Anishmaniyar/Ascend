import Link from "next/link";
import { ArrowRightIcon } from "@/components/ui/icons";
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
          <Link
            key={topic.id}
            href={`/topics/${topic.id}`}
            className="group rounded-2xl border border-transparent bg-ash p-6 transition-colors hover:border-graphite"
          >
            <div className="flex items-start justify-between gap-3">
              <p className="font-polysans text-subheading tracking-[-0.02em] text-graphite">
                {topic.title}
              </p>
              <ArrowRightIcon className="mt-1 h-4 w-4 shrink-0 text-slate transition-colors group-hover:text-ember" />
            </div>
            <p className="mt-2 text-15 leading-[1.5] text-steel">
              {topic.description}
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              {topic.subtopics.slice(0, 4).map((subtopic) => (
                <span
                  key={subtopic.id}
                  className="rounded-tags bg-canvas px-3 py-1 text-13 text-slate"
                >
                  {subtopic.name} · {subtopic.questions}
                </span>
              ))}
              {topic.subtopics.length > 4 && (
                <span className="rounded-tags bg-canvas px-3 py-1 text-13 text-slate">
                  +{topic.subtopics.length - 4} more
                </span>
              )}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
