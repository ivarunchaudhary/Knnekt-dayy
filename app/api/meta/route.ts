import { createHash } from "node:crypto";
import { NextResponse } from "next/server";
import { parseConsent } from "@/lib/consent";
import { PIXEL_ID, SERVER_EVENTS, type ServerEvent } from "@/lib/metaEvents";

const GRAPH_URL = `https://graph.facebook.com/v26.0/${PIXEL_ID}/events`;

type Body = {
  event?: unknown;
  id?: unknown;
  url?: unknown;
  params?: unknown;
  user?: { email?: unknown; phone?: unknown; name?: unknown };
};

const sha256 = (v: string) => createHash("sha256").update(v).digest("hex");
const str = (v: unknown, max = 200) => (typeof v === "string" ? v.trim().slice(0, max) : "");

/** Meta matches on digits only, country code first. Bare ten-digit numbers are Indian mobiles. */
function normalisePhone(raw: string) {
  let d = raw.replace(/\D/g, "");
  if (d.length === 11 && d.startsWith("0")) d = d.slice(1);
  if (d.length === 10) d = `91${d}`;
  return d.length >= 8 ? d : "";
}

const cookie = (header: string, name: string) => header.match(new RegExp(`(?:^|;\\s*)${name}=([^;]+)`))?.[1] ?? "";

/**
 * The server half of every pixel event (Conversions API). The browser fires
 * each event through the pixel and posts the same one here with the same
 * event ID, so Meta counts it once and still gets it when an ad blocker or
 * Safari's tracking protection eats the browser copy. Whatever the founder
 * has told us — email, phone, name — goes along hashed, which is what lets
 * Meta tie the event to a person. Without META_CAPI_TOKEN this is a no-op,
 * and so it is for anyone who hasn't allowed advertising cookies: the browser
 * doesn't post without that consent, and the saved choice is checked here too.
 */
export async function POST(request: Request) {
  const token = process.env.META_CAPI_TOKEN;
  if (!token) return new NextResponse(null, { status: 204 });

  // Only our own pages post here.
  const origin = request.headers.get("origin");
  const host = request.headers.get("host");
  if (!origin || !host || new URL(origin).host !== host) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const cookies = request.headers.get("cookie") ?? "";
  if (!parseConsent(cookies)?.ads) return new NextResponse(null, { status: 204 });

  const text = await request.text();
  if (text.length > 4000) return NextResponse.json({ error: "Too large" }, { status: 413 });
  let body: Body;
  try {
    body = JSON.parse(text) as Body;
  } catch {
    return NextResponse.json({ error: "Bad JSON" }, { status: 400 });
  }

  const event = str(body.event) as ServerEvent;
  const id = str(body.id, 100);
  if (!SERVER_EVENTS.includes(event) || !id) return NextResponse.json({ error: "Unknown event" }, { status: 400 });

  let url = "";
  try {
    const u = new URL(str(body.url, 1000));
    if (u.host === host) url = u.href;
  } catch {}

  const custom: Record<string, string | number> = {};
  if (body.params && typeof body.params === "object") {
    for (const [k, v] of Object.entries(body.params).slice(0, 10)) {
      if (typeof v === "number" && Number.isFinite(v)) custom[k] = v;
      else if (typeof v === "string") custom[k] = v.slice(0, 100);
    }
  }

  const fbclid = url ? new URL(url).searchParams.get("fbclid") : null;
  const fbc = cookie(cookies, "_fbc") || (fbclid ? `fb.1.${Date.now()}.${fbclid}` : "");
  const fbp = cookie(cookies, "_fbp");

  const email = str(body.user?.email).toLowerCase();
  const phone = normalisePhone(str(body.user?.phone));
  const [first = "", ...rest] = str(body.user?.name).toLowerCase().split(/\s+/);
  const last = rest.join(" ");

  const userData: Record<string, unknown> = {
    client_ip_address: request.headers.get("x-forwarded-for")?.split(",")[0].trim() || request.headers.get("x-real-ip") || undefined,
    client_user_agent: request.headers.get("user-agent") || undefined,
    ...(fbp && { fbp }),
    ...(fbc && { fbc }),
    ...(email && { em: [sha256(email)] }),
    ...(phone && { ph: [sha256(phone)] }),
    ...(first && { fn: [sha256(first)] }),
    ...(last && { ln: [sha256(last)] }),
  };

  const testCode = process.env.META_CAPI_TEST_CODE;
  const res = await fetch(`${GRAPH_URL}?access_token=${encodeURIComponent(token)}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      data: [
        {
          event_name: event,
          event_time: Math.floor(Date.now() / 1000),
          event_id: id,
          action_source: "website",
          ...(url && { event_source_url: url }),
          user_data: userData,
          ...(Object.keys(custom).length && { custom_data: custom }),
        },
      ],
      ...(testCode && { test_event_code: testCode }),
    }),
  }).catch((err: unknown) => {
    console.error("Meta CAPI: request failed", err);
    return null;
  });

  if (res && !res.ok) console.error("Meta CAPI:", res.status, await res.text());
  return new NextResponse(null, { status: 204 });
}
