import { getDictionary } from "../dictionaries";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";
import Link from "next/link";
import { Navbar } from "@/components/navbar";
import Footer from "@/components/footer";

export default async function ConfirmationPage({
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
        <div className="min-h-[calc(100vh-200px)] bg-white dark:bg-gray-950">
          <div className="max-w-4xl mx-auto px-4 py-16">
            <div className="text-center">
              {/* Success Icon */}
              <div className="mb-8">
                <CheckCircle className="w-20 h-20 text-green-500 mx-auto" />
              </div>
              
              {/* Heading */}
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
                {dict.confirmation.heading}
              </h1>
              
              {/* Subheading */}
              <p className="text-xl text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto">
                {dict.confirmation.subheading}
              </p>
              
              {/* Description */}
              <p className="text-lg text-gray-700 dark:text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed">
                {dict.confirmation.description}
              </p>
              
              {/* Action Button */}
              <div className="flex justify-center">
                <Button 
                  asChild 
                  size="lg" 
                  className="px-8 py-3 text-lg rounded-full"
                >
                  <Link href={`/${lang}`}>
                    {dict.confirmation.backHome}
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
        <Footer dict={dict} lang={lang} />
      </main>
    </>
  );
} 