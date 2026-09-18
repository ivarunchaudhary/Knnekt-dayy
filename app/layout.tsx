import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
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

const title = "Knnekt Studios — Launch in 90 days. Get your first 100 customers.";
const description =
  "India's first Startup Execution Studio. It starts with your Startup Operating Score. Then fifteen founders per cohort go all-in for one 90-day build—and come out with real customers and a company ready to raise.";

export const metadata: Metadata = {
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
      </body>
    </html>
  );
}
