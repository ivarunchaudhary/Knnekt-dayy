"use client";

import { type ReactNode, useEffect, useState } from "react";
import { journey, scoreSample } from "@/lib/data";
import Container, { SectionHeading } from "./Container";

const reduceMotion = () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/** The cap itself: fifteen seats in the quarter, and no sixteenth. */
const SEATS = 15;
/** Seats claimed in a scattered order rather than left to right, so it reads as founders arriving, not a progress bar. */
const ARRIVAL = [7, 2, 11, 4, 13, 0, 9, 6, 14, 3, 8, 12, 1, 10, 5];
const RANK = Array.from({ length: SEATS }, (_, seat) => ARRIVAL.indexOf(seat));
/** Each seat lands on its own beat; the three beats past fifteen are the quarter sitting closed before it opens again. */
const BEAT = 280;
const HOLD = 3;

/** The cohort filling up: fifteen seats claimed one at a time, then the quarter closes and the next one opens. */
function CohortGrid() {
  const [taken, setTaken] = useState(SEATS);
  useEffect(() => {
    if (reduceMotion()) return;
    let n = SEATS; // the card arrives full, holds, then the next quarter opens
    const t = setInterval(() => {
      n = n >= SEATS + HOLD ? 0 : n + 1;
      setTaken(Math.min(n, SEATS));
    }, BEAT);
    return () => clearInterval(t);
  }, []);
  const full = taken === SEATS;
  return (
    <div className="bg-panel aspect-square overflow-hidden rounded-lg" role="img" aria-label="Fifteen founders a quarter, and no more">
      <div className="relative flex size-full flex-col items-center justify-center gap-2 p-3 pb-6">
        <div aria-hidden="true" className="grid w-full grid-cols-5 gap-1.5">
          {RANK.map((rank, seat) => {
            const claimed = rank < taken;
            const newest = rank === taken - 1;
            return (
              <span
                key={seat}
                className={`aspect-square rounded-[0.1875rem] transition-all duration-500 ease-out ${
                  claimed ? "bg-dark" : "bg-dark/15"
                }`}
                style={{
                  transform: claimed ? `scale(${newest && !full ? 1.18 : 1})` : "scale(0.72)",
                  opacity: claimed ? 1 : 0.9,
                }}
              />
            );
          })}
        </div>
        <span
          className={`mono-text absolute right-0 bottom-3 left-0 text-center transition-colors duration-500 ${
            full ? "text-dark" : "text-dark/70"
          }`}
        >
          {full ? "Cohort full" : `${String(taken).padStart(2, "0")} / ${SEATS}`}
        </span>
      </div>
    </div>
  );
}

/** Beats the bars sit flat before they climb, beats the number takes to arrive, and the whole cycle. */
const SCORE_BEAT = 60;
const SCORE_DROP = 8;
const SCORE_CLIMB = 17;
const SCORE_CYCLE = 70;

/** The score being taken: six pillars measured, and a number that lands where it lands. */
function ScoreMeter() {
  const [k, setK] = useState(SCORE_DROP + SCORE_CLIMB);
  useEffect(() => {
    if (reduceMotion()) return;
    let n = SCORE_DROP + SCORE_CLIMB; // the card arrives scored, holds, then measures again
    const t = setInterval(() => {
      n = (n + 1) % SCORE_CYCLE;
      setK(n);
    }, SCORE_BEAT);
    return () => clearInterval(t);
  }, []);
  const grown = k >= SCORE_DROP;
  const p = Math.min(Math.max((k - SCORE_DROP) / SCORE_CLIMB, 0), 1);
  const n = grown ? Math.round(scoreSample.score * (1 - Math.pow(1 - p, 3))) : 0;
  return (
    <div
      className="bg-panel aspect-square overflow-hidden rounded-lg"
      role="img"
      aria-label={`Six pillars scored out of a hundred: a sample founder at ${scoreSample.score}`}
    >
      <div className="relative flex size-full flex-col p-3 pb-6">
        <div aria-hidden="true" className="flex flex-1 items-end gap-1.5">
          {scoreSample.bars.map((h, i) => (
            <span key={i} className="flex h-full flex-1 items-end">
              {/* The two pillars the report flags stay pale and short: the number isn’t there to flatter. */}
              <span
                className={`ease-out-expo block w-full rounded-t-[0.1875rem] transition-[height] duration-[900ms] ${
                  scoreSample.weak.includes(i) ? "bg-dark/25" : "bg-dark"
                }`}
                style={{ height: grown ? `${h}%` : 0, transitionDelay: `${i * 70}ms` }}
              />
            </span>
          ))}
        </div>
        <span className="mono-text text-dark/70 absolute right-0 bottom-3 left-0 text-center">
          <span className="text-dark">{String(n).padStart(2, "0")}</span> / 100
        </span>
      </div>
    </div>
  );
}

