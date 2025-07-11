import { ArrowUpRight } from "lucide-react";
import { Button } from "./ui/button";
import { AnimatedGridPattern } from "./ui/animated-grid-pattern";
import { cn } from "@/lib/utils";
import Link from "next/link";

interface CTABannerProps {
  dict: {
    ctaBanner: {
      heading: string;
      description: string;
      primaryButton: string;
    };
  };
  lang?: "en" | "fr";
}

export default function CTABanner({ dict, lang = "en" }: CTABannerProps) {
  return (
    <div className="px-6">
      <div className="relative overflow-hidden my-20 w-full max-w-(--breakpoint-lg) mx-auto rounded-2xl py-10 md:py-16 px-6 md:px-14" style={{ backgroundColor: '#272a33' }}>
        <AnimatedGridPattern
          numSquares={30}
          maxOpacity={0.1}
          duration={3}
          strokeColor="#f7f3ec"
          fillColor="#272a33"
          className={cn(
            "[mask-image:radial-gradient(400px_circle_at_right,white,rgba(255,255,255,0.6),transparent)]",
            "inset-x-0 inset-y-[-30%] h-[200%] skew-y-12"
          )}
        />
        <AnimatedGridPattern
          numSquares={30}
          maxOpacity={0.1}
          duration={3}
          strokeColor="#f7f3ec"
          fillColor="#272a33"
          className={cn(
            "[mask-image:radial-gradient(400px_circle_at_top_left,white,rgba(255,255,255,0.6),transparent)]",
            "inset-x-0 inset-y-0 h-[200%] skew-y-12"
          )}
        />
        <div className="relative z-0 flex flex-col gap-3">
          <h3 className="text-3xl md:text-4xl font-extrabold font-montserrat" style={{ color: '#f7f3ec' }}>
            {dict.ctaBanner.heading}
          </h3>
          <p className="mt-2 text-base md:text-lg font-semibold font-open-sans" style={{ color: '#f7f3ec' }}>
            {dict.ctaBanner.description}
          </p>
        </div>
        <div className="relative z-0 mt-14 flex justify-start">
          <Button asChild size="lg" style={{ backgroundColor: '#086b69', color: 'white' }} className="hover:opacity-90">
            <Link href={`/${lang}/contact`}>
              {dict.ctaBanner.primaryButton} <ArrowUpRight className="h-5! w-5!" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
