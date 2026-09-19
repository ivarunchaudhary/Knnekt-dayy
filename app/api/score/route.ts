import { NextResponse } from "next/server";
import { answered, grade, payload, questions, type Answers, type Identity } from "@/lib/score";
import { sendMail } from "@/lib/mailer";
import { reportEmailHtml, reportEmailText, reportSubject } from "@/lib/scoreEmail";
import { reportFilename, reportPdfBase64 } from "@/lib/scoreReport";

const looksLikeEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v);
const looksLikePhone = (v: string) => v.replace(/\D/g, "").length >= 8;

type Body = { identity?: Partial<Identity>; answers?: unknown; catOther?: unknown };
/** What the webhook answers with. See the note where it is read. */
type Reply = { ok?: boolean; message?: string } | null;

/**
 * A finished score. Re-graded here from the raw answers so the number the
 * founder saw and the number we send can't drift apart, then emailed to them
 * from hello@knnekt.studio — the short readout in the body, every answer in the
 * attached PDF — and forwarded to the webhook that files the lead. The studio
 * calls from there; nothing is booked.
 */
export async function POST(request: Request) {
  let body: Body;
  try {
    body = (await request.json()) as Body;
  } catch {
    return NextResponse.json({ error: "Bad JSON" }, { status: 400 });
  }

  const id: Identity = {
    name: String(body.identity?.name ?? "").trim(),
    email: String(body.identity?.email ?? "").trim().toLowerCase(),
    phone: String(body.identity?.phone ?? "").trim(),
    optin: Boolean(body.identity?.optin),
  };
  if (id.name.length < 2 || !looksLikeEmail(id.email) || !looksLikePhone(id.phone)) {
    return NextResponse.json({ error: "Name, email and phone are required" }, { status: 400 });
  }

  const answers = body.answers;
  const catOther = typeof body.catOther === "string" ? body.catOther.slice(0, 80) : "";
  if (!Array.isArray(answers) || answers.length !== questions.length) {
    return NextResponse.json({ error: "Answers don't match the instrument" }, { status: 400 });
  }
  const clean = answers.map((a, i): Answers[number] => {
    const q = questions[i];
    if (q.kind === "single") return typeof a === "number" && Number.isInteger(a) && a >= 0 && a < q.options.length ? a : null;
    if (q.kind === "multi") return Array.isArray(a) ? a.filter((n): n is number => typeof n === "number" && Number.isInteger(n) && n >= 0 && n < q.options.length) : [];
    return typeof a === "string" ? a.slice(0, q.max) : null;
  });
  const missing = clean.map((_, i) => i).filter((i) => !answered(i, clean, catOther));
  if (missing.length) return NextResponse.json({ error: "Unanswered questions", missing }, { status: 400 });

  const result = grade(clean, catOther);
  const filename = reportFilename(result);
  const pdf = reportPdfBase64(result, id, clean);

  // The founder's copy. Everything else here is bookkeeping; this is the promise.
  const mail = await sendMail({
    to: id.email,
    subject: reportSubject(result),
    html: reportEmailHtml(result, id, filename),
    text: reportEmailText(result, id, filename),
    attachment: { filename, base64: pdf },
  });
  if (!mail.sent) {
    const how = mail.reason === "unconfigured" ? "RESEND_API_KEY not set" : mail.error;
    console.error("[score] report email not sent", { email: id.email, overall: result.overall, reason: mail.reason, how });
  }

  // The lead, forwarded wherever the studio files it. A failure here must not
  // cost us the submission, so it's logged and reported, never thrown.
  let forwarded = false;
  const url = process.env.SCORE_WEBHOOK_URL;
  if (url) {
    try {
      const data = { ...payload(result, id, clean, "result"), report_pdf_filename: filename, report_pdf_base64: pdf, emailed: mail.sent };
      const res = await fetch(url, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
      const text = await res.text().catch(() => "");
      if (!res.ok) throw new Error(`Webhook responded ${res.status}: ${text.slice(0, 300)}`);
      // A Google Apps Script web app always answers 200 — the platform gives it
      // no way to set a status code. So the status tells us nothing and the body
      // is the only place a rejected token or a thrown error can show up.
      let said: Reply = null;
      try {
        said = JSON.parse(text.trim() || "null") as Reply;
      } catch {
        // Not JSON: almost always Google's sign-in page, i.e. the web app isn't
        // deployed with "Who has access: Anyone".
        throw new Error(`Webhook answered with ${text.slice(0, 200)}`);
      }
      if (said && said.ok === false) throw new Error(`Webhook refused: ${said.message}`);
      forwarded = true;
    } catch (err) {
      console.error("[score] webhook failed", err);
    }
  } else {
    console.log("[score] SCORE_WEBHOOK_URL not set; submission not forwarded", { email: id.email, overall: result.overall, route: result.route });
  }

  return NextResponse.json({ ok: true, emailed: mail.sent, forwarded });
}
