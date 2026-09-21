import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { formatPostDate, insights, type PostBlock } from "@/lib/data";
import { containerClass } from "@/components/Container";
import Footer from "@/components/Footer";
import Nav from "@/components/Nav";
import Parallax from "@/components/Parallax";

export function generateStaticParams() {
  return insights.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = insights.find((p) => p.slug === slug);
  if (!post) return {};
  const title = `${post.title} · Knnekt Studios`;
  return {
    title,
    description: post.excerpt,
    openGraph: {
      title,
      description: post.excerpt,
      type: "article",
      publishedTime: post.date,
      images: [{ url: post.cover.src, alt: post.cover.alt }],
    },
    twitter: { card: "summary_large_image", title, description: post.excerpt },
  };
}

/** The article body: a small block vocabulary rather than raw HTML, so copy stays data. */
function Block({ block }: { block: PostBlock }) {
  if ("h" in block) return <h2 className="mt-14 text-xl font-medium md:mt-20 lg:text-2xl">{block.h}</h2>;
  if ("list" in block)
    return (
      <ul className="mt-7 space-y-3.5">
        {block.list.map((item) => (
          <li key={item} className="flex gap-3.5">
            <span aria-hidden="true" className="bg-dark mt-[0.55rem] size-1.5 shrink-0 rounded-full" />
            <span className="text-dark-subtle leading-snug">{item}</span>
          </li>
        ))}
      </ul>
    );
  if ("quote" in block)
    return (
      <blockquote className="border-dark/15 mt-12 border-l-2 pl-7 text-xl leading-tight font-medium md:mt-16 lg:text-2xl">
        <span className="text-dark-very-subtle">“</span>
        {block.quote}
        <span className="text-dark-very-subtle">”</span>
      </blockquote>
    );
  return <p className="text-dark-subtle mt-7 leading-snug">{block.p}</p>;
}

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const index = insights.findIndex((p) => p.slug === slug);
  if (index === -1) notFound();
  const post = insights[index];
  const next = insights[(index + 1) % insights.length];

  return (
    <div className="bg-white">
      <Nav />
      <main className={`${containerClass} pt-14 pb-28 md:pt-20`}>
        <Link
          href="/en/insights"
          className="mono-text text-dark-subtle hover:text-dark group inline-flex items-center gap-2 font-mono transition-colors"
        >
          <span className="ease-in-out-quart inline-block transition-transform duration-300 group-hover:-translate-x-1">←</span>
          All insights
        </Link>

        <header className="mt-14 md:mt-20">
          <p className="mono-text text-dark-very-subtle flex flex-wrap items-center gap-x-2.5 gap-y-1 font-mono">
            <span className="text-dark">{post.category}</span>
            <span aria-hidden="true">·</span>
            <time dateTime={post.date}>{formatPostDate(post.date)}</time>
            <span aria-hidden="true">·</span>
            <span>{post.readingTime}</span>
          </p>
          <h1 className="mt-5 max-w-[22ch] text-3xl font-medium md:text-4xl">{post.title}</h1>
          <div className="mt-10 grid gap-x-1.5 gap-y-7 border-t border-dark/10 pt-8 lg:grid-cols-[minmax(0,36rem)_auto]">
            <p className="text-lg leading-tight">{post.excerpt}</p>
            <div className="lg:justify-self-end lg:text-right">
              <p className="mono-text text-dark-very-subtle font-mono">Written by</p>
              <p className="mt-2.5 font-medium">{post.author}</p>
            </div>
          </div>
        </header>

        <div className="mt-12 overflow-hidden rounded-xl bg-gray-200 md:mt-16">
          <Parallax className="aspect-[4/3] w-full md:aspect-[16/9]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              alt={post.cover.alt}
              loading="eager"
              fetchPriority="high"
              decoding="async"
              width={post.cover.w}
              height={post.cover.h}
              sizes="(min-width: 1024px) 90vw, 100vw"
              className="size-full object-cover"
              src={post.cover.src}
            />
          </Parallax>
        </div>

        <article className="mt-16 max-w-[44rem] md:mt-24">
          {post.body.map((block, i) => (
            <Block key={i} block={block} />
          ))}
        </article>

        {/* Never a dead end: hand the reader the next piece. */}
        <Link
          href={`/en/insights/${next.slug}`}
          className="group mt-16 flex items-center gap-5 rounded-b-xl border-t border-dark/10 pt-8 outline-offset-4 outline-dark md:mt-24 md:gap-8 md:pt-10"
        >
          <span className="block size-24 shrink-0 overflow-hidden rounded-lg bg-gray-200 transition-all duration-300 group-hover:rounded-2xl md:size-32">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              alt=""
              aria-hidden="true"
              loading="lazy"
              decoding="async"
              width={next.cover.w}
              height={next.cover.h}
              sizes="8rem"
              className="ease-in-out-quart size-full object-cover transition-transform duration-300 motion-safe:group-hover:scale-102 motion-safe:group-focus-visible:scale-102"
              src={next.cover.src}
            />
          </span>
          <span className="block min-w-0">
            <span className="mono-text text-dark-very-subtle block font-mono">Next read</span>
            <span className="mt-2.5 block text-xl leading-tight font-medium md:text-2xl">{next.title}</span>
            <span className="text-dark-subtle group-hover:text-dark group-focus-visible:text-dark mt-1 block text-sm leading-tight transition-colors">
              {next.category} · {next.readingTime}
            </span>
          </span>
          <span
            aria-hidden="true"
            className="text-dark-very-subtle group-hover:text-dark group-focus-visible:text-dark ease-in-out-quart ml-auto shrink-0 text-2xl transition-all duration-300 group-hover:translate-x-1"
          >
            →
          </span>
        </Link>

        <p className="mt-16 md:mt-24">
          <Link
            href="/en/score"
            className="mono-text group inline-flex items-center gap-2.5 font-mono outline-offset-2 outline-dark"
          >
            <span className="bg-sky-deep group-hover:bg-dark rounded-full px-7 py-3 text-white transition-colors">Take the score</span>
            <span className="text-dark/50 group-hover:text-dark transition-colors">Free, five minutes, no card</span>
          </Link>
        </p>
      </main>
      <Footer />
    </div>
  );
}
