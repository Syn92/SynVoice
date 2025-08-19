"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useEffect, useRef, useState, useLayoutEffect } from "react";
import {
  CheckCircle2,
  Clock,
  PhoneCall,
  Timer,
  TrendingUp,
} from "lucide-react";

type Language = "en" | "fr";

interface Metrics {
  totalCalls: number;
  successRate: number; // 0-1
  avgDurationSec: number;
  peakHourLabel: string; // e.g. "14:00–15:00"
  weekOverWeekDeltaPct: number; // -1..1
  hourlyCalls: number[]; // length 12-24
}

interface BentoDashboardProps {
  lang?: Language;
  metrics?: Partial<Metrics>;
}

const I18N: Record<Language, Record<string, string>> = {
  en: {
    kpi: "Example metrics — Gain insights with our custom dashboard",
    totalCalls: "Total calls",
    successRate: "Success rate",
    avgDuration: "Avg duration",
    peakHour: "Peak hour",
    summary: "Restaurant demo",
    today: "Today",
    minutes: "m",
    seconds: "s",
    highlights: "Highlights (demo)",
    growth: "vs last week",
  },
  fr: {
    kpi: "Exemple de métriques — Gagnez en visibilité grâce à notre tableau de bord",
    totalCalls: "Appels totaux",
    successRate: "Taux de réussite",
    avgDuration: "Durée moyenne",
    peakHour: "Heure de pointe",
    summary: "Démo restaurant",
    today: "Aujourd'hui",
    minutes: "m",
    seconds: "s",
    highlights: "Points clés (démo)",
    growth: "vs semaine dernière",
  },
};

function formatDuration(totalSeconds: number, lang: Language): string {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = Math.max(0, Math.floor(totalSeconds % 60));
  return `${minutes}${I18N[lang].minutes} ${seconds}${I18N[lang].seconds}`;
}

function useAnimatedNumber(target: number, start: boolean, durationMs = 900) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (!start) return;
    let raf = 0;
    const startTs = performance.now();
    const tick = (now: number) => {
      const elapsed = now - startTs;
      const progress = Math.min(1, elapsed / durationMs);
      setValue(target * progress);
      if (progress < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, durationMs, start]);
  return start ? value : 0;
}

