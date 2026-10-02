"use client";

import { useEffect, useRef, useState } from "react";
import { journeyPhases } from "@/lib/data";
import Container, { SectionHeading } from "./Container";

/** What the founder is doing on any given day of the quarter — one scene per status. */
const statuses = ["Start", "Classes", "Roadmap", "Building", "Customers", "Traction", "Pitch"];
const statusFor = (day: number) => (day <= 3 ? 0 : day <= 10 ? 1 : day <= 16 ? 2 : day <= 45 ? 3 : day <= 82 ? 4 : day <= 89 ? 5 : 6);
/** Customers only start landing once what we built is in market. */
const customersFor = (day: number) => Math.max(0, Math.min(100, Math.round(((day - 45) / 37) * 100)));

/** Decade marks on the spine, so the eye has something to measure the travel against. */
const decades = [10, 20, 30, 40, 50, 60, 70, 80];

/** One pose per status, drawn as the founder lives the quarter. */
const poses = ["01-start", "02-classes", "03-roadmap", "04-building", "05-customers", "06-traction", "07-pitch"].map(
  (name) => `/founder/knnekt-founder-${name}.webp`,
);

/* The ring round the disc fills over the 90 days; a tick lights as each milestone passes. */
const ringTicks = [4, 11, 17, 46, 83, 90].map((d) => {
  const a = ((-90 + ((d - 1) / 89) * 360) * Math.PI) / 180;
  return { d, cx: (100 + 96 * Math.cos(a)).toFixed(2), cy: (100 + 96 * Math.sin(a)).toFixed(2) };
});

/* Twenty seats on an arc under the founder, filling in as the customers land. */
const seats = Array.from({ length: 20 }, (_, k) => {
  const a = ((38 + k * (104 / 19)) * Math.PI) / 180;
  return { cx: (100 + 106 * Math.cos(a)).toFixed(2), cy: (100 + 106 * Math.sin(a)).toFixed(2) };
}).reverse();

/* The four disciplines light up one by one through the build. */
const pills = [
  { label: "AI", day: 22, x: 6, y: -2, w: 34, delay: "" },
  { label: "Tech", day: 29, x: 158, y: -4, w: 44, delay: "d2" },
  { label: "Legal", day: 36, x: -6, y: 180, w: 48, delay: "d3" },
  { label: "Growth", day: 43, x: 156, y: 180, w: 56, delay: "d4" },
];

/**
 * The founder who rides the spine: a sky disc inside a progress ring, with the founder
 * cut out of it so the head breaks the top edge. Each status swaps the pose and pops one
 * small overlay beside the disc — the question marks of day one, the class count, the
 * roadmap, the disciplines, the customer seats, the chart and, on pitch day, the room.
 */
