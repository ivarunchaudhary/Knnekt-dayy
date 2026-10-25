"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState, type CSSProperties } from "react";
import { renderCompareArt } from "@/lib/compareArt";
import Container from "./Container";

const reduceMotion = () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/** A rounded tile with a line icon in it, drawn in a 64-unit box centred on 0,0. */
function Tile({ d, star, className }: { d: string; star?: boolean; className: string }) {
  return (
    <svg aria-hidden="true" viewBox="-32 -32 64 64" className={`${className} shrink-0`}>
      <rect
        x="-28"
        y="-28"
        width="56"
        height="56"
        rx="10"
        fill={star ? "url(#kn-tile-star)" : "url(#kn-tile)"}
        stroke={star ? "rgba(255,255,255,.55)" : "#16253f"}
        strokeWidth="3.5"
      />
      <g fill="none" stroke={star ? "#ffffff" : "#16253f"} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
        <path d={d} />
      </g>
    </svg>
  );
}

const vendors = [
  { who: "Freelancer", does: "builds the app", icon: "M-8 -8L-16 0L-8 8M8 -8L16 0L8 8" },
  { who: "Agency", does: "runs the marketing", icon: "M-13 -5H-5L10 -13V13L-5 5H-13ZM-9 5L-6 14" },
  { who: "CA", does: "files the returns", icon: "M-11 -15H11V15L6 11L0 15L-6 11L-11 15ZM-5 -7H5M-5 -1H5M-5 5H1" },
  { who: "Lawyer", does: "drafts whatever someone remembers to ask for", icon: "M-11 -15H6L12 -9V15H-11ZM-5 -3H6M-5 5H6" },
];

const checks = [
  { what: "A product people actually use.", by: "Technology", icon: "M-15 -12H15V12H-15ZM-15 -5H15M-10 -9h.01M-6 -9h.01" },
  { what: "Measurable traction.", by: "Growth & Marketing", icon: "M-14 10L-3 -1L4 6L14 -8M6 -8H14V0" },
  { what: "A real customer base.", by: "Growth & Marketing", icon: "M-7 -9a5 5 0 1 0 0.01 0M-17 13Q-7 -2 3 13M8 -7a4 4 0 1 0 0.01 0M4 6Q10 -1 17 11" },
  { what: "Clean records and data.", by: "Legal & Compliance and AI Enablement", icon: "M-11 -15H6L12 -9V15H-11ZM-6 2L-2 6L6 -3" },
];

/** Agency line first, then ours. */
const rows: [string, string][] = [
  ["Sells you whatever you ask for", "Say no when you’re not ready"],
  ["Bills the hours and ships a deck", "Build it with you"],
  ["Is one of four vendors who never meet", "Run four functions as one team"],
  ["Hands you a login and leaves", "Build beside you, at the next desk"],
  ["Reports fluff metrics", "Report revenue, retention and runway"],
  ["Sends a moving invoice", "Publish one price; the scope moves, the number doesn’t"],
];

const lower = (s: string) => s.charAt(0).toLowerCase() + s.slice(1);
const said = (i: number) => `An agency ${lower(rows[i][0])}. We ${lower(rows[i][1])}.`;

/* One clock drives the text and the illustration together: agency 0–1.3s ·
   crossed out 1.3–2.0s · ours from 2.0s · next comparison at 5.2s, played at
   0.78× so each comparison holds for about 6.7s. */
const A_END = 1.3;
const S_END = 2.0;
const TOTAL = 5.2;
const OUT = 0.32;
const SPEED = 0.78;
/** How long autoplay waits after the visitor takes over. */
const IDLE = 8000;

/**
 * Agency vs us, one comparison at a time: the agency line is struck through,
 * then ours arrives word by word while the illustration turns from grey to
 * colour. It plays while on screen; the segments, arrows and a swipe take over
 * and autoplay comes back after a pause.
 */
