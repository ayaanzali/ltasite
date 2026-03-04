import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Logo } from "@/components/Logo";

export default async function PendingPage() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");
  return (
    <main className="min-h-screen bg-[#1D2A3F] flex flex-col items-center justify-center px-6 py-12">
      <Logo
        width={80}
        height={80}
        className="object-contain mb-8"
      />
      <p className="text-white text-center max-w-md text-lg leading-relaxed">
        Your membership is pending approval. Once your dues are confirmed you
        will receive access. Questions? Email{" "}
        <a
          href="mailto:lta.utd@gmail.com"
          className="text-white underline hover:no-underline"
        >
          lta.utd@gmail.com
        </a>
      </p>
      <Link
        href="/"
        className="mt-10 font-inter text-sm text-white/90 hover:text-white underline"
      >
        ← Back to home
      </Link>
    </main>
  );
}
