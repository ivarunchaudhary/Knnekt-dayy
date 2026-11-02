import type { CSSProperties } from "react";
import type { RoleArtKind } from "@/lib/data";

/** Stagger index for the entrance and idle animations. */
const i = (n: number) => ({ "--i": n }) as CSSProperties;

/** Growth: four bars climbing, the last in the function's colour, a trend line drawn over them. */
function Growth() {
  const bars = [
    { x: 22, h: 22 },
    { x: 42, h: 34 },
    { x: 62, h: 48 },
    { x: 82, h: 66 },
  ];
  return (
    <>
      <line className="ra-inks" x1="14" y1="96.5" x2="106" y2="96.5" strokeWidth="1.5" strokeLinecap="round" opacity=".25" />
      {bars.map((b, n) => (
        <rect key={b.x} className={`ra-bar ${n === 3 ? "ra-c" : "ra-w ra-lift"}`} style={i(n)} x={b.x} y={96 - b.h} width="14" height={b.h} rx="3" />
      ))}
      <path className="ra-inks ra-draw" pathLength={1} d="M24 66 L49 54 L69 40 L92 20" fill="none" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      <path className="ra-inks ra-pop" style={i(5)} d="M83 19 L93 19 L93 29" fill="none" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
    </>
  );
}

/** Technology: an editor window with a few lines of code and a blinking cursor. */
function Technology() {
  return (
    <>
      <rect className="ra-w ra-lift" x="14" y="24" width="92" height="70" rx="9" />
      <path className="ra-c" d="M14 33a9 9 0 0 1 9-9h74a9 9 0 0 1 9 9v4H14z" />
      {[24, 31, 38].map((cx) => (
        <circle key={cx} className="ra-w" cx={cx} cy="30.5" r="2.2" />
      ))}
      <g className="ra-type">
        <rect className="ra-c" style={i(0)} x="24" y="47" width="10" height="4.5" rx="2.25" />
        <rect className="ra-faint" style={i(0)} x="38" y="47" width="32" height="4.5" rx="2.25" />
        <rect className="ra-faint" style={i(1)} x="32" y="57" width="20" height="4.5" rx="2.25" />
        <rect className="ra-c" style={i(1)} x="56" y="57" width="18" height="4.5" rx="2.25" opacity=".6" />
        <rect className="ra-faint" style={i(2)} x="32" y="67" width="36" height="4.5" rx="2.25" />
        <rect className="ra-c" style={i(3)} x="24" y="77" width="8" height="4.5" rx="2.25" />
      </g>
      <rect className="ra-ink ra-blink" x="36" y="75" width="2.5" height="8.5" rx="1" />
    </>
  );
}

/** AI: a small network, three layers deep, with a spark where the answer comes out. */
function Ai() {
  const layers = [
    [40, 60, 80],
    [30, 50, 70, 90],
    [48, 72],
  ];
  const xs = [24, 60, 96];
  const links: [number, number, number, number][] = [];
  layers.slice(0, -1).forEach((ys, l) => ys.forEach((y1) => layers[l + 1].forEach((y2) => links.push([xs[l], y1, xs[l + 1], y2]))));
  return (
    <>
      <g className="ra-inks ra-draw-soft" strokeWidth="1.25" opacity=".22">
        {links.map(([x1, y1, x2, y2]) => (
          <line key={`${x1}-${y1}-${y2}`} x1={x1} y1={y1} x2={x2} y2={y2} />
        ))}
      </g>
      {layers.map((ys, l) =>
        ys.map((y) => (
          <circle key={`${l}-${y}`} className={`ra-pop ra-node ${l === 2 ? "ra-c" : "ra-w ra-cs"}`} style={i(l)} cx={xs[l]} cy={y} r={l === 2 ? 6.5 : 5} strokeWidth="2" />
        )),
      )}
      <path className="ra-ink ra-twinkle" d="M100 14 Q101.6 21.4 109 23 Q101.6 24.6 100 32 Q98.4 24.6 91 23 Q98.4 21.4 100 14z" />
    </>
  );
}

