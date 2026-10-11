"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { PIXEL_ID, loadPixel, track } from "@/lib/pixel";

/**
 * Loads the pixel once, then sends a PageView for the landing page and every
 * client-side navigation after it. Each one goes through track(), so the
 * browser copy and the Conversions API copy share an event ID and Meta
 * counts them once.
 */
export default function MetaPixel() {
  const pathname = usePathname();

  useEffect(() => {
    loadPixel();
    track("PageView");
  }, [pathname]);

  return (
    <noscript>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img height="1" width="1" style={{ display: "none" }} alt="" src={`https://www.facebook.com/tr?id=${PIXEL_ID}&ev=PageView&noscript=1`} />
    </noscript>
  );
}
