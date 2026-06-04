"use client";

import { motion } from "framer-motion";
import { stats } from "@/config/site";

export function Stats() {
  return (
    <section className="border-y border-border bg-slate-50/80 py-14 sm:py-16">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <motion.ul
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5 }}
          className="grid grid-cols-2 gap-8 lg:grid-cols-4 lg:gap-12"
        >
          {stats.map((stat) => (
            <li key={stat.label} className="text-center lg:text-left">
              <p className="text-3xl font-semibold tracking-tight text-[#0F172A] sm:text-4xl">
                {stat.value}
              </p>
              <p className="mt-2 text-sm text-muted-foreground sm:text-base">
                {stat.label}
              </p>
            </li>
          ))}
        </motion.ul>
      </div>
    </section>
  );
}
