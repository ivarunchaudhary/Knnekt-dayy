"use client";

import { useEffect, useRef, useState } from "react";
import { scorePillars, scoreSample, scoredThisMonth } from "@/lib/data";
import Container from "./Container";
import GradientBackground from "./GradientBackground";
import ScoreDialog from "./ScoreDialog";

/** How long each slide of the sample report holds before the next one. */
const HOLD = 3800;
const SLIDES = 5;

const reduceMotion = () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/** Counts an element up from zero to `to` over `ms`, easing out, and settles on the exact figure. */
function useCountUp(to: number, ms: number, run: boolean) {
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!run) return;
    let raf = 0;
    if (reduceMotion()) {
      raf = requestAnimationFrame(() => setN(to));
      return () => cancelAnimationFrame(raf);
    }
    let t0 = 0;
    const step = (ts: number) => {
      if (!t0) t0 = ts;
      const p = Math.min((ts - t0) / ms, 1);
      setN(Math.round(to * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [to, ms, run]);
  return n;
}

const check = (
  <svg aria-hidden="true" viewBox="0 0 16 16" fill="none" className="size-2.5">
    <path d="M3 8.5l3.2 3.2L13 5" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

function Eyebrow({ left, right }: { left: string; right: string }) {
  return (
    <p className="mono-text flex items-center justify-between gap-3 font-mono text-dark/60">
      <span>{left}</span>
      <span className="rounded-full bg-gray-100 px-2.5 py-1 text-dark/70">{right}</span>
    </p>
  );
}

/** Slide 1 — the number, the archetype and the six pillars. */
function ScoreSlide({ live }: { live: boolean }) {
  const n = useCountUp(scoreSample.score, 1000, live);
  const [grown, setGrown] = useState(false);
  useEffect(() => {
    // A beat after mount so the bars are seen growing; straight away under reduced motion.
    const t = setTimeout(() => setGrown(true), reduceMotion() ? 0 : 80);
    return () => clearTimeout(t);
  }, []);
  return (
    <>
      <Eyebrow left="Your report" right="Sample" />
      <div className="mt-5 flex flex-wrap items-baseline gap-x-2.5 gap-y-2">
        <span className="text-4xl leading-[0.9] font-medium tabular-nums md:text-[4.75rem]">{n}</span>
        <span className="mono-text font-mono text-dark/60">/100</span>
        <span className="mono-text ml-auto text-right font-mono text-dark/60">
          Archetype
          <span className="mt-1 block font-sans text-sm font-medium normal-case tracking-normal text-dark">{scoreSample.archetype}</span>
        </span>
      </div>
      <div aria-hidden="true" className="mt-6 grid h-40 grid-cols-6 items-end gap-2.5">
        {scoreSample.bars.map((h, i) => {
          const weak = scoreSample.weak.includes(i);
          return (
            <span key={i} className="flex h-full items-end">
              <span
                className={`block w-full rounded-t-md transition-[height] duration-[900ms] ease-out-expo ${weak ? "bg-gray-100 ring-[1.5px] ring-inset ring-sky-deep" : "bg-sky-deep"}`}
                style={{ height: grown ? `${h}%` : 0, transitionDelay: `${i * 70}ms` }}
              />
            </span>
          );
        })}
      </div>
      <ul className="mt-2.5 grid grid-cols-6 gap-2.5">
        {scorePillars.map((p, i) => (
          <li key={p} className={`mono-text text-center font-mono text-[0.5625rem] ${scoreSample.weak.includes(i) ? "text-sky-deep" : "text-dark/60"}`}>
            {p}
          </li>
        ))}
      </ul>
      <p className="mono-text mt-5 inline-block rounded-full bg-gray-100 px-3.5 py-2 font-mono text-dark/80">Which founder are you? →</p>
    </>
  );
}

/** Slide 2 — the first question, answerable. Picking an option lights the CTA. */
function QuestionSlide({ onStart }: { onStart: () => void }) {
  const [picked, setPicked] = useState<number | null>(null);
  const q = scoreSample.question;
  return (
    <>
      <Eyebrow left={q.label} right="Live" />
      <p className="mt-5 text-xl leading-tight font-medium lg:text-2xl">{q.text}</p>
      <ul role="radiogroup" aria-label={q.text} className="mt-5 space-y-2">
        {q.options.map((o, i) => {
          const on = picked === i;
          return (
            <li key={o}>
              <button
                type="button"
                role="radio"
                aria-checked={on}
                onClick={() => {
                  setPicked(i);
                  onStart();
                }}
                className={`flex w-full items-center gap-3 rounded-lg border px-4 py-3 text-left text-sm leading-tight transition-colors outline-dark ${
                  on ? "border-sky-deep bg-gray-100" : "border-dark/15 hover:border-sky-deep hover:bg-gray-100"
                }`}
              >
                <span
                  aria-hidden="true"
                  className={`size-4 shrink-0 rounded-full border-[1.5px] transition-colors ${on ? "border-sky-deep bg-sky-deep shadow-[inset_0_0_0_3px_#fff]" : "border-dark/50"}`}
                />
                {o}
              </button>
            </li>
          );
        })}
      </ul>
      {picked !== null && (
        <p className="mt-4 flex flex-wrap items-center justify-between gap-2 rounded-lg bg-panel px-4 py-3 text-sm">
          <span className="font-medium">Nice. You’ve started.</span>
          <span className="mono-text font-mono text-dark/70">{q.remaining} →</span>
        </p>
      )}
    </>
  );
}

/** Slide 3 — the three constraints the report puts first. */
function ConstraintsSlide() {
  return (
    <>
      <Eyebrow left="Your top 3 constraints" right="Verdict" />
      <ul className="mt-5 space-y-2.5">
        {scoreSample.constraints.map(([name, why]) => (
          <li key={name} className="rounded-r-lg border-l-2 border-sky-deep bg-gray-100 px-4 py-3">
            <p className="text-sm font-medium">{name}</p>
            <p className="text-dark-subtle mt-0.5 text-xs leading-tight">{why}</p>
          </li>
        ))}
      </ul>
    </>
  );
}

/** Slide 4 — the track from idea to fund-ready, with the founder's marker on it. */
function ClimbSlide() {
  const [on, setOn] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setOn(true), reduceMotion() ? 0 : 60);
    return () => clearTimeout(t);
  }, []);
  const { you, marks } = scoreSample.climb;
  return (
    <>
      <Eyebrow left="Where you are → where you’re going" right="Your climb" />
      <p className="mono-text mt-9 flex justify-between font-mono text-dark/60">
        <span>Idea</span>
        <span>Fund-ready</span>
      </p>
      <div className="relative mt-9 mb-14 h-3 rounded-full border border-dark/15 bg-gray-100">
        <span
          aria-hidden="true"
          className="absolute inset-y-0 left-0 rounded-full bg-[linear-gradient(90deg,var(--color-sky-deep),var(--color-sky))] transition-[width] duration-[1150ms] ease-out-expo"
          style={{ width: on ? `${you}%` : 0 }}
        />
        {marks.map(([at, label]) => (
          <span key={label} className="absolute top-1/2 -translate-x-1/2" style={{ left: `${at}%` }}>
            <span aria-hidden="true" className="block h-5 w-0.5 -translate-y-1/2 bg-dark/15" />
            <span className="mono-text absolute top-3.5 left-1/2 -translate-x-1/2 font-mono text-[0.5625rem] whitespace-nowrap text-dark/60">{label}</span>
          </span>
        ))}
        <span
          className="absolute top-1/2 z-10 size-[1.125rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-sky-deep shadow-[0_0_0_5px_var(--color-gray-100)]"
          style={{ left: `${you}%` }}
        >
          <span className="absolute bottom-6 left-1/2 -translate-x-1/2 rounded-full border border-sky-deep bg-white px-2.5 py-1 text-xs font-medium whitespace-nowrap text-sky-deep">
            You · {scoreSample.score}
          </span>
        </span>
      </div>
      <p className="text-sm leading-tight text-dark/80">
        Past the idea stage, <span className="font-medium text-sky-deep">three milestones</span> from investor-ready. The Score names your next one.
      </p>
    </>
  );
}

