import Link from "next/link";
import RingProgress from "@/components/charts/RingProgress";
import { ArrowRightIcon } from "@/components/ui/icons";
import { recommendedTopics } from "@/lib/mock/dashboard";

export default function RecommendedTopics() {
  return (
    <div className="grid gap-6 sm:grid-cols-2">
      {recommendedTopics.map((topic) => (
        <div
          key={topic.id}
          className="flex items-center gap-5 rounded-asymmetric bg-ash p-6"
        >
          <RingProgress value={topic.accuracy} size={64} strokeWidth={5}>
            <span className="font-polysans text-13 text-graphite">
              {topic.accuracy}%
            </span>
          </RingProgress>
          <div className="min-w-0 flex-1">
            <p className="text-13 text-slate">{topic.reason}</p>
            <p className="mt-1 font-polysans text-base tracking-[-0.02em] text-graphite">
              {topic.topic}
            </p>
            <p className="mt-1 text-13 text-slate">{topic.solved} solved so far</p>
          </div>
          <Link
            href="/topics"
            className="inline-flex shrink-0 items-center gap-1.5 rounded-buttons border border-graphite px-4 py-2 font-polysans text-13 tracking-[-0.02em] text-graphite transition-colors hover:bg-graphite hover:text-inverse"
          >
            Practice
            <ArrowRightIcon className="h-3.5 w-3.5" />
          </Link>
        </div>
      ))}
    </div>
  );
}
