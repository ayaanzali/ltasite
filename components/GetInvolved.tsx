"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useMemo } from "react";
import { SectionReveal } from "./SectionReveal";
import { AmbassadorSection } from "./AmbassadorSection";
import { useWebsiteImages } from "@/hooks/useWebsiteImages";

const SECTION = "bottom-section-photos";
const TOP_ROW = [
  { name: "1.PNG", objectPosition: "center 5%" as const },
  { name: "2.PNG", objectPosition: "80% 5%" as const },
];
const BOTTOM_ROW = [
  { name: "4.PNG", objectPosition: "center center" as const },
  { name: "5.PNG", objectPosition: "center center" as const },
  { name: "6.PNG", objectPosition: "35% 25%" as const },
];

function PhotoTile({
  src,
  objectPosition,
  placeholder = "LTA",
}: {
  src: string | null;
  objectPosition: string;
  placeholder?: string;
}) {
  const [imgError, setImgError] = useState(false);
  const showPlaceholder = !src || imgError;
  return (
    <div className="relative w-full h-full overflow-hidden grayscale hover:grayscale-0 transition-all duration-500">
      {showPlaceholder ? (
        <div className="absolute inset-0 bg-[#1D2A3F] flex items-center justify-center">
          <span className="text-white/60 font-semibold text-xl">{placeholder}</span>
        </div>
      ) : (
        <Image
          src={src}
          alt=""
          fill
          sizes="50vw"
          loading="lazy"
          className="object-cover"
          style={{ objectPosition }}
          onError={() => setImgError(true)}
        />
      )}
    </div>
  );
}

export function GetInvolved() {
  const { getImageUrl } = useWebsiteImages();
  const topRow = useMemo(
    () => TOP_ROW.map(({ name, objectPosition }) => ({ src: getImageUrl(SECTION, name), objectPosition })),
    [getImageUrl]
  );
  const bottomRow = useMemo(
    () => BOTTOM_ROW.map(({ name, objectPosition }) => ({ src: getImageUrl(SECTION, name), objectPosition })),
    [getImageUrl]
  );
  return (
    <section id="get-involved" className="bg-[#1D2A3F]">
      <div className="max-w-3xl mx-auto px-4 md:px-8 lg:px-12 xl:px-16 py-24 text-center">
        <SectionReveal>
          <h2 className="font-playfair text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-[#F4F1EC] mb-6">
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

      {/* Top row — contained, uniform height, no stretch on ultrawide */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-12 xl:px-16">
        <div className="grid grid-cols-2 gap-0 w-full h-[220px] sm:h-[320px] md:h-[420px] lg:h-[500px]">
          {topRow.map(({ src, objectPosition }, i) => (
            <div key={i} className="relative w-full h-full">
              <PhotoTile src={src} objectPosition={objectPosition} />
            </div>
          ))}
        </div>
      </div>
      {/* Bottom row — contained, uniform aspect */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-12 xl:px-16">
        <div className="grid grid-cols-3 gap-0 w-full max-w-5xl mx-auto">
          {bottomRow.map(({ src, objectPosition }, i) => (
            <div key={i} className="relative aspect-[3/4] w-full overflow-hidden">
              <PhotoTile src={src} objectPosition={objectPosition} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
