"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowUpRight } from "lucide-react";
import React from "react";
import ScrollReveal from "./scroll-reveal";
import Image from "next/image";

interface HeroProps {
  dict: {
    hero: {
      badge: string;
      headline: string;
      description: string;
      bookDemo: string;
      watchDemo: string;
    };
  };
  lang: "en" | "fr";
}

const Hero = ({ dict }: HeroProps) => {
  const { badge, headline, description, bookDemo } =
    dict.hero ?? {};

  const handleBookDemo = () => {
    const bookingSection = document.getElementById('booking-section');
    if (bookingSection) {
      bookingSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-[calc(100vh-6rem)] flex flex-col items-center py-10 px-6">
      <div className="md:mt-6 flex items-center justify-center">
        <div className="text-center max-w-2xl">
          <ScrollReveal delay={0.1}>
            <Badge className="rounded-full py-1.5 border-none font-bold font-montserrat" style={{ backgroundColor: '#272a33', color: '#f7f3ec' }}>
              {badge}
            </Badge>
          </ScrollReveal>
          <ScrollReveal delay={0.2}>
            <h1 className="mt-6 max-w-[20ch] text-3xl xs:text-4xl sm:text-5xl md:text-6xl font-extrabold font-montserrat leading-[1.2]! tracking-tight">
              {headline}
            </h1>
          </ScrollReveal>
          <ScrollReveal delay={0.3}>
            <p className="mt-6 max-w-[60ch] xs:text-lg font-semibold font-open-sans">
              {description}
            </p>
          </ScrollReveal>
          <ScrollReveal delay={0.4}>
            <div className="mt-12 flex justify-center">
              <Button
                size="lg"
                className="w-full sm:w-auto rounded-full text-base font-semibold font-montserrat"
                onClick={handleBookDemo}
              >
                {bookDemo} <ArrowUpRight className="h-5! w-5!" />
              </Button>
            </div>
          </ScrollReveal>
        </div>
      </div>
      <ScrollReveal delay={0.6}>
        <div className="mt-24 max-w-5xl mx-auto px-4">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-primary/10 rounded-2xl blur-3xl transform scale-105"></div>
            <Image 
              src="/hero2.png" 
              alt="SynAI AI voice agent dashboard showing call analytics, customer interactions, and intelligent voice automation features" 
              width={1200}
              height={675}
              priority
              className="relative w-full h-auto rounded-2xl shadow-[0_25px_80px_-15px_rgba(0,0,0,0.4)] border border-border/50 backdrop-blur-sm"
            />
          </div>
        </div>
      </ScrollReveal>
    </div>
  );
};

export default Hero;
