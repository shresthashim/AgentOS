import type { Metadata } from "next";
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
import { SITE_NAME, SITE_URL } from "@/lib/site";

const title = `Visual Workflow Automation with AI | ${SITE_NAME}`;
const description =
  "Build visual workflows across Gmail, Google Sheets, Slack, and Notion. Add AI steps, test with sample data, and track every run.";
const socialImage = {
  url: "/images/tour/build-light.webp",
  alt: "AgentOS workflow editor showing a lead follow-up workflow and its step settings.",
  width: 2160,
  height: 1350,
  type: "image/webp",
};

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: SITE_URL },
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    url: SITE_URL,
    title,
    description,
    images: [socialImage],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: [{ url: socialImage.url, alt: socialImage.alt }],
  },
};

const website = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: SITE_NAME,
  url: SITE_URL,
};

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(website).replace(/</g, "\\u003c") }}
      />
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
