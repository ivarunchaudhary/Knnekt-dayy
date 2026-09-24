"use client";

import { useEffect, useId, useRef, useState } from "react";
import { journeyPhases } from "@/lib/data";
import Container, { SectionHeading } from "./Container";

/** What the founder is doing on any given day of the quarter — one scene per status. */
const statuses = ["Start", "Classes", "Roadmap", "Building", "Customers", "Traction", "Pitch"];
const statusFor = (day: number) => (day <= 3 ? 0 : day <= 10 ? 1 : day <= 16 ? 2 : day <= 45 ? 3 : day <= 82 ? 4 : day <= 89 ? 5 : 6);
/** Customers only start landing once what we built is in market. */
const customersFor = (day: number) => Math.max(0, Math.min(100, Math.round(((day - 45) / 37) * 100)));

/** Decade marks on the spine, so the eye has something to measure the travel against. */
const decades = [10, 20, 30, 40, 50, 60, 70, 80];

/* The avatar sits on the page's own ramp: the sky behind the founder, the ink for
   the one badge beside them. The founder alone keeps natural colour. */
const INK = "#16253f";
const SKY = "#3b81e3";
const SKY_LIGHT = "#6caef5";
const SHIRT = "#f4f7fb";
const FACE_INK = "#2a2420";
const LIP = "#9c4e2e";

/*
 * The face carries the story, one expression per status:
 *   Start      worried   — brows knit up, a wobbly mouth
 *   Classes    curious   — brows up, a small "o"
 *   Roadmap    thinking  — one brow up, eyes off to the side
 *   Building   focused   — brows down, a set smile
 *   Customers  happy     — eyes closed into arcs, a wide smile
 *   Traction   thrilled  — brows high, an open grin
 *   Pitch      confident — level brows, a half smile, and the suit on
 * Each scene picks a brow and a mouth from the sets below by index, so two
 * scenes can share a feature without drawing it twice.
 */
const brows = [
  ["M50.5 40 L57 37.6", "M69.5 40 L63 37.6"],
  ["M50 38.2 Q53.5 35 57 37.6", "M63 37.6 Q66.5 35 70 38.2"],
  ["M50.5 38.8 L57 38.8", "M63 37.6 Q66.5 35 70 37.4"],
  ["M50.5 37.2 L57 39.2", "M69.5 37.2 L63 39.2"],
  ["M50 38.4 Q53.5 36 57 38", "M63 38 Q66.5 36 70 38.4"],
  ["M50.5 38.6 L57 38.4", "M63 38.4 L69.5 38.6"],
];
const browFor = [0, 1, 2, 3, 4, 1, 5];

const mouths = [
  <path key="wobble" d="M55 55.4 q1.25 -1.4 2.5 0 t2.5 0 t2.5 0 t2.5 0" fill="none" stroke={LIP} strokeWidth="1.8" strokeLinecap="round" />,
  <ellipse key="o" cx="60" cy="55.2" rx="1.9" ry="2.3" fill={LIP} />,
  <path key="hmm" d="M57 55.2 L63.6 54.2" fill="none" stroke={LIP} strokeWidth="1.9" strokeLinecap="round" />,
  <path key="set" d="M55.5 54 Q60 57.4 64.5 54" fill="none" stroke={LIP} strokeWidth="2" strokeLinecap="round" />,
  <path key="smile" d="M54 53.2 Q60 59.6 66 53.2" fill="none" stroke={LIP} strokeWidth="2.2" strokeLinecap="round" />,
  <g key="grin">
    <path d="M54.5 53 Q60 62 65.5 53 Q60 55.4 54.5 53 Z" fill={LIP} />
    <path d="M56 53.9 Q60 55.4 64 53.9" fill="none" stroke="#fff" strokeWidth="1.1" opacity=".7" />
  </g>,
  <path key="smirk" d="M55.5 54.6 Q60.5 57.6 65 52.8" fill="none" stroke={LIP} strokeWidth="2.1" strokeLinecap="round" />,
];
const mouthFor = [0, 1, 2, 3, 4, 5, 6];

/** Where the eyes look in each scene — up in worry, off to the side while thinking. */
const lookFor: [number, number][] = [
  [0, -0.9],
  [0, -0.4],
  [1.3, -0.7],
  [0, 0.5],
  [0, 0],
  [0, 0],
  [0, 0],
];

