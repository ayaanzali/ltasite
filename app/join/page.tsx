"use client";

import { useState } from "react";
import Link from "next/link";
import { Check } from "lucide-react";

const YEAR_OPTIONS = ["Freshman", "Sophomore", "Junior", "Senior", "Graduate"];
const PURSUING_OPTIONS = ["Pre Law", "Law School Applicant", "Just Exploring", "Other"];
const HOW_HEAR_OPTIONS = ["Instagram", "Friend", "Class", "Class visit", "Tabling", "UTD Website", "Other"];

export default function JoinPage() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [emailError, setEmailError] = useState("");
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    major: "",
    year: "",
    anticipatedGraduation: "",
    pursuing: "",
    mockTrialInterest: "",
    howDidYouHear: "",
    linkedinUrl: "",
  });

  const validateEmail = (value: string) => {
    if (!value) return "";
    if (!value.toLowerCase().endsWith("@utdallas.edu")) {
      return "Email must be a UTD email (@utdallas.edu)";
    }
    return "";
  };

  const handleSubmit = async (e?: React.FormEvent<HTMLFormElement> | React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    const err = validateEmail(formData.email);
    if (err) {
      setEmailError(err);
      return;
    }
    setEmailError("");
    setStatus("loading");
    const payload = {
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      phone: formData.phone,
      major: formData.major,
      year: formData.year,
      anticipatedGraduation: formData.anticipatedGraduation,
      pursuing: formData.pursuing,
      mockTrialInterest: formData.mockTrialInterest,
      howDidYouHear: formData.howDidYouHear,
      linkedinUrl: formData.linkedinUrl,
    };
    console.log("--- SUBMITTING TO AIRTABLE ---", payload);
    try {
      const res = await fetch("/api/join", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (res.ok && !data.error) {
        setStatus("success");
        setFormData({
          firstName: "",
          lastName: "",
          email: "",
          phone: "",
          major: "",
          year: "",
          anticipatedGraduation: "",
          pursuing: "",
          mockTrialInterest: "",
          howDidYouHear: "",
          linkedinUrl: "",
        });
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  };

  return (
    <main className="min-h-screen bg-[#F4F1EC] py-16 px-6">
      <div className="max-w-xl mx-auto text-center">
        <h1 className="font-playfair text-3xl sm:text-4xl font-bold text-[#1D2A3F] mb-3">
          Become a Member
        </h1>
        <p className="text-[#1D2A3F] text-lg mb-10">
          The legal world runs on relationships. Join LTA to build yours before law school.
        </p>

        {status === "success" ? (
          <div className="bg-[#F4F1EC] text-[#1D2A3F] rounded-xl p-10 flex flex-col items-center text-center border border-[#E2E0DB] shadow-sm">
            <div className="w-14 h-14 rounded-full bg-[#1D2A3F]/10 flex items-center justify-center mb-6">
              <Check className="w-8 h-8 text-[#1D2A3F]" strokeWidth={2} />
            </div>
            <h2 className="font-serif text-2xl font-bold mb-2">Welcome to LTA!</h2>
            <p className="text-[#1D2A3F]/90 mb-6">Check your email for next steps.</p>
            <Link
              href="/#get-involved"
              className="text-[#1D2A3F] font-medium underline hover:no-underline hover:text-[#2D5BE3]"
            >
              ← Back to Join section
            </Link>
          </div>
        ) : (
          <div className="bg-[#F4F1EC] border border-[#E2E0DB] rounded-xl p-8 shadow-sm text-left">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                e.stopPropagation();
                void handleSubmit();
              }}
              className="space-y-5"
              noValidate
            >
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="join-first" className="block text-sm font-medium text-[#1D2A3F] mb-1">
                    First name
                  </label>
                  <input
                    id="join-first"
                    type="text"
                    required
                    value={formData.firstName}
                    onChange={(e) => setFormData((d) => ({ ...d, firstName: e.target.value }))}
                    className="w-full bg-white px-4 py-3 rounded-lg border border-[#E2E0DB] text-[#1D2A3F] placeholder-gray-400 focus:border-[#2D5BE3] focus:ring-1 focus:ring-[#2D5BE3] outline-none"
                    placeholder="First name"
                  />
                </div>
                <div>
                  <label htmlFor="join-last" className="block text-sm font-medium text-[#1D2A3F] mb-1">
                    Last name
                  </label>
                  <input
                    id="join-last"
                    type="text"
                    required
                    value={formData.lastName}
                    onChange={(e) => setFormData((d) => ({ ...d, lastName: e.target.value }))}
                    className="w-full bg-white px-4 py-3 rounded-lg border border-[#E2E0DB] text-[#1D2A3F] placeholder-gray-400 focus:border-[#2D5BE3] focus:ring-1 focus:ring-[#2D5BE3] outline-none"
                    placeholder="Last name"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="join-email" className="block text-sm font-medium text-[#1D2A3F] mb-1">
                  UTD Email
                </label>
                <input
                  id="join-email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => {
                    setFormData((d) => ({ ...d, email: e.target.value }));
                    setEmailError(validateEmail(e.target.value));
                  }}
                  onBlur={(e) => setEmailError(validateEmail(e.target.value))}
                  className="w-full bg-white px-4 py-3 rounded-lg border border-[#E2E0DB] text-[#1D2A3F] placeholder-gray-400 focus:border-[#2D5BE3] focus:ring-1 focus:ring-[#2D5BE3] outline-none"
                  placeholder="your@utdallas.edu"
                />
                {emailError && <p className="text-red-600 text-sm mt-1">{emailError}</p>}
              </div>

              <div>
                <label htmlFor="join-phone" className="block text-sm font-medium text-[#1D2A3F] mb-1">
                  Phone number
                </label>
                <input
                  id="join-phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData((d) => ({ ...d, phone: e.target.value }))}
                  className="w-full bg-white px-4 py-3 rounded-lg border border-[#E2E0DB] text-[#1D2A3F] focus:border-[#2D5BE3] focus:ring-1 focus:ring-[#2D5BE3] outline-none"
                  placeholder="(555) 000-0000"
                />
              </div>

              <div>
                <label htmlFor="join-major" className="block text-sm font-medium text-[#1D2A3F] mb-1">
                  Major
                </label>
                <input
                  id="join-major"
                  type="text"
                  value={formData.major}
                  onChange={(e) => setFormData((d) => ({ ...d, major: e.target.value }))}
                  className="w-full bg-white px-4 py-3 rounded-lg border border-[#E2E0DB] text-[#1D2A3F] focus:border-[#2D5BE3] focus:ring-1 focus:ring-[#2D5BE3] outline-none"
                  placeholder="e.g. Political Science"
                />
              </div>

              <div>
                <label htmlFor="join-year" className="block text-sm font-medium text-[#1D2A3F] mb-1">
                  Year
                </label>
                <select
                  id="join-year"
                  value={formData.year}
                  onChange={(e) => setFormData((d) => ({ ...d, year: e.target.value }))}
                  className="w-full bg-white px-4 py-3 rounded-lg border border-[#E2E0DB] text-[#1D2A3F] focus:border-[#2D5BE3] focus:ring-1 focus:ring-[#2D5BE3] outline-none"
                >
                  <option value="">Select year</option>
                  {YEAR_OPTIONS.map((y) => (
                    <option key={y} value={y}>{y}</option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="join-grad" className="block text-sm font-medium text-[#1D2A3F] mb-1">
                  Anticipated Graduation (Month/Year)
                </label>
                <input
                  id="join-grad"
                  type="text"
                  value={formData.anticipatedGraduation}
                  onChange={(e) => setFormData((d) => ({ ...d, anticipatedGraduation: e.target.value }))}
                  className="w-full bg-white px-4 py-3 rounded-lg border border-[#E2E0DB] text-[#1D2A3F] focus:border-[#2D5BE3] focus:ring-1 focus:ring-[#2D5BE3] outline-none"
                  placeholder="e.g. May 2027"
                />
              </div>

              <div>
                <label htmlFor="join-pursuing" className="block text-sm font-medium text-[#1D2A3F] mb-1">
                  Which are you pursuing?
                </label>
                <select
                  id="join-pursuing"
                  value={formData.pursuing}
                  onChange={(e) => setFormData((d) => ({ ...d, pursuing: e.target.value }))}
                  className="w-full bg-white px-4 py-3 rounded-lg border border-[#E2E0DB] text-[#1D2A3F] focus:border-[#2D5BE3] focus:ring-1 focus:ring-[#2D5BE3] outline-none"
                >
                  <option value="">Select</option>
                  {PURSUING_OPTIONS.map((o) => (
                    <option key={o} value={o}>{o}</option>
                  ))}
                </select>
              </div>

              <div>
                <span className="block text-sm font-medium text-[#1D2A3F] mb-2">
                  Are you interested in competing in mock trial?
                </span>
                <div className="flex gap-6">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="mockTrial"
                      checked={formData.mockTrialInterest === "Yes"}
                      onChange={() => setFormData((d) => ({ ...d, mockTrialInterest: "Yes" }))}
                      className="text-[#2D5BE3] focus:ring-[#2D5BE3]"
                    />
                    <span className="text-[#1D2A3F]">Yes</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="mockTrial"
                      checked={formData.mockTrialInterest === "No"}
                      onChange={() => setFormData((d) => ({ ...d, mockTrialInterest: "No" }))}
                      className="text-[#2D5BE3] focus:ring-[#2D5BE3]"
                    />
                    <span className="text-[#1D2A3F]">No</span>
                  </label>
                </div>
              </div>

              <div>
                <label htmlFor="join-hear" className="block text-sm font-medium text-[#1D2A3F] mb-1">
                  How did you hear about LTA?
                </label>
                <select
                  id="join-hear"
                  value={formData.howDidYouHear}
                  onChange={(e) => setFormData((d) => ({ ...d, howDidYouHear: e.target.value }))}
                  className="w-full bg-white px-4 py-3 rounded-lg border border-[#E2E0DB] text-[#1D2A3F] focus:border-[#2D5BE3] focus:ring-1 focus:ring-[#2D5BE3] outline-none"
                >
                  <option value="">Select</option>
                  {HOW_HEAR_OPTIONS.map((o) => (
                    <option key={o} value={o}>{o}</option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="join-linkedin" className="block text-sm font-medium text-[#1D2A3F] mb-1">
                  LinkedIn URL
                </label>
                <input
                  id="join-linkedin"
                  type="url"
                  value={formData.linkedinUrl}
                  onChange={(e) => setFormData((d) => ({ ...d, linkedinUrl: e.target.value }))}
                  className="w-full bg-white px-4 py-3 rounded-lg border border-[#E2E0DB] text-[#1D2A3F] placeholder-gray-400 focus:border-[#2D5BE3] focus:ring-1 focus:ring-[#2D5BE3] outline-none"
                  placeholder="linkedin.com/in/yourname"
                />
              </div>

              {status === "error" && (
                <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3">
                  <p className="text-red-700 text-sm font-medium">Something went wrong. Please try again.</p>
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-3 items-center justify-center">
                <button
                  type="button"
                  disabled={status === "loading"}
                  onClick={() => void handleSubmit()}
                  className="w-full sm:w-auto px-8 py-3.5 rounded-lg bg-[#1D2A3F] text-white font-medium hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {status === "loading" ? "Sending…" : "Submit"}
                </button>
                <Link
                  href="/#get-involved"
                  className="text-[#1D2A3F] font-medium text-sm hover:text-[#2D5BE3] transition-colors underline hover:no-underline"
                >
                  ← Back to Join section
                </Link>
              </div>
              <p className="text-gray-600 text-sm text-center">
                Membership is open to all UTD students.
              </p>
            </form>
          </div>
        )}
      </div>
    </main>
  );
}
