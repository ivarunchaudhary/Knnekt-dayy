"use client";

import { type CSSProperties, useEffect, useRef, useState } from "react";
import { faculty, type FacultyMember } from "@/lib/data";
import Container, { SectionHeading } from "./Container";

const reduceMotion = () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/** The execution team, colour-coded by function, in roster order. */
const TEAM_COLOURS = ["#ff7a6b", "#3b81e3", "#8b7cf6", "#34c9a0", "#ffc24b", "#ec6aa8"];

/** Until someone is signed, their face is a silhouette marked "Photo". */
function Photo({ person, className }: { person: FacultyMember; className: string }) {
  if (person.src) {
    return (
      <span className={className}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img alt={person.alt ?? ""} loading="lazy" decoding="async" width={400} height={400} src={person.src} />
      </span>
    );
  }
  return (
    <span className={`${className} fc-ph`} role="img" aria-label={`Photo to come: ${person.seat}`}>
      <svg className="fc-sil" viewBox="0 0 120 120" aria-hidden="true">
        <circle cx="60" cy="46" r="20" fill="currentColor" />
        <path d="M22 116c4-26 20-38 38-38s34 12 38 38z" fill="currentColor" />
      </svg>
      <span className="fc-ph-label mono-text font-mono">Photo</span>
    </span>
  );
}

/** One masterclass expert: who they are on the left, their portrait on the right, their seat as the badge. */
function ExpertCard({ person }: { person: FacultyMember }) {
  const [first, ...rest] = (person.name ?? "Expert name").split(" ");
  return (
    <li className="fc-card">
      <div className="fc-card-text">
        <p className="fc-name">
          <span>{first}</span> {rest.join(" ")}
        </p>
        <span className="fc-rule" />
        <p className="fc-role">{person.role ?? "Designation"}</p>
        <p className="fc-at">at</p>
        {person.company ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img className="fc-logo-img" alt={person.company.name} src={person.company.logo} />
        ) : (
          <span className="fc-logo mono-text font-mono">Company logo</span>
        )}
        <p className="fc-qual">Qualification</p>
        <span className="fc-badge">{person.seat}</span>
      </div>
      <Photo person={person} className="fc-card-photo" />
    </li>
  );
}

/**
 * The masterclass experts sit in one sideways-scrolling grid, two rows deep, on
 * a navy panel. Three columns are in view on a wide screen; the rest, and the
 * "…and more" tile, scroll in from the right, with arrows for anyone not on a trackpad.
 */
function Masterclasses() {
  const [investors] = faculty;
  const row = useRef<HTMLUListElement>(null);
  const [edge, setEdge] = useState({ start: true, end: false });

  useEffect(() => {
    const el = row.current;
    if (!el) return;
    const update = () =>
      setEdge({ start: el.scrollLeft <= 4, end: el.scrollLeft + el.clientWidth >= el.scrollWidth - 4 });
    update();
    el.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      el.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  const scroll = (dir: 1 | -1) => {
    const el = row.current;
    if (!el) return;
    const step = el.firstElementChild ? el.firstElementChild.getBoundingClientRect().width + 16 : 300;
    el.scrollBy({ left: dir * step, behavior: reduceMotion() ? "auto" : "smooth" });
  };

  return (
    <div className="fc-master">
      <div className="fc-master-head">
        <div>
          <span className="fc-pill mono-text rounded-full px-3 py-1.5 font-mono">{investors.kicker}</span>
          <p className="fc-summary">{investors.text}</p>
        </div>
        <div className="fc-arrows">
          <button type="button" aria-label="Previous experts" disabled={edge.start} onClick={() => scroll(-1)}>
            ←
          </button>
          <button type="button" aria-label="Next experts" disabled={edge.end} onClick={() => scroll(1)}>
            →
          </button>
        </div>
      </div>
      {/* The row scrolls, so it takes focus for the keyboard. */}
      <ul ref={row} className="fc-scroll" aria-label="Masterclass experts" tabIndex={0}>
        {investors.people.map((person) => (
          <ExpertCard key={person.seat} person={person} />
        ))}
        <li className="fc-more">
          <p>{investors.more}</p>
        </li>
      </ul>
    </div>
  );
}

/**
 * The execution team is the opposite promise — the same faces, all 100 days —
 * so it stands in one row on a pale sky panel, each portrait ringed in the
 * colour of the function that person runs, with the role and what they own beneath.
 */
function Team() {
  const [, studio] = faculty;
  const partners = studio.more.replace(/^…and more /, "");
  return (
    <div className="fc-team">
      <span className="mono-text rounded-full border border-dark/20 px-3 py-1.5 font-mono">{studio.kicker}</span>
      <h3 className="mt-6 text-3xl font-medium md:text-4xl">{studio.title}</h3>
      <div className="fc-team-panel">
        <ul className="fc-team-row" aria-label={studio.kicker}>
          {studio.people.map((person, i) => (
            <li key={person.seat} className="fc-member" style={{ "--c": TEAM_COLOURS[i % TEAM_COLOURS.length] } as CSSProperties}>
              <Photo person={person} className="fc-member-photo" />
              {person.fn && <p className="fc-member-fn mono-text font-mono">{person.fn}</p>}
              <p className="fc-member-role">{person.name ?? person.seat}</p>
              <p className="fc-member-title">{person.teaches}</p>
            </li>
          ))}
          <li className="fc-team-more">
            <p>
              …and more <b>{partners}</b>
            </p>
          </li>
        </ul>
      </div>
    </div>
  );
}

/**
 * Who actually takes the classes: the experts who run the weekly masterclasses,
 * on a navy panel that scrolls sideways, then the execution team that builds
 * beside the cohort, in one colour-coded row on the sky.
 */
export default function Faculty() {
  return (
    <section id="faculty" className="py-12 md:py-28">
      <Container>
        <SectionHeading lead="You don’t just get a studio. You get the community.">
          Weekly masterclasses with investors, founders and industry experts, and the same team building beside you for all 100 days.
        </SectionHeading>
        <Masterclasses />
        <Team />
      </Container>
    </section>
  );
}
