import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { NavigationMenuProps } from "@radix-ui/react-navigation-menu";
import Link from "next/link";

interface NavMenuProps extends NavigationMenuProps {
  dict: {
    navbar: {
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
}

export const NavMenu = ({ dict, lang, isHomePage = false, ...props }: NavMenuProps) => {
  const getNavLink = (anchor: string) => {
    return isHomePage ? `#${anchor}` : `/${lang}#${anchor}`;
  };

  return (
    <NavigationMenu {...props}>
      <NavigationMenuList className="gap-6 space-x-0 data-[orientation=vertical]:flex-col data-[orientation=vertical]:items-start">
        <NavigationMenuItem>
          <NavigationMenuLink asChild>
            <Link href={getNavLink('features')}>{dict.navbar.navigation.features}</Link>
          </NavigationMenuLink>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink asChild>
            <Link href={getNavLink('usecases')}>{dict.navbar.navigation.useCases}</Link>
          </NavigationMenuLink>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink asChild>
            <Link href={getNavLink('faq')}>{dict.navbar.navigation.faq}</Link>
          </NavigationMenuLink>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink asChild>
            <Link href={getNavLink('testimonials')}>{dict.navbar.navigation.testimonials}</Link>
          </NavigationMenuLink>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
};
