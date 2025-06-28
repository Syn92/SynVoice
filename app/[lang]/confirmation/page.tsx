import { getDictionary } from "../dictionaries";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
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
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 dark:from-gray-950 dark:to-slate-900 flex items-center justify-center p-4">
          <Card className="w-full max-w-md text-center">
            <CardHeader className="pb-4">
              <div className="mx-auto mb-4">
                <CheckCircle className="w-16 h-16 text-green-500 mx-auto" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                {dict.confirmation.heading}
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                {dict.confirmation.subheading}
              </p>
            </CardHeader>
            
            <CardContent className="space-y-6">
              <p className="text-gray-700 dark:text-gray-300">
                {dict.confirmation.description}
              </p>
              
              <div className="flex flex-col sm:flex-row gap-3">
                <Button asChild className="flex-1">
                  <Link href={`/${lang}`}>
                    {dict.confirmation.backHome}
                  </Link>
                </Button>
                
                <Button asChild variant="outline" className="flex-1">
                  <Link href={`/${lang}/booking`}>
                    {dict.confirmation.bookDemo}
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
        <Footer dict={dict} lang={lang} />
      </main>
    </>
  );
} 