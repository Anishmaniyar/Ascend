import Link from "next/link";
import Button from "@/components/ui/Button";
import Reveal from "./Reveal";

export default function FinalCTA() {
  return (
    <section className="bg-canvas px-6 py-[160px] md:py-[192px]">
      <div className="mx-auto max-w-[1112px] text-center">
        <Reveal>
          <h2
            className="editorial-heading mx-auto max-w-[560px] text-graphite"
            style={{ fontSize: "clamp(30px, 4vw, 38px)", lineHeight: "42px" }}
          >
            Start your preparation today.
          </h2>
        </Reveal>
        <Reveal delay={100}>
          <p className="mx-auto mt-4 max-w-[460px] font-inter text-[15px] leading-[24px] text-steel">
            Join focused practice sessions and track every step of your
            progress.
          </p>
        </Reveal>
        <Reveal delay={160}>
          <div className="mt-8 flex justify-center">
            <Button render={<Link href="/register" />} variant="primary" size="lg">
              Start Practicing
            </Button>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
