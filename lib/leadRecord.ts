import { requestClient } from "./capi";

const KEYS = ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content", "fbclid", "landing_url", "landing_at", "fbp", "fbc"] as const;

/**
 * What the lead record keeps besides the founder's answers: the ad they came
 * from (UTMs, fbclid, landing page) for ad reviews, and what Meta needs to
 * match the pipeline events sent days later — _fbp, _fbc, IP, browser, and
 * whether they allowed advertising at all. The Sheet files each under its own
 * column (scripts/sheet-webhook.gs). The browser's part arrives as
 * `attribution` (lib/attribution.ts) and is cut down to known keys here, since
 * anyone can post to these routes.
 */
export function leadRecordExtras(request: Request, raw: unknown, adsConsent: boolean) {
  const a = raw && typeof raw === "object" ? (raw as Record<string, unknown>) : {};
  const out: Partial<Record<(typeof KEYS)[number], string>> = {};
  for (const k of KEYS) {
    const v = a[k];
    if (typeof v === "string" && v.trim()) out[k] = v.trim().slice(0, k === "landing_url" ? 1000 : 500);
  }
  const { ip, userAgent } = requestClient(request);
  return { ...out, client_ip: ip ?? "", user_agent: (userAgent ?? "").slice(0, 400), ads_consent: adsConsent };
}
