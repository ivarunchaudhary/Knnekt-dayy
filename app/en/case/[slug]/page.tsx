import Link from "next/link";
import { notFound } from "next/navigation";
import { work } from "@/lib/data";
import Footer from "@/components/Footer";
import Nav from "@/components/Nav";
import { containerClass } from "@/components/Container";

export function generateStaticParams() {
  return work.map((w) => ({ slug: w.slug }));
}

export default async function CasePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const item = work.find((w) => w.slug === slug);
  if (!item) notFound();

  return (
    <div className="bg-white">
      <Nav />
      <main className={`${containerClass} min-h-[70vh] pt-16 pb-24`}>
        <Link href="/en" className="mono-text text-dark-subtle hover:text-dark font-mono">
          ← Back
        </Link>
        <p className="mt-16 text-dark-subtle">
          {item.client} · {item.sector}
        </p>
        <h1 className="mt-2 text-3xl font-medium md:text-4xl">{item.title}</h1>
        <p className="mt-10 max-w-[36rem] text-lg leading-tight">{item.blurb}</p>

        <ul className="mt-14 grid gap-x-1.5 gap-y-8 border-t border-black/10 pt-7 sm:grid-cols-3">
          {item.results.map(([value, label]) => (
            <li key={label}>
              <p className="text-3xl font-medium md:text-4xl">{value}</p>
              <p className="text-dark-subtle mt-1 text-sm">{label}</p>
            </li>
          ))}
        </ul>

        <div className="mt-14 grid gap-x-1.5 gap-y-12 border-t border-black/10 pt-7 lg:grid-cols-2">
          <div>
            <p className="mono-text text-dark/80 font-mono">{item.tier}</p>
            <ul className="mt-4 space-y-3">
              {item.timeline.map(([when, what]) => (
                <li key={when} className="flex flex-col gap-1 sm:flex-row sm:gap-4">
                  <span className="mono-text text-dark-very-subtle shrink-0 font-mono sm:w-28">{when}</span>
                  <span className="text-sm">{what}</span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="mono-text text-dark/80 font-mono">What we delivered</p>
            <ul className="mt-4 grid grid-cols-1 gap-1.5 text-xs leading-tight sm:grid-cols-2">
              {item.delivered.map((d) => (
                <li key={d} className="before:bg-dark relative items-baseline gap-2 rounded-lg bg-gray-200 px-2.5 pt-1.5 pb-2 lg:flex lg:pt-2.5 lg:pb-3 lg:before:size-2 lg:before:shrink-0 lg:before:-translate-y-[20%] lg:before:rounded-full">
                  {d}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-14 border-t border-black/10 pt-7">
          <p className="mono-text text-dark/80 font-mono">What we refused</p>
          <p className="text-dark-subtle mt-4 max-w-[36rem] text-sm">{item.refused}</p>
        </div>

        <figure className="mt-14 max-w-[52.25rem] border-t border-black/10 pt-7">
          <blockquote className="text-xl font-medium lg:text-2xl">“{item.quote}”</blockquote>
          <figcaption className="mono-text text-dark-very-subtle mt-4 font-mono">{item.attribution}</figcaption>
        </figure>

        <p className="text-dark-very-subtle mt-14 max-w-[36rem] text-xs">
          Representative engagement. Real founder photos, quotes and scorecards go live as founders consent.
        </p>
      </main>
      <Footer />
    </div>
  );
}
