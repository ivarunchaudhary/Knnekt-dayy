"use client";

import { useEffect, useRef } from "react";
import { HERO_PORTRAIT } from "@/lib/hero";

const cut = () =>
  window.matchMedia(HERO_PORTRAIT).matches
    ? "/videos/hero--9x16.mp4"
    : window.matchMedia("(max-width: 767px)").matches
      ? "/videos/hero--720.mp4"
      : "/videos/hero--1080.mp4";

/**
 * The hero film, laid over its own first frame (<HeroBackground/> paints that as
 * the poster). A <video> draws nothing until it has a frame, so the still shows
 * through until playback starts and a stalled network just leaves the still.
 * It is never hidden with `opacity: 0` while it starts: WebKit's autoplay policy
 * declines to run media it doesn't consider visible, which is how an iPhone ended
 * up on the poster for good.
 *
 * Nothing here is allowed to compete with the first paint. The element ships
 * with `preload="none"` and no `autoplay`, so the browser fetches no bytes of it
 * during load; playback is asked for only after the window's `load` event and an
 * idle tick, by which point the poster, fonts and hydration are done. The files
 * are H.264 rather than AV1 on purpose: every device decodes H.264 in hardware,
 * where AV1 falls back to software on most phones and older Macs, and that is
 * what drops frames. All three encodes are `faststart`, so playback begins on
 * the first few hundred KB instead of after the whole file.
 *
 * Upright phones and tablets get the 9:16 cut (~3.2 MB), small landscape screens
 * the 720p (~2.9 MB) and everything else the 1080p (~6 MB). The file is chosen
 * here, at play time, rather than by `media` on <source>s: browsers pick a
 * source once and some older ones ignore `media` on video altogether, so this
 * way every engine gets the same cut as its poster, and turning the device
 * across the portrait line swaps to the other one.
 *
 * Where autoplay is refused outright (iOS Low Power Mode, some in-app browsers)
 * `play()` rejects; the film then starts on the visitor's first tap, which
 * counts as the gesture those policies wait for. It stays a still under reduced
 * motion, Save-Data or a 2G connection, and pauses whenever the hero is out of
 * view or the tab is hidden, so the decoder is idle for the whole of the page
 * below it.
 */
export default function HeroVideo() {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = ref.current;
    if (!video) return;

    const connection = (navigator as Navigator & { connection?: { saveData?: boolean; effectiveType?: string } })
      .connection;
    if (
      window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
      connection?.saveData ||
      /2g$/.test(connection?.effectiveType ?? "")
    ) {
      return;
    }

    let started = false;
    let inView = true;
    let idle = 0;
    const gestures = ["pointerup", "touchend", "keydown"] as const;
    const unlock = () => {
      gestures.forEach((type) => window.removeEventListener(type, unlock));
      if (inView && !document.hidden) video.play().catch(() => {});
    };
    const play = () => {
      if (!started || !inView || document.hidden) return;
      video.muted = true;
      video.play().catch(() => {
        gestures.forEach((type) => window.addEventListener(type, unlock, { passive: true }));
      });
    };
    const load = () => {
      const src = cut();
      if (video.getAttribute("src") !== src) video.src = src;
    };
    const start = () => {
      started = true;
      load();
      play();
    };
    const schedule = () => {
      idle = window.requestIdleCallback
        ? window.requestIdleCallback(start, { timeout: 1500 })
        : window.setTimeout(start, 200);
    };

    const observer = new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting;
      if (inView) play();
      else video.pause();
    });
    observer.observe(video);

    const onVisibility = () => (document.hidden ? video.pause() : play());
    document.addEventListener("visibilitychange", onVisibility);

    const portrait = window.matchMedia(HERO_PORTRAIT);
    const onTurn = () => {
      if (!started) return;
      load();
      play();
    };
    portrait.addEventListener("change", onTurn);

    if (document.readyState === "complete") schedule();
    else window.addEventListener("load", schedule, { once: true });

    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      portrait.removeEventListener("change", onTurn);
      gestures.forEach((type) => window.removeEventListener(type, unlock));
      window.removeEventListener("load", schedule);
      if (window.cancelIdleCallback) window.cancelIdleCallback(idle);
      window.clearTimeout(idle);
      video.pause();
    };
  }, []);

  return (
    <video
      ref={ref}
      muted
      loop
      playsInline
      preload="none"
      disablePictureInPicture
      aria-hidden="true"
      tabIndex={-1}
      className="hero-frame"
    />
  );
}
