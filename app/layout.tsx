import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "next-themes";
import { Geist } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { Analytics } from "@vercel/analytics/next"
import FloatingAIIntegration from "@/components/floating-ai-integration";

const geistSans = Geist({
  subsets: ["latin"],
});

const structuredData = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "SynAI",
  "legalName": "SynAI - AI Voice Agent Solutions",
  "url": "https://synai.pro",
  "logo": "https://synai.pro/android-chrome-512x512.png",
  "description": "Expert consulting services to implement intelligent voice agents for your business. Transform customer interactions with AI-powered voice solutions.",
  "email": "theo@synai.pro",
  "address": {
    "@type": "PostalAddress",
    "addressCountry": "CA",
    "addressLocality": "Montreal",
    "addressRegion": "QC"
  },
  "sameAs": [
    "https://linkedin.com/company/synai",
    "https://twitter.com/synai_pro"
  ],
  "service": {
    "@type": "Service",
    "name": "AI Voice Agent Implementation",
    "description": "Professional AI voice agent consulting and implementation services for businesses",
    "provider": {
      "@type": "Organization",
      "name": "SynAI"
    },
    "areaServed": {
      "@type": "Place",
      "name": "Global"
    },
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "AI Voice Agent Services",
      "itemListElement": [
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Voice Agent Implementation",
            "description": "Custom AI voice agent setup and integration"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Voice Agent Consulting",
            "description": "Expert consulting for voice automation strategies"
          }
        }
      ]
    }
  },
  "contactPoint": {
    "@type": "ContactPoint",
    "telephone": "+1-XXX-XXX-XXXX",
    "contactType": "customer service",
    "email": "theo@synai.pro",
    "availableLanguage": ["English", "French"]
  }
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html suppressHydrationWarning>
      <head>
        {/* Google Tag Manager */}
        <Script
          id="gtm-script"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
            (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','GTM-5H62LC87');
            `,
          }}
        />
        {/* Structured Data */}
        <Script
          id="structured-data"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData),
          }}
        />
      </head>
      <body className={`${geistSans.className} antialiased`}>
        {/* Google Tag Manager (noscript) */}
        <noscript>
          <iframe 
            src="https://www.googletagmanager.com/ns.html?id=GTM-5H62LC87"
            height="0" 
            width="0" 
            style={{display:"none",visibility:"hidden"}}
          />
        </noscript>
        
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          <TooltipProvider>{children}</TooltipProvider>
        </ThemeProvider>
        <Analytics />
        {/* SynAI AI Floating Widget - Available on all pages */}
        <FloatingAIIntegration />
      </body>
    </html>
  );
} 