/**
 * Agency vs us: the flat illustrations with people that play beside each
 * comparison, rendered as SVG markup for a 600×400 viewBox.
 *
 * Timeline per comparison: 0–1.3s agency (grey) · 1.3–2.0s crossed out ·
 * 2.0–2.9s colour arrives · 3.0s+ ours.
 */

const P = (t: number, a: number, b: number) => Math.min(1, Math.max(0, (t - a) / (b - a)));
const lerp = (a: number, b: number, k: number) => a + (b - a) * k;
const eo = (k: number) => 1 - Math.pow(1 - k, 3);
const eio = (k: number) => (k < 0.5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2);
const spring = (t: number, t0: number, f = 9, d = 6) => (t < t0 ? 0 : 1 - Math.exp(-d * (t - t0)) * Math.cos(f * (t - t0)));
const f1 = (n: number) => n.toFixed(1);
const o3 = (n: number) => Math.max(0, Math.min(1, n)).toFixed(3);
const hex = (h: string) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
const mix = (a: string, b: string, k: number) => {
  const A = hex(a), B = hex(b);
  return "#" + A.map((v, i) => Math.round(lerp(v, B[i], k)).toString(16).padStart(2, "0")).join("");
};

/** Full colour, and the grey each colour starts from in the agency world. */
const C = {
  blue: "#3b81e3", deep: "#2d6fae", navy: "#16253f", coral: "#ff7a6b", amber: "#ffc24b", mint: "#34c9a0", violet: "#8b7cf6",
  skin1: "#f2c6a0", skin2: "#c88c63", skin3: "#8e5b3c", hair: "#2b2a35", white: "#ffffff", floor: "#dbe8f8", paper: "#ffffff", line: "#c9d9ee",
};
const G: typeof C = {
  blue: "#b9bfc8", deep: "#a3aab4", navy: "#7d8592", coral: "#c3c8cf", amber: "#ced2d8", mint: "#bfc5cc", violet: "#c6cad1",
  skin1: "#dcdfe3", skin2: "#cfd3d8", skin3: "#bfc4ca", hair: "#8e95a0", white: "#f7f8f9", floor: "#e6e9ed", paper: "#f4f5f7", line: "#d8dce2",
};
type Tone = keyof typeof C;
const tone = (k: Tone, c: number) => mix(G[k], C[k], c);
const mono = (x: number, y: number, s: string, fill: string, o = 1, size = 13, anchor = "middle") =>
  `<text x="${f1(x)}" y="${f1(y)}" text-anchor="${anchor}" font-size="${size}" fill="${fill}" opacity="${o3(o)}" style="font-family:var(--font-mono);letter-spacing:1px">${s}</text>`;

type Scene = { t: number; c: number; bob: (k: number) => number };
const base = (t: number): Scene => ({ t, c: eio(P(t, 2.0, 2.9)), bob: (k) => Math.sin(t * 3.2 + k * 1.7) * (t > 2.4 ? 2.2 : 0.6) });

/* ---------- primitives ---------- */
const HAIR = {
  a: "M-16 -78Q-16 -96 0 -96Q16 -96 17 -80Q8 -88 -4 -86Q-10 -80 -16 -78Z",
  b: "M-16 -80Q-14 -97 2 -96Q16 -94 16 -74L12 -70Q12 -84 0 -86Q-10 -84 -16 -80Z",
  c: "M-17 -76Q-19 -98 0 -98Q19 -98 17 -76Q14 -90 0 -91Q-14 -90 -17 -76Z M-17 -76Q-20 -60 -12 -56L-12 -74Z",
  d: "M-15 -82Q-12 -95 0 -95Q13 -95 15 -82Q6 -86 0 -86Q-7 -86 -15 -82Z",
};
type Pose = "rest" | "wave" | "point" | "hold" | "type" | "give";
type Who = { shirt: Tone; skin: Tone; seed: number; hair?: keyof typeof HAIR; dir?: number; pose?: Pose; scale?: number; op?: number };

