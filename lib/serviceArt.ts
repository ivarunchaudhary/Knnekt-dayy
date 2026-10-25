import { Fragment, isValidElement, type ReactElement, type ReactNode } from "react";

/**
 * Under one roof: the flat illustrations on each function's card, rendered as
 * SVG markup for a 1280×470 viewBox. You (the founder) and a studio teammate
 * stand either side of one shared board; each time a new "What that covers"
 * item starts the teammate points at the work, the board's progress bar fills,
 * and the loop ends with a wave, a tick and a burst.
 *
 * Two boards play on the cards:
 * - `legalBoard`: the board holds six tiles, one per item, and each springs in
 *   on its own beat.
 * - `mixArt`: the function's own line drawing (from ServiceAnimation) plays on
 *   the board instead, restyled flat by `flat`: bolder outlines, soft fills and
 *   coloured dots.
 */

export type Step = [from: number, to: number, capability: string];
export type Art = { loop: number; still: number; steps: Step[]; render: (t: number) => string };

const P = (t: number, a: number, b: number) => Math.min(1, Math.max(0, (t - a) / (b - a)));
const eo = (k: number) => 1 - Math.pow(1 - k, 3);
const spring = (t: number, t0: number, f = 10, d = 6) => (t < t0 ? 0 : 1 - Math.exp(-d * (t - t0)) * Math.cos(f * (t - t0)));
const f1 = (n: number) => n.toFixed(1);
const o3 = (n: number) => Math.max(0, Math.min(1, n)).toFixed(3);

const C = {
  blue: "#3b81e3", navy: "#16253f", coral: "#ff7a6b", amber: "#ffc24b", mint: "#34c9a0", violet: "#8b7cf6",
  skin1: "#f2c6a0", skin2: "#c88c63", skin3: "#8e5b3c", hair: "#2b2a35", floor: "#e3edf9", line: "#dbe6f3",
};
const TINT = { blue: "#e6f0fc", coral: "#ffecea", amber: "#fff5df", mint: "#e4f7f1", violet: "#efedfe" };
type Hue = keyof typeof TINT;

const mono = (x: number, y: number, s: string, fill: string, o = 1, size = 22) =>
  `<text x="${f1(x)}" y="${f1(y)}" text-anchor="middle" font-size="${size}" fill="${fill}" opacity="${o3(o)}" style="font-family:var(--font-mono);letter-spacing:2px">${s}</text>`;

/* ---------- the board: people, progress, caption and the finish ---------- */

const HAIR = {
  a: "M-16 -78Q-16 -96 0 -96Q16 -96 17 -80Q8 -88 -4 -86Q-10 -80 -16 -78Z",
  b: "M-16 -80Q-14 -97 2 -96Q16 -94 16 -74L12 -70Q12 -84 0 -86Q-10 -84 -16 -80Z",
  c: "M-17 -76Q-19 -98 0 -98Q19 -98 17 -76Q14 -90 0 -91Q-14 -90 -17 -76Z M-17 -76Q-20 -60 -12 -56L-12 -74Z",
  d: "M-15 -82Q-12 -95 0 -95Q13 -95 15 -82Q6 -86 0 -86Q-7 -86 -15 -82Z",
};
type Pose = "rest" | "point" | "wave";

function person(x: number, y: number, s: number, shirt: string, skin: string, hair: keyof typeof HAIR, pose: Pose, t: number, seed: number) {
  const b = Math.sin(t * 3.2 + seed) * 2.2, wig = Math.sin(t * 12) * 5;
  const arm: [string, number[]] =
    pose === "wave" ? [`M18 -40Q34 -62 ${f1(30 + wig)} -84`, [30 + wig, -86]] : pose === "point" ? ["M18 -40Q34 -48 48 -54", [48, -54]] : ["M18 -40Q28 -20 22 -6", [22, -6]];
  return `<g transform="translate(${f1(x)} ${f1(y + b)}) scale(${s})"><ellipse cx="0" cy="${f1(4 - b)}" rx="30" ry="6" fill="#16253f" opacity=".08"></ellipse>
    <path d="M-24 0V-38Q-24 -56 0 -56Q24 -56 24 -38V0Z" fill="${shirt}"></path><path d="M-18 -40Q-28 -20 -22 -6" fill="none" stroke="${shirt}" stroke-width="10" stroke-linecap="round"></path>
    <path d="${arm[0]}" fill="none" stroke="${shirt}" stroke-width="10" stroke-linecap="round"></path><circle cx="-22" cy="-6" r="5.5" fill="${skin}"></circle><circle cx="${f1(arm[1][0])}" cy="${f1(arm[1][1])}" r="5.5" fill="${skin}"></circle>
    <rect x="-6" y="-64" width="12" height="10" rx="3" fill="${skin}"></rect><circle cx="0" cy="-76" r="16" fill="${skin}"></circle><path d="${HAIR[hair]}" fill="${C.hair}"></path></g>`;
}

