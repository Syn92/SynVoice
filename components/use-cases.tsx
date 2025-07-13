"use client";
import { PhoneCall, Utensils, MessageSquare, Clock } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import React, { useState } from "react";
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

const cardData: { key: UseCaseKey; icon: LucideIcon; svg: string }[] = [
  { key: "receptionist", icon: PhoneCall, svg: "/receptionist.svg" },
  { key: "reservation", icon: Utensils, svg: "/restaurant.svg" },
  { key: "scheduling", icon: MessageSquare, svg: "/smart.svg" },
  { key: "tracking", icon: Clock, svg: "/redirect.svg" },
];

export default function UseCases({ dict }: UseCasesProps) {
  const { heading, cards } = dict.usecases;
  const [selectedUseCase, setSelectedUseCase] = useState<UseCaseKey>("receptionist");
  
  const currentSvg = cardData.find(card => card.key === selectedUseCase)?.svg || "/receptionist.svg";
  
  return (
    <section id="usecases" className="w-full py-12 xs:py-16 px-6">
      <div className="w-full max-w-6xl mx-auto">
        <ScrollReveal>
          <h2 className="text-3xl xs:text-4xl sm:text-5xl font-extrabold font-montserrat tracking-tight text-center mb-12">
            {heading}
          </h2>
        </ScrollReveal>
        
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Interactive SVG Section */}
          <ScrollReveal className="lg:order-1">
            <div className="relative overflow-hidden">
              <div 
                key={selectedUseCase}
                className="animate-in slide-in-from-right-4 fade-in duration-500"
              >
                <Image
                  src={currentSvg}
                  alt={`${selectedUseCase} illustration`}
                  width={500}
                  height={400}
                  className="w-full h-auto rounded-2xl shadow-lg"
                  priority
                />
              </div>
            </div>
          </ScrollReveal>

          {/* Interactive Use Cases List */}
          <div className="lg:order-2 space-y-6">
            {cardData.map(({ key, icon: Icon }, index) => {
              const card = cards[key];
              const isSelected = selectedUseCase === key;
              
              return (
                <ScrollReveal key={key} delay={index * 0.1}>
                  <div 
                    className={`group flex items-start gap-4 p-4 rounded-xl transition-all duration-300 ${
                      isSelected 
                        ? 'bg-[#f7f3ec]/80 scale-[1.02]' 
                        : 'hover:bg-[#f7f3ec]/80 hover:scale-[1.02]'
                    }`}
                    onMouseEnter={() => setSelectedUseCase(key)}
                  >
                    <div className={`shrink-0 w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center transition-all duration-300 ${
                      isSelected 
                        ? 'bg-primary/20 scale-110' 
                        : 'group-hover:bg-primary/20 group-hover:scale-110'
                    }`}>
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