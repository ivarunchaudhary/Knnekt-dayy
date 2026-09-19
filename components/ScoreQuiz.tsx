"use client";

import { useEffect, useRef, useState } from "react";
import { scorePillars } from "@/lib/data";
import {
  CONFIG,
  answered,
  archetypes,
  gateCopy,
  grade,
  next as whatsNext,
  pageMeta,
  pages,
  pillars,
  questions,
  responses,
  touched,
  verdicts,
  type Answers,
  type Identity,
  type Result,
} from "@/lib/score";
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

/** The six pillars as bars. `weak` marks the ones the constraints come from. */
function Pillars({ values, weak = [] }: { values: number[]; weak?: number[] }) {
  return (
    <>
      <div aria-hidden="true" className="grid h-40 grid-cols-6 items-end gap-2.5">
        {values.map((h, i) => (
          <span key={i} className="flex h-full items-end">
            <span
              className={`block w-full rounded-t-md transition-[height] duration-700 ease-out-expo ${weak.includes(i) ? "bg-gray-100 ring-[1.5px] ring-inset ring-sky-deep" : "bg-sky-deep"}`}
              style={{ height: `${Math.max(h, 2)}%` }}
            />
          </span>
        ))}
      </div>
      <ul className="mt-2.5 grid grid-cols-6 gap-2.5">
        {scorePillars.map((p, i) => (
          <li key={p} className={`mono-text text-center font-mono text-[0.5625rem] ${weak.includes(i) ? "text-sky-deep" : "text-dark/60"}`}>
            <span className="block font-sans text-sm font-medium normal-case tracking-normal text-dark tabular-nums">{values[i]}</span>
            {p}
          </li>
        ))}
      </ul>
    </>
  );
}

type Errors = Partial<Record<"name" | "email" | "phone", string>>;
const looksLikeEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim());
const looksLikePhone = (v: string) => v.replace(/\D/g, "").length >= 8;

