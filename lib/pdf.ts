/**
 * A very small PDF writer: enough to hand the founder a real .pdf of their
 * report and answers without pulling in a rendering library. Text only,
 * Helvetica, A4, wrapped and paginated. Runs in the browser and on the
 * server alike, though today only the server builds the emailed copy.
 */

export type Block =
  | { kind: "h1" | "h2" | "eyebrow" | "p" | "small" | "li"; text: string }
  | { kind: "gap"; size?: number }
  | { kind: "rule" };

const PAGE_W = 595.28;
const PAGE_H = 841.89;
const MARGIN = 56;
const WIDTH = PAGE_W - MARGIN * 2;

/** Standard Helvetica advance widths for ASCII 32–126, in thousandths of an em. */
const WIDTHS = [
  278, 278, 355, 556, 556, 889, 667, 191, 333, 333, 389, 584, 278, 333, 278, 278, 556, 556, 556, 556, 556, 556, 556, 556, 556, 556, 278, 278, 584, 584, 584, 556, 1015, 667, 667, 722, 722, 667, 611,
  778, 722, 278, 500, 667, 556, 833, 722, 778, 667, 778, 722, 667, 611, 722, 667, 944, 667, 667, 611, 278, 278, 278, 469, 556, 333, 556, 556, 500, 556, 556, 278, 556, 556, 222, 222, 500, 222, 833,
  556, 556, 556, 556, 333, 500, 278, 556, 500, 722, 500, 500, 500, 334, 260, 334, 584,
];

const styles = {
  h1: { size: 26, bold: true, lead: 30, after: 6 },
  h2: { size: 13, bold: true, lead: 17, after: 4, before: 10 },
  eyebrow: { size: 8, bold: false, lead: 12, after: 2, before: 0 },
  p: { size: 10, bold: false, lead: 14, after: 4 },
  small: { size: 8, bold: false, lead: 11, after: 2 },
  li: { size: 10, bold: false, lead: 14, after: 2, indent: 12, bullet: "-" },
} as const;

/** Squash characters Helvetica's WinAnsi encoding can't show into ones it can. */
function ascii(s: string): string {
  return s
    .replace(/[‘’‚]/g, "'")
    .replace(/[“”„]/g, '"')
    .replace(/[–—−]/g, "-")
    .replace(/…/g, "...")
    .replace(/₹/g, "Rs ")
    .replace(/·/g, "-")
    .replace(/→/g, "->")
    .replace(/✓/g, "[x]")
    .replace(/ /g, " ")
    .replace(/[^\x20-\x7E]/g, "?");
}

function width(s: string, size: number, bold: boolean): number {
  let w = 0;
  for (let i = 0; i < s.length; i++) {
    const c = s.charCodeAt(i);
    w += c >= 32 && c <= 126 ? WIDTHS[c - 32] : 556;
  }
  return (w / 1000) * size * (bold ? 1.05 : 1);
}

function wrap(s: string, size: number, bold: boolean, max: number): string[] {
  const out: string[] = [];
  for (const para of s.split("\n")) {
    let line = "";
    for (const word of para.split(/\s+/).filter(Boolean)) {
      const next = line ? `${line} ${word}` : word;
      if (width(next, size, bold) <= max || !line) line = next;
      else {
        out.push(line);
        line = word;
      }
    }
    out.push(line);
  }
  return out;
}

const esc = (s: string) => s.replace(/\\/g, "\\\\").replace(/\(/g, "\\(").replace(/\)/g, "\\)");

/** Lays the blocks out and returns the finished file. */
export function pdf(blocks: Block[], title: string): Uint8Array<ArrayBuffer> {
  const pages: string[][] = [[]];
  let y = PAGE_H - MARGIN;
  const line = (text: string, size: number, bold: boolean, x: number) => {
    if (y - size < MARGIN) {
      pages.push([]);
      y = PAGE_H - MARGIN;
    }
    pages[pages.length - 1].push(`BT /${bold ? "F2" : "F1"} ${size} Tf ${(MARGIN + x).toFixed(2)} ${y.toFixed(2)} Td (${esc(text)}) Tj ET`);
  };

  for (const b of blocks) {
    if (b.kind === "gap") {
      y -= b.size ?? 10;
      continue;
    }
    if (b.kind === "rule") {
      if (y - 8 < MARGIN) {
        pages.push([]);
        y = PAGE_H - MARGIN;
      }
      y -= 6;
      pages[pages.length - 1].push(`0.8 G ${MARGIN} ${y.toFixed(2)} m ${(PAGE_W - MARGIN).toFixed(2)} ${y.toFixed(2)} l S 0 G`);
      y -= 8;
      continue;
    }
    const st = styles[b.kind];
    const before = "before" in st ? st.before : 0;
    y -= before;
    const indent = "indent" in st ? st.indent : 0;
    const lines = wrap(ascii(b.text), st.size, st.bold, WIDTH - indent);
    lines.forEach((l, i) => {
      y -= st.lead;
      if (i === 0 && "bullet" in st) line(st.bullet, st.size, false, 0);
      line(l, st.size, st.bold, indent);
    });
    y -= st.after;
  }

  // Objects: 1 catalog, 2 pages, 3 regular font, 4 bold font, then page + stream pairs.
  const objects: string[] = [];
  const add = (body: string) => {
    objects.push(body);
    return objects.length;
  };
  add("<< /Type /Catalog /Pages 2 0 R >>");
  add(""); // pages, filled in below
  add("<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica /Encoding /WinAnsiEncoding >>");
  add("<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold /Encoding /WinAnsiEncoding >>");
  const pageIds: number[] = [];
  pages.forEach((ops, i) => {
    const footer = `BT /F1 8 Tf ${MARGIN} ${(MARGIN - 24).toFixed(2)} Td (${esc(ascii(`${title}  -  page ${i + 1} of ${pages.length}`))}) Tj ET`;
    const stream = [...ops, footer].join("\n");
    const content = add(`<< /Length ${stream.length} >>\nstream\n${stream}\nendstream`);
    pageIds.push(add(`<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${PAGE_W} ${PAGE_H}] /Resources << /Font << /F1 3 0 R /F2 4 0 R >> >> /Contents ${content} 0 R >>`));
  });
  objects[1] = `<< /Type /Pages /Kids [${pageIds.map((n) => `${n} 0 R`).join(" ")}] /Count ${pageIds.length} >>`;

  let out = "%PDF-1.4\n";
  const offsets: number[] = [];
  objects.forEach((body, i) => {
    offsets.push(out.length);
    out += `${i + 1} 0 obj\n${body}\nendobj\n`;
  });
  const xref = out.length;
  out += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`;
  offsets.forEach((o) => {
    out += `${String(o).padStart(10, "0")} 00000 n \n`;
  });
  out += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xref}\n%%EOF\n`;

  // Every character is ASCII by now, so one byte each.
  const bytes = new Uint8Array(out.length);
  for (let i = 0; i < out.length; i++) bytes[i] = out.charCodeAt(i) & 0xff;
  return bytes;
}

export function toBase64(bytes: Uint8Array): string {
  if (typeof Buffer !== "undefined") return Buffer.from(bytes).toString("base64");
  let s = "";
  for (let i = 0; i < bytes.length; i += 0x8000) s += String.fromCharCode(...bytes.subarray(i, i + 0x8000));
  return btoa(s);
}
