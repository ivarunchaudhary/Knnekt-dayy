/**
 * The founder's report as an email: the short version of what the result page
 * shows — score, archetype, verdict, the six pillars and the constraints.
 * The full report, with the path forward, is the attached PDF, so the email
 * stays readable on a phone. Tables and inline styles throughout: this has to survive Gmail.
 *
 * The palette is the site's, from `app/globals.css` — one hue, the studio blue
 * #3B81E3, taken down to the near-black navy the figures in the hero wear. The
 * mail is framed the way the page is: a navy head and foot with the light
 * picture between them, rather than black text on white.
 */
import { archetypes, gateCopy, next, pillars, verdicts, type Identity, type Result } from "./score";

const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

/** The site's tokens. Spelt out: an email has no custom properties. */
const INK = "#16253f";
const INK_LINE = "#2c3e5e"; // the navy lifted one step, for rules and tracks on it
const MUTED = "#5b6c86";
const BRAND = "#3b81e3";
const DEEP = "#2d6fae";
const SOFT = "#b9d8f9";
const PANEL = "#a8cef4";
const LINE = "#d3e3f6";
const HORIZON = "#e9f1fb";
const FONT = "'Helvetica Neue',Helvetica,Arial,sans-serif";

export const reportSubject = (r: Result) => `${r.venName}: ${r.overall}/100 on the Startup Operating Score`;

/** An uppercase section label with a hairline under it. */
const label = (t: string, on = LINE) =>
  `<p style="margin:0 0 12px;padding:0 0 10px;border-bottom:1px solid ${on};font:700 10px/1.2 ${FONT};letter-spacing:.14em;text-transform:uppercase;color:${MUTED};">${esc(t)}</p>`;

/** A two-cell bar that needs no images. Square in Outlook, round everywhere else. */
function track(pct: number, fill: string, bg: string, h = 8): string {
  const l = Math.max(0, Math.min(100, Math.round(pct)));
  return `<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="border-collapse:collapse;"><tr>
    ${l > 0 ? `<td width="${l}%" height="${h}" style="background:${fill};border-radius:${h}px 0 0 ${h}px;font-size:0;line-height:0;">&nbsp;</td>` : ""}
    ${l < 100 ? `<td width="${100 - l}%" height="${h}" style="background:${bg};border-radius:0 ${h}px ${h}px 0;font-size:0;line-height:0;">&nbsp;</td>` : ""}
  </tr></table>`;
}

/** A pillar row: name, bar, number. Constraints carry the ink, not the blue. */
function pillarRow(name: string, pct: number): string {
  const weak = pct < 42;
  return `<tr>
    <td style="padding:9px 0 3px;font:500 13px/1.3 ${FONT};color:${INK};">${esc(name)}${weak ? `<span style="display:inline-block;margin-left:8px;padding:2px 6px;border-radius:4px;background:${HORIZON};font:700 9px/1.4 ${FONT};letter-spacing:.1em;text-transform:uppercase;color:${DEEP};">constraint</span>` : ""}</td>
    <td width="40" align="right" style="padding:9px 0 3px;font:700 14px/1.3 ${FONT};color:${weak ? INK : BRAND};">${pct}</td>
  </tr>
  <tr><td colspan="2" style="padding:0 0 5px;">${track(pct, weak ? INK : BRAND, LINE, 8)}</td></tr>`;
}

/** One of the three benchmark figures under the hero score. */
const stat = (n: number, t: string) =>
  `<td width="33%" align="center" style="padding:0 4px;">
    <p style="margin:0;font:700 19px/1.2 ${FONT};color:#ffffff;">${n}</p>
    <p style="margin:4px 0 0;font:500 9px/1.2 ${FONT};letter-spacing:.12em;text-transform:uppercase;color:${SOFT};">${esc(t)}</p>
  </td>`;

