"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";

type Member = {
  id: string;
  name: string;
  major: string;
  gradYear: string;
  linkedinUrl: string;
  imageUrl?: string;
};

export function MembersContent() {
  const [members, setMembers] = useState<Member[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetch("/api/members")
      .then((res) => res.json())
      .then((data) => setMembers(Array.isArray(data) ? data : []))
      .catch(() => setMembers([]));
  }, []);

  const filtered = useMemo(() => {
    if (!search.trim()) return members;
    const q = search.trim().toLowerCase();
    return members.filter(
      (m) =>
        m.name.toLowerCase().includes(q) || m.major.toLowerCase().includes(q)
    );
  }, [members, search]);

  return (
    <main className="min-h-screen bg-[#F4F1EC]">
      <div className="max-w-3xl mx-auto px-6 py-8">
        <h1 className="font-playfair text-2xl sm:text-3xl font-bold text-[#1D2A3F] mb-2">
          LTA Member Directory
        </h1>
        <p className="text-gray-600 mb-6">Connect with fellow LTA members</p>

        <input
          type="search"
          placeholder="Search by name or major"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-white px-4 py-3 rounded-lg border border-[#E2E0DB] text-[#1D2A3F] placeholder-gray-400 focus:border-[#2D5BE3] focus:ring-1 focus:ring-[#2D5BE3] outline-none mb-8"
        />

        <div className="bg-white rounded-xl border border-[#E2E0DB] overflow-hidden">
          {filtered.length === 0 ? (
            <p className="py-8 text-center text-gray-500">No members to show</p>
          ) : (
            filtered.map((member, i) => (
              <div
                key={member.id}
                className={`flex items-center gap-4 p-4 ${
                  i > 0 ? "border-t border-[#E2E0DB]" : ""
                }`}
              >
                <div className="w-10 h-10 rounded-full bg-gray-200 shrink-0 overflow-hidden">
                  {member.imageUrl ? (
                    <img
                      src={member.imageUrl}
                      alt=""
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  ) : null}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-inter font-semibold text-[#1D2A3F]">
                    {member.name}
                  </p>
                  <p className="text-sm text-gray-500">
                    {[member.major, member.gradYear].filter(Boolean).join(" · ") || "—"}
                  </p>
                </div>
                {member.linkedinUrl ? (
                  <a
                    href={member.linkedinUrl.startsWith("http") ? member.linkedinUrl : `https://${member.linkedinUrl}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-lg text-[#0A66C2] hover:bg-[#0A66C2]/10 transition-colors shrink-0"
                    aria-label="LinkedIn"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                      aria-hidden
                    >
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                    </svg>
                  </a>
                ) : (
                  <span className="w-9 h-9 shrink-0" />
                )}
              </div>
            ))
          )}
        </div>

        <p className="mt-6 text-center">
          <Link href="/" className="font-inter text-sm text-[#1D2A3F] hover:underline">
            ← Back to home
          </Link>
        </p>
      </div>
    </main>
  );
}