const bubble = (x: number, y: number, k: number) =>
  k <= 0.01
    ? ""
    : `<g transform="translate(${f1(x)} ${f1(y)}) scale(${(1.6 * k).toFixed(3)})"><path d="M-20 -16H20Q28 -16 28 -8V6Q28 14 20 14H-2L-12 24V14H-20Q-28 14 -28 6V-8Q-28 -16 -20 -16Z" fill="${C.mint}"></path><path d="M-8 -1l5 5 11-11" fill="none" stroke="#fff" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"></path></g>`;

/** Ten confetti dashes in a ring round the board; `squash` flattens the ring. */
const burst = (x: number, y: number, t: number, t0: number, squash: number) => {
  const k = Math.max(0, spring(t, t0, 9, 5));
  if (k <= 0.01) return "";
  const fade = 1 - P(t, t0 + 0.5, t0 + 1.1);
  return [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
    .map((i) => {
      const a = (i / 10) * Math.PI * 2 + 0.2, r1 = 150 + k * 40, r2 = r1 + 22 * fade;
      return `<line x1="${f1(x + Math.cos(a) * r1)}" y1="${f1(y + Math.sin(a) * r1 * squash)}" x2="${f1(x + Math.cos(a) * r2)}" y2="${f1(y + Math.sin(a) * r2 * squash)}" stroke="${[C.coral, C.amber, C.mint, C.blue, C.violet][i % 5]}" stroke-width="8" stroke-linecap="round" opacity="${o3(fade)}"></line>`;
    })
    .join("");
};

const SX0 = 168, SX1 = 1112; // the board's column; the people keep their own columns either side
const FX = 80, TX = 1200, FEET = 418, PS = 1.6; // founder / studio team

type Mate = { shirt: Hue; skin: string; hair: keyof typeof HAIR };
type Frame = {
  mate: Mate;
  /** How far along the bar is, 0..1. */
  filled: number;
  label: string;
  /** When the current item started: the teammate points for 0.9s from here. */
  from: number;
  done: boolean;
  /** When the finish lands: the burst, then the founder's tick a beat later. */
  finish: number;
  squash: number;
};

function board(t: number, inner: string, f: Frame) {
  const mate = C[f.mate.shirt];
  let out = `<ellipse cx="640" cy="${FEET + 6}" rx="620" ry="18" fill="${C.floor}"/>${inner}`;
  out +=
    `<rect x="${SX0}" y="${FEET + 22}" width="${SX1 - SX0}" height="6" rx="3" fill="${C.line}"/>` +
    `<rect x="${SX0}" y="${FEET + 22}" width="${f1((SX1 - SX0) * Math.min(1, f.filled))}" height="6" rx="3" fill="${mate}"/>`;
  out += mono(640, FEET + 50, f.label.toUpperCase().replace("&", "&amp;"), "#000000", 1, 20);
  // a gesture, not a throw: the studio team points towards the work, with a soft ripple at the fingertip
  const g = P(t, f.from, f.from + 0.9), pointing = !f.done && g < 1;
  out += person(FX, FEET, PS, C.blue, C.skin2, "a", f.done ? "wave" : "rest", t, 1);
  out += `<g transform="translate(${2 * TX} 0) scale(-1 1)">${person(TX, FEET, PS, mate, f.mate.skin, f.mate.hair, pointing ? "point" : "rest", t, 2.5)}</g>`;
  if (pointing) {
    const hx = TX - 48 * PS, hy = FEET - 54 * PS;
    out += `<circle cx="${f1(hx)}" cy="${f1(hy)}" r="${f1(5 + 7 * eo(g))}" fill="none" stroke="${mate}" stroke-width="3" opacity="${o3(0.85 * (1 - g))}"/>`;
  }
  out += mono(FX, FEET - 178, "FOUNDER", "#000000", 1, 20) + mono(TX, FEET - 178, "STUDIO TEAM", "#000000", 1, 20);
  out += bubble(FX + 4, FEET - 226, Math.max(0, spring(t, f.finish + 0.1, 9, 6)) * 0.62);
  out += burst(640, 210, t, f.finish, f.squash);
  return out;
}

/* ---------- Legal & Compliance: six tiles on the board, one per item ---------- */

const ICON = {
  incorporation: (c: string) => `<rect x="-58" y="-44" width="116" height="80" rx="8" fill="#fff" stroke="${C.navy}" stroke-width="5"/><rect x="-42" y="-28" width="60" height="7" rx="3.5" fill="${C.navy}"/><rect x="-42" y="-14" width="80" height="6" rx="3" fill="${C.line}"/><rect x="-42" y="-2" width="64" height="6" rx="3" fill="${C.line}"/>
    <circle cx="34" cy="26" r="20" fill="${c}"/><path d="M24 40l-6 22 16 -8 16 8 -6 -22" fill="${c}" opacity=".7"/><path d="M26 26l6 6 11 -12" fill="none" stroke="#fff" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>`,
  captable: (c: string) => `<circle r="48" fill="${C.line}"/><path d="M0 0V-48A48 48 0 0 1 45 16Z" fill="${c}"/><path d="M0 0L45 16A48 48 0 0 1 -12 46Z" fill="${C.amber}"/><path d="M0 0L-12 46A48 48 0 0 1 -46 -12Z" fill="${C.blue}"/><circle r="14" fill="#fff"/>`,
  contracts: (c: string) => `<path d="M-46 -52H24L46 -30V52H-46Z" fill="#fff" stroke="${C.navy}" stroke-width="5"/><path d="M24 -52V-30H46" fill="none" stroke="${C.navy}" stroke-width="5"/>
    <rect x="-32" y="-34" width="44" height="6" rx="3" fill="${C.line}"/><rect x="-32" y="-20" width="60" height="6" rx="3" fill="${C.line}"/><rect x="-32" y="-6" width="52" height="6" rx="3" fill="${C.line}"/>
    <path d="M-32 30Q-22 14 -14 30T4 30T22 26" fill="none" stroke="${c}" stroke-width="5" stroke-linecap="round"/><path d="M40 10L62 -12" stroke="${C.navy}" stroke-width="8" stroke-linecap="round"/>`,
  ip: (c: string) => `<path d="M-6 -50A30 30 0 0 0 -24 4V18H12V4A30 30 0 0 0 -6 -50Z" fill="${C.amber}"/><rect x="-22" y="22" width="32" height="8" rx="4" fill="${C.navy}"/><rect x="-18" y="34" width="24" height="7" rx="3.5" fill="${C.navy}"/>
    <path d="M44 -24L70 -14V8Q70 30 44 42Q18 30 18 8V-14Z" fill="${c}"/><path d="M33 8l8 8 14-16" fill="none" stroke="#fff" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>`,
  compliance: (c: string) => `<path d="M0 -56L46 -38V-4Q46 34 0 56Q-46 34 -46 -4V-38Z" fill="${c}"/><path d="M-20 0l14 14 28 -30" fill="none" stroke="#fff" stroke-width="8" stroke-linecap="round" stroke-linejoin="round"/>`,
  dataroom: (c: string) => `<path d="M-60 -36H-20L-10 -24H60V44H-60Z" fill="${c}"/><path d="M-60 -18H60V44H-60Z" fill="${c}" opacity=".7"/>
    <rect x="-14" y="2" width="28" height="24" rx="5" fill="#fff"/><path d="M-8 2V-6A8 8 0 0 1 8 -6V2" fill="none" stroke="#fff" stroke-width="5"/><circle cx="0" cy="13" r="3.5" fill="${C.navy}"/>`,
};

const LEGAL: [label: string, icon: keyof typeof ICON, hue: Hue][] = [
  ["Incorporation", "incorporation", "mint"],
  ["Cap table", "captable", "coral"],
  ["Contracts", "contracts", "blue"],
  ["IP assignment", "ip", "violet"],
  ["Compliance", "compliance", "mint"],
  ["Data room", "dataroom", "amber"],
];
const BEAT = 1.9;
const GAP = 16, SW = (SX1 - SX0 - 2 * GAP) / 3, SH = (FEET - 8 - GAP) / 2, SS = Math.min(SW / 176, SH / 128);
const slot = (k: number) => [SX0 + SW / 2 + (k % 3) * (SW + GAP), 6 + SH / 2 + Math.floor(k / 3) * (SH + GAP)];

function legal(t: number) {
  const cur = Math.min(5, Math.floor(t / BEAT)), full = t >= BEAT * 6;
  let tiles = "";
  LEGAL.forEach(([, icon, hue], k) => {
    const [x, y] = slot(k), t0 = k * BEAT + 0.42, s = Math.max(0, spring(t, t0, 11, 6.5));
    const active = !full && k === cur && t >= t0;
    const box = `x="${f1(x - SW / 2)}" y="${f1(y - SH / 2)}" width="${f1(SW)}" height="${f1(SH)}" rx="22"`;
    tiles += `<rect ${box} fill="${s > 0.01 ? TINT[hue] : "#f6f8fb"}" stroke="${active ? C[hue] : "transparent"}" stroke-width="5"/>`;
    if (s <= 0.01) tiles += `<rect ${box} fill="none" stroke="${C.line}" stroke-width="3" stroke-dasharray="8 9"/>`;
    else tiles += `<g transform="translate(${f1(x)} ${f1(y)}) scale(${(0.86 * SS * s).toFixed(3)})">${ICON[icon](C[hue])}</g>`;
    if (active)
      tiles += `<circle cx="${f1(x + SW / 2 - 18)}" cy="${f1(y - SH / 2 + 18)}" r="15" fill="${C[hue]}"/><path d="M${f1(x + SW / 2 - 25)} ${f1(y - SH / 2 + 18)}l5 5 10 -10" fill="none" stroke="#fff" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>`;
  });
  return board(t, tiles, {
    mate: { shirt: "mint", skin: C.skin2, hair: "a" },
    filled: t / (BEAT * 6),
    label: full ? "All built, together" : LEGAL[cur][0],
    from: cur * BEAT,
    done: full,
    finish: BEAT * 6 + 0.1,
    squash: 0.62,
  });
}

export const legalBoard: Art = {
  loop: BEAT * 6 + 1.6,
  still: BEAT * 6 + 1.2,
  steps: LEGAL.map(([label], k) => [k * BEAT, (k + 1) * BEAT, label]),
  render: legal,
};

/* ---------- the other three: the function's own drawing plays on the board ---------- */

const MATES: Record<string, Mate> = {
  growth: { shirt: "coral", skin: C.skin1, hair: "b" },
  technology: { shirt: "blue", skin: C.skin3, hair: "d" },
  ai: { shirt: "violet", skin: C.skin1, hair: "c" },
};
const SC = (SX1 - SX0) / 1280;

/** The board around `scene` (flat markup for a 1280-wide canvas), synced to its `steps`. */
export function mixArt(key: string, t: number, scene: string, steps: Step[]) {
  const mate = MATES[key];
  if (!mate) return "";
  const idx = Math.max(0, steps.findIndex(([a, b]) => t >= a && t < b));
  const end = steps[steps.length - 1][1];
  const done = t >= end - 0.9;
  return board(t, `<g transform="translate(${SX0} 6) scale(${SC.toFixed(4)})">${scene}</g>`, {
    mate,
    filled: t / end,
    label: done ? "All built, together" : steps[idx][2],
    from: steps[idx][0],
    done,
    finish: end - 0.9,
    squash: 0.5,
  });
}

/* ---------- flat restyle of a line drawing ---------- */

const INK = "#16253f";
const TINTS = ["#e6f0fc", "#ffecea", "#fff5df", "#e4f7f1", "#efedfe", "#fde8f2"];
const DOTS = ["#ff7a6b", "#ffc24b", "#34c9a0", "#3b81e3", "#8b7cf6", "#ec6aa8"];
const attr = (el: string, name: string) => el.match(new RegExp(`\\s${name}="([^"]*)"`))?.[1] ?? null;
const setAttr = (el: string, name: string, val: string) =>
  attr(el, name) === null ? el.replace(/^<(\w+)/, `<$1 ${name}="${val}"`) : el.replace(new RegExp(`(\\s${name}=")[^"]*(")`), `$1${val}$2`);

/**
 * Restyles line-drawing markup flat: bolder outlines, closed ink outlines
 * filled with soft tints, small ink dots in colour, faint panels brought up,
 * and captions in black, semibold and a size up.
 */
export function flat(svg: string) {
  let i = 0;
  return svg.replace(/<(rect|circle|ellipse|path|line|polygon|polyline|text)\b[^>]*>/g, (el, tag: string) => {
    const k = i++;
    const fill = attr(el, "fill"), stroke = attr(el, "stroke"), dash = attr(el, "stroke-dasharray");
    if (tag === "text") {
      el = setAttr(setAttr(setAttr(el, "fill", "#000000"), "font-weight", "600"), "fill-opacity", "1");
      const fs = parseFloat(attr(el, "font-size") || "0");
      return fs ? setAttr(el, "font-size", (fs * 1.25).toFixed(1)) : el;
    }
    if (stroke && stroke !== "none") {
      const w = parseFloat(attr(el, "stroke-width") || "1");
      el = setAttr(el, "stroke-width", Math.max(w * 1.7, stroke === INK ? 3.2 : w * 1.5).toFixed(2));
      const so = attr(el, "stroke-opacity");
      if (so !== null) el = setAttr(el, "stroke-opacity", Math.min(0.62, parseFloat(so) * 1.7).toFixed(3));
    }
    // closed outlines get a soft fill, but never progress rings or dashed guides
    const closed =
      tag === "rect" ||
      tag === "ellipse" ||
      tag === "polygon" ||
      (tag === "circle" && parseFloat(attr(el, "r") || "0") > 9) ||
      (tag === "path" && /[Zz]\s*$/.test(attr(el, "d") || ""));
    const guide = dash && dash !== "1 1";
    if (closed && fill === "none" && stroke === INK && !guide) el = setAttr(el, "fill", TINTS[k % TINTS.length]);
    if (tag === "circle" && fill === INK && parseFloat(attr(el, "r") || "0") <= 10) el = setAttr(el, "fill", DOTS[k % DOTS.length]);
    const fo = attr(el, "fill-opacity");
    if (fo !== null && parseFloat(fo) < 0.15) el = setAttr(el, "fill-opacity", "0.2");
    return el;
  });
}

/* ---------- JSX to markup ---------- */

const KEEP = new Set(["viewBox", "pathLength", "preserveAspectRatio", "gradientTransform", "gradientUnits", "textLength", "lengthAdjust", "patternUnits", "clipPathUnits", "stdDeviation", "markerWidth", "markerHeight", "refX", "refY", "startOffset"]);
const UNITLESS = new Set(["opacity", "zIndex", "fontWeight", "lineHeight", "flex", "flexGrow", "flexShrink", "order", "fillOpacity", "strokeOpacity", "strokeWidth", "stopOpacity", "strokeDashoffset", "strokeMiterlimit"]);
const kebab = (k: string) => k.replace(/[A-Z]/g, (m) => "-" + m.toLowerCase());
const esc = (v: unknown) => String(v).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/"/g, "&quot;");

/** SVG markup for a tree of SVG elements and the plain function components that draw them. */
export function markup(n: ReactNode): string {
  if (n == null || typeof n === "boolean") return "";
  if (Array.isArray(n)) return n.map(markup).join("");
  if (!isValidElement(n)) return esc(n);
  const { type, props } = n as ReactElement<Record<string, unknown>>;
  if (type === Fragment) return markup(props.children as ReactNode);
  if (typeof type === "function") return markup((type as (p: object) => ReactNode)(props));
  let a = "";
  for (const k in props) {
    if (k === "children" || k === "key" || k === "ref") continue;
    const v = props[k];
    if (v == null || v === false) continue;
    if (k === "style") {
      const css = Object.entries(v as Record<string, unknown>).map(([p, x]) => `${kebab(p)}:${typeof x === "number" && x !== 0 && !UNITLESS.has(p) ? `${x}px` : x}`);
      a += ` style="${esc(css.join(";"))}"`;
      continue;
    }
    const name = k === "className" ? "class" : KEEP.has(k) || k.startsWith("aria-") || k.startsWith("data-") ? k : kebab(k);
    a += ` ${name}="${esc(v === true ? "" : v)}"`;
  }
  return `<${type as string}${a}>${markup(props.children as ReactNode)}</${type as string}>`;
}
