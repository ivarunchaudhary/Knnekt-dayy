import { createHash } from "node:crypto";
import { PIXEL_ID, type MetaEvent } from "./metaEvents";

/**
 * The one way anything on the server talks to Meta's Conversions API: the
 * browser relay (/api/meta), the finished score (/api/score) and the pipeline
 * events Make posts later (/api/meta/server). Customer details are normalised
 * and hashed here, so every caller sends them the same way and Event Match
 * Quality doesn't depend on which route sent the event.
 */
const GRAPH_URL = `https://graph.facebook.com/v26.0/${PIXEL_ID}/events`;

export type CapiUser = {
  email?: string;
  phone?: string;
  /** Full name as typed; split into first and last here. */
  name?: string;
  city?: string;
  /** Two-letter ISO code. India unless told otherwise. */
  country?: string;
  /** The application_id: the same value the browser and the Sheet hold. */
  externalId?: string;
  ip?: string;
  userAgent?: string;
  fbp?: string;
  fbc?: string;
};

export type CapiEvent = {
  event: MetaEvent;
  /** Shared with the browser copy, when there is one, so Meta counts the action once. */
  id: string;
  /** When it happened. Defaults to now. Meta drops website events older than seven days. */
  time?: Date;
  source?: "website" | "system_generated";
  url?: string;
  user: CapiUser;
  custom?: Record<string, string | number>;
};

const sha256 = (v: string) => createHash("sha256").update(v).digest("hex");

/** Meta matches on digits only, country code first. Bare ten-digit numbers are Indian mobiles. */
export function normalisePhone(raw: string) {
  let d = raw.replace(/\D/g, "").replace(/^0+/, "");
  if (d.length === 10) d = `91${d}`;
  return d.length >= 8 ? d : "";
}

/** Lowercase, letters only: "Mary-Ann" → "maryann", "New Delhi" → "newdelhi". */
const letters = (v: string) => v.toLowerCase().normalize("NFKC").replace(/[^\p{L}]/gu, "");

/** The user_data block, hashed where Meta wants it hashed and left plain where it doesn't. */
export function userData(u: CapiUser) {
  const email = (u.email ?? "").trim().toLowerCase();
  const phone = normalisePhone(u.phone ?? "");
  const [first = "", ...rest] = (u.name ?? "").trim().split(/\s+/);
  const fn = letters(first);
  const ln = letters(rest.join(""));
  const ct = letters(u.city ?? "");
  const country = (u.country ?? "in").trim().toLowerCase().slice(0, 2);
  const ext = (u.externalId ?? "").trim();
  return {
    ...(email && { em: [sha256(email)] }),
    ...(phone && { ph: [sha256(phone)] }),
    ...(fn && { fn: [sha256(fn)] }),
    ...(ln && { ln: [sha256(ln)] }),
    ...(ct && { ct: [sha256(ct)] }),
    ...(country && { country: [sha256(country)] }),
    ...(ext && { external_id: [sha256(ext)] }),
    ...(u.ip && { client_ip_address: u.ip }),
    ...(u.userAgent && { client_user_agent: u.userAgent }),
    ...(u.fbp && { fbp: u.fbp }),
    ...(u.fbc && { fbc: u.fbc }),
  };
}

/** The request body Meta receives, built but not sent. The pipeline route's dry run shows it. */
export function capiBody(e: CapiEvent) {
  const testCode = process.env.META_CAPI_TEST_CODE;
  return {
    data: [
      {
        event_name: e.event,
        event_time: Math.floor((e.time ?? new Date()).getTime() / 1000),
        event_id: e.id,
        action_source: e.source ?? "website",
        ...(e.url && { event_source_url: e.url }),
        user_data: userData(e.user),
        ...(e.custom && Object.keys(e.custom).length && { custom_data: e.custom }),
      },
    ],
    ...(testCode && { test_event_code: testCode }),
  };
}

export const capiConfigured = () => Boolean(process.env.META_CAPI_TOKEN);

const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

/**
 * Sends one event. Every outcome is logged with the event name and ID, so the
 * Vercel logs answer "did it go?" for any single action: `[capi] sent` with
 * Meta's events_received and fbtrace_id, or `[capi] FAILED` after the last
 * try. A network error, a timeout, a 429 or a 5xx is tried again, three tries
 * in all; anything else Meta turned down won't change on a retry. Never throws.
 */
export async function sendCapi(e: CapiEvent): Promise<boolean> {
  const token = process.env.META_CAPI_TOKEN;
  if (!token) {
    console.log(`[capi] skipped ${e.event} ${e.id}: META_CAPI_TOKEN not set`);
    return false;
  }
  const body = JSON.stringify(capiBody(e));
  let last = "";
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      const res = await fetch(`${GRAPH_URL}?access_token=${encodeURIComponent(token)}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body,
        signal: AbortSignal.timeout(8000),
      });
      const text = await res.text().catch(() => "");
      if (res.ok) {
        let said: { events_received?: number; fbtrace_id?: string } = {};
        try {
          said = JSON.parse(text);
        } catch {}
        console.log(`[capi] sent ${e.event} ${e.id} events_received=${said.events_received ?? "?"} fbtrace_id=${said.fbtrace_id ?? "?"}${process.env.META_CAPI_TEST_CODE ? " (test code on)" : ""}`);
        return true;
      }
      last = `${res.status} ${text.slice(0, 500)}`;
      if (res.status !== 429 && res.status < 500) break;
    } catch (err) {
      last = String(err);
    }
    if (attempt < 3) await wait(attempt * 500);
  }
  console.error(`[capi] FAILED ${e.event} ${e.id}: ${last}`);
  return false;
}

/** The visitor's IP and browser, as Vercel hands them to a route. */
export function requestClient(request: Request) {
  const h = request.headers;
  return {
    ip: h.get("x-forwarded-for")?.split(",")[0].trim() || h.get("x-real-ip") || undefined,
    userAgent: h.get("user-agent") || undefined,
  };
}

/** One cookie from a Cookie header. */
export const cookieValue = (header: string, name: string) => header.match(new RegExp(`(?:^|;\\s*)${name}=([^;]+)`))?.[1] ?? "";

/**
 * Events from anywhere but the live site (localhost, Vercel previews) stay
 * out of the dataset, unless a test code is set so they land in Test events.
 */
export const liveHost = (host: string | null) => /(^|\.)knnekt\.studio$/.test((host ?? "").split(":")[0]) || Boolean(process.env.META_CAPI_TEST_CODE);
