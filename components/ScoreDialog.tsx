"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import ScoreQuiz from "./ScoreQuiz";

/**
 * The score, opened over the page instead of on one of its own. The native
 * <dialog> carries the focus trap, the Esc key and the backdrop; we add the
 * fade, the scroll lock and a way through to the full page for anyone who
 * wants the URL.
 */
export default function ScoreDialog({ onClose }: { onClose: () => void }) {
  const ref = useRef<HTMLDialogElement>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.showModal();
    const raf = requestAnimationFrame(() => setShown(true));
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      cancelAnimationFrame(raf);
      document.body.style.overflow = prev;
    };
  }, []);

  // Let the fade finish before the dialog leaves the tree.
  const dismiss = useCallback(() => {
    setShown(false);
    window.setTimeout(onClose, 200);
  }, [onClose]);

  return (
    <dialog
      ref={ref}
      aria-labelledby="score-dialog-title"
      onCancel={(e) => {
        e.preventDefault();
        dismiss();
      }}
      onClick={(e) => {
        if (e.target === ref.current) dismiss();
      }}
      className={`ease-in-out-quart m-auto w-[min(46rem,calc(100vw-1.5rem))] max-w-none rounded-xl bg-white p-0 text-inherit backdrop:bg-dark/60 backdrop:backdrop-blur-[2px] motion-safe:transition motion-safe:duration-200 ${
        shown ? "opacity-100" : "scale-[0.98] opacity-0"
      }`}
    >
      <div className="max-h-[88vh] overflow-y-auto overscroll-contain p-6 md:p-9">
        <div className="flex items-start justify-between gap-6">
          <div>
            <p className="mono-text text-dark-very-subtle font-mono">Free · 5 min · no card · report emailed as a PDF · we call you</p>
            <h2 id="score-dialog-title" className="mt-3 text-2xl font-medium md:text-3xl">
              Startup Operating Score
            </h2>
          </div>
          <button
            type="button"
            onClick={dismiss}
            className="mono-text text-dark-subtle hover:text-dark -mt-1.5 -mr-1.5 flex size-9 shrink-0 items-center justify-center rounded-full bg-gray-200 font-mono text-base transition-colors"
          >
            <span aria-hidden="true">✕</span>
            <span className="sr-only">Close</span>
          </button>
        </div>

        <div className="mt-6">
          <ScoreQuiz bare />
        </div>

        <Link
          href="/en/score"
          className="mono-text text-dark-subtle hover:text-dark group mt-8 inline-flex items-center gap-2 font-mono transition-colors"
        >
          Open on its own page
          <span aria-hidden="true" className="ease-in-out-quart inline-block transition-transform duration-300 group-hover:translate-x-1">
            →
          </span>
        </Link>
      </div>
    </dialog>
  );
}
