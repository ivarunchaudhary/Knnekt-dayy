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

const title = "Knnekt Studios – Let's rethink tomorrow.";
const description =
  "Your 0 to 1 Partner for Digital Innovation. Blending consultancy expertise with agency craft, we lead ambitious companies from insight to impact—fast.";

export const metadata: Metadata = {
  title,
  description,
  robots: { index: true, follow: true },
  formatDetection: { telephone: false, address: false, email: false },
  icons: { icon: "/icon.svg", apple: "/apple-icon.jpg" },
  openGraph: {
    title,
    description,
    siteName: "Knnekt Studios",
    locale: "en",
    type: "website",
    images: [{ url: "/images/logo.jpg", width: 1200, height: 630, alt: title }],
  },
  twitter: { card: "summary_large_image", title, description },
};

export const viewport: Viewport = {
  themeColor: "#FFFFFF",
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
