"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import type { EventCard } from "./Events";


function getOrdinal(n: number): string {
  const s = n % 100;
  if (s >= 11 && s <= 13) return `${n}th`;
  switch (n % 10) {
    case 1: return `${n}st`;
    case 2: return `${n}nd`;
    case 3: return `${n}rd`;
    default: return `${n}th`;
  }
}

function formatEventDate(isoString: string): string {
  if (!isoString || !isoString.trim()) return "TBD";
  try {
    const date = new Date(isoString);
    if (Number.isNaN(date.getTime())) return "TBD";
    const day = new Intl.DateTimeFormat("en-US", { day: "numeric", timeZone: "America/Chicago" }).format(date);
    const weekday = new Intl.DateTimeFormat("en-US", { weekday: "long", timeZone: "America/Chicago" }).format(date);
    const month = new Intl.DateTimeFormat("en-US", { month: "long", timeZone: "America/Chicago" }).format(date);
    const time = new Intl.DateTimeFormat("en-US", { hour: "numeric", minute: "2-digit", hour12: true, timeZone: "America/Chicago" }).format(date);
    return `${weekday}, ${month} ${getOrdinal(Number(day))} at ${time}`;
  } catch {
    return "TBD";
  }
}

function ModalImage({ imageUrl, eventName }: { imageUrl?: string; eventName: string }) {
  const [err, setErr] = useState(false);
  const initials = eventName.split(/\s+/).map(w => w[0]).join("").slice(0, 2).toUpperCase() || "LTA";
  return (
    <div className="relative w-full h-[200px] bg-[#1D2A3F] shrink-0 overflow-hidden">
      {!imageUrl || err ? (
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-white/40 font-semibold text-3xl tracking-widest">{initials}</span>
        </div>
      ) : (
        <img src={imageUrl} alt="" className="absolute inset-0 w-full h-full object-cover" onError={() => setErr(true)} />
      )}
    </div>
  );
}

export function DebateNightModal() {
  const [open, setOpen] = useState(false);
  const [event, setEvent] = useState<EventCard | null>(null);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;

    fetch("/api/events")
      .then(r => r.json())
      .then((data: EventCard[]) => {
        if (!Array.isArray(data)) return;
        const e = data.find(e => e.name.toLowerCase().includes("debate night"));
        if (!e) return;
        const eventDate = new Date(e.date);
        if (Number.isNaN(eventDate.getTime()) || new Date() >= eventDate) return;
        setEvent(e);
        timer = setTimeout(() => setOpen(true), 1000);
      })
      .catch(() => {});

    return () => clearTimeout(timer);
  }, []);

  const dismiss = () => {
    setOpen(false);
  };

  return (
    <AnimatePresence>
      {open && event && (
        <>
          {/* Backdrop — clicks to dismiss */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={dismiss}
            style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.65)", zIndex: 9998 }}
          />

          {/* Centering shell — fixed full-screen flex container, pointer-events-none so backdrop click still works */}
          <div
            style={{
              position: "fixed",
              inset: 0,
              zIndex: 9999,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "1rem",
              pointerEvents: "none",
            }}
          >
            <motion.div
              key="modal"
              initial={{ opacity: 0, scale: 0.95, y: 24 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 24 }}
              transition={{ type: "spring", damping: 26, stiffness: 320 }}
              role="dialog"
              aria-modal="true"
              aria-labelledby="dn-modal-title"
              style={{
                pointerEvents: "auto",
                width: "100%",
                maxWidth: 420,
                borderRadius: 16,
                overflow: "hidden",
                boxShadow: "0 25px 60px rgba(0,0,0,0.5)",
                display: "flex",
                flexDirection: "column",
                maxHeight: "90vh",
              }}
            >
              {/* Event photo + X button */}
              <div style={{ position: "relative", flexShrink: 0 }}>
                <ModalImage imageUrl={event.imageUrl} eventName={event.name} />
                <button
                  type="button"
                  onClick={dismiss}
                  aria-label="Close"
                  style={{
                    position: "absolute",
                    top: 12,
                    right: 12,
                    width: 32,
                    height: 32,
                    borderRadius: "50%",
                    background: "rgba(0,0,0,0.55)",
                    color: "#fff",
                    border: "none",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 14,
                    fontWeight: 700,
                    lineHeight: 1,
                  }}
                >
                  ✕
                </button>
              </div>

              {/* Navy content box */}
              <div
                style={{
                  background: "#1D2A3F",
                  padding: "24px 24px 28px",
                  display: "flex",
                  flexDirection: "column",
                  overflowY: "auto",
                }}
              >
                {/* Title */}
                <h2
                  id="dn-modal-title"
                  style={{
                    fontFamily: "var(--font-playfair), Georgia, serif",
                    fontSize: "clamp(1.4rem, 4vw, 1.75rem)",
                    fontWeight: 700,
                    color: "#ffffff",
                    lineHeight: 1.2,
                    marginBottom: 6,
                  }}
                >
                  RSVP For Debate Night!
                </h2>

                {/* Subtitle */}
                <p style={{ color: "rgba(255,255,255,0.65)", fontSize: 14, marginBottom: 20 }}>
                  Shawarmas, fries &amp; dates provided.
                </p>

                {/* Date & location */}
                <p style={{ color: "#ffffff", fontWeight: 600, fontSize: 14, marginBottom: 4 }}>
                  {formatEventDate(event.date)}
                </p>
                <p style={{ color: "rgba(255,255,255,0.55)", fontSize: 13, marginBottom: 16 }}>
                  {event.location}
                </p>

                {/* Description */}
                <p style={{ color: "rgba(255,255,255,0.7)", fontSize: 13, lineHeight: 1.6, marginBottom: 24 }}>
                  {event.description}
                </p>

                {/* RSVP button */}
                {event.rsvpUrl ? (
                  <Link
                    href={event.rsvpUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={dismiss}
                    style={{
                      display: "block",
                      width: "100%",
                      padding: "14px 0",
                      borderRadius: 10,
                      background: "#ffffff",
                      color: "#1D2A3F",
                      fontWeight: 700,
                      fontSize: 15,
                      textAlign: "center",
                      textDecoration: "none",
                      boxSizing: "border-box",
                    }}
                  >
                    RSVP Now
                  </Link>
                ) : (
                  <button
                    type="button"
                    disabled
                    style={{
                      width: "100%",
                      padding: "14px 0",
                      borderRadius: 10,
                      background: "rgba(255,255,255,0.15)",
                      color: "rgba(255,255,255,0.4)",
                      fontWeight: 700,
                      fontSize: 15,
                      border: "none",
                      cursor: "not-allowed",
                    }}
                  >
                    RSVP Coming Soon
                  </button>
                )}

                {/* Dismiss */}
                <button
                  type="button"
                  onClick={dismiss}
                  style={{
                    marginTop: 14,
                    background: "none",
                    border: "none",
                    color: "rgba(255,255,255,0.35)",
                    fontSize: 12,
                    cursor: "pointer",
                    textAlign: "center",
                  }}
                >
                  Maybe later
                </button>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