/** Slide 5 — the first lines of the 90-day roadmap the report hands back. */
function RoadmapSlide() {
  return (
    <>
      <Eyebrow left="Your 90-day roadmap" right="Preview" />
      <div className="mt-5 rounded-lg border border-dark/10 bg-gray-100 px-5 py-4">
        <p className="font-medium">Your 90-Day Roadmap</p>
        <ul className="mt-3">
          {scoreSample.roadmap.map(([item, done]) => (
            <li key={item} className="flex items-center gap-2.5 border-t border-dark/10 py-2 text-xs leading-tight first:border-t-0">
              <span
                aria-hidden="true"
                className={`flex size-[0.9375rem] shrink-0 items-center justify-center rounded-[4px] ${done ? "bg-sky-deep text-white" : "border-[1.5px] border-dark/50"}`}
              >
                {done && check}
              </span>
              {item}
              <span className="sr-only">{done ? ", done" : ", next"}</span>
            </li>
          ))}
        </ul>
      </div>
      <p className="mt-4 text-sm leading-tight text-dark/80">
        The full 90-day plan to your first 100 customers: <span className="font-medium text-sky-deep">solo (₹20k), or built with you if you’re one of the 15.</span>
      </p>
    </>
  );
}

/**
 * The sample report: five slides that rotate on a timer, hold while the pointer
 * is over the card, and can be stepped with the dots. Nothing runs until the
 * card has actually scrolled into view, so the count-up is seen, not missed.
 */
