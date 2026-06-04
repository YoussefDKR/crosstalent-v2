"use client";

import { motion } from "framer-motion";
import { MessageSquare, Search, UserRound } from "lucide-react";
import { howItWorksSteps } from "@/config/site";

const icons = {
  user: UserRound,
  search: Search,
  message: MessageSquare,
} as const;

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-semibold tracking-tight text-[#0F172A] sm:text-4xl">
            How CrossTalent works
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Three simple steps from profile to your next role with a European
            company.
          </p>
        </div>

        <div className="mt-16 grid gap-8 md:grid-cols-3">
          {howItWorksSteps.map((step, index) => {
            const Icon = icons[step.icon];
            return (
              <motion.article
                key={step.step}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ delay: index * 0.1, duration: 0.45 }}
                className="relative rounded-lg border border-border bg-white p-8 shadow-sm transition-shadow hover:shadow-md"
              >
                <div className="flex size-14 items-center justify-center rounded-full border-2 border-[#2563EB]/20 bg-[#2563EB]/5 text-[#2563EB]">
                  <Icon className="size-7" strokeWidth={1.75} />
                </div>
                <h3 className="mt-6 text-xl font-semibold text-[#0F172A]">
                  {step.title}
                </h3>
                <p className="mt-3 text-muted-foreground leading-relaxed">
                  {step.description}
                </p>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
