"use client";

import { useState, type ReactNode } from "react";
import ScoreDialog from "./ScoreDialog";

/**
 * A score CTA for server-rendered pages: on the site the score opens over the
 * page, the same as on the homepage. score.knnekt.studio stays the address for
 * anyone arriving from outside (ads, shared links). Each click is counted as
 * a score_cta_click (components/SiteEvents.tsx), placed by `location`, or by
 * the section the button sits in when it doesn't say.
 */
export default function ScoreButton({ className, location, children }: { className?: string; location?: string; children: ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button type="button" onClick={() => setOpen(true)} data-score-cta={location ?? ""} className={className}>
        {children}
      </button>
      {open && <ScoreDialog onClose={() => setOpen(false)} />}
    </>
  );
}