function person(x: number, y: number, o: Who, s: Scene) {
  const sc = o.scale ?? 1;
  if (sc <= 0.01 || (o.op != null && o.op <= 0.01)) return "";
  const shirt = tone(o.shirt, s.c), skin = tone(o.skin, s.c), hair = tone("hair", s.c);
  const b = s.bob(o.seed), dir = o.dir || 1, pose = o.pose || "rest";
  const wig = Math.sin(s.t * 12) * 5;
  const arms: Record<Pose, [[number, number], [number, number], string]> = {
    rest: [[-22, -6], [22, -6], "M18 -40Q28 -20 22 -6"],
    wave: [[-22, -6], [30 + wig, -86], `M18 -40Q34 -62 ${f1(30 + wig)} -84`],
    point: [[-22, -6], [48, -50], "M18 -40Q34 -46 46 -50"],
    hold: [[-6, -28], [10, -28], "M18 -40Q22 -30 10 -28"],
    type: [[-12, -20], [16, -20], "M18 -40Q24 -26 16 -20"],
    give: [[-22, -6], [44, -34], "M18 -40Q32 -36 44 -34"],
  };
  const arm = arms[pose];
  const left = pose === "hold" ? "M-18 -40Q-22 -30 -6 -28" : pose === "type" ? "M-18 -40Q-24 -26 -12 -20" : "M-18 -40Q-28 -20 -22 -6";
  return `<g transform="translate(${f1(x)} ${f1(y + b)}) scale(${f1(dir * sc)} ${f1(sc)})" opacity="${o3(o.op ?? 1)}">
    <ellipse cx="0" cy="${f1(4 - b)}" rx="30" ry="6" fill="#16253f" opacity=".08"></ellipse>
    <path d="M-24 0V-38Q-24 -56 0 -56Q24 -56 24 -38V0Z" fill="${shirt}"></path>
    <path d="${left}" fill="none" stroke="${shirt}" stroke-width="10" stroke-linecap="round"></path>
    <path d="${arm[2]}" fill="none" stroke="${shirt}" stroke-width="10" stroke-linecap="round"></path>
    <circle cx="${f1(arm[0][0])}" cy="${f1(arm[0][1])}" r="5.5" fill="${skin}"></circle>
    <circle cx="${f1(arm[1][0])}" cy="${f1(arm[1][1])}" r="5.5" fill="${skin}"></circle>
    <rect x="-6" y="-64" width="12" height="10" rx="3" fill="${skin}"></rect>
    <circle cx="0" cy="-76" r="16" fill="${skin}"></circle>
    <path d="${HAIR[o.hair || "a"]}" fill="${hair}"></path></g>`;
}
const floor = (s: Scene) => `<ellipse cx="300" cy="334" rx="262" ry="24" fill="${tone("floor", s.c)}"></ellipse>`;
const desk = (x: number, y: number, w: number, s: Scene, op = 1) =>
  `<g opacity="${o3(op)}"><rect x="${x - w / 2}" y="${y}" width="${w}" height="12" rx="6" fill="${tone("navy", s.c)}"></rect><rect x="${x - w / 2 + 14}" y="${y + 12}" width="8" height="${334 - y - 16}" rx="3" fill="${tone("navy", s.c)}" opacity=".7"></rect><rect x="${x + w / 2 - 22}" y="${y + 12}" width="8" height="${334 - y - 16}" rx="3" fill="${tone("navy", s.c)}" opacity=".7"></rect></g>`;
const laptop = (x: number, y: number, s: Scene, lit = 0, k = 0) => {
  const bars =
    lit > 0
      ? [0, 1, 2]
          .map((i) => {
            const h = 22 * Math.min(1, lit * (1 + i * 0.3)) * (0.5 + 0.25 * i);
            return `<rect x="${x - 26 + i * 18}" y="${f1(y - 14 - h)}" width="12" height="${f1(h)}" rx="3" fill="${[C.blue, C.coral, C.mint][(i + k) % 3]}"></rect>`;
          })
          .join("")
      : "";
  return `<g><rect x="${x - 36}" y="${y - 50}" width="72" height="46" rx="6" fill="${tone("white", s.c)}" stroke="${tone("navy", s.c)}" stroke-width="4"></rect>${bars}<rect x="${x - 46}" y="${y - 6}" width="92" height="7" rx="3.5" fill="${tone("navy", s.c)}"></rect></g>`;
};
const bubble = (x: number, y: number, kind: "?" | "ok", k: number) => {
  if (k <= 0.01) return "";
  const q = kind === "?";
  return `<g transform="translate(${f1(x)} ${f1(y)}) scale(${k.toFixed(3)})"><path d="M-20 -16H20Q28 -16 28 -8V6Q28 14 20 14H-2L-12 24V14H-20Q-28 14 -28 6V-8Q-28 -16 -20 -16Z" fill="${q ? G.white : C.mint}" stroke="${q ? G.deep : "none"}" stroke-width="3"></path>${q ? `<text x="0" y="5" text-anchor="middle" font-size="18" font-weight="700" fill="${G.navy}">?</text>` : '<path d="M-8 -1l5 5 11-11" fill="none" stroke="#fff" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"></path>'}</g>`;
};
const burst = (x: number, y: number, s: Scene, t0: number) => {
  const k = Math.max(0, spring(s.t, t0, 9, 5));
  if (k <= 0.01) return "";
  const fade = 1 - P(s.t, t0 + 0.45, t0 + 0.95);
  return [0, 1, 2, 3, 4, 5, 6, 7]
    .map((i) => {
      const a = (i / 8) * Math.PI * 2 + 0.2, r1 = 58 + k * 26, r2 = r1 + 14 * fade;
      return `<line x1="${f1(x + Math.cos(a) * r1)}" y1="${f1(y + Math.sin(a) * r1)}" x2="${f1(x + Math.cos(a) * r2)}" y2="${f1(y + Math.sin(a) * r2)}" stroke="${[C.coral, C.amber, C.mint, C.blue][i % 4]}" stroke-width="5" stroke-linecap="round" opacity="${o3(fade)}"></line>`;
    })
    .join("");
};
const tickMark = (x: number, y: number, k: number, col = C.mint) =>
  k <= 0.01
    ? ""
    : `<g transform="translate(${f1(x)} ${f1(y)}) scale(${k.toFixed(3)})"><circle r="11" fill="${col}"></circle><path d="M-5 0l3.5 3.5 7-7.5" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"></path></g>`;
