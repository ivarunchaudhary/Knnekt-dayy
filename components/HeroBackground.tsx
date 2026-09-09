/**
 * Hero backdrop: full-bleed photograph under the site's film-grain overlay.
 *
 * The frame is dark at the edges but the frosted-glass panels are bright through the
 * middle — which is exactly where the vertically-centred wordmark and claim sit. The
 * scrim therefore darkens left and right and leaves the centre comparatively open, so
 * the white type stays legible without flattening the picture. Mobile crops narrower
 * into the panels, so it carries a slightly heavier flat tint.
 *
 * Three motions, all slow enough to read as atmosphere rather than animation, and all
 * behind `motion-safe` so a reduced-motion visitor gets the still frame:
 *   1. the picture fades up out of the dark with a push-in, once, on load;
 *   2. a Ken Burns drift on a separate wrapper, so it composes with the reveal's
 *      transform instead of fighting it for the same property;
 *   3. the vignette breathes, which keeps the edges from ever looking painted on.
 * The grain stays on this outer element so it never rides along with the drift.
 */
export default function HeroBackground() {
  return (
    <div className="bg-darker after:animate-grain after:bg-grain absolute inset-0 overflow-hidden after:absolute after:top-0 after:left-0 after:size-[140%] after:opacity-5">
      <div className="motion-safe:animate-hero-drift size-full">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          alt=""
          aria-hidden="true"
          src="/images/hero.jpg"
          srcSet="/images/hero--mobile.jpg 1600w, /images/hero.jpg 2400w"
          sizes="100vw"
          width={2400}
          height={1600}
          fetchPriority="high"
          decoding="async"
          className="motion-safe:animate-hero-reveal size-full object-cover"
        />
      </div>
      <div className="absolute inset-0 bg-black/55 md:bg-black/25" />
      <div className="motion-safe:animate-hero-breathe absolute inset-0 bg-[linear-gradient(90deg,#0b0d10_0%,transparent_38%,transparent_62%,#0b0d10_100%)] opacity-80" />
    </div>
  );
}
