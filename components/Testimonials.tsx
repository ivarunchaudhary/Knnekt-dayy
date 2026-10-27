"use client";

import { useEffect, useRef } from "react";
import { testimonials, type Testimonial } from "@/lib/data";
import { containerClass, SectionHeading } from "./Container";

/** px per second */
const SPEED = 28;

function Card({ t, copy }: { t: Testimonial; copy?: boolean }) {
  // "Founder · Athleisure · In market" → heading "Athleisure", "Founder · In market" beneath.
  const [role, sector, stage] = t.attribution.split(" · ");
  return (
    <li className="tc-card" aria-hidden={copy || undefined} tabIndex={copy ? -1 : undefined}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img className="tc-img" alt={copy ? "" : t.image.alt} src={t.image.src} loading="lazy" draggable={false} />
      <div className="tc-body">
        <p className="tc-name">{sector}</p>
        <p className="tc-meta">
          {role} · {stage} <span className="tc-proof mono-text font-mono">{t.result}</span>
        </p>
        <blockquote className="tc-quote">“{t.quote}”</blockquote>
      </div>
    </li>
  );
}

/**
 * Founder quotes, one card per startup, two rows by three columns in view, on
 * a ticker that drifts on its own. It holds on touch and focus; a drag, a
 * sideways swipe or the arrows take over (the arrows step one column). A
 * phone gets the same two drifting rows, one column in view.
 *
 * Nine cards fill two rows unevenly, so the set is repeated to eighteen (nine
 * even columns), then once more for the seamless wrap.
 */
export default function Testimonials() {
  const viewport = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLUListElement>(null);
  const stepRef = useRef<(dir: 1 | -1) => void>(() => {});

  useEffect(() => {
    const vp = viewport.current;
    const list = track.current;
    if (!vp || !list) return;
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    let loopW = 0;
    let paused = false;
    let resumeAt = 0;
    let last = 0;
    let raf = 0;
    let pos = 0;
    let glide: { from: number; to: number; t0: number } | null = null;

    const measure = () => (loopW = list.scrollWidth / 2);
    const colW = () => list.children[2].getBoundingClientRect().left - list.children[0].getBoundingClientRect().left;
    const wrap = () => {
      if (loopW <= 0) return;
      if (vp.scrollLeft >= loopW) vp.scrollLeft -= loopW;
      else if (vp.scrollLeft <= 0) vp.scrollLeft += loopW;
    };
    const hold = (ms = 2500) => (resumeAt = performance.now() + ms);
    const frame = (now: number) => {
      const dt = last ? Math.min(0.05, (now - last) / 1000) : 0;
      last = now;
      if (glide) {
        const k = Math.min(1, (now - glide.t0) / 450);
        const e = 1 - Math.pow(1 - k, 3);
        vp.scrollLeft = glide.from + (glide.to - glide.from) * e;
        if (k >= 1) {
          glide = null;
          wrap();
        }
      } else if (!reduce && !paused && now >= resumeAt) {
        // scrollLeft snaps to whole pixels, so keep the position as a float and write it rounded
        if (Math.abs(pos - vp.scrollLeft) > 2) pos = vp.scrollLeft;
        pos += SPEED * dt;
        if (loopW > 0 && pos >= loopW) pos -= loopW;
        vp.scrollLeft = Math.round(pos);
      }
      raf = requestAnimationFrame(frame);
    };
    stepRef.current = (dir) => {
      wrap();
      hold(3500);
      glide = { from: vp.scrollLeft, to: vp.scrollLeft + dir * colW(), t0: performance.now() };
    };

    const onFocusIn = () => (paused = true);
    const onFocusOut = () => {
      paused = false;
      hold(1200);
    };
    // only sideways scrolling takes over
    const onWheel = (e: WheelEvent) => Math.abs(e.deltaX) > Math.abs(e.deltaY) && hold();
    const onTouch = () => hold(4000);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
        e.preventDefault();
        stepRef.current(e.key === "ArrowRight" ? 1 : -1);
      }
    };
    // drag with a mouse
    let down: { x: number; s: number } | null = null;
    const onDown = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      down = { x: e.clientX, s: vp.scrollLeft };
      vp.classList.add("is-drag");
      hold(4000);
    };
    const onMove = (e: PointerEvent) => {
      if (!down) return;
      vp.scrollLeft = down.s - (e.clientX - down.x);
      wrap();
    };
    const onUp = () => {
      if (!down) return;
      down = null;
      vp.classList.remove("is-drag");
      hold(2500);
    };

    vp.addEventListener("focusin", onFocusIn);
    vp.addEventListener("focusout", onFocusOut);
    vp.addEventListener("wheel", onWheel, { passive: true });
    vp.addEventListener("touchstart", onTouch, { passive: true });
    vp.addEventListener("scroll", wrap, { passive: true });
    vp.addEventListener("keydown", onKey);
    vp.addEventListener("pointerdown", onDown);
    addEventListener("pointermove", onMove);
    addEventListener("pointerup", onUp);
    addEventListener("resize", measure);
    measure();
    const io = new IntersectionObserver(([e]) => {
      cancelAnimationFrame(raf);
      last = 0;
      if (e.isIntersecting) raf = requestAnimationFrame(frame);
    });
    io.observe(vp);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
      vp.removeEventListener("focusin", onFocusIn);
      vp.removeEventListener("focusout", onFocusOut);
      vp.removeEventListener("wheel", onWheel);
      vp.removeEventListener("touchstart", onTouch);
      vp.removeEventListener("scroll", wrap);
      vp.removeEventListener("keydown", onKey);
      vp.removeEventListener("pointerdown", onDown);
      removeEventListener("pointermove", onMove);
      removeEventListener("pointerup", onUp);
      removeEventListener("resize", measure);
    };
  }, []);

  return (
    <section id="testimonials" className="overflow-hidden py-12 md:py-28">
      <div className={containerClass}>
        <div className="tc-head">
          <SectionHeading lead="What founders say after building with us.">
            Don’t take our word for it. Hear it from the founders building with us.
          </SectionHeading>
          <div className="tc-arrows">
            <button type="button" aria-label="Previous founders" onClick={() => stepRef.current(-1)}>
              ←
            </button>
            <button type="button" aria-label="Next founders" onClick={() => stepRef.current(1)}>
              →
            </button>
          </div>
        </div>
        <div
          ref={viewport}
          className="tc-viewport"
          tabIndex={0}
          aria-label="What founders say, scrolls on its own; hover or touch to pause"
        >
          <ul ref={track} className="tc-track">
            {testimonials.map((t) => (
              <Card key={t.attribution} t={t} />
            ))}
            {[1, 2, 3].map((n) => testimonials.map((t) => <Card key={`${n}-${t.attribution}`} t={t} copy />))}
          </ul>
        </div>
      </div>
    </section>
  );
}
