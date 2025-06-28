import { getDictionary } from "../dictionaries";
import BookingIframe from "@/components/booking-iframe";
import { Navbar } from "@/components/navbar";
import Footer from "@/components/footer";

export default async function BookingPage({
  params,
}: {
  params: Promise<{ lang: "en" | "fr" }>;
}) {
  const { lang } = await params;
  const dict = await getDictionary(lang);

  return (
    <>
      <Navbar dict={dict} lang={lang} isHomePage={false} />
      <main className="pt-16 xs:pt-20 sm:pt-24">
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
          {/* Header Section */}
          <div className="bg-white dark:bg-gray-900 border-b">
            <div className="max-w-4xl mx-auto px-4 py-8">
              <div className="text-center">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                  {dict.booking.heading}
                </h1>
                <p className="text-lg text-gray-600 dark:text-gray-400 mb-4">
                  {dict.booking.subheading}
                </p>
                <p className="text-gray-700 dark:text-gray-300 max-w-2xl mx-auto">
                  {dict.booking.description}
                </p>
              </div>
            </div>
          </div>

          {/* Booking Iframe Section */}
          <div className="max-w-4xl mx-auto px-4 py-8">
            <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg overflow-hidden">
              <BookingIframe lang={lang} className="min-h-[750px]" />
            </div>
          </div>
        </div>
        <Footer dict={dict} lang={lang} />
      </main>
    </>
  );
}

// Metadata pour SEO
export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: "en" | "fr" }>;
}) {
  const { lang } = await params;
  const dict = await getDictionary(lang);

  return {
    title: dict.booking.heading,
    description: dict.booking.description,
  };
} 