function Report({ onStart }: { onStart: () => void }) {
  const card = useRef<HTMLDivElement>(null);
  const [live, setLive] = useState(false);
  const [slide, setSlide] = useState(0);
  const [paused, setPaused] = useState(false);
  const [key, setKey] = useState(0);

  useEffect(() => {
    const el = card.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setLive(true);
          io.disconnect();
        }
      },
      { threshold: 0.25 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!live || paused || reduceMotion()) return;
    const t = setInterval(() => setSlide((s) => (s + 1) % SLIDES), HOLD);
    return () => clearInterval(t);
  }, [live, paused, key]);

  const go = (i: number) => {
    setSlide(i);
    setKey((k) => k + 1); // restart the clock so a click gets its full hold
  };

  const start = () => {
    setPaused(true);
    onStart();
  };

  return (
    <div
      ref={card}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      className="flex min-h-[34rem] w-full max-w-[35rem] flex-col rounded-xl bg-white p-6 shadow-[0_40px_90px_-50px_rgba(22,37,63,0.45)] md:p-9"
    >
      <div key={slide} className="flex-1 motion-safe:animate-[score-in_0.5s_var(--ease-out-expo)_both]" aria-live="polite">
        {live &&
          (slide === 0 ? <ScoreSlide live={live} /> : slide === 1 ? <QuestionSlide onStart={start} /> : slide === 2 ? <ConstraintsSlide /> : slide === 3 ? <ClimbSlide /> : <RoadmapSlide />)}
      </div>
      <div className="mt-5 flex justify-center gap-1.5" role="tablist" aria-label="Pages of the sample report">
        {Array.from({ length: SLIDES }, (_, i) => (
          <button
            key={i}
            type="button"
            role="tab"
            aria-selected={slide === i}
            aria-label={`Page ${i + 1}`}
            onClick={() => go(i)}
            className={`h-1.5 rounded-full transition-all duration-200 outline-dark ${slide === i ? "w-5 bg-dark" : "w-1.5 bg-dark/15 hover:bg-dark/40"}`}
          />
        ))}
      </div>
    </div>
  );
}

/**
 * The score: the claim on the left, the sample report on the right, both on the
 * same sky band the contact card sits on, so the two ends of the page rhyme.
 * Answering the question in the card starts the CTA breathing — the one place
 * the page nudges. The CTA opens the score over the page; /en/score is still
 * there for anyone who wants the URL.
 */
