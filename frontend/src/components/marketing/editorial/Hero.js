import Link from "next/link";
import Button from "@/components/ui/Button";
import Reveal from "./Reveal";
import { HeroPreview, HeroThumbnails } from "./HeroPreview";

export default function Hero() {
  return (
    <section className="bg-canvas px-6 pt-[104px] md:pt-[120px]">
      <div className="mx-auto max-w-[1112px] text-center">
        <Reveal>
          <p className="inline-flex items-center gap-2 rounded-tags border border-mist bg-canvas px-3 py-1.5 font-inter text-[11px] text-steel">
            <span className="h-1.5 w-1.5 rounded-full bg-graphite" />
            Built for placement preparation
          </p>
        </Reveal>

        <Reveal delay={80}>
          <h1
            className="editorial-heading mx-auto mt-6 max-w-[640px] text-graphite"
            style={{ fontSize: "clamp(36px, 5vw, 45px)", lineHeight: "47px" }}
          >
            Practice with purpose.
            <br />
            Prepare with confidence.
          </h1>
        </Reveal>

        <Reveal delay={140}>
          <p className="mx-auto mt-5 max-w-[620px] font-inter text-[16px] font-normal leading-[24px] text-steel">
            A focused aptitude practice platform for mastering topics, company
            tests, and the skills that matter.
          </p>
        </Reveal>

        <Reveal delay={200}>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-2.5">
            <Button render={<Link href="/register" />} variant="primary" size="lg">
              Start Practicing
            </Button>
            <Button render={<Link href="#topics" />} variant="secondary" size="lg">
              Explore Topics
            </Button>
          </div>
        </Reveal>

        <Reveal delay={260} className="mt-14 text-left md:mt-16">
          <HeroPreview />
          <HeroThumbnails />
          <p className="mt-4 text-center font-inter text-[11px] text-slate">
            Topics · Practice sessions · Company sheets · Progress · History
          </p>
        </Reveal>
      </div>
    </section>
  );
}
