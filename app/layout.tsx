import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { ChatWidget } from "@/components/ChatWidget";
import { WebsiteImagesProvider } from "@/hooks/useWebsiteImages";
import { DebateNightModal } from "@/components/DebateNightModal";

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-playfair",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "LTA UTD | Law and Trial Association at UT Dallas",
  description:
    "Law and Trial Association at the University of Texas at Dallas — mock trial, networking, and legal workshops.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${playfair.variable} ${inter.variable}`}
    >
      <body className="min-h-screen">
        <ClerkProvider>
          <WebsiteImagesProvider>
            <Navbar />
            {children}
            <ChatWidget />
            <DebateNightModal />
          </WebsiteImagesProvider>
        </ClerkProvider>
      </body>
    </html>
  );
}
