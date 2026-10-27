import { NextResponse } from "next/server";
import { answered, cleanAnswers, cleanScholarship, grade, payload, type Identity } from "@/lib/score";
import { sendMail } from "@/lib/mailer";
import { reportEmailHtml, reportEmailText, reportSubject } from "@/lib/scoreEmail";
import { reportFilename, reportPdfBase64 } from "@/lib/scoreReport";
import { forwardToSheet } from "@/lib/scoreWebhook";

const looksLikeEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v);
const looksLikePhone = (v: string) => v.replace(/\D/g, "").length >= 8;

type Body = { identity?: Partial<Identity>; answers?: unknown; catOther?: unknown; session?: unknown };

/**
 * A finished score. Re-graded here from the raw answers so the number the
 * founder saw and the number we send can't drift apart, then emailed to them
 * from hello@knnekt.studio — a short letter in the body, the full report as
 * the attached PDF, with the studio copied — and forwarded to the webhook that
 * files the lead. The PDF comes back in the response too, so the result screen
 * can offer it for download. The studio calls from there; nothing is booked.
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
    waConsent: body.identity?.waConsent === true,
    scholarship: cleanScholarship(body.identity?.scholarship),
  };
  if (id.name.length < 2 || !looksLikeEmail(id.email) || !looksLikePhone(id.phone)) {
    return NextResponse.json({ error: "Name, email and phone are required" }, { status: 400 });
  }

  const catOther = typeof body.catOther === "string" ? body.catOther.slice(0, 80) : "";
  const clean = cleanAnswers(body.answers);
  if (!clean) return NextResponse.json({ error: "Answers don't match the instrument" }, { status: 400 });
  const missing = clean.map((_, i) => i).filter((i) => !answered(i, clean, catOther));
  if (missing.length) return NextResponse.json({ error: "Unanswered questions", missing }, { status: 400 });

  const result = grade(clean, catOther);
  const filename = reportFilename(result);
  let pdf = "";
  try {
    pdf = await reportPdfBase64(result, id);
  } catch (err) {
    // The report is the promise, but a rendering failure must not cost us the lead.
    console.error("[score] report PDF failed", err);
  }

  // The founder's copy. Everything else here is bookkeeping; this is the promise.
  const mail = await sendMail({
    to: id.email,
    subject: reportSubject(result),
    html: reportEmailHtml(result, id),
    text: reportEmailText(result, id),
    ...(pdf ? { attachment: { filename, base64: pdf } } : {}),
  });
  if (!mail.sent) {
    const how = mail.reason === "unconfigured" ? "RESEND_API_KEY not set" : mail.error;
    console.error("[score] report email not sent", { email: id.email, overall: result.overall, reason: mail.reason, how });
  }

  // The lead, filed in the Sheet. The session lets the Sheet clear this
  // founder's row from the half-filled tab now that they've finished.
  const session = typeof body.session === "string" ? body.session.slice(0, 64) : "";
  const data = { ...payload(result, id, clean, "result"), session_id: session, report_pdf_filename: filename, report_pdf_base64: pdf, emailed: mail.sent };
  const forwarded = await forwardToSheet(data, "score");

  return NextResponse.json({ ok: true, emailed: mail.sent, forwarded, pdf: pdf ? { filename, base64: pdf } : null });
}
