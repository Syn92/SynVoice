import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "../globals.css";

const geistSans = Geist({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SynVoice - Voice Agent Implementation Consulting",
  description:
    "Expert consulting services to implement intelligent voice agents for your business. Transform customer interactions with AI-powered voice solutions.",
  openGraph: {
    type: "website",
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