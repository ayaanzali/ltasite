"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

const headline = "Where Future Advocates Build Their Case.";
const words = headline.split(" ");

// Top carousel: /public/starting-photos/ — hardcoded only (12 JPGs)
const CAROUSEL_IMAGES = [
  "/starting-photos/1.JPG", "/starting-photos/2.JPG", "/starting-photos/3.JPG",
  "/starting-photos/4.JPG", "/starting-photos/5.JPG", "/starting-photos/6.JPG",
  "/starting-photos/7.JPG", "/starting-photos/8.JPG", "/starting-photos/9.JPG",
  "/starting-photos/10.JPG", "/starting-photos/11.JPG", "/starting-photos/12.JPG",
];

const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? "100%" : "-100%",
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    x: direction > 0 ? "-100%" : "100%",
    opacity: 0,
  }),
};

function HeroSlider({ images }: { images: string[] }) {
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const goTo = useCallback((next: number) => {
    setDirection(next > index ? 1 : -1);
    setIndex(next);
  }, [index]);

  const next = useCallback(() => {
    if (images.length === 0) return;
    goTo((index + 1) % images.length);
  }, [index, goTo, images.length]);

  const prev = useCallback(() => {
    if (images.length === 0) return;
    goTo((index - 1 + images.length) % images.length);
  }, [index, goTo, images.length]);

  useEffect(() => {
    if (isPaused || images.length === 0) return;
    const t = setInterval(next, 4000);
    return () => clearInterval(t);
  }, [isPaused, next, images.length]);

  return (
    <div
      className="flex flex-col items-center w-full"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      suppressHydrationWarning
    >
      {/* Image wrapper: overflow hidden, arrows inside */}
      <div className="relative w-full max-w-[600px] h-[420px] overflow-hidden">
        <AnimatePresence initial={false} custom={direction} mode="wait">
          {images.length > 0 && (
            <motion.div
              key={index}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ type: "tween", duration: 0.35 }}
              className="absolute inset-0"
            >
              <img
                src={images[index]}
                alt={`Photo ${index + 1}`}
                className="absolute inset-0 w-full h-full object-cover object-center"
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Arrows - inside image wrapper */}
        <button
          type="button"
          onClick={prev}
          className="absolute top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors z-10"
          style={{ left: 12 }}
          aria-label="Previous"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <button
          type="button"
          onClick={next}
          className="absolute top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors z-10"
          style={{ right: 12 }}
          aria-label="Next"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Dots - centered below image, margin-top 12px */}
      {images.length > 0 && (
        <div className="flex items-center justify-center gap-2 mt-3" suppressHydrationWarning>
          {images.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => goTo(i)}
              className={`rounded-full transition-all ${
                i === index
                  ? "w-2.5 h-2.5 bg-[#2D5BE3]"
                  : "w-2 h-2 bg-white/80 hover:bg-white"
              }`}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export function Hero() {
  return (
    <section
      className="relative w-full min-h-screen flex flex-col md:flex-row items-center justify-center md:items-center md:justify-center bg-[#1D2A3F]"
      style={{ padding: "60px 48px 60px 48px" }}
      suppressHydrationWarning
    >
      {/* Left column: text — 45% width */}
      <div className="relative z-10 flex flex-col justify-center w-full md:w-[45%] shrink-0">
        <div className="flex flex-col justify-center">
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="text-white text-xs sm:text-sm font-semibold tracking-widest uppercase mb-3 whitespace-nowrap"
          >
            THE LAW & TRIAL ASSOCIATION AT UTD
          </motion.p>
          <h1
            className="font-playfair font-bold text-white tracking-tight leading-[1.1] mb-5"
            style={{ fontSize: "clamp(2rem, 4vw, 4.5rem)" }}
          >
            {words.map((word, i) => (
              <motion.span
                key={i}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: 0.06 * i }}
                className="inline-block mr-[0.2em]"
              >
                {word}
              </motion.span>
            ))}
          </h1>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.5 }}
            className="font-inter text-base sm:text-lg text-slate-300 max-w-lg mb-6"
          >
            We give UTD students an introductory experience into the field of law and its practices through competitive mock trial, lawyer panels, LSAT workshops, and real connections to the legal community.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.65 }}
            className="flex items-center gap-2 text-sm text-white/90 mb-8"
          >
            <span>Est. 2025</span>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.75 }}
            className="flex flex-wrap gap-4"
          >
            <Link
              href="#get-involved"
              className="inline-flex px-6 py-3 rounded-lg bg-white text-[#1D2A3F] font-medium hover:bg-[#F4F1EC] transition-colors"
            >
              Join LTA
            </Link>
            <Link
              href="#about"
              className="inline-flex px-6 py-3 rounded-lg bg-white text-[#1D2A3F] font-medium hover:bg-[#F4F1EC] transition-colors"
            >
              Learn More
            </Link>
          </motion.div>
        </div>
      </div>

      {/* Right column: carousel — 55% width */}
      <div className="relative z-10 flex flex-col items-center w-full md:w-[55%] shrink-0">
        <HeroSlider images={CAROUSEL_IMAGES} />
      </div>
    </section>
  );
}