export default function BentoDashboard({ lang = "en", metrics }: BentoDashboardProps) {
  const safeMetrics: Metrics = {
    totalCalls: metrics?.totalCalls ?? 1248,
    successRate: metrics?.successRate ?? 0.95,
    avgDurationSec: metrics?.avgDurationSec ?? 186,
    peakHourLabel: metrics?.peakHourLabel ?? (lang === "fr" ? "14:00–15:00" : "2–3 PM"),
    weekOverWeekDeltaPct: metrics?.weekOverWeekDeltaPct ?? 0.12,
    hourlyCalls:
      metrics?.hourlyCalls ?? [12, 20, 35, 48, 60, 75, 90, 110, 130, 150, 165, 180],
  };

  const t = I18N[lang];
  const deltaSign = safeMetrics.weekOverWeekDeltaPct >= 0 ? "+" : "";
  const deltaPctLabel = `${deltaSign}${Math.round(safeMetrics.weekOverWeekDeltaPct * 100)}% ${t.growth}`;

  const maxHourly = Math.max(...safeMetrics.hourlyCalls);
  const bars = safeMetrics.hourlyCalls.map((value) => Math.round((value / maxHourly) * 100));

  const rootRef = useRef<HTMLDivElement>(null);
  const [started, setStarted] = useState(false);
  useLayoutEffect(() => {
    if (!rootRef.current) return;
    const rect = rootRef.current.getBoundingClientRect();
    const vh = window.innerHeight || document.documentElement.clientHeight;
    const initiallyInView = rect.top < vh * 0.9 && rect.bottom > vh * 0.1;
    if (initiallyInView) setStarted(true);
  }, []);
  useEffect(() => {
    if (!rootRef.current || started) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setStarted(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );
    observer.observe(rootRef.current);
    return () => observer.disconnect();
  }, [started]);

  const animatedTotal = Math.round(useAnimatedNumber(safeMetrics.totalCalls, started, 1000));
  const animatedSuccessPct = Math.round(useAnimatedNumber(safeMetrics.successRate * 100, started, 1000));
  const animatedAvgSec = Math.round(useAnimatedNumber(safeMetrics.avgDurationSec, started, 900));
  const [barsAnimated, setBarsAnimated] = useState(false);
  useEffect(() => {
    if (!started) return;
    const timer = setTimeout(() => setBarsAnimated(true), 150);
    return () => clearTimeout(timer);
  }, [started]);

  return (
    <div ref={rootRef} className="relative w-full rounded-2xl border border-border/50 bg-background/60 backdrop-blur-sm shadow-[0_25px_80px_-15px_rgba(0,0,0,0.35)] p-4 sm:p-6">
      <div className="mb-4 flex items-center gap-2">
        <Badge className="rounded-full font-montserrat" style={{ backgroundColor: '#272a33', color: '#f7f3ec' }}>
          {t.kpi}
        </Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-6 lg:grid-rows-2 gap-4 lg:gap-6">
        {/* Total calls - hero tile (wide) */}
        <Card className="col-span-1 lg:col-span-4 lg:row-span-1">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-base font-montserrat">
              <PhoneCall className="h-4 w-4 text-primary" /> {t.totalCalls}
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="flex items-end justify-between">
              <div>
                <div className={`text-4xl lg:text-5xl font-extrabold font-montserrat leading-none transition-opacity duration-300 ${started ? "opacity-100" : "opacity-0"}`}>
                  {animatedTotal.toLocaleString()}
                </div>
                <div className="mt-1 text-xs text-foreground/70 font-open-sans">
                  {deltaPctLabel}
                </div>
              </div>
              <div className="flex items-center gap-1 text-primary">
                <TrendingUp className="h-4 w-4" />
                <span className={`text-xs font-semibold transition-opacity duration-300 ${started ? "opacity-100" : "opacity-0"}`}>{animatedSuccessPct}%</span>
              </div>
            </div>
            <div className="mt-4 h-2 w-full rounded-full bg-primary/10 overflow-hidden">
              <div 
                className="h-full bg-primary transition-all duration-700 ease-out"
                style={{ width: `${Math.min(100, (animatedTotal / 2000) * 100)}%` }}
              />
            </div>
          </CardContent>
        </Card>

        {/* Success rate - tall vertical */}
        <Card className="col-span-1 lg:col-span-2 lg:row-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-base font-montserrat">
              <CheckCircle2 className="h-4 w-4 text-primary" /> {t.successRate}
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0 flex flex-col h-full">
            <div className="text-center mb-4">
              <div className={`text-4xl lg:text-5xl font-extrabold font-montserrat leading-none transition-opacity duration-300 ${started ? "opacity-100" : "opacity-0"}`}>
                {animatedSuccessPct}%
              </div>
              <div className="mt-3 w-full h-2 rounded-full bg-primary/10 overflow-hidden">
                <div 
                  className="h-full bg-primary transition-all duration-700 ease-out"
                  style={{ width: `${animatedSuccessPct}%` }}
                />
              </div>
            </div>
            
            <Separator className="my-3" />
            
            <div className="flex-1 space-y-3">
              <div className="text-xs font-semibold text-foreground/60 font-montserrat mb-2">
                {lang === "fr" ? "Exemples de requêtes" : "Sample queries"}
              </div>
              
              {[
                {
                  icon: "🅿️",
                  query: lang === "fr" ? "Parking disponible ?" : "Parking available?",
                  delay: 200
                },
                {
                  icon: "🥜",
                  query: lang === "fr" ? "Allergènes menu" : "Menu allergens",
                  delay: 400
                },
                {
                  icon: "✅",
                  query: lang === "fr" ? "Confirmation réservation" : "Booking confirmed",
                  delay: 600
                },
                {
                  icon: "🕐",
                  query: lang === "fr" ? "Horaires d'ouverture" : "Opening hours",
                  delay: 800
                }
              ].map((item, index) => (
                <div 
                  key={index}
                  className={`flex items-center gap-2 p-2 rounded-lg bg-primary/5 border border-primary/10 transition-all duration-500 ${started ? "opacity-100 translate-x-0" : "opacity-0 translate-x-4"}`}
                  style={{ transitionDelay: `${item.delay}ms` }}
                >
                  <span className="text-sm">{item.icon}</span>
                  <span className="text-xs font-open-sans text-foreground/80 flex-1">
                    {item.query}
                  </span>
                  <div className="w-2 h-2 rounded-full bg-primary/40"></div>
                </div>
              ))}
            </div>
            
            <div className="mt-4 pt-3 border-t border-border/50">
              <div className="flex justify-between items-center text-xs font-open-sans">
                <span className="text-foreground/60">
                  {lang === "fr" ? "Taux de résolution" : "Resolution rate"}
                </span>
                <span className={`font-semibold text-primary transition-opacity duration-500 ${started ? "opacity-100" : "opacity-0"}`} style={{ transitionDelay: "1000ms" }}>
                  {animatedSuccessPct}%
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Avg duration */}
        <Card className="col-span-1 lg:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-base font-montserrat">
              <Timer className="h-4 w-4 text-primary" /> {t.avgDuration}
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className={`text-3xl lg:text-4xl font-extrabold font-montserrat leading-none transition-opacity duration-300 ${started ? "opacity-100" : "opacity-0"}`}>
              {formatDuration(animatedAvgSec, lang)}
            </div>
            <div className={`mt-3 h-2 w-full rounded-full bg-gradient-to-r from-primary/20 via-primary/40 to-primary/20 ${started ? "animate-pulse [animation-duration:2s]" : ""}`} />
          </CardContent>
        </Card>

        {/* Peak hour */}
        <Card className="col-span-1 lg:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-base font-montserrat">
              <Clock className="h-4 w-4 text-primary" /> {t.peakHour}
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="text-3xl lg:text-4xl font-extrabold font-montserrat leading-none mb-3">
              {safeMetrics.peakHourLabel}
            </div>
            <div className="h-12 lg:h-16 w-full flex items-end gap-1">
              {bars.map((h, i) => (
                <div
                  key={i}
                  className="flex-1 rounded-sm bg-primary/30 transition-[height] duration-700 ease-out"
                  style={{ height: barsAnimated ? `${Math.max(10, h)}%` : "0%" }}
                />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}


