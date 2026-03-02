"use client";

import Link from "next/link";
import Image from "next/image";
import { SectionReveal } from "./SectionReveal";
import { AmbassadorSection } from "./AmbassadorSection";

const BOTTOM_ROW_PHOTOS = [
  { src: "/bottom-section-photos/4.PNG", objectPosition: "center center" },
  { src: "/bottom-section-photos/5.PNG", objectPosition: "center center" },
  { src: "/bottom-section-photos/6.PNG", objectPosition: "35% 25%" },
];

export function GetInvolved() {
  return (
    <section id="get-involved" className="bg-[#1D2A3F]">
      <div className="max-w-3xl mx-auto px-6 lg:px-12 py-24 text-center">
        <SectionReveal>
          <h2 className="font-playfair text-3xl sm:text-4xl md:text-5xl font-bold text-[#F4F1EC] mb-6">
            Become a Member.
          </h2>
          <p className="text-[#F4F1EC] text-lg mb-10">
            The legal world runs on relationships. Join LTA to build yours before law school.
          </p>
          <Link
            href="/join"
            className="inline-flex px-6 py-3.5 rounded-lg bg-white text-[#1D2A3F] font-medium hover:bg-[#F4F1EC] transition-colors"
          >
            Start Application
          </Link>
        </SectionReveal>
      </div>

      <AmbassadorSection />

      {/* Top row: Next.js Image for fast mobile loading */}
      <div className="grid grid-cols-2 gap-0 w-full h-[220px] sm:h-[320px] md:h-[420px] lg:h-[500px]">
        <div className="relative overflow-hidden grayscale hover:grayscale-0 transition-all duration-500">
          <Image
            src="/bottom-section-photos/1.PNG"
            alt=""
            fill
            sizes="50vw"
            loading="lazy"
            className="object-cover"
            style={{ objectPosition: "center 5%" }}
          />
        </div>
        <div className="relative overflow-hidden grayscale hover:grayscale-0 transition-all duration-500">
          <Image
            src="/bottom-section-photos/2.PNG"
            alt=""
            fill
            sizes="50vw"
            loading="lazy"
            className="object-cover"
            style={{ objectPosition: "80% 5%" }}
          />
        </div>
      </div>
      {/* Bottom row: Next.js Image for fast mobile loading */}
      <div className="grid grid-cols-3 gap-0 w-full">
        {BOTTOM_ROW_PHOTOS.map(({ src, objectPosition }) => (
          <div key={src} className="relative aspect-[3/4] overflow-hidden grayscale hover:grayscale-0 transition-all duration-500">
            <Image
              src={src}
              alt=""
              fill
              sizes="(max-width: 768px) 33vw, 33vw"
              loading="lazy"
              className="object-cover"
              style={{ objectPosition }}
            />
          </div>
        ))}
      </div>
    </section>
  );
}
