import { PlusIcon } from "lucide-react";
import { Accordion, AccordionItem, AccordionContent } from "@/components/ui/accordion";
import * as AccordionPrimitive from "@radix-ui/react-accordion";
import { cn } from "@/lib/utils";
import React from "react";
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
  const {
    faq: { heading, subheading, items },
  } = dict;
  
  return (
    <div id="faq" className="w-full py-12 xs:py-20 px-6">
      <ScrollReveal>
        <h2 className="text-3xl xs:text-4xl sm:text-5xl font-bold tracking-tight text-center">
          {heading}
        </h2>
        <p className="mt-4 text-center text-lg text-foreground/70 max-w-3xl mx-auto">
          {subheading}
        </p>
      </ScrollReveal>
      
      <div className="w-full max-w-7xl mx-auto mt-10 sm:mt-16">
        <ScrollReveal delay={0.2}>
          <Accordion type="single" collapsible className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
            {items.map(({ question, answer }, index) => (
              <AccordionItem
                key={question}
                value={`question-${index}`}
                className="bg-background border border-border rounded-xl overflow-hidden hover:shadow-lg transition-shadow duration-300"
              >
                <AccordionPrimitive.Header className="flex">
                  <AccordionPrimitive.Trigger
                    className={cn(
                      "flex flex-1 items-center justify-between px-6 py-4 font-semibold tracking-tight transition-all hover:underline [&[data-state=open]>svg]:rotate-45",
                      "text-start text-lg lg:text-xl min-h-[60px]"
                    )}
                  >
                    <span className="flex-1 pr-4">{question}</span>
                    <PlusIcon className="h-5 w-5 shrink-0 text-muted-foreground transition-transform duration-200" />
                  </AccordionPrimitive.Trigger>
                </AccordionPrimitive.Header>
                <AccordionContent className="px-6 pb-4 text-sm lg:text-base text-foreground/70 leading-relaxed">
                  {answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </ScrollReveal>
      </div>
    </div>
  );
};

export default FAQ;
