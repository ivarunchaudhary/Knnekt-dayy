/**
 * The founder's report as an email: a short personal letter, with the full
 * report as the attached PDF. Plain on purpose — it should read like a note
 * from the team, not a newsletter — so the HTML is only paragraphs and the one
 * italic sign-off line, and survives any client.
 */
import { CONTACT_PHONE } from "./contact";
import { letterHtml, letterText, SIGN_OFF } from "./letter";
import { archetypes, type Identity, type Result } from "./score";

export const reportSubject = (r: Result) => `Your Startup Operating Score: ${r.overall}/100`;

/** The letter's paragraphs, shared by the HTML and the plain text. The last is the italic sign-off. */
function letter(r: Result, id: Identity): string[][] {
  const firstName = id.name.split(/\s+/)[0] || id.name;
  return [
    [`Dear ${firstName},`],
    ["Thank you for completing the Startup Operating Score. Your personalised report is attached."],
    [`Your archetype is ${archetypes[r.arch].name}, and the constraint most in your way right now is ${r.constraints[0].name}.`],
    [
      `Our team reviews every report personally. We will call you within 24 hours from ${CONTACT_PHONE.display} to walk you through your results, discuss the first thing worth fixing, and explore whether working together would be the right step for you.`,
    ],
    ...SIGN_OFF,
  ];
}

export function reportEmailHtml(r: Result, id: Identity): string {
  return letterHtml(reportSubject(r), letter(r, id));
}

/** The same thing as plain text, for clients that won't render HTML. */
export function reportEmailText(r: Result, id: Identity): string {
  return letterText(letter(r, id));
}
