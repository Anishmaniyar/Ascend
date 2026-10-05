import Link from "next/link";
import RingProgress from "@/components/charts/RingProgress";
import { ArrowRightIcon } from "@/components/ui/icons";
import { recommendedTopics as mockTopics } from "@/lib/mock/dashboard";
import Button from "@/components/ui/Button";

// Props: `topics` — live API rows { topic, accuracy, solved, reason }.
// Falls back to mocks when omitted (dashboard).
export default function RecommendedTopics({ topics } = {}) {
  const list = (topics || mockTopics).map((t) => ({
    id: t.id || t.topic,
    ...t,
  }));

  if (topics && topics.length === 0) {
    return (
      <p className="text-13 leading-[1.5] text-slate">
        Not enough practice data yet — solve a few sessions and we&apos;ll
        point out where to focus.
      </p>
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2">
      {list.map((topic) => (
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
          <Button render={<Link href="/topics" />} variant="secondary" size="sm" className="shrink-0">
            Practice
            <ArrowRightIcon className="h-3.5 w-3.5" />
          </Button>
        </div>
      ))}
    </div>
  );
}
