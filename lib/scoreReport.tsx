/**
 * The founder's report as a PDF, four A4 pages: the diagnosis, the 100 days,
 * the fee and scholarships, and what happens next, in the site's type and
 * palette. The answers stay out of it; they live behind "Your answers" on the
 * result screen and in the webhook's payload. The API route attaches this to
 * the founder's email, copies the studio, and forwards it to the webhook, so
 * every copy is the same document. The logo links back to the site, and the
 * studio's number and email are tappable. Where the people and stories are
 * still to be signed, the section says so with a dashed "Placeholder" tag.
 */
import { join } from "node:path";
import { Circle, Defs, Document, Font, Image, LinearGradient, Link, Page, Path, Rect, Stop, StyleSheet, Svg, Text, View, renderToBuffer, type Styles } from "@react-pdf/renderer";
import { LOCKUP_PATH, LOCKUP_RATIO, LOCKUP_VIEWBOX } from "./brand";
import { CONTACT_EMAIL, CONTACT_PHONE } from "./contact";
import { faculty, feeIncludes, paymentSteps, pricing, pricingFacts, promises, promisesNote, scholarshipFine, scholarshipTracks, teamColours } from "./data";
import { archetypes, gateCopy, pillars, scholarshipTracks as askTracks, type Identity, type Result } from "./score";
import { LADDER, plan as planFor, planCopy } from "./scorePlan";
import { SITE_HOST } from "./site";

const asset = (f: string) => join(process.cwd(), "assets", f);
Font.register({
  family: "Blank",
  fonts: [
    { src: asset("ft-system-blank-regular.ttf"), fontWeight: 400 },
    { src: asset("ft-system-blank-semibold.ttf"), fontWeight: 600 },
  ],
});
// The mono cut is the only one with ✓ and ₹ in it, so marks and prices set in it.
Font.register({ family: "Mono", src: asset("ft-system-mono-medium.ttf") });
Font.registerHyphenationCallback((word) => [word]);

/** Always the production site: a PDF outlives the environment that rendered it. */
const SITE = `https://${SITE_HOST}`;

/** The site's tokens (app/globals.css), with the ink's opacities flattened onto white. */
const INK = "#16253f";
const INK_80 = "#454f65";
const INK_70 = "#5c6679";
const INK_60 = "#737c8c";
const INK_40 = "#a2a8b2";
const RULE = "#dcdee2"; // dark/15
const DEEP = "#2d6fae";
const GRAY_100 = "#e9f1fb";
const GRAY_200 = "#d3e3f6";
const PANEL = "#a8cef4";
const NAVY = "#0f1d4a";
const NAVY_2 = "#1d3b86";

/**
 * Status colours for the report only: red where it's hurting, amber where it's
 * middling, green where it's safe or done. Each has an ink, a solid for marks
 * and bars, a line, and a tint (the solid at ~12% on white) for panels.
 */
type Tone = { fg: string; solid: string; line: string; bg: string; soft: string };
const RED: Tone = { fg: "#b42d2d", solid: "#d9534f", line: "#f0c2c0", bg: "#fcedec", soft: "#f5cfcd" };
const ORANGE: Tone = { fg: "#b4541a", solid: "#e5793a", line: "#f5d0b6", bg: "#fdf1e8", soft: "#f8d6bf" };
const AMBER: Tone = { fg: "#a8650c", solid: "#eda534", line: "#f1dca8", bg: "#fdf6e3", soft: "#f6e3ae" };
const GREEN: Tone = { fg: "#1d7a4f", solid: "#2fa36b", line: "#bfe3cf", bg: "#e9f6ef", soft: "#c3e6d3" };
/** Below `lo` is red, below `hi` amber, else green. */
const toneOf = (v: number, lo: number, hi: number) => (v < lo ? RED : v < hi ? AMBER : GREEN);
const BLUE_LINE = "#9cc3ea";
const BLUE_BG = "#f1f7fe";

/** Side margin, and the content width it leaves on A4. */
const PX = 28;
const W = 595 - PX * 2;

/** A colour mixed toward white, `t` of the way from white: react-pdf's Svg takes no alpha hex. */
const tint = (hex: string, t: number) =>
  "#" +
  [1, 3, 5]
    .map((i) => Math.round(255 - (255 - parseInt(hex.slice(i, i + 2), 16)) * t))
    .map((v) => v.toString(16).padStart(2, "0"))
    .join("");

const s = StyleSheet.create({
  page: { fontFamily: "Blank", fontSize: 9, color: INK, paddingTop: 54, paddingBottom: 40, paddingHorizontal: PX, lineHeight: 1.3 },
  head: { position: "absolute", top: 22, left: PX, right: PX, flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingBottom: 8, borderBottomWidth: 0.75, borderBottomColor: RULE },
  brand: { flexDirection: "row", alignItems: "flex-end", gap: 1.2 },
  foot: { position: "absolute", top: 808, left: PX, right: PX, flexDirection: "row", justifyContent: "space-between", paddingTop: 8, borderTopWidth: 0.75, borderTopColor: RULE },
  mono: { fontFamily: "Mono", fontSize: 6.5, lineHeight: 1.4, letterSpacing: 0.8, textTransform: "uppercase", color: INK_60 },
  bar: { position: "absolute", top: 0, left: 0, right: 0, height: 4, backgroundColor: DEEP },
  eye: { flexDirection: "row", alignItems: "center" },
  eyeNo: { fontFamily: "Mono", fontSize: 6.5, color: "#ffffff", backgroundColor: DEEP, borderRadius: 3, paddingHorizontal: 4, paddingVertical: 2, marginRight: 7 },
  eyeRule: { flex: 1, height: 0.75, backgroundColor: RULE, marginLeft: 8 },
  secH: { fontSize: 12, fontWeight: 600, marginTop: 13 },
  secD: { fontSize: 8.5, color: INK_70, marginTop: 2.5, marginBottom: 7 },
  box: { borderWidth: 0.75, borderColor: RULE, borderRadius: 6 },
  li: { flexDirection: "row", fontSize: 8.5, marginTop: 2.5 },
  mark: { fontFamily: "Mono", width: 10, fontSize: 8 },
  small: { fontSize: 8, color: INK_70 },
  link: { color: INK, textDecoration: "underline" },
  fill: { position: "absolute", top: 0, left: 0, right: 0, bottom: 0 },
});

const Mono = ({ children, color, style }: { children: React.ReactNode; color?: string; style?: Styles[string] }) => <Text style={[s.mono, color ? { color } : {}, style ?? {}]}>{children}</Text>;

