import Hero from "@/components/marketing/Hero";
import {
  TheProblemSection,
  CoreLearningLoopSection,
  PlacementSection,
  CompetitionSection,
  CTASection,
} from "@/components/marketing/ProductWalkthrough";

export default function LandingPage() {
  return (
    <>
      <Hero />
      <TheProblemSection />
      <div id="topics">
        <CoreLearningLoopSection />
      </div>
      <div id="sheets">
        <PlacementSection />
      </div>
      <div id="leaderboard">
        <CompetitionSection />
      </div>
      <CTASection />
    </>
  );
}
