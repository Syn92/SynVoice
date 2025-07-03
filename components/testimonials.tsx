"use client";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Carousel, CarouselApi, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Star, ChevronDown, ChevronUp, ChevronLeft, ChevronRight } from "lucide-react";
import React, { useEffect, useState } from "react";

interface TestimonialsProps {
  dict: {
    testimonials: {
      heading: string;
      items: Array<{
        name: string;
        designation: string;
        company: string;
        testimonial: string;
      }>;
    };
  };
}

// Extract key stats from testimonials
const extractStats = (testimonial: string) => {
  const stats = [];
  
  // Look for percentages
  const percentageMatches = testimonial.match(/\d+\s*%/g);
  if (percentageMatches) {
    stats.push(...percentageMatches.slice(0, 2)); // Take first 2 percentages
  }
  
  // Look for dollar amounts
  const dollarMatches = testimonial.match(/\$\d+[KM]?/g);
  if (dollarMatches) {
    stats.push(...dollarMatches.slice(0, 1)); // Take first dollar amount
  }
  
  // Look for time periods
  const timeMatches = testimonial.match(/\d+\s*(days?|weeks?|months?)/gi);
  if (timeMatches) {
    stats.push(...timeMatches.slice(0, 1)); // Take first time period
  }
  
  return stats;
};

const createCondensedVersion = (testimonial: string, stats: string[]) => {
  const sentences = testimonial.split(/[.!?]+/).filter(sentence => sentence.trim().length > 0);
  
  // Find the sentence with the most impactful stat or take the first meaningful sentence
  let keysentence = sentences.find(sentence => 
    stats.some(stat => sentence.includes(stat))
  ) || sentences[0];
  
  // Clean up the sentence
  keysentence = keysentence.trim();
  if (!keysentence.endsWith('.') && !keysentence.endsWith('!') && !keysentence.endsWith('?')) {
    keysentence += '.';
  }
  
  return keysentence;
};

const highlightStats = (text: string, stats: string[]) => {
  let highlightedText = text;
  stats.forEach(stat => {
    const regex = new RegExp(`(${stat.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    highlightedText = highlightedText.replace(regex, '<strong class="text-primary font-bold">$1</strong>');
  });
  return highlightedText;
};

const Testimonials = ({ dict }: TestimonialsProps) => {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!api) {
      return;
    }

    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap() + 1);

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap() + 1);
    });
  }, [api]);

  const goToPrevious = () => {
    api?.scrollTo(current - 2); // current is 1-indexed, scrollTo is 0-indexed
  };

  const goToNext = () => {
    api?.scrollTo(current); // current is 1-indexed, scrollTo is 0-indexed
  };

  return (
    <div
      id="testimonials"
      className="w-full py-12 xs:py-20 px-6"
    >
      <h2 className="text-3xl xs:text-4xl sm:text-5xl font-bold tracking-tight text-center mb-10 sm:mb-16">
        {dict.testimonials.heading}
      </h2>
      <div className="w-full max-w-7xl mx-auto">
        <Carousel setApi={setApi}>
          <CarouselContent>
            {dict.testimonials.items.map((testimonial, index) => (
              <CarouselItem key={index}>
                <TestimonialCard testimonial={testimonial} />
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
        <div className="flex items-center justify-center gap-4 mt-8">
          {/* Left Arrow */}
          <Button
            variant="outline"
            size="icon"
            onClick={goToPrevious}
            disabled={current === 1}
            className="h-10 w-10 rounded-full border-border hover:bg-muted"
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          
          {/* Dots Indicator */}
          <div className="flex items-center gap-2">
            {Array.from({ length: count }).map((_, index) => (
              <button
                key={index}
                onClick={() => api?.scrollTo(index)}
                className={cn("h-3 w-3 rounded-full border-2 transition-colors", {
                  "bg-primary border-primary": current === index + 1,
                  "bg-transparent border-border": current !== index + 1,
                })}
              />
            ))}
          </div>
          
          {/* Right Arrow */}
          <Button
            variant="outline"
            size="icon"
            onClick={goToNext}
            disabled={current === count}
            className="h-10 w-10 rounded-full border-border hover:bg-muted"
          >
            <ChevronRight className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
};

const TestimonialCard = ({
  testimonial,
}: {
  testimonial: {
    name: string;
    designation: string;
    company: string;
    testimonial: string;
  };
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const stats = extractStats(testimonial.testimonial);
  const condensedVersion = createCondensedVersion(testimonial.testimonial, stats);
  const shouldShowReadMore = testimonial.testimonial.length > 200;

  return (
    <div className="bg-background border border-border rounded-xl p-6 lg:p-8 hover:shadow-lg transition-shadow duration-300 max-w-4xl mx-auto">
      {/* Header with Stars */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-1">
          {[...Array(5)].map((_, i) => (
            <Star key={i} className="w-5 h-5 fill-primary text-primary" />
          ))}
        </div>
        <div className="text-sm text-muted-foreground">
          {testimonial.company}
        </div>
      </div>

      {/* Testimonial Content */}
      <div className="mb-6">
        {!isExpanded && shouldShowReadMore ? (
          <div>
            <p 
              className="text-lg lg:text-xl leading-relaxed text-foreground/90 mb-4"
              dangerouslySetInnerHTML={{ 
                __html: `"${highlightStats(condensedVersion, stats)}"` 
              }}
            />
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => setIsExpanded(true)}
              className="text-primary hover:text-primary/80 p-0 h-auto font-medium"
            >
              Read more <ChevronDown className="w-4 h-4 ml-1" />
            </Button>
          </div>
        ) : (
          <div>
            <p 
              className="text-base lg:text-lg leading-relaxed text-foreground/90 mb-4 whitespace-pre-line"
              dangerouslySetInnerHTML={{ 
                __html: `"${highlightStats(testimonial.testimonial, stats)}"` 
              }}
            />
            {shouldShowReadMore && (
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => setIsExpanded(false)}
                className="text-primary hover:text-primary/80 p-0 h-auto font-medium"
              >
                Read less <ChevronUp className="w-4 h-4 ml-1" />
              </Button>
            )}
          </div>
        )}
      </div>

      {/* Author Info */}
      <div className="flex items-center gap-4 pt-4 border-t border-border">
        <Avatar className="h-12 w-12">
          <AvatarFallback className="text-lg font-medium bg-primary text-primary-foreground">
            {testimonial.name.charAt(0)}
          </AvatarFallback>
        </Avatar>
        <div>
          <p className="font-semibold text-lg">{testimonial.name}</p>
          <p className="text-sm text-muted-foreground">{testimonial.designation}</p>
        </div>
      </div>
    </div>
  );
};

export default Testimonials;
