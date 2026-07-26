import { ComparisonTable } from "@/components/landing/ComparisonTable";
import { CTA } from "@/components/landing/CTA";
import { Features } from "@/components/landing/Features";
import { Hero } from "@/components/landing/Hero";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { InstallSection } from "@/components/landing/InstallSection";
import { ProblemStatement } from "@/components/landing/ProblemStatement";
import { SocialProof } from "@/components/landing/SocialProof";
import { TrustBar } from "@/components/landing/TrustBar";

export default function Home() {
  return (
    <>
      <Hero />
      <TrustBar />
      <ProblemStatement />
      <Features />
      <HowItWorks />
      <ComparisonTable />
      <InstallSection />
      <SocialProof />
      <CTA />
    </>
  );
}
