import { Button } from "@/components/ui/button";
import { Logo } from "./logo";
import { NavMenu } from "./nav-menu";
import { NavigationSheet } from "./navigation-sheet";
import ThemeToggle from "../theme-toggle";
import LanguageSwitcher from "./language-switcher";

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
}

const Navbar = ({ lang, dict }: NavbarProps) => {
  const { bookDemo } = dict.navbar ?? {};

  return (
    <nav className="fixed z-10 top-6 inset-x-4 h-14 xs:h-16 bg-background/50 backdrop-blur-xs border dark:border-slate-700/70 max-w-(--breakpoint-xl) mx-auto rounded-full">
      <div className="h-full flex items-center justify-between mx-auto px-4">
        <Logo />

        {/* Desktop Menu */}
        <NavMenu dict={dict} className="hidden md:block" />

        <div className="flex items-center gap-3">
          <ThemeToggle />
          <LanguageSwitcher current={lang} />
          <Button className="hidden xs:inline-flex">{bookDemo}</Button>

          {/* Mobile Menu */}
          <div className="md:hidden">
            <NavigationSheet dict={dict} />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
