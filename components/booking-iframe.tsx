"use client";

import { useEffect, useRef } from "react";

interface BookingIframeProps {
  className?: string;
  lang?: "en" | "fr";
}

const BookingIframe = ({ className = "", lang = "en" }: BookingIframeProps) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    const getCookie = (name: string): string | null => {
      if (typeof document === "undefined") return null;
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      if (parts.length === 2) return parts.pop()?.split(";").shift() || null;
      return null;
    };

    let scheduleTracked = false;

    const trackScheduleEvent = (scheduleData: any = {}) => {
      if (scheduleTracked) return;
      scheduleTracked = true;

      sessionStorage.setItem("fb_schedule_data", JSON.stringify(scheduleData));
      
      fetch("/api/facebook", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          eventName: "Schedule",
          eventTime: Math.floor(Date.now() / 1000),
          eventSourceUrl: typeof window !== "undefined" ? window.location.href : "",
          userAgent: typeof navigator !== "undefined" ? navigator.userAgent : "",
          fbc: getCookie("_fbc") || undefined,
          fbp: getCookie("_fbp") || undefined,
          email: scheduleData.email,
          firstName: scheduleData.firstName,
          lastName: scheduleData.lastName,
          phone: scheduleData.phone,
          zipCode: scheduleData.zipCode,
        }),
      }).catch((error) => {
        console.error("Error tracking Schedule event:", error);
        scheduleTracked = false;
      });
    };

    const handleMessage = (event: MessageEvent) => {
      if (event.origin !== "https://book.synai.pro") return;

      try {
        const data = typeof event.data === "string" ? JSON.parse(event.data) : event.data;
        
        if (data.type === "booking_completed" || data.type === "schedule") {
          const scheduleData = {
            email: data.email,
            firstName: data.firstName || data.first_name,
            lastName: data.lastName || data.last_name,
            phone: data.phone || data.phoneNumber,
            zipCode: data.zipCode || data.zip || data.postalCode,
          };

          trackScheduleEvent(scheduleData);
        }
      } catch (error) {
        console.error("Error handling booking message:", error);
      }
    };

    window.addEventListener("message", handleMessage);

    return () => {
      window.removeEventListener("message", handleMessage);
    };
  }, [lang]);

  const iframeUrls = {
    en: "https://book.synai.pro/portal-embed#/9482000000037020",
    fr: "https://book.synai.pro/portal-embed#/9482000000045252"
  };

  return (
    <div className={`w-full ${className}`}>
      <iframe 
        ref={iframeRef}
        width="100%" 
        height="750px" 
        src={iframeUrls[lang]} 
        frameBorder="0" 
        allowFullScreen
        title="SynAI Pro Booking Portal"
        className="rounded-lg shadow-lg"
      />
    </div>
  );
};

export default BookingIframe; 