"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function VerifyMembershipPage() {
  const { userId, isLoaded } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoaded && !userId) router.replace("/sign-in");
  }, [isLoaded, userId, router]);
  const [utdEmail, setUtdEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "error" | "success">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId || !utdEmail.trim()) return;
    setStatus("loading");
    setErrorMessage("");
    try {
      const res = await fetch("/api/verify-membership", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ utdEmail: utdEmail.trim(), clerkUserId: userId }),
      });
      const data = await res.json();
      if (res.ok && data?.success) {
        router.push("/members");
        return;
      }
      setStatus("error");
      setErrorMessage(
        data?.error === "No approved membership found for that email"
          ? "No approved membership found. Make sure you used your UTD email from the join form, or contact lta.utd@gmail.com"
          : data?.error ?? "Something went wrong. Please try again."
      );
    } catch {
      setStatus("error");
      setErrorMessage("Something went wrong. Please try again.");
    }
  };

  if (!userId) return null;

  return (
    <main className="min-h-screen bg-[#F4F1EC] flex flex-col items-center justify-center px-6 py-12">
      <div className="w-full max-w-md">
        <h1 className="font-playfair text-2xl font-bold text-[#1D2A3F] text-center mb-2">
          Verify your membership
        </h1>
        <p className="text-gray-600 text-center mb-8">
          Enter the UTD email you used on the join form.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            required
            value={utdEmail}
            onChange={(e) => setUtdEmail(e.target.value)}
            placeholder="your@utdallas.edu"
            disabled={status === "loading"}
            className="w-full bg-white px-4 py-3 rounded-lg border border-[#E2E0DB] text-[#1D2A3F] placeholder-gray-400 focus:border-[#2D5BE3] focus:ring-1 focus:ring-[#2D5BE3] outline-none"
          />
          <button
            type="submit"
            disabled={status === "loading"}
            className="w-full py-3 rounded-lg font-medium text-white bg-[#1D2A3F] hover:bg-[#2A3A52] transition-colors disabled:opacity-70"
          >
            {status === "loading" ? "Verifying…" : "Verify"}
          </button>
        </form>

        {status === "error" && errorMessage && (
          <p className="mt-4 text-sm text-red-600 text-center">{errorMessage}</p>
        )}

        <p className="mt-8 text-center">
          <Link href="/" className="font-inter text-sm text-[#1D2A3F] hover:underline">
            ← Back to home
          </Link>
        </p>
      </div>
    </main>
  );
}
