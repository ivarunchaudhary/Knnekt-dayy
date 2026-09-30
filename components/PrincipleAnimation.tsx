"use client";

import { useRef } from "react";
import { ACCENT, INK, Person, back, cubic, draw, inOut, lerp, mix, out, prog, pt, quad, useLoopClock, type Pt } from "./ServiceAnimation";

/**
 * One short line drawing per principle card, in the services' vocabulary. Each
 * loop is the card's two lines acted out in order: the agency habit first, drawn
 * faint, then what we do instead, in ink with the one blue accent.
 */

const W = 600;
const H = 424;
const LOOP = 7.5;
/** When "us" takes over from "agency". */
const TURN = 3;
/** Under reduced motion, hold on the answer. */
const STILL = 6.2;

const line = { fill: "none", stroke: INK, strokeWidth: 3.5, strokeLinecap: "round", strokeLinejoin: "round" } as const;
const hair = { ...line, strokeWidth: 2.5, strokeOpacity: 0.25 } as const;
const mono = { fontFamily: "var(--font-mono)", letterSpacing: 1 } as const;

const TAU = Math.PI * 2;
/** Point on a circle, angle in degrees counter-clockwise from 3 o'clock. */
const polar = (c: Pt, r: number, deg: number): Pt => [c[0] + r * Math.cos((deg * Math.PI) / 180), c[1] - r * Math.sin((deg * Math.PI) / 180)];

/* ------------------------------------------------------------------------- *
 * 01 · Sells whatever you ask for → says no when you're not ready.           *
 * ------------------------------------------------------------------------- */

const G_C: Pt = [180, 290];

function SayNo({ t }: { t: number }) {
  const needle = lerp(178, 146, out(prog(t, 3.2, 4.2))) + 3 * Math.sin(t * 5) * prog(t, 4, 4.4);
  const stamp = prog(t, 4.4, 4.8);
  return (
    <>
      <Agency t={t}>
        {[0, 1, 2].map((i) => {
          const y = 110 + i * 78;
          const s = prog(t, 0.2 + i * 0.5, 0.6 + i * 0.5);
          return (
            <g key={i} opacity={s} transform={`translate(0 ${(1 - out(s)) * 12})`}>
              <rect x={190} y={y} width={220} height={54} rx={10} {...line} />
              <path d={`M214 ${y + 27}H320`} {...line} strokeOpacity={0.4} />
              <path d={`M358 ${y + 28}l10 10l20 -22`} {...line} {...draw(prog(t, 0.6 + i * 0.5, 0.9 + i * 0.5))} />
            </g>
          );
        })}
      </Agency>
      <Us t={t}>
        {/* Readiness: the needle sits low */}
        <path d={`M${pt(polar(G_C, 110, 180))}A110 110 0 0 1 ${pt(polar(G_C, 110, 0))}`} {...hair} {...draw(inOut(prog(t, 3, 3.6)))} />
        <path d={`M${pt(polar(G_C, 110, 180))}A110 110 0 0 1 ${pt(polar(G_C, 110, needle))}`} {...line} stroke={ACCENT} strokeWidth={8} opacity={prog(t, 3.2, 3.4)} />
        {[180, 135, 90, 45, 0].map((d) => (
          <path key={d} d={`M${pt(polar(G_C, 124, d))}L${pt(polar(G_C, 134, d))}`} {...hair} opacity={prog(t, 3.3, 3.6)} />
        ))}
        <path d={`M${pt(G_C)}L${pt(polar(G_C, 84, needle))}`} {...line} opacity={prog(t, 3.2, 3.4)} />
        <circle cx={G_C[0]} cy={G_C[1]} r={9} fill={INK} opacity={prog(t, 3.2, 3.4)} />
        <text x={G_C[0]} y={G_C[1] + 44} textAnchor="middle" fontSize={20} fill={INK} fillOpacity={0.5} opacity={prog(t, 3.4, 3.7)} style={mono}>
          ready?
        </text>

        {/* The ask, and the stamp that answers it */}
        <g opacity={prog(t, 3.3, 3.6)}>
          <rect x={350} y={150} width={180} height={76} rx={12} {...line} />
          <path d="M376 180H470M376 200H440" {...line} strokeOpacity={0.4} />
        </g>
        {stamp > 0 && (
          <g transform={`translate(440 188) rotate(-12) scale(${lerp(1.5, 1, back(stamp))})`} opacity={stamp}>
            <circle r={58} {...line} stroke={ACCENT} strokeWidth={6} />
            <path d="M-41 41L41 -41" {...line} stroke={ACCENT} strokeWidth={6} />
          </g>
        )}
        <text x={440} y={296} textAnchor="middle" fontSize={20} fill={ACCENT} opacity={prog(t, 4.8, 5.1)} style={mono}>
          not yet
        </text>
      </Us>
    </>
  );
}

