import { PhoneCall, Utensils, CalendarClock, Package } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import React from "react";
import ScrollReveal from "./scroll-reveal";

interface UseCasesProps {
  dict: {
    usecases: {
      heading: string;
      cards: {
        receptionist: { title: string; description: string };
        reservation: { title: string; description: string };
        scheduling: { title: string; description: string };
        tracking: { title: string; description: string };
      };
    };
  };
}

type UseCaseKey = keyof UseCasesProps["dict"]["usecases"]["cards"];

const cardData: { key: UseCaseKey; icon: LucideIcon }[] = [
  { key: "receptionist", icon: PhoneCall },
  { key: "reservation", icon: Utensils },
  { key: "scheduling", icon: CalendarClock },
  { key: "tracking", icon: Package },
];

export default function UseCases({ dict }: UseCasesProps) {
  const { heading, cards } = dict.usecases;
  return (
    <section id="usecases" className="w-full py-12 xs:py-20 px-6">
      <ScrollReveal>
        <h2 className="text-3xl xs:text-4xl sm:text-5xl font-bold tracking-tight text-center">
          {heading}
        </h2>
      </ScrollReveal>
      <div className="w-full max-w-7xl mx-auto mt-10 sm:mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
        {cardData.map(({ key, icon: Icon }, index) => {
          const card = cards[key];
          return (
            <ScrollReveal key={key} delay={index * 0.1}>
              <div className="flex flex-col h-full bg-background border rounded-xl p-6 lg:p-8 hover:shadow-lg transition-shadow duration-300">
                <div className="mb-4 h-12 w-12 flex items-center justify-center bg-muted rounded-xl">
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="text-lg lg:text-xl font-semibold mb-3 leading-tight">
                  {card.title}
                </h3>
                <p className="text-foreground/70 text-sm lg:text-base leading-relaxed flex-grow">
                  {card.description}
                </p>
              </div>
            </ScrollReveal>
          );
        })}
      </div>
    </section>
  );
} 