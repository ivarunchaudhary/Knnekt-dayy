/**
 * A calendar invite as an .ics attachment. Published, not requested
 * (METHOD:PUBLISH): the founder gets "Add to calendar" without RSVP buttons,
 * so no accept/decline replies land in the studio inbox. Times go out in UTC,
 * which every calendar converts to the reader's own zone.
 */

export type CalendarEvent = {
  /** Stable across resends, so a corrected invite replaces the old one. */
  uid: string;
  start: Date;
  end: Date;
  title: string;
  location?: string;
  description?: string;
  url?: string;
};

const utc = (d: Date) => d.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");

/** RFC 5545 text: backslash, semicolon, comma and newline are escaped. */
const text = (s: string) => s.replace(/\\/g, "\\\\").replace(/;/g, "\\;").replace(/,/g, "\\,").replace(/\r?\n/g, "\\n");

/** Lines longer than 75 octets are folded onto continuation lines that start with a space. */
function fold(line: string): string {
  const bytes = new TextEncoder().encode(line);
  if (bytes.length <= 75) return line;
  const out: string[] = [];
  let chunk = "";
  let size = 0;
  for (const ch of line) {
    const n = new TextEncoder().encode(ch).length;
    if (size + n > (out.length ? 74 : 75)) {
      out.push(chunk);
      chunk = "";
      size = 0;
    }
    chunk += ch;
    size += n;
  }
  out.push(chunk);
  return out.join("\r\n ");
}

export function icsFile(events: CalendarEvent[]): string {
  const now = utc(new Date());
  const lines = ["BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//Knnekt Studios//Cohort 01//EN", "CALSCALE:GREGORIAN", "METHOD:PUBLISH"];
  for (const e of events) {
    lines.push(
      "BEGIN:VEVENT",
      `UID:${e.uid}`,
      `DTSTAMP:${now}`,
      `DTSTART:${utc(e.start)}`,
      `DTEND:${utc(e.end)}`,
      `SUMMARY:${text(e.title)}`,
      ...(e.location ? [`LOCATION:${text(e.location)}`] : []),
      ...(e.description ? [`DESCRIPTION:${text(e.description)}`] : []),
      ...(e.url ? [`URL:${e.url}`] : []),
      "END:VEVENT",
    );
  }
  lines.push("END:VCALENDAR");
  return lines.map(fold).join("\r\n") + "\r\n";
}
