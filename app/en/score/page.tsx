import type { Metadata } from "next";
import Link from "next/link";
import { containerClass } from "@/components/Container";
import Footer from "@/components/Footer";
import ScoreQuiz from "@/components/ScoreQuiz";
import Wordmark from "@/components/Wordmark";
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
 *
 * The score often opens in a tab of its own, so the home page's section pill
 * would only lead away from it: the page carries the logo up top and a single
 * way back home in the pill's place, at every width.
 */
export default function ScorePage() {
  const home = `${SITE_URL}/en`;
  return (
    <div className="bg-white">
      <main className={`${containerClass} pt-8 pb-32 md:pt-16`}>
        <Link href={home} aria-label="Knnekt Studios home" className="inline-flex rounded-sm text-dark outline-offset-4 outline-dark">
          <Wordmark mark className="text-[2rem]" />
        </Link>
        <h1 className="mt-8 max-w-[16ch] text-3xl font-medium md:mt-16 md:text-4xl">See exactly what’s in your way.</h1>
        <p className="mt-3 max-w-[48ch] text-lg text-dark/80 lg:text-xl">Six pillars, one honest score. The report lands in your inbox, and we call you to walk through it.</p>
        <p className="mono-text mt-3 font-mono text-dark/60">Free · 5 min · no card</p>

        {/* The score asks for name, email and phone, and its report holds the business: none of it shows in Clarity. */}
        <div className="mt-8 md:mt-12" data-clarity-mask="true">
          <ScoreQuiz />
        </div>
      </main>
      <nav aria-label="Site" className="fixed bottom-7 left-1/2 isolate z-40 -translate-x-1/2 rounded-full bg-gray-200/70 px-2.5 py-1.5 text-[0.9375rem] leading-[125%] font-medium tracking-[-0.00938rem] backdrop-blur-xl">
        <Link href={home} className="text-dark-subtle hover:text-dark flex items-center gap-1.5 rounded-full px-2 py-3 whitespace-nowrap outline-dark transition-colors">
          <span aria-hidden="true">←</span>
          <span className="-mt-0.5">Back to home</span>
        </Link>
      </nav>
      <Footer />
    </div>
  );
}
