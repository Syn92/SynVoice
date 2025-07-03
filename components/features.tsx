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
      <div className="w-full max-w-7xl mx-auto mt-10 sm:mt-16 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 lg:gap-8">
        {features.map((feature, index) => (
          <ScrollReveal key={feature.title} delay={index * 0.1}>
            <div className="flex flex-col h-full bg-background border rounded-xl p-6 lg:p-8 hover:shadow-lg transition-shadow duration-300">
              <div className="mb-4 h-12 w-12 flex items-center justify-center bg-muted rounded-xl">
                <feature.icon className="h-6 w-6" />
              </div>
              <h3 className="text-lg lg:text-xl font-semibold mb-3 leading-tight">
                {feature.title}
              </h3>
              <p className="text-foreground/70 text-sm lg:text-base leading-relaxed flex-grow">
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
