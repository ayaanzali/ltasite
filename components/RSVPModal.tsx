"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export type EventForRSVP = {
  id: string;
  name: string;
  date: string;
  location: string;
};

interface RSVPModalProps {
  event: EventForRSVP | null;
  onClose: () => void;
  open: boolean;
}

export function RSVPModal({ event, onClose, open }: RSVPModalProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!event) return;
    setStatus("loading");
    try {
      const res = await fetch("/api/rsvp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ eventId: event.id, eventName: event.name, name, email }),
      });
      const data = await res.json();
      if (res.ok && !data.error) {
        setStatus("success");
        setName("");
        setEmail("");
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  };

  const resetAndClose = () => {
    setStatus("idle");
    onClose();
  };

  return (
    <AnimatePresence>
      {open && event && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={resetAndClose}
            className="fixed inset-0 bg-black/40 z-50"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.98, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98, y: 20 }}
            transition={{ type: "spring", damping: 25 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md mx-4 bg-white border border-gray-200 rounded-lg shadow-lg z-50 p-8"
          >
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="font-sans text-xl font-semibold text-navy">
                  RSVP: {event.name}
                </h3>
                <p className="text-gray-600 text-sm mt-1">
                  {event.date} · {event.location}
                </p>
              </div>
              <button
                type="button"
                onClick={resetAndClose}
                className="text-gray-500 hover:text-navy p-1"
                aria-label="Close"
              >
                ✕
              </button>
            </div>

            {status === "success" ? (
              <div className="text-center py-4">
                <p className="text-navy font-medium">You&apos;re on the list!</p>
                <p className="text-gray-600 text-sm mt-1">
                  We&apos;ll send a reminder before the event.
                </p>
                <button
                  type="button"
                  onClick={resetAndClose}
                  className="mt-4 px-6 py-2 rounded-lg bg-navy text-white font-medium hover:bg-navy/90"
                >
                  Close
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="rsvp-name" className="block text-sm font-medium text-navy mb-1">
                    Name
                  </label>
                  <input
                    id="rsvp-name"
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 text-navy placeholder-gray-400 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 outline-none"
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <label htmlFor="rsvp-email" className="block text-sm font-medium text-navy mb-1">
                    Email
                  </label>
                  <input
                    id="rsvp-email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 text-navy placeholder-gray-400 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 outline-none"
                    placeholder="you@utdallas.edu"
                  />
                </div>
                {status === "error" && (
                  <p className="text-red-600 text-sm">Something went wrong. Try again.</p>
                )}
                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={resetAndClose}
                    className="flex-1 py-2.5 rounded-lg border-2 border-blue-600 text-blue-600 font-medium hover:bg-blue-600/5"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={status === "loading"}
                    className="flex-1 py-2.5 rounded-lg bg-navy text-white font-medium hover:bg-navy/90 disabled:opacity-50"
                  >
                    {status === "loading" ? "Sending…" : "RSVP"}
                  </button>
                </div>
              </form>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
