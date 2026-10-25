"use client";

import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import Container, { SectionHeading } from "./Container";
import ScoreButton from "./ScoreButton";

/**
 * How a founder gets one of the 15 seats, in four steps. The steps land left to
 * right as the line under them fills, then the active step cycles so the eye
 * keeps moving along the path.
 */

/** How long each step stays lit before the next one takes over. */
const CYCLE = 2200;
/** Wait for the reveal (line fill + staggered steps) to finish before cycling. */
const REVEAL = 2600;

const icon = (children: ReactNode) => (
  <svg viewBox="0 0 48 48" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="3">
    {children}
  </svg>
);

const steps: { title: string; body: string; icon: ReactNode }[] = [
  {
    title: "Take the score.",
    body: "Five minutes. Your report arrives straight away.",
    icon: icon(
      <>
        <circle cx="24" cy="26" r="15" />
        <path d="M24 26l7-7" strokeLinecap="round" />
        <circle cx="24" cy="26" r="2.6" fill="currentColor" stroke="none" />
        <path d="M12 33h24" strokeLinecap="round" opacity=".35" />
      </>,
    ),
  },
  {
    title: "We call you within 24 hours.",
    body: "We read your report with you, honestly.",
    icon: icon(
      <path
        d="M15 11h6l3 8-4 3a20 20 0 0 0 8 8l3-4 8 3v6a3 3 0 0 1-3 3A26 26 0 0 1 12 14a3 3 0 0 1 3-3z"
        strokeLinejoin="round"
      />,
    ),
  },
  {
    title: "Selection Session at our studio.",
    body: "A group session with founders like you, then a one-on-one.",
    icon: icon(
      <>
        <circle cx="16" cy="18" r="5" />
        <circle cx="32" cy="18" r="5" />
        <path d="M7 36q9-12 18 0M23 36q9-12 18 0" strokeLinecap="round" />
      </>,
    ),
  },
  {
    title: "A decision within 24 hours.",
    body: "If you’re selected, ₹15,000 + GST holds your seat.",
    icon: icon(
      <>
        <path d="M24 8l13 5v10c0 9-6 15-13 18-7-3-13-9-13-18V13z" strokeLinejoin="round" />
        <path d="M18 24l5 5 9-10" strokeLinecap="round" strokeLinejoin="round" />
      </>,
    ),
  },
];

export default function Selection() {
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(-1);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    // Server HTML shows every step; the steps are only hidden once script is here to reveal them.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || !("IntersectionObserver" in window)) {
      el.classList.add("is-in");
      return;
    }
    el.classList.add("is-waiting");
    let revealed = false;
    let start = 0;
    let cycle = 0;
    const tick = () => setActive((k) => (k + 1) % steps.length);
    const io = new IntersectionObserver(
      ([e]) => {
        clearTimeout(start);
        clearInterval(cycle);
        if (!e.isIntersecting) return;
        if (!revealed) {
          revealed = true;
          el.classList.replace("is-waiting", "is-in");
          start = window.setTimeout(() => {
            tick();
            cycle = window.setInterval(tick, CYCLE);
          }, REVEAL);
        } else {
          cycle = window.setInterval(tick, CYCLE);
        }
      },
      { threshold: 0.35 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      clearTimeout(start);
      clearInterval(cycle);
    };
  }, []);

  return (
    <section id="selection" className="py-12 md:py-28">
      <Container as="div">
        <SectionHeading lead="How we select our 15 founders.">
          We only take founders we believe we can get funded, by investors and through the government schemes built for
          startups.
        </SectionHeading>

        <div
          ref={ref}
          className="kn-process mt-12 lg:mt-20"
        >
          <span className="kn-track" aria-hidden="true">
            <i className="kn-track-fill" />
          </span>
          <ol className="kn-steps" aria-label="How selection works, in four steps">
            {steps.map((s, i) => (
              <li key={s.title} className={`kn-step ${active === i ? "is-on" : ""}`} style={{ "--i": i } as CSSProperties}>
                <span className="kn-step-node">
                  {s.icon}
                  <span className="kn-step-num mono-text font-mono" aria-hidden="true">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </span>
                <p className="kn-step-title">{s.title}</p>
                <p className="kn-step-body">{s.body}</p>
              </li>
            ))}
          </ol>
        </div>

        <p className="text-dark-subtle mt-8 max-w-[56ch] text-sm leading-tight lg:mt-12">
          A low score doesn’t rule you out. It shows us where to start.
        </p>
        <div className="mt-6">
          <ScoreButton className="mono-text group inline-flex w-full items-center justify-center gap-3 rounded-full bg-sky-deep py-2 pr-2 pl-6 text-xs text-white shadow-[inset_0_1px_0_rgb(255_255_255/0.18),0_8px_20px_-8px_rgb(22_37_63/0.55)] outline-offset-2 outline-dark transition-[background-color,transform,box-shadow] duration-200 hover:-translate-y-px hover:bg-dark hover:shadow-[inset_0_1px_0_rgb(255_255_255/0.12),0_12px_24px_-10px_rgb(22_37_63/0.6)] focus-visible:bg-dark active:translate-y-0 active:scale-[0.98] sm:w-auto sm:pl-7 sm:text-sm sm:whitespace-nowrap">
            Take the Startup Operating Score
            <span
              aria-hidden="true"
              className="grid size-9 shrink-0 place-items-center rounded-full bg-white text-sm text-sky-deep transition-[color,transform] duration-200 group-hover:translate-x-0.5 group-hover:text-dark sm:size-10"
            >
              →
            </span>
          </ScoreButton>
        </div>
      </Container>
    </section>
  );
}