export function reportEmailHtml(r: Result, id: Identity, pdfName: string): string {
  const v = verdicts[r.route];
  const a = archetypes[r.arch];


  const gateCards = r.gates
    .filter((g): g is Exclude<typeof g, "RESOURCING"> => g !== "RESOURCING")
    .map((g) => {
      const [name, why] = gateCopy[g];
      return `<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="border-collapse:collapse;margin:0 0 10px;background:${HORIZON};border-radius:10px;">
        <tr>
          <td width="4" style="background:${DEEP};border-radius:10px 0 0 10px;font-size:0;line-height:0;">&nbsp;</td>
          <td style="padding:13px 16px;">
            <p style="margin:0;font:700 10px/1.2 ${FONT};letter-spacing:.12em;text-transform:uppercase;color:${DEEP};">${esc(name)} &middot; this outweighs your score</p>
            <p style="margin:6px 0 0;font:400 13px/1.5 ${FONT};color:${INK};">${esc(why)}</p>
          </td>
        </tr>
      </table>`;
    })
    .join("");

  const constraints = r.constraints
    .map(
      (c, i) => `<tr>
        <td width="30" valign="top" style="padding:14px 0 0;">
          <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;"><tr>
            <td width="22" height="22" align="center" valign="middle" style="width:22px;height:22px;background:${BRAND};border-radius:11px;font:700 11px/22px ${FONT};color:#ffffff;">${i + 1}</td>
          </tr></table>
        </td>
        <td valign="top" style="padding:12px 0 14px;${i ? `border-top:1px solid ${LINE};` : ""}">
          <p style="margin:0;font:700 9px/1.2 ${FONT};letter-spacing:.12em;text-transform:uppercase;color:${MUTED};">${esc(c.label)}</p>
          <p style="margin:5px 0 0;font:600 15px/1.3 ${FONT};color:${INK};">${esc(c.name)}</p>
          <p style="margin:5px 0 0;font:400 13px/1.5 ${FONT};color:${MUTED};">${esc(c.why)}</p>
        </td>
      </tr>`,
    )
    .join("");

  const bullets = next.bullets
    .map(
      (b) => `<tr>
        <td width="18" valign="top" style="padding:0 0 9px;font:700 13px/1.5 ${FONT};color:${SOFT};">&#8250;</td>
        <td valign="top" style="padding:0 0 9px;font:400 13px/1.5 ${FONT};color:#ffffff;">${esc(b)}</td>
      </tr>`,
    )
    .join("");

  return `<!doctype html>
<html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="color-scheme" content="light only"><meta name="supported-color-schemes" content="light only"><title>${esc(reportSubject(r))}</title></head>
<body style="margin:0;padding:0;background:${HORIZON};-webkit-font-smoothing:antialiased;">
<div style="display:none;max-height:0;overflow:hidden;opacity:0;">${r.overall}/100 &middot; ${esc(a.name)}. Your full Startup Operating Score report is attached.&#8199;&#8199;&#8199;&#8199;&#8199;&#8199;&#8199;&#8199;&#8199;&#8199;</div>
<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="border-collapse:collapse;background:${HORIZON};"><tr><td align="center" style="padding:28px 12px 36px;">
<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="600" style="width:600px;max-width:100%;border-collapse:separate;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 1px 3px rgba(22,37,63,.08);">

  <!-- masthead -->
  <tr><td style="background:${INK};padding:20px 30px 0;">
    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="border-collapse:collapse;"><tr>
      <td style="font:700 12px/1.2 ${FONT};letter-spacing:.2em;text-transform:uppercase;color:#ffffff;">KNNEKT<span style="color:${BRAND};">&nbsp;Studios</span></td>
      <td align="right" style="font:500 10px/1.2 ${FONT};letter-spacing:.12em;text-transform:uppercase;color:${SOFT};">Startup Operating Score</td>
    </tr></table>
  </td></tr>

  <!-- the score -->
  <tr><td style="background:${INK};padding:26px 30px 28px;">
    <p style="margin:0;font:400 13px/1.4 ${FONT};color:${SOFT};">${esc(r.venName)} &middot; ${esc(id.name)}</p>
    <p style="margin:6px 0 0;">
      <span style="font:700 62px/1 ${FONT};color:#ffffff;letter-spacing:-.02em;">${r.overall}</span>
      <span style="font:500 16px/1 ${FONT};color:${SOFT};">&nbsp;/ 100</span>
    </p>
    <div style="margin:18px 0 0;">${track(r.overall, BRAND, INK_LINE, 10)}</div>
    <p style="margin:16px 0 10px;font:500 9px/1.2 ${FONT};letter-spacing:.12em;text-transform:uppercase;color:${SOFT};">Against ${esc(r.benchName)} founders</p>
    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="border-collapse:collapse;border-top:1px solid ${INK_LINE};">
      <tr>${stat(r.bench[0], "Median")}${stat(r.bench[1], "Top third")}${stat(r.bench[2], "Scale-ready")}</tr>
    </table>
  </td></tr>

  <tr><td style="background:${BRAND};height:3px;font-size:0;line-height:0;">&nbsp;</td></tr>

  <!-- verdict -->
  <tr><td style="padding:28px 30px 0;">
    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="border-collapse:collapse;background:${HORIZON};border-radius:12px;">
      <tr><td style="padding:18px 20px;">
        <p style="margin:0;font:700 10px/1.2 ${FONT};letter-spacing:.12em;text-transform:uppercase;color:${DEEP};">${esc(v.band)} &middot; ${esc(v.bandSub)}</p>
        <p style="margin:9px 0 0;font:600 18px/1.3 ${FONT};color:${INK};">${esc(v.title)}</p>
        <p style="margin:9px 0 0;font:400 13px/1.55 ${FONT};color:${INK};">${esc(v.body)}</p>
      </td></tr>
    </table>
  </td></tr>

  ${gateCards ? `<tr><td style="padding:14px 30px 0;">${gateCards}</td></tr>` : ""}

  <!-- archetype + confidence -->
  <tr><td style="padding:30px 30px 0;">
    ${label("Your archetype")}
    <p style="margin:0;font:600 17px/1.3 ${FONT};color:${INK};">${esc(a.name)}</p>
    <p style="margin:7px 0 0;font:400 13px/1.55 ${FONT};color:${MUTED};">${esc(a.sub)}</p>
    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="border-collapse:collapse;margin:18px 0 0;background:#ffffff;border:1px solid ${LINE};border-radius:10px;">
      <tr><td style="padding:14px 16px;">
        <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="border-collapse:collapse;"><tr>
          <td style="font:600 13px/1.3 ${FONT};color:${INK};">${esc(r.confidence.label)}</td>
          <td align="right" style="font:700 13px/1.3 ${FONT};color:${BRAND};">${r.confidence.pct}%</td>
        </tr></table>
        <div style="margin:9px 0 0;">${track(r.confidence.pct, BRAND, LINE, 6)}</div>
        <p style="margin:10px 0 0;font:400 12px/1.5 ${FONT};color:${MUTED};">${esc(r.confidence.body)}</p>
      </td></tr>
    </table>
  </td></tr>

  <!-- pillars -->
  <tr><td style="padding:30px 30px 0;">
    ${label("Your six pillars · 0–100")}
    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="border-collapse:collapse;">
      ${pillars.map((p, i) => pillarRow(p.name, r.pct[i])).join("")}
    </table>
  </td></tr>

  <!-- constraints -->
  <tr><td style="padding:30px 30px 0;">
    ${label("Your top constraints")}
    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="border-collapse:collapse;">${constraints}</table>
  </td></tr>

  <!-- the attachment -->
  <tr><td style="padding:26px 30px 0;">
    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="border-collapse:collapse;border:1px solid ${PANEL};border-radius:10px;background:#ffffff;">
      <tr>
        <td width="62" align="center" valign="middle" style="padding:16px 0 16px 16px;">
          <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;"><tr>
            <td width="44" height="44" align="center" valign="middle" style="width:44px;height:44px;background:${INK};border-radius:8px;font:700 10px/44px ${FONT};letter-spacing:.06em;color:#ffffff;">PDF</td>
          </tr></table>
        </td>
        <td valign="middle" style="padding:16px;">
          <p style="margin:0;font:600 13px/1.35 ${FONT};color:${INK};">${esc(pdfName)}</p>
          <p style="margin:4px 0 0;font:400 12px/1.5 ${FONT};color:${MUTED};">Attached to this email &mdash; your full report: the diagnosis, what&rsquo;s left before launch, and your next three months.</p>
        </td>
      </tr>
    </table>
  </td></tr>

  <!-- what happens next -->
  <tr><td style="padding:26px 30px 32px;">
    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="border-collapse:collapse;background:${INK};border-radius:12px;">
      <tr><td style="padding:22px 24px;">
        <p style="margin:0;font:600 17px/1.3 ${FONT};color:#ffffff;">${esc(next.h)}</p>
        <p style="margin:8px 0 16px;font:400 13px/1.55 ${FONT};color:${SOFT};">${esc(next.intro)}</p>
        <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="border-collapse:collapse;">${bullets}</table>
        <p style="margin:18px 0 0;padding:14px 0 0;border-top:1px solid ${INK_LINE};font:700 9px/1.4 ${FONT};letter-spacing:.12em;text-transform:uppercase;color:${BRAND};">${esc(next.fine)}</p>
        <p style="margin:8px 0 0;font:400 12px/1.5 ${FONT};color:${SOFT};">${esc(next.note(r.route))}</p>
      </td></tr>
    </table>
  </td></tr>

  <!-- foot -->
  <tr><td style="background:${HORIZON};padding:22px 30px;border-top:1px solid ${LINE};">
    <p style="margin:0;font:400 11px/1.6 ${FONT};color:${MUTED};">
      Sent to ${esc(id.email)} because you completed the Startup Operating Score.<br>
      Questions, or something looks off? Just reply &mdash; it reaches us at <span style="color:${INK};">hello@knnekt.studio</span>.
    </p>
  </td></tr>

</table>
</td></tr></table>
</body></html>`;
}

