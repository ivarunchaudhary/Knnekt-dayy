"use client";

import { useEffect, useRef, useState } from "react";

/**
 * The hero film, laid over its own first frame (<HeroBackground/> paints that as
 * the poster), and only faded up once it is actually playing, so the swap from
 * still to motion is invisible and a stalled network just leaves the still.
 *
 * Nothing here is allowed to compete with the first paint. The element ships
 * with `preload="none"` and no `autoplay`, so the browser fetches no bytes of it
 * during load; playback is asked for only after the window's `load` event and an
 * idle tick, by which point the poster, fonts and hydration are done. The files
 * are H.264 rather than AV1 on purpose: every device decodes H.264 in hardware,
 * where AV1 falls back to software on most phones and older Macs, and that is
 * what drops frames. Both encodes are `faststart`, so playback begins on the
 * first few hundred KB instead of after the whole file.
 *
 * Phones get the 720p cut (~2.9 MB) and everything wider the 1080p (~6 MB), picked
 * by `media` on the sources. It stays a still under reduced motion, Save-Data or a
 * 2G connection, and pauses whenever the hero is scrolled out of view, so the
 * decoder is idle for the whole of the page below it.
 */
export default function HeroVideo() {
  const ref = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);

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
    const play = () => {
      video.muted = true;
      video.play().catch(() => {});
    };
    const start = () => {
      started = true;
      if (inView) play();
    };
    const schedule = () => {
      idle = window.requestIdleCallback
        ? window.requestIdleCallback(start, { timeout: 1500 })
        : window.setTimeout(start, 200);
    };

    const observer = new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting;
      if (!started) return;
      if (inView) play();
      else video.pause();
    });
    observer.observe(video);

    if (document.readyState === "complete") schedule();
    else window.addEventListener("load", schedule, { once: true });

    return () => {
      observer.disconnect();
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
      onPlaying={() => setPlaying(true)}
      className={`hero-frame transition-opacity duration-700 ${playing ? "opacity-100" : "opacity-0"}`}
    >
      <source src="/videos/hero--720.mp4" type='video/mp4; codecs="avc1.64001F"' media="(max-width: 767px)" />
      <source src="/videos/hero--1080.mp4" type='video/mp4; codecs="avc1.640028"' />
    </video>
  );
}