/** Legal & compliance: a contract with a signature and a seal stamped on its edge. */
function Legal() {
  return (
    <>
      <path className="ra-w ra-lift" d="M30 16h42l18 18v68a4 4 0 0 1-4 4H30a4 4 0 0 1-4-4V20a4 4 0 0 1 4-4z" />
      <path className="ra-c" d="M72 16v14a4 4 0 0 0 4 4h14z" opacity=".3" />
      {[
        [40, 40],
        [50, 46],
        [60, 34],
        [70, 24],
      ].map(([y, w], n) => (
        <rect key={y} className="ra-faint ra-type" style={i(n)} x="36" y={y} width={w} height="4.5" rx="2.25" />
      ))}
      <path className="ra-inks ra-draw" pathLength={1} d="M36 90c4-8 7-8 8-2s4 6 7-2 5-5 6 0 3 4 7 1" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <g className="ra-pop" style={i(4)}>
        <circle className="ra-c" cx="86" cy="86" r="14" />
        <circle cx="86" cy="86" r="10.5" fill="none" stroke="#fff" strokeWidth="1" strokeDasharray="2 2" opacity=".8" />
        <path d="M80 86.5l4 4 8-9" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      </g>
    </>
  );
}

/** Design: a pen-tool curve with its handles out, and the palette beneath it. */
function Design() {
  return (
    <>
      <g className="ra-cs" strokeWidth="1.5" opacity=".9">
        <line x1="16" y1="76" x2="32" y2="24" />
        <line x1="104" y1="70" x2="82" y2="22" />
      </g>
      <path className="ra-inks ra-draw" pathLength={1} d="M16 76C32 24 82 22 104 70" fill="none" strokeWidth="3" strokeLinecap="round" />
      <circle className="ra-c ra-pop" style={i(1)} cx="32" cy="24" r="3.5" />
      <circle className="ra-c ra-pop" style={i(2)} cx="82" cy="22" r="3.5" />
      <rect className="ra-w ra-cs ra-pop" style={i(0)} x="12" y="72" width="8" height="8" rx="1.5" strokeWidth="2" />
      <rect className="ra-w ra-cs ra-pop" style={i(3)} x="100" y="66" width="8" height="8" rx="1.5" strokeWidth="2" />
      {[
        ["ra-c", 34],
        ["ra-w ra-lift", 52],
        ["ra-ink", 70],
      ].map(([cls, cx], n) => (
        <circle key={cx} className={`${cls} ra-pop`} style={i(n + 4)} cx={cx} cy="100" r="8" />
      ))}
    </>
  );
}

/** Studio partner: a month on the calendar with the same day ringed every week — the weekly 1:1. */
function Partner() {
  const cols = [30, 45, 60, 75, 90];
  const rows = [56, 69, 82, 95];
  return (
    <>
      <rect className="ra-w ra-lift" x="16" y="22" width="88" height="84" rx="10" />
      <path className="ra-c" d="M16 32a10 10 0 0 1 10-10h68a10 10 0 0 1 10 10v8H16z" />
      <rect className="ra-ink" x="36" y="15" width="4.5" height="13" rx="2.25" />
      <rect className="ra-ink" x="79.5" y="15" width="4.5" height="13" rx="2.25" />
      {rows.map((y, r) =>
        cols.map((x, c) =>
          c === 3 ? (
            <circle key={`${r}-${c}`} className="ra-c ra-pop ra-week" style={i(r)} cx={x} cy={y} r="5.5" />
          ) : (
            <rect key={`${r}-${c}`} className="ra-faint" x={x - 3} y={y - 3} width="6" height="6" rx="1.5" />
          ),
        ),
      )}
    </>
  );
}

const ART: Record<RoleArtKind, () => React.JSX.Element> = {
  growth: Growth,
  technology: Technology,
  ai: Ai,
  legal: Legal,
  design: Design,
  partner: Partner,
};

/**
 * An illustration of what a role produces, standing in for a portrait while
 * the team stays unnamed. Drawn in white and navy, accented in the card's `--c`.
 */
export default function RoleArt({ kind }: { kind: RoleArtKind }) {
  const Art = ART[kind];
  return (
    <svg className="ra" viewBox="0 0 120 120" aria-hidden="true">
      <Art />
    </svg>
  );
}