/* ------------------------------------------------------------------------- *
 * 02 · Bills the hours and ships a deck → builds it with you.                *
 * ------------------------------------------------------------------------- */

const B_YOU: Pt = [140, 330];
const B_US: Pt = [460, 330];
const B_BLOCKS: Pt[] = [[268, 314], [332, 314], [268, 274], [332, 274], [300, 234]];

function Build({ t }: { t: number }) {
  return (
    <>
      <Agency t={t}>
        {/* The clock runs fast; the deck is what you get for it */}
        <circle cx={170} cy={200} r={70} {...line} />
        <path d={`M170 200L${pt(polar([170, 200], 52, 90 - t * 480))}`} {...line} />
        <path d={`M170 200L${pt(polar([170, 200], 34, 90 - t * 40))}`} {...line} />
        {[2, 1, 0].map((k) => (
          <rect key={k} x={310 + k * 14} y={140 - k * 14} width={190} height={124} rx={8} {...line} fill="#e9f1fb" opacity={prog(t, 0.6 + (2 - k) * 0.3, 0.9 + (2 - k) * 0.3)} />
        ))}
        <path d="M334 236V206M364 236V186M394 236V196" {...line} {...draw(prog(t, 1.6, 2.2))} />
      </Agency>
      <Us t={t}>
        <path d="M80 350H520" {...hair} {...draw(inOut(prog(t, 3, 3.5)))} />
        <Person at={B_YOU} s={2} opacity={prog(t, 3.1, 3.4)} />
        <Person at={B_US} s={2} color={ACCENT} opacity={prog(t, 3.1, 3.4)} />
        {B_BLOCKS.map((to, i) => {
          const from: Pt = i % 2 ? [B_US[0] - 20, B_US[1] - 30] : [B_YOU[0] + 20, B_YOU[1] - 30];
          const p = inOut(prog(t, 3.4 + i * 0.45, 3.9 + i * 0.45));
          if (p <= 0) return null;
          const at = quad(from, [(from[0] + to[0]) / 2, to[1] - 90], to, p);
          const last = i === B_BLOCKS.length - 1;
          return <rect key={i} x={at[0] - 30} y={at[1] - 18} width={60} height={36} rx={6} {...line} fill={last && p === 1 ? ACCENT : "none"} stroke={last ? ACCENT : INK} />;
        })}
      </Us>
    </>
  );
}

/* ------------------------------------------------------------------------- *
 * 03 · Four vendors who never meet → one studio, four functions.             *
 * ------------------------------------------------------------------------- */

const S_APART: Pt[] = [[110, 100], [480, 120], [130, 320], [470, 310]];
const S_TOGETHER: Pt[] = [[262, 174], [338, 174], [262, 250], [338, 250]];
/** The four functions: growth, technology, AI, legal. */
const S_GLYPHS = [
  <path key="g" d="M-14 10L-3 -1L4 6L14 -8M6 -8H14V0" />,
  <path key="t" d="M-8 -8L-16 0L-8 8M8 -8L16 0L8 8" />,
  <path key="a" d="M0 -15Q2 -2 15 0Q2 2 0 15Q-2 2 -15 0Q-2 -2 0 -15Z" />,
  <path key="l" d="M-11 -15H6L12 -9V15H-11ZM-5 -3H6M-5 5H6" />,
];

