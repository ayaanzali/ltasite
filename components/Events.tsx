"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { SectionReveal } from "./SectionReveal";

export type EventCard = {
  id: string;
  name: string;
  date: string;
  location: string;
  description: string;
  membersOnly?: boolean;
  rsvpOpen?: boolean;
  imageUrl?: string;
  rsvpUrl?: string;
};

const placeholderEvent: EventCard = {
  id: "placeholder",
  name: "General Body Meeting, Build Your Case",
  date: "TBD, March 2026",
  location: "UT Dallas Campus",
  description:
    "LTA's first general body meeting of the semester. Meet the team, hear about upcoming events, and participate in our Build Your Case activity where you'll argue real legal scenarios in teams. Food provided.",
};

const eventPills = ["Mock Trial Labs", "Lawyer Panels", "LSAT Workshops", "Networking Mixers"];

function getOrdinal(n: number): string {
  const s = n % 100;
  if (s >= 11 && s <= 13) return `${n}th`;
  switch (n % 10) {
    case 1:
      return `${n}st`;
    case 2:
      return `${n}nd`;
    case 3:
      return `${n}rd`;
    default:
      return `${n}th`;
  }
}

/** Format ISO date string to "Thursday, March 12th at 7:30 PM" (CT timezone) */
function formatEventDate(isoString: string): string {
  if (!isoString || !isoString.trim()) return "TBD";
  try {
    const date = new Date(isoString);
    if (Number.isNaN(date.getTime())) return "TBD";
    const day = date.getDate();
    const dayOrdinal = getOrdinal(day);
    const weekday = new Intl.DateTimeFormat("en-US", {
      weekday: "long",
      timeZone: "America/Chicago",
    }).format(date);
    const month = new Intl.DateTimeFormat("en-US", {
      month: "long",
      timeZone: "America/Chicago",
    }).format(date);
    const time = new Intl.DateTimeFormat("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
      timeZone: "America/Chicago",
    }).format(date);
    return `${weekday}, ${month} ${dayOrdinal} at ${time}`;
  } catch {
    return "TBD";
  }
}

function SkeletonCard() {
  return (
    <div className="h-full flex flex-col rounded-lg bg-white border border-gray-200 shadow-sm overflow-hidden animate-pulse">
      <div className="h-[220px] bg-gray-200" />
      <div className="p-6 flex flex-col flex-1">
        <div className="h-4 bg-gray-200 rounded w-1/2 mb-3" />
        <div className="h-5 bg-gray-200 rounded w-3/4 mb-2" />
        <div className="h-4 bg-gray-100 rounded w-1/2 mb-3" />
        <div className="space-y-2 flex-1 mb-4">
          <div className="h-3 bg-gray-100 rounded w-full" />
          <div className="h-3 bg-gray-100 rounded w-full" />
          <div className="h-3 bg-gray-100 rounded w-2/3" />
        </div>
        <div className="h-10 bg-gray-100 rounded-lg mt-auto" />
      </div>
    </div>
  );
}

export function Events() {
  const [events, setEvents] = useState<EventCard[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/events")
      .then((res) => res.json())
      .then((data) => {
        setEvents(Array.isArray(data) ? data : []);
      })
      .catch(() => setEvents([]))
      .finally(() => setLoading(false));
  }, []);

  const displayEvents = events.length > 0 ? events : [placeholderEvent];
  const isPlaceholder = events.length === 0;
  const count = loading ? 3 : displayEvents.length;

  const gridCols =
    count === 1 ? "grid-cols-1 max-w-[400px]" : count === 2 ? "grid-cols-1 md:grid-cols-2 max-w-[800px]" : "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 max-w-[1100px]";

  return (
    <section id="events" className="py-24 px-6 bg-[#EEEEE8]">
      <div className="mx-auto">
        <SectionReveal>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-navy text-center mb-4">
            Upcoming Events
          </h2>
          <p className="text-gray-600 text-center max-w-2xl mx-auto mb-16">
            Join us for competitions, workshops, and networking.
          </p>
        </SectionReveal>

        <div className={`grid ${gridCols} mx-auto gap-8`}>
          {loading ? (
            <>
              <SkeletonCard />
              <SkeletonCard />
              <SkeletonCard />
            </>
          ) : (
            displayEvents.map((event, i) => (
              <SectionReveal key={event.id} delay={i * 0.06}>
                <motion.article
                  whileHover={{ y: -4 }}
                  className="h-full flex flex-col rounded-lg bg-white border border-gray-200 shadow-sm overflow-hidden hover:border-blue-600/30 transition-colors duration-200"
                >
                  {/* Image */}
                  <div className="relative w-full h-[220px] bg-[#1D2A3F] shrink-0 overflow-hidden">
                    {event.imageUrl ? (
                      <img
                        src={event.imageUrl}
                        alt=""
                        className="absolute inset-0 w-full h-full object-cover"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center bg-[#1D2A3F]">
                        <Image
                          src="/lta-logo.png"
                          alt="LTA"
                          width={80}
                          height={80}
                          className="opacity-40"
                        />
                      </div>
                    )}
                  </div>

                  <div className="p-6 flex flex-col flex-1 min-h-0">
                    {/* Date */}
                    <p className="text-navy font-bold text-sm mb-2">
                      {isPlaceholder ? event.date : formatEventDate(event.date)}
                    </p>

                    {/* Event name */}
                    <h3 className="font-serif text-xl font-bold text-navy mb-1">
                      {event.name}
                    </h3>

                    {/* Location */}
                    <p className="text-gray-500 text-sm mb-3">{event.location}</p>

                    {/* Member Exclusive badge */}
                    {event.membersOnly && (
                      <span className="inline-block px-2.5 py-0.5 rounded text-xs font-medium bg-[#00BFFF] text-white mb-3 w-fit">
                        Member Exclusive
                      </span>
                    )}

                    {/* Description - full, no truncation */}
                    <p className="text-gray-600 text-sm flex-1 mb-4">{event.description}</p>

                    {/* RSVP button */}
                    {event.rsvpUrl ? (
                      <Link
                        href={event.rsvpUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block w-full py-3 rounded-lg bg-navy text-white font-medium hover:bg-navy/90 transition-colors text-center"
                      >
                        RSVP
                      </Link>
                    ) : (
                      <button
                        type="button"
                        disabled
                        className="w-full py-3 rounded-lg bg-gray-300 text-gray-500 font-medium cursor-not-allowed"
                      >
                        RSVP Coming Soon
                      </button>
                    )}
                  </div>
                </motion.article>
              </SectionReveal>
            ))
          )}
        </div>

        <SectionReveal>
          <p className="text-sm font-medium text-gray-600 mt-10 mb-3 text-center">Event Types</p>
          <div className="flex flex-wrap gap-3 justify-center">
            {eventPills.map((pill) => (
              <span
                key={pill}
                className="px-4 py-2 rounded-full bg-gray-100 text-gray-700 text-sm font-medium"
              >
                {pill}
              </span>
            ))}
          </div>
        </SectionReveal>
      </div>
    </section>
  );
}