/** The same thing as plain text, for clients that won't render HTML. */
export function reportEmailText(r: Result, id: Identity, pdfName: string): string {
  const v = verdicts[r.route];
  const a = archetypes[r.arch];
  const lines: string[] = [
    "KNNEKT STUDIOS - STARTUP OPERATING SCORE",
    "",
    `${r.overall} / 100`,
    `${r.venName} - ${id.name}`,
    "",
    `Archetype: ${a.name}`,
    a.sub,
    "",
    `${r.confidence.label} (${r.confidence.pct}%)`,
    r.confidence.body,
    "",
  ];
  for (const g of r.gates) {
    if (g === "RESOURCING") continue;
    const [name, why] = gateCopy[g];
    lines.push(`${name} - this outweighs your score`, why, "");
  }
  lines.push(`Verdict: ${v.band} - ${v.bandSub}`, v.title, v.body, "", "YOUR SIX PILLARS (0-100)");
  pillars.forEach((p, i) => lines.push(`- ${p.name}: ${r.pct[i]}${r.pct[i] < 42 ? " (constraint)" : ""}`));
  lines.push("", "YOUR TOP CONSTRAINTS");
  for (const c of r.constraints) lines.push(`- ${c.label} - ${c.name}. ${c.why}`);
  lines.push(
    "",
    `Against ${r.benchName} founders: you ${r.overall}, median ${r.bench[0]}, top third ${r.bench[1]}, scale-ready ${r.bench[2]}.`,
    "",
    next.h.toUpperCase(),
    next.intro,
    ...next.bullets.map((b) => `- ${b}`),
    "",
    next.fine,
    next.note(r.route),
    "",
    `Your full report - the diagnosis, what's left before launch, and your next three months - is attached as ${pdfName}.`,
    "",
    `Sent to ${id.email} because you completed the Startup Operating Score.`,
    "Questions, or something looks off? Just reply - it reaches us at hello@knnekt.studio.",
  );
  return lines.join("\n");
}
