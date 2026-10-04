import { ChatIcon, HeartIcon } from "@/components/ui/icons";
import { discussions } from "@/lib/mock/landing";
import Button from "@/components/ui/Button";

export default function DiscussionsPage() {
  return (
    <div className="mx-auto w-full max-w-[var(--page-max-width)] px-6 py-10">
      <header className="flex flex-wrap items-end justify-between gap-6">
        <div>
          <h1 className="font-polysans text-heading-lg tracking-[-0.02em] text-graphite">Discussions</h1>
          <p className="mt-2 max-w-[56ch] text-15 leading-[1.5] text-steel">
            Ask questions, share shortcuts, and help fellow aspirants.
          </p>
        </div>
        {/* TODO: wire to create-discussion flow */}
        <Button variant="primary">New Discussion</Button>
      </header>

      <div className="mt-10 divide-y divide-mist rounded-2xl bg-ash px-6">
        {discussions.map((d) => (
          <article key={d.id} className="py-5 first:pt-7 last:pb-7">
            <p className="font-polysans text-base tracking-[-0.02em] text-graphite transition-colors hover:text-ember">
              {d.title}
            </p>
            <p className="mt-2 max-w-[70ch] text-13 leading-[1.5] text-steel">
              {d.snippet}
            </p>
            <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2 text-13 text-slate">
              <span className="rounded-tags bg-canvas px-2.5 py-0.5 text-13 text-brass">
                {d.tag}
              </span>
              <span className="flex items-center gap-1.5">
                <ChatIcon className="h-3.5 w-3.5" />
                {d.replies} replies
              </span>
              <span className="flex items-center gap-1.5">
                <HeartIcon className="h-3.5 w-3.5" />
                {d.likes} likes
              </span>
              <span>
                {d.author} · {d.time}
              </span>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
