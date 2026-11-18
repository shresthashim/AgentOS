import { Hero } from "@/components/hero/hero";
import { BeforeAfter } from "@/components/sections/before-after";
import { Cta } from "@/components/sections/cta";
import { Faq } from "@/components/sections/faq";
import { FeaturedTemplates } from "@/components/sections/featured-templates";
import { HowItWorks } from "@/components/sections/how-it-works";
import { Playground } from "@/components/sections/playground";
import { ProductTour } from "@/components/sections/product-tour";
import { Integrations } from "@/components/sections/integrations";
import { Teams } from "@/components/sections/teams";
import { Trust } from "@/components/sections/trust";
import { SiteFooter } from "@/components/site-footer";
import { SiteNav } from "@/components/site-nav";
import { MobileCta } from "@/components/mobile-cta";
import { PageRail } from "@/components/page-rail";

export default function Home() {
  return (
    <>
      <a
        href="#main"
        className="sr-only z-[60] rounded-lg bg-cobalt px-4 py-2 font-semibold text-white focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
      >
        Skip to content
      </a>
      <SiteNav />
      <main id="main">
        <Hero />
        <Playground />
        <Integrations />
        <BeforeAfter />
        <HowItWorks />
        <ProductTour />
        <FeaturedTemplates />
        <Teams />
        <Trust />
        <Faq />
        <Cta />
      </main>
      <SiteFooter />
      <PageRail />
      <MobileCta />
    </>
  );
}