/**
 * A gradient behind a panel's content. react-pdf only paints gradients inside
 * an Svg, so this one stretches to the panel; the panel clips it to its corners.
 * react-pdf reads an x2 of 0 as unset and runs the gradient corner to corner,
 * so a vertical one is drawn a hair off zero.
 */
function Grad({ id, stops, x2 = 0, y2 = 1 }: { id: string; stops: [number, string][]; x2?: number; y2?: number }) {
  return (
    <Svg viewBox="0 0 1 1" preserveAspectRatio="none" style={s.fill}>
      <Defs>
        <LinearGradient id={id} x1={0} y1={0} x2={x2 || 0.0001} y2={y2}>
          {stops.map(([at, color]) => (
            <Stop key={at} offset={at} stopColor={color} />
          ))}
        </LinearGradient>
      </Defs>
      <Rect x={0} y={0} width={1} height={1} fill={`url(#${id})`} />
    </Svg>
  );
}

/** The page furniture: the rule up top, the lockup back to the site, then the name, date and page underneath. */
function Chrome({ r, id, date }: { r: Result; id: Identity; date: string }) {
  return (
    <>
      <View style={s.bar} fixed />
      <View style={s.head} fixed>
        <Link src={SITE} style={{ textDecoration: "none" }}>
          <View style={s.brand}>
            {/* The mark is the k, so the logotype after it starts at "nnekt". react-pdf's Image takes no alt. */}
            {/* eslint-disable-next-line jsx-a11y/alt-text */}
            <Image src={asset("knnekt-mark.png")} style={{ height: 12, width: 12 * (854 / 1026) }} />
            <Svg viewBox={LOCKUP_VIEWBOX} style={{ height: 12, width: 12 * LOCKUP_RATIO }}>
              <Path d={LOCKUP_PATH} fill={INK} />
            </Svg>
          </View>
        </Link>
        <Mono>Startup Operating Score™</Mono>
      </View>
      <View style={s.foot} fixed>
        <Mono>
          {r.venName} · {id.name} · {date}
        </Mono>
        <Text style={s.mono} render={({ pageNumber, totalPages }) => `Page ${pageNumber} of ${totalPages}`} />
      </View>
    </>
  );
}

function Eye({ n, children }: { n: string; children: string }) {
  return (
    <View style={s.eye}>
      <Text style={s.eyeNo}>{n}</Text>
      <Mono>{children}</Mono>
      <View style={s.eyeRule} />
    </View>
  );
}

/** A section: heading, line, content. `placeholder` tags one whose content is still to be signed. */
function Sec({ h, d, children, style, placeholder = false }: { h: string; d?: string; children: React.ReactNode; style?: Styles[string]; placeholder?: boolean }) {
  return (
    <View wrap={false} style={style}>
      <View style={{ flexDirection: "row", alignItems: "flex-start" }}>
        <View style={{ flex: 1 }}>
          <Text style={s.secH}>{h}</Text>
          {d ? <Text style={s.secD}>{d}</Text> : <View style={{ height: 7 }} />}
        </View>
        {placeholder ? (
          <Mono style={{ fontSize: 5.5, marginTop: 17, borderWidth: 0.75, borderColor: INK_40, borderStyle: "dashed", borderRadius: 6, paddingHorizontal: 5, paddingVertical: 2 }}>
            Placeholder
          </Mono>
        ) : null}
      </View>
      {children}
    </View>
  );
}

const Item = ({ mark, color = INK, children, textColor }: { mark: string; color?: string; children: React.ReactNode; textColor?: string }) => (
  <View style={s.li}>
    <Text style={[s.mark, { color }]}>{mark}</Text>
    <Text style={{ flex: 1, color: textColor ?? INK }}>{children}</Text>
  </View>
);

/** Body copy with any ₹ set in the mono cut, the only one that has the glyph. */
const Rupees = ({ children }: { children: string }) => (
  <>
    {children.split(/(₹[\d,–]+)/).map((part, i) =>
      part.startsWith("₹") ? (
        <Text key={i} style={{ fontFamily: "Mono" }}>
          {part}
        </Text>
      ) : (
        part
      ),
    )}
  </>
);

/** A sum set large in the sans, its ₹ in the mono cut, the only one that has the glyph. */
const Money = ({ children, size, color = INK }: { children: string; size: number; color?: string }) => (
  <Text style={{ fontSize: size, fontWeight: 600, color, letterSpacing: -0.2 }}>
    <Text style={{ fontFamily: "Mono", fontWeight: 400 }}>₹</Text>
    {children.replace(/^₹/, "")}
  </Text>
);

const Phone = () => (
  <Link src={`tel:${CONTACT_PHONE.tel}`} style={s.link}>
    {CONTACT_PHONE.display}
  </Link>
);

/** A white tick on a filled square, for what the fee covers. */
const Tick = ({ color = DEEP }: { color?: string }) => (
  <Svg viewBox="0 0 16 16" style={{ width: 8.5, height: 8.5, marginRight: 6, marginTop: 1 }}>
    <Rect x={0} y={0} width={16} height={16} rx={3} fill={color} />
    <Path d="M4 8.5l2.8 2.8L12 5.5" stroke="#ffffff" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" fill="none" />
  </Svg>
);

/** Until someone is signed, their face is a silhouette marked "Photo", as on the site. */
function Silhouette({ from, to, w, h, dark = false }: { from: string; to: string; w: number; h?: number; dark?: boolean }) {
  const id = `sil-${from.slice(1)}${to.slice(1)}-${w}`;
  const fig = Math.min(w, h ?? w) * 0.8;
  return (
    <View style={{ width: w, height: h, alignSelf: h ? "auto" : "stretch", overflow: "hidden", borderRadius: dark ? 0 : 5 }}>
      <Grad id={id} stops={[[0, from], [1, to]]} />
      <Svg viewBox="0 0 120 120" style={{ position: "absolute", left: (w - fig) / 2, bottom: 0, width: fig, height: fig }}>
        <Circle cx={60} cy={46} r={20} fill={dark ? "#8792b4" : "#ffffff"} fillOpacity={dark ? 0.7 : 0.85} />
        <Path d="M22 120c4-26 20-38 38-38s34 12 38 38z" fill={dark ? "#8792b4" : "#ffffff"} fillOpacity={dark ? 0.7 : 0.85} />
      </Svg>
      <Mono color={dark ? "#9aa5c4" : INK_40} style={{ position: "absolute", left: 5, bottom: 4, fontSize: 4.5 }}>
        Photo
      </Mono>
    </View>
  );
}

