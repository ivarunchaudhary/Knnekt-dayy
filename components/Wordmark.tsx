/**
 * The Knnekt Studios wordmark. Set in the site's own typeface rather than an SVG
 * so it inherits the brand font and stays selectable/searchable text.
 */
export default function Wordmark({ className = "" }: { className?: string }) {
  return (
    <span className={`font-sans font-semibold tracking-[-0.03em] whitespace-nowrap normal-case ${className}`}>
      Knnekt Studios
    </span>
  );
}
