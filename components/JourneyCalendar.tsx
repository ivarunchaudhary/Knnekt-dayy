"use client";

import { useEffect, useRef, useState, type CSSProperties, type KeyboardEvent } from "react";
import { createPortal } from "react-dom";
import type { CalendarTile, StageCalendar } from "@/lib/journeyCalendars";
import JourneyIllustration from "./JourneyIllustration";

/** Below 48rem a calendar opens in a sheet from the bottom of the screen rather than inside its card. */
const PHONE = "(max-width: 47.99rem)";

/** The week themes take the calendar's six colours in turn. */
const themes = ["coral", "amber", "mint", "blue", "violet", "pink"];

function Tile({ tile: { kind, title, time, lead, art } }: { tile: CalendarTile }) {
  return (
    <li className={`kc-tile kc-${kind}${lead ? " kc-lead" : ""}${art ? " kc-has-photo" : ""}`}>
      {art && (
        <span className="kc-photo">
          <JourneyIllustration name={art} />
        </span>
      )}
      <span className="kc-body">
        {time && <span className="kc-time">{time}</span>}
        <span className="kc-title">{title}</span>
      </span>
    </li>
  );
}

/**
 * The calendar itself: week tabs, a key, and the week as seven columns of colour-coded
 * tiles. Day 100 is one day, so it runs left to right as a timeline instead. Closed, it's
 * inert, so its tabs aren't in the tab order while they can't be seen.
 */
