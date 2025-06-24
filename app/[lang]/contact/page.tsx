import ContactForm from "@/components/contact-form";
import Footer from "@/components/footer";
import { Navbar } from "@/components/navbar";
import BookingIframe from "@/components/booking-iframe";
import { getDictionary } from "../dictionaries";

interface ContactPageProps {
  params: Promise<{
    lang: "en" | "fr";
  }>;
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
          <BookingIframe />
        </section>
        <Footer dict={dict} lang={lang} />
      </main>
    </>
  );
} 