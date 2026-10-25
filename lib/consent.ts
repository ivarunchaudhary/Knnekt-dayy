/**
 * The visitor's cookie choice, shared by knnekt.studio and score.knnekt.studio.
 * One cookie on the parent domain holds it, so a founder who answers on the
 * site isn't asked again on the score. It is also the consent record: what was
 * chosen, under which version of the banner, and when.
 *
 * Google Analytics and Clarity always load, in their consent modes: until the
 * visitor allows analytics they set no cookies and send cookieless pings only.
 * The Meta pixel doesn't load at all until advertising is allowed, and nothing
 * goes to the Conversions API before then either (app/api/meta checks too).
 */
export const CONSENT_COOKIE = "knnekt_consent";
/** Raise when the list of cookies changes: everyone is asked again. */
export const CONSENT_VERSION = 1;
/** Ask again after six months. */
const DAYS = 180;

export type Consent = { analytics: boolean; ads: boolean };
type Saved = Consent & { v: number; ts: string };

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    clarity?: (...args: unknown[]) => void;
    KnnektConsent?: { open: () => void; get: () => Consent | null };
  }
}

/** The saved choice from a cookie string (document.cookie, or a request's Cookie header). */
export function parseConsent(cookies: string): Consent | null {
  const m = cookies.match(new RegExp(`(?:^|;\\s*)${CONSENT_COOKIE}=([^;]*)`));
  if (!m) return null;
  try {
    const v = JSON.parse(decodeURIComponent(m[1])) as Partial<Saved>;
    return v.v === CONSENT_VERSION ? { analytics: v.analytics === true, ads: v.ads === true } : null;
  } catch {
    return null;
  }
}

export const readConsent = () => (typeof document === "undefined" ? null : parseConsent(document.cookie));

/** For useSyncExternalStore: every choice made in this tab fires `knnekt:consent`. */
export function onConsentChange(callback: () => void) {
  window.addEventListener("knnekt:consent", callback);
  return () => window.removeEventListener("knnekt:consent", callback);
}

/** Whether the visitor has allowed this kind of cookie. */
export const allowed = (kind: keyof Consent) => readConsent()?.[kind] === true;

/** knnekt.studio and its subdomains share the cookie; anywhere else (previews, localhost) it stays on the host. */
const sharedDomain = () => (/(^|\.)knnekt\.studio$/.test(location.hostname) ? "; domain=.knnekt.studio" : "");

export function saveConsent({ analytics, ads }: Consent) {
  const record: Saved = { v: CONSENT_VERSION, analytics, ads, ts: new Date().toISOString() };
  const secure = location.protocol === "https:" ? "; Secure" : "";
  document.cookie = `${CONSENT_COOKIE}=${encodeURIComponent(JSON.stringify(record))}; max-age=${DAYS * 86400}; path=/; SameSite=Lax${secure}${sharedDomain()}`;
}

/**
 * Turning consent off doesn't take back cookies already set, so a withdrawal
 * expires them. Each tool writes on the widest domain it can, which we can't
 * know for sure, so every level of the current host gets the same expiry.
 */
function forget(match: RegExp) {
  const names = document.cookie
    .split(";")
    .map((c) => c.split("=")[0].trim())
    .filter((n) => match.test(n));
  if (!names.length) return;
  const parts = location.hostname.split(".");
  const domains = [""].concat(parts.slice(0, -1).map((_, i) => `; domain=.${parts.slice(i).join(".")}`));
  for (const name of names) for (const d of domains) document.cookie = `${name}=; max-age=0; path=/${d}`;
}

/**
 * Hands the choice to every tool: Google's Consent Mode, Clarity's consentv2
 * and the pixel, when it's on the page. The pixel itself is loaded by
 * <MetaPixel/>, which listens for the `knnekt:consent` event.
 */
export function applyConsent({ analytics, ads }: Consent) {
  const v = (b: boolean) => (b ? "granted" : "denied");
  window.gtag?.("consent", "update", {
    analytics_storage: v(analytics),
    ad_storage: v(ads),
    ad_user_data: v(ads),
    ad_personalization: v(ads),
  });
  window.clarity?.("consentv2", { analytics_Storage: v(analytics), ad_Storage: v(ads) });
  window.fbq?.("consent", ads ? "grant" : "revoke");
  if (!analytics) forget(/^(_ga|_clck$|_clsk$)/);
  if (!ads) forget(/^(_fbp|_fbc|_gcl_)/);
}

/**
 * Runs in <head> before any tag: everything defaults to denied, then a
 * returning visitor's saved choice is applied straight away, so the first
 * page view already goes out under it. Kept as a string because it has to be
 * inline; it mirrors parseConsent and applyConsent above.
 */
export function consentBootstrap(clarityId?: string) {
  const clarity = clarityId
    ? `window.clarity=window.clarity||function(){(window.clarity.q=window.clarity.q||[]).push(arguments)};
clarity('consentv2',{analytics_Storage:'denied',ad_Storage:'denied'});
clarity('set','layout',innerWidth<768?'phone':innerWidth<1024?'tablet':'desktop');`
    : "";
  return `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}
gtag('consent','default',{analytics_storage:'denied',ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied'});
${clarity}
try{var m=document.cookie.match(/(?:^|;\\s*)${CONSENT_COOKIE}=([^;]*)/),c=m&&JSON.parse(decodeURIComponent(m[1]));
if(c&&c.v===${CONSENT_VERSION}){var g=function(b){return b===true?'granted':'denied'};
gtag('consent','update',{analytics_storage:g(c.analytics),ad_storage:g(c.ads),ad_user_data:g(c.ads),ad_personalization:g(c.ads)});
${clarityId ? "clarity('consentv2',{analytics_Storage:g(c.analytics),ad_Storage:g(c.ads)});" : ""}}}catch(e){}`;
}
