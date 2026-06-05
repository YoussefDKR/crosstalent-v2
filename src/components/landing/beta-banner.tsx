"use client";

import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { betaMessage } from "@/config/beta";

export function BetaBanner() {
  return (
    <section className="bg-[#0F172A] py-10 sm:py-12" aria-label="Platform status">
      <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45 }}
        >
          <p className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-[#2563EB]">
            <Sparkles className="size-4" aria-hidden />
            Beta
          </p>
          <p className="mt-4 text-lg leading-relaxed text-white/90 sm:text-xl">
            {betaMessage}
          </p>
        </motion.div>
      </div>
    </section>
  );
}
