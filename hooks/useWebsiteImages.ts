"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import { getImageUrl } from "@/lib/airtable-images";

export type ImageMap = Record<string, string>;

type WebsiteImagesContextValue = {
  images: ImageMap | null;
  getImageUrl: (section: string, name: string) => string | null;
};

const WebsiteImagesContext = createContext<WebsiteImagesContextValue | null>(
  null
);

export function WebsiteImagesProvider({
  children,
}: {
  children: React.ReactNode;
}) {
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

  const value = useMemo(
    () => ({ images, getImageUrl: getUrl }),
    [images, getUrl]
  );

  return (
    <WebsiteImagesContext.Provider value={value}>
      {children}
    </WebsiteImagesContext.Provider>
  );
}

export function useWebsiteImages() {
  const ctx = useContext(WebsiteImagesContext);
  if (!ctx) {
    throw new Error("useWebsiteImages must be used within WebsiteImagesProvider");
  }
  return ctx;
}