/** Page one: who we're scoring, where the report goes, and the community box. */
function IdentityForm({ initial, onNext }: { initial: Identity; onNext: (id: Identity) => void }) {
  const [id, setId] = useState<Identity>(initial);
  const [errors, setErrors] = useState<Errors>({});
  const set = (key: "name" | "email" | "phone") => (e: React.ChangeEvent<HTMLInputElement>) => {
    setId((v) => ({ ...v, [key]: e.target.value }));
    setErrors((prev) => (prev[key] ? { ...prev, [key]: undefined } : prev));
  };
  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const found: Errors = {};
    if (id.name.trim().length < 2) found.name = "Tell us who you are.";
    if (!looksLikeEmail(id.email)) found.email = "That address doesn’t look right — it’s where the report goes.";
    if (!looksLikePhone(id.phone)) found.phone = "We need a number we can actually call.";
    setErrors(found);
    if (Object.keys(found).length) {
      document.querySelector<HTMLElement>("[aria-invalid='true']")?.focus();
      return;
    }
    onNext({ ...id, name: id.name.trim(), email: id.email.trim().toLowerCase(), phone: id.phone.trim() });
  };
  return (
    <form noValidate onSubmit={submit} className="flex flex-1 flex-col motion-safe:animate-[score-in_0.5s_var(--ease-out-expo)_both]">
      <Eyebrow left="Before we start" right="1 min" />
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
        <p>
          <label className={labelClass} htmlFor="score-phone">
            Contact number
          </label>
          <input id="score-phone" type="tel" inputMode="tel" autoComplete="tel" className={fieldClass} placeholder="+91 98765 43210" value={id.phone} onChange={set("phone")} aria-invalid={!!errors.phone} aria-describedby={errors.phone ? "score-phone-error" : undefined} />
          {errors.phone && (
            <span id="score-phone-error" className={errorClass}>
              {errors.phone}
            </span>
          )}
        </p>
        <label className="flex cursor-pointer items-start gap-3 rounded-lg border border-dark/15 px-4 py-3 text-sm leading-tight transition-colors has-[:checked]:border-sky-deep has-[:checked]:bg-gray-100 hover:border-sky-deep">
          <input type="checkbox" className="mt-0.5 size-4 shrink-0 accent-sky-deep" checked={id.optin} onChange={(e) => setId((v) => ({ ...v, optin: e.target.checked }))} />
          <span>
            <span className="font-medium">Add me to the Knnekt founder WhatsApp community.</span>{" "}
            <span className="text-dark/70">Insights, what other founders are working through, and what’s changing in the market. Nothing to buy.</span>
          </span>
        </label>
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
        Your report lands in this inbox as a PDF the moment you finish. We’ll call you on this number to walk through it — you don’t book anything. Answer honestly, not optimistically: the score
        is only as accurate as you are.
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
      len < q.min ? { text: `A little more — tell us what it is, who it’s for, and where you are. (${len}/${q.min})`, tone: "text-dark/60" } : len <= q.sweet ? { text: `Perfect. (${len})`, tone: "text-sky-deep" } : { text: `Keep it tight. (${len}/${q.max})`, tone: "text-dark/60" };
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
        <button type="button" onClick={tryNext} className={primaryBtn}>
          {last ? "See my result →" : "Continue →"}
        </button>
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

/** The countdown to the WhatsApp community, for founders who ticked the box. */
function WhatsAppBar({ url }: { url: string }) {
  const [n, setN] = useState(CONFIG.WA_REDIRECT_SECS);
  const [stay, setStay] = useState(false);
  useEffect(() => {
    if (stay) return;
    if (n <= 0) {
      window.location.href = url;
      return;
    }
    const t = setTimeout(() => setN(n - 1), 1000);
    return () => clearTimeout(t);
  }, [n, stay, url]);
  if (stay) return null;
  return (
    <div role="status" className="sticky top-0 z-20 -mx-1 mb-6 flex flex-wrap items-center justify-between gap-3 rounded-lg bg-dark px-4 py-3 text-white shadow-[0_20px_40px_-24px_rgba(22,37,63,0.6)]">
      <p className="text-sm leading-tight">
        You’re in. Taking you to the founder WhatsApp community in <b className="tabular-nums">{n}</b>s…
        <span className="block text-xs text-white/70">Your report is in your inbox and you can come back to this page any time.</span>
      </p>
      <span className="flex items-center gap-3">
        <a href={url} className="mono-text rounded-full bg-white px-4 py-2 font-mono text-dark transition-colors hover:bg-sky-soft">
          Join now →
        </a>
        <button type="button" onClick={() => setStay(true)} className="mono-text font-mono text-white/80 transition-colors hover:text-white">
          Stay on my report
        </button>
      </span>
    </div>
  );
}

type Delivery = "sending" | "sent" | "failed";

function Report({ result, identity, answers, delivery }: { result: Result; identity: Identity; answers: Answers; delivery: Delivery }) {
  const n = useCountUp(result.overall, 1000);
  const v = verdicts[result.route];
  const arch = archetypes[result.arch];
  const [on, setOn] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setOn(true), reduceMotion() ? 0 : 60);
    return () => clearTimeout(t);
  }, []);
  const weak = result.constraints.map((c) => pillars.findIndex((p) => p.name === c.name));
  const marks: [number, string][] = [
    [result.bench[0], "Median"],
    [result.bench[1], "Top third"],
    [result.bench[2], "Scale-ready"],
  ];
  const founderLabel = result.founders === null ? null : ["Solo founder", "2 founders", "3+ founders"][result.founders];

  return (
    <div className="motion-safe:animate-[score-in_0.5s_var(--ease-out-expo)_both]">
      {identity.optin && WHATSAPP_URL && <WhatsAppBar url={WHATSAPP_URL} />}
      <Eyebrow left="Your report" right={result.venName} />
      <div className="mt-5 flex flex-wrap items-baseline gap-x-2.5 gap-y-2">
        <span className="text-4xl leading-[0.9] font-medium tabular-nums md:text-[4.75rem]">{n}</span>
        <span className="mono-text font-mono text-dark/60">/100</span>
        <span className="mono-text ml-auto text-right font-mono text-dark/60">
          Archetype
          <span className="mt-1 block font-sans text-sm font-medium normal-case tracking-normal text-dark">{arch.name}</span>
        </span>
      </div>
      <p className="mt-4 text-sm leading-tight text-dark/80">{arch.sub}</p>

      <dl className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3">
        {[
          ["Venture", result.venName],
          ["Team", founderLabel],
          ["Benchmark", result.benchName],
        ]
          .filter((f): f is [string, string] => !!f[1])
          .map(([k, val]) => (
            <div key={k} className="rounded-lg bg-gray-100 px-4 py-3">
              <dt className="mono-text font-mono text-dark/60">{k}</dt>
              <dd className="mt-1 text-sm font-medium">{val}</dd>
            </div>
          ))}
      </dl>

      <div className="mt-5 flex items-start gap-3 rounded-lg border border-dark/10 px-4 py-3">
        <span aria-hidden="true" className={`mt-1.5 size-2 shrink-0 rounded-full ${result.confidence.tone === "high" ? "bg-sky-deep" : result.confidence.tone === "med" ? "bg-sky" : "bg-dark/40"}`} />
        <p className="text-sm leading-tight">
          <span className="font-medium">{result.confidence.label}</span>
          <span className="mono-text ml-2 font-mono text-dark/60">{result.confidence.pct}%</span>
          <span className="mt-1 block text-dark/80">{result.confidence.body}</span>
        </p>
      </div>

      {result.gates
        .filter((g): g is Exclude<typeof g, "RESOURCING"> => g !== "RESOURCING")
        .map((g) => (
          <div key={g} className="mt-3 rounded-lg border border-sky-deep/40 bg-gray-100 px-4 py-3">
            <p className="mono-text font-mono text-sky-deep">{gateCopy[g][0]} · this outweighs your score</p>
            <p className="mt-1.5 text-sm leading-tight text-dark/80">{gateCopy[g][1]}</p>
          </div>
        ))}

      <div className="mt-8 rounded-lg bg-panel px-5 py-4">
        <p className="mono-text font-mono text-sky-deep">
          {v.band} · {v.bandSub}
        </p>
        <p className="mt-2 text-lg leading-tight font-medium">{v.title}</p>
        <p className="mt-2 text-sm leading-tight text-dark/80">{v.body}</p>
      </div>

      <div className="mt-8">
        <Eyebrow left="Your top constraints" right="What each costs you" />
        <ul className="mt-4 space-y-2.5">
          {result.constraints.map((c) => (
            <li key={c.name} className="rounded-r-lg border-l-2 border-sky-deep bg-gray-100 px-4 py-3">
              <p className="mono-text font-mono text-dark/60">{c.label}</p>
              <p className="mt-1 text-sm font-medium">{c.name}</p>
              <p className="text-dark-subtle mt-0.5 text-xs leading-tight">{c.why}</p>
              <ul className="mt-2 space-y-1">
                {c.cost.map((x) => (
                  <li key={x} className="flex items-center gap-2.5 text-xs leading-tight">
                    <span aria-hidden="true" className="flex size-[0.9375rem] shrink-0 items-center justify-center rounded-[4px] bg-sky-deep text-white">
                      {check}
                    </span>
                    {x}
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-8">
        <Eyebrow left="Your six pillars" right="0–100" />
        <div className="mt-4">
          <Pillars values={result.pct} weak={weak} />
        </div>
      </div>

      <div className="mt-8">
        <Eyebrow left="Where you stand" right={`${result.benchName} founders`} />
        <p className="mono-text mt-8 flex justify-between font-mono text-dark/60">
          <span>0</span>
          <span>100</span>
        </p>
        <div className="relative mt-9 mb-14 h-3 rounded-full border border-dark/15 bg-gray-100">
          <span
            aria-hidden="true"
            className="absolute inset-y-0 left-0 rounded-full bg-[linear-gradient(90deg,var(--color-sky-deep),var(--color-sky))] transition-[width] duration-[1150ms] ease-out-expo"
            style={{ width: on ? `${result.overall}%` : 0 }}
          />
          {marks.map(([at, label], i) => (
            <span key={label} className="absolute top-1/2 -translate-x-1/2" style={{ left: `${at}%` }}>
              <span aria-hidden="true" className="block h-5 w-0.5 -translate-y-1/2 bg-dark/15" />
              <span className={`mono-text absolute left-1/2 -translate-x-1/2 font-mono text-[0.5625rem] whitespace-nowrap text-dark/60 ${i === 1 && at - marks[0][0] < 12 ? "-top-9" : "top-3.5"}`}>
                {label} {at}
              </span>
            </span>
          ))}
          <span
            className="absolute top-1/2 z-10 size-[1.125rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-sky-deep shadow-[0_0_0_5px_var(--color-gray-100)] transition-[left] duration-[1150ms] ease-out-expo"
            style={{ left: `${on ? result.overall : 0}%` }}
          >
            <span className="absolute bottom-6 left-1/2 -translate-x-1/2 rounded-full border border-sky-deep bg-white px-2.5 py-1 text-xs font-medium whitespace-nowrap text-sky-deep">You · {result.overall}</span>
          </span>
        </div>
      </div>

      <div className="mt-8 rounded-lg border border-dark/10 bg-gray-100 px-5 py-5">
        <p className="font-medium">{whatsNext.h}</p>
        <p className="mt-1.5 text-sm leading-tight text-dark/80">{whatsNext.intro}</p>
        <ul className="mt-3 space-y-1.5">
          {whatsNext.bullets.map((b) => (
            <li key={b} className="flex items-start gap-2.5 text-sm leading-tight">
              <span aria-hidden="true" className="mt-0.5 flex size-[0.9375rem] shrink-0 items-center justify-center rounded-[4px] bg-sky-deep text-white">
                {check}
              </span>
              {b}
            </li>
          ))}
        </ul>
        {identity.optin && WHATSAPP_URL && (
          <p className="mt-5">
            <a href={WHATSAPP_URL} target="_blank" rel="noopener" className={primaryBtn}>
              Join the WhatsApp community →
            </a>
          </p>
        )}
        <p className="mono-text mt-4 font-mono text-dark/60">{whatsNext.fine}</p>
        <p className="mt-2 text-xs leading-tight text-dark/70">{whatsNext.note(result.route)}</p>
        <p className="mt-3 text-xs leading-tight text-dark/70" aria-live="polite">
          {delivery === "sending" && "Sending your full report to " + identity.email + " — it comes from hello@knnekt.studio…"}
          {delivery === "sent" &&
            "Your full report is on its way to " +
              identity.email +
              " — it comes from hello@knnekt.studio, so check your spam folder if it isn’t in your inbox in a few minutes. We’ll call " +
              identity.phone +
              "."}
          {delivery === "failed" &&
            "We couldn’t email your report just now — we still have your details, and we’ll send it from hello@knnekt.studio and call " + identity.phone + " shortly."}
        </p>
      </div>

      <details className="mt-8 group">
        <summary className="mono-text cursor-pointer list-none font-mono text-dark/70 transition-colors hover:text-dark">
          <span className="inline-block transition-transform group-open:rotate-90">›</span> Your answers — exactly what you told us
        </summary>
        <ul className="mt-4 space-y-3 border-t border-dark/15 pt-4">
          {responses(answers, result.catOther, identity).map((r, i) => (
            <li key={i} className="text-xs leading-tight">
              <p className="mono-text font-mono text-dark/50">{r.section}</p>
              <p className="mt-0.5 text-dark/80">{r.question}</p>
              <p className="mt-0.5 font-medium text-dark">{r.answer}</p>
            </li>
          ))}
        </ul>
        <p className="mt-4 text-xs leading-tight text-dark/70">If anything looks off, we’ll fix it on the call.</p>
      </details>
    </div>
  );
}

type Stage = { at: "identity" } | { at: "page"; page: number } | { at: "scoring" } | { at: "report"; result: Result };

/**
 * The Startup Operating Score. Page one takes the founder's details; then one
 * page per section — company context, each of the six pillars, resourcing —
 * and the report once the last page is answered. Finishing submits the
 * answers, which emails the PDF and queues the call; opted-in founders are
 * then taken to the WhatsApp community. `bare` drops the sky band and the
 * card's shadow for when it already sits inside a dialog.
 */
export default function ScoreQuiz({ bare = false }: { bare?: boolean }) {
  const [identity, setIdentity] = useState<Identity>({ name: "", email: "", phone: "", optin: false });
  const [answers, setAnswers] = useState<Answers>(() => questions.map((q) => (q.kind === "multi" ? [] : null)));
  const [catOther, setCatOther] = useState("");
  const [stage, setStage] = useState<Stage>({ at: "identity" });
  const [delivery, setDelivery] = useState<Delivery>("sending");
  const top = useRef<HTMLDivElement>(null);

  const scrollTop = () => top.current?.scrollIntoView({ behavior: reduceMotion() ? "auto" : "smooth", block: "start" });
  const go = (s: Stage) => {
    setStage(s);
    scrollTop();
  };

  const finish = () => {
    go({ at: "scoring" });
    const result = grade(answers, catOther);
    setDelivery("sending");
    const pause = new Promise((r) => setTimeout(r, reduceMotion() ? 300 : 2000));
    const send = fetch("/api/score", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ identity, answers, catOther }),
    })
      .then(async (res) => {
        const body = (await res.json().catch(() => null)) as { emailed?: boolean } | null;
        setDelivery(res.ok && body?.emailed ? "sent" : "failed");
      })
      .catch(() => setDelivery("failed"));
    pause.then(() => go({ at: "report", result }));
    void send;
  };

  const card =
    stage.at === "identity" ? (
      <IdentityForm
        initial={identity}
        onNext={(id) => {
          setIdentity(id);
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
      <Report result={stage.result} identity={identity} answers={answers} delivery={delivery} />
    );

  const inner = <div className="flex min-h-[30rem] flex-col">{card}</div>;

  if (bare) {
    return (
      <div ref={top} className="scroll-mt-8 rounded-xl border border-dark/10 bg-white p-5 md:p-7">
        {inner}
      </div>
    );
  }

  return (
    <div ref={top} className="bg-panel relative isolate scroll-mt-8 overflow-hidden rounded-xl">
      <GradientBackground />
      <div className="relative z-10 px-4 py-8 sm:p-8 lg:p-12">
        <div className="mx-auto w-full max-w-[40rem] rounded-xl bg-white p-6 shadow-[0_40px_90px_-50px_rgba(22,37,63,0.45)] md:p-9">{inner}</div>
      </div>
    </div>
  );
}
