"use client";

import { useState, useEffect } from "react";
import type { WebsiteImages } from "@/lib/airtable-images";

export function useWebsiteImages() {
  const [images, setImages] = useState<WebsiteImages | null>(null);

  useEffect(() => {
    fetch("/api/images")
      .then((r) => r.json())
      .then(setImages)
      .catch(() => setImages({}));
  }, []);

  return images;
}
