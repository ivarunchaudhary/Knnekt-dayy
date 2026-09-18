import Link from "next/link";
import { notFound } from "next/navigation";
import { work, type WorkItem } from "@/lib/data";
import { containerClass } from "@/components/Container";
import Footer from "@/components/Footer";
import Nav from "@/components/Nav";
import Parallax from "@/components/Parallax";
import Vimeo from "@/components/Vimeo";

export function generateStaticParams() {
  return work.map((w) => ({ slug: w.slug }));
}

const chipClass =
  "before:bg-dark relative items-baseline gap-2 rounded-lg bg-gray-200 px-2.5 pt-1.5 pb-2 lg:flex lg:pt-2.5 lg:pb-3 lg:before:size-2 lg:before:shrink-0 lg:before:-translate-y-[20%] lg:before:rounded-full";

const ruleClass = "mt-16 border-t border-dark/10 pt-8 md:mt-24 md:pt-10";

/** The case's own asset: a Vimeo loop where there is one, otherwise the widest still we hold. */
function Hero({ item }: { item: WorkItem }) {
  const still = item.desktop ?? item.mobile;
  if (!item.vimeo && !still) return null;
  return (
    <div className="mt-12 overflow-hidden rounded-xl bg-gray-200 md:mt-16">
      {item.vimeo ? (
        <div className="relative aspect-[4/5] md:aspect-[16/9]">
          <Vimeo id={item.vimeo} aspect={item.vimeoAspect} title={item.client} cover eager />
        </div>
      ) : (
        <Parallax className="aspect-[4/5] w-full md:aspect-[16/9]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            alt={item.alt ?? item.client}
            loading="eager"
            fetchPriority="high"
            decoding="async"
            width={still!.w}
            height={still!.h}
            sizes="(min-width: 1024px) 90vw, 100vw"
            className="size-full object-cover"
            src={still!.src}
          />
        </Parallax>
      )}
    </div>
  );
}

