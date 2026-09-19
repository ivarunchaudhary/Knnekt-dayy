/**
 * The founder's report as a document: the same content the result page shows,
 * laid out as blocks for the PDF the API route attaches to the founder's email
 * and forwards to the webhook, so both copies are the same document.
 */
import { pdf, toBase64, type Block } from "./pdf";
import { archetypes, gateCopy, next, pillars, responses, verdicts, type Answers, type Identity, type Result } from "./score";

export function reportBlocks(r: Result, id: Identity, answers: Answers): Block[] {
  const v = verdicts[r.route];
  const a = archetypes[r.arch];
  const date = new Date().toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });
  const b: Block[] = [
    { kind: "eyebrow", text: "KNNEKT STUDIOS  ·  STARTUP OPERATING SCORE" },
    { kind: "h1", text: `${r.overall} / 100` },
    { kind: "p", text: `${r.venName}  ·  ${id.name}  ·  ${date}` },
    { kind: "rule" },
    { kind: "h2", text: `Archetype: ${a.name}` },
    { kind: "p", text: a.sub },
    { kind: "h2", text: `${r.confidence.label} (${r.confidence.pct}%)` },
    { kind: "p", text: r.confidence.body },
  ];

  for (const g of r.gates) {
    if (g === "RESOURCING") continue;
    const [name, why] = gateCopy[g];
    b.push({ kind: "h2", text: `${name} — this outweighs your score` }, { kind: "p", text: why });
  }

  b.push({ kind: "h2", text: `Verdict: ${v.band} — ${v.bandSub}` }, { kind: "p", text: v.title }, { kind: "p", text: v.body });

  b.push({ kind: "rule" }, { kind: "h2", text: "Your six pillars (0–100)" });
  pillars.forEach((p, i) => b.push({ kind: "li", text: `${p.name}: ${r.pct[i]}${r.pct[i] < 42 ? "  (constraint)" : ""}` }));

  b.push({ kind: "h2", text: "Where you stand" }, {
    kind: "p",
    text: `Against ${r.benchName} founders: you ${r.overall}  ·  median ${r.bench[0]}  ·  top third ${r.bench[1]}  ·  scale-ready ${r.bench[2]}.`,
  });

  b.push({ kind: "rule" }, { kind: "h2", text: "Your top constraints" });
  for (const c of r.constraints) {
    b.push({ kind: "p", text: `${c.label} — ${c.name}. ${c.why}` });
    b.push({ kind: "small", text: `What it costs you: ${c.cost.join("; ")}.` });
  }

  b.push({ kind: "rule" }, { kind: "h2", text: next.h }, { kind: "p", text: next.intro });
  next.bullets.forEach((t) => b.push({ kind: "li", text: t }));
  b.push({ kind: "small", text: `${next.fine}. ${next.note(r.route)}` });

  b.push({ kind: "gap", size: 18 }, { kind: "rule" }, { kind: "h2", text: "Exactly what you told us" }, {
    kind: "small",
    text: "Every question you were asked, in the order you answered it.",
  });
  let section = "";
  for (const row of responses(answers, r.catOther, id)) {
    if (row.section !== section) {
      section = row.section;
      b.push({ kind: "eyebrow", text: section.toUpperCase() });
    }
    b.push({ kind: "p", text: row.question }, { kind: "small", text: row.answer }, { kind: "gap", size: 2 });
  }
  return b;
}

export const reportFilename = (r: Result) => `startup-operating-score-${r.venName.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") || "report"}.pdf`;

function reportPdf(r: Result, id: Identity, answers: Answers): Uint8Array<ArrayBuffer> {
  return pdf(reportBlocks(r, id, answers), "Startup Operating Score");
}

export function reportPdfBase64(r: Result, id: Identity, answers: Answers): string {
  return toBase64(reportPdf(r, id, answers));
}
