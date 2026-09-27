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
