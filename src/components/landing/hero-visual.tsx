import Image from "next/image";
import { Home, LineChart, Send } from "lucide-react";
import { heroBenefits } from "@/config/site";

const benefitIcons = {
  opportunities: Home,
  remote: LineChart,
  growth: Send,
} as const;

/** Hero image + map + North Africa ↔ Europe story + benefit card (marketing home). */
export function HeroVisual() {
  return (
    <div className="relative mx-auto w-full max-w-xl lg:max-w-none">
      <div className="relative aspect-[5/4] overflow-hidden rounded-2xl bg-[#E8EEF4] shadow-xl ring-1 ring-black/5 sm:aspect-[4/3]">
        {/* Subtle world map (Europe / Africa focus) */}
        <svg
          className="pointer-events-none absolute inset-0 size-full text-slate-300/90"
          viewBox="0 0 480 360"
          aria-hidden
          preserveAspectRatio="xMidYMid slice"
        >
          <ellipse cx="240" cy="200" rx="200" ry="120" fill="currentColor" opacity="0.35" />
          <path
            d="M120 220 Q200 160 280 140 T380 120"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            opacity="0.5"
          />
          <circle cx="155" cy="235" r="6" fill="#2563EB" opacity="0.35" />
          <circle cx="335" cy="155" r="6" fill="#2563EB" opacity="0.35" />
        </svg>

        <Image
          src="/images/hero-professional.jpg"
          alt="Professional working remotely, connecting North Africa with Europe"
          fill
          priority
          sizes="(max-width: 1024px) 100vw, 50vw"
          className="object-cover object-[center_20%]"
        />
        <div
          className="pointer-events-none absolute inset-0 bg-gradient-to-r from-[#F8FAFC]/85 via-[#F8FAFC]/25 to-transparent"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#F8FAFC]/40 via-transparent to-transparent"
          aria-hidden
        />
      </div>

      {/* Connection: North Africa → Europe */}
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
        <div className="absolute bottom-[32%] left-[2%] rounded-lg bg-white px-3.5 py-2 text-xs font-medium text-[#0F172A] shadow-lg ring-1 ring-black/5 sm:left-[4%] sm:px-4 sm:py-2.5 sm:text-sm">
          Work from{" "}
          <span className="font-semibold text-[#2563EB]">North Africa</span>
        </div>
        <div className="absolute top-[12%] right-[2%] rounded-lg bg-white px-3.5 py-2 text-xs font-medium text-[#0F172A] shadow-lg ring-1 ring-black/5 sm:px-4 sm:py-2.5 sm:text-sm">
          Work with{" "}
          <span className="font-semibold text-[#2563EB]">Europe</span>
        </div>
      </div>

      <div className="absolute -bottom-5 right-0 z-10 w-[min(100%,288px)] rounded-xl border border-border/80 bg-white p-4 shadow-xl sm:-right-5 lg:-right-10">
        <ul className="space-y-3">
          {heroBenefits.map((item) => {
            const Icon = benefitIcons[item.icon];
            return (
              <li key={item.title} className="flex gap-3">
                <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-[#2563EB]/10 text-[#2563EB]">
                  <Icon className="size-4" strokeWidth={2} />
                </span>
                <div>
                  <p className="text-sm font-semibold text-[#0F172A]">
                    {item.title}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {item.subtitle}
                  </p>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
