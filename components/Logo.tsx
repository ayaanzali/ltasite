"use client";

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

  return (
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
      className={className ?? "object-contain"}
    />
  );
}
