"use client";
import { Plus, Minus, MessageCircle } from "lucide-react";
import { Accordion, AccordionItem, AccordionContent } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import * as AccordionPrimitive from "@radix-ui/react-accordion";
import { cn } from "@/lib/utils";
import React, { useState } from "react";
import ScrollReveal from "./scroll-reveal";

interface FAQProps {
  dict: {
    faq: {
      heading: string;
      subheading: string;
      items: {
        question: string;
        answer: string;
      }[];
    };
  };
}

const FAQ = ({ dict }: FAQProps) => {
  const [openItem, setOpenItem] = useState<string>("");
  const {
    faq: { heading, subheading, items },
  } = dict;

  return (
    <section id="faq" className="w-full py-16 sm:py-24 px-6 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-secondary/5 via-transparent to-primary/5" />
      <div className="absolute top-1/3 right-1/4 w-72 h-72 bg-primary/10 rounded-full blur-3xl" />
      <div className="absolute bottom-1/3 left-1/4 w-96 h-96 bg-secondary/10 rounded-full blur-3xl" />
      
      <div className="relative z-10 max-w-6xl mx-auto">
        {/* Header */}
        <ScrollReveal>
          <div className="text-center mb-12">
            <Badge variant="outline" className="mb-4 px-4 py-2 font-bold font-montserrat">
              <MessageCircle className="w-4 h-4 mr-2" />
              Frequently Asked Questions
            </Badge>
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold font-montserrat tracking-tight mb-6 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
              {heading}
            </h2>
            <p className="text-lg font-semibold font-open-sans text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              {subheading}
            </p>
          </div>
        </ScrollReveal>

        {/* FAQ Grid */}
        <ScrollReveal delay={0.2}>
          <div className="grid gap-4 lg:gap-6">
            <Accordion 
              type="single"
              collapsible
              value={openItem}
              onValueChange={setOpenItem}
              className="space-y-4"
            >
              {items.map((item, index) => (
                <FAQItem 
                  key={`faq-${index}`}
                  item={{ ...item, id: `faq-${index}` }}
                  isOpen={openItem === `faq-${index}`}
                />
              ))}
            </Accordion>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
};

const FAQItem = ({ 
  item, 
  isOpen
}: {
  item: {
    id: string;
    question: string;
    answer: string;
  };
  isOpen: boolean;
}) => {
  return (
    <AccordionItem
      value={item.id}
      className="group relative bg-background/60 backdrop-blur-sm border rounded-2xl overflow-hidden hover:shadow-xl hover:shadow-primary/10 transition-all duration-500 hover:-translate-y-1"
    >
      <AccordionPrimitive.Header className="flex">
        <AccordionPrimitive.Trigger
          className="flex flex-1 items-center justify-between px-6 py-6 font-semibold tracking-tight transition-all hover:bg-muted/50 text-left"
        >
          <div className="flex items-start gap-4 flex-1 pr-8">
            <div className={cn(
              "flex-shrink-0 w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center transition-all duration-300",
              isOpen ? "scale-110 bg-primary/20" : ""
            )}>
              <MessageCircle className="w-5 h-5 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-lg lg:text-xl font-bold font-montserrat leading-relaxed">
                {item.question}
              </h3>
            </div>
          </div>
          <div className={cn(
            "flex-shrink-0 w-8 h-8 rounded-full bg-muted flex items-center justify-center transition-all duration-300",
            isOpen ? "bg-primary text-primary-foreground rotate-180" : "group-hover:bg-primary/10"
          )}>
            {isOpen ? (
              <Minus className="w-4 h-4" />
            ) : (
              <Plus className="w-4 h-4" />
            )}
          </div>
        </AccordionPrimitive.Trigger>
      </AccordionPrimitive.Header>
      
      <AccordionContent className="px-6 pb-6">
        <div className="pl-14 pr-4">
          <div className="text-base lg:text-lg font-semibold font-open-sans text-muted-foreground leading-relaxed whitespace-pre-line">
            {item.answer}
          </div>
        </div>
      </AccordionContent>

      {/* Hover Glow Effect */}
      <div className={cn(
        "absolute inset-0 rounded-2xl bg-gradient-to-r from-primary/5 to-secondary/5 opacity-0 transition-opacity duration-500 pointer-events-none",
        isOpen ? "opacity-100" : "group-hover:opacity-50"
      )} />
    </AccordionItem>
  );
};

export default FAQ;
