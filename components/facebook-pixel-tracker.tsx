"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";

function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(";").shift() || null;
  return null;
}

function getSessionStorage(key: string): string | null {
  if (typeof window === "undefined") return null;
  try {
    return sessionStorage.getItem(key);
  } catch {
    return null;
  }
}

export default function FacebookPixelTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    const trackPageView = async () => {
      try {
        const eventTime = Math.floor(Date.now() / 1000);
        const eventSourceUrl = typeof window !== "undefined" ? window.location.href : "";
        const userAgent = typeof navigator !== "undefined" ? navigator.userAgent : "";
        const fbc = getCookie("_fbc");
        const fbp = getCookie("_fbp");

        const isConfirmationPage = pathname?.includes("confirmation") || eventSourceUrl.includes("confirmation");

        let eventName = "ViewContent";
        let eventData: Record<string, any> = {
          eventName,
          eventTime,
          eventSourceUrl,
          userAgent,
          fbc: fbc || undefined,
          fbp: fbp || undefined,
        };

        if (isConfirmationPage) {
          eventName = "Contact";

          const email = searchParams?.get("email") || getSessionStorage("fb_contact_email");
          const firstName = searchParams?.get("firstName") || getSessionStorage("fb_contact_firstName");
          const lastName = searchParams?.get("lastName") || getSessionStorage("fb_contact_lastName");
          const phone = searchParams?.get("phone") || getSessionStorage("fb_contact_phone");
          const zipCode = searchParams?.get("zipCode") || getSessionStorage("fb_contact_zipCode");
          const country = searchParams?.get("country") || getSessionStorage("fb_contact_country");

          eventData = {
            ...eventData,
            eventName: "Contact",
            email: email || undefined,
            firstName: firstName || undefined,
            lastName: lastName || undefined,
            phone: phone || undefined,
            zipCode: zipCode || undefined,
            country: country || undefined,
          };
        }

        const response = await fetch("/api/facebook", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(eventData),
        });

        if (!response.ok) {
          console.error("Failed to track Facebook event");
        }
      } catch (error) {
        console.error("Error tracking Facebook event:", error);
      }
    };

    trackPageView();
  }, [pathname, searchParams]);

  return null;
}

