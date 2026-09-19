import type { Metadata } from "next";
import Link from "next/link";
import { containerClass } from "@/components/Container";
import Footer from "@/components/Footer";
import Nav from "@/components/Nav";
import ScoreQuiz from "@/components/ScoreQuiz";

const title = "Startup Operating Score — Knnekt Studios";
const description =
  "Six pillars, one page each, five minutes, no card. See exactly what’s in your way — your archetype, your top constraints and your next move. The report lands in your inbox as a PDF, and we call you to walk through it.";

export const metadata: Metadata = {
  title,
  description,
  openGraph: { title, description, type: "website" },
  twitter: { card: "summary_large_image", title, description },
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
      <main className={`${containerClass} pt-16 pb-24`}>
        <Link href="/en" className="mono-text text-dark-subtle hover:text-dark font-mono">
          ← Back
        </Link>
        <p className="mono-text mt-16 font-mono text-dark/75">Every startup has a number. We built the one that decides who we build with.</p>
        <h1 className="mt-5 max-w-[16ch] text-3xl font-medium md:text-4xl">See exactly what’s in your way.</h1>
        <p className="mt-4 max-w-[52ch] text-lg text-dark/80 lg:text-xl">
          Six pillars, one page each. One honest score — and the verdict we’d give you on the call, before we call.
        </p>
        <p className="mono-text mt-4 font-mono text-dark/60">Free · 5 min · no card · your report emailed as a PDF · we call you</p>

        <div className="mt-12 md:mt-16">
          <ScoreQuiz />
        </div>
      </main>
      <Footer />
    </div>
  );
}
