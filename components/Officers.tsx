"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { SectionReveal } from "./SectionReveal";

type OfficerRecord = {
  id: string;
  name: string;
  position: string;
  linkedInUrl?: string;
  picUrl?: string;
  isExecBoard: boolean;
};

function splitName(fullName: string): { first: string; last: string } {
  const parts = fullName.trim().split(/\s+/);
  if (parts.length <= 1) return { first: fullName, last: "" };
  return { first: parts[0], last: parts.slice(1).join(" ") };
}

function getInitials(name: string): string {
  return name.split(/\s+/).map((n) => n[0]).join("").slice(0, 2).toUpperCase();
}

function OfficerCard({ officer, delay }: { officer: OfficerRecord; delay: number }) {
  const [imgError, setImgError] = useState(false);
  const Wrapper = officer.linkedInUrl ? motion.a : motion.div;
  const wrapperProps = officer.linkedInUrl
    ? { href: officer.linkedInUrl, target: "_blank" as const, rel: "noopener noreferrer" }
    : {};
  const { first, last } = splitName(officer.name);
  const showInitials = !officer.picUrl || imgError;

  return (
    <SectionReveal delay={delay}>
      <Wrapper
        {...wrapperProps}
        whileHover={{ y: -4 }}
        className="block group rounded-lg overflow-hidden bg-white border border-gray-200 shadow-sm hover:border-blue-600/30 transition-colors duration-200"
      >
        <div className="aspect-square bg-[#1D2A3F] flex items-center justify-center overflow-hidden relative">
          {officer.picUrl && !imgError && (
            <Image
              src={officer.picUrl}
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
              {getInitials(officer.name)}
            </span>
          )}
        </div>
        <div className="p-5 min-h-[7.5rem] flex flex-col">
          <h3 className="font-sans text-lg font-semibold text-navy group-hover:text-blue-600 transition-colors leading-tight">
            <span className="block">{first}</span>
            {last && <span className="block">{last}</span>}
          </h3>
          <p className="text-gray-600 text-sm mt-1">{officer.position}</p>
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

function SkeletonCard() {
  return (
    <div className="rounded-lg bg-white border border-gray-200 shadow-sm overflow-hidden animate-pulse">
      <div className="aspect-square bg-gray-200" />
      <div className="p-5">
        <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
        <div className="h-3 bg-gray-100 rounded w-1/2" />
      </div>
    </div>
  );
}

export function Officers() {
  const [officers, setOfficers] = useState<OfficerRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/officers")
      .then((r) => r.json())
      .then((data) => setOfficers(Array.isArray(data) ? data : []))
      .catch(() => setOfficers([]))
      .finally(() => setLoading(false));
  }, []);

  const exec = officers.filter((o) => o.isExecBoard);
  const dirs = officers.filter((o) => !o.isExecBoard);

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
          {loading
            ? Array.from({ length: 5 }).map((_, i) => <SkeletonCard key={i} />)
            : exec.map((o, i) => <OfficerCard key={o.id} officer={o} delay={i * 0.05} />)}
        </div>

        <p className="text-sm font-medium text-gray-500 mb-6">Directors</p>
        <div className="flex flex-wrap justify-center gap-4 sm:gap-6 lg:gap-8">
          {loading
            ? Array.from({ length: 9 }).map((_, i) => (
                <div key={i} className="flex-[0_1_min(100%,280px)]"><SkeletonCard /></div>
              ))
            : dirs.map((o, i) => (
                <div key={o.id} className="flex-[0_1_min(100%,280px)]">
                  <OfficerCard officer={o} delay={i * 0.04} />
                </div>
              ))}
        </div>
      </div>
    </section>
  );
}
