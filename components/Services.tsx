"use client";

import { useEffect, useRef, useState } from "react";
import { services } from "@/lib/data";
import Vimeo from "./Vimeo";

const panelClass =
  "mx-auto grid w-full max-w-418 origin-top items-center px-4 py-15 sm:px-16 md:px-9 lg:min-h-screen lg:grid-cols-2 lg:px-0 lg:py-20 lg:[@media(max-height:910px)]:py-10 lg:sticky lg:top-0";

const capabilityClass =
  "before:bg-dark relative items-baseline gap-2 rounded-lg bg-gray-200 px-2.5 pt-1.5 pb-2 lg:flex lg:pt-2.5 lg:pb-3 lg:before:size-2 lg:before:shrink-0 lg:before:-translate-y-[20%] lg:before:rounded-full";

/**
 * Four full-height panels stack on top of each other while scrolling (sticky cards).
 * The dark, image-backed background is itself sticky and cross-fades per active service.
 */
export default function Services() {
  const root = useRef<HTMLElement>(null);
  const cards = useRef<(HTMLDivElement | null)[]>([]);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const panels = Array.from(el.querySelectorAll<HTMLElement>("[data-panel]"));
    let raf = 0;
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
        const covered = next ? Math.min(1, Math.max(0, 1 - next.getBoundingClientRect().top / vh)) : 0;
        card.style.opacity = String(Math.max(0, 1 - covered * 1.4));
        card.style.transform = `scale(${1 - covered * 0.06}) translateY(${-covered * 40}px)`;
      });
      setActive(idx);
    };
    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, []);

  return (
    <section id="services" ref={root} className="relative isolate lg:px-9">
      {services.map((s, i) => {
        return (
          <div key={s.id} data-panel className={panelClass}>
            <h2 className="text-2xl font-medium text-white lg:sr-only">
              <span className="block text-white/50">People work with us to</span>
              <span className="block">{s.title}</span>
            </h2>
            <div
              className="mt-8 lg:col-start-2 lg:mt-0 lg:h-(--card-height)"
              data-service-card="true"
              ref={(el) => {
                cards.current[i] = el;
              }}
              style={{ transformOrigin: "top center", willChange: "transform, opacity" }}
            >
              <div className="overflow-hidden rounded-lg bg-white px-4 pt-5 lg:max-w-170 lg:rounded-xl lg:pt-8">
                <div className={s.mediaClass}>
                  <Vimeo id={s.vimeo} aspect={s.vimeoAspect} title={`Service Animation ${i + 1}`} />
                </div>
                <div className="p-5 pt-7 lg:px-14 lg:py-12 lg:[@media(max-height:910px)]:py-8">
                  <p className="text-md leading-tight lg:max-w-145">{s.text}</p>
                  <p id={`service-list-title-${s.id}`} className="mono-text text-dark/80 mt-11 font-mono leading-tight lg:[@media(max-height:910px)]:mt-8">
                    Our Capabilities
                  </p>
                  <ul
                    className="mt-3.5 grid grid-cols-2 gap-1.5 text-xs leading-tight lg:gap-2 lg:[@media(max-height:910px)]:mt-2"
                    aria-labelledby={`service-list-title-${s.id}`}
                  >
                    {s.capabilities.map((c) => (
                      <li key={c} className={capabilityClass}>
                        {c}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
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
                <h2 className="text-white/50">People work with us to</h2>
              </div>
              <div className="relative h-1/2">
                {services.map((s, i) => (
                  <span key={s.id} className={`absolute inset-0 transition duration-300 ${i === active ? "" : "opacity-0 translate-y-10"}`}>
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
              className={`absolute inset-0 -z-20 grid h-screen w-full object-cover transition-opacity duration-1000 ${i === active ? "" : "opacity-0"}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
