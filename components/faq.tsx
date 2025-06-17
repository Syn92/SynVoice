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
    <div id="faq" className="w-full max-w-screen-xl mx-auto py-8 xs:py-16 px-6">
      <ScrollReveal>
        <h2 className="md:text-center text-3xl xs:text-4xl md:text-5xl !leading-[1.15] font-bold tracking-tighter">
          {heading}
        </h2>
        <p className="mt-1.5 md:text-center xs:text-lg text-muted-foreground">
          {subheading}
        </p>
      </ScrollReveal>
      <div className="min-h-[550px] md:min-h-[320px] xl:min-h-[300px]">
        <ScrollReveal delay={0.2}>
          <Accordion
            type="single"
            collapsible
            className="mt-8 space-y-4 md:columns-2 gap-4"
          >
            {items.map(({ question, answer }, index) => (
              <AccordionItem
                key={question}
                value={`question-${index}`}
                className="bg-accent py-1 px-4 rounded-xl border-none !mt-0 !mb-4 break-inside-avoid"
              >
                <AccordionPrimitive.Header className="flex">
                  <AccordionPrimitive.Trigger
                    className={cn(
                      "flex flex-1 items-center justify-between py-4 font-semibold tracking-tight transition-all hover:underline [&[data-state=open]>svg]:rotate-45",
                      "text-start text-lg"
                    )}
                  >
                    {question}
                    <PlusIcon className="h-5 w-5 shrink-0 text-muted-foreground transition-transform duration-200" />
                  </AccordionPrimitive.Trigger>
                </AccordionPrimitive.Header>
                <AccordionContent className="text-[15px]">
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
