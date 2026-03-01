"use client";

import Link from "next/link";
import { SectionReveal } from "./SectionReveal";
import { Calendar, Award, TrendingUp } from "lucide-react";

const cards = [
  {
    label: "Event Operations",
    text: "Help plan and run LTA's competitions, panels, and workshops from start to finish.",
    Icon: Calendar,
  },
  {
    label: "Ranked by Officers",
    text: "Officers evaluate ambassadors based on performance, reliability, and contribution.",
    Icon: Award,
  },
  {
    label: "Path to Leadership",
    text: "High performing ambassadors are first in line when officer positions open up.",
    Icon: TrendingUp,
  },
];

export function AmbassadorSection() {
  return (
    <section className="py-24 px-6 bg-[#F4F1EC]">
      <div className="max-w-6xl mx-auto">
        <SectionReveal>
          <p className="text-[#1D2A3F] text-xs font-bold tracking-widest uppercase mb-2">
            GET INVOLVED
          </p>
          <h2 className="font-playfair text-3xl sm:text-4xl md:text-5xl font-bold text-[#1D2A3F] mb-6">
            Become an LTA Ambassador
          </h2>
          <p className="text-gray-600 max-w-3xl text-lg mb-12">
            Ambassadors are the engine behind LTA events. As an ambassador, you work directly
            alongside LTA officers to plan, host, and run our competitions, panels, and workshops.
            It is the most hands-on role in LTA, and the clearest path to an officer position.
          </p>
        </SectionReveal>
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {cards.map((card, i) => {
            const Icon = card.Icon;
            return (
              <SectionReveal key={card.label} delay={i * 0.08}>
                <div className="h-full p-8 rounded-lg bg-white border border-[#E2E0DB] shadow-sm">
                  <div className="mb-4 flex items-center justify-center w-12 h-12 rounded-lg bg-[#1D2A3F]/5 text-[#1D2A3F]">
                    <Icon className="w-6 h-6" strokeWidth={1.5} aria-hidden />
                  </div>
                  <h3 className="font-inter text-lg font-semibold text-[#1D2A3F] mb-3">
                    {card.label}
                  </h3>
                  <p className="text-[#1D2A3F]/90 leading-relaxed text-sm">
                    {card.text}
                  </p>
                </div>
              </SectionReveal>
            );
          })}
        </div>
        <SectionReveal>
          <div className="text-center">
            <Link
              href="/ambassadors"
              className="inline-flex px-6 py-3.5 rounded-lg bg-[#1D2A3F] text-white font-medium hover:bg-[#2A3A52] transition-colors"
            >
              Apply to Be an Ambassador
            </Link>
          </div>
        </SectionReveal>
      </div>
    </section>
  );
}
