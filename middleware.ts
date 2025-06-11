import { NextRequest, NextResponse } from "next/server";

const locales = ["en", "fr"];

function getLocale(request: NextRequest): string {
  const acceptLang = request.headers.get("accept-language") || "";
  const preferred = acceptLang.split(",")[0]?.split("-")[0];
  if (preferred && locales.includes(preferred)) {
    return preferred;
  }
  return "en"; // default
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip next internal paths
  if (pathname.startsWith("/_next") || pathname.startsWith("/api")) {
    return;
  }

  // Check if locale is already present in pathname
  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  if (pathnameHasLocale) {
    return;
  }

  const locale = getLocale(request);
  request.nextUrl.pathname = `/${locale}${pathname}`;
  return NextResponse.redirect(request.nextUrl);
}

export const config = {
  matcher: [
    // Skip all internal paths (_next)
    "/((?!_next).*)",
  ],
}; 