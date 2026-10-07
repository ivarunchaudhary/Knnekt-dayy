import type { Metadata } from "next";
import Link from "next/link";
import { containerClass } from "@/components/Container";
import Footer from "@/components/Footer";
import Nav from "@/components/Nav";
import ScoreQuiz from "@/components/ScoreQuiz";
import { SCORE_URL, SHARE_IMAGE, SITE_URL } from "@/lib/site";

const title = "Startup Operating Score · Knnekt Studios";
const description =
  "Six pillars, one page each, five minutes, no card. See exactly what’s in your way: your archetype, your top constraints and your next move. The report lands in your inbox as a PDF, and we call you to walk through it.";

export const metadata: Metadata = {
  title,
  description,
  // Served at the root of the score subdomain in production; the canonical says so.
  ...(SCORE_URL.startsWith("http") && { alternates: { canonical: SCORE_URL } }),
  openGraph: { title, description, type: "website", images: [SHARE_IMAGE] },
  twitter: { card: "summary_large_image", title, description, images: [SHARE_IMAGE] },
};

/**
 * The score, live. Name, email and number first; then one page per section;
 * then the report, emailed as a PDF. The studio calls from there — nothing is
 * booked. The verdict is the same one the studio uses to choose the 15.
 */
export default function ScorePage() {
  return (
    <div className="bg-white">
      <Nav />
      <main className={`${containerClass} pt-8 pb-24 md:pt-16`}>
        <Link href={`${SITE_URL}/en`} className="mono-text text-dark-subtle hover:text-dark font-mono">
          ← Back
        </Link>
        <h1 className="mt-8 max-w-[16ch] text-3xl font-medium md:mt-16 md:text-4xl">See exactly what’s in your way.</h1>
        <p className="mt-3 max-w-[48ch] text-lg text-dark/80 lg:text-xl">Six pillars, one honest score. The report lands in your inbox, and we call you to walk through it.</p>
        <p className="mono-text mt-3 font-mono text-dark/60">Free · 5 min · no card</p>

        <div className="mt-8 md:mt-12">
          <ScoreQuiz />
        </div>
      </main>
      <Footer />
    </div>
  );
}
