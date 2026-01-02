import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://atozyx.com";

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: "AtoZyx LaunchPad | AI-Powered Product Planning",
    template: "%s | AtoZyx LaunchPad",
  },
  description:
    "Launch your SaaS in minutes. Use AI to clarify ideas, define MVP scope, and generate execution roadmaps.",
  keywords: [
    "SaaS",
    "AI",
    "Product Planning",
    "MVP",
    "Boilerplate",
    "Tech Stack",
    "Roadmap Generation",
  ],
  authors: [{ name: "AtoZyx Team" }],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: baseUrl,
    title: "AtoZyx LaunchPad | AI-Powered Product Planning",
    description:
      "Launch your SaaS in minutes. Use AI to clarify ideas, define MVP scope, and generate execution roadmaps.",
    siteName: "AtoZyx LaunchPad",
  },
  twitter: {
    card: "summary_large_image",
    title: "AtoZyx LaunchPad | AI-Powered Product Planning",
    description:
      "Launch your SaaS in minutes. AI-powered roadmaps and scope definitions.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
        <Toaster position="top-right" richColors />
      </body>
    </html>
  );
}
