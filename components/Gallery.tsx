"use client";

import { useState } from "react";
import Image from "next/image";
import { SectionReveal } from "./SectionReveal";
import { useWebsiteImages } from "@/hooks/useWebsiteImages";

const stats = [
  "Real Texas Courtroom",
  "Attorney Judges",
  "December 2025",
];

const SECTION = "competition-photos";
const WINNING_TEAM = { file: "1.JPG", heading: "Winning Team", name: "Dorsa Zilaee, Likhit Kadiam, Rashmi Ravindran", initials: "WT" };
const RUNNER_UP = { file: "2.JPG", heading: "Runner Up", name: "Khadijah Khalid, Aadharshini Thangapandian", initials: "RU" };

function WinnerCard({
  image,
  heading,
  name,
  initials,
}: {
  image: string | null;
  heading: string;
  name: string;
  initials: string;
}) {
  const [imgError, setImgError] = useState(false);
  const showPlaceholder = !image || imgError;
  return (
    <div className="flex flex-col min-w-0">
      <div
        className="relative aspect-[4/3] min-h-[220px] rounded-lg overflow-hidden bg-white/5 p-2 sm:p-3 shadow-xl"
        style={{
          boxShadow: "0 0 0 1px rgba(255,255,255,0.15), 0 0 0 3px rgba(45,91,227,0.4), 0 25px 50px -12px rgba(0,0,0,0.5)",
        }}
      >
        <div className="absolute inset-2 sm:inset-3 rounded-md overflow-hidden ring-1 ring-white/20 relative bg-[#1D2A3F]">
          {showPlaceholder ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-white font-semibold text-2xl">{initials}</span>
            </div>
          ) : (
            <Image
              src={image}
              alt={name}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              loading="lazy"
              className="object-cover object-center"
              onError={() => setImgError(true)}
            />
          )}
        </div>
      </div>
      <h3 className="mt-4 font-serif text-xl sm:text-2xl font-bold text-white">
        {heading}
      </h3>
      <p className="mt-1 text-slate-300 text-lg">{name}</p>
    </div>
  );
}

export function Gallery() {
  const { getImageUrl } = useWebsiteImages();
  const winningImage = getImageUrl(SECTION, WINNING_TEAM.file);
  const runnerUpImage = getImageUrl(SECTION, RUNNER_UP.file);

  return (
    <section id="gallery" className="py-24 px-6 bg-[#1D2A3F]" suppressHydrationWarning>
      <div className="max-w-6xl mx-auto">
        <SectionReveal>
          <p className="text-blue text-xs font-bold tracking-widest uppercase mb-2">
            THE COMPETITION
          </p>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
            LTA&apos;s 2025 Intramural Mock Trial Competition
          </h2>
          <p className="text-slate-300 max-w-3xl text-lg mb-6">
            UTD students competed as attorneys in a real Texas courtroom, argued live cases before practicing attorney judges, and collaborated with high school witnesses in LTA&apos;s first ever intramural competition.
          </p>
          <div className="flex flex-wrap gap-6 text-white text-sm mb-12">
            {stats.map((stat, i) => (
              <span key={stat} className="flex items-center gap-6">
                <span>{stat}</span>
                {i < stats.length - 1 && (
                  <span className="text-blue w-1 h-1 rounded-full bg-blue shrink-0" />
                )}
              </span>
            ))}
          </div>
        </SectionReveal>

        <SectionReveal>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-12 lg:gap-16">
            <WinnerCard
              image={winningImage}
              heading={WINNING_TEAM.heading}
              name={WINNING_TEAM.name}
              initials={WINNING_TEAM.initials}
            />
            <WinnerCard
              image={runnerUpImage}
              heading={RUNNER_UP.heading}
              name={RUNNER_UP.name}
              initials={RUNNER_UP.initials}
            />
          </div>
        </SectionReveal>
      </div>
    </section>
  );
}