function Studio({ t }: { t: number }) {
  const join = inOut(prog(t, 3, 4));
  return (
    <g opacity={prog(t, 0, 0.3) * (1 - prog(t, LOOP - 0.6, LOOP))}>
      <rect x={200} y={112} width={200} height={200} rx={26} {...line} {...draw(inOut(prog(t, 3.8, 4.5)))} />
      {S_APART.map((a, i) => {
        const jitter: Pt = [Math.sin(t * 2.3 + i * 2) * 5 * (1 - join), Math.cos(t * 1.9 + i) * 5 * (1 - join)];
        const at = mix([a[0] + jitter[0], a[1] + jitter[1]], S_TOGETHER[i], join);
        const from = mix(a, [300, 212], 0.14);
        const toward = mix(a, [300, 212], 0.38);
        return (
          <g key={i}>
            {/* Apart, each one reaches for the others and stops short */}
            <path d={`M${pt(from)}L${pt(toward)}`} {...hair} strokeDasharray="4 10" opacity={prog(t, 0.6, 1) * (1 - prog(t, 2.6, 3))} />
            <g transform={`translate(${pt(at)})`} opacity={lerp(0.45, 1, join) * prog(t, 0.1 + i * 0.12, 0.4 + i * 0.12)}>
              <rect x={-28} y={-28} width={56} height={56} rx={10} {...line} fill="#e9f1fb" />
              <g {...line} strokeWidth={3}>
                {S_GLYPHS[i]}
              </g>
            </g>
          </g>
        );
      })}
      <circle cx={300} cy={212} r={9 * back(prog(t, 4.4, 4.8))} fill={ACCENT} />
    </g>
  );
}

/* ------------------------------------------------------------------------- *
 * 04 · Hands you a login and leaves → owns the outcome.                      *
 * ------------------------------------------------------------------------- */

const O_PATH: [Pt, Pt, Pt, Pt] = [[100, 340], [250, 340], [320, 150], [450, 136]];

function Outcome({ t }: { t: number }) {
  const walk = inOut(prog(t, 3.4, 5.2));
  const at = cubic(...O_PATH, walk);
  const flag = back(prog(t, 5.1, 5.5));
  return (
    <>
      <Agency t={t}>
        <rect x={150} y={110} width={220} height={150} rx={12} {...line} {...draw(inOut(prog(t, 0.2, 0.8)))} />
        <rect x={176} y={144} width={168} height={32} rx={6} {...line} opacity={prog(t, 0.7, 0.9)} />
        <rect x={176} y={192} width={168} height={32} rx={6} {...line} opacity={prog(t, 0.8, 1)} />
        {[0, 1, 2, 3, 4].map((i) => (
          <circle key={i} cx={196 + i * 18} cy={208} r={4} fill={INK} opacity={prog(t, 1 + i * 0.1, 1.1 + i * 0.1)} />
        ))}
        <Person at={[110, 330]} s={2} opacity={prog(t, 0.3, 0.6)} />
        <Person at={[lerp(420, 640, inOut(prog(t, 1.5, 2.8))), 330]} s={2} opacity={prog(t, 0.3, 0.6)} />
      </Agency>
      <Us t={t}>
        <path d="M100 360H500M100 360V100" {...hair} {...draw(inOut(prog(t, 3, 3.5)))} />
        <path d={`M${pt(O_PATH[0])}C${pt(O_PATH[1])} ${pt(O_PATH[2])} ${pt(O_PATH[3])}`} {...line} {...draw(walk)} />
        {/* You and us, walking it together */}
        <Person at={[at[0] - 16, at[1] - 22]} s={1.4} opacity={prog(t, 3.2, 3.5)} />
        <Person at={[at[0] + 16, at[1] - 22]} s={1.4} color={ACCENT} opacity={prog(t, 3.2, 3.5)} />
        <path d="M510 136V70" {...line} {...draw(prog(t, 4.9, 5.2))} />
        {flag > 0 && <path d={`M510 72L${pt([510 + 44 * flag, 86])}L510 100Z`} fill={ACCENT} />}
      </Us>
    </>
  );
}

