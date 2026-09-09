"use client";

import { useEffect, useState } from "react";
import { bcorpLogo, officesVimeo, officesVimeoAspect, team } from "@/lib/data";
import Container, { SectionHeading } from "./Container";
import Vimeo from "./Vimeo";

/** Shuffling stack of team portraits: the front card slides away and a new one comes forward. */
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

const awards = ["Red Dot", "iF Design", "Awwwards", "German Design Award", "CSS Design Awards", "German Brand Award"];

/** Rotating award ticker (the original renders this on a canvas). */
function AwardsBox() {
  const [i, setI] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setI((x) => (x + 1) % awards.length), 1600);
    return () => clearInterval(t);
  }, []);
  return (
    <div className="aspect-square overflow-hidden rounded-lg bg-darker text-white">
      <div className="relative flex size-full items-center justify-center p-3 text-center">
        {awards.map((a, k) => (
          <span
            key={a}
            className={`absolute inset-3 flex items-center justify-center text-sm font-medium leading-tight transition-all duration-500 ${
              k === i ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"
            }`}
          >
            {a}
          </span>
        ))}
        <span className="mono-text absolute bottom-3 left-0 right-0 text-center text-white/50">{String(i + 1).padStart(2, "0")} / {String(awards.length).padStart(2, "0")}</span>
      </div>
    </div>
  );
}

const rowClass = "grid gap-x-1.5 gap-y-4 border-black/10 py-7 lg:grid-cols-2";

export default function Facts() {
  return (
    <Container className="py-15 md:py-40">
      <SectionHeading lead="Curious about who we are?">Here’s a snapshot of the team, our achievements, and the milestones we’re proud of.</SectionHeading>
      <ul className="mt-8 space-y-5 md:mt-14">
        <li className={`${rowClass} sm:border-t`}>
          <h3 className="text-3xl font-medium md:text-4xl">30+ People</h3>
          <div className="contents justify-between gap-8 sm:flex">
            <p className="text-dark-subtle text-sm md:max-w-[36rem]">
              <span className="text-dark transition-colors duration-500">We’re a small, but mighty team of curious problem-solvers and explorers.</span> With a versatile, Swiss knife mentality, we thrive on tackling diverse challenges. Our core team is tight-knit, yet we seamlessly tap into a wider network of experts when needed. Here, theory meets practice, and together, we get things done.
            </p>
            <div className="order-first w-[7.75rem] shrink-0 sm:order-none">
              <TeamStack />
            </div>
          </div>
        </li>
        <li className={`${rowClass} border-t`}>
          <h3 className="text-3xl font-medium md:text-4xl">14+ Awards</h3>
          <div className="contents justify-between gap-8 sm:flex">
            <p className="text-dark-subtle text-sm md:max-w-[36rem]">
              <span className="text-dark transition-colors duration-500">Our work speaks for itself</span>—recognized internationally, we’ve already earned some awards. These accolades reflect the passion and innovation we pour into every project, pushing boundaries and delivering results that make an impact.
            </p>
            <div className="order-first w-[7.75rem] shrink-0 sm:order-none">
              <AwardsBox />
            </div>
          </div>
        </li>
        <li className={`${rowClass} border-t`}>
          <h3 className="text-3xl font-medium md:text-4xl">CGN, BLN, Remote</h3>
          <div className="contents justify-between gap-8 sm:flex">
            <p className="text-dark-subtle text-sm md:max-w-[36rem]">
              <span className="text-dark transition-colors duration-500">Headquartered in Cologne, with an expanding team in Berlin</span>, we also embrace remote work. Our colleagues span across cities like Barcelona, Stuttgart, Munich, and more, bringing a mix of perspectives and expertise to everything we do. Whether in the office or working remotely, we stay connected and collaborative.
            </p>
            <div className="order-first w-[7.75rem] shrink-0 sm:order-none">
              <div className="overflow-hidden relative size-[7.75rem] rounded-lg bg-gray-200">
                <Vimeo id={officesVimeo} aspect={officesVimeoAspect} title="Offices" cover />
              </div>
            </div>
          </div>
        </li>
        <li className={`${rowClass} border-t`}>
          <h3 className="text-3xl font-medium md:text-4xl">B-Corp</h3>
          <div className="contents justify-between gap-8 sm:flex">
            <p className="text-dark-subtle text-sm md:max-w-[36rem]">
              <span className="text-dark transition-colors duration-500">We’ve officially joined the ranks of B-Corp certified companies.</span> This means we meet the highest standards of social and environmental performance, accountability, and transparency. We’re proud to use business as a force for good, ensuring our impact extends beyond just profits.
            </p>
            <div className="order-first w-[7.75rem] shrink-0 sm:order-none">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                alt="Logo of a Certified B Corporation, showing a large letter “B” inside a circle with the words “Certified Corporation”"
                loading="lazy" decoding="async"
                width={500}
                height={500}
                className="rounded-lg"
                sizes="7.75rem"
                src={bcorpLogo}
              />
            </div>
          </div>
        </li>
      </ul>
    </Container>
  );
}
