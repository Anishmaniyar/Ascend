import { ChatIcon, HeartIcon } from "@/components/ui/icons";
import { recentDiscussions } from "@/lib/mock/dashboard";

export default function RecentDiscussions() {
  return (
    <div className="divide-y divide-mist">
      {recentDiscussions.map((d) => (
        <article key={d.id} className="py-3.5 first:pt-0 last:pb-0">
          <p className="text-15 text-graphite transition-colors hover:text-ember">
            {d.title}
          </p>
          <div className="mt-1.5 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-13 text-slate">
            <span className="rounded-tags bg-canvas px-2.5 py-0.5 text-13 text-brass">
              {d.tag}
            </span>
            <span className="flex items-center gap-1.5">
              <ChatIcon className="h-3.5 w-3.5" />
              {d.replies} replies
            </span>
            <span className="flex items-center gap-1.5">
              <HeartIcon className="h-3.5 w-3.5" />
              {d.likes}
            </span>
            <span>{d.time}</span>
          </div>
        </article>
      ))}
    </div>
  );
}
