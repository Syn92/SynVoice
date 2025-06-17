import {
  Blocks,
  Bot,
  ChartPie,
  Film,
  MessageCircle,
  Settings2,
} from "lucide-react";
import React from "react";
import ScrollReveal from "./scroll-reveal";

interface FeaturesProps {
  dict: {
    features: {
      heading: string;
      cards: {
        customizable: {
          title: string;
          description: string;
        };
        interactive: {
          title: string;
          description: string;
        };
        ai: {
          title: string;
          description: string;
        };
        media: {
          title: string;
          description: string;
        };
        analytics: {
          title: string;
          description: string;
        };
        collaboration: {
          title: string;
          description: string;
        };
      };
    };
  };
}

const Features = ({ dict }: FeaturesProps) => {
  const features = [
    {
      icon: Settings2,
      title: dict.features.cards.customizable.title,
      description: dict.features.cards.customizable.description,
    },
    {
      icon: MessageCircle,
      title: dict.features.cards.interactive.title,
      description: dict.features.cards.interactive.description,
    },
    {
      icon: Bot,
      title: dict.features.cards.ai.title,
      description: dict.features.cards.ai.description,
    },
    {
      icon: Film,
      title: dict.features.cards.media.title,
      description: dict.features.cards.media.description,
    },
    {
      icon: ChartPie,
      title: dict.features.cards.analytics.title,
      description: dict.features.cards.analytics.description,
    },
    {
      icon: Blocks,
      title: dict.features.cards.collaboration.title,
      description: dict.features.cards.collaboration.description,
    },
  ];

  return (
    <div id="features" className="w-full py-12 xs:py-20 px-6">
      <ScrollReveal>
        <h2 className="text-3xl xs:text-4xl sm:text-5xl font-bold tracking-tight text-center">
          {dict.features.heading}
        </h2>
      </ScrollReveal>
      <div className="w-full max-w-(--breakpoint-lg) mx-auto mt-10 sm:mt-16 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((feature, index) => (
          <ScrollReveal key={feature.title} delay={index * 0.1}>
            <div className="flex flex-col bg-background border rounded-xl py-6 px-5">
              <div className="mb-3 h-10 w-10 flex items-center justify-center bg-muted rounded-full">
                <feature.icon className="h-6 w-6" />
              </div>
              <span className="text-lg font-semibold">{feature.title}</span>
              <p className="mt-1 text-foreground/80 text-[15px]">
                {feature.description}
              </p>
            </div>
          </ScrollReveal>
        ))}
      </div>
    </div>
  );
};

export default Features;
