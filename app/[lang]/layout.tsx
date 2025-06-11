import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "../globals.css";

const geistSans = Geist({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "PureLanding - Beautiful Shadcn UI Landing Page",
  description:
    "A beautiful landing page built with Shadcn UI, Next.js 15, Tailwind CSS, and Shadcn UI Blocks.",
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