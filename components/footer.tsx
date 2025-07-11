import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import ThemeToggle from "./theme-toggle";
import { Logo } from "./navbar/logo";

interface FooterProps {
  dict: {
    footer: {
      newsletter: {
        title: string;
        placeholder: string;
        button: string;
      };
      links: {
        features: string;
        pricing: string;
        faq: string;
        testimonials: string;
        privacy: string;
      };
      copyright: string;
      madeWith: string;
      email: string;
    };
  };
  lang?: "en" | "fr";
}

const Footer = ({ dict, lang = "en" }: FooterProps) => {
  const footerLinks = [
    {
      title: dict.footer.links.features,
      href: `/${lang}#features`,
    },
    {
      title: dict.footer.links.faq,
      href: `/${lang}#faq`,
    },
    {
      title: dict.footer.links.testimonials,
      href: `/${lang}#testimonials`,
    },
    {
      title: "Contact",
      href: `/${lang}/contact`,
    },
  ];

  return (
    <footer className="dark:border-t mt-40 dark bg-background text-foreground">
      <div className="max-w-(--breakpoint-xl) mx-auto">
        <div className="py-12 flex flex-col sm:flex-row items-start justify-between gap-x-8 gap-y-10 px-6 xl:px-0">
          <div>
            <Logo lang={lang} forceTheme="dark" />

            <ul className="mt-6 flex items-center gap-4 flex-wrap">
              {footerLinks.map(({ title, href }) => (
                <li key={title}>
                  <Link
                    href={href}
                    className="text-muted-foreground hover:text-foreground font-semibold font-open-sans"
                  >
                    {title}
                  </Link>
                </li>
              ))}
            </ul>
            
            {/* Theme Toggle */}
            <div className="mt-4">
              <ThemeToggle />
            </div>
            
            {/* Email Contact */}
            <div className="mt-3">
              <a 
                href={`mailto:${dict.footer.email}`}
                className="text-muted-foreground hover:text-foreground transition-colors text-sm font-semibold font-open-sans"
              >
                {dict.footer.email}
              </a>
            </div>
          </div>


        </div>
        <Separator />
        <div className="py-8 flex flex-col-reverse sm:flex-row items-center justify-between gap-x-2 gap-y-5 px-6 xl:px-0">
          {/* Copyright */}
          <div className="flex flex-col sm:flex-row items-center gap-2 text-muted-foreground text-center sm:text-start font-semibold font-open-sans">
            <span>
              &copy; {new Date().getFullYear()}{" "}
              <Link href={`/${lang}`}>
                SynAI
              </Link>
              . {dict.footer.copyright}
            </span>
            <span className="hidden sm:inline">•</span>
            <span>{dict.footer.madeWith}</span>
          </div>

          <div className="flex items-center gap-5 text-muted-foreground">
            {/* Email moved to left side */}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
