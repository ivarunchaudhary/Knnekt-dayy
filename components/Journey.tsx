"use client";

import { useEffect, useRef, useState } from "react";
import { journeyPhases, journeyPillars } from "@/lib/data";
import Container, { SectionHeading } from "./Container";

/** What the founder is doing on any given day of the quarter. */
const statuses = ["Start", "Classes", "Roadmap", "Building", "Customers", "Traction", "Pitch"];
const statusFor = (day: number) => (day <= 3 ? 0 : day <= 10 ? 1 : day <= 16 ? 2 : day <= 45 ? 3 : day <= 82 ? 4 : day <= 89 ? 5 : 6);
/** Customers only start landing once what we built is in market. */
const customersFor = (day: number) => Math.max(0, Math.min(100, Math.round(((day - 45) / 37) * 100)));

/** Every day of the quarter, stacked once so the readout can scroll to one of them. */
const allDays = Array.from({ length: 90 }, (_, i) => String(i + 1).padStart(2, "0"));
/** Decade marks on the spine, so the eye has something to measure the travel against. */
const decades = [10, 20, 30, 40, 50, 60, 70, 80];
/** Height of one cell in the day reel, in ems of the number's own size. */
const CELL = "1em";

/**
 * The 90 days as a spine: a ruled rail that fills as you scroll, a readout that counts
 * Day 1 → Day 90 alongside it, and the four phases lighting up as it passes them.
 * Position is written straight to the DOM; only the day and the active phase
 * (which change a few dozen times across the whole section) go through state.
 *
 * The readout is drawn as an instrument rather than a card — no fill, no border, just
 * two hairlines and a block of white wide enough to interrupt the spine where it sits,
 * so the rail reads as one continuous measure with a cursor riding it. The count itself
 * is a mechanical reel: all ninety numbers stacked in a one-line window, the strip
 * translated to bring the current day into view. Scrolling the page spins it, in either
 * direction, with no wrap to fake — which is the whole conceit of the section made
 * literal. Everything else in the readout is hairline and mono; the only solid mass is
 * the status slug, so the last phase card stays the one solid mass on the page.
 */
