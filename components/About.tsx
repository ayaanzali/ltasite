"use client";

import { useState } from "react";
import { SectionReveal } from "./SectionReveal";

const stats = [
  { value: "Est. 2025", label: "" },
  { value: "3+", label: "Events Per Semester" },
];

export function About() {
  const [firstName, setFirstName] = useState("");
  const [email, setEmail] = useState("");
  const [notifyStatus, setNotifyStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");

  const submitNotify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (notifyStatus === "loading" || notifyStatus === "success") return;
    setNotifyStatus("loading");
    try {
      const res = await fetch("/api/notify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ firstName, email }),
      });
      const text = await res.text();
      let data: { success?: boolean; error?: string } = {};
      try {
        data = text ? JSON.parse(text) : {};
      } catch {
        // Server returned non-JSON (e.g. HTML 404/500) — often after wrong port or restart
        setNotifyStatus("error");
        return;
      }
      if (res.ok && data?.success) {
        setNotifyStatus("success");
      } else {
        setNotifyStatus("error");
      }
    } catch {
      setNotifyStatus("error");
    }
  };

  return (
    <section id="about" className="py-24 bg-[#F4F1EC] w-full relative">
      <div className="w-full max-w-7xl mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Left column: existing About content */}
          <div>
            <SectionReveal>
              <p className="text-blue text-xs font-bold tracking-widest uppercase mb-2">
                WHO WE ARE
              </p>
              <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-navy mb-6">
                Developing Legal Minds at UT Dallas
              </h2>
              <p className="text-gray-600 max-w-3xl text-lg mb-4">
                Founded in 2025, the Law & Trial Association at UT Dallas gives students a genuine first look into the legal world. We believe the best way to understand law is to practice it, so we put students in the courtroom, on their feet, building arguments from day one.
              </p>
              <p className="text-gray-600 max-w-3xl text-lg mb-4">
                From our Intramural Mock Trial Competition, the first of its kind at UTD, bringing together college students as attorneys and high school students as witnesses, to intimate lawyer panels and LSAT prep workshops, everything we do is designed to give you real experience before law school.
              </p>
              <p className="text-gray-600 max-w-3xl text-lg mb-8">
                Whether you are pre law, just curious, or want to sharpen your critical thinking and public speaking, LTA is built for you.
              </p>
              <div className="flex flex-wrap gap-8">
                {stats.map((stat) => (
                  <div key={stat.label || stat.value}>
                    <span className="font-semibold text-navy text-lg">{stat.value}</span>
                    {stat.label && (
                      <span className="text-gray-600 text-sm ml-1">{stat.label}</span>
                    )}
                  </div>
                ))}
              </div>
            </SectionReveal>
          </div>

          {/* Right column: signup box */}
          <div>
            <SectionReveal delay={0.05}>
              <div className="bg-[#F7F3EE] shadow-sm rounded-xl p-8 border border-[#E2E0DB]">
                <p className="text-[#1D2A3F] text-xs font-semibold tracking-widest uppercase mb-2">
                  STAY IN THE LOOP
                </p>
                <h3 className="text-navy font-semibold text-2xl mb-2">
                  Get LTA Updates
                </h3>
                <p className="text-gray-600 mb-6">
                  Be the first to know about events, competitions, and opportunities.
                </p>

                <form onSubmit={submitNotify} className="space-y-4">
                  <input
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="First Name"
                    className="w-full bg-[#F4F1EC] border border-[#E2E0DB] rounded-lg px-4 py-3 outline-none focus:ring-1 focus:ring-[#2D5BE3] focus:border-[#2D5BE3]"
                    disabled={notifyStatus === "success"}
                  />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@utdallas.edu"
                    className="w-full bg-[#F4F1EC] border border-[#E2E0DB] rounded-lg px-4 py-3 outline-none focus:ring-1 focus:ring-[#2D5BE3] focus:border-[#2D5BE3]"
                    disabled={notifyStatus === "success"}
                  />

                  <button
                    type="submit"
                    disabled={notifyStatus === "loading" || notifyStatus === "success"}
                    className={`w-full rounded-lg py-3 font-medium text-white transition-colors ${
                      notifyStatus === "success"
                        ? "bg-green-600"
                        : "bg-[#1D2A3F] hover:bg-[#2A3A52]"
                    } disabled:opacity-80`}
                  >
                    {notifyStatus === "success"
                      ? "You are on the list!"
                      : notifyStatus === "loading"
                        ? "Submitting…"
                        : "Notify Me"}
                  </button>

                  {notifyStatus === "error" && (
                    <p className="text-sm text-red-600">
                      Something went wrong. Please try again.
                    </p>
                  )}
                </form>
              </div>
            </SectionReveal>
          </div>
        </div>
      </div>
    </section>
  );
}
