import { NextResponse } from "next/server";
import { parseConsent } from "@/lib/consent";
import { cookieValue, liveHost, requestClient, sendCapi } from "@/lib/capi";
import { BROWSER_RELAYED, type RelayedEvent } from "@/lib/metaEvents";

type Body = {
  event?: unknown;
  id?: unknown;
  url?: unknown;
  params?: unknown;
  fbp?: unknown;
  fbc?: unknown;
  user?: { email?: unknown; phone?: unknown; name?: unknown; city?: unknown; appId?: unknown };
};

const str = (v: unknown, max = 200) => (typeof v === "string" ? v.trim().slice(0, max) : "");

/**
 * The server half of the browser's pixel events (Conversions API). The browser
 * fires each event through the pixel and posts the same one here with the same
 * event ID, so Meta counts it once and still gets it when an ad blocker or
 * Safari's tracking protection eats the browser copy. Whatever the founder
 * has told us — email, phone, name, city, their application_id — goes along
 * hashed (lib/capi.ts), which is what lets Meta tie the event to a person.
 * Without META_CAPI_TOKEN this is a no-op, and so it is for anyone who hasn't
 * allowed advertising cookies: the browser doesn't post without that consent,
 * and the saved choice is checked here too.
 */
export async function POST(request: Request) {
  // Only our own pages post here.
  const origin = request.headers.get("origin");
  const host = request.headers.get("host");
  if (!origin || !host || new URL(origin).host !== host) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  if (!liveHost(host)) return new NextResponse(null, { status: 204 });

  const cookies = request.headers.get("cookie") ?? "";
  if (!parseConsent(cookies)?.ads) return new NextResponse(null, { status: 204 });

  const text = await request.text();
  if (text.length > 6000) return NextResponse.json({ error: "Too large" }, { status: 413 });
  let body: Body;
  try {
    body = JSON.parse(text) as Body;
  } catch {
    return NextResponse.json({ error: "Bad JSON" }, { status: 400 });
  }

  const event = str(body.event) as RelayedEvent;
  const id = str(body.id, 100);
  if (!BROWSER_RELAYED.includes(event) || !id) return NextResponse.json({ error: "Unknown event" }, { status: 400 });

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

  // The cookies are the truth; what the page read from them (or built from the
  // landing's fbclid) fills in when they didn't come along.
  const fbclid = url ? new URL(url).searchParams.get("fbclid") : null;
  const fbc = cookieValue(cookies, "_fbc") || str(body.fbc, 500) || (fbclid ? `fb.1.${Date.now()}.${fbclid}` : "");
  const fbp = cookieValue(cookies, "_fbp") || str(body.fbp, 200);

  await sendCapi({
    event,
    id,
    url: url || undefined,
    custom,
    user: {
      ...requestClient(request),
      email: str(body.user?.email),
      phone: str(body.user?.phone),
      name: str(body.user?.name),
      city: str(body.user?.city, 80),
      externalId: str(body.user?.appId, 64),
      fbp,
      fbc,
    },
  });
  return new NextResponse(null, { status: 204 });
}
