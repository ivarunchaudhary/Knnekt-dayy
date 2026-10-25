"use client";

import { useEffect, useRef, useState, useSyncExternalStore, type CSSProperties } from "react";
import { services } from "@/lib/data";
import { cn } from "@/lib/utils";
import ServiceAnimation from "./ServiceAnimation";

const panelClass =
  "mx-auto grid w-full max-w-418 origin-top items-center px-4 py-15 sm:px-16 md:px-9 lg:min-h-screen lg:grid-cols-2 lg:px-0 lg:py-20 lg:[@media(max-height:910px)]:py-10 lg:sticky lg:top-0";

const capabilityClass =
  "before:bg-dark relative items-baseline gap-2 rounded-lg bg-gray-200 px-2.5 pt-1.5 pb-2 transition-colors duration-500 before:transition-colors before:duration-500 lg:flex lg:pt-2.5 lg:pb-3 lg:before:size-2 lg:before:shrink-0 lg:before:-translate-y-[20%] lg:before:rounded-full";

/** The chip for whichever capability the drawing above is acting out right now. */
const activeCapabilityClass = "bg-sky-soft before:bg-brand";

const WIDE = "(min-width: 64rem)";
const subscribeWide = (cb: () => void) => {
  const m = window.matchMedia(WIDE);
  m.addEventListener("change", cb);
  return () => m.removeEventListener("change", cb);
};

/**
 * Four full-height panels stack on top of each other while scrolling (sticky cards).
 * The dark, image-backed background is itself sticky and cross-fades per active service.
 *
 * Below `lg` each function's title moves inside its card, and the panels stack the
 * same way (`kn-stack`) only if every one of them fits the screen; otherwise they
 * scroll past one another like any other block.
 */
