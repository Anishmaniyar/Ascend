import Hero from "@/components/marketing/editorial/Hero";
import { FeatureIntro, BentoGrid } from "@/components/marketing/editorial/Bento";
import {
  Showcase,
  ContentFormats,
  Philosophy,
} from "@/components/marketing/editorial/Sections";
import FinalCTA from "@/components/marketing/editorial/FinalCTA";

export default function LandingPage() {
  return (
    <>
      <Hero />
      <FeatureIntro />
      <BentoGrid />
      <Showcase />
      <ContentFormats />
      <Philosophy />
      <FinalCTA />
    </>
  );
}