const greyTick = (x: number, y: number, o: number) =>
  `<g transform="translate(${f1(x)} ${f1(y)})" opacity="${o3(o)}"><circle r="10" fill="${G.white}" stroke="${G.deep}" stroke-width="2.5"></circle><path d="M-4.5 0l3 3 6-6.5" fill="none" stroke="${G.navy}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"></path></g>`;
const crossMark = (x: number, y: number, o: number) =>
  `<g transform="translate(${f1(x)} ${f1(y)})" opacity="${o3(o)}"><circle r="10" fill="${C.coral}"></circle><path d="M-4 -4l8 8M4 -4l-8 8" stroke="#fff" stroke-width="3" stroke-linecap="round"></path></g>`;
const ICON = {
  growth: "M-12 8L-3 -1L3 5L12 -6M5 -6H12V1",
  code: "M-7 -7L-14 0L-7 7M7 -7L14 0L7 7",
  ai: "M0 -13Q2 -2 13 0Q2 2 0 13Q-2 2 -13 0Q-2 -2 0 -13Z",
  legal: "M-9 -12H5L10 -7V12H-9ZM-4 -2H5M-4 5H5",
};
const iconTile = (x: number, y: number, key: keyof typeof ICON, col: Tone, s: Scene, sc = 1) =>
  `<g transform="translate(${f1(x)} ${f1(y)}) scale(${sc.toFixed(3)})"><rect x="-24" y="-24" width="48" height="48" rx="12" fill="${tone(col, s.c)}"></rect><path d="${ICON[key]}" fill="none" stroke="${tone("white", s.c)}" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round"></path></g>`;
const card = (x: number, y: number, r: number, fill: string, stroke: string, lineCol: string, op = 1) =>
  `<g transform="translate(${f1(x)} ${f1(y)}) rotate(${f1(r)})" opacity="${o3(op)}"><rect x="-46" y="-17" width="92" height="34" rx="8" fill="${fill}" stroke="${stroke}" stroke-width="3"></rect><rect x="-34" y="-7" width="44" height="5" rx="2.5" fill="${lineCol}"></rect><rect x="-34" y="3" width="28" height="5" rx="2.5" fill="${lineCol}" opacity=".6"></rect></g>`;

