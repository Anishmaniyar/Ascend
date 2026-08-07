import Hero from "@/components/marketing/Hero";
import TrustBar from "@/components/marketing/TrustBar";
import WorkflowSection from "@/components/marketing/WorkflowSection";
import LearnSection from "@/components/marketing/LearnSection";
import PracticeSection from "@/components/marketing/PracticeSection";
import AnalyticsSection from "@/components/marketing/AnalyticsSection";
import CompanySection from "@/components/marketing/CompanySection";
import CommunitySection from "@/components/marketing/CommunitySection";

export default function LandingPage() {
  return (
    <>
      <Hero />
      <TrustBar />
      <WorkflowSection />
      <LearnSection />
      <PracticeSection />
      <AnalyticsSection />
      <CompanySection />
      <CommunitySection />
    </>
  );
}
