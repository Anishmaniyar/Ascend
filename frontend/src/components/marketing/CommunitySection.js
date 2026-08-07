import Link from "next/link";
import SectionHeading from "@/components/ui/SectionHeading";
import { ChatIcon, HeartIcon, ArrowRightIcon } from "@/components/ui/icons";
import { discussions } from "@/lib/mock/landing";

export default function CommunitySection() {
  return (
    <section id="community" className="bg-canvas py-20">
      <div className="mx-auto grid max-w-[var(--page-max-width)] items-center gap-16 px-6 lg:grid-cols-2">
        {/* Text */}
        <div>
          <SectionHeading
            kicker="Discussions"
            title="Learn together."
            description="Stuck on a concept? Ask the community. Discussions, comments, replies and likes keep everyone moving — the way real placement prep works."
          />
          <Link
            href="/discussions"
            className="mt-8 inline-flex items-center gap-1.5 rounded-buttons border border-graphite px-6 py-3 font-polysans text-base tracking-[-0.02em] text-graphite transition-colors hover:bg-graphite hover:text-inverse"
          >
            Join the discussion
            <ArrowRightIcon className="h-4 w-4" />
          </Link>
        </div>

        {/* Discussion preview */}
        <div className="divide-y divide-mist rounded-2xl bg-ash px-6">
          {discussions.map((d) => (
            <article key={d.id} className="py-6 first:pt-8 last:pb-8">
              <p className="font-polysans text-base tracking-[-0.02em] text-graphite">
                {d.title}
              </p>
              <p className="mt-2 line-clamp-2 text-13 leading-[1.5] text-steel">
                {d.snippet}
              </p>
              <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-13 text-slate">
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
                <span>{d.author} · {d.time}</span>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