/* 1 · Sells you whatever you ask for → Say no when you’re not ready */
function sayNo(t: number) {
  const s = base(t), m = eio(P(t, 2.0, 3.0));
  let out = floor(s);
  // the ready gate, held by our teammate
  const g = spring(t, 2.15, 8, 6);
  if (g > 0.01)
    out +=
      `<g transform="translate(300 334) scale(1 ${Math.max(0, g).toFixed(3)})"><rect x="-4" y="-250" width="8" height="250" rx="4" fill="${C.deep}"></rect></g>` +
      `<g transform="translate(300 ${f1(98 - (1 - Math.min(1, g)) * 20)})" opacity="${o3(g)}"><rect x="-44" y="-18" width="88" height="34" rx="17" fill="${C.deep}"></rect>${mono(0, 4, "ready?", "#fff", 1, 13)}</g>`;
  out += person(95, 300, { shirt: "blue", skin: "skin2", seed: 1, pose: t < 1.3 ? "give" : "rest" }, s);
  out += person(520, 300, { shirt: "coral", skin: "skin1", seed: 2, hair: "b", dir: -1, pose: m > 0.4 ? "point" : "hold" }, s);
  out += mono(212, 100, "not yet", C.coral, P(t, 2.7, 3.1), 13);
  for (let k = 0; k < 5; k++) {
    const a = eo(P(t, 0.1 + 0.2 * k, 0.55 + 0.2 * k));
    const sx = 395 + [6, -8, 4, -5, 7][k], sy = 266 - k * 22, sr = [-7, 5, -3, 8, -5][k];
    let x = lerp(130, sx, a), y = lerp(250, sy, a) - Math.sin(a * Math.PI) * 60, r = sr * a;
    const chosen = k === 2, ri = k < 2 ? k : k - 1;
    if (m > 0) {
      x = lerp(sx, chosen ? 405 : 212, m);
      y = lerp(sy, chosen ? 180 : 132 + ri * 44, m);
      r = lerp(sr, 0, m);
    }
    if (a <= 0) continue;
    const fill = chosen ? mix(G.paper, C.blue, m) : tone("paper", s.c), stroke = chosen ? mix(G.deep, C.blue, m) : tone("line", s.c);
    const lines = chosen ? mix(G.deep, "#ffffff", m) : tone("line", s.c);
    out += card(x, y, r, fill, stroke, lines, chosen ? 1 : lerp(1, 0.75, m));
    if (a >= 1 && m <= 0.01) out += greyTick(x + 46, y - 12, P(t, 0.55 + 0.2 * k, 0.7 + 0.2 * k));
    if (m > 0 && !chosen) out += crossMark(x + 56, y, m);
    if (chosen && m > 0) out += tickMark(x + 58, y, Math.max(0, spring(t, 2.8, 10, 6)));
  }
  out += bubble(108, 176, "ok", Math.max(0, spring(t, 3.6, 9, 6)));
  out += burst(405, 180, s, 3.0);
  return out;
}

/* 2 · Bills the hours and ships a deck → Build it with you (the approved sample) */
function buildWith(t: number) {
  const s = base(t), m = s.c;
  let out = floor(s);
  const walk = eio(P(t, 2.05, 3.0)), deckK = eo(P(t, 0.55, 1.25)), scr = spring(t, 2.25, 8, 5.5), mate = spring(t, 2.7, 10, 6);
  if (m < 0.99) {
    const r = ((((t * 540) % 360) - 90) * Math.PI) / 180, cx = 470, cy = 112;
    out += `<g opacity="${o3(1 - m)}"><circle cx="${cx}" cy="${cy}" r="34" fill="${G.white}" stroke="${G.navy}" stroke-width="5"></circle><line x1="${cx}" y1="${cy}" x2="${f1(cx + Math.cos(r) * 24)}" y2="${f1(cy + Math.sin(r) * 24)}" stroke="${G.navy}" stroke-width="4.5" stroke-linecap="round"></line><line x1="${cx}" y1="${cy}" x2="${f1(cx + Math.cos(r / 12) * 15)}" y2="${f1(cy + Math.sin(r / 12) * 15)}" stroke="${G.navy}" stroke-width="5" stroke-linecap="round"></line><circle cx="${cx}" cy="${cy}" r="4" fill="${G.navy}"></circle></g>`;
    out += mono(470, 168, `hours ${12 + Math.floor(P(t, 0, 2) * 46)}`, "#8f97a3", 1 - m);
  }
  if (m > 0.01) out += desk(300, 262, 260, s, m);
  if (m < 0.99 && deckK > 0) {
    const dx = lerp(420, 245, deckK), dy = 250 - Math.sin(deckK * Math.PI) * 30;
    out += `<g opacity="${o3(1 - m)}">${[2, 1, 0].map((i) => `<rect x="${dx - 34 + i * 6}" y="${dy - 24 - i * 6}" width="68" height="46" rx="6" fill="${G.paper}" stroke="${G.deep}" stroke-width="3"></rect>`).join("")}<rect x="${dx - 24}" y="${dy - 12}" width="30" height="5" rx="2.5" fill="${G.deep}"></rect><rect x="${dx - 24}" y="${dy + 2}" width="40" height="5" rx="2.5" fill="${G.blue}"></rect></g>`;
  }
  const cols: Tone[] = ["blue", "coral", "amber", "mint", "blue", "deep"];
  if (scr > 0.01) {
    const cells = [[-78, -40, 70, 34], [0, -40, 78, 34], [-78, 2, 46, 40], [-26, 2, 50, 40], [30, 2, 48, 40], [-78, 50, 156, 12]];
    const inner = cells
      .map(([cx, cy, w, h], k) => {
        const b = Math.max(0, spring(t, 3.0 + k * 0.2, 11, 6.5));
        return b > 0.01 ? `<rect x="${f1(cx + w / 2 - (w / 2) * b)}" y="${f1(cy + h / 2 - (h / 2) * b)}" width="${f1(w * b)}" height="${f1(h * b)}" rx="7" fill="${tone(cols[k], s.c)}"></rect>` : "";
      })
      .join("");
    out += `<g transform="translate(300 196) scale(${Math.max(0, scr).toFixed(3)})"><rect x="-96" y="-74" width="192" height="148" rx="14" fill="${tone("white", s.c)}" stroke="${tone("navy", s.c)}" stroke-width="5"></rect><rect x="-96" y="-74" width="192" height="24" rx="12" fill="${tone("navy", s.c)}"></rect><rect x="-96" y="-58" width="192" height="8" fill="${tone("navy", s.c)}"></rect><circle cx="-80" cy="-62" r="4" fill="${tone("coral", s.c)}"></circle><circle cx="-67" cy="-62" r="4" fill="${tone("amber", s.c)}"></circle><circle cx="-54" cy="-62" r="4" fill="${tone("mint", s.c)}"></circle>${inner}</g>`;
  }
  const vx = lerp(455, 395, walk);
  cols.forEach((col, k) => {
    const h = P(t, 2.75 + k * 0.2, 3.0 + k * 0.2);
    if (h <= 0 || h >= 1) return;
    const fx = k % 2 ? vx : 175;
    out += `<rect x="${f1(lerp(fx, 300, eo(h)) - 7)}" y="${f1(lerp(240, 196, eo(h)) - Math.sin(h * Math.PI) * 50 - 7)}" width="14" height="14" rx="4" fill="${tone(col, s.c)}"></rect>`;
  });
  out += person(175, 300, { shirt: "blue", skin: "skin2", seed: 1 }, s);
  out += person(vx, 300, { shirt: "coral", skin: "skin1", seed: 2, hair: "b", dir: -1 }, s);
  out += person(500, 300, { shirt: "mint", skin: "skin3", seed: 3, hair: "d", scale: Math.max(0, mate), pose: P(t, 3.0, 3.3) * (1 - P(t, 4.0, 4.4)) > 0.2 ? "wave" : "rest" }, s);
  out += bubble(195, 172, "?", P(t, 1.1, 1.4) * (1 - P(t, 1.9, 2.2)));
  out += bubble(195, 172, "ok", Math.max(0, spring(t, 4.2, 9, 6)));
  out += burst(300, 196, s, 4.35);
  return out;
}