function Compare() {
  const stage = useRef<HTMLDivElement>(null);
  const art = useRef<SVGSVGElement>(null);
  const fills = useRef<(HTMLElement | null)[]>([]);
  const clock = useRef({ i: 0, t: 0, phase: "", leaving: false, held: false, idle: 0 });
  const draw = useRef(() => {});
  const swipe = useRef({ x: 0, y: 0 });
  const [view, setView] = useState({ i: 0, turn: 0 });
  const [live, setLive] = useState("");

  const load = useCallback((i: number, t = 0) => {
    Object.assign(clock.current, { i, t });
    setView((v) => ({ i, turn: v.turn + 1 }));
  }, []);

  // Each new comparison: clear the phase, let the agency line rise in again, and redraw.
  useLayoutEffect(() => {
    const el = stage.current;
    if (!el) return;
    el.classList.remove("is-strike", "is-w", "is-leaving");
    el.classList.add("is-entering");
    void el.offsetWidth;
    el.classList.remove("is-entering");
    Object.assign(clock.current, { phase: "", leaving: false });
    fills.current.forEach((f, k) => {
      if (f) f.style.width = k < view.i ? "100%" : "0";
    });
    draw.current();
  }, [view]);

  useEffect(() => {
    const el = stage.current;
    const svg = art.current;
    if (!el || !svg) return;
    const c = clock.current;
    const reduce = reduceMotion();

    draw.current = () => {
      const p = c.t < A_END ? "a" : c.t < S_END ? "strike" : "w";
      if (p !== c.phase) {
        c.phase = p;
        el.classList.toggle("is-strike", p !== "a");
        el.classList.toggle("is-w", p === "w");
        if (p === "w") setLive(said(c.i));
      }
      const fill = fills.current[c.i];
      if (fill) fill.style.width = `${Math.min(100, Math.max(0, (c.t / TOTAL) * 100))}%`;
      svg.innerHTML = renderCompareArt(c.i, c.t);
    };

    if (reduce) {
      // Each comparison shows its finished state, and nothing moves.
      c.t = TOTAL;
      draw.current();
      return () => clearTimeout(c.idle);
    }

    let raf = 0;
    let last = 0;
    let visible = false;
    const frame = (now: number) => {
      const dt = last ? Math.min(0.1, (now - last) / 1000) : 0;
      last = now;
      c.t += dt * SPEED;
      if (visible && !c.held && c.t >= TOTAL) {
        if (!c.leaving) {
          c.leaving = true;
          el.classList.add("is-leaving");
        }
        if (c.t >= TOTAL + OUT) load((c.i + 1) % rows.length);
      }
      draw.current();
      raf = requestAnimationFrame(frame);
    };
    const io = new IntersectionObserver(
      ([e]) => {
        visible = e.isIntersecting;
        cancelAnimationFrame(raf);
        last = 0;
        if (visible) raf = requestAnimationFrame(frame);
      },
      { threshold: 0.35 },
    );
    io.observe(el);
    draw.current();
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
      clearTimeout(c.idle);
    };
  }, [load]);

  /** The visitor takes over: jump straight to the cross-out; autoplay returns after a pause. */
  const jump = (i: number) => {
    const c = clock.current;
    c.held = true;
    clearTimeout(c.idle);
    c.idle = window.setTimeout(() => (c.held = false), IDLE);
    load(i, reduceMotion() ? TOTAL : A_END - 0.15);
  };
  const step = (by: number) => jump((view.i + by + rows.length) % rows.length);

  const [agency, ours] = rows[view.i];

  return (
    <div className="kv-grid">
      <div
        ref={stage}
        className="kv-stage"
        onTouchStart={(e) => (swipe.current = { x: e.touches[0].clientX, y: e.touches[0].clientY })}
        onTouchEnd={(e) => {
          const dx = e.changedTouches[0].clientX - swipe.current.x;
          const dy = e.changedTouches[0].clientY - swipe.current.y;
          if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy) * 1.3) step(dx < 0 ? 1 : -1);
        }}
      >
        <div className="kv-phase" aria-hidden="true">
          <span className="kv-phase-thumb" />
          <span className="kv-phase-a">
            <svg viewBox="0 0 20 20" className="kv-pi">
              <circle cx="10" cy="10" r="9" />
              <path d="M7 7l6 6M13 7l-6 6" />
            </svg>
            An agency…
          </span>
          <span className="kv-phase-w">
            <svg viewBox="0 0 20 20" className="kv-pi">
              <circle cx="10" cy="10" r="10" />
              <path d="M5.8 10.4l2.9 2.9 5.5-6" />
            </svg>
            We…
          </span>
        </div>
        <div className="kv-art" aria-hidden="true">
          <svg ref={art} viewBox="0 0 600 400" />
        </div>
        <div className="kv-agency">
          <p className="kv-who kv-who-a mono-text font-mono">An agency…</p>
          <p className="kv-line-a">
            <span>{agency}</span>
          </p>
        </div>
        <div className="kv-rule" aria-hidden="true">
          <i />
        </div>
        <div className="kv-ours">
          <p className="kv-who kv-who-w mono-text font-mono">
            <span className="kv-who-dot" aria-hidden="true" />
            We…
          </p>
          <div className="kv-lines">
            <p key={view.turn} className="kv-line-w">
              <svg aria-hidden="true" viewBox="0 0 20 20" className="kv-ok-inline">
                <circle cx="10" cy="10" r="10" />
                <path d="M5.8 10.4l2.9 2.9 5.5-6" />
              </svg>
              {ours.split(" ").map((w, k) => (
                <span key={k}>
                  {k > 0 && " "}
                  <span className="kv-wd" style={{ "--w": k } as CSSProperties}>
                    {w}
                  </span>
                </span>
              ))}
            </p>
          </div>
        </div>
        <p className="sr-only" aria-live="polite">
          {live}
        </p>
        <div className="kv-ctrl">
          <span className="mono-text font-mono">
            0{view.i + 1} / 0{rows.length}
          </span>
          <span className="kv-segs" role="group" aria-label="Choose a comparison">
            {rows.map(([, w], i) => (
              <button
                key={w}
                type="button"
                className="kv-seg"
                aria-label={`Comparison ${i + 1}: ${w}`}
                aria-current={i === view.i ? "true" : undefined}
                onClick={() => jump(i)}
              >
                <i ref={(n) => void (fills.current[i] = n)} />
              </button>
            ))}
          </span>
          <span className="kv-nav">
            <button type="button" aria-label="Previous comparison" onClick={() => step(-1)}>
              ←
            </button>
            <button type="button" aria-label="Next comparison" onClick={() => step(1)}>
              →
            </button>
          </span>
        </div>
      </div>
    </div>
  );
}

