import ContactForm from "@/components/contact-form";
import Footer from "@/components/footer";
import { Navbar } from "@/components/navbar";
import BookingIframe from "@/components/booking-iframe";
import { getDictionary } from "../dictionaries";
import { Metadata } from "next";

interface ContactPageProps {
  params: Promise<{
    lang: "en" | "fr";
  }>;
}

export async function generateMetadata({ params }: ContactPageProps): Promise<Metadata> {
  const { lang } = await params;
  const dict = await getDictionary(lang);
  
  return {
    title: "SynAI - Contact",
    description: dict.contact.subheading,
    openGraph: {
      title: "SynAI - Contact",
      description: dict.contact.subheading,
      url: `https://synai.pro/${lang}/contact`,
      type: 'website',
    },
    twitter: {
      card: 'summary',
      title: "SynAI - Contact",
      description: dict.contact.subheading,
    },
    alternates: {
      canonical: `https://synai.pro/${lang}/contact`,
      languages: {
        'en-US': 'https://synai.pro/en/contact',
        'fr-FR': 'https://synai.pro/fr/contact',
      },
    },
  };
}

export default async function ContactPage({ params }: ContactPageProps) {
  const { lang } = await params;
  const dict = await getDictionary(lang);
  
  return (
    <>
      <Navbar dict={dict} lang={lang} />
      <main className="pt-16 xs:pt-20 sm:pt-24">
        <ContactForm dict={dict} lang={lang} />
        <section className="py-16 px-6 max-w-7xl mx-auto">
          <BookingIframe lang={lang} />
        </section>
        <Footer dict={dict} lang={lang} />
      </main>
    </>
  );
} 