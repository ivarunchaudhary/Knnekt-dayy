import type { Metadata } from "next";
import Link from "next/link";
import { insights } from "@/lib/data";
import { containerClass } from "@/components/Container";
import Footer from "@/components/Footer";
import Nav from "@/components/Nav";
import PostCard from "@/components/PostCard";

const title = "Insights · Knnekt Studios";
const description =
  "Three hundred startups’ worth of pattern: the refusals, the scores, the raises that went sideways. Written down, not gated.";

export const metadata: Metadata = {
  title,
  description,
  openGraph: { title, description, type: "website" },
  twitter: { card: "summary_large_image", title, description },
};

export default function InsightsIndex() {
  return (
    <div className="bg-white">
      <Nav />
      <main className={`${containerClass} pt-14 pb-28 md:pt-20`}>
        <Link
          href="/en"
          className="mono-text text-dark-subtle hover:text-dark group inline-flex items-center gap-2 font-mono transition-colors"
        >
          <span className="ease-in-out-quart inline-block transition-transform duration-300 group-hover:-translate-x-1">←</span>
          Home
        </Link>

        <header className="mt-14 md:mt-20">
          <p className="mono-text text-dark-very-subtle font-mono">Insights · {insights.length} pieces</p>
          <h1 className="mt-5 max-w-[20ch] text-3xl font-medium md:text-4xl">What we’ve learned, written down.</h1>
          <p className="text-dark-subtle mt-10 max-w-[36rem] border-t border-dark/10 pt-8 text-lg leading-tight">
            The refusals, the scores, the raises that went sideways. Everything here comes out of engagements we actually
            ran. No gated PDFs, no newsletter wall.
          </p>
        </header>

        <div className="mt-16 grid gap-x-1.5 gap-y-14 sm:grid-cols-2 md:mt-24 lg:grid-cols-3">
          {insights.map((post, i) => (
            <PostCard key={post.slug} post={post} eager={i < 3} level={2} />
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}