export default async function CasePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const index = work.findIndex((w) => w.slug === slug);
  if (index === -1) notFound();
  const item = work[index];
  const next = work[(index + 1) % work.length];
  const nextStill = next.mobile ?? next.desktop;

  return (
    <div className="bg-white">
      <Nav />
      <main className={`${containerClass} pt-14 pb-28 md:pt-20`}>
        <Link
          href="/en"
          className="mono-text text-dark-subtle hover:text-dark group inline-flex items-center gap-2 font-mono transition-colors"
        >
          <span className="ease-in-out-quart inline-block transition-transform duration-300 group-hover:-translate-x-1">←</span>
          Back home
        </Link>

        {/* Masthead: who it was, what we called it, and the shape of the engagement. */}
        <header className="mt-14 md:mt-20">
          <p className="mono-text text-dark-very-subtle font-mono">
            {item.client} · {item.sector}
          </p>
          <h1 className="mt-5 max-w-[20ch] text-3xl font-medium md:text-4xl">{item.title}</h1>
          <div className="mt-10 grid gap-x-1.5 gap-y-7 border-t border-dark/10 pt-8 lg:grid-cols-[minmax(0,36rem)_auto]">
            <p className="text-lg leading-tight">{item.blurb}</p>
            <div className="lg:justify-self-end lg:text-right">
              <p className="mono-text text-dark-very-subtle font-mono">Engagement</p>
              <p className="mt-2.5 font-medium">{item.tier}</p>
            </div>
          </div>
        </header>

        <Hero item={item} />

        {/* What came out of it. */}
        <ul className="mt-16 grid divide-y divide-dark/10 border-y border-dark/10 sm:grid-cols-3 sm:divide-x sm:divide-y-0 md:mt-24">
          {item.results.map(([value, label]) => (
            <li key={label} className="py-8 sm:px-9 sm:first:pl-0 sm:last:pr-0 md:py-10">
              <p className="text-3xl leading-none font-medium md:text-4xl">{value}</p>
              <p className="text-dark-subtle mt-3 text-sm leading-tight">{label}</p>
            </li>
          ))}
        </ul>

        {/* How it ran, and what actually shipped. */}
        <div className="mt-16 grid gap-x-1.5 gap-y-14 md:mt-24 lg:grid-cols-2">
          <section>
            <h2 className="mono-text text-dark/80 font-mono">How it ran</h2>
            <ol className="mt-7 border-l border-dark/10 pl-7">
              {item.timeline.map(([when, what]) => (
                <li key={when} className="relative pb-8 last:pb-0">
                  <span aria-hidden="true" className="bg-dark absolute top-[0.3rem] -left-8 size-2 rounded-full" />
                  <p className="mono-text text-dark-very-subtle font-mono">{when}</p>
                  <p className="mt-2 text-sm leading-tight">{what}</p>
                </li>
              ))}
            </ol>
          </section>
          <section>
            <h2 id="delivered" className="mono-text text-dark/80 font-mono">
              What we delivered
            </h2>
            <ul aria-labelledby="delivered" className="mt-7 grid grid-cols-1 gap-1.5 text-xs leading-tight sm:grid-cols-2">
              {item.delivered.map((d) => (
                <li key={d} className={chipClass}>
                  {d}
                </li>
              ))}
            </ul>
          </section>
        </div>

        {/* The point of the whole page: the thing we talked them out of. */}
        <section className="bg-panel relative isolate mt-16 overflow-hidden rounded-xl px-6 py-12 md:mt-24 md:px-14 md:py-16">
          <div
            aria-hidden="true"
            className="after:animate-grain after:bg-grain absolute inset-0 -z-10 overflow-hidden after:absolute after:top-0 after:left-0 after:size-[140%] after:opacity-[0.04]"
          />
          <div className="grid gap-x-12 gap-y-7 lg:grid-cols-[9rem_minmax(0,1fr)]">
            <h2 className="mono-text font-mono text-dark/70 lg:pt-2.5">What we refused</h2>
            <p className="text-xl leading-tight font-medium lg:text-3xl">{item.refused}</p>
          </div>
        </section>

        <figure className={ruleClass}>
          <blockquote className="max-w-[52.25rem] text-2xl leading-tight font-medium lg:text-3xl">
            <span className="text-dark-very-subtle">“</span>
            {item.quote}
            <span className="text-dark-very-subtle">”</span>
          </blockquote>
          <figcaption className="mono-text text-dark-very-subtle mt-7 font-mono">{item.attribution}</figcaption>
        </figure>

        {/* Never a dead end: hand the reader the next build. */}
        <Link
          href={`/en/case/${next.slug}`}
          className={`${ruleClass} group flex items-center gap-5 rounded-b-xl outline-offset-4 outline-dark md:gap-8`}
        >
          {nextStill && (
            <span className="block size-24 shrink-0 overflow-hidden rounded-lg bg-gray-200 transition-all duration-300 group-hover:rounded-2xl md:size-32">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                alt=""
                aria-hidden="true"
                loading="lazy"
                decoding="async"
                width={nextStill.w}
                height={nextStill.h}
                sizes="8rem"
                className="ease-in-out-quart size-full object-cover transition-transform duration-300 motion-safe:group-hover:scale-102 motion-safe:group-focus-visible:scale-102"
                src={nextStill.src}
              />
            </span>
          )}
          <span className="block min-w-0">
            <span className="mono-text text-dark-very-subtle block font-mono">Next case</span>
            <span className="mt-2.5 block text-3xl font-medium md:text-4xl">{next.client}</span>
            <span className="text-dark-subtle group-hover:text-dark group-focus-visible:text-dark block leading-tight transition-colors">
              {next.title}
            </span>
          </span>
          <span
            aria-hidden="true"
            className="text-dark-very-subtle group-hover:text-dark group-focus-visible:text-dark ease-in-out-quart ml-auto shrink-0 text-2xl transition-all duration-300 group-hover:translate-x-1"
          >
            →
          </span>
        </Link>

        <p className="text-dark-very-subtle mt-16 max-w-[36rem] text-xs md:mt-24">
          Representative engagement. Real founder photos, quotes and scorecards go live as founders consent.
        </p>
      </main>
      <Footer />
    </div>
  );
}