const fade = "transition-opacity duration-500 ease-in-out-quart";
const shown = (on: boolean) => `${fade} ${on ? "opacity-100" : "opacity-0"}`;

/** The badge beside the founder — one small hint per scene, in the same spot every time. */
function Badge({ scene, customers }: { scene: number; customers: number }) {
  const stroke = { fill: "none", stroke: INK, strokeWidth: 1.8, strokeLinecap: "round", strokeLinejoin: "round" } as const;
  return (
    <g>
      <circle cx="98" cy="22" r="12" fill="#fff" stroke="#16253f26" />
      <text x="98" y="27" fontSize="14" fontWeight="500" fill={INK} textAnchor="middle" className={`${shown(scene === 0)} font-sans`}>
        ?
      </text>
      <path d="M91.5 17.5 v9 q3.25 -1.6 6.5 0 q3.25 -1.6 6.5 0 v-9 q-3.25 -1.6 -6.5 0 q-3.25 -1.6 -6.5 0 Z M98 17.5 v9" {...stroke} className={shown(scene === 1)} />
      <g className={shown(scene === 2)}>
        <path d="M98 15.5 c3.3 0 5.4 2.4 5.4 5.4 c0 3.5 -5.4 7.6 -5.4 7.6 c0 0 -5.4 -4.1 -5.4 -7.6 c0 -3 2.1 -5.4 5.4 -5.4 Z" fill={INK} />
        <circle cx="98" cy="20.9" r="1.8" fill="#fff" />
      </g>
      <g className={shown(scene === 3)}>
        <circle cx="98" cy="22" r="5.2" fill="none" stroke={INK} strokeWidth="2.6" strokeDasharray="2.2 1.9" />
        <circle cx="98" cy="22" r="3.3" fill={INK} />
        <circle cx="98" cy="22" r="1.4" fill="#fff" />
      </g>
      <text x="98" y="25.2" fontSize="8.5" fontWeight="500" fill={INK} textAnchor="middle" className={`${shown(scene === 4)} font-sans tabular-nums`}>
        {customers}
      </text>
      <g className={shown(scene === 5)}>
        <path d="M91.5 27 L96 22 L99.5 24.8 L104.5 18" {...stroke} stroke={SKY} strokeWidth={2} />
        <path d="M100.5 18 L104.5 18 L104.5 22" {...stroke} stroke={SKY} strokeWidth={2} />
      </g>
      <g className={shown(scene === 6)}>
        <rect x="95.4" y="14.5" width="5.2" height="9" rx="2.6" fill={INK} />
        <path d="M92.8 21 a5.2 5.2 0 0 0 10.4 0 M98 26.2 v2.6" {...stroke} />
      </g>
    </g>
  );
}

/**
 * The founder who rides the spine. Deliberately plain: a face on the sky, and one
 * small badge beside it. The expression does the storytelling — worried on day one,
 * focused while the studio builds, beaming once the customers land, composed on
 * pitch day — and the eyes blink every few seconds so the founder reads as alive
 * even while the page is still.
 */
