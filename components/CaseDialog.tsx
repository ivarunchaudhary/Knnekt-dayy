"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import type { WorkItem } from "@/lib/data";
import Vimeo from "./Vimeo";

const chipClass = "rounded-lg bg-gray-200 px-2.5 pt-1.5 pb-2 text-xs leading-tight";

/** The case's own asset, sized for a dialog rather than a page. */
function Asset({ item }: { item: WorkItem }) {
  const still = item.desktop ?? item.mobile;
  if (!item.vimeo && !still) return null;
  return (
    <div className="mt-8 overflow-hidden rounded-xl bg-gray-200">
      {item.vimeo ? (
        <div className="relative aspect-[4/5] md:aspect-[16/9]">
          <Vimeo id={item.vimeo} aspect={item.vimeoAspect} title={item.client} cover eager />
        </div>
      ) : (
        /* eslint-disable-next-line @next/next/no-img-element */
        <img
          alt={item.alt ?? item.client}
          loading="eager"
          decoding="async"
          width={still!.w}
          height={still!.h}
          sizes="(min-width: 1024px) 60rem, 100vw"
          className="aspect-[4/5] w-full object-cover md:aspect-[16/9]"
          src={still!.src}
        />
      )}
    </div>
  );
}

/**
 * A case, opened in the middle of the page instead of on one of its own. The
 * native <dialog> carries the focus trap, the Esc key and the backdrop; we add
 * the fade, the scroll lock and a way through to the full page for anyone who
 * wants the URL.
 */
export default function CaseDialog({ item, onClose }: { item: WorkItem; onClose: () => void }) {
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
      aria-labelledby="case-dialog-title"
      onCancel={(e) => {
        e.preventDefault();
        dismiss();
      }}
      onClick={(e) => {
        if (e.target === ref.current) dismiss();
      }}
      className={`ease-in-out-quart m-auto w-[min(64rem,calc(100vw-1.5rem))] max-w-none rounded-xl bg-white p-0 text-inherit backdrop:bg-black/60 backdrop:backdrop-blur-[2px] motion-safe:transition motion-safe:duration-200 ${
        shown ? "opacity-100" : "scale-[0.98] opacity-0"
      }`}
    >
      <div className="max-h-[88vh] overflow-y-auto overscroll-contain p-6 md:p-12">
        <div className="flex items-start justify-between gap-6">
          <p className="mono-text text-dark-very-subtle font-mono">
            {item.client} · {item.sector}
          </p>
          <button
            type="button"
            onClick={dismiss}
            className="mono-text text-dark-subtle hover:text-dark -mt-1.5 -mr-1.5 flex size-9 shrink-0 items-center justify-center rounded-full bg-gray-200 font-mono text-base transition-colors"
          >
            <span aria-hidden="true">✕</span>
            <span className="sr-only">Close</span>
          </button>
        </div>

        <h2 id="case-dialog-title" className="mt-5 max-w-[20ch] text-3xl font-medium md:text-4xl">
          {item.title}
        </h2>

        <div className="mt-8 grid gap-x-1.5 gap-y-6 border-t border-black/10 pt-7 lg:grid-cols-[minmax(0,36rem)_auto]">
          <p className="text-lg leading-tight">{item.blurb}</p>
          <div className="lg:justify-self-end lg:text-right">
            <p className="mono-text text-dark-very-subtle font-mono">Engagement</p>
            <p className="mt-2.5 font-medium">{item.tier}</p>
          </div>
        </div>

        <Asset item={item} />

        <ul className="mt-10 grid divide-y divide-black/10 border-y border-black/10 sm:grid-cols-3 sm:divide-x sm:divide-y-0">
          {item.results.map(([value, label]) => (
            <li key={label} className="py-6 sm:px-7 sm:first:pl-0 sm:last:pr-0">
              <p className="text-3xl leading-none font-medium">{value}</p>
              <p className="text-dark-subtle mt-2.5 text-sm leading-tight">{label}</p>
            </li>
          ))}
        </ul>

        <div className="mt-10 grid gap-x-1.5 gap-y-10 lg:grid-cols-2">
          <section>
            <h3 className="mono-text text-dark/80 font-mono">How it ran</h3>
            <ol className="mt-6 border-l border-black/10 pl-7">
              {item.timeline.map(([when, what]) => (
                <li key={when} className="relative pb-7 last:pb-0">
                  <span aria-hidden="true" className="bg-dark absolute top-[0.3rem] -left-8 size-2 rounded-full" />
                  <p className="mono-text text-dark-very-subtle font-mono">{when}</p>
                  <p className="mt-2 text-sm leading-tight">{what}</p>
                </li>
              ))}
            </ol>
          </section>
          <section>
            <h3 id="case-dialog-delivered" className="mono-text text-dark/80 font-mono">
              What we delivered
            </h3>
            <ul aria-labelledby="case-dialog-delivered" className="mt-6 grid grid-cols-1 gap-1.5 sm:grid-cols-2">
              {item.delivered.map((d) => (
                <li key={d} className={chipClass}>
                  {d}
                </li>
              ))}
            </ul>
          </section>
        </div>

        <section className="bg-darker relative isolate mt-10 overflow-hidden rounded-xl px-6 py-10 text-white md:px-12 md:py-14">
          <div
            aria-hidden="true"
            className="after:animate-grain after:bg-grain absolute inset-0 -z-10 overflow-hidden after:absolute after:top-0 after:left-0 after:size-[140%] after:opacity-5"
          />
          <div className="grid gap-x-12 gap-y-6 lg:grid-cols-[9rem_minmax(0,1fr)]">
            <h3 className="mono-text font-mono text-white/50 lg:pt-2.5">What we refused</h3>
            <p className="text-xl leading-tight font-medium lg:text-2xl">{item.refused}</p>
          </div>
        </section>

        <figure className="mt-10 border-t border-black/10 pt-8">
          <blockquote className="text-2xl leading-tight font-medium">
            <span className="text-dark-very-subtle">“</span>
            {item.quote}
            <span className="text-dark-very-subtle">”</span>
          </blockquote>
          <figcaption className="mono-text text-dark-very-subtle mt-6 font-mono">{item.attribution}</figcaption>
        </figure>

        <Link
          href={`/en/case/${item.slug}`}
          className="mono-text text-dark-subtle hover:text-dark group mt-10 inline-flex items-center gap-2 font-mono transition-colors"
        >
          Open the full case
          <span aria-hidden="true" className="ease-in-out-quart inline-block transition-transform duration-300 group-hover:translate-x-1">
            →
          </span>
        </Link>
      </div>
    </dialog>
  );
}
