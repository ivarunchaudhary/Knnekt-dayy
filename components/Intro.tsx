import { proofPoints } from "@/lib/data";
import { containerClass, SectionHeading } from "./Container";
import PenStrike from "./PenStrike";
import ScoreButton from "./ScoreButton";

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
 * Intro hook, then a full-bleed ticker of the studio's figures. The band is ruled
 * top and bottom so it reads as a measured strip rather than cards adrift in white,
 * and both edges fade to the page so items never hard-cut at the viewport.
 */
export default function Intro() {
  return (
    <section className="overflow-hidden pt-10 pb-14 md:pt-20 md:pb-20">
      <div className={containerClass}>
        <SectionHeading as="h1" lead={
            <>
              Investors fund proof, <PenStrike>not pitches</PenStrike>. We build the proof with you.
            </>
          }
        >
          15 founders. 10 days to plan, 90 days to build, in our studio in Gurugram, with weekly masterclasses with investors, founders
          and industry experts, and Pitch Day on Day 100.
        </SectionHeading>
        <div className="mt-8">
          <p>
            <ScoreButton location="hero" className="mono-text group inline-flex w-full items-center justify-center gap-3 rounded-full bg-sky-deep py-2 pr-2 pl-6 text-xs text-white shadow-[inset_0_1px_0_rgb(255_255_255/0.18),0_8px_20px_-8px_rgb(22_37_63/0.55)] outline-offset-2 outline-dark transition-[background-color,transform,box-shadow] duration-200 hover:-translate-y-px hover:bg-dark hover:shadow-[inset_0_1px_0_rgb(255_255_255/0.12),0_12px_24px_-10px_rgb(22_37_63/0.6)] focus-visible:bg-dark active:translate-y-0 active:scale-[0.98] sm:w-auto sm:pl-7 sm:text-sm sm:whitespace-nowrap">
              Take the free Startup Operating Score
              <span
                aria-hidden="true"
                className="grid size-9 shrink-0 place-items-center rounded-full bg-white text-sm text-sky-deep transition-[color,transform] duration-200 group-hover:translate-x-0.5 group-hover:text-dark sm:size-10"
              >
                →
              </span>
            </ScoreButton>
          </p>
          <p className="mono-text mt-4 font-mono text-dark/60">Free · 5 minutes · we call you within 24 hours with your constraints and next moves</p>
          <p className="mt-6">
            <a href="#journey" className="group inline-flex items-center gap-2 font-medium outline-offset-4 outline-dark hover:text-sky-deep">
              <span className="underline decoration-dark/25 underline-offset-4 group-hover:decoration-sky-deep">See how the 100 days work</span>
              <span aria-hidden="true" className="transition-transform duration-200 group-hover:translate-y-0.5">↓</span>
            </a>
          </p>
        </div>
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