function FounderAvatar({ day }: { day: number }) {
  const scene = statusFor(day);
  const customers = customersFor(day);
  const lit = Math.round((customers / 100) * seats.length);
  const ava = useRef<HTMLDivElement>(null);
  const studio = useRef<SVGGElement>(null);
  const shownScene = useRef(scene);

  // A small bump of the disc each time the founder moves on to a new status.
  useEffect(() => {
    const el = ava.current;
    if (!el || shownScene.current === scene) return;
    shownScene.current = scene;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    el.classList.remove("bump");
    void el.offsetWidth;
    el.classList.add("bump");
    const t = setTimeout(() => el.classList.remove("bump"), 600);
    return () => clearTimeout(t);
  }, [scene]);

  // The "In studio" chip is sized to its label once the page font is in.
  useEffect(() => {
    const fit = () => {
      const g = studio.current;
      const text = g?.querySelector("text");
      const rect = g?.querySelector("rect");
      if (!text || !rect) return;
      const w = text.getBBox().width;
      if (w) rect.setAttribute("width", (w + 33).toFixed(1));
    };
    fit();
    document.fonts?.ready.then(fit);
  }, []);

  return (
    <div ref={ava} className={`founder-ava sc${scene}`} aria-hidden="true">
      <svg className="orbit" viewBox="0 0 200 200">
        <circle className="trk" cx="100" cy="100" r="96" />
        <circle
          className="prg"
          cx="100"
          cy="100"
          r="96"
          pathLength={1000}
          transform="rotate(-90 100 100)"
          style={{ strokeDashoffset: (1000 * (1 - (day - 1) / 89)).toFixed(1) }}
        />
        <g>
          {ringTicks.map((t) => (
            <circle key={t.d} className={`tick ${day >= t.d ? "on" : ""}`} r="3" cx={t.cx} cy={t.cy} />
          ))}
        </g>
      </svg>
      <div className="disc" />
      <div className="cut">
        <div className="stage">
          {poses.map((src, i) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img key={src} src={src} alt="" width={640} height={640} decoding="async" draggable={false} className={`pose ${i === scene ? "on" : ""}`} />
          ))}
        </div>
      </div>
      <div className="lip" />
      <svg className="fx" viewBox="0 0 200 200">
        <g className="s s0">
          <g transform="translate(174 36)">
            <g className="pop">
              <g className="fl">
                <g className="bub">
                  <circle r="14" />
                  <text y="6">?</text>
                </g>
              </g>
            </g>
          </g>
          <g transform="translate(20 74)">
            <g className="pop d2">
              <g className="fl b">
                <g className="bub sm">
                  <circle r="10" />
                  <text y="4.3">?</text>
                </g>
              </g>
            </g>
          </g>
        </g>
        <g className="s s1">
          <g transform="translate(-14 176)">
            <g ref={studio} className="pop">
              <rect className="chip" width="78" height="22" rx="11" />
              <circle className="studio" cx="12" cy="11" r="3" />
              <text className="ct" x="21" y="15" style={{ textAnchor: "start" }}>
                In studio
              </text>
            </g>
          </g>
          <g transform="translate(116 176)">
            <g className="pop d2">
              <rect className="chip" width="92" height="22" rx="11" />
              <text className="ct" x="46" y="15">
                Class {Math.min(10, Math.max(1, day))} of 10
              </text>
            </g>
          </g>
        </g>
        <g className="s s2">
          <g transform="translate(142 -2)">
            <g className="pop">
              <rect className="card" width="58" height="44" rx="6" />
              <circle cx="11" cy="12" r="3.2" className="studio" />
              <path className="route" pathLength={1} d="M11 12 C28 14 14 24 31 27 C41 29 38 36 47 33" />
              <path className="pin" d="M47 20.5c3.9 0 6.3 2.9 6.3 6.2c0 4.1-6.3 9.2-6.3 9.2s-6.3-5.1-6.3-9.2c0-3.3 2.4-6.2 6.3-6.2Z" />
              <circle cx="47" cy="26.8" r="2.1" fill="#fff" />
            </g>
          </g>
          <g transform="translate(112 176)">
            <g className="pop d2">
              <rect className="chip" width="88" height="22" rx="11" />
              <text className="ct" x="44" y="15">
                90-day plan
              </text>
            </g>
          </g>
        </g>
        <g className="s s3">
          {pills.map((p) => (
            <g key={p.label} transform={`translate(${p.x} ${p.y})`}>
              <g className={`pop pil ${p.delay} ${day >= p.day ? "lit" : ""}`}>
                <rect width={p.w} height="22" rx="11" />
                <text x={p.w / 2} y="15">
                  {p.label}
                </text>
              </g>
            </g>
          ))}
        </g>
        <g className="s s4">
          <g transform="translate(126 -4)">
            <g className="pop">
              <rect className="cnt" width="76" height="26" rx="13" />
              <text className="cntt" x="38" y="17.6">
                <tspan>{customers}</tspan>
                <tspan className="of"> / 100</tspan>
              </text>
            </g>
          </g>
          <g>
            {seats.map((c, i) => (
              <circle key={i} className={`cd ${i < lit ? "on" : ""}`} r="2.7" cx={c.cx} cy={c.cy} />
            ))}
          </g>
        </g>
        <g className="s s5">
          <g transform="translate(138 -4)">
            <g className="pop">
              <rect className="card" width="62" height="46" rx="6" />
              <rect className="bar lo" x="9" y="28" width="8" height="10" rx="1.5" />
              <rect className="bar" x="21" y="23" width="8" height="15" rx="1.5" />
              <rect className="bar" x="33" y="17" width="8" height="21" rx="1.5" />
              <rect className="bar" x="45" y="9" width="8" height="29" rx="1.5" />
              <path className="trend" pathLength={1} d="M9 23 L25 17 L37 11 L53 4" />
            </g>
          </g>
        </g>
        <g className="s s6">
          <g transform="translate(176 154)">
            <g className="pop">
              <circle className="badge" r="18" />
              <path className="chk" d="M-7.5 0.5 l4.8 4.8 l9.4 -10" />
            </g>
          </g>
          <g transform="translate(-6 168)">
            <g className="pop d2 aud">
              <circle cx="6" cy="6" r="5" />
              <path d="M-1.5 21a7.5 7.5 0 0 1 15 0Z" />
              <circle cx="24" cy="4" r="5" />
              <path d="M16.5 19a7.5 7.5 0 0 1 15 0Z" />
              <circle cx="42" cy="8" r="5" />
              <path d="M34.5 23a7.5 7.5 0 0 1 15 0Z" />
            </g>
          </g>
        </g>
      </svg>
    </div>
  );
}

