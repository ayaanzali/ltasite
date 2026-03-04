import Link from "next/link";
import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <div className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center py-12">
      <p className="mb-6">
        <Link href="/" className="font-inter text-sm text-[#1D2A3F] hover:underline">
          ← Back to home
        </Link>
      </p>
      <div className="flex items-center justify-center">
        <SignIn signUpUrl="/sign-up" afterSignInUrl="/" />
      </div>
    </div>
  );
}