export default function Services() {
  const root = useRef<HTMLElement>(null);
  const cards = useRef<(HTMLDivElement | null)[]>([]);
  const [active, setActive] = useState(0);
  const [stacked, setStacked] = useState(false);
  /** The function whose title and photo are up, and whose proof card last popped. */
  const shown = useRef(-1);
  const wide = useSyncExternalStore(subscribeWide, () => window.matchMedia(WIDE).matches, () => true);

  // Desktop: size each drawing to the room left in its panel, so the card always clears the bottom nav.
  // Phone and tablet: stack the panels if each, titled, fits under the ones before it.
  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const panels = Array.from(el.querySelectorAll<HTMLElement>("[data-panel]"));
    const fit = () => {
      cards.current.forEach((card) => {
        const svg = card?.querySelector<SVGSVGElement>("svg[data-svc]");
        const box = card?.firstElementChild as HTMLElement | null;
        const panel = card?.closest<HTMLElement>("[data-panel]");
        if (!svg || !box || !panel) return;
        if (!wide) {
          svg.style.maxHeight = "";
          return;
        }
        const cs = getComputedStyle(panel);
        svg.style.maxHeight = "none";
        // layout sizes, unaffected by the stacking transform
        const room = window.innerHeight - parseFloat(cs.paddingTop) - parseFloat(cs.paddingBottom) - (box.offsetHeight - svg.clientHeight) - 8;
        svg.style.maxHeight = `${Math.max(120, Math.floor(room))}px`;
      });
    };
    const stackFit = () => {
      if (wide) {
        setStacked(false);
        return;
      }
      const phone = window.innerWidth < 768;
      const top = phone ? 62 : 20;
      const step = phone ? 8 : 14;
      setStacked(panels.every((p, i) => p.offsetHeight <= window.innerHeight - top - i * step - 8));
    };
    const layout = () => {
      fit();
      stackFit();
    };
    layout();
    window.addEventListener("resize", layout);
    window.addEventListener("load", layout);
    return () => {
      window.removeEventListener("resize", layout);
      window.removeEventListener("load", layout);
    };
  }, [wide]);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const panels = Array.from(el.querySelectorAll<HTMLElement>("[data-panel]"));
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    let raf = 0;
    // The proof card pops in each time its function comes up.
    const pop = (i: number) => {
      const proof = cards.current[i]?.querySelector("[data-proof]");
      if (!proof || reduced.matches) return;
      proof.classList.remove("is-pop");
      void (proof as HTMLElement).offsetWidth;
      proof.classList.add("is-pop");
    };
    const update = () => {
      raf = 0;
      const vh = window.innerHeight;
      let idx = 0;
      panels.forEach((panel, i) => {
        if (panel.getBoundingClientRect().top <= vh * 0.5) idx = i;
        // how far the *next* panel has travelled over this one (0..1)
        const next = panels[i + 1];
        const card = cards.current[i];
        if (!card) return;
        const covered = next && (wide || stacked) ? Math.min(1, Math.max(0, 1 - next.getBoundingClientRect().top / vh)) : 0;
        if (stacked) {
          // phone and tablet deck: solid cards, the earlier ones shrink a little behind
          card.style.opacity = "1";
          card.style.transform = `scale(${1 - covered * 0.05})`;
        } else {
          card.style.opacity = String(Math.max(0, 1 - covered * 1.4));
          card.style.transform = `scale(${1 - covered * 0.06}) translateY(${-covered * 40}px)`;
        }
      });
      const box = el.getBoundingClientRect();
      if (box.bottom < 0 || box.top > vh || idx === shown.current) return;
      shown.current = idx;
      setActive(idx);
      pop(idx);
    };
    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, [wide, stacked]);

  return (
    <section id="services" ref={root} className={cn("relative isolate lg:px-9", stacked && "kn-stack")}>
      {services.map((s, i) => {
        const title = (
          <h2 className={cn("text-2xl font-medium text-white lg:sr-only", !wide && "kn-in-card")}>
            <span className="block text-white/50">
              <span className="text-white">Under one roof,</span> we run
            </span>
            <span className="block">{s.title}</span>
          </h2>
        );
        return (
          <div key={s.id} data-panel className={panelClass} style={{ "--i": i } as CSSProperties}>
            {wide && title}
            <div
              className="mt-8 lg:col-start-2 lg:mt-0 lg:h-(--card-height)"
              data-service-card="true"
              ref={(el) => {
                cards.current[i] = el;
              }}
              style={{ transformOrigin: "top center", willChange: "transform, opacity" }}
            >
              <ServiceCard service={s} title={wide ? null : title} />
            </div>
          </div>
        );
      })}

      {/* Sticky background: left-hand titles + cross-fading photos + grain */}
      <div className="absolute inset-0 -z-10" aria-hidden="true">
        <div className="sticky top-0 grid h-screen w-full py-20">
          <div className="mx-auto hidden w-full max-w-418 grid-cols-12 px-9 text-3xl font-medium text-white lg:grid">
            <div className="col-span-5 flex h-full flex-col">
              <div className="flex h-1/2 flex-col justify-end">
                <h2>
                  <span className="text-white">Under one roof,</span> <span className="text-white/50">we run</span>
                </h2>
              </div>
              <div className="relative h-1/2">
                {services.map((s, i) => (
                  <span key={s.id} data-service-label className={`absolute inset-0 transition duration-300 ${i === active ? "" : "opacity-0 translate-y-10"}`}>
                    {s.title}
                  </span>
                ))}
              </div>
            </div>
          </div>
          <div className="after:animate-grain after:bg-grain absolute inset-0 -z-10 overflow-hidden after:absolute after:top-0 after:left-0 after:size-[140%] after:opacity-5" />
          {services.map((s, i) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={s.id}
              alt=""
              loading="lazy"
              width={1920}
              height={1112}
              sizes="100vw"
              src={s.bg}
              data-service-bg
              className={`absolute inset-0 -z-20 grid h-screen w-full object-cover transition-opacity duration-1000 ${i === active ? "" : "opacity-0"}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function ServiceCard({ service: s, title }: { service: (typeof services)[number]; title: React.ReactNode }) {
  const [step, setStep] = useState<string>();
  return (
    <div className="overflow-hidden rounded-lg bg-white px-4 pt-5 lg:max-w-170 lg:rounded-xl lg:pt-8">
      {title}
      <div className="px-2 lg:px-10">
        <ServiceAnimation id={s.id} title={`${s.title}: ${s.capabilities.join(", ")}`} onStep={setStep} />
      </div>
      <div className="p-5 pt-7 lg:px-14 lg:py-12 lg:[@media(max-height:910px)]:py-8">
        <p className="text-md leading-tight lg:max-w-145">{s.text}</p>
        <p id={`service-list-title-${s.id}`} className="mono-text text-dark/80 mt-11 font-mono leading-tight lg:[@media(max-height:910px)]:mt-8">
          What that covers
        </p>
        <ul
          data-covers
          className="mt-3.5 grid grid-cols-2 gap-1.5 text-xs leading-tight lg:gap-2 lg:[@media(max-height:910px)]:mt-2"
          aria-labelledby={`service-list-title-${s.id}`}
        >
          {s.capabilities.map((c) => (
            <li key={c} className={cn(capabilityClass, c === step && activeCapabilityClass)}>
              {c}
            </li>
          ))}
        </ul>
        <div className="kn-proof" data-proof role="group" aria-labelledby={`service-proof-title-${s.id}`}>
          <span className="kn-proof-ico">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M5 12.5l4.5 4.5L19 7.5" />
            </svg>
          </span>
          <div>
            <p id={`service-proof-title-${s.id}`} className="kn-proof-label mono-text font-mono leading-tight">
              The proof it creates
            </p>
            <p className="kn-proof-text">{s.proof}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
