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
          <p className="text-sm font-semibold uppercase tracking-wider text-[#2563EB]">
            How it works
          </p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-[#0F172A] sm:text-4xl">
            Hire and get hired across borders — in three steps
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            A streamlined experience built for candidates in MENA and employers
            across Europe.
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
                <span className="text-xs font-bold tracking-widest text-[#2563EB]">
                  STEP {step.step}
                </span>
                <div className="mt-6 flex size-12 items-center justify-center rounded-lg bg-[#0F172A] text-white">
                  <Icon className="size-6" strokeWidth={1.75} />
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