function FounderAvatar({ day }: { day: number }) {
  const uid = useId().replace(/[^a-zA-Z0-9_-]/g, "");
  const disc = `journey-disc-${uid}`;
  const glow = `journey-glow-${uid}`;
  const scene = statusFor(day);
  const [lookX, lookY] = lookFor[scene];
  const happyEyes = scene === 4;

  return (
    <svg viewBox="0 0 120 120" aria-hidden="true" className="block aspect-square w-full overflow-visible drop-shadow-[0_12px_20px_rgb(22_37_63/0.18)]">
      <defs>
        <clipPath id={disc}>
          <circle cx="60" cy="52" r="34" />
        </clipPath>
        <radialGradient id={glow} cx="50%" cy="38%" r="72%">
          <stop offset="0" stopColor={SKY_LIGHT} />
          <stop offset="1" stopColor={SKY} />
        </radialGradient>
      </defs>

      {/* A ring of white round the disc, so the spine breaks cleanly around the founder. */}
      <circle cx="60" cy="60" r="54" fill="#fff" />

      {/* The face is drawn at 34 units and scaled up to fill the disc. */}
      <g transform="translate(60 60) scale(1.47) translate(-60 -52)">
        <g clipPath={`url(#${disc})`}>
          <circle cx="60" cy="52" r="34" fill={`url(#${glow})`} />

          {/* Casual all quarter; the suit goes on for pitch day. */}
          <g className={shown(scene !== 6)}>
            <path d="M32 90 C32 74 44 68 60 68 C76 68 88 74 88 90 Z" fill={SHIRT} />
            <path d="M56 68 L60 75 L64 68" fill="none" stroke="#c9d6e6" strokeWidth="1.5" />
          </g>
          <g className={shown(scene === 6)}>
            <path d="M32 90 C32 74 44 68 60 68 C76 68 88 74 88 90 Z" fill={SHIRT} />
            <path d="M60 68 L51 90 L44 90 L48 72 Z" fill={INK} />
            <path d="M60 68 L69 90 L76 90 L72 72 Z" fill={INK} />
            <path d="M56 69 L60 74 L64 69 Z" fill={SKY} />
            <path d="M58 74 L60 87 L62 74 Z" fill={SKY} />
          </g>

          <path d="M54 60 h12 v6 c0 3 -12 3 -12 0 Z" fill="#e0a579" />
          <circle cx="45.6" cy="47" r="3.2" fill="#efc09a" />
          <circle cx="74.4" cy="47" r="3.2" fill="#efc09a" />
          <ellipse cx="60" cy="45" rx="13" ry="15" fill="#efc09a" />
          {/* Cheeks warm up once things start going right. */}
          <g fill="#eba07a" className="transition-opacity duration-500" style={{ opacity: scene >= 4 ? 0.75 : 0.35 }}>
            <circle cx="51.6" cy="50" r="2.5" />
            <circle cx="68.4" cy="50" r="2.5" />
          </g>
          <path d="M60 46 q-1.3 3.4 0 4" fill="none" stroke="#e0a579" strokeWidth="1.5" strokeLinecap="round" />

          {/* Hair goes down before the features, so a raised brow still reads over the fringe. */}
          <g fill="#3a2a22">
            <path d="M43 46 C42 27 78 27 77 46 L77 72 C74 72 71.5 68 71.5 64 L71.5 46 C71.5 35 66 30 60 30 C54 30 48.5 35 48.5 46 L48.5 64 C48.5 68 46 72 43 72 Z" />
            <path d="M46 44 C46 28 74 28 74 44 C73 34 68 29.5 60 29.5 C52 29.5 47 34 46 44 Z" />
          </g>

          {/* Eyes: open (and blinking) in every scene but the happy one, where they close into arcs. */}
          <g className={shown(!happyEyes)}>
            <g className="ease-in-out-quart transition-transform duration-500" style={{ transform: `translate(${lookX}px, ${lookY}px)` }}>
              <g className="origin-center [transform-box:fill-box] motion-safe:animate-[journey-blink_4.8s_ease-in-out_infinite]">
                <ellipse cx="54.4" cy="44.6" rx="1.9" ry="2.5" fill={FACE_INK} />
                <ellipse cx="65.6" cy="44.6" rx="1.9" ry="2.5" fill={FACE_INK} />
                <circle cx="55" cy="43.9" r=".65" fill="#fff" />
                <circle cx="66.2" cy="43.9" r=".65" fill="#fff" />
              </g>
            </g>
          </g>
          <g className={shown(happyEyes)} fill="none" stroke={FACE_INK} strokeWidth="1.8" strokeLinecap="round">
            <path d="M52.2 45.4 Q54.4 42.4 56.6 45.4" />
            <path d="M63.4 45.4 Q65.6 42.4 67.8 45.4" />
          </g>

          <g fill="none" stroke={FACE_INK} strokeWidth="1.7" strokeLinecap="round">
            {brows.map(([left, right], i) => (
              <g key={i} className={shown(browFor[scene] === i)}>
                <path d={left} />
                <path d={right} />
              </g>
            ))}
          </g>

          {mouths.map((mouth, i) => (
            <g key={i} className={shown(mouthFor[scene] === i)}>
              {mouth}
            </g>
          ))}

        </g>
      </g>

      <Badge scene={scene} customers={customersFor(day)} />
    </svg>
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
              className="absolute top-0 left-1/2 z-10 w-full max-w-44 -translate-x-1/2 -translate-y-1/2 transition-[top] duration-100 ease-linear"
            >
              <p className="sr-only">
                Day {day} of 90: {status}. {customers} customers.
              </p>
              <FounderAvatar day={day} />
              <div ref={caption} aria-hidden="true" className="absolute top-full left-1/2 mt-3 flex -translate-x-1/2 flex-col items-center gap-1.5">
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
