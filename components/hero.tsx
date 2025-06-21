import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowUpRight, CirclePlay } from "lucide-react";
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
}

const Hero = ({ dict }: HeroProps) => {
  const { badge, headline, description, bookDemo, watchDemo } =
    dict.hero ?? {};

  return (
    <div className="min-h-[calc(100vh-6rem)] flex flex-col items-center py-10 px-6">
      <div className="md:mt-6 flex items-center justify-center">
        <div className="text-center max-w-2xl">
          <ScrollReveal delay={0.1}>
            <Badge className="bg-primary rounded-full py-1 border-none">
              {badge}
            </Badge>
          </ScrollReveal>
          <ScrollReveal delay={0.2}>
            <h1 className="mt-6 max-w-[20ch] text-3xl xs:text-4xl sm:text-5xl md:text-6xl font-bold leading-[1.2]! tracking-tight">
              {headline}
            </h1>
          </ScrollReveal>
          <ScrollReveal delay={0.3}>
            <p className="mt-6 max-w-[60ch] xs:text-lg">
              {description}
            </p>
          </ScrollReveal>
          <ScrollReveal delay={0.4}>
            <div className="mt-12 flex flex-col sm:flex-row items-center sm:justify-center gap-4">
              <Button
                size="lg"
                className="w-full sm:w-auto rounded-full text-base"
              >
                {bookDemo} <ArrowUpRight className="h-5! w-5!" />
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="w-full sm:w-auto rounded-full text-base shadow-none"
              >
                <CirclePlay className="h-5! w-5!" /> {watchDemo}
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
              alt="Dashboard Preview" 
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
