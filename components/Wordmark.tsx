import Image from "next/image";
import { LOCKUP_PATH, LOCKUP_VIEWBOX, WORDMARK_PATH, WORDMARK_VIEWBOX } from "@/lib/brand";

/**
 * The knnekt logotype, drawn from the brand kit's outlines. It fills with
 * `currentColor` and is sized in `em`, so callers keep setting its colour and
 * size with text utilities exactly as they did when it was set in type. `mark`
 * puts the K-house symbol in front, standing in for the k: it is cut to the
 * letters' full height, sits on their baseline, and the logotype drops its own
 * k so the lockup reads "knnekt" rather than "K knnekt".
 */
export default function Wordmark({ className = "", mark = false }: { className?: string; mark?: boolean }) {
  return (
    <span role="img" aria-label="Knnekt Studios" className={`inline-flex items-end gap-[0.08em] leading-none ${className}`}>
      {mark && <Image src="/brand/knnekt-mark.png" alt="" width={854} height={1026} className="h-[0.8em] w-auto" />}
      <svg viewBox={mark ? LOCKUP_VIEWBOX : WORDMARK_VIEWBOX} aria-hidden="true" className="h-[0.8em] w-auto fill-current">
        <path d={mark ? LOCKUP_PATH : WORDMARK_PATH} />
      </svg>
    </span>
  );
}
