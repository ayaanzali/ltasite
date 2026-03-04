"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { useWebsiteImages } from "@/hooks/useWebsiteImages";
import { SectionReveal } from "./SectionReveal";

const IMAGE_SECTION = "images";

export type Officer = {
  name: string;
  title: string;
  imageFile?: string;
  initials?: string;
  linkedInUrl?: string;
  isDirector?: boolean;
};

const execBoard: Officer[] = [
  { name: "Ayaan Ali", title: "President", imageFile: "Ayaan.JPG", linkedInUrl: "https://www.linkedin.com/in/ayaanzali/" },
  { name: "Ram Sundararaman", title: "Vice President", imageFile: "Ram.JPG", linkedInUrl: "https://www.linkedin.com/in/sriramsundararaman" },
  { name: "Dorsa Zilaee", title: "Executive Director", initials: "DZ" },
  { name: "Tanisha Dossa", title: "Secretary", imageFile: "Tanisha.JPG", linkedInUrl: "https://www.linkedin.com/in/tanisha-dossa-87a80127a/" },
  { name: "Amrita Singh", title: "Treasurer", initials: "AS" },
];

const directors: Officer[] = [
  { name: "Aishah Abdullah", title: "Programming Director", initials: "AA", linkedInUrl: "https://www.linkedin.com/in/aishahabdulla/", isDirector: true },
  { name: "Nethra Kartheeswaran", title: "Marketing Co-Director", imageFile: "Nethra.JPG", linkedInUrl: "https://www.linkedin.com/in/nethrapk/", isDirector: true },
  { name: "Aafiya Vahora", title: "Marketing Co-Director", imageFile: "Aafiya.png", linkedInUrl: "https://www.linkedin.com/in/aafiyavahora/", isDirector: true },
  { name: "Aaryan Merchant", title: "Media Co-Director", initials: "AM", isDirector: true },
  { name: "Varad Kulkarni", title: "Media Co-Director", initials: "VK", isDirector: true },
  { name: "Neha Kandi", title: "Events Director", imageFile: "Neha.JPG", isDirector: true },
  { name: "Mohamad Alsafi", title: "Fundraising Director", initials: "MA", isDirector: true },
  { name: "Khadijah Khalid", title: "Outreach Director", imageFile: "Khadijah.JPG", isDirector: true },
  { name: "Aaradhya Arkatkar", title: "Growth Director", initials: "AA", isDirector: true },
];

function splitName(fullName: string): { first: string; last: string } {
  const parts = fullName.trim().split(/\s+/);
  if (parts.length <= 1) return { first: fullName, last: "" };
  const first = parts[0];
  const last = parts.slice(1).join(" ");
  return { first, last };
}

function OfficerCard({ officer, delay }: { officer: Officer & { imageUrl?: string | null }; delay: number }) {
  const [imgError, setImgError] = useState(false);
  const Wrapper = officer.linkedInUrl ? motion.a : motion.div;
  const wrapperProps = officer.linkedInUrl
    ? {
        href: officer.linkedInUrl,
        target: "_blank" as const,
        rel: "noopener noreferrer",
      }
    : {};
  const { first, last } = splitName(officer.name);
  const fallbackInitials =
    officer.initials ?? officer.name.split(/\s+/).map((n) => n[0]).join("").slice(0, 2);
  const imageUrl = officer.imageUrl;
  const showInitials = !imageUrl || imgError;

  return (
    <SectionReveal delay={delay}>
      <Wrapper
        {...wrapperProps}
        whileHover={{ y: -4 }}
        className="block group rounded-lg overflow-hidden bg-white border border-gray-200 shadow-sm hover:border-blue-600/30 transition-colors duration-200"
      >
        <div className="aspect-square bg-[#1D2A3F] flex items-center justify-center overflow-hidden relative">
          {imageUrl && !imgError && (
            <Image
              src={imageUrl}
              alt={officer.name}
              fill
              sizes="(max-width: 640px) 33vw, (max-width: 1024px) 25vw, 200px"
              className="object-cover"
              style={{ objectPosition: "top center" }}
              onError={() => setImgError(true)}
              loading="lazy"
              quality={80}
            />
          )}
          {showInitials && (
            <span className="text-white font-semibold text-2xl absolute inset-0 flex items-center justify-center">
              {fallbackInitials}
            </span>
          )}
        </div>
        <div className="p-5 min-h-[7.5rem] flex flex-col">
          <h3 className="font-sans text-lg font-semibold text-navy group-hover:text-blue-600 transition-colors leading-tight">
            <span className="block">{first}</span>
            {last && <span className="block">{last}</span>}
          </h3>
          <p className="text-gray-600 text-sm mt-1">{officer.title}</p>
          <div className="mt-2 min-h-[1.25rem]">
            {officer.linkedInUrl && (
              <span className="inline-flex items-center gap-1 text-blue-600 text-sm">
                LinkedIn ↗
              </span>
            )}
          </div>
        </div>
      </Wrapper>
    </SectionReveal>
  );
}

export function Officers() {
  const { getImageUrl } = useWebsiteImages();
  const resolveOfficers = useMemo(() => {
    const resolve = (o: Officer) => ({
      ...o,
      imageUrl: o.imageFile ? getImageUrl(IMAGE_SECTION, o.imageFile) : undefined,
    });
    return { exec: execBoard.map(resolve), dirs: directors.map(resolve) };
  }, [getImageUrl]);

  return (
    <section id="officers" className="py-24 px-4 md:px-8 lg:px-12 xl:px-16 bg-[#F4F1EC]">
      <div className="max-w-7xl mx-auto">
        <SectionReveal>
          <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-navy text-center mb-4">
            Meet the Team
          </h2>
          <p className="text-gray-600 text-center max-w-2xl mx-auto mb-16">
            LTA is run by a team of passionate UTD students committed to building the premier pre law community on campus.
          </p>
        </SectionReveal>

        <p className="text-sm font-medium text-gray-500 mb-6">Executive Board</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 sm:gap-6 lg:gap-8 mb-16">
          {resolveOfficers.exec.map((officer, i) => (
            <OfficerCard key={officer.name} officer={officer} delay={i * 0.05} />
          ))}
        </div>

        <p className="text-sm font-medium text-gray-500 mb-6">Directors</p>
        <div className="flex flex-wrap justify-center gap-4 sm:gap-6 lg:gap-8">
          {resolveOfficers.dirs.map((officer, i) => (
            <div key={officer.name} className="flex-[1_1_min(100%,280px)]">
              <OfficerCard officer={officer} delay={i * 0.04} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