/** Monoline, 40×40, drawn on the panel in ink — small enough to read at a glance on a 124px card. */
const pen = {
  viewBox: "0 0 40 40",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.6,
  strokeLinecap: "round",
  strokeLinejoin: "round",
  className: "size-[3.25rem]",
} as const;

/**
 * What the 300+ were: a shopfront, an app, a first shipment, a payment, a lab, a
 * chart that finally turned. Every stage and every industry, drawn rather than
 * listed — the row already says it in words, so the card shows it instead.
 */
const SKETCHES: ReactNode[] = [
  <svg key="shopfront" {...pen}>
    <path d="M8.5 13.5 10.5 8h19l2 5.5" />
    <path d="M6 13.5h28" />
    <path d="M8.5 13.5V33h23V13.5" />
    <path d="M16.5 33v-9h7v9" />
    <path d="M11 18.5h4.5v4H11z" />
  </svg>,
  <svg key="app" {...pen}>
    <rect x="13" y="5.5" width="14" height="29" rx="3" />
    <path d="M17.5 11h5" />
    <path d="M17 16.5h6M17 21h6" />
    <circle cx="20" cy="29" r="1.2" />
  </svg>,
  <svg key="shipment" {...pen}>
    <path d="M20 6.5 33 12.5 20 18.5 7 12.5z" />
    <path d="M7 12.5v14.8L20 33.5l13-6.2V12.5" />
    <path d="M20 18.5v15" />
  </svg>,
  <svg key="payment" {...pen}>
    <rect x="5" y="10.5" width="30" height="19" rx="2.5" />
    <path d="M5 16.5h30" />
    <path d="M10 23.5h7" />
  </svg>,
  <svg key="lab" {...pen}>
    <path d="M16 6v10L8.4 30.3A2.4 2.4 0 0 0 10.5 34h19a2.4 2.4 0 0 0 2.1-3.7L24 16V6" />
    <path d="M13.5 6h13" />
    <path d="M12 24.5h16" />
  </svg>,
  <svg key="chart" {...pen}>
    <path d="M7 6.5v27h27" />
    <path d="M12 28l6-6 5 3 8-11" />
    <path d="M26.5 14H31v4.5" />
  </svg>,
];

/** How long each line of a ticker holds before the next one. */
const TICK = 1600;

/**
 * A card that shows one thing at a time — a line of type, or a drawing — while the
 * figure at the foot stays put. `alt` is for the reels that are pictures: it puts the
 * meaning on the card and takes the drawings out of the reading order.
 */
function Ticker({ items, label, alt }: { items: ReactNode[]; label?: string; alt?: string }) {
  const [i, setI] = useState(0);
  useEffect(() => {
    if (reduceMotion()) return;
    const t = setInterval(() => setI((x) => (x + 1) % items.length), TICK);
    return () => clearInterval(t);
  }, [items.length]);
  return (
    <div className="bg-panel aspect-square overflow-hidden rounded-lg" role={alt ? "img" : undefined} aria-label={alt}>
      <div className="relative flex size-full items-center justify-center p-3 text-center">
        {items.map((item, k) => (
          <span
            key={k}
            aria-hidden={alt ? true : undefined}
            // The line leaving goes before the line arriving starts, or the two read as one smudge.
            className={`absolute inset-x-3 top-3 bottom-7 flex items-center justify-center text-sm leading-tight font-medium transition-all ${
              k === i ? "translate-y-0 opacity-100 delay-200 duration-500" : "translate-y-3 opacity-0 duration-200"
            }`}
          >
            {item}
          </span>
        ))}
        <span className="mono-text text-dark/70 absolute right-0 bottom-3 left-0 text-center">
          {label ?? `${String(i + 1).padStart(2, "0")} / ${String(items.length).padStart(2, "0")}`}
        </span>
      </div>
    </div>
  );
}

