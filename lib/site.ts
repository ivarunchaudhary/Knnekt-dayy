/**
 * Where the site lives. The studio is on the apex domain; the score has a
 * subdomain of its own (same deployment, rewritten by proxy.ts) so ads can
 * land on it directly. In development both fall back to plain paths, so
 * localhost never links out to production.
 */
const prod = process.env.NODE_ENV === "production";

export const SITE_HOST = "knnekt.studio";
export const SCORE_HOST = `score.${SITE_HOST}`;

export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? (prod ? `https://${SITE_HOST}` : "");
export const SCORE_URL = process.env.NEXT_PUBLIC_SCORE_URL ?? (prod ? `https://${SCORE_HOST}` : "/en/score");

/**
 * The generated link preview (app/opengraph-image.tsx). Pages that set their own
 * openGraph replace the root one wholesale, images included, so they point back
 * at it by hand. Resolved against metadataBase, so it is always the apex copy.
 */
export const SHARE_IMAGE = { url: "/opengraph-image", width: 1200, height: 630, alt: "Knnekt Studios · India’s first Startup Execution Studio" };
