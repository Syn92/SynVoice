"use client";

import { memo, useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useTheme } from "next-themes";

interface LogoProps {
  lang?: "en" | "fr";
  forceTheme?: "light" | "dark";
}

const LogoComponent = ({ lang = "en", forceTheme }: LogoProps) => {
  const { theme: currentTheme } = useTheme();
  const [logoSrc, setLogoSrc] = useState("/logo_full_black.svg"); // Default logo

  useEffect(() => {
    const theme = forceTheme || currentTheme;
    setLogoSrc(
      theme === "dark" ? "/logo_full_white.svg" : "/logo_full_black.svg",
    );
  }, [currentTheme, forceTheme]);

  return (
    <Link
      href={`/${lang}`}
      className="flex items-center space-x-2"
      aria-label="Go to home page"
    >
      <Image src={logoSrc} alt="SynVoice Logo" width={114} height={28} />
    </Link>
  );
};

LogoComponent.displayName = "Logo";

export const Logo = memo(LogoComponent);
