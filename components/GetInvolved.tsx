"use client";

import Link from "next/link";
import { SectionReveal } from "./SectionReveal";
import { AmbassadorSection } from "./AmbassadorSection";

// Bottom grid: /public/bottom-section-photos/ — top row 1.PNG, 2.PNG; bottom row 4, 5, 6.
const BOTTOM_ROW_PHOTOS = [
  "/bottom-section-photos/4.PNG",
  "/bottom-section-photos/5.PNG",
  "/bottom-section-photos/6.PNG",
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

      {/* Top row: 1.PNG and 2.PNG — inline styles for forced alignment */}
      <div className="grid grid-cols-2 gap-0 w-full h-[500px]">
        <div className="overflow-hidden grayscale hover:grayscale-0 transition-all duration-500">
          <img
            src="/bottom-section-photos/1.PNG"
            alt=""
            style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center 5% !important" }}
          />
        </div>
        <div className="overflow-hidden grayscale hover:grayscale-0 transition-all duration-500">
          <img
            src="/bottom-section-photos/2.PNG"
            alt=""
            style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "80% 5% !important" }}
          />
        </div>
      </div>
      {/* Bottom row: unchanged */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "0", width: "100%" }}>
        {BOTTOM_ROW_PHOTOS.map((src) => (
          <div key={src} style={{ aspectRatio: "3/4", overflow: "hidden" }} className="grayscale hover:grayscale-0 transition-all duration-500">
            <img
              src={src}
              alt=""
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                ...(src === "/bottom-section-photos/6.PNG" ? { objectPosition: "35% 25%", objectFit: "cover" } : {}),
              }}
            />
          </div>
        ))}
      </div>
    </section>
  );
}
