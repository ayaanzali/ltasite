import Link from "next/link";
import Image from "next/image";

export default function PendingPage() {
  return (
    <main className="min-h-screen bg-[#1D2A3F] flex flex-col items-center justify-center px-6 py-12">
      <Image
        src="/lta-logo.png"
        alt="LTA"
        width={80}
        height={80}
        className="object-contain mb-8"
      />
      <p className="text-white text-center max-w-md text-lg leading-relaxed">
        Your membership is pending approval. Once your dues are confirmed you
        will receive access. Questions? Email{" "}
        <a
          href="mailto:ltautd@gmail.com"
          className="text-white underline hover:no-underline"
        >
          ltautd@gmail.com
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