export default function Journey() {
  const rail = useRef<HTMLDivElement>(null);
  const marker = useRef<HTMLDivElement>(null);
  const line = useRef<HTMLSpanElement>(null);
  const fill = useRef<HTMLSpanElement>(null);
  const startDot = useRef<HTMLSpanElement>(null);
  const endDot = useRef<HTMLSpanElement>(null);
  const ticks = useRef<(HTMLSpanElement | null)[]>([]);
  const cards = useRef<(HTMLLIElement | null)[]>([]);
  const [day, setDay] = useState(1);
  const [active, setActive] = useState(0);
  // How many days either side of the readout the marker physically covers, so a decade
  // mark can get out of the way before the cursor clips it rather than after.
  const [reach, setReach] = useState(11);

  useEffect(() => {
    const railEl = rail.current;
    const markerEl = marker.current;
    const lineEl = line.current;
    const fillEl = fill.current;
    if (!railEl || !markerEl || !lineEl || !fillEl) return;

    // The line stops half a marker short of each end, so the marker never hangs off the rail.
    let lineTop = 8;
    let lineBot = 92;
    // Progress at which the last card (pitch day) arrives — the day counter holds at 90 from there.
    let pitchStart = 0.85;
    let raf = 0;

    const place = () => {
      const r = railEl.getBoundingClientRect();
      const railH = r.height || 1;
      const half = Math.min(32, (markerEl.offsetHeight / 2 / railH) * 100);
      lineTop = half;
      lineBot = 100 - half;
      lineEl.style.top = `${lineTop}%`;
      lineEl.style.height = `${lineBot - lineTop}%`;
      fillEl.style.top = `${lineTop}%`;
      if (startDot.current) startDot.current.style.top = `${lineTop}%`;
      if (endDot.current) endDot.current.style.top = `${lineBot}%`;
      const last = cards.current[cards.current.length - 1];
      if (last) {
        const q = last.getBoundingClientRect();
        pitchStart = Math.max(0.05, Math.min(0.985, (q.top - r.top) / railH));
      }
      // Days 1–89 are spread over the run up to pitch day, so each decade mark lands on
      // exactly the point where the counter reads it. Day 90 is the end dot already.
      const span = lineBot - lineTop;
      decades.forEach((d, i) => {
        const tick = ticks.current[i];
        if (tick) tick.style.top = `${lineTop + ((d - 1) / 88) * pitchStart * span}%`;
      });
      setReach((half * 88) / Math.max(0.0001, pitchStart * span) + 1);
    };

    const settle = () => {
      // Reduced motion: show the finished quarter rather than animating one.
      markerEl.style.top = `${lineBot}%`;
      fillEl.style.height = `${lineBot - lineTop}%`;
      setDay(90);
      setActive(journeyPhases.length - 1);
    };

    const update = () => {
      raf = 0;
      const r = railEl.getBoundingClientRect();
      const focus = window.innerHeight * 0.42;
      const progress = Math.max(0, Math.min(1, (focus - r.top) / (r.height || 1)));
      const centre = lineTop + progress * (lineBot - lineTop);
      markerEl.style.top = `${centre}%`;
      fillEl.style.height = `${Math.max(0, centre - lineTop)}%`;
      const raw = progress < pitchStart ? 1 + (progress / pitchStart) * 88 : 90;
      setDay(Math.max(1, Math.min(90, Math.round(raw))));

      let best = 0;
      let bestDistance = Infinity;
      cards.current.forEach((card, i) => {
        if (!card) return;
        const cr = card.getBoundingClientRect();
        const distance = Math.abs(cr.top + cr.height / 2 - focus);
        if (distance < bestDistance) {
          bestDistance = distance;
          best = i;
        }
      });
      setActive(best);
    };

    place();
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      settle();
      return;
    }

    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    const onResize = () => {
      place();
      schedule();
    };
    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", onResize);
    const ro = new ResizeObserver(onResize);
    ro.observe(railEl);
    return () => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", onResize);
      ro.disconnect();
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  const status = statuses[statusFor(day)];
  const customers = customersFor(day);

  return (
    <section id="journey" className="py-12 md:py-28">
      <Container>
        <SectionHeading lead="Day 1 to pitch day.">
          Ten live classes to plan the quarter with you, then eighty days where the studio builds and launches it. Scroll it through—the spine counts the days, the pillars come online, and the customers start landing.
        </SectionHeading>

        <div className="mt-10 grid grid-cols-[6rem_1fr] gap-x-2.5 md:grid-cols-[11rem_1fr] md:gap-x-4 lg:mt-16 lg:grid-cols-[12rem_1fr] lg:gap-x-6">
          <div ref={rail} className="relative">
            <span ref={line} className="absolute left-1/2 w-px -translate-x-1/2 rounded bg-dark/10" />
            <span ref={fill} className="bg-dark absolute left-1/2 w-px -translate-x-1/2 rounded transition-[height] duration-100 ease-linear" />
            {/* Decade marks: the rail as a ruler, so the travel is measured and not just long. */}
            {decades.map((d, i) => (
              <span
                key={d}
                aria-hidden="true"
                ref={(el) => {
                  ticks.current[i] = el;
                }}
                className={`ease-in-out-quart absolute left-1/2 -translate-x-1/2 -translate-y-1/2 transition-opacity duration-500 ${
                  Math.abs(day - d) < reach ? "opacity-0" : "opacity-100"
                }`}
              >
                <span className={`ease-in-out-quart block h-px w-2.5 transition-colors duration-500 md:w-3 ${day >= d ? "bg-dark" : "bg-dark/15"}`} />
                <span
                  className={`mono-text ease-in-out-quart absolute top-1/2 left-5 hidden -translate-y-1/2 tabular-nums transition-colors duration-500 md:block ${
                    day >= d ? "text-dark-subtle" : "text-dark-very-subtle"
                  }`}
                >
                  {d}
                </span>
              </span>
            ))}
            <span ref={startDot} className="border-dark absolute left-1/2 size-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 bg-white" />
            <span ref={endDot} className="bg-dark absolute left-1/2 size-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full" />

            <div ref={marker} className="absolute top-0 left-0 z-10 w-full -translate-y-1/2 transition-[top] duration-100 ease-linear">
              {/* No fill and no border — just white wide enough to break the spine, ruled top and bottom. */}
              <div className="relative bg-white py-3.5 md:py-4">
                <span className="bg-dark block h-px w-full" />
                <p className="mono-text text-dark-very-subtle mt-3">Day</p>
                <p className="mt-0.5 flex items-end gap-2">
                  <span className="text-4xl leading-none font-medium tracking-tight tabular-nums lg:text-5xl">
                    <span className="sr-only">Day {day} of 90</span>
                    {/* The reel: ninety numbers in a one-line window, scrolled to today. */}
                    <span aria-hidden="true" className="block overflow-hidden" style={{ height: CELL }}>
                      <span
                        className="ease-in-out-quart block transition-transform duration-500 motion-reduce:transition-none"
                        style={{ transform: `translateY(calc(${CELL} * ${1 - day}))` }}
                      >
                        {allDays.map((d) => (
                          <span key={d} className="block" style={{ height: CELL, lineHeight: CELL }}>
                            {d}
                          </span>
                        ))}
                      </span>
                    </span>
                  </span>
                  <span className="mono-text text-dark-very-subtle pb-0.5">/ 90</span>
                </p>

                <ul className="mt-4 hidden space-y-1.5 md:block lg:mt-5">
                  {journeyPillars.map(([name, from]) => {
                    const on = day >= from;
                    return (
                      <li key={name} className={`mono-text ease-in-out-quart flex items-center gap-2 transition-colors duration-500 ${on ? "text-dark" : "text-dark-very-subtle"}`}>
                        {/* The dot is always an empty ring; it fills the moment the pillar comes online. */}
                        <span className={`ease-in-out-quart relative size-2.5 shrink-0 rounded-full border transition-colors duration-500 ${on ? "border-dark" : "border-dark/15"}`}>
                          <span
                            className={`bg-dark absolute inset-0 rounded-full transition-transform duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${on ? "scale-100" : "scale-0"}`}
                          />
                        </span>
                        {name}
                      </li>
                    );
                  })}
                </ul>

                <p
                  className={`mono-text ease-in-out-quart mt-4 hidden tabular-nums transition-colors duration-500 md:block lg:mt-5 ${
                    customers > 0 ? "text-dark-subtle" : "text-dark-very-subtle"
                  }`}
                >
                  {customers} customers
                </p>

                <span className="bg-dark mt-3.5 block h-px w-full md:mt-4" />
                <span className="bg-dark mono-text absolute top-full left-0 mt-2 rounded-full px-3 py-1.5 whitespace-nowrap text-white">{status}</span>
              </div>
            </div>
          </div>

          <ol className="flex flex-col gap-1.5 lg:gap-2">
            {journeyPhases.map((phase, i) => {
              const on = active === i;
              // The last phase is the one the section is driving at, so it gets the
              // panel fill — the deepest step on the sky ramp — while its siblings sit on
              // white or `gray-100`. It used to invert to navy instead, which is why the
              // branches below collapsed once the page stopped having a dark plate: on a
              // light panel the type is the page's own ink either way.
              const feature = i === journeyPhases.length - 1;
              return (
                <li
                  key={phase.title}
                  ref={(el) => {
                    cards.current[i] = el;
                  }}
                  className={`ease-in-out-quart border p-6 transition-all duration-500 md:p-10 ${on ? "rounded-2xl" : "rounded-lg"} ${
                    feature ? "bg-panel border-transparent" : on ? "border-dark/15 bg-white" : "border-dark/5 bg-gray-100"
                  }`}
                >
                  <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-3">
                    <h3 className={`text-3xl font-medium transition-colors duration-500 md:text-4xl ${feature || on ? "text-dark" : "text-dark-very-subtle"}`}>
                      {phase.days}
                    </h3>
                    <span
                      className={`mono-text rounded-full border px-3 py-1.5 transition-colors duration-500 ${
                        feature || on ? "text-dark border-dark/20" : "text-dark-very-subtle border-dark/10"
                      }`}
                    >
                      {phase.tag}
                    </span>
                  </div>
                  <p className="mt-5 text-xl font-medium lg:text-2xl">{phase.title}</p>
                  <p className={`mt-2 max-w-[36rem] text-sm ${feature ? "text-dark/80" : "text-dark-subtle"}`}>{phase.body}</p>
                  <ul className="mt-8 grid gap-1.5 sm:grid-cols-3">
                    {phase.bars.map(([label, note]) => (
                      <li key={label} className={`rounded-lg px-4 pt-4 pb-5 transition-colors duration-500 ${feature ? "bg-white/60" : "bg-gray-200"}`}>
                        <p className="flex items-baseline gap-2 font-medium">
                          <span className="bg-dark size-2 shrink-0 rounded-full" />
                          {label}
                        </p>
                        <p className="text-dark-subtle mt-1 text-xs">{note}</p>
                      </li>
                    ))}
                  </ul>
                </li>
              );
            })}
          </ol>
        </div>
      </Container>
    </section>
  );
}
