import { PhoneCall, Utensils, CalendarClock, Package } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import React from "react";

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
      <h2 className="text-3xl xs:text-4xl sm:text-5xl font-bold tracking-tight text-center">
        {heading}
      </h2>
      <div className="w-full max-w-(--breakpoint-lg) mx-auto mt-10 sm:mt-16 grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {cardData.map(({ key, icon: Icon }) => {
          const card = cards[key];
          return (
            <div
              key={key}
              className="flex flex-col bg-background border rounded-xl py-6 px-5"
            >
              <div className="mb-3 h-10 w-10 flex items-center justify-center bg-muted rounded-full">
                <Icon className="h-6 w-6" />
              </div>
              <span className="text-lg font-semibold">{card.title}</span>
              <p className="mt-1 text-foreground/80 text-[15px]">
                {card.description}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
} 