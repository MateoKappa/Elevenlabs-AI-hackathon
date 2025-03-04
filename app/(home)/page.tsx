"use client";
import { BenefitsSection } from "@/components/layout/sections/benefits";
import { FeaturesSection } from "@/components/layout/sections/features";
import { FooterSection } from "@/components/layout/sections/footer";
import { HeroSection } from "@/components/layout/sections/hero";
import { TeamSection } from "@/components/layout/sections/team";

export default function Home() {
  return (
    <>
      <HeroSection />
      <BenefitsSection />
      <FeaturesSection />
      <TeamSection />
      <FooterSection />
    </>
  );
}
