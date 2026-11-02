import { timingSafeEqual } from "node:crypto";
import { NextResponse } from "next/server";
import { checkVars, render, templates } from "@/lib/cohortEmails";
import { sendMail } from "@/lib/mailer";

const looksLikeEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v);

/** Bearer token check, in constant time. Without EMAIL_API_SECRET set, nothing is accepted. */
function authorised(request: Request): boolean {
  const secret = process.env.EMAIL_API_SECRET;
  if (!secret) return false;
  const got = Buffer.from((request.headers.get("authorization") ?? "").replace(/^Bearer\s+/i, ""));
  const want = Buffer.from(secret);
  return got.length === want.length && timingSafeEqual(got, want);
}

type Body = { code?: unknown; to?: unknown; vars?: unknown; dryRun?: unknown };

/**
 * One pipeline email, sent for Make. Make decides when (the founder's stage,
 * the send log in "Messages sent"); this route decides what: the template for
 * `code`, filled from `vars`, sent from hello@knnekt.studio with the studio
 * copied. `dryRun: true` renders without sending, for testing a scenario.
 *
 * Answers 200 when sent (or rendered), 400 when a value is wrong, 409 when the
 * email's attachment isn't available yet, 502 when Resend refused it. Make
 * should only add the code to "Messages sent" on a 200 with `sent: true`.
 */
export async function POST(request: Request) {
  if (!authorised(request)) return NextResponse.json({ error: "Unauthorised" }, { status: 401 });

  let body: Body;
  try {
    body = (await request.json()) as Body;
  } catch {
    return NextResponse.json({ error: "Bad JSON" }, { status: 400 });
  }

  const code = typeof body.code === "string" ? body.code.trim().toUpperCase() : "";
  const t = templates[code];
  if (!t) return NextResponse.json({ error: `Unknown code "${code}"`, codes: Object.keys(templates) }, { status: 400 });

  const to = typeof body.to === "string" ? body.to.trim().toLowerCase() : "";
  if (!looksLikeEmail(to)) return NextResponse.json({ error: "to is not an email address" }, { status: 400 });

  const checked = checkVars(t, body.vars);
  if (!checked.ok) return NextResponse.json({ error: "Missing or malformed values", problems: checked.problems }, { status: 400 });

  const mail = render(t, checked.vars);
  const attachment = t.attachment ? await t.attachment(checked.vars, to) : null;
  if (typeof attachment === "string") {
    console.error(`[email] ${code} attachment unavailable`, attachment);
    return NextResponse.json({ error: `${code} attachment unavailable`, detail: attachment }, { status: 409 });
  }

  if (body.dryRun === true) {
    return NextResponse.json({ ok: true, sent: false, dryRun: true, code, to, ...mail, attachment: attachment ? attachment.filename : null });
  }

  const result = await sendMail({ to, ...mail, ...(attachment ? { attachment } : {}) });
  if (!result.sent) {
    const how = result.reason === "unconfigured" ? "RESEND_API_KEY not set" : result.error;
    console.error(`[email] ${code} not sent`, { to, reason: result.reason, how });
    return NextResponse.json({ ok: false, sent: false, code, error: how }, { status: 502 });
  }
  return NextResponse.json({ ok: true, sent: true, code, id: result.id });
}
