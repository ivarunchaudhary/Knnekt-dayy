"use client";

import { useEffect, useRef } from "react";
import Container from "./Container";

const vendors = [
  { who: "Freelancer", does: "builds the app", icon: "M-8 -8L-16 0L-8 8M8 -8L16 0L8 8" },
  { who: "Agency", does: "runs the marketing", icon: "M-13 -5H-5L10 -13V13L-5 5H-13ZM-9 5L-6 14" },
  { who: "CA", does: "files the returns", icon: "M-11 -15H11V15L6 11L0 15L-6 11L-11 15ZM-5 -7H5M-5 -1H5M-5 5H1" },
  { who: "Lawyer", does: "drafts whatever someone remembers to ask for", icon: "M-11 -15H6L12 -9V15H-11ZM-5 -3H6M-5 5H6" },
];

/**
 * The problem: founders buy their startup in pieces from vendors who never
 * meet. The four pieces sit packed as one block until the section is on
 * screen, catch a sweep of light, then drift apart with dashed bridges that
 * reach for each other and never connect.
 */
export default function Pieces() {
  const pieces = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = pieces.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches || !("IntersectionObserver" in window)) return;
    el.classList.add("is-packed");
    let sheen = 0;
    let split = 0;
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        io.disconnect();
        sheen = window.setTimeout(() => el.classList.add("is-sheen"), 200);
        split = window.setTimeout(() => el.classList.remove("is-packed"), 900);
      },
      { threshold: 0.45 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      clearTimeout(sheen);
      clearTimeout(split);
    };
  }, []);

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
              </defs>
            </svg>
            <ul className="kn-pieces-grid" aria-label="Four vendors who never meet">
              {vendors.map((v) => (
                <li key={v.who} className="kn-piece">
                  <div className="kn-float kn-card flex h-full flex-col rounded-lg p-4 sm:p-6">
                    <svg aria-hidden="true" viewBox="-32 -32 64 64" className="kn-icon shrink-0">
                      <rect x="-28" y="-28" width="56" height="56" rx="10" fill="url(#kn-tile)" stroke="#16253f" strokeWidth="3.5" />
                      <g fill="none" stroke="#16253f" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <path d={v.icon} />
                      </g>
                    </svg>
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
      </Container>
    </section>
  );
}
