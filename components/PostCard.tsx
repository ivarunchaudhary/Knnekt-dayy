import Link from "next/link";
import { formatPostDate, type Post } from "@/lib/data";
import Parallax from "./Parallax";

/**
 * One article, as it appears on the homepage and on the insights index.
 * `eager` loads the cover immediately for the cards above the fold on /en/insights.
 * `level` keeps the heading hierarchy honest: the title sits under a section h2 on
 * the homepage, but directly under the page h1 on the index.
 */
export default function PostCard({ post, eager = false, level = 3 }: { post: Post; eager?: boolean; level?: 2 | 3 }) {
  const Heading = level === 2 ? "h2" : "h3";
  return (
    <article>
      <Link href={`/en/insights/${post.slug}`} className="group block rounded-t-xl text-left outline-offset-2 outline-black">
        <span className="pointer-events-none block aspect-[16/10] overflow-hidden rounded-xl bg-gray-200 transition-all duration-300 group-hover:rounded-2xl">
          <Parallax className="ease-in-out-quart size-full transition-transform duration-300 motion-safe:group-hover:scale-102 motion-safe:group-focus-visible:scale-102">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              alt={post.cover.alt}
              loading={eager ? "eager" : "lazy"}
              fetchPriority={eager ? "high" : "auto"}
              decoding="async"
              width={post.cover.w}
              height={post.cover.h}
              sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
              className="size-full object-cover"
              src={post.cover.src}
            />
          </Parallax>
        </span>
        <span className="mono-text text-dark-very-subtle mt-5 flex flex-wrap items-center gap-x-2.5 gap-y-1 font-mono">
          <span className="text-dark">{post.category}</span>
          <span aria-hidden="true">·</span>
          <time dateTime={post.date}>{formatPostDate(post.date)}</time>
          <span aria-hidden="true">·</span>
          <span>{post.readingTime}</span>
        </span>
        <Heading className="mt-3 text-xl leading-tight font-medium lg:text-2xl">{post.title}</Heading>
        <p className="text-dark-subtle group-hover:text-dark group-focus-visible:text-dark mt-2 max-w-[36rem] text-sm leading-tight transition-colors">
          {post.excerpt}
        </p>
      </Link>
    </article>
  );
}
