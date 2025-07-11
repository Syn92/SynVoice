"use client";

import { Button } from "@/components/ui/button";
import { usePathname } from "next/navigation";
import Link from "next/link";

const locales = ["en", "fr"] as const;

type Locale = (typeof locales)[number];

interface LanguageSwitcherProps {
  current: Locale;
}

export default function LanguageSwitcher({ current }: LanguageSwitcherProps) {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);
  if (segments.length === 0) return null;
  const restPath = segments.slice(1).join("/");

  return (
    <div className="inline-flex items-center border rounded-full overflow-hidden bg-muted">
      {locales.map((code) => {
        const href = `/${code}${restPath ? "/" + restPath : ""}`;
        const active = code === current;
        return (
          <Link key={code} href={href} className="focus-visible:outline-none">
            <Button
              variant={active ? "default" : "ghost"}
              size="sm"
              className="rounded-none px-3 py-1 text-xs font-bold font-montserrat"
            >
              {code.toUpperCase()}
            </Button>
          </Link>
        );
      })}
    </div>
  );
} 