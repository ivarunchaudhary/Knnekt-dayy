"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { IconBrandWhatsapp } from "@tabler/icons-react";
import { createPortal } from "react-dom";
import { feeIncludes, ledgerIn, paymentSteps, pricing, pricingFacts, scorePillars } from "@/lib/data";
import {
  SECTIONS,
  answered,
  archetypes,
  blankScholarship,
  gateCopy,
  grade,
  pageMeta,
  pages,
  pillars,
  questions,
  responses,
  scholarshipTracks,
  touched,
  verdicts,
  type Answers,
  type Identity,
  type Result,
  type Scholarship,
} from "@/lib/score";
import { identify, track, useFormTracking } from "@/lib/pixel";
import { LADDER, plan as planFor, planCopy, type Month, type Plan } from "@/lib/scorePlan";
import GradientBackground from "./GradientBackground";

/** The founder community invite. An env var can point a preview at another
 *  group; without one, everyone lands in the real community. */
const WHATSAPP_URL =
  process.env.NEXT_PUBLIC_WHATSAPP_COMMUNITY_URL ||
  "https://chat.whatsapp.com/JD2s9WpyM8PIKH1EjpcIjO";
const reduceMotion = () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const fieldClass =
  "mt-2 w-full rounded-lg border border-dark/10 bg-gray-100 px-4 py-3 text-sm outline-none transition-colors placeholder:text-dark-very-subtle focus:border-dark/40 focus:bg-white aria-[invalid=true]:border-[#b3261e]";
const labelClass = "mono-text text-dark/80 block font-mono";
const errorClass = "mono-text mt-2 block font-mono text-[#b3261e]";
const primaryBtn = "mono-text rounded-full bg-sky-deep px-7 py-3 font-mono text-white transition-colors outline-offset-2 outline-dark hover:bg-dark disabled:pointer-events-none disabled:opacity-40";
const outlineBtn = "mono-text rounded-lg border border-dark px-3.5 py-2 font-mono whitespace-nowrap text-dark transition-colors outline-offset-2 outline-dark hover:bg-dark hover:text-white";
const ghostBtn = "mono-text rounded-full px-3 py-2 font-mono text-dark/70 transition-colors outline-dark hover:text-dark";

