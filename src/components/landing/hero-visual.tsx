"use client";

import Image from "next/image";
import { Home, LineChart, Send } from "lucide-react";
import { useI18n } from "@/context/i18n-provider";

const benefitIcons = [Home, LineChart, Send] as const;

/** Hero image + map + North Africa ↔ Europe story + benefit card (marketing home). */
export function HeroVisual() {
  const { messages } = useI18n();
  const l = messages.landing;

  return (
    <div className="relative mx-auto w-full max-w-xl lg:max-w-none">
      <div className="relative aspect-[5/4] overflow-hidden rounded-2xl bg-[#1e293b] shadow-2xl shadow-black/30 ring-1 ring-white/10 sm:aspect-[4/3]">
        <Image
          src="/images/hero-professional.png"
          alt={l.heroImageAlt}
          fill
          priority
          sizes="(max-width: 1024px) 100vw, 50vw"
          className="object-cover object-center"
        />
        <div
          className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#0F172A]/50 via-transparent to-transparent"
          aria-hidden
        />
      </div>

      <div
        className="pointer-events-none absolute inset-0 hidden sm:block"
        aria-hidden
      >
        <svg
          className="absolute inset-0 size-full overflow-visible"
          viewBox="0 0 480 360"
          fill="none"
          preserveAspectRatio="none"
        >
          <path
            d="M88 252 C 200 210, 280 165, 392 128"
            stroke="#2563EB"
            strokeWidth="2.5"
            strokeDasharray="8 7"
            strokeLinecap="round"
          />
          <circle cx="88" cy="252" r="5" fill="#2563EB" />
          <circle cx="392" cy="128" r="5" fill="#2563EB" />
        </svg>
        <div className="absolute bottom-[32%] start-[2%] rounded-lg bg-white px-3.5 py-2 text-xs font-medium text-[#0F172A] shadow-lg ring-1 ring-black/5 sm:start-[4%] sm:px-4 sm:py-2.5 sm:text-sm">
          {l.heroWorkFrom}{" "}
          <span className="font-semibold text-[#2563EB]">{l.heroNorthAfrica}</span>
        </div>
        <div className="absolute top-[12%] end-[2%] rounded-lg bg-white px-3.5 py-2 text-xs font-medium text-[#0F172A] shadow-lg ring-1 ring-black/5 sm:px-4 sm:py-2.5 sm:text-sm">
          {l.heroWorkWith}{" "}
          <span className="font-semibold text-[#2563EB]">{l.heroEurope}</span>
        </div>
      </div>

      <div className="absolute -bottom-5 end-0 z-10 w-[min(100%,288px)] rounded-xl border border-border/80 bg-white p-4 shadow-xl sm:-end-5 lg:-end-10">
        <ul className="space-y-3">
          {l.heroBenefits.map((item, index) => {
            const Icon = benefitIcons[index];
            return (
              <li key={item.title} className="flex gap-3">
                <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-[#2563EB]/10 text-[#2563EB]">
                  <Icon className="size-4" strokeWidth={2} />
                </span>
                <div>
                  <p className="text-sm font-semibold text-[#0F172A]">
                    {item.title}
                  </p>
                  <p className="text-xs text-muted-foreground">{item.subtitle}</p>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
