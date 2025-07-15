"use client";
import { Button } from "@/components/ui/button";
import { Logo } from "./logo";
import { NavMenu } from "./nav-menu";
import { NavigationSheet } from "./navigation-sheet";
import LanguageSwitcher from "./language-switcher";
import Link from "next/link";
import { useState } from "react";

interface NavbarProps {
  lang: "en" | "fr";
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
  isHomePage?: boolean;
}

const Navbar = ({ lang, dict, isHomePage = false }: NavbarProps) => {
  const { bookDemo } = dict.navbar ?? {};
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className={`fixed z-100 top-6 inset-x-4 h-14 xs:h-16 bg-background/50 backdrop-blur-xs border dark:border-slate-700/70 max-w-(--breakpoint-xl) mx-auto rounded-full transition-opacity duration-200 ${isMenuOpen ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
      <div className="h-full flex items-center justify-between mx-auto px-4">
        <Logo lang={lang} className="ml-1" />

        {/* Desktop Menu */}
        <NavMenu dict={dict} lang={lang} isHomePage={isHomePage} className="hidden lg:block" />

        <div className="flex items-center gap-3">
          {/* Desktop elements */}
          <div className="hidden lg:flex items-center gap-3">
            <LanguageSwitcher current={lang} />
            <Button asChild>
              <Link href={`/${lang}/contact`} className="font-bold font-montserrat">{bookDemo}</Link>
            </Button>
          </div>

          {/* Mobile Menu */}
          <div className="lg:hidden">
            <NavigationSheet 
              dict={dict} 
              lang={lang} 
              isHomePage={isHomePage} 
              onOpenChange={setIsMenuOpen}
            />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