/* 3 · Is one of four vendors who never meet → Run four functions as one team */
function oneTeam(t: number) {
  const s = base(t), m = eio(P(t, 2.0, 3.1));
  const apart = [[85, 215], [515, 215], [175, 320], [425, 320]];
  const together = [[210, 300], [270, 300], [330, 300], [390, 300]];
  const keys: (keyof typeof ICON)[] = ["growth", "code", "ai", "legal"];
  const shirts: Tone[] = ["blue", "coral", "amber", "mint"], skins: Tone[] = ["skin2", "skin1", "skin3", "skin1"];
  const hairs: (keyof typeof HAIR)[] = ["a", "b", "d", "c"];
  let out = floor(s);
  if (m > 0.01) out += desk(300, 268, 280, s, m);
  // dashed reach that never connects (agency)
  if (m < 0.99)
    apart.forEach(([x, y], i) => {
      const nb = apart[[1, 3, 0, 2][i]], reach = 0.3 + Math.sin(t * 3 + i) * 0.06;
      out += `<line x1="${x}" y1="${y - 120}" x2="${f1(lerp(x, nb[0], reach))}" y2="${f1(lerp(y - 120, nb[1] - 120, reach))}" stroke="${G.deep}" stroke-width="3" stroke-dasharray="5 9" stroke-linecap="round" opacity="${o3(1 - m)}"></line>`;
    });
  // the four tiles: above each vendor, then gathered into one block
  const blk = eo(P(t, 2.75, 3.25));
  if (blk > 0.01)
    out += `<rect x="${f1(300 - 66 * blk)}" y="${f1(104 - 66 * blk)}" width="${f1(132 * blk)}" height="${f1(132 * blk)}" rx="${f1(Math.min(24, 66 * blk))}" fill="${C.white}" stroke="${C.deep}" stroke-width="4"></rect>`;
  const grid = [[272, 76], [328, 76], [272, 132], [328, 132]];
  keys.forEach((k, i) => {
    const [ax, ay] = apart[i], [gx, gy] = grid[i];
    const x = lerp(ax + Math.sin(t * 5 + i) * 3 * (1 - m), gx, m), y = lerp(ay - 128 + Math.cos(t * 4 + i) * 3 * (1 - m), gy, m);
    out += iconTile(x, y, k, shirts[i], s, lerp(1, 0.95, m));
  });
  out += mono(300, 210, "never meet", "#8f97a3", (1 - m) * P(t, 0.4, 1.0));
  keys.forEach((_, i) => {
    const [ax, ay] = apart[i], [tx, ty] = together[i];
    out += person(lerp(ax, tx, m), lerp(ay, ty, m), { shirt: shirts[i], skin: skins[i], hair: hairs[i], seed: i + 1, dir: m < 0.5 ? (ax < 300 ? -1 : 1) : 1, scale: lerp(0.9, 0.95, m) }, s);
  });
  out += mono(300, 192, "one team", C.deep, P(t, 3.1, 3.5));
  out += burst(300, 104, s, 3.25);
  return out;
}

