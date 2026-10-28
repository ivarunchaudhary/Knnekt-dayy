"use client";

import { useEffect, useRef } from "react";

/**
 * The studio film, edge to edge behind the wordmark and the claim. It plays
 * only while the hero is in view and the tab is visible; with reduced motion
 * it holds its poster frame.
 */
export default function HeroFilm() {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    video.muted = true; // required for autoplay on phones
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) {
      video.removeAttribute("autoplay");
      video.pause();
      return;
    }

    let inView = false;
    const play = () => void video.play()?.catch(() => {});
    const sync = () => (inView && !document.hidden ? play() : video.pause());
    const io = new IntersectionObserver(
      ([entry]) => {
        inView = entry.isIntersecting;
        sync();
      },
      { threshold: 0.05 },
    );
    io.observe(video);
    document.addEventListener("visibilitychange", sync);
    return () => {
      io.disconnect();
      document.removeEventListener("visibilitychange", sync);
    };
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden bg-sky-soft">
      <div className="kn-hero-stage relative size-full">
        <video
          ref={ref}
          data-hero-video
          className="kn-hero-video"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          aria-hidden="true"
          tabIndex={-1}
          disablePictureInPicture
          poster="/images/hero--film-poster-v2.jpg"
        >
          <source src="/videos/hero--film-v2.mp4" type="video/mp4" />
        </video>
      </div>
    </div>
  );
}
