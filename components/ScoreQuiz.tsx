"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { scorePillars, scoreSample } from "@/lib/data";
import { grade, questions, verdicts, type Answers, type Result } from "@/lib/score";
import GradientBackground from "./GradientBackground";

const TOTAL = questions.length;
const reduceMotion = () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

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

/** The six pillars as bars, growing as the founder answers. */
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
            <span className="block text-sm font-sans font-medium normal-case tracking-normal text-dark tabular-nums">{values[i]}</span>
            {p}
          </li>
        ))}
      </ul>
    </>
  );
}

/** The question card: progress, the question, its options, and a way back. */
function Question({ index, answers, onPick, onBack }: { index: number; answers: Answers; onPick: (i: number) => void; onBack: () => void }) {
  const q = questions[index];
  const picked = answers[index];
  const label = q.kind === "gate" ? "One last thing" : scorePillars[q.pillar];
  return (
    <div key={index} className="flex flex-1 flex-col motion-safe:animate-[score-in_0.5s_var(--ease-out-expo)_both]">
      <Eyebrow left={`Question ${String(index + 1).padStart(2, "0")} / ${TOTAL}`} right={label} />
      <div aria-hidden="true" className="mt-4 h-1 overflow-hidden rounded-full bg-gray-100">
        <span className="block h-full rounded-full bg-sky-deep transition-[width] duration-500 ease-out-expo" style={{ width: `${(index / TOTAL) * 100}%` }} />
      </div>
      <p className="mt-6 text-xl leading-tight font-medium lg:text-2xl">{q.text}</p>
      <ul role="radiogroup" aria-label={q.text} className="mt-5 space-y-2">
        {q.options.map((o, i) => {
          const on = picked === i;
          return (
            <li key={o.label}>
              <button
                type="button"
                role="radio"
                aria-checked={on}
                onClick={() => onPick(i)}
                className={`flex w-full items-center gap-3 rounded-lg border px-4 py-3 text-left text-sm leading-tight transition-colors outline-dark ${
                  on ? "border-sky-deep bg-gray-100" : "border-dark/15 hover:border-sky-deep hover:bg-gray-100"
                }`}
              >
                <span
                  aria-hidden="true"
                  className={`size-4 shrink-0 rounded-full border-[1.5px] transition-colors ${on ? "border-sky-deep bg-sky-deep shadow-[inset_0_0_0_3px_#fff]" : "border-dark/50"}`}
                />
                {o.label}
              </button>
            </li>
          );
        })}
      </ul>
      <p className="mt-auto flex items-center justify-between gap-3 pt-6">
        <button
          type="button"
          onClick={onBack}
          disabled={index === 0}
          className="mono-text rounded-full px-3 py-2 font-mono text-dark/70 transition-colors outline-dark hover:text-dark disabled:pointer-events-none disabled:opacity-30"
        >
          ← Back
        </button>
        <span className="mono-text font-mono text-dark/60">{q.kind === "gate" ? "This one can override the score" : "Pick the honest answer"}</span>
      </p>
    </div>
  );
}

