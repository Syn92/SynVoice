import CTABanner from "@/components/cta-banner";
import FAQ from "@/components/faq";
import Features from "@/components/features";
import Footer from "@/components/footer";
import Hero from "@/components/hero";
import { Navbar } from "@/components/navbar";
import UseCases from "@/components/use-cases";
import Testimonials from "@/components/testimonials";
import { getDictionary } from "./dictionaries";

interface PageProps {
  params: Promise<{
    lang: "en" | "fr";
  }>;
}

export default async function Home({ params }: PageProps) {
  const { lang } = await params;
  const dict = await getDictionary(lang);
  return (
    <>
      <Navbar dict={dict} />
      <main className="pt-16 xs:pt-20 sm:pt-24">
        <Hero dict={dict} />
        {/* Remaining components are left untranslated for brevity */}
        <Features />
        <UseCases dict={dict} />
        <FAQ />
        <Testimonials />
        <CTABanner />
        <Footer />
      </main>
    </>
  );
} 