/** Each scholarship track's icon, after the ones the site draws (components/Scholarships.tsx). */
const TRACK_ICONS: Record<string, (c: string) => React.ReactNode> = {
  "Women Founders": (c) => (
    <>
      <Circle cx={24} cy={16} r={7} fill={c} />
      <Path d="M10 40c1-9 7-14 14-14s13 5 14 14z" fill={c} />
    </>
  ),
  "Beyond the Metros": (c) => <Path d="M8 40V22l8-5v23M16 40V14l10-6v32M26 40V20l14 6v14" fill="none" stroke={c} strokeWidth={3.5} strokeLinejoin="round" />,
  "Second-time Founders": (c) => (
    <>
      <Path d="M14 30a12 12 0 1 1 4 9" fill="none" stroke={c} strokeWidth={3.6} strokeLinecap="round" />
      <Path d="M10 26l4 5 5-4" fill="none" stroke={c} strokeWidth={3.6} strokeLinecap="round" strokeLinejoin="round" />
    </>
  ),
  "Need-based": (c) => (
    <>
      <Path d="M24 40C12 32 7 25 7 18a8.5 8.5 0 0 1 17-2 8.5 8.5 0 0 1 17 2c0 7-5 14-17 22z" fill={c} />
      <Path d="M19 22h10M24 17v10" stroke="#ffffff" strokeWidth={3} strokeLinecap="round" />
    </>
  ),
};

/** A mono pill, for chips and badges. */
const Chip = ({ children, color = INK_70, bg = GRAY_200, style }: { children: React.ReactNode; color?: string; bg?: string; style?: Styles[string] }) => (
  <Mono color={color} style={{ backgroundColor: bg, borderRadius: 8, paddingHorizontal: 7, paddingVertical: 3, ...style }}>
    {children}
  </Mono>
);

