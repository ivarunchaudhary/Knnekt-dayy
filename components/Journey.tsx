"use client";

import { useEffect, useRef, useState } from "react";
import { journeyPhases, journeyPillars } from "@/lib/data";
import Container, { SectionHeading } from "./Container";

/** What the founder is doing on any given day of the quarter. */
const statuses = ["Start", "Classes", "Roadmap", "Building", "Customers", "Traction", "Pitch"];
const statusFor = (day: number) => (day <= 3 ? 0 : day <= 10 ? 1 : day <= 16 ? 2 : day <= 45 ? 3 : day <= 82 ? 4 : day <= 89 ? 5 : 6);
/** Customers only start landing once what we built is in market. */
const customersFor = (day: number) => Math.max(0, Math.min(100, Math.round(((day - 45) / 37) * 100)));

/**
 * The 90 days as a spine: a rail that fills as you scroll, a marker that counts
 * Day 1 → Day 90 beside it, and the four phases lighting up as it passes them.
 * Position is written straight to the DOM; only the day and the active phase
 * (which change a few dozen times across the whole section) go through state.
 */
export default function Journey() {
  const rail = useRef<HTMLDivElement>(null);
  const marker = useRef<HTMLDivElement>(null);
  const line = useRef<HTMLSpanElement>(null);
  const fill = useRef<HTMLSpanElement>(null);
  const startDot = useRef<HTMLSpanElement>(null);
  const endDot = useRef<HTMLSpanElement>(null);
  const cards = useRef<(HTMLLIElement | null)[]>([]);
  const [day, setDay] = useState(1);
  const [active, setActive] = useState(0);

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
    <section id="journey" className="py-15 md:py-40">
      <Container>
        <SectionHeading lead="Day 1 to pitch day.">
          Ten live classes to plan the quarter with you, then eighty days where the studio builds and launches it. Scroll it through—the spine counts the days, the pillars come online, and the customers start landing.
        </SectionHeading>

        <div className="mt-10 grid grid-cols-[6rem_1fr] gap-x-2.5 md:grid-cols-[9rem_1fr] md:gap-x-4 lg:mt-16 lg:grid-cols-[12rem_1fr] lg:gap-x-6">
          <div ref={rail} className="relative">
            <span ref={line} className="absolute left-1/2 w-px -translate-x-1/2 rounded bg-black/10" />
            <span ref={fill} className="bg-dark absolute left-1/2 w-px -translate-x-1/2 rounded transition-[height] duration-100 ease-linear" />
            <span ref={startDot} className="border-dark absolute left-1/2 size-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 bg-white" />
            <span ref={endDot} className="bg-dark absolute left-1/2 size-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full" />
            <div ref={marker} className="absolute top-0 left-1/2 z-10 w-full -translate-x-1/2 -translate-y-1/2 transition-[top] duration-100 ease-linear">
              <div className="bg-darker relative rounded-lg p-3 text-white lg:rounded-xl lg:p-4">
                <p className="mono-text text-white/50">Day</p>
                <p className="mt-0.5 text-3xl leading-none font-medium tabular-nums md:text-4xl">{day}</p>
                <ul className="mt-3 hidden space-y-1.5 md:block">
                  {journeyPillars.map(([name, from]) => (
                    <li key={name} className={`mono-text flex items-center gap-1.5 transition-colors duration-500 ${day >= from ? "text-white" : "text-white/25"}`}>
                      <span className={`size-1.5 shrink-0 rounded-full transition-colors duration-500 ${day >= from ? "bg-white" : "bg-white/25"}`} />
                      {name}
                    </li>
                  ))}
                </ul>
                <p className="mono-text mt-3 hidden text-white/50 tabular-nums md:block">{customers} customers</p>
                <span className="mono-text text-dark absolute top-full left-1/2 mt-2 -translate-x-1/2 rounded-full bg-white px-3 py-1.5 whitespace-nowrap ring-1 ring-black/10">
                  {status}
                </span>
              </div>
            </div>
          </div>

          <ol className="flex flex-col gap-1.5 lg:gap-2">
            {journeyPhases.map((phase, i) => {
              const on = active === i;
              const dark = i === journeyPhases.length - 1;
              return (
                <li
                  key={phase.title}
                  ref={(el) => {
                    cards.current[i] = el;
                  }}
                  className={`ease-in-out-quart border p-6 transition-all duration-500 md:p-10 ${on ? "rounded-2xl" : "rounded-lg"} ${
                    dark ? "bg-darker border-transparent text-white" : on ? "border-black/15 bg-white" : "border-black/5 bg-gray-100"
                  }`}
                >
                  <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-3">
                    <h3 className={`text-3xl font-medium transition-colors duration-500 md:text-4xl ${dark ? "text-white" : on ? "text-dark" : "text-dark-very-subtle"}`}>
                      {phase.days}
                    </h3>
                    <span
                      className={`mono-text rounded-full border px-3 py-1.5 transition-colors duration-500 ${
                        dark ? "border-white/25 text-white/70" : on ? "text-dark border-black/20" : "text-dark-very-subtle border-black/10"
                      }`}
                    >
                      {phase.tag}
                    </span>
                  </div>
                  <p className={`mt-5 text-xl font-medium lg:text-2xl ${dark ? "text-white" : ""}`}>{phase.title}</p>
                  <p className={`mt-2 max-w-[36rem] text-sm ${dark ? "text-white/60" : "text-dark-subtle"}`}>{phase.body}</p>
                  <ul className="mt-8 grid gap-1.5 sm:grid-cols-3">
                    {phase.bars.map(([label, note]) => (
                      <li key={label} className={`rounded-lg px-4 pt-4 pb-5 transition-colors duration-500 ${dark ? "bg-white/8" : "bg-gray-200"}`}>
                        <p className="flex items-baseline gap-2 font-medium">
                          <span className={`size-2 shrink-0 rounded-full ${dark ? "bg-white" : "bg-dark"}`} />
                          {label}
                        </p>
                        <p className={`mt-1 text-xs ${dark ? "text-white/50" : "text-dark-subtle"}`}>{note}</p>
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