/** Counts up from zero to `to` over `ms`, easing out, and settles on the exact figure. */
function useCountUp(to: number, ms: number) {
  const [n, setN] = useState(0);
  useEffect(() => {
    let raf = 0;
    if (reduceMotion()) {
      raf = requestAnimationFrame(() => setN(to));
      return () => cancelAnimationFrame(raf);
    }
    let t0 = 0;
    const step = (ts: number) => {
      if (!t0) t0 = ts;
      const p = Math.min((ts - t0) / ms, 1);
      setN(Math.round(to * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [to, ms]);
  return n;
}

function Eyebrow({ left, right }: { left: string; right: string }) {
  return (
    <p className="mono-text flex items-center justify-between gap-3 font-mono text-dark/60">
      <span>{left}</span>
      <span className="rounded-full bg-gray-100 px-2.5 py-1 text-dark/70">{right}</span>
    </p>
  );
}

const check = (
  <svg aria-hidden="true" viewBox="0 0 16 16" fill="none" className="size-2.5">
    <path d="M3 8.5l3.2 3.2L13 5" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

type Errors = Partial<Record<"name" | "email" | "phone" | "waConsent" | "schTrack" | "schCity", string>>;
const looksLikeEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim());
const looksLikePhone = (v: string) => v.replace(/\D/g, "").length >= 8;
const checkClass = "flex cursor-pointer items-start gap-3 rounded-lg border px-4 py-3 text-sm leading-tight transition-colors has-[:checked]:border-sky-deep has-[:checked]:bg-gray-100 hover:border-sky-deep";

/** The scholarship ask: one box, then the track, then whatever that track needs. */
function ScholarshipField({ value, errors, onChange }: { value: Scholarship; errors: Errors; onChange: (sc: Scholarship) => void }) {
  return (
    <div>
      <label className={`${checkClass} border-dark/15`}>
        <input
          type="checkbox"
          className="mt-0.5 size-4 shrink-0 accent-sky-deep"
          aria-describedby="sch-req-help"
          checked={value.requested}
          onChange={(e) => onChange(e.target.checked ? { ...value, requested: true } : blankScholarship())}
        />
        <span>
          <span className="font-medium">Consider me for a scholarship</span>{" "}
          <span id="sch-req-help" className="text-dark/70">
            One full scholarship every cohort, and 20–30% off the fee on four tracks. Asking doesn’t affect your selection.
          </span>
        </span>
      </label>
      {value.requested && (
        <>
          <fieldset className="mt-5 min-w-0" aria-describedby={errors.schTrack ? "sch-track-error" : undefined}>
            <legend className={`${labelClass} mb-2`}>Which track fits you best?</legend>
            <div className="grid gap-2 sm:grid-cols-2">
              {scholarshipTracks.map((t) => (
                <label
                  key={t.key}
                  className={`flex cursor-pointer items-start gap-3 rounded-lg border px-4 py-3 text-sm leading-tight transition-colors hover:border-sky-deep has-[:checked]:border-sky-deep has-[:checked]:bg-gray-100 ${errors.schTrack ? "border-[#b3261e]" : "border-dark/15"}`}
                >
                  <input
                    type="radio"
                    name="sch-track"
                    value={t.key}
                    className="mt-px size-4 shrink-0 accent-sky-deep"
                    checked={value.track === t.key}
                    aria-describedby={errors.schTrack ? "sch-track-error" : undefined}
                    onChange={() => onChange({ ...value, track: t.key, city: t.key === "beyond_metros" ? value.city : "", prior: t.key === "second_time" ? value.prior : "" })}
                  />
                  <span>
                    <span className="block font-medium">{t.name}</span>
                    <span className="mt-1 block text-dark/70">{t.desc}</span>
                  </span>
                </label>
              ))}
            </div>
            {errors.schTrack && (
              <span id="sch-track-error" className={errorClass}>
                {errors.schTrack}
              </span>
            )}
            <p className="mt-3 text-xs leading-tight text-dark/70">Everyone who asks is also considered for the Full Scholarship (100%).</p>
          </fieldset>
          {value.track === "beyond_metros" && (
            <p className="mt-5">
              <label className={labelClass} htmlFor="sch-city">
                Which city are you building from?
              </label>
              <input
                id="sch-city"
                type="text"
                maxLength={60}
                autoComplete="address-level2"
                aria-required="true"
                className={fieldClass}
                placeholder="e.g. Indore"
                value={value.city}
                onChange={(e) => onChange({ ...value, city: e.target.value })}
                aria-invalid={!!errors.schCity}
                aria-describedby={errors.schCity ? "sch-city-error" : undefined}
              />
              {errors.schCity && (
                <span id="sch-city-error" className={errorClass}>
                  {errors.schCity}
                </span>
              )}
            </p>
          )}
          {value.track === "second_time" && (
            <p className="mt-5">
              <label className={labelClass} htmlFor="sch-prior">
                What did you build before? One line <span className="text-dark/50">(optional)</span>
              </label>
              <input id="sch-prior" type="text" maxLength={120} className={fieldClass} placeholder="e.g. A D2C snacks brand, 2021–23" value={value.prior} onChange={(e) => onChange({ ...value, prior: e.target.value })} />
            </p>
          )}
          {value.track === "need_based" && (
            <p className="mt-5 rounded-lg bg-gray-100 px-4 py-3 text-sm leading-tight text-dark/80">We’ll ask for simple proof of income at your Selection Session. Nothing to upload now.</p>
          )}
        </>
      )}
    </div>
  );
}

/** Page one: who we're scoring, where the report goes, and the scholarship ask. */
function IdentityForm({ initial, onDraft, onNext }: { initial: Identity; onDraft: (id: Identity) => void; onNext: (id: Identity) => void }) {
  const [id, setId] = useState<Identity>(initial);
  const [errors, setErrors] = useState<Errors>({});
  // What's typed so far, before Continue, so a founder who leaves here is still kept.
  useEffect(() => onDraft(id), [id, onDraft]);
  const set = (key: "name" | "email" | "phone") => (e: React.ChangeEvent<HTMLInputElement>) => {
    setId((v) => ({ ...v, [key]: e.target.value }));
    setErrors((prev) => (prev[key] ? { ...prev, [key]: undefined } : prev));
  };
  const setScholarship = (sc: Scholarship) => {
    setId((v) => ({ ...v, scholarship: sc }));
    setErrors((prev) => ({ ...prev, schTrack: sc.track ? undefined : prev.schTrack, schCity: undefined }));
  };
  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const found: Errors = {};
    const sc = id.scholarship;
    if (id.name.trim().length < 2) found.name = "Tell us who you are.";
    if (!looksLikeEmail(id.email)) found.email = "That address doesn’t look right, and it’s where the report goes.";
    if (!looksLikePhone(id.phone)) found.phone = "We need a number we can actually call.";
    if (!id.waConsent) found.waConsent = "Tick this so we can send your report on WhatsApp.";
    if (sc.requested && !sc.track) found.schTrack = "Pick the track that fits you best.";
    if (sc.requested && sc.track === "beyond_metros" && sc.city.trim().length < 2) found.schCity = "Tell us which city you’re building from.";
    setErrors(found);
    if (Object.keys(found).length) {
      // After the render that marks them, so the first bad field takes focus.
      window.setTimeout(() => document.querySelector<HTMLElement>("[aria-invalid='true'], [aria-describedby='sch-track-error']")?.focus());
      return;
    }
    onNext({ ...id, name: id.name.trim(), email: id.email.trim().toLowerCase(), phone: id.phone.trim(), scholarship: { ...sc, city: sc.city.trim(), prior: sc.prior.trim() } });
  };
  return (
    <form noValidate onSubmit={submit} className="flex flex-1 flex-col motion-safe:animate-[score-in_0.5s_var(--ease-out-expo)_both]">
      <Eyebrow left="Before we start" right="5 min" />
      <h2 className="mt-6 text-xl leading-tight font-medium lg:text-2xl">First, who are we scoring?</h2>
      <p className="mt-2 text-sm leading-tight text-dark/70">Your report comes back to this address, and we call you on this number.</p>
      <div className="mt-6 grid gap-5">
        <p>
          <label className={labelClass} htmlFor="score-name">
            Your name
          </label>
          <input id="score-name" autoComplete="name" className={fieldClass} placeholder="Ada Sharma" value={id.name} onChange={set("name")} aria-invalid={!!errors.name} aria-describedby={errors.name ? "score-name-error" : undefined} />
          {errors.name && (
            <span id="score-name-error" className={errorClass}>
              {errors.name}
            </span>
          )}
        </p>
        <p>
          <label className={labelClass} htmlFor="score-email">
            Email
          </label>
          <input id="score-email" type="email" autoComplete="email" className={fieldClass} placeholder="ada@yourstartup.in" value={id.email} onChange={set("email")} aria-invalid={!!errors.email} aria-describedby={errors.email ? "score-email-error" : undefined} />
          {errors.email && (
            <span id="score-email-error" className={errorClass}>
              {errors.email}
            </span>
          )}
        </p>
        <div>
          <label className={labelClass} htmlFor="score-phone">
            Contact number
          </label>
          <input id="score-phone" type="tel" inputMode="tel" autoComplete="tel" className={fieldClass} placeholder="+91 98765 43210" value={id.phone} onChange={set("phone")} aria-invalid={!!errors.phone} aria-describedby={errors.phone ? "score-phone-error" : undefined} />
          {errors.phone && (
            <span id="score-phone-error" className={errorClass}>
              {errors.phone}
            </span>
          )}
          <label className={`${checkClass} mt-3 ${errors.waConsent ? "border-[#b3261e]" : "border-dark/15"}`}>
            <input
              type="checkbox"
              aria-required="true"
              className="mt-0.5 size-4 shrink-0 accent-sky-deep"
              checked={id.waConsent}
              aria-invalid={!!errors.waConsent}
              aria-describedby={errors.waConsent ? "score-wa-error" : undefined}
              onChange={(e) => {
                const on = e.target.checked;
                setId((v) => ({ ...v, waConsent: on }));
                if (on) setErrors((prev) => ({ ...prev, waConsent: undefined }));
              }}
            />
            <span className="font-medium">We’ll send your report and updates on WhatsApp.</span>
          </label>
          {errors.waConsent && (
            <span id="score-wa-error" className={errorClass}>
              {errors.waConsent}
            </span>
          )}
        </div>
        <ScholarshipField value={id.scholarship} errors={errors} onChange={setScholarship} />
      </div>
      <p className="mt-6 flex flex-wrap items-center justify-between gap-3">
        <button type="submit" className={primaryBtn}>
          Continue →
        </button>
        <span className="mono-text font-mono text-dark/60">
          {pages.length} short pages · {questions.length} questions
        </span>
      </p>
      <p className="mt-6 border-t border-dark/15 pt-5 text-xs leading-tight text-dark/70">
        Your report lands in this inbox as a PDF the moment you finish. We’ll call you on this number within 24 hours to walk through it, so you don’t book anything. Answer honestly, not
        optimistically: the score is only as accurate as you are.
      </p>
    </form>
  );
}

const optionClass = (on: boolean) =>
  `flex w-full items-start gap-3 rounded-lg border px-4 py-3 text-left text-sm leading-tight transition-colors outline-dark ${on ? "border-sky-deep bg-gray-100" : "border-dark/15 hover:border-sky-deep hover:bg-gray-100"}`;

/** One question inside a page: its number, its text and whichever control it takes. */
function QuestionBlock({
  index,
  n,
  of,
  answers,
  catOther,
  missing,
  onAnswer,
  onCatOther,
  onAdvance,
}: {
  index: number;
  n: number;
  of: number;
  answers: Answers;
  catOther: string;
  missing: boolean;
  onAnswer: (i: number, a: Answers[number]) => void;
  onCatOther: (v: string) => void;
  onAdvance: (i: number) => void;
}) {
  const q = questions[index];
  const a = answers[index];
  const id = `score-q-${index}`;
  let control: React.ReactNode;

  if (q.kind === "single") {
    control = (
      <>
        <ul role="radiogroup" aria-labelledby={id} className="space-y-2">
          {q.options.map((o, i) => {
            const on = a === i;
            return (
              <li key={o.label}>
                <button
                  type="button"
                  role="radio"
                  aria-checked={on}
                  onClick={() => {
                    const fresh = a === null;
                    onAnswer(index, i);
                    // A single tap settles the question, so carry the founder on to
                    // the next one. Leave them be when the pick opens a text box, or
                    // when they are only revising an answer they already gave.
                    if (fresh && i !== q.specify) onAdvance(index);
                  }}
                  className={optionClass(on)}
                >
                  <span aria-hidden="true" className={`mt-px size-4 shrink-0 rounded-full border-[1.5px] transition-colors ${on ? "border-sky-deep bg-sky-deep shadow-[inset_0_0_0_3px_#fff]" : "border-dark/50"}`} />
                  {o.label}
                </button>
              </li>
            );
          })}
        </ul>
        {q.specify !== undefined && a === q.specify && (
          <input
            type="text"
            maxLength={80}
            autoFocus
            aria-label="In a few words, what is it?"
            placeholder="In a few words, what is it?"
            className={fieldClass}
            value={catOther}
            onChange={(e) => onCatOther(e.target.value)}
          />
        )}
      </>
    );
  } else if (q.kind === "multi") {
    const sel = Array.isArray(a) ? a : [];
    const toggle = (i: number) => {
      let next: number[];
      if (i === q.excl) next = sel.includes(i) ? [] : [i];
      else {
        next = sel.includes(i) ? sel.filter((x) => x !== i) : [...sel, i];
        next = next.filter((x) => x !== q.excl);
      }
      onAnswer(index, next);
    };
    control = (
      <ul role="group" aria-labelledby={id} className="space-y-2">
        {q.options.map((o, i) => {
          const on = sel.includes(i);
          return (
            <li key={o.label}>
              <button type="button" role="checkbox" aria-checked={on} onClick={() => toggle(i)} className={optionClass(on)}>
                <span aria-hidden="true" className={`mt-px flex size-4 shrink-0 items-center justify-center rounded-[4px] border-[1.5px] transition-colors ${on ? "border-sky-deep bg-sky-deep text-white" : "border-dark/50"}`}>
                  {on && check}
                </span>
                {o.label}
              </button>
            </li>
          );
        })}
      </ul>
    );
  } else if (q.kind === "short") {
    control = <input type="text" aria-labelledby={id} maxLength={q.max} placeholder={q.placeholder} className={fieldClass} value={typeof a === "string" ? a : ""} onChange={(e) => onAnswer(index, e.target.value)} />;
  } else {
    const text = typeof a === "string" ? a : "";
    const len = text.trim().length;
    const counter =
      len < q.min ? { text: `A little more: tell us what it is, who it’s for, and where you are. (${len}/${q.min})`, tone: "text-dark/60" } : len <= q.sweet ? { text: `Perfect. (${len})`, tone: "text-sky-deep" } : { text: `Keep it tight. (${len}/${q.max})`, tone: "text-dark/60" };
    control = (
      <>
        <textarea aria-labelledby={id} rows={5} maxLength={q.max} placeholder={q.placeholder} className={`${fieldClass} resize-y`} value={text} onChange={(e) => onAnswer(index, e.target.value)} />
        <span className={`mono-text mt-2 block font-mono ${counter.tone}`}>{counter.text}</span>
      </>
    );
  }

  return (
    <div id={`${id}-block`} className={`scroll-mt-24 rounded-lg border-l-2 py-1 pl-4 transition-colors ${missing ? "border-[#b3261e]" : "border-transparent"}`}>
      <p className="mono-text font-mono text-dark/60">
        {n} / {of}
        {q.sub && <> &nbsp;·&nbsp; {q.sub}</>}
      </p>
      <p id={id} className="mt-2 text-base leading-tight font-medium lg:text-lg">
        {q.q}
      </p>
      {q.h && <p className="mt-1.5 text-sm leading-tight text-dark/70">{q.h}</p>}
      <div className="mt-4">{control}</div>
      {missing && <p className={errorClass}>This one still needs an answer.</p>}
    </div>
  );
}

/** One page: a section's questions together, a way back and a way on. */
function Page({
  page,
  answers,
  catOther,
  onAnswer,
  onCatOther,
  onBack,
  onNext,
}: {
  page: number;
  answers: Answers;
  catOther: string;
  onAnswer: (i: number, a: Answers[number]) => void;
  onCatOther: (v: string) => void;
  onBack: () => void;
  onNext: () => void;
}) {
  const pg = pages[page];
  const meta = pageMeta(pg.sec);
  const [missing, setMissing] = useState<number[]>([]);
  const footer = useRef<HTMLDivElement>(null);
  /** The pending auto-advance scroll. It has to die with the page: left to run
   *  it would centre the *next* page's footer and drop the founder at its last
   *  question. */
  const slide = useRef<number | undefined>(undefined);
  useEffect(() => () => window.clearTimeout(slide.current), []);
  const pct = Math.round(((page + 1) / pages.length) * 100);
  const last = page === pages.length - 1;
  const still = missing.filter((qi) => !answered(qi, answers, catOther));

  /** Slides the page down to the next question still waiting, or to the
   *  Continue button once this page has nothing left to ask. A blank multi is
   *  still waiting even though the page would accept it, so `touched` — not
   *  `answered` — decides, or we would scroll straight past it. */
  const advance = (qi: number) => {
    const rest = pg.qs.slice(pg.qs.indexOf(qi) + 1).find((x) => !touched(x, answers, catOther));
    const smooth = !reduceMotion();
    window.clearTimeout(slide.current);
    slide.current = window.setTimeout(() => {
      const el = rest === undefined ? footer.current : document.getElementById(`score-q-${rest}-block`);
      el?.scrollIntoView({ behavior: smooth ? "smooth" : "auto", block: rest === undefined ? "center" : "start" });
    }, 180);
  };

  const tryNext = () => {
    const miss = pg.qs.filter((qi) => !answered(qi, answers, catOther));
    setMissing(miss);
    if (miss.length) {
      document.getElementById(`score-q-${miss[0]}-block`)?.scrollIntoView({ behavior: reduceMotion() ? "auto" : "smooth", block: "center" });
      return;
    }
    onNext();
  };

  return (
    <div key={page} className="flex flex-1 flex-col motion-safe:animate-[score-in_0.5s_var(--ease-out-expo)_both]">
      <Eyebrow left={meta.eye} right={`${pct}% complete`} />
      <div aria-hidden="true" className="mt-4 h-1 overflow-hidden rounded-full bg-gray-100">
        <span className="block h-full rounded-full bg-sky-deep transition-[width] duration-500 ease-out-expo" style={{ width: `${pct}%` }} />
      </div>
      <h2 className="mt-6 text-xl leading-tight font-medium lg:text-2xl">{meta.h}</h2>
      {meta.hint && <p className="mt-2 text-sm leading-tight text-dark/70">{meta.hint}</p>}
      <div className="mt-6 space-y-8">
        {pg.qs.map((qi, n) => (
          <QuestionBlock
            key={qi}
            index={qi}
            n={n + 1}
            of={pg.qs.length}
            answers={answers}
            catOther={catOther}
            missing={still.includes(qi)}
            onAnswer={onAnswer}
            onCatOther={onCatOther}
            onAdvance={advance}
          />
        ))}
      </div>
      <div ref={footer} className="mt-8 flex scroll-mt-24 flex-wrap items-center justify-between gap-3 border-t border-dark/15 pt-6">
        <button type="button" onClick={onBack} className={ghostBtn}>
          ← Back
        </button>
        <span className="flex flex-wrap items-center justify-end gap-x-4 gap-y-2">
          {last && (
            <span className="max-w-[30ch] text-right text-xs leading-tight text-dark/70">
              By submitting, you agree to our{" "}
              <Link className="underline hover:text-dark" href="/en/terms-and-conditions" target="_blank">
                Terms
              </Link>{" "}
              and{" "}
              <Link className="underline hover:text-dark" href="/en/privacy-policy" target="_blank">
                Privacy Policy
              </Link>
              .
            </span>
          )}
          <button type="button" onClick={tryNext} className={primaryBtn}>
            {last ? "See my result →" : "Continue →"}
          </button>
        </span>
      </div>
      {still.length > 0 && <p className={`${errorClass} text-right`}>{still.length === 1 ? "One question still needs an answer." : `${still.length} questions still need an answer.`}</p>}
    </div>
  );
}

/** The short beat between the last answer and the number, while the submission goes out. */
function Scoring() {
  const [dots, setDots] = useState("");
  useEffect(() => {
    const t = setInterval(() => setDots((d) => (d.length >= 3 ? "" : d + ".")), 260);
    return () => clearInterval(t);
  }, []);
  return (
    <div className="flex flex-1 items-center justify-center py-24" aria-live="polite">
      <p className="mono-text font-mono text-dark/70">
        Scoring<span className="inline-block w-6 text-left">{dots}</span>
      </p>
    </div>
  );
}

type Delivery = "sending" | "sent" | "failed";
/** The emailed PDF, handed back by the API so the founder can save it here too. */
type ReportFile = { filename: string; base64: string };

function download(file: ReportFile) {
  const bytes = Uint8Array.from(atob(file.base64), (c) => c.charCodeAt(0));
  const url = URL.createObjectURL(new Blob([bytes], { type: "application/pdf" }));
  const a = document.createElement("a");
  a.href = url;
  a.download = file.filename;
  a.click();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}

/** A page break in the report: the eyebrow with a hairline running off it. */
function PageEye({ children, first = false }: { children: React.ReactNode; first?: boolean }) {
  return (
    <p className={`mono-text flex items-center gap-3 font-mono text-dark/60 ${first ? "mt-6" : "mt-14"}`}>
      <span className="shrink-0">{children}</span>
      <span aria-hidden="true" className="h-px flex-1 bg-dark/15" />
    </p>
  );
}

/** A report section: a heading, the line under it that says how to read it, and the thing itself. */
function Sec({ h, d, children }: { h: string; d?: string; children: React.ReactNode }) {
  return (
    <section className="mt-10">
      <h3 className="text-base leading-tight font-medium lg:text-lg">{h}</h3>
      {d && <p className="mt-1.5 max-w-[52ch] text-sm leading-tight text-dark/70">{d}</p>}
      <div className="mt-5">{children}</div>
    </section>
  );
}

const cross = (
  <span aria-hidden="true" className="w-3 shrink-0 text-dark/50">
    ×
  </span>
);
const tick = (
  <span aria-hidden="true" className="w-3 shrink-0 font-mono text-sky-deep">
    ✓
  </span>
);

/** The founder's answers, slid in from the side so the report never has to carry them. */
function AnswersDrawer({ open, onClose, rows }: { open: boolean; onClose: () => void; rows: ReturnType<typeof responses> }) {
  const anchor = useRef<HTMLSpanElement>(null);
  const close = useRef<HTMLButtonElement>(null);
  const [host, setHost] = useState<Element | null>(null);
  // Inside the score dialog, the drawer has to live in the dialog too: the
  // dialog sits in the top layer, and anything portalled to <body> would open
  // underneath its backdrop.
  useEffect(() => setHost(anchor.current?.closest("dialog") ?? document.body), []);
  useEffect(() => {
    if (!open) return;
    close.current?.focus();
    // Capture Escape before the dialog sees it, so it shuts the drawer, not the score.
    const key = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      e.preventDefault();
      e.stopPropagation();
      onClose();
    };
    window.addEventListener("keydown", key, true);
    return () => window.removeEventListener("keydown", key, true);
  }, [open, onClose]);

  const drawer = (
    <>
      <div aria-hidden="true" onClick={onClose} className={`fixed inset-0 z-50 bg-dark/40 transition-opacity duration-300 ${open ? "opacity-100" : "pointer-events-none opacity-0"}`} />
      <aside
        aria-label="Your answers"
        inert={!open}
        className={`fixed inset-y-0 right-0 z-50 flex w-[min(28rem,100vw)] flex-col bg-white shadow-[-30px_0_60px_-30px_rgba(22,37,63,0.45)] transition-transform duration-500 ease-out-expo ${open ? "translate-x-0" : "translate-x-full"}`}
      >
        <div className="flex items-center justify-between gap-4 border-b border-dark/10 px-6 py-4">
          <p className="mono-text font-mono text-dark">Your answers</p>
          <button
            ref={close}
            type="button"
            onClick={onClose}
            className="mono-text flex size-9 items-center justify-center rounded-full bg-gray-200 font-mono text-base text-dark/70 transition-colors hover:text-dark"
          >
            <span aria-hidden="true">✕</span>
            <span className="sr-only">Close</span>
          </button>
        </div>
        <p className="px-6 pt-4 text-sm leading-tight text-dark/70">Exactly what you told us. If anything looks off, we’ll fix it on the call.</p>
        <ul className="flex-1 space-y-4 overflow-y-auto overscroll-contain px-6 pt-4 pb-10">
          {rows.map((r, i) => {
            const head = i === 0 || r.section !== rows[i - 1].section;
            return (
              <li key={i} className="text-sm leading-tight">
                {head && <p className="mono-text mt-4 mb-3 border-t border-dark/10 pt-4 font-mono text-sky-deep first:mt-0">{r.section}</p>}
                <p className="text-dark/70">{r.question}</p>
                <p className="mt-1 font-medium text-dark">{r.answer}</p>
              </li>
            );
          })}
        </ul>
      </aside>
    </>
  );
  return (
    <>
      <span ref={anchor} hidden />
      {host && createPortal(drawer, host)}
    </>
  );
}

const consTone = ["border-dark", "border-sky-deep", "border-sky"];
const consText = ["text-dark", "text-sky-deep", "text-sky"];

function Constraints({ items }: { items: Result["constraints"] }) {
  return (
    <ul className="grid gap-3 @lg:grid-cols-2 @2xl:grid-cols-3">
      {items.map((c, i) => (
        <li key={c.name} className={`rounded-r-lg border-l-2 bg-gray-100 px-5 py-4 ${consTone[i]}`}>
          <p className={`mono-text font-mono ${consText[i]}`}>{c.label} constraint</p>
          <p className="mt-2 font-medium">{c.name}</p>
          <p className="mt-1.5 text-sm leading-tight text-dark/75">{c.why}</p>
          <p className="mono-text mt-4 border-t border-dark/10 pt-4 font-mono text-dark/60">What it’s costing you</p>
          <ul className="mt-2.5 space-y-1.5">
            {c.cost.map((x) => (
              <li key={x} className="flex items-start gap-2 text-sm leading-tight">
                {cross}
                {x}
              </li>
            ))}
          </ul>
        </li>
      ))}
    </ul>
  );
}

/** The six pillars as bars, figure on top. Hollow bars are the constraints. */
function PillarChart({ values, weak, on }: { values: number[]; weak: number[]; on: boolean }) {
  return (
    <div role="img" aria-label={pillars.map((p, i) => `${p.name} ${values[i]}`).join(", ")}>
      <div aria-hidden="true" className="grid h-48 grid-cols-6 items-end gap-1.5 border-b border-dark/20 @md:gap-2.5">
        {values.map((v, i) => {
          const w = weak.includes(i);
          return (
            <div key={i} className="flex h-full flex-col justify-end">
              <span className={`mb-1.5 text-center text-sm font-medium tabular-nums ${w ? "text-dark" : "text-sky-deep"}`}>{v}</span>
              <span
                className={`block w-full rounded-t-md transition-[height] duration-700 ease-out-expo ${w ? "bg-gray-100 ring-[1.5px] ring-sky-deep ring-inset" : "bg-sky-deep"}`}
                style={{ height: on ? `${Math.max(v, 3) * 0.8}%` : "0%" }}
              />
            </div>
          );
        })}
      </div>
      <ul aria-hidden="true" className="mt-2.5 grid grid-cols-6 gap-1.5 @md:gap-2.5">
        {pillars.map((p, i) => (
          <li key={p.key} className={`mono-text text-center font-mono text-[0.5rem] leading-snug tracking-normal @md:text-[0.5625rem] @md:tracking-[0.055rem] ${weak.includes(i) ? "text-dark" : "text-dark/60"}`}>
            <span className="@xl:hidden">{scorePillars[i]}</span>
            <span className="hidden @xl:inline">{p.name}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

/** The benchmark: a track to 100 with the model's three marks on it, and the founder. */
function Stand({ you, bench, on }: { you: number; bench: Result["bench"]; on: boolean }) {
  const marks: [number, string][] = [
    [bench[0], "Median"],
    [bench[1], "Top third"],
    [bench[2], "Scale-ready"],
  ];
  return (
    <div>
      <div className="relative mx-1 mt-10 h-2 rounded-full bg-gray-100">
        <span className="absolute inset-y-0 left-0 rounded-full bg-sky-deep transition-[width] duration-[1150ms] ease-out-expo" style={{ width: on ? `${you}%` : 0 }} />
        {marks.map(([at, label]) => (
          <span key={label} aria-hidden="true" className="absolute top-1/2 -translate-x-1/2" style={{ left: `${at}%` }}>
            <span className="block h-4 w-px -translate-y-1/2 bg-dark/40" />
            <span className="mono-text absolute -top-8 left-1/2 -translate-x-1/2 font-mono text-dark/60">{at}</span>
          </span>
        ))}
        <span
          className="absolute top-1/2 z-10 size-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white bg-sky-deep shadow-[0_0_0_1.5px_var(--color-sky-deep)] transition-[left] duration-[1150ms] ease-out-expo"
          style={{ left: `${on ? you : 0}%` }}
        >
          <span className="absolute top-4 left-1/2 -translate-x-1/2 text-sm font-medium whitespace-nowrap text-sky-deep">You {you}</span>
        </span>
      </div>
      <p className="mono-text mt-12 flex flex-wrap gap-x-4 gap-y-1.5 font-mono text-dark/60">
        <span className="flex items-center gap-1.5">
          <i aria-hidden="true" className="size-2 rounded-full bg-sky-deep" />
          You {you}
        </span>
        {marks.map(([at, label]) => (
          <span key={label} className="flex items-center gap-1.5">
            <i aria-hidden="true" className="h-2.5 w-px bg-dark/40" />
            {label} {at}
          </span>
        ))}
      </p>
    </div>
  );
}

/** What launch-ready means for this model, ticked where it's done. */
function LaunchReady({ check: c, on }: { check: Plan["check"]; on: boolean }) {
  return (
    <div className="rounded-lg border border-dark/15 p-5 @md:p-6">
      <p className="flex items-baseline gap-1.5">
        <span className="text-4xl leading-none font-medium tabular-nums">{c.done}</span>
        <span className="text-lg text-dark/40 tabular-nums">/{c.total}</span>
        <span className="ml-2 text-sm font-medium text-dark/70">launch-ready</span>
      </p>
      <div aria-hidden="true" className="mt-4 h-2 overflow-hidden rounded-full bg-gray-100">
        <span className="block h-full rounded-full bg-sky-deep transition-[width] duration-1000 ease-out-expo" style={{ width: on ? `${Math.round((c.done / c.total) * 100)}%` : 0 }} />
      </div>
      <p className="mt-4 text-sm leading-tight text-sky-deep">{planCopy.lrDone(c.done)}</p>
      <ul className="mt-3 grid gap-x-6 @lg:grid-cols-2">
        {c.items.map((it) => (
          <li key={it.label} className={`flex items-start gap-2.5 border-b border-dark/10 py-2.5 text-sm leading-tight ${it.done ? "text-dark/60" : "text-dark"}`}>
            {it.done ? tick : <span aria-hidden="true" className="w-3 shrink-0 text-dark">→</span>}
            <span className="sr-only">{it.done ? "Done:" : "Still to do:"}</span>
            {it.label}
          </li>
        ))}
      </ul>
      <p className="mt-4 text-xs leading-tight text-dark/70">{c.footer}</p>
    </div>
  );
}

/** Launch to investor-ready, with the rung the work starts on and where the founder has built to. */
function Ladder({ start, built }: Plan["ladder"]) {
  const pos = built > start ? (start + built) / 2 : start;
  return (
    <div>
      <ol className="grid grid-cols-4 rounded-lg border border-dark/15">
        {LADDER.map((s, i) => {
          const st = i < start ? "past" : i === start ? "now" : built > start && i <= built ? "built" : "fut";
          const tag = i === start ? "Start here" : i === built && built > start ? "Built to here" : "";
          const tone = { now: "bg-sky-deep text-white", built: "bg-gray-100", past: "bg-gray-100 text-dark/60", fut: "text-dark/40" }[st];
          return (
            <li key={s.name} aria-current={i === start ? "step" : undefined} className={`relative min-w-0 px-2 pt-6 pb-3.5 first:rounded-l-lg last:rounded-r-lg @md:px-4 ${i ? "border-l border-dark/15" : ""} ${tone}`}>
              {tag && <span className="mono-text absolute -top-2.5 left-2 rounded-full border border-sky-deep bg-white px-2 py-0.5 font-mono text-[0.5625rem] whitespace-nowrap text-sky-deep">{tag}</span>}
              <span className="block text-[0.6875rem] leading-tight font-medium @md:text-sm">{s.name}</span>
              <span className="mono-text mt-1 block font-mono text-[0.5625rem] opacity-80">{s.sub}</span>
            </li>
          );
        })}
      </ol>
      <div aria-hidden="true" className="relative h-12">
        <span className="absolute top-2.5 flex -translate-x-1/2 flex-col items-center gap-1.5" style={{ left: `${((pos + 0.5) / 4) * 100}%` }}>
          <span className="size-2.5 rounded-full border-2 border-white bg-sky-deep shadow-[0_0_0_1.5px_var(--color-sky-deep)]" />
          <span className="mono-text font-mono whitespace-nowrap text-dark">You’re here</span>
        </span>
      </div>
    </div>
  );
}

function Months({ months }: { months: Month[] }) {
  return (
    <>
      <ol className="space-y-3">
        {months.map((m) => (
          <li key={m.m} className="rounded-lg border border-dark/15 px-5 py-4">
            <p className="flex flex-wrap items-baseline justify-between gap-2 border-b border-dark/10 pb-3">
              <span className="font-medium">{m.m}</span>
              <span className="mono-text font-mono text-dark/60">
                {m.from} → <b className="font-medium text-sky-deep">~{m.to}</b> score
              </span>
            </p>
            <div className="mt-3.5 grid gap-5 @lg:grid-cols-2">
              <div>
                <p className="mono-text font-mono text-dark/60">What gets done</p>
                <ul className="mt-2.5 space-y-1.5">
                  {m.topics.map((t) => (
                    <li key={t} className="flex items-start gap-2 text-sm leading-tight">
                      <span aria-hidden="true" className="w-3 shrink-0 text-dark/50">
                        →
                      </span>
                      {t}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="mono-text font-mono text-sky-deep">What Knnekt does alongside</p>
                <ul className="mt-2.5 space-y-1.5">
                  {m.kn.map((t) => (
                    <li key={t} className="flex items-start gap-2 text-sm leading-tight">
                      <span aria-hidden="true" className="mt-[0.45em] mr-1 size-1.5 shrink-0 rounded-full bg-sky-deep" />
                      {t}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </li>
        ))}
      </ol>
      <p className="mt-3 text-xs leading-tight text-dark/60 italic">{planCopy.months.note}</p>
    </>
  );
}

/** The fee, as the pricing section on the site states it: the promises, the schedule, and what it covers. */
function Fee() {
  const taken = pricing.seats - pricing.seatsLeft;
  return (
    <div className="grid items-start gap-6 @3xl:grid-cols-[1.06fr_0.94fr]">
      <div>
        <ul className="flex flex-wrap gap-1.5">
          {["Application-only", `${pricing.seats} seats per cohort`].map((chip) => (
            <li key={chip} className="mono-text rounded-full bg-gray-200 px-3.5 py-2 font-mono text-dark/70">
              {chip}
            </li>
          ))}
        </ul>
        <ul className="mt-6 grid border-t border-dark/10 @xl:grid-cols-2">
          {pricingFacts.map(([title, body], i) => (
            <li key={title} className={`border-b border-dark/10 py-5 ${i % 2 === 0 ? "@xl:border-r @xl:pr-5" : "@xl:pl-5"}`}>
              <p className="font-medium">{title}</p>
              <p className="mt-1.5 text-xs leading-tight text-dark/70">{body}</p>
            </li>
          ))}
        </ul>
        <p id="score-pay-schedule" className="mono-text mt-8 font-mono text-dark/80">
          How you pay it
        </p>
        <ol aria-labelledby="score-pay-schedule" className="mt-4 border-t border-dark">
          {paymentSteps.map((step, i) => (
            <li key={step.title} className="grid grid-cols-[auto_minmax(0,1fr)] items-start gap-x-4 gap-y-2 border-b border-dark/10 py-5 @xl:grid-cols-[auto_minmax(0,1fr)_auto]">
              <span className="mono-text mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-full border border-dark font-mono tabular-nums">{i + 1}</span>
              <div>
                <p className="font-medium">{step.title}</p>
                <p className="mt-1.5 text-xs leading-tight text-dark/70">{step.body}</p>
              </div>
              <p className="col-start-2 @xl:col-start-3 @xl:text-right">
                <span className="block text-lg leading-none font-medium">{step.amount}</span>
                <span className="mono-text mt-1.5 block font-mono text-dark/50">{step.when}</span>
              </p>
            </li>
          ))}
        </ol>
        <p className="mt-4 text-xs leading-tight text-dark/70">
          Total <span className="font-medium text-dark">{pricing.total}</span>. Every rupee is scheduled before you start: no milestone invoices, no change
          orders, no surprise line at Day 70.
        </p>
      </div>

      <div className="rounded-lg bg-panel p-5 @md:p-7">
        <p className="text-xl leading-tight font-medium">What the fee covers</p>
        <p className="mono-text mt-2 font-mono text-dark/70">{pricing.cohort}</p>
        <ul className="mt-6 space-y-3 text-sm leading-tight">
          {feeIncludes.map(([thing, rest]) => (
            <li key={thing} className="flex gap-3">
              <span aria-hidden="true" className="mt-0.5 flex size-[0.9375rem] shrink-0 items-center justify-center rounded-[4px] bg-sky-deep text-white">
                {check}
              </span>
              <span className="text-dark/80">
                <span className="font-medium text-dark">{thing}</span>
                {rest}
              </span>
            </li>
          ))}
        </ul>
        <div className="mt-7 border-t border-dark/15 pt-5">
          <p className="mono-text font-mono text-dark/70">Program fee</p>
          <p className="mt-2 flex flex-wrap items-baseline gap-3">
            <span className="text-3xl leading-none font-medium">{pricing.fee}</span>
            <span className="mono-text font-mono text-dark/70">{pricing.gst}</span>
          </p>
        </div>
        <div className="mt-6 border-t border-dark/15 pt-5">
          <div aria-hidden="true" className="grid grid-cols-15 gap-1">
            {Array.from({ length: pricing.seats }, (_, i) => (
              <span key={i} className={`h-5 rounded-sm ${i < taken ? "bg-dark" : "bg-dark/15"}`} />
            ))}
          </div>
          <p className="mt-3 flex flex-wrap items-baseline gap-2">
            <span className="text-xl leading-none font-medium tabular-nums">{pricing.seatsLeft}</span>
            <span className="mono-text font-mono text-dark/70">
              of {pricing.seats} seats left · {pricing.cohort}
            </span>
          </p>
        </div>
        <p className="mt-6 text-xs leading-tight text-dark/70">{pricing.fine}</p>
      </div>
    </div>
  );
}

/** Everything the fee buys, from the ledger on the pricing section. */
function Included() {
  return (
    <div className="rounded-lg border border-dark/20 bg-gray-100 p-5 @md:p-7">
      <p className="flex flex-wrap items-baseline gap-3 text-xl font-medium">
        Included <span className="mono-text font-mono text-dark/50">in the 100</span>
      </p>
      <p className="mt-2 text-xs leading-tight text-dark/70">Everything the roadmap needs to hit the goal.</p>
      <ul className="mt-5 @xl:columns-2 @xl:gap-x-7">
        {ledgerIn.map((item) => (
          <li key={item} className="flex break-inside-avoid gap-2.5 border-t border-dark/10 py-3 text-sm leading-tight">
            <span aria-hidden="true" className="mt-[0.4rem] size-1.5 shrink-0 rounded-full bg-dark" />
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

function Report({ result, identity, answers, delivery, file }: { result: Result; identity: Identity; answers: Answers; delivery: Delivery; file: ReportFile | null }) {
  const n = useCountUp(result.overall, 1000);
  const v = verdicts[result.route];
  const arch = archetypes[result.arch];
  const [plan] = useState(() => planFor(result));
  const [on, setOn] = useState(false);
  const [drawer, setDrawer] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setOn(true), reduceMotion() ? 0 : 60);
    return () => clearTimeout(t);
  }, []);
  const weak = result.constraints.map((c) => pillars.findIndex((p) => p.name === c.name));
  const founderLabel = result.founders === null ? null : ["Solo founder", "2 founders", "3+ founders"][result.founders];
  const tone = result.confidence.tone;

  return (
    <div data-report className="@container motion-safe:animate-[score-in_0.5s_var(--ease-out-expo)_both]">
      <div className="-mx-1 px-1 pt-1">
        <div className="flex items-center justify-between gap-3 border-b border-dark/15 pb-3">
          <span className="mono-text font-mono whitespace-nowrap text-dark/60">Your report</span>
          <button
            type="button"
            aria-expanded={drawer}
            onClick={() => setDrawer(true)}
            className={outlineBtn}
          >
            Your answers
          </button>
        </div>
      </div>
      <AnswersDrawer open={drawer} onClose={() => setDrawer(false)} rows={responses(answers, result.catOther, identity)} />

      <PageEye first>Page 01 — Diagnosis · a 60-second read</PageEye>
      <p className="mono-text mt-6 font-mono break-all text-sky-deep">{result.venName}</p>
      <div className="mt-4 grid items-end gap-x-8 gap-y-4 @lg:grid-cols-[auto_1fr]">
        <p className="flex items-baseline gap-2">
          <span className="text-[5rem] leading-[0.85] font-medium tracking-tight tabular-nums @lg:text-[6.5rem]">{n}</span>
          <span className="mono-text font-mono text-dark/50">/ 100</span>
        </p>
        <div className="pb-1">
          <p className="mono-text font-mono text-dark/60">{plan.stage}</p>
          <p className="mt-1.5 text-2xl leading-tight font-medium">{arch.name}</p>
          <p className="mt-2 text-sm leading-tight text-dark/75">{arch.sub}</p>
        </div>
      </div>

      <dl className="mt-8 grid overflow-hidden rounded-lg border border-dark/15 @md:grid-cols-[1.4fr_1fr_1fr]">
        {[
          ["Venture", result.venName],
          ["Team", founderLabel],
          ["Stage", plan.stage],
        ]
          .filter((f): f is [string, string] => !!f[1])
          .map(([k, val], i) => (
            <div key={k} className={`px-4 py-3.5 ${i ? "border-t border-dark/15 @md:border-t-0 @md:border-l" : ""}`}>
              <dt className="mono-text font-mono text-dark/60">{k}</dt>
              <dd className="mt-1.5 text-sm font-medium break-words">{val}</dd>
            </div>
          ))}
      </dl>

      <div className="mt-4 flex items-start gap-3 rounded-lg bg-gray-100 px-4 py-4 @md:px-5">
        <span aria-hidden="true" className={`mt-1.5 size-2 shrink-0 rounded-full ${tone === "high" ? "bg-sky-deep" : tone === "med" ? "bg-sky" : "bg-dark/40"}`} />
        <p className="flex-1 text-sm leading-tight">
          <span className="font-medium">{result.confidence.label}</span>
          <span className="mt-1 block text-dark/80">{result.confidence.body}</span>
        </p>
        <span className="text-xl font-medium text-sky-deep tabular-nums">{result.confidence.pct}%</span>
      </div>

      {result.gates.map((g) => (
          <div key={g} className="mt-3 rounded-lg border border-sky-deep/40 bg-gray-100 px-4 py-3">
            <p className="mono-text font-mono text-sky-deep">{gateCopy[g][0]} · this outweighs your score</p>
            <p className="mt-1.5 text-sm leading-tight text-dark/80">{gateCopy[g][1]}</p>
          </div>
        ))}

      <div className="mt-3 rounded-lg bg-panel px-5 py-4">
        <p className="mono-text font-mono text-sky-deep">
          {v.band} · {v.bandSub}
        </p>
        <p className="mt-2 text-lg leading-tight font-medium">{v.title}</p>
        <p className="mt-2 text-sm leading-tight text-dark/80">{v.body}</p>
      </div>

      <Sec h={planCopy.constraints.h} d={planCopy.constraints.d}>
        <Constraints items={result.constraints} />
      </Sec>
      <Sec h={planCopy.pillars.h} d={planCopy.pillars.d}>
        <PillarChart values={result.pct} weak={weak} on={on} />
      </Sec>
      <Sec h={planCopy.stand.h} d={planCopy.stand.d(result.benchName)}>
        <Stand you={result.overall} bench={result.bench} on={on} />
      </Sec>
      <Sec h={planCopy.left.h} d={planCopy.left.d}>
        <LaunchReady check={plan.check} on={on} />
      </Sec>

      <PageEye>Page 02 — Your path forward</PageEye>
      <Sec h={planCopy.ladder.h} d={planCopy.ladder.d}>
        <Ladder {...plan.ladder} />
      </Sec>
      <Sec h={planCopy.months.h} d={planCopy.months.d}>
        <Months months={plan.months} />
      </Sec>
      <Sec h={planCopy.fee.h} d={planCopy.fee.d}>
        <Fee />
      </Sec>
      <div className="mt-4">
        <Included />
      </div>

      <div className="mt-10 border-t border-dark/15 pt-6">
        {file && (
          <p>
            <button type="button" onClick={() => download(file)} className={primaryBtn}>
              Download my report →
            </button>
          </p>
        )}
        <p className="mt-4 text-xs leading-tight text-dark/75 first:mt-0" aria-live="polite">
          {delivery === "sending" && "Sending your full report to " + identity.email + ", it comes from hello@knnekt.studio…"}
          {delivery === "sent" &&
            "Your full report is on its way to " +
              identity.email +
              ", it comes from hello@knnekt.studio, so check your spam folder if it isn’t in your inbox in a few minutes. We’ll get on a call with you on " +
              identity.phone +
              " soon, within 24 hours."}
          {delivery === "failed" &&
            "We couldn’t email your report just now, but we still have your details, and we’ll send it from hello@knnekt.studio and call " + identity.phone + " shortly."}
        </p>
      </div>

      {/* The report's last word: the founder community, for everyone. */}
      {WHATSAPP_URL && (
        <div className="mt-8 flex flex-col gap-4 rounded-lg border border-dark/15 bg-white px-5 py-5 @md:flex-row @md:items-center @md:justify-between">
          <div className="flex items-start gap-3">
            <IconBrandWhatsapp aria-hidden="true" className="mt-0.5 size-6 shrink-0 text-[#1fa855]" stroke={1.75} />
            <p className="text-sm leading-tight">
              <span className="font-medium">Join the Knnekt founder community</span>
              <span className="mt-1 block text-dark/70">Insights, what other founders are working through, and what’s changing in the market. Nothing to buy.</span>
            </p>
          </div>
          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener"
            className="mono-text shrink-0 rounded-full bg-[#1fa855] px-6 py-3 text-center font-mono whitespace-nowrap text-white transition-colors outline-offset-2 outline-dark hover:bg-[#178a45]"
          >
            Join on WhatsApp →
          </a>
        </div>
      )}
    </div>
  );
}

/** Where the score falls, as analytics reports it. */
const scoreBand = (n: number) => (n < 40 ? "0–39" : n < 60 ? "40–59" : n < 80 ? "60–79" : "80–100");

type Stage = { at: "identity" } | { at: "page"; page: number } | { at: "scoring" } | { at: "report"; result: Result };

const newSession = () =>
  typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID() : `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`;

/**
 * Keeps the Sheet's "Half filled" tab current for a founder who hasn't finished:
 * whatever they've entered so far is sent each time they reach a new page and
 * once more as they leave — tab closed or hidden, dialog shut. Leaving goes as
 * a beacon, which the browser delivers even as the page goes away. Nothing is
 * sent before they've typed or picked anything, nor after they finish (the
 * finished score clears their half-filled row instead).
 */
function usePartialSave(snapshot: () => { identity: Identity; answers: Answers; catOther: string; page: number; done: boolean }) {
  const session = useRef("");
  const last = useRef("");
  const read = useRef(snapshot);
  // Declared before the caller's own effects, so it has the latest state by the time they save.
  useEffect(() => {
    read.current = snapshot;
  });

  const save = useCallback((leaving: boolean) => {
    const s = read.current();
    if (s.done) return;
    const typed = s.identity.name.trim() || s.identity.email.trim() || s.identity.phone.trim();
    const picked = s.answers.some((a) => (Array.isArray(a) ? a.length > 0 : typeof a === "string" ? a.trim() !== "" : a !== null));
    if (!typed && !picked) return;
    session.current ||= newSession();
    const body = JSON.stringify({ session: session.current, identity: s.identity, answers: s.answers, catOther: s.catOther, page: s.page });
    if (body === last.current) return;
    last.current = body;
    if (leaving && typeof navigator !== "undefined" && navigator.sendBeacon?.("/api/score/partial", new Blob([body], { type: "application/json" }))) return;
    fetch("/api/score/partial", { method: "POST", headers: { "Content-Type": "application/json" }, body, keepalive: true }).catch(() => {});
  }, []);

  useEffect(() => {
    const leave = () => save(true);
    const hidden = () => document.visibilityState === "hidden" && leave();
    window.addEventListener("pagehide", leave);
    document.addEventListener("visibilitychange", hidden);
    return () => {
      window.removeEventListener("pagehide", leave);
      document.removeEventListener("visibilitychange", hidden);
      leave(); // the score dialog closing, or a client-side navigation away
    };
  }, [save]);

  return { save, session: () => (session.current ||= newSession()) };
}

/**
 * The Startup Operating Score. Page one takes the founder's details; then one
 * page per section — company context, each of the six pillars, about fit —
 * and the report once the last page is answered. Finishing submits the
 * answers, which emails the PDF and queues the call. `bare` drops the sky band and the
 * card's shadow for when it already sits inside a dialog.
 */
export default function ScoreQuiz({ bare = false }: { bare?: boolean }) {
  const [identity, setIdentity] = useState<Identity>({ name: "", email: "", phone: "", waConsent: false, scholarship: blankScholarship() });
  const [answers, setAnswers] = useState<Answers>(() => questions.map((q) => (q.kind === "multi" ? [] : null)));
  const [catOther, setCatOther] = useState("");
  const [stage, setStage] = useState<Stage>({ at: "identity" });
  const [delivery, setDelivery] = useState<Delivery>("sending");
  const [file, setFile] = useState<ReportFile | null>(null);
  const top = useRef<HTMLDivElement>(null);
  const funnel = useFormTracking("score", top, "Your details");
  const draft = useRef(identity);
  const done = useRef(false);
  const onDraft = useCallback((id: Identity) => {
    draft.current = id;
  }, []);
  const partial = usePartialSave(() => ({
    identity: stage.at === "identity" ? draft.current : identity,
    answers,
    catOther,
    page: stage.at === "page" ? stage.page : -1,
    done: done.current,
  }));

  // Step 1 is the founder's details; each section page after it is one more.
  const go = (s: Stage) => {
    setStage(s);
    if (s.at === "identity") funnel.step(1, "Your details");
    else if (s.at === "page") funnel.step(s.page + 2, SECTIONS[pages[s.page].sec]);
  };

  /** Back to the top of the card each time the stage changes. It runs after the
   *  new page has rendered: scrolling from the click handler started while the
   *  old page was still in the DOM, and swapping it out could cut the scroll
   *  short, leaving the founder at the bottom of the next section. */
  const stageKey = stage.at === "page" ? `page-${stage.page}` : stage.at;
  const mounted = useRef(false);
  useEffect(() => {
    if (!mounted.current) {
      mounted.current = true;
      return;
    }
    top.current?.scrollIntoView({ behavior: reduceMotion() ? "auto" : "smooth", block: "start" });
  }, [stageKey]);

  // Each new page reached is progress worth keeping, in case this is where they stop.
  useEffect(() => {
    if (stageKey.startsWith("page-")) partial.save(false);
  }, [stageKey, partial]);

  const finish = () => {
    done.current = true;
    funnel.submit();
    track("generate_lead", {}, { event: "Lead", params: { content_name: "Startup Operating Score" } });
    go({ at: "scoring" });
    const result = grade(answers, catOther);
    setDelivery("sending");
    setFile(null);
    const pause = new Promise((r) => setTimeout(r, reduceMotion() ? 300 : 2000));
    const send = fetch("/api/score", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ identity, answers, catOther, session: partial.session() }),
    })
      .then(async (res) => {
        const body = (await res.json().catch(() => null)) as { emailed?: boolean; pdf?: ReportFile } | null;
        setDelivery(res.ok && body?.emailed ? "sent" : "failed");
        if (res.ok && body?.pdf) setFile(body.pdf);
      })
      .catch(() => setDelivery("failed"));
    pause.then(() => {
      go({ at: "report", result });
      track("score_form_complete", { route: verdicts[result.route].band, archetype: archetypes[result.arch].name, score_band: scoreBand(result.overall) });
    });
    void send;
  };

  const card =
    stage.at === "identity" ? (
      <IdentityForm
        initial={identity}
        onDraft={onDraft}
        onNext={(id) => {
          setIdentity(id);
          identify({ email: id.email, phone: id.phone, name: id.name });
          go({ at: "page", page: 0 });
        }}
      />
    ) : stage.at === "page" ? (
      <Page
        key={stage.page}
        page={stage.page}
        answers={answers}
        catOther={catOther}
        onAnswer={(i, a) =>
          setAnswers((prev) => {
            const next = [...prev];
            next[i] = a;
            return next;
          })
        }
        onCatOther={setCatOther}
        onBack={() => go(stage.page === 0 ? { at: "identity" } : { at: "page", page: stage.page - 1 })}
        onNext={() => (stage.page < pages.length - 1 ? go({ at: "page", page: stage.page + 1 }) : finish())}
      />
    ) : stage.at === "scoring" ? (
      <Scoring />
    ) : (
      <Report result={stage.result} identity={identity} answers={answers} delivery={delivery} file={file} />
    );

  // Typing into the details form is the start; nobody reaches a question page without it.
  const inner = (
    <div className="flex min-h-[30rem] flex-col" onChange={funnel.start}>
      {card}
    </div>
  );

  if (bare) {
    return (
      <div ref={top} className="scroll-mt-8 [overflow-anchor:none] rounded-xl border border-dark/10 bg-white p-5 md:p-7">
        {inner}
      </div>
    );
  }

  return (
    <div ref={top} className="bg-panel relative isolate scroll-mt-8 [overflow-anchor:none] overflow-clip rounded-xl">
      <GradientBackground />
      <div className="relative z-10 px-4 py-8 sm:p-8 lg:p-12">
        <div className="mx-auto w-full max-w-[60rem] rounded-xl bg-white p-6 shadow-[0_40px_90px_-50px_rgba(22,37,63,0.45)] md:p-9">{inner}</div>
      </div>
    </div>
  );
}