const rowClass = "grid gap-x-1.5 gap-y-4 border-dark/10 py-7 lg:grid-cols-2";

export default function Facts() {
  return (
    <Container className="py-12 md:py-28">
      <SectionHeading lead="Curious how the quarter actually works?">Here’s the studio in numbers: the cohort, the ninety days, the experience behind it, and the score that decides who we build with.</SectionHeading>
      <ul className="mt-8 space-y-5 md:mt-14">
        <li className={`${rowClass} sm:border-t`}>
          <h3 className="text-3xl font-medium md:text-4xl">15 Founders</h3>
          <div className="contents justify-between gap-8 sm:flex">
            <p className="text-dark-subtle text-sm md:max-w-[36rem]">
              <span className="text-dark transition-colors duration-500">We take fifteen founders a quarter, and no more.</span> We choose them from the score, the report and the call, on readiness rather than polish. It’s a small number on purpose: the cohort builds in parallel, learns in parallel, and every founder gets the whole studio rather than a slice of it.
            </p>
            <div className="order-first w-[7.75rem] shrink-0 sm:order-none">
              <CohortGrid />
            </div>
          </div>
        </li>
        <li className={`${rowClass} border-t`}>
          <h3 className="text-3xl font-medium md:text-4xl">90 Days, Under ₹3L</h3>
          <div className="contents justify-between gap-8 sm:flex">
            <p className="text-dark-subtle text-sm md:max-w-[36rem]">
              <span className="text-dark transition-colors duration-500">Ten live classes to plan it with you, eighty days to build and launch it.</span> One fixed price and a scope that moves with the plan, so nothing is billed by surprise. By day 90 you have customers using what we built, the metrics and the narrative to raise on, and a pitch day to say it out loud.
            </p>
            <div className="order-first w-[7.75rem] shrink-0 sm:order-none">
              <Ticker items={journey} />
            </div>
          </div>
        </li>
        <li className={`${rowClass} border-t`}>
          <h3 className="text-3xl font-medium md:text-4xl">300+ Startups</h3>
          <div className="contents justify-between gap-8 sm:flex">
            <p className="text-dark-subtle text-sm md:max-w-[36rem]">
              <span className="text-dark transition-colors duration-500">Everything here is built on what we learned across 300+ startups</span>: every stage, every industry, and plenty of expensive mistakes that weren’t ours to repeat. The wrong hires, the compliance surprises, the money that went nowhere: we’ve seen where they come from, and we build to keep you out of them.
            </p>
            <div className="order-first w-[7.75rem] shrink-0 sm:order-none">
              <Ticker items={SKETCHES} label="300+ seen" alt="Every stage and every industry: the 300+ startups behind the studio, sketch by sketch" />
            </div>
          </div>
        </li>
        <li className={`${rowClass} border-t`}>
          <h3 className="text-3xl font-medium md:text-4xl">One Honest Score</h3>
          <div className="contents justify-between gap-8 sm:flex">
            <p className="text-dark-subtle text-sm md:max-w-[36rem]">
              <span className="text-dark transition-colors duration-500">Every startup has a number. We built the one that decides who we build with.</span> Six pillars, five minutes, no card and no flattery. You walk away with a free report: your archetype, your top constraints and a clear next move, yours to keep, even if we never work together.
            </p>
            <div className="order-first w-[7.75rem] shrink-0 sm:order-none">
              <ScoreMeter />
            </div>
          </div>
        </li>
      </ul>
    </Container>
  );
}
