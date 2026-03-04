"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Logo } from "./Logo";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";

const navLinks = [
  { label: "About", href: "/#about" },
  { label: "Events", href: "/#events" },
  { label: "Officers", href: "/#officers" },
  { label: "Join Us", href: "/#get-involved" },
];

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { scrollY } = useScroll();
  const shadowOpacity = useTransform(scrollY, [0, 80], [0, 0.08]);

  const [shadowStyle, setShadowStyle] = useState<React.CSSProperties>({});
  useEffect(() => {
    const unsub = shadowOpacity.on("change", (v) => {
      setShadowStyle({ boxShadow: v > 0 ? `0 4px 6px -1px rgb(0 0 0 / ${v}), 0 2px 4px -2px rgb(0 0 0 / ${v})` : "none" });
    });
    return () => unsub();
  }, [shadowOpacity]);

  return (
    <motion.header
      style={shadowStyle}
      className="sticky top-0 z-50 bg-[#F4F1EC] border-b border-border"
    >
      <div className="w-full max-w-7xl mx-auto px-8">
        <div className="flex items-center justify-between h-16">
          <Link
            href="/"
            className="flex items-center gap-3 shrink-0"
            onClick={() => setMobileOpen(false)}
          >
            <span className="w-9 h-9 flex items-center justify-center shrink-0">
              <Logo width={36} height={36} />
            </span>
            <span className="font-inter font-semibold text-navy hidden sm:inline text-[15px]">
              Law & Trial Association
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="relative font-inter text-sm font-medium text-navy hover:text-blue py-1 group inline-block"
              >
                {link.label}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue group-hover:w-full transition-all duration-200" />
              </Link>
            ))}
            <SignedIn>
              <Link
                href="/members"
                className="font-inter text-sm font-medium text-navy hover:text-blue py-1 transition-colors"
              >
                Members
              </Link>
              <div className="flex items-center">
                <UserButton afterSignOutUrl="/" />
              </div>
            </SignedIn>
            <SignedOut>
              <SignInButton mode="modal">
                <button
                  type="button"
                  className="font-inter text-sm font-medium text-white bg-[#1D2A3F] hover:bg-[#2A3A52] py-2 px-4 rounded-lg transition-colors"
                >
                  Log In
                </button>
              </SignInButton>
            </SignedOut>
          </nav>

          <div className="md:hidden flex items-center gap-2">
            <SignedIn>
              <UserButton afterSignOutUrl="/" />
            </SignedIn>
            <SignedOut>
              <SignInButton mode="modal">
                <button
                  type="button"
                  className="font-inter text-sm font-medium text-white bg-[#1D2A3F] hover:bg-[#2A3A52] py-2 px-4 rounded-lg transition-colors"
                >
                  Log In
                </button>
              </SignInButton>
            </SignedOut>
            <button
              type="button"
              onClick={() => setMobileOpen((o) => !o)}
              className="p-2 text-navy rounded-lg hover:bg-[#EEEEE8]"
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
            >
              {mobileOpen ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden overflow-hidden border-t border-border bg-[#F4F1EC]"
          >
            <nav className="px-6 lg:px-12 py-3 flex flex-col gap-0">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="py-3 font-inter text-sm font-medium text-navy hover:text-blue border-b border-border last:border-0 transition-colors"
                >
                  {link.label}
                </Link>
              ))}
              <SignedIn>
                <Link
                  href="/members"
                  onClick={() => setMobileOpen(false)}
                  className="py-3 font-inter text-sm font-medium text-navy hover:text-blue border-b border-border transition-colors"
                >
                  Members
                </Link>
              </SignedIn>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
