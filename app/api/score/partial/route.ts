import { NextResponse } from "next/server";
import { CONFIG, cleanAnswers, cleanScholarship, questions, responses, scholarshipData, started, stepLabel } from "@/lib/score";
import { forwardToSheet } from "@/lib/scoreWebhook";

type Body = { session?: unknown; identity?: { name?: unknown; email?: unknown; phone?: unknown; waConsent?: unknown; scholarship?: unknown }; answers?: unknown; catOther?: unknown; page?: unknown };

const field = (v: unknown, max: number) => (typeof v === "string" ? v.trim().slice(0, max) : "");

/**
 * A score left half-way. The quiz sends whatever the founder has filled in so
 * far each time they move to the next page, and once more as they leave (tab
 * closed, dialog shut, page hidden) — usually as a beacon, so nothing waits on
 * the answer. The Sheet keeps one row per session in its "Half filled" tab,
 * overwritten as they get further, and drops it once they finish.
 */
export async function POST(request: Request) {
  let body: Body;
  try {
    body = (await request.json()) as Body;
  } catch {
    return NextResponse.json({ error: "Bad JSON" }, { status: 400 });
  }

  // The quiz's own session ID (a UUID, or a timestamp and random fallback); the Sheet finds rows by it.
  const session = field(body.session, 64);
  if (!/^[a-z0-9][a-z0-9-]{7,63}$/i.test(session)) return NextResponse.json({ error: "No session" }, { status: 400 });
  const answers = cleanAnswers(body.answers);
  if (!answers) return NextResponse.json({ error: "Answers don't match the instrument" }, { status: 400 });
  const catOther = field(body.catOther, 80);
  const page = typeof body.page === "number" && Number.isInteger(body.page) ? body.page : -1;

  const name = field(body.identity?.name, 120);
  const email = field(body.identity?.email, 200).toLowerCase();
  const phone = field(body.identity?.phone, 40);
  const filled = questions.map((_, i) => i).filter((i) => started(i, answers));
  if (!name && !email && !phone && !filled.length) return new NextResponse(null, { status: 204 });

  // Only what they actually touched, headed by the same question text the
  // Submissions tab uses, so the two tabs line up column for column.
  const all = responses(answers, catOther);
  const forwarded = await forwardToSheet(
    {
      event: "partial",
      instrument_version: CONFIG.INSTRUMENT_VERSION,
      session_id: session,
      updated_at: new Date().toISOString(),
      name,
      email,
      phone,
      whatsapp_consent: body.identity?.waConsent === true,
      ...scholarshipData(cleanScholarship(body.identity?.scholarship)),
      stopped_at: stepLabel(page),
      answered: `${filled.length} of ${questions.length}`,
      responses: filled.map((i) => all[i]),
    },
    "score-partial",
  );
  return NextResponse.json({ ok: true, forwarded });
}