/* ------------------------------------------------------------------------- *
 * 05 · Fluff metrics on a dashboard → revenue, retention, runway.            *
 * ------------------------------------------------------------------------- */

const M_ROWS = ["revenue", "retention", "runway"];

function Metrics({ t }: { t: number }) {
  return (
    <>
      <Agency t={t}>
        <rect x={80} y={70} width={440} height={280} rx={14} {...line} {...draw(inOut(prog(t, 0.1, 0.7)))} />
        {/* Numbers that move a lot and mean little */}
        {[0, 1, 2, 3, 4, 5].map((i) => {
          const h = 50 + 40 * Math.abs(Math.sin(t * 3.1 + i * 1.7));
          return <rect key={i} x={120 + i * 36} y={310 - h * prog(t, 0.5, 1)} width={22} height={h * prog(t, 0.5, 1)} rx={4} fill={INK} />;
        })}
        <g transform={`translate(420 190) rotate(${t * 120})`} opacity={prog(t, 0.6, 1)}>
          <circle r={56} {...line} strokeWidth={18} strokeOpacity={0.35} />
          <circle r={56} {...line} strokeWidth={18} strokeDasharray={`${56 * TAU * 0.3} ${56 * TAU}`} />
        </g>
        <text x={110} y={110} fontSize={18} fill={INK} style={mono} opacity={prog(t, 0.8, 1)}>
          impressions ↑
        </text>
      </Agency>
      <Us t={t}>
        {M_ROWS.map((name, i) => (
          <g key={name} opacity={prog(t, 3.1 + i * 0.3, 3.4 + i * 0.3)}>
            <text x={70} y={134 + i * 100} fontSize={20} fill={INK} fillOpacity={0.55} style={mono}>
              {name}
            </text>
            {i < 2 && <path d={`M250 ${150 + i * 100}H530`} {...hair} />}
          </g>
        ))}
        <path d="M250 144L310 132L360 136L420 114L470 100L530 80" {...line} stroke={ACCENT} {...draw(inOut(prog(t, 3.3, 4.6)))} />
        <path d="M250 198Q280 226 320 228T530 224" {...line} {...draw(inOut(prog(t, 3.6, 4.9)))} />
        <rect x={250} y={306} width={280 * out(prog(t, 3.9, 5.2))} height={24} rx={6} fill={INK} />
        {[0, 1, 2, 3, 4, 5, 6].map((k) => (
          <path key={k} d={`M${250 + k * 40} 340V348`} {...hair} opacity={prog(t, 4, 4.4)} />
        ))}
      </Us>
    </>
  );
}

/* ------------------------------------------------------------------------- *
 * 06 · A hidden, moving invoice → fixed price, flexible scope.               *
 * ------------------------------------------------------------------------- */

const P_LAYOUTS: Pt[][] = [
  [[410, 186], [466, 186], [410, 238], [466, 238]],
  [[386, 212], [424, 212], [462, 212], [500, 212]],
];