function ReportDoc({ r, id }: { r: Result; id: Identity }) {
  const plan = planFor(r);
  const arch = archetypes[r.arch];
  const date = new Date().toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });
  const weak = r.constraints.map((c) => pillars.findIndex((p) => p.name === c.name));
  const founderLabel = r.founders === null ? null : ["Solo founder", "2 founders", "3+ founders"][r.founders];
  const facts = ([["Venture", r.venName], ["Team", founderLabel], ["Stage", plan.stage]] as [string, string | null][]).filter((f): f is [string, string] => !!f[1]);
  const consTone = [RED, ORANGE, AMBER];
  const scoreTone = toneOf(r.overall, r.bench[0], r.bench[1]);
  const confTone = r.confidence.tone === "high" ? GREEN : r.confidence.tone === "med" ? AMBER : RED;
  const gates = r.gates;
  // Page one's air goes to the gates: each one that fires takes a third of the extra spacing, so three still fit the page.
  const air = 1 - gates.length / 3;
  const sp = (tight: number, roomy: number) => tight + (roomy - tight) * air;
  const pos = plan.ladder.built > plan.ladder.start ? (plan.ladder.start + plan.ladder.built) / 2 : plan.ladder.start;
  const cohort = pricing.cohort.split(" · ")[0];
  const [experts, studio] = faculty;
  const shownExperts = experts.people.slice(0, 3);
  const chrome = <Chrome r={r} id={id} date={date} />;
  // The founder's scholarship ask, named back to them on pages 3 and 4.
  const asked = id.scholarship.requested;
  const askedTrack = asked ? (askTracks.find((t) => t.key === id.scholarship.track)?.name ?? null) : null;
  const askedLine = `You asked to be considered for a scholarship${askedTrack ? ` (${askedTrack})` : ""}. We’ll talk about it at your Selection Session.`;

  return (
    <Document title={`Startup Operating Score · ${r.venName}`} author="Knnekt Studios" subject="Startup Operating Score report">
      {/* Page 01: the diagnosis */}
      <Page size="A4" style={s.page}>
        {chrome}
        <Eye n="01">Diagnosis · a 60-second read</Eye>
        <Mono color={DEEP} style={{ marginTop: 12 }}>
          {r.venName}
        </Mono>
        <View style={{ flexDirection: "row", alignItems: "flex-start", marginTop: 4 }}>
          <View style={{ width: 138, flexDirection: "row", alignItems: "flex-end" }}>
            <Text style={{ fontSize: 66, fontWeight: 600, lineHeight: 0.9, letterSpacing: -2, color: scoreTone.fg }}>{r.overall}</Text>
            <Mono style={{ marginLeft: 5, marginBottom: 4 }}>/ 100</Mono>
          </View>
          <View style={{ flex: 1, paddingTop: 6 }}>
            <Mono>{plan.stage}</Mono>
            <Text style={{ fontSize: 17, fontWeight: 600, lineHeight: 1.2, marginTop: 4 }}>{arch.name}</Text>
            <Text style={{ fontSize: 9.5, color: INK_70, marginTop: 3 }}>{arch.sub}</Text>
          </View>
        </View>

        <View style={[s.box, { flexDirection: "row", marginTop: sp(12, 20), backgroundColor: "#f8f9fb" }]}>
          {facts.map(([k, v], i) => (
            <View key={k} style={{ flex: i === 0 ? 1.4 : 1, paddingVertical: 9, paddingHorizontal: 11, borderLeftWidth: i ? 0.75 : 0, borderLeftColor: RULE }}>
              <Mono>{k}</Mono>
              <Text style={{ fontWeight: 600, marginTop: 4 }}>{v}</Text>
            </View>
          ))}
        </View>

        <View wrap={false} style={{ flexDirection: "row", gap: 8, marginTop: 8 }}>
          <View style={{ flex: 1, backgroundColor: confTone.bg, borderWidth: 0.75, borderColor: confTone.line, borderRadius: 6, paddingHorizontal: 13, paddingTop: sp(10, 12), paddingBottom: sp(10, 13) }}>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <View style={{ width: 5, height: 5, borderRadius: 3, marginRight: 7, backgroundColor: confTone.solid }} />
              <Text style={{ flex: 1, fontSize: 11.5, fontWeight: 600 }}>{r.confidence.label}</Text>
              {/* Its own line height so the figure isn't clipped, pulled in so the row stays the title's height. */}
              <Text style={{ fontSize: 17, fontWeight: 600, lineHeight: 1.15, marginVertical: -4, color: confTone.fg, marginLeft: 8 }}>{r.confidence.pct}%</Text>
            </View>
            <View style={{ height: 3, borderRadius: 2, backgroundColor: confTone.soft, marginTop: 5 }}>
              <View style={{ width: `${Math.max(r.confidence.pct, 2)}%`, height: 3, borderRadius: 2, backgroundColor: confTone.solid }} />
            </View>
            <Text style={{ fontSize: 9.5, lineHeight: 1.4, color: INK_80, marginTop: 9 }}>{r.confidence.body}</Text>
          </View>
          <View style={{ flex: 1, borderRadius: 6, overflow: "hidden", paddingHorizontal: 13, paddingTop: 12, paddingBottom: 13 }}>
            <Grad id="next" stops={[[0, PANEL], [1, "#dbeafb"]]} />
            <Mono color={DEEP}>{cohort} · What happens next</Mono>
            <Text style={{ fontSize: 12.5, fontWeight: 600, marginTop: 7 }}>Your report is on its way.</Text>
            <Text style={{ fontSize: 9.5, lineHeight: 1.4, color: INK_80, marginTop: 5 }}>
              We’ll call you within 24 hours from <Phone />. Save it so you pick up.
            </Text>
          </View>
        </View>

        {gates.length ? (
          <View wrap={false} style={{ borderWidth: 0.75, borderColor: RED.line, borderLeftWidth: 2.5, borderLeftColor: RED.solid, backgroundColor: RED.bg, borderRadius: 6, paddingHorizontal: 10, paddingVertical: 2, marginTop: 6 }}>
            {gates.map((g, i) => (
              <View key={g} style={{ flexDirection: "row", paddingVertical: 4.5, borderTopWidth: i ? 0.75 : 0, borderTopColor: RED.line }}>
                <View style={{ width: 11, height: 11, borderRadius: 6, backgroundColor: RED.solid, alignItems: "center", justifyContent: "center", marginRight: 7, marginTop: 0.5 }}>
                  <Text style={{ fontSize: 7.5, fontWeight: 600, lineHeight: 1, color: "#ffffff" }}>!</Text>
                </View>
                <View style={{ width: 106 }}>
                  <Text style={{ fontSize: 8.5, fontWeight: 600, color: RED.fg }}>{gateCopy[g][0]}</Text>
                  <Mono color={RED.fg} style={{ fontSize: 5.5, marginTop: 1 }}>
                    Outweighs your score
                  </Mono>
                </View>
                <Text style={[s.small, { flex: 1, lineHeight: 1.35, color: INK_80 }]}>{gateCopy[g][1]}</Text>
              </View>
            ))}
          </View>
        ) : null}

        <Sec h={planCopy.constraints.h} d={planCopy.constraints.d} style={{ marginTop: sp(0, 10) }}>
          <View style={{ flexDirection: "row", gap: 8 }}>
            {r.constraints.map((c, i) => (
              <View key={c.name} style={{ flex: 1, backgroundColor: consTone[i].bg, borderLeftWidth: 1.5, borderLeftColor: consTone[i].solid, borderTopRightRadius: 6, borderBottomRightRadius: 6, paddingTop: sp(9, 12), paddingBottom: sp(9, 14), paddingHorizontal: 13 }}>
                <Mono color={consTone[i].fg}>{c.label} constraint</Mono>
                <Text style={{ fontSize: 11.5, fontWeight: 600, marginTop: 8 }}>{c.name}</Text>
                <Text style={{ fontSize: 9, lineHeight: 1.4, color: INK_70, marginTop: 2 }}>{c.why}</Text>
                <View style={{ borderTopWidth: 0.75, borderTopColor: consTone[i].line, marginTop: sp(7, 9), paddingTop: sp(7, 9) }}>
                  <Mono style={{ marginBottom: 4 }}>What it’s costing you</Mono>
                  {c.cost.map((x) => (
                    <View key={x} style={{ marginTop: sp(0.5, 2) }}>
                      <Item mark="×" color={consTone[i].solid}>
                        {x}
                      </Item>
                    </View>
                  ))}
                </View>
              </View>
            ))}
          </View>
        </Sec>

        {/* The six pillars read as metrics in the founder's copy. Green starts at 70, where the Scaler does. */}
        <Sec h="Your six metrics" d="Each scored 0–100. Red is holding you back, amber is getting there, green is strong." style={{ marginTop: sp(0, 10) }}>
          {pillars.map((p, i) => {
            const w = weak.includes(i);
            const v = r.pct[i];
            const t = toneOf(v, 40, 70);
            return (
              <View key={p.key} style={{ flexDirection: "row", alignItems: "center", marginTop: i ? sp(4.5, 8.5) : 2 }}>
                <Text style={{ width: 128, fontSize: 9, color: w ? INK : INK_70, fontWeight: w ? 600 : 400 }}>{p.name}</Text>
                <View style={{ flex: 1, height: 6, backgroundColor: t.bg, borderRadius: 3 }}>
                  <View style={{ width: `${Math.max(v, 2)}%`, height: 6, borderRadius: 3, backgroundColor: t.solid }} />
                </View>
                <Text style={{ width: 30, textAlign: "right", fontSize: 9, fontWeight: 600, color: t.fg }}>{v}</Text>
              </View>
            );
          })}
        </Sec>
      </Page>

      {/* Page 02: the 100 days */}
      <Page size="A4" style={s.page}>
        {chrome}
        <Eye n="02">Your 100 days</Eye>

        <Sec h={planCopy.left.h} d={planCopy.left.d} style={{ marginTop: -2 }}>
          <View style={[s.box, { paddingVertical: 10, paddingHorizontal: 12 }]}>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <View style={{ flexDirection: "row", alignItems: "flex-end" }}>
                <Text style={{ fontSize: 22, fontWeight: 600, lineHeight: 1, color: GREEN.fg }}>{plan.check.done}</Text>
                <Text style={{ fontSize: 10, color: INK_40, marginLeft: 2 }}>/{plan.check.total}</Text>
                <Text style={{ fontWeight: 600, color: INK_70, marginLeft: 6 }}>launch-ready</Text>
              </View>
              <View style={{ flex: 1, height: 4, borderRadius: 2, backgroundColor: GREEN.bg, marginLeft: 14 }}>
                <View style={{ width: `${Math.max(Math.round((plan.check.done / plan.check.total) * 100), 2)}%`, height: 4, borderRadius: 2, backgroundColor: GREEN.solid }} />
              </View>
            </View>
            <Text style={{ fontSize: 8.5, color: DEEP, marginTop: 6 }}>{planCopy.lrDone(plan.check.done)}</Text>
            <View style={{ flexDirection: "row", flexWrap: "wrap", marginTop: 2, columnGap: 14 }}>
              {plan.check.items.map((it) => (
                <View key={it.label} style={{ width: Math.floor((W - 26 - 28) / 3), flexDirection: "row", borderBottomWidth: 0.75, borderBottomColor: RULE, paddingVertical: 3 }}>
                  <Text style={[s.mark, { color: it.done ? GREEN.solid : AMBER.solid }]}>{it.done ? "✓" : "→"}</Text>
                  <Text style={{ flex: 1, fontSize: 8.5, color: it.done ? GREEN.fg : INK }}>{it.label}</Text>
                </View>
              ))}
            </View>
            <Text style={[s.small, { marginTop: 6 }]}>{plan.check.footer}</Text>
          </View>
        </Sec>

        <Sec h={planCopy.ladder.h} d={planCopy.ladder.d}>
          <View style={[s.box, { flexDirection: "row", marginTop: 5 }]}>
            {LADDER.map((st, i) => {
              const { start, built } = plan.ladder;
              const state = i < start ? "past" : i === start ? "now" : built > start && i <= built ? "built" : "fut";
              const tag = i === start ? "Start here" : i === built && built > start ? "Built to here" : "";
              const bg = state === "now" ? DEEP : state === "built" ? GRAY_100 : state === "fut" ? "#ffffff" : GRAY_100;
              const fg = state === "now" ? "#ffffff" : state === "fut" ? INK_40 : state === "past" ? INK_60 : INK;
              return (
                <View key={st.name} style={{ flex: 1, backgroundColor: bg, paddingTop: 12, paddingBottom: 8, paddingHorizontal: 9, borderLeftWidth: i ? 0.75 : 0, borderLeftColor: RULE, borderTopLeftRadius: i ? 0 : 6, borderBottomLeftRadius: i ? 0 : 6 }}>
                  {tag ? (
                    <View style={{ position: "absolute", top: -7, left: 5, backgroundColor: "#ffffff", borderWidth: 0.75, borderColor: DEEP, borderRadius: 7, paddingHorizontal: 5, paddingVertical: 1.5 }}>
                      <Mono color={DEEP} style={{ fontSize: 6 }}>
                        {tag}
                      </Mono>
                    </View>
                  ) : null}
                  <Text style={{ fontSize: 10, fontWeight: 600, color: fg }}>{st.name}</Text>
                  <Mono color={state === "now" ? "#dbe8f6" : state === "built" ? INK_70 : fg} style={{ marginTop: 3, fontSize: 6 }}>
                    {st.sub}
                  </Mono>
                </View>
              );
            })}
          </View>
          <View style={{ height: 17 }}>
            <View style={{ position: "absolute", top: 3, left: `${((pos + 0.5) / 4) * 100}%`, width: 70, marginLeft: -35, alignItems: "center" }}>
              <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: DEEP }} />
              <Mono color={INK} style={{ marginTop: 3 }}>
                You’re here
              </Mono>
            </View>
          </View>
        </Sec>

        <Sec h={planCopy.days.h} d={planCopy.days.d} style={{ marginTop: -6 }}>
          <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
            {plan.days.map((st) => (
              <View key={st.h} style={{ width: (W - 8) / 2, borderWidth: 0.75, borderColor: GRAY_200, borderRadius: 6 }}>
                <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", backgroundColor: GRAY_100, borderTopLeftRadius: 6, borderTopRightRadius: 6, paddingVertical: 6, paddingHorizontal: 11 }}>
                  <Text style={{ fontWeight: 600, fontSize: 10.5 }}>{st.h}</Text>
                  {st.range ? (
                    <View style={{ flexDirection: "row", alignItems: "center" }}>
                      <Mono>Day {st.day}</Mono>
                      <Text style={{ fontFamily: "Mono", fontSize: 6.5, color: GREEN.fg, backgroundColor: GREEN.soft, borderRadius: 2, paddingHorizontal: 3, paddingVertical: 1, marginHorizontal: 4 }}>
                        {st.range[0] === st.range[1] ? st.range[0] : `${st.range[0]}–${st.range[1]}`}
                      </Text>
                      <Mono>Score</Mono>
                    </View>
                  ) : null}
                </View>
                <View style={{ paddingTop: 6, paddingBottom: 7, paddingHorizontal: 11 }}>
                  <Mono>What gets done</Mono>
                  {st.topics.map((t) => (
                    <Item key={t} mark="→" color={INK_60}>
                      {t}
                    </Item>
                  ))}
                  <Mono color={DEEP} style={{ marginTop: 5 }}>
                    What Knnekt does alongside
                  </Mono>
                  {st.kn.map((t) => (
                    <Item key={t} mark="•" color={DEEP}>
                      {t}
                    </Item>
                  ))}
                </View>
              </View>
            ))}
          </View>
          {/* No italic cut ships with the face, so the slant is a skew on the regular. */}
          <View style={{ marginTop: 7, transform: "skewX(-10deg)" }}>
            <Text style={{ fontSize: 7.5, color: INK_60 }}>{planCopy.days.note}</Text>
          </View>
          <Mono style={{ marginTop: 6 }}>One path: plan, prove, build, pitch.</Mono>
        </Sec>
      </Page>

      {/* Page 03: the fee and scholarships, as the pricing and scholarship sections on the site set them out */}
      <Page size="A4" style={s.page}>
        {chrome}
        <Eye n="03">The fee and scholarships</Eye>
        <Text style={{ maxWidth: 250, fontSize: 14.5, fontWeight: 600, lineHeight: 1.2, marginTop: 6 }}>
          Investors fund proof, <Text style={{ color: INK_40, textDecoration: "line-through", textDecorationColor: RED.solid }}>not pitches</Text>. We build the proof with you.
        </Text>

        <Sec h={planCopy.fee.h} d={planCopy.fee.d} style={{ marginTop: -6 }}>
          <View style={{ flexDirection: "row", gap: 5 }}>
            {["Application-only", `${pricing.seats} seats per cohort`, pricing.cohort].map((chip) => (
              <Chip key={chip}>{chip}</Chip>
            ))}
          </View>
          <View style={{ flexDirection: "row", borderTopWidth: 0.75, borderTopColor: RULE, borderBottomWidth: 0.75, borderBottomColor: RULE, marginTop: 8 }}>
            {pricingFacts.map(([title, body], i) => (
              <View key={title} style={{ flex: 1, paddingVertical: 3.5, paddingLeft: i ? 9 : 0, paddingRight: 9, borderLeftWidth: i ? 0.75 : 0, borderLeftColor: RULE }}>
                <Text style={{ fontSize: 8.5, fontWeight: 600 }}>{title}</Text>
                <Text style={{ fontSize: 6.5, lineHeight: 1.35, color: INK_70, marginTop: 1.5 }}>{body}</Text>
              </View>
            ))}
          </View>
        </Sec>

        <View wrap={false} style={{ flexDirection: "row", gap: 8, marginTop: 7 }}>
          <View style={{ flex: 1.06 }}>
            <View style={{ backgroundColor: BLUE_BG, borderWidth: 0.75, borderColor: BLUE_LINE, borderRadius: 6, paddingHorizontal: 11, paddingTop: 9, paddingBottom: 8 }}>
              <Mono color={DEEP}>How you pay it</Mono>
              <View style={{ marginTop: 2 }}>
                {paymentSteps.map((step, i) => {
                  const last = i === paymentSteps.length - 1;
                  return (
                    <View key={step.title} style={{ flexDirection: "row", alignItems: "flex-start", borderBottomWidth: 0.75, borderBottomColor: GRAY_200, paddingVertical: 5 }}>
                      <View style={{ width: 12, height: 12, borderRadius: 6, backgroundColor: last ? GREEN.solid : DEEP, alignItems: "center", justifyContent: "center", marginRight: 8, marginTop: 0.5 }}>
                        <Text style={{ fontFamily: "Mono", fontSize: 6, color: "#ffffff" }}>{i + 1}</Text>
                      </View>
                      <View style={{ flex: 1 }}>
                        <View style={{ flexDirection: "row", alignItems: "baseline" }}>
                          <Text style={{ flex: 1, fontSize: 9.5, fontWeight: 600, marginRight: 6 }}>{step.title}</Text>
                          <Text style={{ fontFamily: "Mono", fontSize: 8.5, color: last ? GREEN.fg : DEEP }}>{step.amount}</Text>
                        </View>
                        <Text style={{ fontSize: 7, lineHeight: 1.35, color: INK_70, marginTop: 1.5 }}>
                          <Rupees>{step.body}</Rupees>
                        </Text>
                      </View>
                    </View>
                  );
                })}
              </View>
              <Text style={{ fontSize: 7, lineHeight: 1.35, color: INK_70, marginTop: 6 }}>
                Total <Text style={{ fontFamily: "Mono", color: DEEP }}>{pricing.total}</Text>. Every rupee is scheduled before you start: no milestone invoices, no change orders, no surprise line at Day
                70.
              </Text>
            </View>

            {/* The market rate, highlighted, against the founding price. */}
            <View style={{ flexDirection: "row", alignItems: "center", backgroundColor: BLUE_BG, borderWidth: 0.75, borderColor: GRAY_200, borderRadius: 6, padding: 7, marginTop: 8 }}>
              <View style={{ width: 122, borderRadius: 5, overflow: "hidden", paddingTop: 8, paddingBottom: 9, paddingHorizontal: 9 }}>
                <Grad id="market" stops={[[0, "#1a2547"], [1, "#2c4785"]]} x2={1} y2={0} />
                <Mono color="#c9d3ea" style={{ fontSize: 5.5 }}>
                  At market/industry standard rates, the build is worth
                </Mono>
                <View style={{ marginTop: 4 }}>
                  <Money size={16} color="#ffffff">
                    {pricing.market}
                  </Money>
                </View>
              </View>
              <Text style={{ fontFamily: "Mono", fontSize: 10, color: DEEP, marginHorizontal: 9 }}>→</Text>
              <View style={{ flex: 1 }}>
                <Mono style={{ fontSize: 5.5 }}>Founding price for {cohort}</Mono>
                <View style={{ flexDirection: "row", alignItems: "flex-end", marginTop: 4 }}>
                  <Money size={11}>{pricing.fee}</Money>
                  <Text style={[s.mono, { fontSize: 5.5, letterSpacing: 0.3, marginLeft: 3, marginBottom: 1.5 }]}>{pricing.gst}</Text>
                </View>
              </View>
            </View>
          </View>

          <View style={{ flex: 1 }}>
            <View style={{ backgroundColor: PANEL, borderRadius: 6, paddingHorizontal: 11, paddingTop: 8, paddingBottom: 8 }}>
              <Text style={{ fontSize: 11, fontWeight: 600 }}>What the fee covers</Text>
              <Mono color={INK_70} style={{ marginTop: 2, fontSize: 5.5 }}>
                {pricing.cohort} · {pricing.seats} seats
              </Mono>
              <View style={{ marginTop: 5 }}>
                {feeIncludes.map(([thing, rest]) => (
                  <View key={thing} style={{ flexDirection: "row", marginTop: 1.6 }}>
                    <Tick />
                    <Text style={{ flex: 1, fontSize: 7, lineHeight: 1.35, color: INK_80 }}>
                      <Text style={{ fontWeight: 600, color: INK }}>{thing}</Text>
                      {rest}
                    </Text>
                  </View>
                ))}
              </View>
              <Text style={{ fontSize: 7, lineHeight: 1.35, color: INK_80, marginTop: 5 }}>{pricing.fine}</Text>
            </View>

            {/* Navy at the top, warming to a soft pink at the foot, where the fine print sits in ink. */}
            <View style={{ borderRadius: 6, overflow: "hidden", paddingHorizontal: 9, paddingTop: 7, paddingBottom: 7, marginTop: 7 }}>
              <Grad id="promises" stops={[[0, NAVY], [0.4, NAVY_2], [0.66, "#a9b3e6"], [1, "#f4c9de"]]} />
              <Text style={{ fontSize: 11, fontWeight: 600, color: "#ffffff" }}>Two promises.</Text>
              <View style={{ flexDirection: "row", gap: 6, marginTop: 5 }}>
                {promises.map((p) => (
                  <View key={p.title} style={{ flex: 1, backgroundColor: "#f4f7fd", borderRadius: 5, paddingHorizontal: 7, paddingTop: 6, paddingBottom: 6 }}>
                    <View style={{ flexDirection: "row" }}>
                      <Text style={{ fontFamily: "Mono", fontSize: 5.5, color: "#ffffff", backgroundColor: DEEP, borderRadius: 5, paddingHorizontal: 4, paddingVertical: 1.5 }}>{p.num}</Text>
                    </View>
                    <Text style={{ fontSize: 9.5, fontWeight: 600, marginTop: 3.5 }}>{p.title}</Text>
                    <Text style={{ fontSize: 6.5, lineHeight: 1.35, color: INK_70, marginTop: 1.5 }}>{p.body}</Text>
                  </View>
                ))}
              </View>
              <Text style={{ fontSize: 6.3, lineHeight: 1.35, color: INK_80, marginTop: 5 }}>{promisesNote}</Text>
            </View>
          </View>
        </View>

        <View wrap={false} style={{ borderTopWidth: 0.75, borderTopColor: RULE, marginTop: 7 }}>
          <Text style={[s.secH, { marginTop: 5 }]}>Scholarships.</Text>
          <Text style={[s.secD, { maxWidth: 330 }]}>One full scholarship every cohort, and 20–30% off the fee on four tracks. There’s no separate application: tell us in the Score, and we decide at your Selection Session.</Text>
          {asked ? (
            <View style={{ flexDirection: "row", alignItems: "center", backgroundColor: GREEN.bg, borderWidth: 0.75, borderColor: GREEN.line, borderRadius: 6, paddingVertical: 4.5, paddingHorizontal: 8, marginBottom: 5 }}>
              <Tick color={GREEN.solid} />
              <Text style={{ flex: 1, fontSize: 8, color: INK_80 }}>{askedLine}</Text>
            </View>
          ) : null}
          <View style={{ borderRadius: 7, overflow: "hidden", padding: 8 }}>
            <Grad id="scholarships" stops={[[0, NAVY], [0.6, NAVY_2], [1, "#8eabea"]]} />
            <View style={{ flexDirection: "row", alignItems: "center", backgroundColor: "#fff9ea", borderWidth: 1, borderColor: "#e7b94c", borderRadius: 6, paddingVertical: 4, paddingHorizontal: 10 }}>
              <View style={{ width: 18, height: 18, borderRadius: 4, backgroundColor: "#fdecc0", alignItems: "center", justifyContent: "center", marginRight: 9 }}>
                <Svg viewBox="0 0 48 48" style={{ width: 11, height: 11 }}>
                  <Path d="M24 6l5.2 10.6 11.7 1.7-8.5 8.2 2 11.6L24 32.6l-10.4 5.5 2-11.6-8.5-8.2 11.7-1.7z" fill="#e3a21a" />
                </Svg>
              </View>
              <View style={{ flex: 1 }}>
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <Mono color="#a8740c" style={{ fontSize: 5.5 }}>
                    Once per cohort
                  </Mono>
                  {asked ? (
                    <Chip color="#8a5d06" bg="#fbe3a4" style={{ fontSize: 5, paddingHorizontal: 4, paddingVertical: 1.5, marginLeft: 5 }}>
                      You’re considered
                    </Chip>
                  ) : null}
                </View>
                <Text style={{ fontSize: 10.5, fontWeight: 600, marginTop: 2 }}>The Full Scholarship: 100% of the fee</Text>
                <Text style={{ fontSize: 7.5, lineHeight: 1.35, color: INK_70, marginTop: 1 }}>For one founder each cohort, chosen by the panel from everyone who asks to be considered, on any track.</Text>
              </View>
              <View style={{ alignItems: "flex-end", marginLeft: 10 }}>
                <Money size={13}>{pricing.fee}</Money>
                <Text style={{ fontSize: 6.5, color: INK_60, marginTop: 3 }}>the whole fee</Text>
              </View>
            </View>
            <View style={{ flexDirection: "row", gap: 6, marginTop: 6 }}>
              {scholarshipTracks.map((t) => {
                const mine = t.name === askedTrack;
                return (
                  <View key={t.name} style={{ flex: 1, backgroundColor: "#f6f8fd", borderWidth: mine ? 1.25 : 0, borderColor: t.colour, borderRadius: 6, padding: mine ? 5.75 : 7 }}>
                    <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" }}>
                      <View style={{ width: 14, height: 14, borderRadius: 4, backgroundColor: tint(t.colour, 0.16), alignItems: "center", justifyContent: "center" }}>
                        <Svg viewBox="0 0 48 48" style={{ width: 9, height: 9 }}>
                          {TRACK_ICONS[t.name]?.(t.colour)}
                        </Svg>
                      </View>
                      {mine ? (
                        <Chip color="#ffffff" bg={t.colour} style={{ fontSize: 5, paddingHorizontal: 5, paddingVertical: 1.5 }}>
                          Your track
                        </Chip>
                      ) : null}
                    </View>
                    <Text style={{ fontSize: 9.5, fontWeight: 600, marginTop: 4 }}>{t.name}</Text>
                    <Text style={{ flexGrow: 1, fontSize: 6.5, lineHeight: 1.35, color: INK_70, marginTop: 2 }}>{t.for}</Text>
                    <View style={{ flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between", alignItems: "flex-end", columnGap: 3, marginTop: 5 }}>
                      <Text style={{ fontSize: 7, fontWeight: 600 }}>{t.off}</Text>
                      <Text style={{ fontFamily: "Mono", fontSize: 5, color: INK_60, marginBottom: 0.5 }}>{t.amount}</Text>
                    </View>
                  </View>
                );
              })}
            </View>
          </View>
          <Text style={{ maxWidth: 280, fontSize: 7, lineHeight: 1.35, color: INK_60, marginTop: 4 }}>{scholarshipFine}</Text>
        </View>
      </Page>

      {/* Page 04: what happens next, and who builds it with you */}
      <Page size="A4" style={s.page}>
        {chrome}
        <Eye n="04">What happens next</Eye>
        <View wrap={false} style={{ flexDirection: "row", gap: 6, marginTop: 12 }}>
          {[
            {
              h: (
                <>
                  We call you within 24 hours from <Phone />.
                </>
              ),
              d: "Save it so you pick up.",
            },
            { h: "Selection Session at our studio in Gurugram.", d: "A group session with founders like you, then a one-on-one on your score and your first 10 days." },
            { h: "A decision within 24 hours.", d: "If you’re selected, ₹15,000 + GST within 48 hours holds your seat." },
          ].map((step, i) => (
            <View key={i} style={{ flex: 1, backgroundColor: GRAY_100, borderLeftWidth: 1.5, borderLeftColor: DEEP, borderTopRightRadius: 6, borderBottomRightRadius: 6, paddingHorizontal: 10, paddingTop: 9, paddingBottom: 10 }}>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <View style={{ width: 12, height: 12, borderRadius: 6, backgroundColor: DEEP, alignItems: "center", justifyContent: "center", marginRight: 6 }}>
                  <Text style={{ fontFamily: "Mono", fontSize: 6, color: "#ffffff" }}>{i + 1}</Text>
                </View>
                <Mono color={DEEP}>Step {i + 1}</Mono>
              </View>
              <Text style={{ fontSize: 9.5, fontWeight: 600, lineHeight: 1.25, marginTop: 6 }}>{step.h}</Text>
              <Text style={{ fontSize: 7, lineHeight: 1.35, color: INK_70, marginTop: 2.5 }}>
                <Rupees>{step.d}</Rupees>
              </Text>
            </View>
          ))}
        </View>
        {asked ? (
          <View style={{ backgroundColor: GRAY_100, borderWidth: 0.75, borderColor: BLUE_LINE, borderRadius: 6, paddingVertical: 6.5, paddingHorizontal: 11, marginTop: 6 }}>
            <Text style={{ fontSize: 7.5, color: INK_80 }}>{askedLine}</Text>
          </View>
        ) : null}

        <Sec h="Industry experts" d="Weekly masterclasses with investors, founders and industry experts, working on your numbers." style={{ marginTop: -1 }} placeholder={shownExperts.some((p) => !p.name)}>
          <View style={{ borderRadius: 7, overflow: "hidden", padding: 9 }}>
            <Grad id="experts" stops={[[0, NAVY], [1, NAVY_2]]} x2={1} y2={1} />
            <View style={{ flexDirection: "row", gap: 6 }}>
              {shownExperts.map((p) => {
                const [first, ...rest] = (p.name ?? "Expert name").split(" ");
                return (
                  <View key={p.seat} style={{ flex: 1, flexDirection: "row", borderWidth: 0.75, borderColor: "#34467a", backgroundColor: "#16285a", borderRadius: 6, overflow: "hidden" }}>
                    <View style={{ flex: 1, paddingHorizontal: 8, paddingVertical: 7 }}>
                      <Text style={{ fontSize: 9.5, color: "#ffffff" }}>
                        <Text style={{ fontWeight: 600 }}>{first}</Text> {rest.join(" ")}
                      </Text>
                      <View style={{ height: 0.75, backgroundColor: "#5a6a99", marginTop: 4, width: 70 }} />
                      {/* The designation alone is set in a serif italic, PDF's own Times, as a title would be. */}
                      <Text style={{ fontFamily: "Times-Roman", fontStyle: "italic", fontSize: 10, color: "#e3e8f5", marginTop: 5 }}>{p.role ?? "Designation"}</Text>
                      <Text style={{ fontSize: 6.5, lineHeight: 1.35, color: "#9aa5c4", marginTop: 2 }}>at</Text>
                      <View style={{ flexDirection: "row", marginTop: 3 }}>
                        <Mono color="#9aa5c4" style={{ fontSize: 4.5, borderWidth: 0.75, borderColor: "#7381ab", borderStyle: "dashed", borderRadius: 3, paddingHorizontal: 5, paddingVertical: 4 }}>
                          {p.company?.name ?? "Company logo"}
                        </Mono>
                      </View>
                      <Text style={{ fontSize: 6.5, lineHeight: 1.35, color: "#c9d1e8", marginTop: 5 }}>Qualification</Text>
                      <View style={{ flexDirection: "row", marginTop: 2 }}>
                        <Text style={{ fontSize: 6, color: "#ffffff", backgroundColor: "#3a7be0", borderRadius: 3, paddingHorizontal: 4, paddingVertical: 2 }}>{p.seat}</Text>
                      </View>
                    </View>
                    <Silhouette from="#2a4a8f" to="#18295c" w={56} dark />
                  </View>
                );
              })}
            </View>
            <Text style={{ fontSize: 8.5, color: "#ffffff", marginTop: 6 }}>{experts.more}</Text>
          </View>
        </Sec>

        <Sec h="Building beside you" d="The same team builds with you for all 100 days." style={{ marginTop: -3 }} placeholder={studio.people.some((p) => !p.name)}>
          <View style={{ borderWidth: 0.75, borderColor: GRAY_200, borderRadius: 7, overflow: "hidden", padding: 7 }}>
            <Grad id="studio" stops={[[0, "#f3f7fd"], [1, "#dce9f8"]]} />
            <View style={{ flexDirection: "row", gap: 4 }}>
              {studio.people.map((p, i) => {
                const c = teamColours[i % teamColours.length];
                return (
                  <View key={p.seat} style={{ flex: 1 }}>
                    <View style={{ borderWidth: 1, borderColor: c, borderRadius: 6, padding: 1.5 }}>
                      <Silhouette from={tint(c, 0.14)} to={tint(c, 0.32)} w={(W - 14 - 20) / 6 - 5} h={62} />
                    </View>
                    <Mono color={c} style={{ fontSize: 4.8, marginTop: 5, letterSpacing: 0.5 }}>
                      {p.fn}
                    </Mono>
                    <Text style={{ fontSize: 8, fontWeight: 600, marginTop: 2 }}>{p.seat}</Text>
                    <Text style={{ fontSize: 6.5, lineHeight: 1.35, color: INK_70, marginTop: 1 }}>{p.teaches}</Text>
                  </View>
                );
              })}
            </View>
            <Text style={{ fontSize: 8.5, marginTop: 6 }}>
              …and more <Text style={{ fontWeight: 600 }}>vetted partners</Text>
            </Text>
          </View>
        </Sec>

        {/* Held as placeholders until founders from the cohort sign off on their stories. */}
        <Sec h="Founders’ stories" d="What founders say after building with us." style={{ marginTop: -3 }} placeholder>
          <View style={{ flexDirection: "row", gap: 6 }}>
            {[0, 1, 2].map((i) => (
              <View key={i} style={{ flex: 1, borderWidth: 0.75, borderColor: GRAY_200, borderRadius: 7, overflow: "hidden" }}>
                <View style={{ height: 62, justifyContent: "flex-end", paddingHorizontal: 7, paddingBottom: 5 }}>
                  <Grad id={`story-${i}`} stops={[[0, "#f1f6fd"], [1, "#d3e3f6"]]} x2={1} y2={1} />
                  <Mono color={INK_40} style={{ fontSize: 4.5 }}>
                    Photo
                  </Mono>
                </View>
                <View style={{ paddingHorizontal: 10, paddingTop: 8, paddingBottom: 9 }}>
                  <Text style={{ fontSize: 10, fontWeight: 600 }}>Startup name</Text>
                  <View style={{ flexDirection: "row", alignItems: "center", marginTop: 4 }}>
                    <Text style={{ fontSize: 7.5, color: INK_70, marginRight: 5 }}>Founder · Stage</Text>
                    <Chip color={DEEP} bg={GRAY_100} style={{ fontSize: 5, paddingHorizontal: 5, paddingVertical: 1.5 }}>
                      Score before → after
                    </Chip>
                  </View>
                  <Text style={{ fontSize: 8.5, marginTop: 6 }}>“Founder quote to come.”</Text>
                </View>
              </View>
            ))}
          </View>
        </Sec>

        <View wrap={false} style={[s.box, { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingVertical: 9, paddingHorizontal: 12, marginTop: 8 }]}>
          <Mono>Contact</Mono>
          <Text style={{ fontSize: 8.5, fontWeight: 600 }}>
            <Link src={`tel:${CONTACT_PHONE.tel}`} style={{ color: INK, textDecoration: "none" }}>
              {CONTACT_PHONE.display}
            </Link>
            {"  ·  "}
            <Link src={`mailto:${CONTACT_EMAIL}`} style={{ color: INK, textDecoration: "none" }}>
              {CONTACT_EMAIL}
            </Link>
          </Text>
        </View>
      </Page>
    </Document>
  );
}

export const reportFilename = (r: Result) => `startup-operating-score-${r.venName.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") || "report"}.pdf`;

export async function reportPdfBase64(r: Result, id: Identity): Promise<string> {
  const buf = await renderToBuffer(<ReportDoc r={r} id={id} />);
  return Buffer.from(buf).toString("base64");
}
