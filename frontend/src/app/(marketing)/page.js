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
      <CoreLearningLoopSection />
      <PlacementSection />
      <CompetitionSection />
      <CTASection />
    </>
  );
}
