"use client";
import { BenefitsSection } from "@/components/layout/sections/benefits";
import { CommunitySection } from "@/components/layout/sections/community";
import { ContactSection } from "@/components/layout/sections/contact";
import { FAQSection } from "@/components/layout/sections/faq";
import { FeaturesSection } from "@/components/layout/sections/features";
import { FooterSection } from "@/components/layout/sections/footer";
import { HeroSection } from "@/components/layout/sections/hero";
import { NewsletterSection } from "@/components/layout/sections/newsletter";
import { PricingSection } from "@/components/layout/sections/pricing";
import { ServicesSection } from "@/components/layout/sections/services";
import { SponsorsSection } from "@/components/layout/sections/sponsors";
import { TeamSection } from "@/components/layout/sections/team";
import { TestimonialSection } from "@/components/layout/sections/testimonial";
import { useEffect } from "react";
import { fal } from "@fal-ai/client";

// export const metadata = {
//   title: `Cosmic - Shadcn Landing Page Template`,
//   description:
//     "Discover high-converting SaaS landing pages built with Next.js and Shadcn. Modern, responsive design and optimized features to elevate your brand's online presence.",
//   openGraph: {
//     type: "website",
//     url: "https://shadcnuikit.com/template/cosmic-landing-page-template",
//     title: "Cosmic - Landing Page Template (Shadcn)",
//     description: "Shadcn landing page template for developers",
//     images: [
//       {
//         url: "/seo.jpg",
//         width: 1200,
//         height: 630,
//         alt: "Cosmic - Landing Page Template",
//       },
//     ],
//   },
//   twitter: {
//     card: "summary_large_image",
//     site: "https://shadcnuikit.com/template/cosmic-landing-page-template",
//     title: "Cosmic - Landing Page Template (Shadcn)",
//     description: "Shadcn landing page template for developers",
//     images: ["/seo.jpg"],
//   },
// };

fal.config({
  proxyUrl: "/api/fal",
});

export default function Home() {
  // useEffect(() => {
  //   (async () => {
  //     const result = await fal.subscribe(
  //       "fal-ai/minimax-video/image-to-video",
  //       {
  //         input: {
  //           prompt:
  //             "A woman is making a cocktail and a bear comes up and drinks the cocktail",
  //           image_url:
  //             "https://scontent.fath4-2.fna.fbcdn.net/v/t39.30808-6/357398398_6566702153375369_3512165724848225869_n.jpg?_nc_cat=103&ccb=1-7&_nc_sid=a5f93a&_nc_ohc=GHa9SDB4yigQ7kNvgFlAXGB&_nc_oc=Adg39KRkcslqXGDonM1RPJfZoDxdnE3JD6xyLcgWayLmMEZPANo7SBAc_yUELkt1h-UoKY4EjCk5hUS3Dwp4-pXJ&_nc_zt=23&_nc_ht=scontent.fath4-2.fna&_nc_gid=AxSiNn47rd3L4vM6bgxbqkq&oh=00_AYAbESFo_pi8rxMNfqJDvuplPH-dIBpDuxXQX7kBQ6c9Jw&oe=67BF6A08",
  //         },
  //         logs: true,
  //         onQueueUpdate: (update) => {
  //           console.log(update);
  //         },
  //       }
  //     );
  //     const result = await fal.subscribe("fal-ai/haiper-video/v2", {
  //       input: {
  //         prompt:
  //           "Epic low-cut camera capture of a girl clad in ultraviolet threads, Peter Max art style depiction, luminous diamond skin glistening under a vast moon's radiance, embodied in a superhuman flight among mystical ruins, symbolizing a deity's ritual ascent, hyper-detailed",
  //       },
  //       logs: true,
  //       onQueueUpdate: (update) => {
  //         console.log(update);
  //         if (update.status === "IN_PROGRESS") {
  //           update.logs.map((log) => log.message).forEach(console.log);
  //         }
  //       },
  //     });
  //     console.log(result);
  //     console.log(result.data);
  //     console.log(result.requestId);
  //   })();
  // }, []);

  return (
    <>
      <HeroSection />
      <SponsorsSection />
      <BenefitsSection />
      <FeaturesSection />
      <ServicesSection />
      <TestimonialSection />
      <TeamSection />
      <PricingSection />
      <CommunitySection />
      <ContactSection />
      <FAQSection />
      <NewsletterSection />
      <FooterSection />
    </>
  );
}
