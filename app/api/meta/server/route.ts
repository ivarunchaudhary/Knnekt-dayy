import { timingSafeEqual } from "node:crypto";
import { NextResponse } from "next/server";
import { capiBody, capiConfigured, sendCapi, type CapiEvent } from "@/lib/capi";
import { PRODUCTS, type Product } from "@/lib/metaEvents";
import { SCORE_HOST } from "@/lib/site";

/**
 * Bearer token check, in constant time. META_EVENTS_SECRET when set, otherwise
 * the EMAIL_API_SECRET Make already sends to /api/email. Without either,
 * nothing is accepted.
 */
function authorised(request: Request): boolean {
  const secret = process.env.META_EVENTS_SECRET || process.env.EMAIL_API_SECRET;
  if (!secret) return false;
  const got = Buffer.from((request.headers.get("authorization") ?? "").replace(/^Bearer\s+/i, ""));
  const want = Buffer.from(secret);
  return got.length === want.length && timingSafeEqual(got, want);
}

const EVENTS = ["QualifiedLead", "Schedule", "Purchase"] as const;
type PipelineEvent = (typeof EVENTS)[number];

const str = (v: unknown, max = 200) => (typeof v === "string" ? v.trim().slice(0, max) : typeof v === "number" ? String(v) : "");

/** An ISO date or Unix seconds (or milliseconds) off the wire. */
function when(v: unknown): Date | null {
  if (v === undefined || v === null || v === "") return new Date();
  const n = typeof v === "number" ? v : /^\d+$/.test(String(v)) ? Number(v) : NaN;
  const d = Number.isFinite(n) ? new Date(n < 1e12 ? n * 1000 : n) : new Date(String(v));
  return Number.isNaN(d.getTime()) ? null : d;
}

const SEVEN_DAYS = 7 * 86400 * 1000;

/**
 * The pipeline events: the ones that happen after the founder has left the
 * score page, so only the server can send them. Make posts here when the lead's
 * row changes, with the details saved on it when page one of the score was
 * submitted (lib/leadRecord.ts):
 *
 *   POST /api/meta/server   Authorization: Bearer <META_EVENTS_SECRET>
 *   {
 *     "event": "QualifiedLead" | "Schedule" | "Purchase",
 *     "application_id": "<Session column>",            required
 *     "email", "phone", "name", "city",                 from the row
 *     "fbp", "fbc", "client_ip", "user_agent",          from the row
 *     "ads_consent": true,                              from the row; nothing is sent unless true
 *     "event_time": "<ISO or Unix>",                    when it happened; defaults to now
 *     "route": "fit",                                   QualifiedLead
 *     "session_date": "2026-11-18",                     Schedule
 *     "payment_id", "content_name", "value"             Purchase; content_name is cohort_deposit or
 *                                                       founders_roadmap, value defaults to its price before GST
 *     "dryRun": true                                    builds the event and shows it, sends nothing
 *   }
 *
 * Event IDs follow the event map: ql_<application_id>, sc_<application_id>,
 * pu_<payment_id>, so a retried call can't count twice. QualifiedLead goes as
 * system_generated; Schedule and Purchase as website events when the row holds
 * the founder's browser, which Meta requires of a website event.
 */
export async function POST(request: Request) {
  if (!authorised(request)) return NextResponse.json({ error: "Unauthorised" }, { status: 401 });

  let b: Record<string, unknown>;
  try {
    b = (await request.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: "Bad JSON" }, { status: 400 });
  }

  const event = str(b.event) as PipelineEvent;
  if (!EVENTS.includes(event)) return NextResponse.json({ error: `event must be one of ${EVENTS.join(", ")}` }, { status: 400 });
  const appId = str(b.application_id, 64);
  if (!appId) return NextResponse.json({ error: "application_id is required (the Session column)" }, { status: 400 });

  const time = when(b.event_time);
  if (!time) return NextResponse.json({ error: "event_time isn't a date" }, { status: 400 });
  if (Date.now() - time.getTime() > SEVEN_DAYS) return NextResponse.json({ error: "event_time is more than 7 days ago; Meta would reject it" }, { status: 400 });
  if (time.getTime() > Date.now() + 60_000) return NextResponse.json({ error: "event_time is in the future" }, { status: 400 });

  const userAgent = str(b.user_agent, 400);
  const custom: Record<string, string | number> = {};
  let id: string;

  if (event === "QualifiedLead") {
    id = `ql_${appId}`;
    custom.route = str(b.route, 40) || "fit";
  } else if (event === "Schedule") {
    id = `sc_${appId}`;
    custom.content_name = "selection_session";
    const date = str(b.session_date, 40);
    if (date) custom.session_date = date;
  } else {
    const paymentId = str(b.payment_id, 100);
    if (!paymentId) return NextResponse.json({ error: "payment_id is required for Purchase" }, { status: 400 });
    const product = str(b.content_name, 40) as Product;
    if (!(product in PRODUCTS)) return NextResponse.json({ error: `content_name must be ${Object.keys(PRODUCTS).join(" or ")}` }, { status: 400 });
    const value = b.value === undefined || b.value === "" ? PRODUCTS[product] : Number(b.value);
    if (!Number.isFinite(value) || value <= 0) return NextResponse.json({ error: "value must be a positive number (before GST)" }, { status: 400 });
    id = `pu_${paymentId}`;
    Object.assign(custom, { content_name: product, value, currency: "INR" });
  }

  const e: CapiEvent = {
    event,
    id,
    time,
    source: event === "QualifiedLead" || !userAgent ? "system_generated" : "website",
    ...(event !== "QualifiedLead" && userAgent && { url: `https://${SCORE_HOST}/` }),
    custom,
    user: {
      email: str(b.email),
      phone: str(b.phone, 40),
      name: str(b.name, 120),
      city: str(b.city, 80),
      externalId: appId,
      ip: str(b.client_ip, 64) || undefined,
      userAgent: userAgent || undefined,
      fbp: str(b.fbp, 200) || undefined,
      fbc: str(b.fbc, 500) || undefined,
    },
  };

  if (b.dryRun === true) return NextResponse.json({ ok: true, dryRun: true, wouldSend: b.ads_consent === true, body: capiBody(e) });
  if (b.ads_consent !== true) {
    return NextResponse.json({ ok: true, sent: false, reason: "ads_consent isn't true on this lead, so Meta isn't told" });
  }
  if (!capiConfigured()) return NextResponse.json({ ok: false, sent: false, reason: "META_CAPI_TOKEN not set" }, { status: 503 });

  const sent = await sendCapi(e);
  return NextResponse.json({ ok: sent, sent, event_id: id }, { status: sent ? 200 : 502 });
}
