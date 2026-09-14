import Link from "next/link";
import { insights } from "@/lib/data";
import Container, { SectionHeading } from "./Container";
import PostCard from "./PostCard";

/** The three most recent pieces, with the door to the rest. */
export default function Insights() {
  return (
    <section id="insights" className="py-12 md:py-28">
      <Container>
        <SectionHeading lead="What we’ve learned, written down.">
          Three hundred startups’ worth of pattern—the refusals, the scores, the raises that went sideways. No gated PDFs.
        </SectionHeading>

        <div className="mt-12 grid gap-x-1.5 gap-y-14 sm:grid-cols-2 lg:mt-20 lg:grid-cols-3">
          {insights.slice(0, 3).map((post) => (
            <PostCard key={post.slug} post={post} />
          ))}
        </div>

        <p className="mt-14 border-t border-black/10 pt-10">
          <Link
            href="/en/insights"
            className="mono-text group inline-flex items-center gap-2.5 font-mono outline-offset-2 outline-black"
          >
            <span className="bg-dark hover:bg-dark/80 group-hover:bg-dark/80 rounded-full px-7 py-3 text-white transition-colors">
              All insights
            </span>
            <span className="text-dark/50 group-hover:text-dark transition-colors">{insights.length} pieces</span>
          </Link>
        </p>
      </Container>
    </section>
  );
}