function Price({ t }: { t: number }) {
  const lines = Math.min(7, Math.floor(prog(t, 0.4, 2.4) * 8));
  const lock = inOut(prog(t, 3.8, 4.3));
  const flex = (1 - Math.cos(Math.max(0, t - 4.4) * 1.8)) / 2;
  const frame = lerp(132, 164, flex);
  return (
    <>
      <Agency t={t}>
        <rect x={210} y={60} width={180} height={120 + lines * 26} rx={10} {...line} />
        {Array.from({ length: lines }, (_, i) => (
          <path key={i} d={`M234 ${96 + i * 26}H${320 - ((i * 37) % 50)}M346 ${96 + i * 26}H366`} {...line} strokeOpacity={0.5} />
        ))}
        <path d={`M234 ${150 + lines * 26}H${280 + lines * 12}`} {...line} strokeWidth={8} />
      </Agency>
      <Us t={t}>
        {/* The price: tagged, then locked */}
        <g opacity={prog(t, 3, 3.3)}>
          <path d="M250 180H150L118 212L150 244H250Z" {...line} />
          <circle cx={146} cy={212} r={6} {...line} strokeWidth={3} />
          <path d="M172 212H226" {...line} strokeWidth={8} />
        </g>
        <g opacity={prog(t, 3.4, 3.7)}>
          <path d={`M228 ${236 - 12 * (1 - lock)}V${224 - 12 * (1 - lock)}A14 14 0 0 1 256 ${224 - 12 * (1 - lock)}V${236 - 12 * (1 - lock)}`} {...line} stroke={ACCENT} />
          <rect x={218} y={232} width={48} height={38} rx={7} fill={ACCENT} />
        </g>
        <text x={184} y={316} textAnchor="middle" fontSize={20} fill={INK} fillOpacity={0.55} opacity={prog(t, 4.2, 4.5)} style={mono}>
          fixed
        </text>

        {/* The scope: free to reshape inside it */}
        <rect x={438 - frame / 2 - (flex * 26)} y={212 - lerp(76, 44, flex)} width={frame + flex * 52} height={lerp(152, 88, flex)} rx={14} {...hair} strokeDasharray="6 10" strokeOpacity={0.5} opacity={prog(t, 3.2, 3.5)} />
        {P_LAYOUTS[0].map((a, i) => {
          const at = mix(a, P_LAYOUTS[1][i], flex);
          return <rect key={i} x={at[0] - 16} y={at[1] - 16} width={32} height={32} rx={6} {...line} opacity={prog(t, 3.3 + i * 0.1, 3.6 + i * 0.1)} />;
        })}
        <text x={440} y={316} textAnchor="middle" fontSize={20} fill={INK} fillOpacity={0.55} opacity={prog(t, 4.2, 4.5)} style={mono}>
          flexible
        </text>
      </Us>
    </>
  );
}

/* ------------------------------------------------------------------------- */

/** The habit, faint, for the first half of the loop. */
function Agency({ t, children }: { t: number; children: React.ReactNode }) {
  const o = prog(t, 0, 0.3) * (1 - prog(t, TURN - 0.4, TURN));
  return o > 0 ? <g opacity={o * 0.45}>{children}</g> : null;
}

/** What we do instead, from the turn until the loop fades. */
function Us({ t, children }: { t: number; children: React.ReactNode }) {
  const o = prog(t, TURN - 0.1, TURN + 0.2) * (1 - prog(t, LOOP - 0.6, LOOP));
  return o > 0 ? <g opacity={o}>{children}</g> : null;
}

/** "agency" then "knnekt", top left, naming whose half is on screen. */
function Label({ t }: { t: number }) {
  const a = prog(t, 0.1, 0.4) * (1 - prog(t, TURN - 0.4, TURN));
  const b = prog(t, TURN, TURN + 0.3) * (1 - prog(t, LOOP - 0.6, LOOP));
  return (
    <>
      {a > 0 && (
        <text x={32} y={46} fontSize={18} fill={INK} fillOpacity={0.45} opacity={a} style={mono}>
          AGENCY
        </text>
      )}
      {b > 0 && (
        <text x={32} y={46} fontSize={18} fill={ACCENT} opacity={b} style={mono}>
          KNNEKT
        </text>
      )}
    </>
  );
}

const scenes = [SayNo, Build, Studio, Outcome, Metrics, Price];

export default function PrincipleAnimation({ index }: { index: number }) {
  const svg = useRef<SVGSVGElement>(null);
  const t = useLoopClock(svg, LOOP, STILL);
  const Draw = scenes[index];
  if (!Draw) return null;
  return (
    <svg ref={svg} viewBox={`0 0 ${W} ${H}`} className="block size-full" aria-hidden="true">
      <Draw t={t} />
      <Label t={t} />
    </svg>
  );
}

