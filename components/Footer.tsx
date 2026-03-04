"use client";

import Link from "next/link";
import { Logo } from "./Logo";

const pageLinks = [
  { label: "About", href: "#about" },
  { label: "Events", href: "#events" },
  { label: "Officers", href: "#officers" },
  { label: "Join Us", href: "#get-involved" },
];

const socialLinks = [
  { label: "Instagram", href: "https://www.instagram.com/lta.utd/" },
  { label: "LinkedIn", href: "https://www.linkedin.com/company/the-law-trial-association-at-utd/" },
];

export function Footer() {
  return (
    <footer className="bg-[#F4F1EC] border-t border-[#E2E0DB]">
      <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-12 xl:px-16 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-8">
          {/* Logo + LTA branding */}
          <div className="md:col-span-4 flex flex-col sm:flex-row md:flex-col items-center sm:items-start md:items-start gap-4">
            <Link href="#" className="flex items-center gap-3 shrink-0 group">
              <div className="w-12 h-12 rounded-full bg-[#1D2A3F] p-1.5 flex items-center justify-center ring-2 ring-[#1D2A3F]/10">
                <Logo
                  width={40}
                  height={40}
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <p className="font-sans font-bold text-[#1D2A3F] text-lg tracking-tight group-hover:text-[#2D5BE3] transition-colors">
                  LTA
                </p>
                <p className="text-[#1D2A3F]/80 text-sm font-medium">
                  Law & Trial Association at UTD
                </p>
              </div>
            </Link>
          </div>

          {/* Site pages */}
          <div className="md:col-span-4">
            <p className="text-xs font-semibold text-[#1D2A3F]/60 uppercase tracking-widest mb-4">
              Site
            </p>
            <nav className="flex flex-wrap gap-x-6 gap-y-2">
              {pageLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-[#1D2A3F] hover:text-[#2D5BE3] font-medium text-sm transition-colors"
                >
                  {link.label}
                </Link>
              ))}
              <Link
                href="/portal"
                className="text-[#1D2A3F] hover:text-[#2D5BE3] font-medium text-sm transition-colors"
              >
                Log In
              </Link>
            </nav>
          </div>

          {/* Contact + social */}
          <div className="md:col-span-4">
            <p className="text-xs font-semibold text-[#1D2A3F]/60 uppercase tracking-widest mb-4">
              Connect
            </p>
            <div className="flex flex-col gap-3">
              {socialLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#1D2A3F] hover:text-[#2D5BE3] font-medium text-sm transition-colors w-fit"
                >
                  {link.label}
                </a>
              ))}
              <a
                href="mailto:lta.utd@gmail.com"
                className="text-[#1D2A3F] hover:text-[#2D5BE3] font-medium text-sm transition-colors w-fit"
              >
                lta.utd@gmail.com
              </a>
              <button
                type="button"
                onClick={() => window.dispatchEvent(new CustomEvent("open-lta-chat"))}
                className="inline-flex items-center justify-center w-fit mt-2 px-4 py-2.5 rounded-lg bg-[#1D2A3F] text-[#F4F1EC] text-sm font-semibold hover:bg-[#2D5BE3] transition-colors"
              >
                Ask LTA
              </button>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-[#E2E0DB] text-center">
          <p className="text-[#1D2A3F]/70 text-sm mb-2">
            Access to the member portal requires manual approval by the LTA board.
          </p>
          <p className="text-[#1D2A3F]/70 text-sm">
            © 2025 Law & Trial Association at UT Dallas
          </p>
        </div>
      </div>
    </footer>
  );
}
