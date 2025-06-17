import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import { Logo } from "./logo";
import { NavMenu } from "./nav-menu";

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
}

export const NavigationSheet = ({ dict }: NavigationSheetProps) => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="rounded-full">
          <Menu />
        </Button>
      </SheetTrigger>
      <SheetContent>
        <Logo />
        <NavMenu dict={dict} orientation="vertical" className="mt-12" />

        <div className="mt-8">
          <Button className="w-full">{dict.navbar.bookDemo}</Button>
        </div>
      </SheetContent>
    </Sheet>
  );
};
