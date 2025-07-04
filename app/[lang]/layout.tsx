import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "../globals.css";

const geistSans = Geist({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SynAI - AI Voice Agents",
  description:
    "Expert consulting services to implement intelligent voice agents for your business. Transform customer interactions with AI-powered voice solutions.",
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
  authors: [{ name: "SynAI Team" }],
  creator: "SynAI",
  publisher: "SynAI",
  category: "Technology",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: "website",
    title: "SynAI - AI Voice Agents",
    description: "Expert consulting services to implement intelligent voice agents for your business. Transform customer interactions with AI-powered voice solutions.",
    url: "https://synai.pro",
    siteName: "SynAI",
    images: [
      {
        url: "/hero2.png",
        width: 1200,
        height: 675,
        alt: "SynAI AI voice agent dashboard showing call analytics and automation features",
      },
    ],
    locale: "en_US",
    alternateLocale: "fr_FR",
  },
  twitter: {
    card: "summary_large_image",
    title: "SynAI - AI Voice Agents",
    description: "Transform customer interactions with AI-powered voice solutions. Expert consulting services for intelligent voice agents.",
    images: ["/hero2.png"],
    creator: "@synai_pro",
  },
  alternates: {
    canonical: "https://synai.pro",
    languages: {
      "en-US": "https://synai.pro/en",
      "fr-FR": "https://synai.pro/fr",
    },
  },
  verification: {
    google: "your-google-site-verification-code",
  },
};

export async function generateStaticParams() {
  return [{ lang: "en" }, { lang: "fr" }];
}

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ lang: "en" | "fr" }>;
}>) {
  const { lang } = await params;

  return (
    <div lang={lang} className={`${geistSans.className} antialiased`}>
      {children}
    </div>
  );
} 