function Report({ result, onRetake }: { result: Result; onRetake: () => void }) {
  const n = useCountUp(result.total, 1000);
  const v = verdicts[result.verdict];
  const [on, setOn] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setOn(true), reduceMotion() ? 0 : 60);
    return () => clearTimeout(t);
  }, []);
  const { marks } = scoreSample.climb;

  return (
    <div className="motion-safe:animate-[score-in_0.5s_var(--ease-out-expo)_both]">
      <Eyebrow left="Your report" right="Verdict" />
      <div className="mt-5 flex flex-wrap items-baseline gap-x-2.5 gap-y-2">
        <span className="text-4xl leading-[0.9] font-medium tabular-nums md:text-[4.75rem]">{n}</span>
        <span className="mono-text font-mono text-dark/60">/100</span>
        <span className="mono-text ml-auto text-right font-mono text-dark/60">
          Archetype
          <span className="mt-1 block font-sans text-sm font-medium normal-case tracking-normal text-dark">{result.archetype}</span>
        </span>
      </div>
      <div className="mt-6">
        <Pillars values={result.pillars} weak={result.weak} />
      </div>

      <div className="mt-8 rounded-lg bg-panel px-5 py-4">
        <p className="mono-text font-mono text-sky-deep">{v.tag}</p>
        <p className="mt-2 text-lg leading-tight font-medium">{v.line}</p>
        <p className="mt-2 text-sm leading-tight text-dark/80">{v.sub}</p>
        {result.gateNote && <p className="mono-text mt-3 font-mono text-dark/60">◇ {result.gateNote}</p>}
      </div>

      <div className="mt-8">
        <Eyebrow left="Your top 3 constraints" right="First moves" />
        <ul className="mt-4 space-y-2.5">
          {result.constraints.map(([name, why], i) => (
            <li key={name} className="rounded-r-lg border-l-2 border-sky-deep bg-gray-100 px-4 py-3">
              <p className="text-sm font-medium">{name}</p>
              <p className="text-dark-subtle mt-0.5 text-xs leading-tight">{why}</p>
              <p className="mt-2 flex items-center gap-2.5 text-xs leading-tight">
                <span aria-hidden="true" className="flex size-[0.9375rem] shrink-0 items-center justify-center rounded-[4px] bg-sky-deep text-white">
                  {check}
                </span>
                {result.roadmap[i]}
              </p>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-8">
        <Eyebrow left="Where you are → where you’re going" right="Your climb" />
        <p className="mono-text mt-8 flex justify-between font-mono text-dark/60">
          <span>Idea</span>
          <span>Fund-ready</span>
        </p>
        <div className="relative mt-9 mb-14 h-3 rounded-full border border-dark/15 bg-gray-100">
          <span
            aria-hidden="true"
            className="absolute inset-y-0 left-0 rounded-full bg-[linear-gradient(90deg,var(--color-sky-deep),var(--color-sky))] transition-[width] duration-[1150ms] ease-out-expo"
            style={{ width: on ? `${result.climb}%` : 0 }}
          />
          {marks.map(([at, label]) => (
            <span key={label} className="absolute top-1/2 -translate-x-1/2" style={{ left: `${at}%` }}>
              <span aria-hidden="true" className="block h-5 w-0.5 -translate-y-1/2 bg-dark/15" />
              <span className="mono-text absolute top-3.5 left-1/2 -translate-x-1/2 font-mono text-[0.5625rem] whitespace-nowrap text-dark/60">{label}</span>
            </span>
          ))}
          <span
            className="absolute top-1/2 z-10 size-[1.125rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-sky-deep shadow-[0_0_0_5px_var(--color-gray-100)] transition-[left] duration-[1150ms] ease-out-expo"
            style={{ left: `${on ? result.climb : 0}%` }}
          >
            <span className="absolute bottom-6 left-1/2 -translate-x-1/2 rounded-full border border-sky-deep bg-white px-2.5 py-1 text-xs font-medium whitespace-nowrap text-sky-deep">
              You · {result.total}
            </span>
          </span>
        </div>
      </div>

      <p className="flex flex-wrap items-center gap-x-5 gap-y-3">
        <Link href={v.href} className="mono-text group inline-flex items-center rounded-full font-mono outline-offset-2 outline-dark">
          <span className="rounded-full bg-sky-deep px-7 py-3 text-white transition-colors group-hover:bg-dark group-focus-visible:bg-dark">{v.cta}</span>
        </Link>
        <button type="button" onClick={onRetake} className="mono-text rounded-full font-mono text-dark/60 transition-colors outline-dark hover:text-dark">
          ↺ Retake the score
        </button>
      </p>
      <p className="mt-6 border-t border-dark/15 pt-5 text-xs leading-tight text-dark/70">
        This report is yours to keep, even if we never work together. Nothing here was sent anywhere — no email, no card, no list.
      </p>
    </div>
  );
}

/**
 * The Startup Operating Score. Twenty-one questions, one at a time, and the
 * full report once the last one is answered — the number stays hidden until
 * then. Re-answering an earlier question re-scores; nothing leaves the browser.
 * `bare` drops the sky band and the card's shadow for when it already sits
 * inside a dialog.
 */
export default function ScoreQuiz({ bare = false }: { bare?: boolean }) {
  const [answers, setAnswers] = useState<Answers>(() => Array(TOTAL).fill(null));
  const [index, setIndex] = useState(0);
  const [result, setResult] = useState<Result | null>(null);
  const top = useRef<HTMLDivElement>(null);

  const pick = (i: number) => {
    const next = [...answers];
    next[index] = i;
    setAnswers(next);
    if (index < TOTAL - 1) setIndex(index + 1);
    else setResult(grade(next));
  };

  const retake = () => {
    setAnswers(Array(TOTAL).fill(null));
    setIndex(0);
    setResult(null);
    top.current?.scrollIntoView({ behavior: reduceMotion() ? "auto" : "smooth", block: "start" });
  };

  const card = result ? (
    <Report result={result} onRetake={retake} />
  ) : (
    <div className="flex min-h-[30rem] flex-col">
      <Question index={index} answers={answers} onPick={pick} onBack={() => setIndex((i) => Math.max(0, i - 1))} />
    </div>
  );

  if (bare) {
    return (
      <div ref={top} className="scroll-mt-8 rounded-xl border border-dark/10 bg-white p-5 md:p-7">
        {card}
      </div>
    );
  }

  return (
    <div ref={top} className="bg-panel relative isolate scroll-mt-8 overflow-hidden rounded-xl">
      <GradientBackground />
      <div className="relative z-10 px-4 py-8 sm:p-8 lg:p-12">
        <div className="mx-auto w-full max-w-[40rem] rounded-xl bg-white p-6 shadow-[0_40px_90px_-50px_rgba(22,37,63,0.45)] md:p-9">{card}</div>
      </div>
    </div>
  );
}
