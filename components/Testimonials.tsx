import { testimonials, type Testimonial } from "@/lib/data";
import { containerClass, SectionHeading } from "./Container";

function Card({ t }: { t: Testimonial }) {
  return (
    <figure className="flex h-full w-[19rem] shrink-0 flex-col justify-between rounded-xl border border-black/10 bg-gray-100 p-6 md:w-[25rem] md:p-8">
      <blockquote className="text-md leading-tight text-balance">
        <span className="text-dark-very-subtle">“</span>
        {t.quote}
        <span className="text-dark-very-subtle">”</span>
      </blockquote>
      <figcaption className="mt-8 flex flex-wrap items-center justify-between gap-x-4 gap-y-2 border-t border-black/10 pt-5">
        <span className="mono-text text-dark-very-subtle font-mono">{t.attribution}</span>
        <span className="mono-text text-dark rounded-full bg-gray-200 px-2.5 py-1.5 font-mono whitespace-nowrap">{t.result}</span>
      </figcaption>
    </figure>
  );
}

/** One pass of a row. Three identical copies sit side by side so the loop is seamless. */
function Row({ items, hidden }: { items: Testimonial[]; hidden?: boolean }) {
  return (
    <ul className="flex shrink-0 items-stretch gap-1.5 pr-1.5 md:gap-3 md:pr-3" aria-hidden={hidden}>
      {items.map((t) => (
        <li key={t.quote} className="flex">
          <Card t={t} />
        </li>
      ))}
    </ul>
  );
}

/**
 * Founder quotes on two ticker rows running opposite directions, so the band
 * reads as movement rather than a list. Both pause on hover and stop outright
 * under `prefers-reduced-motion`; the full set stays in the DOM once, unhidden,
 * for screen readers, with the two duplicate passes marked `aria-hidden`.
 */
export default function Testimonials() {
  const half = Math.ceil(testimonials.length / 2);
  const top = testimonials.slice(0, half);
  const bottom = testimonials.slice(half);

  return (
    <section id="testimonials" className="overflow-hidden py-12 md:py-28">
      <div className={containerClass}>
        <SectionHeading lead="What founders say after the ninety days.">
          Attributed by stage and sector until founders consent to be named—each one sitting next to the number it earned.
        </SectionHeading>
      </div>

      <div className="relative isolate mt-12 md:mt-20">
        <div className="marquee flex">
          <Row items={top} />
          <Row items={top} hidden />
          <Row items={top} hidden />
        </div>
        <div className="marquee marquee-reverse marquee-slow mt-1.5 flex md:mt-3">
          <Row items={bottom} />
          <Row items={bottom} hidden />
          <Row items={bottom} hidden />
        </div>
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 left-0 z-10 w-10 bg-gradient-to-r from-white via-white/80 to-transparent sm:w-20 md:w-32"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 right-0 z-10 w-10 bg-gradient-to-l from-white via-white/80 to-transparent sm:w-20 md:w-32"
        />
      </div>
    </section>
  );
}