/** Adds `waiting` until the element is `threshold` on screen, then hands over to `enter`. Skipped under reduced motion. */
function useReveal(waiting: string, threshold: number, enter: (el: HTMLElement) => (() => void) | void) {
  const ref = useRef<HTMLDivElement>(null);
  const onEnter = useRef(enter);
  useEffect(() => {
    const el = ref.current;
    if (!el || reduceMotion() || !("IntersectionObserver" in window)) return;
    el.classList.add(waiting);
    let undo: (() => void) | void;
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        io.disconnect();
        undo = onEnter.current(el);
      },
      { threshold },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      undo?.();
    };
  }, [waiting, threshold]);
  return ref;
}

/**
 * The problem: founders buy their startup in pieces from vendors who never
 * meet. The four pieces sit packed as one block until the section is on
 * screen, catch a sweep of light, then drift apart with dashed bridges that
 * reach for each other and never connect. Then what investors actually check,
 * and how that differs from what an agency does.
 */
export default function Problem() {
  // One block, a light sweep, then it comes apart.
  const pieces = useReveal("is-packed", 0.45, (el) => {
    const sheen = setTimeout(() => el.classList.add("is-sheen"), 200);
    const split = setTimeout(() => el.classList.remove("is-packed"), 900);
    return () => {
      clearTimeout(sheen);
      clearTimeout(split);
    };
  });
  // The four checks rise in, one after another.
  const star = useReveal("is-waiting", 0.3, (el) => void el.classList.remove("is-waiting"));

  return (
    <section id="problem" className="overflow-hidden py-12 md:py-28">
      <Container as="div">
        <div className="grid items-center gap-x-12 gap-y-12 lg:grid-cols-2">
          <div>
            <h2 className="max-w-[52.25rem] text-3xl font-medium text-balance md:text-4xl">Stop building your startup in pieces.</h2>
            <div className="mt-10 border-t border-dark/10 pt-6 lg:mt-14">
              <p className="mono-text font-mono text-dark/70">What most founders we meet have spent this way</p>
              <p className="mt-3 text-4xl leading-none font-medium">₹2 to ₹10 lakh</p>
              <p className="mt-5 text-xl lg:text-2xl">A year later, nothing connects.</p>
            </div>
            <p className="sr-only">
              A freelancer builds the app. An agency runs the marketing. A CA files the returns, and a lawyer drafts whatever someone
              remembers to ask for. Most founders we meet have spent ₹2 to ₹10 lakh this way, and a year later, nothing connects.
            </p>
          </div>

          <div ref={pieces} className="kn-pieces">
            <svg aria-hidden="true" width="0" height="0" className="absolute">
              <defs>
                <linearGradient id="kn-tile" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0" stopColor="#ffffff" />
                  <stop offset="1" stopColor="#cfe3fa" />
                </linearGradient>
                <linearGradient id="kn-tile-star" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0" stopColor="#ffffff" stopOpacity=".28" />
                  <stop offset="1" stopColor="#ffffff" stopOpacity=".06" />
                </linearGradient>
              </defs>
            </svg>
            <ul className="kn-pieces-grid" aria-label="Four vendors who never meet">
              {vendors.map((v) => (
                <li key={v.who} className="kn-piece">
                  <div className="kn-float kn-card flex h-full flex-col rounded-lg p-4 sm:p-6">
                    <Tile d={v.icon} className="kn-icon" />
                    <p className="mono-text mt-5 font-mono text-dark/70">{v.who}</p>
                    <p className="mt-1.5 text-sm leading-tight font-medium lg:text-lg">{v.does}</p>
                  </div>
                </li>
              ))}
            </ul>
            {(["t", "b", "l", "r"] as const).map((side) => (
              <span key={side} aria-hidden="true" className={`kn-bridge kn-bridge-${side}`}>
                <i />
                <i />
              </span>
            ))}
            <span aria-hidden="true" className="kn-hub mono-text font-mono">
              Your
              <br />
              startup
            </span>
          </div>
        </div>

        <div ref={star} className="kn-star mt-16 rounded-xl lg:mt-28">
          <div
            aria-hidden="true"
            className="absolute inset-0 overflow-hidden after:absolute after:top-0 after:left-0 after:size-[140%] after:animate-grain after:bg-grain after:opacity-[0.04]"
          />
          <div className="kn-star-inner text-center">
            <h3 className="kn-star-title text-3xl font-medium md:text-4xl">Investors check four things.</h3>
            <ul className="kn-maxw mx-auto mt-8 grid gap-1.5 text-left sm:grid-cols-2 lg:mt-12">
              {checks.map((c, i) => (
                <li key={c.what} className="kn-check" style={{ "--i": i } as CSSProperties}>
                  <Tile d={c.icon} star className="kn-icon-lg" />
                  <div>
                    <p className="text-xl leading-tight font-medium lg:text-2xl">{c.what}</p>
                    <a href="#services" className="kn-check-link mono-text mt-3 inline-flex font-mono">
                      Built by {c.by} →
                    </a>
                  </div>
                </li>
              ))}
            </ul>
            <p className="kn-star-close mx-auto mt-10 max-w-[44rem] text-xl text-balance lg:mt-14 lg:text-2xl">
              You don’t get any of them in pieces, and you can’t learn them in a classroom. You get them by building, with one team that
              owns the whole thing.
            </p>
          </div>
        </div>

        <div id="compare" className="mt-16 lg:mt-28">
          <h3 className="max-w-[52.25rem] text-3xl font-medium text-balance md:text-4xl">We are not an agency. We are your Execution Partner.</h3>
          <Compare />
        </div>
      </Container>
    </section>
  );
}
