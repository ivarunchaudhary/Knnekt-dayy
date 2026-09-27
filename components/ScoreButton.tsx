"use client";

import { useState, type ReactNode } from "react";
import ScoreDialog from "./ScoreDialog";

/**
 * A score CTA for server-rendered pages: on the site the score opens over the
 * page, the same as on the homepage. score.knnekt.studio stays the address for
 * anyone arriving from outside (ads, shared links).
 */
export default function ScoreButton({ className, children }: { className?: string; children: ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button type="button" onClick={() => setOpen(true)} className={className}>
        {children}
      </button>
      {open && <ScoreDialog onClose={() => setOpen(false)} />}
    </>
  );
}
