"use client";

import { SectionReveal } from "./SectionReveal";

const quotes = [
  {
    text: "LTA gave me my first real courtroom experience before I even applied to law school.",
    name: "Placeholder Name",
    title: "UTD Class of 2025",
  },
  {
    text: "The network I built through LTA opened doors I did not even know existed.",
    name: "Placeholder Name",
    title: "Pre-Law Senior",
  },
  {
    text: "Mock trial taught me how to think on my feet. Nothing else at UTD does that.",
    name: "Placeholder Name",
    title: "Political Science",
  },
];

export function MemberQuotes() {
  return (
    <section id="member-quotes" className="py-24 px-6 bg-[#1D2A3F]">
      <div className="max-w-6xl mx-auto">
        <SectionReveal>
          <p className="text-blue text-xs font-bold tracking-widest uppercase mb-3">
            WHAT MEMBERS SAY
          </p>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-white text-left mb-16">
            Built different from day one.
          </h2>
        </SectionReveal>
        <div className="grid md:grid-cols-3 gap-8">
          {quotes.map((q, i) => (
            <SectionReveal key={i} delay={i * 0.08}>
              <div className="h-full p-8 rounded-lg bg-white border border-[#E2E0DB] shadow-sm">
                <p className="text-[#2D5BE3] font-serif text-5xl leading-none mb-4">&quot;</p>
                <p className="text-navy text-lg leading-relaxed mb-6">{q.text}</p>
                <p className="font-semibold text-navy">{q.name}</p>
                <p className="text-gray-500 text-sm">{q.title}</p>
              </div>
            </SectionReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
