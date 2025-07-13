import { PhoneCall, Utensils, MessageSquare, Clock } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import React from "react";
import ScrollReveal from "./scroll-reveal";
import Image from "next/image";

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
  { key: "scheduling", icon: MessageSquare },
  { key: "tracking", icon: Clock },
];

export default function UseCases({ dict }: UseCasesProps) {
  const { heading, cards } = dict.usecases;
  
  return (
    <section id="usecases" className="w-full py-12 xs:py-16 px-6">
      <div className="w-full max-w-6xl mx-auto">
        <ScrollReveal>
          <h2 className="text-3xl xs:text-4xl sm:text-5xl font-extrabold font-montserrat tracking-tight text-center mb-12">
            {heading}
          </h2>
        </ScrollReveal>
        
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Image Section */}
          <ScrollReveal className="lg:order-1">
            <div className="relative">
              <Image
                src="/receptionist.png"
                alt="AI Receptionist"
                width={500}
                height={400}
                className="w-full h-auto rounded-2xl shadow-lg"
                priority
              />
            </div>
          </ScrollReveal>

          {/* Use Cases List */}
          <div className="lg:order-2 space-y-6">
            {cardData.map(({ key, icon: Icon }, index) => {
              const card = cards[key];
              return (
                <ScrollReveal key={key} delay={index * 0.1}>
                  <div className="group flex items-start gap-4 p-4 rounded-xl hover:bg-[#f7f3ec]/80 hover:scale-[1.02] transition-all duration-300">
                    <div className="shrink-0 w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 group-hover:scale-110 transition-all duration-300">
                      <Icon className="w-6 h-6 text-primary" />
                    </div>
                    <div className="flex-1 space-y-2">
                      <h3 className="text-lg lg:text-xl font-bold font-montserrat leading-tight">
                        {card.title}
                      </h3>
                      <p className="text-foreground/70 text-sm lg:text-base font-semibold font-open-sans leading-relaxed">
                        {card.description}
                      </p>
                    </div>
                  </div>
                </ScrollReveal>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
} 