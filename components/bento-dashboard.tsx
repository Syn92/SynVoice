"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useEffect, useRef, useState, useLayoutEffect } from "react";
import {
  Activity,
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
          {t.kpi} · {t.today}
        </Badge>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4 sm:gap-6">
        <Card className="col-span-1 lg:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-base font-montserrat">
              <PhoneCall className="h-4 w-4 text-primary" /> {t.totalCalls}
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="flex items-end justify-between">
              <div>
                <div className={`text-3xl sm:text-4xl font-extrabold font-montserrat leading-none transition-opacity duration-300 ${started ? "opacity-100" : "opacity-0"}`}>
                  {animatedTotal.toLocaleString()}
                </div>
                <div className="mt-1 text-xs text-foreground/70 font-open-sans">
                  {deltaPctLabel}
                </div>
              </div>
              <div className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
                <TrendingUp className="h-4 w-4" />
                <span className={`text-xs font-semibold transition-opacity duration-300 ${started ? "opacity-100" : "opacity-0"}`}>{animatedSuccessPct}%</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-1 lg:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-base font-montserrat">
              <CheckCircle2 className="h-4 w-4 text-primary" /> {t.successRate}
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="flex items-center justify-between">
              <div className={`text-3xl sm:text-4xl font-extrabold font-montserrat leading-none transition-opacity duration-300 ${started ? "opacity-100" : "opacity-0"}`}>
                {animatedSuccessPct}%
              </div>
              <div className="flex-1 ml-4 h-2 rounded-full bg-primary/10 overflow-hidden">
                <div
                  className="h-full bg-primary transition-all duration-700 ease-out"
                  style={{ width: `${Math.min(100, Math.max(0, animatedSuccessPct))}%` }}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-1 lg:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-base font-montserrat">
              <Timer className="h-4 w-4 text-primary" /> {t.avgDuration}
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className={`text-3xl sm:text-4xl font-extrabold font-montserrat leading-none transition-opacity duration-300 ${started ? "opacity-100" : "opacity-0"}`}>
              {formatDuration(animatedAvgSec, lang)}
            </div>
            <div className={`mt-2 h-2 w-full rounded-full bg-gradient-to-r from-primary/20 via-primary/40 to-primary/20 ${started ? "animate-pulse [animation-duration:2s]" : ""}`} />
          </CardContent>
        </Card>

        <Card className="col-span-1 lg:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-base font-montserrat">
              <Clock className="h-4 w-4 text-primary" /> {t.peakHour}
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="text-3xl sm:text-4xl font-extrabold font-montserrat leading-none">
              {safeMetrics.peakHourLabel}
            </div>
            <div className="mt-3 h-16 w-full flex items-end gap-1">
              {bars.map((h, i) => (
                <div
                  key={i}
                  className="flex-1 rounded-sm bg-primary/30 transition-[height] duration-700 ease-out"
                  style={{ height: barsAnimated ? `${Math.max(8, h)}%` : "0%" }}
                />
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-1 lg:col-span-2 hidden sm:block">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-base font-montserrat">
              <Activity className="h-4 w-4 text-primary" /> {t.summary}
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="text-sm font-open-sans text-foreground/80">
              {lang === "fr"
                ? "Démo assistant restaurant : réservations finalisées de bout en bout, menu et infos parking communiqués automatiquement, pic autour du service du soir."
                : "Restaurant assistant demo: reservations completed end‑to‑end, menu and parking info shared automatically, peak booking window around dinner service."}
            </div>
            <Separator className="my-3" />
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-md border border-border/50 p-3">
                <div className="text-xs text-foreground/60 font-open-sans">SLA</div>
                <div className="mt-1 text-lg font-montserrat font-bold">99.2%</div>
              </div>
              <div className="rounded-md border border-border/50 p-3">
                <div className="text-xs text-foreground/60 font-open-sans">IVR deflection</div>
                <div className="mt-1 text-lg font-montserrat font-bold">42%</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-1 lg:col-span-2 hidden sm:block">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-base font-montserrat">
              <TrendingUp className="h-4 w-4 text-primary" /> {t.highlights}
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <ul className="space-y-2 text-sm font-open-sans">
              <li className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                {lang === "fr" ? "95% des réservations finalisées" : "95% reservations completed"}
              </li>
              <li className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-primary" />
                {lang === "fr" ? "Menu et infos parking partagés automatiquement" : "Menu and parking info shared automatically"}
              </li>
              <li className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-amber-500" />
                {lang === "fr" ? "Pic de réservations 19h–20h" : "Peak booking window 7–8 PM"}
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}


