"use client";

import { useState, useEffect, useCallback } from "react";
import { getImageUrl } from "@/lib/airtable-images";

export type ImageMap = Record<string, string>;

export function useWebsiteImages() {
  const [images, setImages] = useState<ImageMap | null>(null);

  useEffect(() => {
    fetch("/api/images")
      .then((r) => r.json())
      .then(setImages)
      .catch(() => setImages({}));
  }, []);

  const getUrl = useCallback(
    (section: string, name: string) => getImageUrl(images, section, name),
    [images]
  );

  return { images, getImageUrl: getUrl };
}
