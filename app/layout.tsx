import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { GoogleAnalytics } from "@next/third-parties/google";
import MetaPixel from "@/components/MetaPixel";
import { SITE_URL } from "@/lib/site";
import "./globals.css";

const ftSystemBlank = localFont({
  variable: "--font-ft-system-blank",
  display: "swap",
  src: [
    { path: "./fonts/ft-system-blank-regular.woff2", weight: "400", style: "normal" },
    { path: "./fonts/ft-system-blank-medium.woff2", weight: "500", style: "normal" },
    { path: "./fonts/ft-system-blank-semibold.woff2", weight: "600", style: "normal" },
  ],
});

const ftSystemMono = localFont({
  variable: "--font-ft-system-mono",
  display: "swap",
  src: [{ path: "./fonts/ft-system-mono-medium.woff2", weight: "500", style: "normal" }],
});

const title = "Knnekt Studios · Investors fund proof, not pitches";
const description =
  "A startup execution studio in Gurugram. 15 founders a cohort: 10 days to plan, 90 to build, weekly masterclasses with investors, founders and industry experts, and Pitch Day on Day 100. Start with the free Startup Operating Score.";

export const metadata: Metadata = {
  // Share images resolve against the apex, whichever host (www, score) served the page.
  ...(SITE_URL && { metadataBase: new URL(SITE_URL) }),
  title,
  description,
  robots: { index: true, follow: true },
  formatDetection: { telephone: false, address: false, email: false },
  openGraph: {
    title,
    description,
    siteName: "Knnekt Studios",
    locale: "en",
    type: "website",
  },
  twitter: { card: "summary_large_image", title, description },
};

const GA_ID = process.env.NEXT_PUBLIC_GA_ID;

export const viewport: Viewport = {
  themeColor: "#3b81e3",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`relative scroll-smooth ${ftSystemBlank.variable} ${ftSystemMono.variable}`}>
      <body className="text-dark font-sans text-base antialiased">
        <link rel="preconnect" href="https://player.vimeo.com" />
        <link rel="preconnect" href="https://i.vimeocdn.com" />
        <link rel="preconnect" href="https://f.vimeocdn.com" />
        <link rel="preconnect" href="https://vod-adaptive-ak.vimeocdn.com" />
        {children}
        <MetaPixel />
      </body>
      {GA_ID && <GoogleAnalytics gaId={GA_ID} />}
    </html>
  );
}