function Calendar({ cal, week, onWeek, inert }: { cal: StageCalendar; week: number; onWeek: (i: number) => void; inert: boolean }) {
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);

  if ("schedule" in cal) {
    return (
      <div className="kc kd" id={cal.id} role="region" aria-label={cal.name} inert={inert}>
        <p className="kd-hint-row">
          <span className="kd-hint mono-text font-mono">Scroll →</span>
        </p>
        <ol className="kd-line-wrap">
          {cal.schedule.map((item, i) => (
            <li key={item.time} className={`kd-item${item.main ? " kd-main" : ""}`} style={{ "--i": i } as CSSProperties}>
              <span className="kd-dot" aria-hidden="true" />
              <span className="kd-time mono-text font-mono">{item.time}</span>
              <span className="kd-card">
                <span className="kd-pic">
                  <JourneyIllustration name={item.art} />
                </span>
                <span className="kd-body">
                  <span className="kd-title">{item.title}</span>
                  <span className="kd-line">{item.line}</span>
                </span>
              </span>
            </li>
          ))}
        </ol>
      </div>
    );
  }

  const pick = (i: number) => {
    onWeek(i);
    tabs.current[i]?.scrollIntoView({ block: "nearest", inline: "nearest", behavior: "smooth" });
  };
  // Arrow keys walk the tabs, wrapping round at either end.
  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    const i = tabs.current.indexOf(document.activeElement as HTMLButtonElement);
    if (i < 0 || (e.key !== "ArrowRight" && e.key !== "ArrowLeft")) return;
    const n = (i + (e.key === "ArrowRight" ? 1 : cal.weeks.length - 1)) % cal.weeks.length;
    tabs.current[n]?.focus();
    pick(n);
  };

  return (
    <div className="kc kc-even" id={cal.id} role="region" aria-label={cal.name} inert={inert}>
      <div className="kc-bar">
        <div className="kc-tabs" role="tablist" aria-label="Weeks" onKeyDown={onKeyDown}>
          {cal.weeks.map((w, i) => (
            <button
              key={w.span}
              ref={(el) => {
                tabs.current[i] = el;
              }}
              type="button"
              role="tab"
              id={`${cal.id}-w${i}-tab`}
              aria-controls={`${cal.id}-w${i}`}
              aria-selected={i === week}
              tabIndex={i === week ? 0 : -1}
              className="kc-tab"
              onClick={() => pick(i)}
            >
              {w.theme && <span className={`kc-theme kc-theme-${themes[i % themes.length]}`}>{w.theme}</span>}
              <span className="kc-wk">{w.span}</span>
            </button>
          ))}
        </div>
      </div>
      <ul className="kc-legend" aria-label="Key">
        {cal.legend.map(([kind, label]) => (
          <li key={kind} className={`kc-key kc-${kind}`}>
            <i />
            {label}
          </li>
        ))}
      </ul>
      {cal.weeks.map((w, i) => (
        <div key={w.span} className="kc-week" id={`${cal.id}-w${i}`} role="tabpanel" aria-labelledby={`${cal.id}-w${i}-tab`} hidden={i !== week}>
          <div className="kc-grid">
            {w.days.map((d) => (
              <div key={d.dow} className={`kc-col${d.tone ? ` kc-col-${d.tone}` : ""}`}>
                <div className="kc-head">
                  <span className="kc-dow">{d.dow}</span>
                  <span className="kc-num">{d.num}</span>
                </div>
                <ol className="kc-stack">
                  {d.tiles.map((tile) => (
                    <Tile key={tile.title} tile={tile} />
                  ))}
                </ol>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

/**
 * A stage's "See the … calendar" pill and the calendar it opens. From a tablet up the
 * calendar unfolds inside the card; on a phone it slides up in a sheet instead, the
 * calendar moving into the sheet and back once it has slid away, so the week you were
 * on stays picked either way. A calendar left open in its card folds away when the
 * window narrows to a phone, and the sheet closes when it widens past one.
 */
export default function JourneyCalendar({ cal }: { cal: StageCalendar }) {
  const [open, setOpen] = useState<false | "inline" | "sheet">(false);
  // The calendar is in the sheet from the moment it opens until the sheet has slid away.
  const [inSheet, setInSheet] = useState(false);
  // The sheet is drawn once offscreen, then raised a frame later so it slides up.
  const [raised, setRaised] = useState(false);
  const [week, setWeek] = useState(0);
  const button = useRef<HTMLButtonElement>(null);
  const sheet = useRef<HTMLDivElement>(null);
  const closer = useRef<HTMLButtonElement>(null);

  const toggle = () => {
    if (window.matchMedia(PHONE).matches) {
      setRaised(false);
      setInSheet(true);
      setOpen("sheet");
    } else setOpen((o) => (o === "inline" ? false : "inline"));
  };

  const close = () => {
    setOpen(false);
    button.current?.focus({ preventScroll: true });
  };

  // The sheet is up: lock the page behind it, slide it in, hand it focus, and let Escape close it.
  useEffect(() => {
    if (open !== "sheet") return;
    document.body.classList.add("mh-lock");
    void sheet.current?.offsetWidth;
    const raf = requestAnimationFrame(() => setRaised(true));
    const focus = setTimeout(() => closer.current?.focus({ preventScroll: true }), 300);
    const onKey = (e: globalThis.KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        button.current?.focus({ preventScroll: true });
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.classList.remove("mh-lock");
      cancelAnimationFrame(raf);
      clearTimeout(focus);
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  // Once the sheet has slid away, the calendar goes back into its card.
  useEffect(() => {
    if (open === "sheet" || !inSheet) return;
    const t = setTimeout(() => setInSheet(false), 320);
    return () => clearTimeout(t);
  }, [open, inSheet]);

  useEffect(() => {
    const mq = window.matchMedia(PHONE);
    const onChange = () => {
      if (mq.matches ? open === "inline" : open === "sheet") setOpen(false);
    };
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, [open]);

  const calendar = <Calendar cal={cal} week={week} onWeek={setWeek} inert={inSheet ? false : open !== "inline"} />;
  const title = cal.label.replace(/^See the /, "").replace(/^./, (s) => s.toUpperCase());

  return (
    <>
      <p className="mt-6">
        <button
          ref={button}
          type="button"
          className="kn-cal-btn"
          aria-expanded={open !== false}
          aria-controls={cal.id}
          data-cal-toggle=""
          data-label={cal.label}
          data-hide={cal.hide}
          onClick={toggle}
        >
          {/* A calendar page for the weeks; a clock for Day 100, which runs by the hour. */}
          <svg className="kn-cal-ico" viewBox="0 0 20 20" aria-hidden="true">
            {"schedule" in cal ? (
              <>
                <circle cx="10" cy="10" r="7.5" />
                <path d="M10 5.5V10l3 2" />
              </>
            ) : (
              <>
                <rect x="2.5" y="4" width="15" height="13" rx="2.5" />
                <path d="M2.5 8.5h15M6.5 2.5v3M13.5 2.5v3" />
              </>
            )}
          </svg>
          <span data-cal-label="">{open === "inline" ? (cal.hide ?? "Hide the calendar") : cal.label}</span>
          <span aria-hidden="true" className="kn-cal-arrow">
            ↓
          </span>
        </button>
      </p>
      <div className={`kc-wrap${open === "inline" ? " is-open" : ""}`} data-cal-wrap="">
        <div className="kc-clip">{!inSheet && calendar}</div>
      </div>
      {inSheet &&
        createPortal(
          <div ref={sheet} className={`mcal${open === "sheet" && raised ? " is-open" : ""}`}>
            <div className="mcal-back" data-mcal-close="" onClick={close} />
            <div className="mcal-card" role="dialog" aria-modal="true" aria-labelledby={`${cal.id}-sheet`}>
              <div className="mcal-grab" aria-hidden="true" />
              <div className="mcal-head">
                <p className="mcal-title" id={`${cal.id}-sheet`}>
                  {title}
                </p>
                <button ref={closer} type="button" className="mcal-close" aria-label="Close" data-mcal-close="" onClick={close}>
                  ✕
                </button>
              </div>
              <div className="mcal-body">{calendar}</div>
            </div>
          </div>,
          document.body,
        )}
    </>
  );
}
