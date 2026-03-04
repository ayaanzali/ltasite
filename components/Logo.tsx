"use client";

import { useState } from "react";
import Image from "next/image";
import { useWebsiteImages } from "@/hooks/useWebsiteImages";

type LogoProps = {
  width?: number;
  height?: number;
  className?: string;
  alt?: string;
};

export function Logo({ width = 36, height = 36, className, alt = "LTA" }: LogoProps) {
  const { getImageUrl } = useWebsiteImages();
  const src = getImageUrl("", "lta-logo.png");
  const [imgError, setImgError] = useState(false);

  if (!src || imgError) {
    return (
      <div
        className={className ?? "object-contain flex items-center justify-center bg-[#1D2A3F] rounded text-white font-bold"}
        style={{ width, height, fontSize: Math.max(10, width * 0.4) }}
      >
        LTA
      </div>
    );
  }
  return (
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
      className={className ?? "object-contain"}
      onError={() => setImgError(true)}
    />
  );
}