/* 4 · Hands you a login and leaves → Build beside you, at the next desk */
function besideYou(t: number) {
  const s = base(t), m = eio(P(t, 2.0, 3.2));
  let out = floor(s);
  // door, only in the agency world
  if (m < 0.99)
    out += `<g opacity="${o3(1 - m)}"><rect x="520" y="140" width="62" height="194" rx="5" fill="${G.white}" stroke="${G.deep}" stroke-width="4"></rect><circle cx="534" cy="240" r="4.5" fill="${G.deep}"></circle></g>`;
  // founder at the first desk
  const lit1 = P(t, 2.9, 3.6), lit2 = P(t, 3.1, 3.8);
  out += person(175, 270, { shirt: "blue", skin: "skin2", seed: 1, pose: lit1 > 0 ? "type" : "rest" }, s);
  out += laptop(175, 262, s, lit1, 0) + desk(175, 262, 150, s);
  // the login handed over, then the vendor walks out
  const hand = eo(P(t, 0.15, 0.75)), leave = eio(P(t, 0.8, 1.9));
  if (m < 0.99) {
    const kx = lerp(320, 238, hand), ky = lerp(232, 238, hand) - Math.sin(hand * Math.PI) * 26;
    out += `<g transform="translate(${f1(kx)} ${f1(ky)})" opacity="${o3(1 - m)}"><rect x="-24" y="-14" width="48" height="28" rx="7" fill="${G.amber}" stroke="${G.deep}" stroke-width="2.5"></rect><circle cx="-9" cy="0" r="5" fill="none" stroke="${G.navy}" stroke-width="3"></circle><path d="M-4 0H13M9 0v5" stroke="${G.navy}" stroke-width="3" stroke-linecap="round"></path></g>`;
    out += mono(238, 212, "login", "#8f97a3", hand * (1 - m));
    out += person(lerp(335, 610, leave), 300 - Math.abs(Math.sin(leave * 14)) * 4, { shirt: "coral", skin: "skin1", seed: 2, hair: "b", pose: hand < 1 ? "give" : "rest", dir: leave > 0.05 ? 1 : -1, op: (1 - leave) * (1 - m) }, s);
  }
  // ours walks back in and sits at the next desk
  if (m > 0.01) {
    out += person(lerp(620, 425, m), lerp(300, 270, P(t, 2.8, 3.2)), { shirt: "coral", skin: "skin1", seed: 2, hair: "b", dir: -1, pose: lit2 > 0 ? "type" : "rest" }, s);
    out += `<g opacity="${o3(m)}">${laptop(425, 262, s, lit2, 1)}${desk(425, 262, 150, s)}</g>`;
    const pulse = 0.5 + Math.sin(t * 3) * 0.5;
    out += `<path d="M225 150Q300 ${f1(100 - pulse * 8)} 375 150" fill="none" stroke="${C.blue}" stroke-width="3.5" stroke-dasharray="2 10" stroke-linecap="round" opacity="${o3(P(t, 3.0, 3.4))}"></path>`;
    out += mono(300, 96, "next desk", C.deep, P(t, 3.1, 3.5));
    out += bubble(205, 150, "ok", Math.max(0, spring(t, 3.9, 9, 6)));
  }
  return out;
}

