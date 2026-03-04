"use client";

import { motion } from "framer-motion";
import { SectionReveal } from "./SectionReveal";
import { Scale, Handshake, Users } from "lucide-react";

const cards = [
  {
    title: "Courtroom Experience",
    description:
      "Compete in mock trials and build real advocacy skills. LTA's annual competition brings together UTD students and local high schoolers in a full courtroom simulation judged by practicing attorneys.",
    Icon: Scale,
  },
  {
    title: "Legal Network",
    description:
      "Connect with DFW attorneys, UTD pre law alumni, and law students through our panels and mixers. The legal world runs on relationships. Start building yours now.",
    Icon: Handshake,
  },
  {
    title: "Community & Connections",
    description:
      "Find your people. LTA is a tight knit pre law community where you can build real friendships, share the application journey, and feel at home long before you set foot in law school.",
    Icon: Users,
  },
];

export function WhyJoin() {
  return (
    <section id="why-join" className="py-24 px-4 md:px-8 lg:px-12 xl:px-16 bg-[#1D2A3F]">
      <div className="max-w-7xl mx-auto">
        <SectionReveal>
          <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white text-center mb-16">
            Build the Skills That Get You Into Law School
          </h2>
        </SectionReveal>
        <div className="grid md:grid-cols-3 gap-8">
          {cards.map((card, i) => {
            const Icon = card.Icon;
            return (
              <SectionReveal key={card.title} delay={i * 0.08}>
                <motion.div
                  whileHover={{ y: -4 }}
                  className="h-full p-8 rounded-lg bg-white border border-[#E2E0DB] shadow-sm"
                >
                  <div className="mb-4 flex items-center justify-center w-12 h-12 rounded-lg bg-[#1D2A3F]/5 text-[#1D2A3F]">
                    <Icon className="w-6 h-6" strokeWidth={1.5} aria-hidden />
                  </div>
                  <h3 className="font-sans text-lg font-semibold text-[#1D2A3F] mb-3">
                    {card.title}
                  </h3>
                  <p className="text-[#1D2A3F]/90 leading-relaxed text-sm">
                    {card.description}
                  </p>
                </motion.div>
              </SectionReveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