/**
 * The 90 days as a spine: a ruled rail that fills as you scroll, a founder riding it
 * from Day 1 → Day 90, and the four phases lighting up as it passes them. Position is
 * written straight to the DOM; only the day and the active phase (which change a few
 * dozen times across the whole section) go through state.
 *
 * The founder is the readout. Rather than a counter, the section shows what the day
 * means — the founder's expression changes scene by scene, from worried on day one
 * to composed on pitch day — with the day and the status hung underneath as two
 * slugs: a hairline one for the day, and the solid ink one for the status.
 */
export default function Journey() {
  const rail = useRef<HTMLDivElement>(null);
  const marker = useRef<HTMLDivElement>(null);
  const caption = useRef<HTMLDivElement>(null);
  const line = useRef<HTMLSpanElement>(null);
  const fill = useRef<HTMLSpanElement>(null);
  const startDot = useRef<HTMLSpanElement>(null);
  const endDot = useRef<HTMLSpanElement>(null);
  const ticks = useRef<(HTMLSpanElement | null)[]>([]);
  const cards = useRef<(HTMLLIElement | null)[]>([]);
  const [day, setDay] = useState(1);
  const [active, setActive] = useState(0);
  // How many days above and below the founder the marker physically covers, so a decade
  // mark can get out of the way before the avatar (or the caption under it) clips it.
  const [reach, setReach] = useState<[number, number]>([11, 16]);

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
      const halfPx = markerEl.offsetHeight / 2;
      const half = Math.min(32, (halfPx / railH) * 100);
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
      const daysPerPx = 88 / Math.max(0.0001, (pitchStart * span * railH) / 100);
      const below = halfPx + (caption.current?.offsetHeight ?? 0) + 12;
      setReach([halfPx * daysPerPx + 1, below * daysPerPx + 1]);
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
    ro.observe(markerEl);
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
    <section id="journey" className="pt-12 pb-24 md:py-28">
      <Container>
        <SectionHeading lead="Day 1 to pitch day.">
          Ten live classes to plan the quarter with you, then eighty days where the studio builds and launches it. Scroll it through and follow the founder from the first class to pitch day.
        </SectionHeading>

        <div className="mt-10 grid grid-cols-[6rem_1fr] gap-x-2.5 md:grid-cols-[11rem_1fr] md:gap-x-4 lg:mt-16 lg:grid-cols-[12rem_1fr] lg:gap-x-6">
          <div ref={rail} className="relative">
            <span ref={line} className="bg-dark/10 absolute left-1/2 w-px -translate-x-1/2 rounded" />
            <span ref={fill} className="bg-dark absolute left-1/2 w-px -translate-x-1/2 rounded transition-[height] duration-100 ease-linear" />
            {/* Decade marks: the rail as a ruler, so the travel is measured and not just long. */}
            {decades.map((d, i) => {
              const hidden = d >= day ? d - day < reach[1] : day - d < reach[0];
              return (
                <span
                  key={d}
                  aria-hidden="true"
                  ref={(el) => {
                    ticks.current[i] = el;
                  }}
                  className={`ease-in-out-quart absolute left-1/2 -translate-x-1/2 -translate-y-1/2 transition-opacity duration-500 ${hidden ? "opacity-0" : "opacity-100"}`}
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
              );
            })}
            <span ref={startDot} className="border-dark absolute left-1/2 size-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 bg-white" />
            <span ref={endDot} className="bg-dark absolute left-1/2 size-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full" />

            <div
              ref={marker}
              className="absolute top-0 left-1/2 z-10 -translate-x-1/2 -translate-y-1/2 transition-[top] duration-100 ease-linear [--fa-size:118px] md:[--fa-size:clamp(118px,13vw,190px)]"
            >
              <p className="sr-only">
                Day {day} of 90: {status}. {customers} customers.
              </p>
              <FounderAvatar day={day} />
              <div ref={caption} aria-hidden="true" className="absolute top-full left-1/2 mt-3.5 flex -translate-x-1/2 flex-col items-center gap-2">
                <span className="mono-text border-dark/15 text-dark rounded-full border bg-white px-3 py-1.5 whitespace-nowrap tabular-nums">Day {day}</span>
                <span className="bg-dark mono-text rounded-full px-3 py-1.5 whitespace-nowrap text-white">{status}</span>
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