export default function Score() {
  const [pulse, setPulse] = useState(false);
  const [open, setOpen] = useState(false);
  const band = useRef<HTMLDivElement>(null);
  const [seen, setSeen] = useState(false);
  const scored = useCountUp(scoredThisMonth, 1400, seen);

  useEffect(() => {
    const el = band.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setSeen(true);
          io.disconnect();
        }
      },
      { threshold: 0.2 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <Container id="score" className="py-12 md:py-20">
      <div ref={band} className="bg-panel relative isolate overflow-hidden rounded-xl">
        <GradientBackground />
        <div className="relative z-10 grid items-center gap-x-1.5 gap-y-12 px-4 py-8 sm:p-8 lg:grid-cols-12 lg:p-12">
          <div className="lg:col-span-6 lg:pr-8 xl:col-span-6">
            <p className="mono-text font-mono text-dark/75">Every startup has a number. We built the one that decides who we build with.</p>
            <h2 className="mt-5 max-w-[14ch] text-3xl font-medium md:text-4xl">See exactly what’s in your way.</h2>
            <p className="mt-4 max-w-[30ch] text-lg text-dark/80 lg:text-xl">Six pillars. One honest score. No flattery.</p>
            <p className="mono-text mt-3 max-w-[52ch] font-mono text-dark/60">
              Wherever you’re starting from, it’s step one, and the first read we use to choose the 15 we build with.
            </p>

            {/*
              The one thing this section is asking for, so it has to read as a button at
              a glance: a single pill on one line (from `sm`), a soft drop shadow so it
              sits above the panel, and an arrow in a white disc that nudges right on
              hover. It lifts a pixel on hover and presses back down on tap. "Free · 5
              min" lives in the line underneath, so it no longer rides beside the pill.
            */}
            <p className="mt-8">
              <button
                type="button"
                onClick={() => setOpen(true)}
                className={`mono-text group inline-flex w-full items-center justify-center gap-3 rounded-full bg-sky-deep py-2 pr-2 pl-6 text-xs text-white shadow-[inset_0_1px_0_rgb(255_255_255/0.18),0_8px_20px_-8px_rgb(22_37_63/0.55)] outline-offset-2 outline-dark transition-[background-color,transform,box-shadow] duration-200 hover:-translate-y-px hover:bg-dark hover:shadow-[inset_0_1px_0_rgb(255_255_255/0.12),0_12px_24px_-10px_rgb(22_37_63/0.6)] focus-visible:bg-dark active:translate-y-0 active:scale-[0.98] sm:w-auto sm:pl-7 sm:text-sm sm:whitespace-nowrap ${
                  pulse ? "motion-safe:animate-[score-pulse_1.6s_ease-in-out_infinite]" : ""
                }`}
              >
                Take the Startup Operating Score
                <span
                  aria-hidden="true"
                  className="grid size-9 shrink-0 place-items-center rounded-full bg-white text-sm text-sky-deep transition-[color,transform] duration-200 group-hover:translate-x-0.5 group-hover:text-dark sm:size-10"
                >
                  →
                </span>
              </button>
            </p>
            <p className="mt-4 text-sm text-dark/70 italic">The gap you can’t see is the one that ends you.</p>

            <p className="mono-text mt-4 flex flex-wrap items-center gap-x-3 gap-y-1.5 font-mono text-dark/60">
              <span>Free · 5 min · no card</span>
              <span className="inline-flex items-center gap-2">
                <span aria-hidden="true" className="size-1.5 rounded-full bg-sky-deep motion-safe:animate-[score-pip_2s_infinite]" />
                <span className="text-dark tabular-nums">{scored.toLocaleString("en-IN")}</span> founders scored this month
              </span>
            </p>

            <p className="mt-6 max-w-[56ch] border-t border-dark/15 pt-5 text-xs leading-tight text-dark/70">
              You walk away with your <span className="font-medium text-dark">free report</span>: your <span className="font-medium text-dark">archetype</span>, your{" "}
              <span className="font-medium text-dark">top constraints</span> and a <span className="font-medium text-dark">clear next move</span>, yours to keep, even if we never
              work together.
            </p>
          </div>

          <div className="flex flex-col items-center gap-4 lg:col-span-6">
            <Report onStart={() => setPulse(true)} />
            <p className="max-w-[36ch] text-center text-sm text-dark/70">
              <span className="font-medium text-dark">The honest number every founder should know.</span> 5 minutes to find yours.
            </p>
          </div>
        </div>
      </div>
      {open && <ScoreDialog onClose={() => setOpen(false)} />}
    </Container>
  );
}
