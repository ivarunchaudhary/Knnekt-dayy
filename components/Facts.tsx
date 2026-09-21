"use client";

import { useEffect, useState } from "react";
import { journey, studioVimeo, studioVimeoAspect, scoreVimeo, scoreVimeoAspect, team } from "@/lib/data";
import Container, { SectionHeading } from "./Container";
import Vimeo from "./Vimeo";

/** Shuffling stack of founder portraits: the front card slides away and a new one comes forward. */
function TeamStack() {
  const [front, setFront] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setFront((f) => (f + 1) % team.length), 1800);
    return () => clearInterval(t);
  }, []);
  const visible = 5;
  return (
    <div className="relative size-31">
      {team.map((m, i) => {
        const pos = (i - front + team.length) % team.length; // 0 = front
        const shown = pos < visible;
        const offset = Math.min(pos, visible - 1) * 7;
        return (
          <div
            key={m.src}
            className="absolute top-0 left-0 size-24 rounded-lg border-[3px] border-white transition-all duration-500 ease-out"
            style={{
              zIndex: visible - pos,
              opacity: shown ? 1 : 0,
              transform: `translate(${offset}px, ${offset}px) scale(${1 - Math.min(pos, visible - 1) * 0.03})`,
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img alt={m.alt} loading="lazy" decoding="async" width={640} height={640} className="size-full rounded-lg object-cover" sizes="6rem" src={m.src} />
          </div>
        );
      })}
    </div>
  );
}

/** Rotating ticker through the stages of the 90 days. */
function JourneyBox() {
  const [i, setI] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setI((x) => (x + 1) % journey.length), 1600);
    return () => clearInterval(t);
  }, []);
  return (
    <div className="bg-panel aspect-square overflow-hidden rounded-lg">
      <div className="relative flex size-full items-center justify-center p-3 text-center">
        {journey.map((stage, k) => (
          <span
            key={stage}
            className={`absolute inset-3 flex items-center justify-center text-sm font-medium leading-tight transition-all duration-500 ${
              k === i ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"
            }`}
          >
            {stage}
          </span>
        ))}
        <span className="mono-text absolute bottom-3 left-0 right-0 text-center text-dark/70">{String(i + 1).padStart(2, "0")} / {String(journey.length).padStart(2, "0")}</span>
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
              <TeamStack />
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
              <JourneyBox />
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
              <div className="overflow-hidden relative size-[7.75rem] rounded-lg bg-gray-200">
                <Vimeo id={studioVimeo} aspect={studioVimeoAspect} title="The studio" cover />
              </div>
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
              <div className="overflow-hidden relative size-[7.75rem] rounded-lg bg-gray-200">
                <Vimeo id={scoreVimeo} aspect={scoreVimeoAspect} title="Startup Operating Score" cover />
              </div>
            </div>
          </div>
        </li>
      </ul>
    </Container>
  );
}
