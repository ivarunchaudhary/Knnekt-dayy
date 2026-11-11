/**
 * Where a visitor came from and who they are to Meta, kept for the visit so
 * the lead record can carry it. Ad reviews judge each ad by cost per score and
 * fit rate, so every lead has to name the ad it came from; and the pipeline
 * events Meta gets days later (QualifiedLead, Schedule, Purchase) can only be
 * matched back to the click with the _fbp and _fbc saved here.
 *
 * Browser only. Everything lives in sessionStorage, which a blocked or private
 * window may refuse, so every access is guarded and a failure just means less
 * detail on the lead.
 */

const ATTR_KEY = "knnekt_attr";
const APP_KEY = "knnekt_application_id";

export const UTM_KEYS = ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content"] as const;

export type Attribution = Partial<Record<(typeof UTM_KEYS)[number] | "fbclid" | "landing_url", string>> & { landing_at?: number };

function read<T>(key: string): T | null {
  try {
    const v = sessionStorage.getItem(key);
    return v ? (JSON.parse(v) as T) : null;
  } catch {
    return null;
  }
}

function write(key: string, value: unknown) {
  try {
    sessionStorage.setItem(key, JSON.stringify(value));
  } catch {}
}

/**
 * Reads the UTMs and fbclid off the address the visitor landed on. The first
 * tagged landing of the visit wins; a later untagged page doesn't wipe it, and
 * a new ad click (a new fbclid) replaces it.
 */
export function captureAttribution() {
  if (typeof window === "undefined") return;
  const q = new URLSearchParams(location.search);
  const found: Attribution = {};
  for (const k of [...UTM_KEYS, "fbclid"] as const) {
    const v = q.get(k);
    if (v) found[k] = v.slice(0, 500);
  }
  const saved = read<Attribution>(ATTR_KEY);
  if (saved && (!found.fbclid || found.fbclid === saved.fbclid)) return;
  write(ATTR_KEY, { ...found, landing_url: location.href.slice(0, 1000), landing_at: Date.now() });
}

export const attribution = (): Attribution => read<Attribution>(ATTR_KEY) ?? {};

const cookie = (name: string) => document.cookie.match(new RegExp(`(?:^|;\\s*)${name}=([^;]+)`))?.[1] ?? "";

/**
 * Meta's browser ID and click ID. The pixel sets both once advertising is
 * allowed; when it hasn't set _fbc yet but the landing carried an fbclid, the
 * click ID is built the way Meta builds it, from the landing time.
 */
export function metaIds() {
  const a = attribution();
  const fbc = cookie("_fbc") || (a.fbclid ? `fb.1.${a.landing_at ?? Date.now()}.${a.fbclid}` : "");
  return { fbp: cookie("_fbp"), fbc };
}

/** Everything the lead record keeps about where this founder came from. */
export const leadAttribution = () => {
  const { landing_at, ...a } = attribution();
  return { ...a, ...(landing_at && { landing_at: new Date(landing_at).toISOString() }), ...metaIds() };
};

const newId = () =>
  typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID() : `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`;

/**
 * The application_id: made the moment the score opens, kept for the visit, and
 * saved with the lead (the Sheet's Session column). Every Meta event about this
 * application builds its ID from it — fs_, ld_, sa_, ql_, sc_ — so the browser
 * and server copies match, and the pipeline can name the founder days later.
 */
export function applicationId() {
  let id = "";
  try {
    id = sessionStorage.getItem(APP_KEY) ?? "";
  } catch {}
  if (!id) {
    id = newId();
    try {
      sessionStorage.setItem(APP_KEY, id);
    } catch {}
  }
  return id;
}

/** A finished application is closed: a retake in the same visit is a new one. */
export function closeApplication(id: string) {
  try {
    if (sessionStorage.getItem(APP_KEY) === id) sessionStorage.removeItem(APP_KEY);
  } catch {}
}

/**
 * True the first time `key` is asked for this visit, false after. Guards the
 * events that must reach Meta once per application whatever the founder does:
 * goes back, double-clicks, reloads.
 */
export function firstTime(key: string) {
  try {
    if (sessionStorage.getItem(`fired_${key}`)) return false;
    sessionStorage.setItem(`fired_${key}`, "1");
  } catch {}
  return true;
}