/* 5 · Reports fluff metrics → Report revenue, retention and runway */
function realMetrics(t: number) {
  const s = base(t), m = eio(P(t, 2.0, 3.0));
  let out = floor(s);
  // the board on an easel
  out += `<rect x="296" y="276" width="8" height="58" rx="3" fill="${tone("navy", s.c)}"></rect><rect x="150" y="66" width="300" height="214" rx="14" fill="${tone("white", s.c)}" stroke="${tone("navy", s.c)}" stroke-width="5"></rect>`;
  if (m < 0.99) {
    const o = 1 - m;
    out += mono(172, 98, "impressions ↑", "#8f97a3", o, 12, "start");
    for (let i = 0; i < 7; i++) {
      const h = 30 + Math.abs(Math.sin(t * (4 + i * 0.7) + i * 1.3)) * 100 * eo(P(t, 0.05 * i, 0.5 + 0.05 * i));
      out += `<rect x="${172 + i * 26}" y="${f1(262 - h)}" width="18" height="${f1(h)}" rx="4" fill="${i % 2 ? G.amber : G.blue}" opacity="${o3(o)}"></rect>`;
    }
    const sp = (x: number, y: number, k: number) =>
      `<path transform="translate(${x} ${y}) scale(${k.toFixed(3)})" d="M0 -11Q1.6 -1.6 11 0Q1.6 1.6 0 11Q-1.6 1.6 -11 0Q-1.6 -1.6 0 -11Z" fill="${G.amber}" opacity="${o3(o)}"></path>`;
    out += sp(400, 106, 0.6 + Math.abs(Math.sin(t * 5)) * 0.6) + sp(425, 140, 0.4 + Math.abs(Math.sin(t * 4 + 1)) * 0.5) + sp(388, 150, 0.35 + Math.abs(Math.sin(t * 6 + 2)) * 0.45);
    out += `<circle cx="410" cy="228" r="24" fill="none" stroke="${G.line}" stroke-width="9" opacity="${o3(o)}"></circle><circle cx="410" cy="228" r="24" fill="none" stroke="${G.deep}" stroke-width="9" pathLength="1" stroke-dasharray="0.3 1" transform="rotate(${f1(t * 200)} 410 228)" opacity="${o3(o)}"></circle>`;
  }
  if (m > 0.01) {
    (
      [
        ["revenue", 108],
        ["retention", 172],
        ["runway", 236],
      ] as const
    ).forEach(([label, y], i) => {
      const a = P(t, 2.5 + i * 0.25, 3.1 + i * 0.25), k = eo(P(t, 2.7 + i * 0.25, 3.7 + i * 0.25));
      out += mono(172, y + 5, label, C.navy, a, 13, "start");
      out += `<path d="M268 ${y + 18}H428" stroke="${C.line}" stroke-width="2" opacity="${o3(a)}"></path>`;
      if (i === 0) out += `<path d="M268 ${y + 12}L308 ${y + 4}L340 ${y + 6}L380 ${y - 8}L428 ${y - 22}" fill="none" stroke="${C.blue}" stroke-width="5" stroke-linecap="round" stroke-linejoin="round" pathLength="1" stroke-dasharray="1 1" stroke-dashoffset="${(1 - k).toFixed(3)}"></path>`;
      if (i === 1) out += `<path d="M268 ${y - 10}C290 ${y + 6} 310 ${y + 2} 340 ${y + 2}H428" fill="none" stroke="${C.mint}" stroke-width="5" stroke-linecap="round" pathLength="1" stroke-dasharray="1 1" stroke-dashoffset="${(1 - k).toFixed(3)}"></path>`;
      if (i === 2) out += `<rect x="268" y="${y - 9}" width="${f1(160 * k)}" height="18" rx="9" fill="${C.amber}"></rect>`;
    });
  }
  out += person(95, 300, { shirt: "blue", skin: "skin2", seed: 1 }, s);
  out += person(510, 300, { shirt: "coral", skin: "skin1", seed: 2, hair: "b", dir: -1, pose: "point" }, s);
  out += bubble(118, 168, "?", P(t, 0.9, 1.2) * (1 - P(t, 1.9, 2.2)));
  out += bubble(118, 168, "ok", Math.max(0, spring(t, 4.0, 9, 6)));
  return out;
}

