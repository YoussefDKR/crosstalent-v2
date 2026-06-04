"use client";

import { motion } from "framer-motion";
import { Quote } from "lucide-react";
import {
  Avatar,
  AvatarFallback,
} from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { testimonials } from "@/config/site";

export function Testimonials() {
  return (
    <section id="testimonials" className="bg-slate-50/80 py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-[#2563EB]">
            Success stories
          </p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-[#0F172A] sm:text-4xl">
            Trusted by talent and teams on both sides of the Mediterranean
          </h2>
        </div>

        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {testimonials.map((item, index) => (
            <motion.div
              key={item.author}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.08, duration: 0.4 }}
            >
              <Card className="h-full border-border/80 bg-white shadow-sm">
                <CardContent className="flex h-full flex-col p-6">
                  <Quote
                    className="size-8 text-[#2563EB]/30"
                    strokeWidth={1.5}
                    aria-hidden
                  />
                  <blockquote className="mt-4 flex-1 text-[#0F172A]/90 leading-relaxed">
                    &ldquo;{item.quote}&rdquo;
                  </blockquote>
                  <div className="mt-6 flex items-center gap-3 border-t border-border pt-6">
                    <Avatar className="size-11">
                      <AvatarFallback className="bg-[#0F172A] text-sm text-white">
                        {item.initials}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium text-[#0F172A]">
                        {item.author}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {item.role} · {item.company}
                      </p>
                      <p className="text-xs text-[#10B981]">{item.country}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
