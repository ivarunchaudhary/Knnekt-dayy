"use client";

import { useEffect, useSyncExternalStore } from "react";
import { usePathname } from "next/navigation";
import { allowed, onConsentChange } from "@/lib/consent";
import { loadPixel, meta } from "@/lib/pixel";

/**
 * Loads the pixel once the visitor allows advertising — on a returning
 * visit straight away, otherwise the moment they accept — then sends a
 * PageView for the page they're on and every client-side navigation after it.
 * Each one goes through meta(), so the browser copy and the Conversions API
 * copy share an event ID and Meta counts them once. There's no <noscript>
 * pixel: without JavaScript there's no banner to ask with.
 */
export default function MetaPixel() {
  const pathname = usePathname();
  const ads = useSyncExternalStore(onConsentChange, () => allowed("ads"), () => false);

  useEffect(() => {
    if (!ads) return;
    loadPixel();
    meta("PageView");
  }, [ads, pathname]);

  return null;
}