/* 6 · Sends a moving invoice → Publish one price; the scope moves, the number doesn’t */
function onePrice(t: number) {
  const s = base(t), m = eio(P(t, 2.0, 3.0));
  let out = floor(s);
  if (m < 0.99) {
    // the invoice keeps unrolling; the total line grows and an arrow keeps rising
    const o = 1 - m, grow = P(t, 0.2, 1.9), lines = 3 + Math.floor(grow * 5), h = 90 + lines * 18;
    const top = 70, x0 = 230;
    out += `<g opacity="${o3(o)}"><rect x="${x0}" y="${top}" width="140" height="${f1(h)}" rx="8" fill="${G.paper}" stroke="${G.deep}" stroke-width="3.5"></rect>`;
    out += mono(x0 + 16, top + 24, "INVOICE", "#8f97a3", 1, 11, "start");
    for (let i = 0; i < lines; i++) {
      const y = top + 44 + i * 18, isNew = i >= 3;
      out += `<rect x="${x0 + 16}" y="${y}" width="${isNew ? 70 : 58}" height="6" rx="3" fill="${isNew ? G.deep : G.line}"></rect><rect x="${x0 + 100}" y="${y}" width="24" height="6" rx="3" fill="${G.line}"></rect>`;
      if (isNew) out += mono(x0 + 92, y + 7, "+", G.navy, 1, 12, "start");
    }
    out += `<rect x="${f1(x0 + 124 - lerp(30, 80, grow))}" y="${f1(top + h - 22)}" width="${f1(lerp(30, 80, grow))}" height="9" rx="4.5" fill="${G.navy}"></rect>`;
    const ay = top + h - 18 - grow * 30 + Math.sin(t * 6) * 3;
    out += `<path d="M${x0 + 168} ${f1(ay + 22)}V${f1(ay - 18)}M${x0 + 156} ${f1(ay - 6)}L${x0 + 168} ${f1(ay - 18)}L${x0 + 180} ${f1(ay - 6)}" fill="none" stroke="${G.navy}" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"></path></g>`;
  }
  if (m > 0.01) {
    // one price, locked; the scope keeps rearranging underneath
    const sTag = Math.max(0, spring(t, 2.2, 9, 6));
    out += `<g transform="translate(300 104) scale(${sTag.toFixed(3)})"><path d="M-124 -34H100L128 0L100 34H-124Z" fill="${C.blue}"></path><circle cx="108" cy="0" r="6" fill="#fff"></circle>
      <g transform="translate(-96 -4)"><rect x="-11" y="-2" width="22" height="18" rx="4" fill="#fff"></rect><path d="M-6 -2v-5a6 6 0 0 1 12 0v5" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round"></path></g>
      <text x="10" y="8" text-anchor="middle" font-size="26" font-weight="700" fill="#fff">₹3,00,000</text><text x="10" y="26" text-anchor="middle" font-size="11" fill="#fff" opacity=".85" style="font-family:var(--font-mono);letter-spacing:1px">+ GST</text></g>`;
    out += mono(300, 162, "the number doesn’t move", C.deep, P(t, 2.9, 3.3), 12);
    const slots = [[200, 236], [262, 236], [324, 236], [386, 236], [231, 282], [293, 282], [355, 282]];
    const n = Math.floor(Math.max(0, t - 3.0) / 0.9), bl = eio((Math.max(0, t - 3.0) / 0.9) % 1);
    const perm = (q: number) => [0, 1, 2, 3, 4].map((i) => (i * 3 + q) % 7), A = perm(n), B = perm(n + 1);
    const cols: Tone[] = ["coral", "amber", "mint", "violet", "blue"];
    for (let i = 0; i < 5; i++) {
      const a = slots[A[i]], b = slots[B[i]], k = t > 3.0 ? bl : 0, si = Math.max(0, spring(t, 2.5 + i * 0.08, 10, 6));
      const x = lerp(a[0], b[0], k), y = lerp(a[1], b[1], k) - Math.sin(k * Math.PI) * 12;
      out += `<rect x="${f1(x - 26 * si)}" y="${f1(y - 18 * si)}" width="${f1(52 * si)}" height="${f1(36 * si)}" rx="9" fill="${tone(cols[i], s.c)}"></rect>`;
    }
    out += mono(300, 322, "the scope moves", "#8f97a3", P(t, 3.0, 3.4), 12);
  }
  out += person(95, 300, { shirt: "blue", skin: "skin2", seed: 1 }, s);
  out += person(510, 300, { shirt: "coral", skin: "skin1", seed: 2, hair: "b", dir: -1, pose: m > 0.5 ? "point" : "give" }, s);
  out += bubble(118, 168, "?", P(t, 1.0, 1.3) * (1 - P(t, 1.9, 2.2)));
  out += bubble(118, 168, "ok", Math.max(0, spring(t, 3.9, 9, 6)));
  return out;
}

const SCENES = [sayNo, buildWith, oneTeam, besideYou, realMetrics, onePrice];

/** The SVG markup for comparison `i` at `t` seconds into its timeline. */
export const renderCompareArt = (i: number, t: number) => SCENES[i](t);
