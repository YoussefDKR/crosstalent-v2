"use client";

import { motion } from "framer-motion";
import {
  Briefcase,
  Building2,
  Clock,
  Globe2,
  Users,
} from "lucide-react";
import { stats } from "@/config/site";

const statIcons = {
  users: Users,
  briefcase: Briefcase,
  building: Building2,
  globe: Globe2,
  clock: Clock,
} as const;

export function Stats() {
  return (
    <section className="bg-[#0F172A] py-10 sm:py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.ul
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.45 }}
          className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:grid-cols-5 lg:gap-6"
        >
          {stats.map((stat) => {
            const Icon = statIcons[stat.icon];
            return (
              <li
                key={stat.label}
                className="flex flex-col items-center text-center lg:items-start lg:text-left"
              >
                <Icon
                  className="mb-3 size-5 text-white/50"
                  strokeWidth={1.5}
                  aria-hidden
                />
                <p className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">
                  {stat.value}
                </p>
                <p className="mt-1 text-sm text-white/65">{stat.label}</p>
              </li>
            );
          })}
        </motion.ul>
      </div>
    </section>
  );
}
