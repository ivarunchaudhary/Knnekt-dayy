import { proofPoints } from "@/lib/data";
import { containerClass } from "./Container";

/** One pass of the ticker. Three identical rows sit side by side so the loop is seamless. */
function FactRow({ hidden }: { hidden?: boolean }) {
  return (
    <ul className="flex shrink-0" aria-hidden={hidden}>
      {proofPoints.map(([figure, label]) => (
        <li key={label} className="shrink-0 border-l border-dark/10 pr-14 pl-5 md:pr-24 md:pl-8">
          <p className="text-3xl leading-none font-medium md:text-4xl">{figure}</p>
          <p className="text-dark-subtle mt-3 max-w-48 text-sm leading-tight text-balance">{label}</p>
        </li>
      ))}
    </ul>
  );
}

/**
 * Intro claim, then a full-bleed ticker of the studio's figures. The band is ruled
 * top and bottom so it reads as a measured strip rather than cards adrift in white,
 * and both edges fade to the page so items never hard-cut at the viewport.
 */
export default function Intro() {
  return (
    <section className="overflow-hidden pt-10 pb-14 md:pt-20 md:pb-20">
      <div className={containerClass}>
        <h1 className="text-dark-subtle max-w-[52.25rem] text-2xl font-medium lg:text-3xl">
          <span className="text-dark transition-colors duration-500">Your first 100 customers. Fund-ready in 90 days.</span> It starts with your Startup Operating Score. Then fifteen founders per cohort go all-in for one 90-day build—and come out with real customers and a company ready to raise.
        </h1>
      </div>
      <div className="relative isolate mt-12 border-y border-dark/10 py-8 md:mt-20 md:py-11">
        <div className="marquee flex">
          <FactRow />
          <FactRow hidden />
          <FactRow hidden />
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
