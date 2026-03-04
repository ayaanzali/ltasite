"use client";

import { useState } from "react";
import Link from "next/link";
import { Footer } from "@/components/Footer";

const YEAR_OPTIONS = ["Freshman", "Sophomore", "Junior", "Senior", "Graduate Student"];
const PRELAW_OPTIONS = ["Yes", "No", "Undecided"] as const;
const TEAM_OPTIONS = ["Events Team", "Marketing Team", "Outreach Team", "Media Team", "Fundraising Team"];
const OFFICER_OPTIONS = [
  "President", "Vice President", "Executive Director", "Secretary", "Treasurer",
  "Programming Director", "Marketing Director", "Media Director", "Events Director",
  "Fundraising Director", "Outreach Director", "Growth Director", "Not Sure Yet",
];

const MAX_WORDS = 300;
const MAX_FILE_BYTES = 5 * 1024 * 1024; // 5MB

function wordCount(text: string): number {
  return text.trim() ? text.trim().split(/\s+/).length : 0;
}

export default function AmbassadorsPage() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [emailError, setEmailError] = useState("");
  const [resumeError, setResumeError] = useState("");
  const [wordErrors, setWordErrors] = useState<Record<string, string>>({});
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    utdEmail: "",
    phone: "",
    major: "",
    yearInSchool: "",
    linkedinUrl: "",
    resume: null as File | null,
    preLaw: "" as "" | "Yes" | "No" | "Undecided",
    availability: "",
    ambassadorTeam: "",
    whyJoin: "",
    howContribute: "",
    skillsExperience: "",
    officerInterest: "",
    officerRole: "",
  });

  const validateUtdEmail = (value: string) => {
    if (!value) return "Required";
    if (!value.trim().toLowerCase().endsWith("@utdallas.edu")) {
      return "Email must end in @utdallas.edu";
    }
    return "";
  };

  const validateResume = (file: File | null) => {
    if (!file) return "Resume (PDF) is required";
    if (file.type !== "application/pdf") return "Only PDF files are accepted";
    if (file.size > MAX_FILE_BYTES) return "File must be 5MB or smaller";
    return "";
  };

  const validateWords = (text: string, field: string) => {
    const count = wordCount(text);
    if (count > MAX_WORDS) return `Maximum ${MAX_WORDS} words (currently ${count})`;
    return "";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const emailErr = validateUtdEmail(formData.utdEmail);
    const resumeErr = validateResume(formData.resume);
    setEmailError(emailErr);
    setResumeError(resumeErr);
    const textFields = {
      whyJoin: formData.whyJoin,
      howContribute: formData.howContribute,
      skillsExperience: formData.skillsExperience,
      officerInterest: formData.officerInterest,
    };
    const wErrors: Record<string, string> = {};
    for (const [key, value] of Object.entries(textFields)) {
      const err = validateWords(value, key);
      if (err) wErrors[key] = err;
    }
    setWordErrors(wErrors);
    if (emailErr || resumeErr || Object.keys(wErrors).length > 0) return;

    setStatus("loading");
    try {
      const body = new FormData();
      body.append("firstName", formData.firstName.trim());
      body.append("lastName", formData.lastName.trim());
      body.append("utdEmail", formData.utdEmail.trim().toLowerCase());
      body.append("phone", formData.phone.trim());
      body.append("major", formData.major.trim());
      body.append("yearInSchool", formData.yearInSchool);
      body.append("linkedinUrl", formData.linkedinUrl.trim());
      body.append("preLaw", formData.preLaw);
      body.append("availability", formData.availability.trim());
      body.append("ambassadorTeam", formData.ambassadorTeam);
      body.append("whyJoin", formData.whyJoin.trim());
      body.append("howContribute", formData.howContribute.trim());
      body.append("skillsExperience", formData.skillsExperience.trim());
      body.append("officerInterest", formData.officerInterest.trim());
      body.append("officerRole", formData.officerRole);
      if (formData.resume) body.append("resume", formData.resume);

      const res = await fetch("/api/ambassadors/apply", {
        method: "POST",
        body,
      });
      if (res.ok) {
        setStatus("success");
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  };

  const inputClass =
    "w-full bg-white px-4 py-3 rounded-lg border border-[#E2E0DB] text-[#1D2A3F] placeholder-gray-400 focus:border-[#2D5BE3] focus:ring-1 focus:ring-[#2D5BE3] outline-none";
  const labelClass = "block text-sm font-medium text-[#1D2A3F] mb-1";

  return (
    <main className="min-h-screen bg-[#F4F1EC]">
      <div className="max-w-2xl mx-auto py-16 px-4 md:px-8 lg:px-12 xl:px-16">
        <p className="mb-6">
          <Link href="/" className="font-inter text-sm text-[#1D2A3F] hover:underline">
            ← Back to home
          </Link>
        </p>
        <h1 className="font-playfair text-3xl sm:text-4xl font-bold text-[#1D2A3F] mb-3 text-center">
          Become an LTA Ambassador
        </h1>
        <p className="text-[#1D2A3F]/90 text-center mb-10">
          Applications are reviewed within 1–2 weeks. We&apos;ll reach out to schedule an interview if you&apos;re a fit.
        </p>

        {status === "success" ? (
          <div className="bg-white border border-[#E2E0DB] rounded-xl p-10 shadow-sm text-center">
            <p className="text-[#1D2A3F] text-lg font-medium">
              Your application has been submitted. We&apos;ll be in touch within 1–2 weeks.
            </p>
            <Link href="/" className="inline-block mt-6 text-[#2D5BE3] font-medium hover:underline">
              ← Back to home
            </Link>
          </div>
        ) : (
          <div className="bg-white border border-[#E2E0DB] rounded-xl p-8 shadow-sm">
            <form onSubmit={handleSubmit} className="space-y-5" noValidate>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="amb-first" className={labelClass}>First Name</label>
                  <input
                    id="amb-first"
                    type="text"
                    required
                    value={formData.firstName}
                    onChange={(e) => setFormData((d) => ({ ...d, firstName: e.target.value }))}
                    className={inputClass}
                    placeholder="First name"
                  />
                </div>
                <div>
                  <label htmlFor="amb-last" className={labelClass}>Last Name</label>
                  <input
                    id="amb-last"
                    type="text"
                    required
                    value={formData.lastName}
                    onChange={(e) => setFormData((d) => ({ ...d, lastName: e.target.value }))}
                    className={inputClass}
                    placeholder="Last name"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="amb-email" className={labelClass}>UTD Email</label>
                <input
                  id="amb-email"
                  type="email"
                  required
                  value={formData.utdEmail}
                  onChange={(e) => {
                    setFormData((d) => ({ ...d, utdEmail: e.target.value }));
                    setEmailError(validateUtdEmail(e.target.value));
                  }}
                  onBlur={(e) => setEmailError(validateUtdEmail(e.target.value))}
                  className={inputClass}
                  placeholder="your@utdallas.edu"
                />
                {emailError && <p className="text-red-600 text-sm mt-1">{emailError}</p>}
              </div>

              <div>
                <label htmlFor="amb-phone" className={labelClass}>Phone Number</label>
                <input
                  id="amb-phone"
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData((d) => ({ ...d, phone: e.target.value }))}
                  className={inputClass}
                  placeholder="(555) 000-0000"
                />
              </div>

              <div>
                <label htmlFor="amb-major" className={labelClass}>Major</label>
                <input
                  id="amb-major"
                  type="text"
                  required
                  value={formData.major}
                  onChange={(e) => setFormData((d) => ({ ...d, major: e.target.value }))}
                  className={inputClass}
                  placeholder="e.g. Political Science"
                />
              </div>

              <div>
                <label htmlFor="amb-year" className={labelClass}>Year in School</label>
                <select
                  id="amb-year"
                  required
                  value={formData.yearInSchool}
                  onChange={(e) => setFormData((d) => ({ ...d, yearInSchool: e.target.value }))}
                  className={inputClass}
                >
                  <option value="">Select</option>
                  {YEAR_OPTIONS.map((y) => (
                    <option key={y} value={y}>{y}</option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="amb-linkedin" className={labelClass}>LinkedIn URL</label>
                <input
                  id="amb-linkedin"
                  type="url"
                  required
                  value={formData.linkedinUrl}
                  onChange={(e) => setFormData((d) => ({ ...d, linkedinUrl: e.target.value }))}
                  className={inputClass}
                  placeholder="https://linkedin.com/in/yourname"
                />
              </div>

              <div>
                <label htmlFor="amb-resume" className={labelClass}>Resume (PDF, max 5MB)</label>
                <input
                  id="amb-resume"
                  type="file"
                  accept=".pdf,application/pdf"
                  required
                  onChange={(e) => {
                    const file = e.target.files?.[0] ?? null;
                    setFormData((d) => ({ ...d, resume: file }));
                    setResumeError(validateResume(file));
                  }}
                  className={inputClass}
                />
                {resumeError && <p className="text-red-600 text-sm mt-1">{resumeError}</p>}
              </div>

              <div>
                <span className={labelClass}>Are you pre law?</span>
                <div className="flex gap-6 flex-wrap">
                  {PRELAW_OPTIONS.map((opt) => (
                    <label key={opt} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="preLaw"
                        required
                        checked={formData.preLaw === opt}
                        onChange={() => setFormData((d) => ({ ...d, preLaw: opt }))}
                        className="text-[#2D5BE3] focus:ring-[#2D5BE3]"
                      />
                      <span className="text-[#1D2A3F]">{opt}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label htmlFor="amb-availability" className={labelClass}>
                  Availability
                </label>
                <p className="text-sm text-gray-500 mb-1">What hours during the week are you generally free for meetings?</p>
                <textarea
                  id="amb-availability"
                  value={formData.availability}
                  onChange={(e) => setFormData((d) => ({ ...d, availability: e.target.value }))}
                  placeholder="e.g. Weekday evenings after 6pm, Saturday mornings..."
                  rows={4}
                  className={inputClass}
                />
              </div>

              <div>
                <label htmlFor="amb-team" className={labelClass}>Which ambassador team interests you most?</label>
                <select
                  id="amb-team"
                  required
                  value={formData.ambassadorTeam}
                  onChange={(e) => setFormData((d) => ({ ...d, ambassadorTeam: e.target.value }))}
                  className={inputClass}
                >
                  <option value="">Select</option>
                  {TEAM_OPTIONS.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="amb-why" className={labelClass}>Why do you want to join LTA? (max {MAX_WORDS} words)</label>
                <textarea
                  id="amb-why"
                  required
                  rows={4}
                  value={formData.whyJoin}
                  onChange={(e) => {
                    setFormData((d) => ({ ...d, whyJoin: e.target.value }));
                    setWordErrors((prev) => ({ ...prev, whyJoin: validateWords(e.target.value, "whyJoin") }));
                  }}
                  onBlur={(e) => setWordErrors((prev) => ({ ...prev, whyJoin: validateWords(e.target.value, "whyJoin") }))}
                  className={inputClass}
                  placeholder="Your answer..."
                />
                <p className="text-gray-500 text-sm mt-1">{wordCount(formData.whyJoin)} / {MAX_WORDS} words</p>
                {wordErrors.whyJoin && <p className="text-red-600 text-sm mt-1">{wordErrors.whyJoin}</p>}
              </div>

              <div>
                <label htmlFor="amb-contribute" className={labelClass}>How could you contribute to LTA as an ambassador? (max {MAX_WORDS} words)</label>
                <textarea
                  id="amb-contribute"
                  required
                  rows={4}
                  value={formData.howContribute}
                  onChange={(e) => {
                    setFormData((d) => ({ ...d, howContribute: e.target.value }));
                    setWordErrors((prev) => ({ ...prev, howContribute: validateWords(e.target.value, "howContribute") }));
                  }}
                  onBlur={(e) => setWordErrors((prev) => ({ ...prev, howContribute: validateWords(e.target.value, "howContribute") }))}
                  className={inputClass}
                  placeholder="Your answer..."
                />
                <p className="text-gray-500 text-sm mt-1">{wordCount(formData.howContribute)} / {MAX_WORDS} words</p>
                {wordErrors.howContribute && <p className="text-red-600 text-sm mt-1">{wordErrors.howContribute}</p>}
              </div>

              <div>
                <label htmlFor="amb-skills" className={labelClass}>Describe any relevant skills or experience and how you would apply them to LTA. (max {MAX_WORDS} words)</label>
                <textarea
                  id="amb-skills"
                  required
                  rows={4}
                  value={formData.skillsExperience}
                  onChange={(e) => {
                    setFormData((d) => ({ ...d, skillsExperience: e.target.value }));
                    setWordErrors((prev) => ({ ...prev, skillsExperience: validateWords(e.target.value, "skillsExperience") }));
                  }}
                  onBlur={(e) => setWordErrors((prev) => ({ ...prev, skillsExperience: validateWords(e.target.value, "skillsExperience") }))}
                  className={inputClass}
                  placeholder="Your answer..."
                />
                <p className="text-gray-500 text-sm mt-1">{wordCount(formData.skillsExperience)} / {MAX_WORDS} words</p>
                {wordErrors.skillsExperience && <p className="text-red-600 text-sm mt-1">{wordErrors.skillsExperience}</p>}
              </div>

              <div>
                <label htmlFor="amb-officer-interest" className={labelClass}>If you were interested in an LTA officer position in the future, which role would it be and why? (max {MAX_WORDS} words)</label>
                <textarea
                  id="amb-officer-interest"
                  required
                  rows={4}
                  value={formData.officerInterest}
                  onChange={(e) => {
                    setFormData((d) => ({ ...d, officerInterest: e.target.value }));
                    setWordErrors((prev) => ({ ...prev, officerInterest: validateWords(e.target.value, "officerInterest") }));
                  }}
                  onBlur={(e) => setWordErrors((prev) => ({ ...prev, officerInterest: validateWords(e.target.value, "officerInterest") }))}
                  className={inputClass}
                  placeholder="Your answer..."
                />
                <p className="text-gray-500 text-sm mt-1">{wordCount(formData.officerInterest)} / {MAX_WORDS} words</p>
                {wordErrors.officerInterest && <p className="text-red-600 text-sm mt-1">{wordErrors.officerInterest}</p>}
              </div>

              <div>
                <label htmlFor="amb-officer-role" className={labelClass}>If interested in a specific officer role, which one?</label>
                <select
                  id="amb-officer-role"
                  value={formData.officerRole}
                  onChange={(e) => setFormData((d) => ({ ...d, officerRole: e.target.value }))}
                  className={inputClass}
                >
                  <option value="">Select</option>
                  {OFFICER_OPTIONS.map((r) => (
                    <option key={r} value={r}>{r}</option>
                  ))}
                </select>
              </div>

              {status === "error" && (
                <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3">
                  <p className="text-red-700 text-sm font-medium">Something went wrong. Please try again.</p>
                </div>
              )}

              <button
                type="submit"
                disabled={status === "loading"}
                className="w-full py-3.5 rounded-lg bg-[#1D2A3F] text-white font-medium hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {status === "loading" ? "Submitting…" : "Submit Application"}
              </button>
            </form>
          </div>
        )}
      </div>
      <Footer />
    </main>
  );
}
