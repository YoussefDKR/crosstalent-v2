"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const revealEase = [0.22, 1, 0.36, 1] as const;

type MarketingRevealProps = {
  children: React.ReactNode;
  className?: string;
  delay?: number;
};

export function MarketingReveal({
  children,
  className,
  delay = 0,
}: MarketingRevealProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-48px" }}
      transition={{ duration: 0.55, delay, ease: revealEase }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

type MarketingRevealItemProps = {
  children: React.ReactNode;
  className?: string;
  index?: number;
  as?: "li" | "div";
};

export function MarketingRevealItem({
  children,
  className,
  index = 0,
  as = "li",
}: MarketingRevealItemProps) {
  const Component = as === "div" ? motion.div : motion.li;

  return (
    <Component
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-32px" }}
      transition={{
        duration: 0.5,
        delay: index * 0.08,
        ease: revealEase,
      }}
      className={className}
    >
      {children}
    </Component>
  );
}

type MarketingRevealSectionProps = {
  children: React.ReactNode;
  className?: string;
  id?: string;
};

export function MarketingRevealSection({
  children,
  className,
  id,
}: MarketingRevealSectionProps) {
  return (
    <motion.section
      id={id}
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-64px" }}
      transition={{ duration: 0.6, ease: revealEase }}
      className={cn(className)}
    >
      {children}
    </motion.section>
  );
}
