import CTABanner from "@/components/cta-banner";
import FAQ from "@/components/faq";
import Features from "@/components/features";
import Footer from "@/components/footer";
import Hero from "@/components/hero";
import { Navbar } from "@/components/navbar";
import UseCases from "@/components/use-cases";
import Testimonials from "@/components/testimonials";
import BookingIframe from "@/components/booking-iframe";
import { getDictionary } from "./dictionaries";
import { Metadata } from "next";

interface PageProps {
  params: Promise<{
    lang: "en" | "fr";
  }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { lang } = await params;
  const dict = await getDictionary(lang);
  
  return {
    title: "SynAI - AI Voice Agents",
    description: dict.hero.description,
    keywords: [
      "AI voice agent",
      "voice automation",
      "customer service automation",
      "intelligent voice solutions",
      "business phone automation",
      "AI receptionist",
      "voice AI consulting",
      "customer experience automation"
    ],
    openGraph: {
      title: "SynAI - AI Voice Agents",
      description: dict.hero.description,
      url: `https://synai.pro/${lang}`,
      type: 'website',
      images: [
        {
          url: "/hero2.png",
          width: 1200,
          height: 675,
          alt: "SynAI AI voice agent dashboard showing call analytics and automation features",
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: "SynAI - AI Voice Agents",
      description: dict.hero.description,
      images: ["/hero2.png"],
    },
    alternates: {
      canonical: `https://synai.pro/${lang}`,
      languages: {
        'en-US': 'https://synai.pro/en',
        'fr-FR': 'https://synai.pro/fr',
      },
    },
  };
}

export default async function Home({ params }: PageProps) {
  const { lang } = await params;
  const dict = await getDictionary(lang);
  return (
    <>
      <Navbar dict={dict} lang={lang} isHomePage={true} />
      <main className="pt-16 xs:pt-20 sm:pt-24">
        <Hero dict={dict} lang={lang} />
        <Features dict={dict} />
        <UseCases dict={dict} />
        <FAQ dict={dict} />
        <Testimonials dict={dict} />
        <CTABanner dict={dict} lang={lang} />
        <section id="booking-section" className="py-16 px-6 max-w-7xl mx-auto">
          <BookingIframe lang={lang} />
        </section>
        <Footer dict={dict} lang={lang} />
      </main>
    </>
  );
} 