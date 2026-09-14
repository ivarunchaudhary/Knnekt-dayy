/**
 * The dark ground behind the contact card: a slow vertical lift out of --color-darker
 * with the site's film grain over it.
 *
 * It was a video, which cost half a megabyte and a breakpoint's worth of client state
 * to deliver what is, on inspection, a two-stop gradient. Drawn in CSS it weighs
 * nothing, paints with the first frame, and lets this stay a server component.
 */
export default function GradientBackground() {
  return (
    <div className="after:animate-grain after:bg-grain absolute inset-0 overflow-hidden bg-[linear-gradient(to_top,#1b2130_0%,#12161d_48%,#0b0d10_100%)] after:absolute after:top-0 after:left-0 after:size-[140%] after:opacity-5" />
  );
}
