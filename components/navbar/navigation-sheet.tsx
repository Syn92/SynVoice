"use client";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { Menu } from "lucide-react";
import { Logo } from "./logo";
import { NavMenu } from "./nav-menu";
import LanguageSwitcher from "./language-switcher";
import ThemeToggle from "../theme-toggle";
import Link from "next/link";
import { useState } from "react";

interface NavigationSheetProps {
  dict: {
    navbar: {
      bookDemo: string;
      navigation: {
        features: string;
        useCases: string;
        faq: string;
        testimonials: string;
      };
    };
  };
  lang: 'en' | 'fr';
  isHomePage?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export const NavigationSheet = ({ dict, lang, isHomePage = false, onOpenChange }: NavigationSheetProps) => {
  const [open, setOpen] = useState(false);

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    onOpenChange?.(newOpen);
  };

  return (
    <Sheet open={open} onOpenChange={handleOpenChange}>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="rounded-full">
          <Menu />
        </Button>
      </SheetTrigger>
      <SheetContent className="w-[300px] sm:w-[400px]">
        <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
        <div className="flex flex-col h-full">
          <Logo />
          
          <NavMenu 
            dict={dict} 
            lang={lang} 
            isHomePage={isHomePage} 
            orientation="vertical" 
            className="mt-12" 
            onLinkClick={() => handleOpenChange(false)}
          />

          <Separator className="my-6" />
          
          <div className="space-y-4">
            <Button asChild className="w-full font-bold font-montserrat" onClick={() => handleOpenChange(false)}>
              <Link href={`/${lang}/contact`}>{dict.navbar.bookDemo}</Link>
            </Button>
            
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold font-montserrat">Language</span>
              <LanguageSwitcher current={lang} />
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold font-montserrat">Theme</span>
              <ThemeToggle />
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};
