/**
 * The founder's report as a PDF: the same two pages the result screen shows,
 * the diagnosis and the path forward, laid out for A4 in the site's type and
 * palette. The answers stay out of it; they live behind "Your answers" on the
 * result screen and in the webhook's payload. The API route attaches this to
 * the founder's email, copies the studio, and forwards it to the webhook, so
 * every copy is the same document.
 */
import { join } from "node:path";
import { Document, Font, Page, StyleSheet, Text, View, renderToBuffer, type Styles } from "@react-pdf/renderer";
import { archetypes, gateCopy, next, pillars, verdicts, type Identity, type Result } from "./score";
import { LADDER, PATHS, plan as planFor, planCopy, type PathKey } from "./scorePlan";

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

/** The site's tokens (app/globals.css), with the ink's opacities flattened onto white. */
const INK = "#16253f";
const INK_80 = "#454f65";
const INK_70 = "#5c6679";
const INK_60 = "#737c8c";
const INK_40 = "#a2a8b2";
const RULE = "#dcdee2"; // dark/15
const DEEP = "#2d6fae";
const SKY = "#3b81e3";
const GRAY_100 = "#e9f1fb";
const PANEL = "#a8cef4";

const s = StyleSheet.create({
  page: { fontFamily: "Blank", fontSize: 9.5, color: INK, paddingTop: 70, paddingBottom: 56, paddingHorizontal: 44, lineHeight: 1.35 },
  head: { position: "absolute", top: 26, left: 44, right: 44, flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingBottom: 9, borderBottomWidth: 0.75, borderBottomColor: RULE },
  brand: { fontSize: 11, fontWeight: 600 },
  foot: { position: "absolute", top: 808, left: 44, right: 44, flexDirection: "row", justifyContent: "space-between" },
  mono: { fontFamily: "Mono", fontSize: 7, letterSpacing: 0.9, textTransform: "uppercase", color: INK_60 },
  eye: { flexDirection: "row", alignItems: "center", marginTop: 4 },
  eyeRule: { flex: 1, height: 0.75, backgroundColor: RULE, marginLeft: 8 },
  secH: { fontSize: 12, fontWeight: 600, marginTop: 22 },
  secD: { fontSize: 9, color: INK_70, marginTop: 3, marginBottom: 10 },
  box: { borderWidth: 0.75, borderColor: RULE, borderRadius: 6 },
  li: { flexDirection: "row", fontSize: 9, marginTop: 3.5 },
  mark: { fontFamily: "Mono", width: 11, fontSize: 8.5 },
});

const Mono = ({ children, color, style }: { children: React.ReactNode; color?: string; style?: Styles[string] }) => <Text style={[s.mono, color ? { color } : {}, style ?? {}]}>{children}</Text>;

function Sec({ h, d, children, keep = false }: { h: string; d?: string; children: React.ReactNode; keep?: boolean }) {
  return (
    <View wrap={!keep}>
      <View minPresenceAhead={80}>
        <Text style={s.secH}>{h}</Text>
        {d ? <Text style={s.secD}>{d}</Text> : <View style={{ height: 10 }} />}
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

function ReportDoc({ r, id }: { r: Result; id: Identity }) {
  const plan = planFor(r);
  const arch = archetypes[r.arch];
  const verdict = verdicts[r.route];
  const date = new Date().toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });
  const weak = r.constraints.map((c) => pillars.findIndex((p) => p.name === c.name));
  const founderLabel = r.founders === null ? null : ["Solo founder", "2 founders", "3+ founders"][r.founders];
  const facts = ([["Venture", r.venName], ["Team", founderLabel], ["Stage", plan.stage]] as [string, string | null][]).filter((f): f is [string, string] => !!f[1]);
  const consColor = [INK, DEEP, SKY];
  const marks: [number, string][] = [
    [r.bench[0], "Median"],
    [r.bench[1], "Top third"],
    [r.bench[2], "Scale-ready"],
  ];
  const pos = plan.ladder.built > plan.ladder.start ? (plan.ladder.start + plan.ladder.built) / 2 : plan.ladder.start;
  const pathOrder: PathKey[] = ["roadmap", "cohort"];

  return (
    <Document title={`Startup Operating Score · ${r.venName}`} author="Knnekt Studios" subject="Startup Operating Score report">
      <Page size="A4" style={s.page}>
        <View style={s.head} fixed>
          <Text style={s.brand}>
            KNNEKT <Text style={{ fontWeight: 400, color: INK_60 }}>Studios</Text>
          </Text>
          <Mono>Startup Operating Score™</Mono>
        </View>
        <View style={s.foot} fixed>
          <Mono>
            {r.venName} · {id.name} · {date}
          </Mono>
          <Text style={s.mono} render={({ pageNumber, totalPages }) => `Page ${pageNumber} of ${totalPages}`} />
        </View>

        {/* Page 01: the diagnosis */}
        <View style={s.eye}>
          <Mono>Page 01 — Diagnosis · a 60-second read</Mono>
          <View style={s.eyeRule} />
        </View>
        <Mono color={DEEP} style={{ marginTop: 14 }}>
          {r.venName}
        </Mono>
        <View style={{ flexDirection: "row", alignItems: "flex-end", marginTop: 8 }}>
          <View style={{ flexDirection: "row", alignItems: "flex-end", width: 160 }}>
            <Text style={{ fontSize: 68, fontWeight: 600, lineHeight: 0.9, letterSpacing: -2 }}>{r.overall}</Text>
            <Mono style={{ marginLeft: 6, marginBottom: 6 }}>/ 100</Mono>
          </View>
          <View style={{ flex: 1, paddingBottom: 4 }}>
            <Mono>{plan.stage}</Mono>
            <Text style={{ fontSize: 18, fontWeight: 600, lineHeight: 1.2, marginTop: 5 }}>{arch.name}</Text>
            <Text style={{ fontSize: 9.5, color: INK_70, marginTop: 5 }}>{arch.sub}</Text>
          </View>
        </View>

        <View style={[s.box, { flexDirection: "row", marginTop: 18 }]}>
          {facts.map(([k, v], i) => (
            <View key={k} style={{ flex: i === 0 ? 1.4 : 1, padding: 10, borderLeftWidth: i ? 0.75 : 0, borderLeftColor: RULE }}>
              <Mono>{k}</Mono>
              <Text style={{ fontSize: 9.5, fontWeight: 600, marginTop: 4 }}>{v}</Text>
            </View>
          ))}
        </View>

        <View style={{ flexDirection: "row", alignItems: "center", backgroundColor: GRAY_100, borderRadius: 6, padding: 12, marginTop: 10 }}>
          <View style={{ width: 6, height: 6, borderRadius: 3, marginRight: 10, backgroundColor: r.confidence.tone === "high" ? DEEP : r.confidence.tone === "med" ? SKY : INK_40 }} />
          <View style={{ flex: 1 }}>
            <Text style={{ fontWeight: 600 }}>{r.confidence.label}</Text>
            <Text style={{ color: INK_80, marginTop: 2 }}>{r.confidence.body}</Text>
          </View>
          <Text style={{ fontSize: 15, fontWeight: 600, color: DEEP, marginLeft: 12 }}>{r.confidence.pct}%</Text>
        </View>

        {r.gates
          .filter((g): g is Exclude<typeof g, "RESOURCING"> => g !== "RESOURCING")
          .map((g) => (
            <View key={g} wrap={false} style={{ borderWidth: 0.75, borderColor: "#abc5df", backgroundColor: GRAY_100, borderRadius: 6, padding: 10, marginTop: 8 }}>
              <Mono color={DEEP}>{gateCopy[g][0]} · this outweighs your score</Mono>
              <Text style={{ color: INK_80, marginTop: 4 }}>{gateCopy[g][1]}</Text>
            </View>
          ))}

        <View wrap={false} style={{ backgroundColor: PANEL, borderRadius: 6, padding: 12, marginTop: 8 }}>
          <Mono color={DEEP}>
            {verdict.band} · {verdict.bandSub}
          </Mono>
          <Text style={{ fontSize: 12, fontWeight: 600, marginTop: 5 }}>{verdict.title}</Text>
          <Text style={{ color: INK_80, marginTop: 4 }}>{verdict.body}</Text>
        </View>

        <Sec h={planCopy.constraints.h} d={planCopy.constraints.d} keep>
          <View style={{ flexDirection: "row", gap: 8 }}>
            {r.constraints.map((c, i) => (
              <View key={c.name} style={{ flex: 1, backgroundColor: GRAY_100, borderLeftWidth: 2, borderLeftColor: consColor[i], borderTopRightRadius: 6, borderBottomRightRadius: 6, padding: 10 }}>
                <Mono color={consColor[i]}>{c.label} constraint</Mono>
                <Text style={{ fontWeight: 600, marginTop: 5 }}>{c.name}</Text>
                <Text style={{ fontSize: 8.5, color: INK_70, marginTop: 3 }}>{c.why}</Text>
                <View style={{ borderTopWidth: 0.75, borderTopColor: RULE, marginTop: 8, paddingTop: 7 }}>
                  <Mono>What it’s costing you</Mono>
                  {c.cost.map((x) => (
                    <Item key={x} mark="×" color={INK_60}>
                      {x}
                    </Item>
                  ))}
                </View>
              </View>
            ))}
          </View>
        </Sec>

        <Sec h={planCopy.pillars.h} d={planCopy.pillars.d} keep>
          <View style={{ flexDirection: "row", alignItems: "flex-end", height: 118, gap: 8, borderBottomWidth: 0.75, borderBottomColor: INK_40 }}>
            {r.pct.map((v, i) => {
              const w = weak.includes(i);
              return (
                <View key={i} style={{ flex: 1, alignItems: "stretch" }}>
                  <Text style={{ textAlign: "center", fontWeight: 600, color: w ? INK : DEEP, marginBottom: 3 }}>{v}</Text>
                  <View
                    style={{
                      height: Math.max(v, 3),
                      borderTopLeftRadius: 4,
                      borderTopRightRadius: 4,
                      backgroundColor: w ? GRAY_100 : DEEP,
                      borderWidth: w ? 1.25 : 0,
                      borderBottomWidth: 0,
                      borderColor: DEEP,
                    }}
                  />
                </View>
              );
            })}
          </View>
          <View style={{ flexDirection: "row", gap: 8, marginTop: 6 }}>
            {pillars.map((p, i) => (
              <Mono key={p.key} color={weak.includes(i) ? INK : INK_60} style={{ flex: 1, textAlign: "center", fontSize: 6.5 }}>
                {p.name}
              </Mono>
            ))}
          </View>
        </Sec>

        <Sec h={planCopy.stand.h} d={planCopy.stand.d(r.benchName)} keep>
          <View style={{ height: 50, marginTop: 4 }}>
            <View style={{ position: "absolute", top: 20, left: 0, right: 0, height: 5, borderRadius: 3, backgroundColor: GRAY_100 }} />
            <View style={{ position: "absolute", top: 20, left: 0, width: `${r.overall}%`, height: 5, borderRadius: 3, backgroundColor: DEEP }} />
            {marks.map(([at]) => (
              <View key={at} style={{ position: "absolute", left: `${at}%`, top: 0, width: 30, marginLeft: -15, alignItems: "center" }}>
                <Mono>{at}</Mono>
                <View style={{ width: 0.75, height: 11, backgroundColor: INK_60, marginTop: 2 }} />
              </View>
            ))}
            <View style={{ position: "absolute", left: `${r.overall}%`, top: 17, width: 50, marginLeft: -25, alignItems: "center" }}>
              <View style={{ width: 11, height: 11, borderRadius: 6, backgroundColor: DEEP, borderWidth: 2, borderColor: "#ffffff" }} />
              <Text style={{ fontWeight: 600, color: DEEP, marginTop: 2 }}>You {r.overall}</Text>
            </View>
          </View>
          <View style={{ flexDirection: "row", gap: 14, marginTop: 4 }}>
            <Mono color={DEEP}>● You {r.overall}</Mono>
            {marks.map(([at, label]) => (
              <Mono key={label}>
                | {label} {at}
              </Mono>
            ))}
          </View>
        </Sec>

        <Sec h={planCopy.left.h} d={planCopy.left.d} keep>
          <View style={[s.box, { padding: 14 }]}>
            <View style={{ flexDirection: "row", alignItems: "flex-end" }}>
              <Text style={{ fontSize: 26, fontWeight: 600, lineHeight: 1 }}>{plan.check.done}</Text>
              <Text style={{ fontSize: 12, color: INK_40, marginLeft: 2 }}>/{plan.check.total}</Text>
              <Text style={{ fontWeight: 600, color: INK_70, marginLeft: 8, marginBottom: 1 }}>launch-ready</Text>
            </View>
            <View style={{ height: 5, borderRadius: 3, backgroundColor: GRAY_100, marginTop: 9 }}>
              <View style={{ width: `${Math.round((plan.check.done / plan.check.total) * 100)}%`, height: 5, borderRadius: 3, backgroundColor: DEEP }} />
            </View>
            <Text style={{ color: DEEP, marginTop: 8 }}>{planCopy.lrDone(plan.check.done)}</Text>
            <View style={{ flexDirection: "row", flexWrap: "wrap", marginTop: 6, justifyContent: "space-between" }}>
              {plan.check.items.map((it) => (
                <View key={it.label} style={{ width: "48.5%", flexDirection: "row", borderBottomWidth: 0.75, borderBottomColor: RULE, paddingVertical: 5 }}>
                  <Text style={[s.mark, { color: it.done ? DEEP : INK }]}>{it.done ? "✓" : "→"}</Text>
                  <Text style={{ flex: 1, fontSize: 9, color: it.done ? INK_60 : INK }}>{it.label}</Text>
                </View>
              ))}
            </View>
            <Text style={{ fontSize: 8.5, color: INK_70, marginTop: 9 }}>{plan.check.footer}</Text>
          </View>
        </Sec>

        {/* Page 02: the path forward */}
        <View break style={s.eye}>
          <Mono>Page 02 — Your path forward</Mono>
          <View style={s.eyeRule} />
        </View>

        <Sec h={planCopy.ladder.h} d={planCopy.ladder.d} keep>
          <View style={[s.box, { flexDirection: "row", marginTop: 6 }]}>
            {LADDER.map((st, i) => {
              const { start, built } = plan.ladder;
              const state = i < start ? "past" : i === start ? "now" : built > start && i <= built ? "built" : "fut";
              const tag = i === start ? "Start here" : i === built && built > start ? "Built to here" : "";
              const bg = state === "now" ? DEEP : state === "fut" ? "#ffffff" : GRAY_100;
              const fg = state === "now" ? "#ffffff" : state === "fut" ? INK_40 : state === "past" ? INK_60 : INK;
              return (
                <View key={st.name} style={{ flex: 1, backgroundColor: bg, paddingTop: 16, paddingBottom: 10, paddingHorizontal: 9, borderLeftWidth: i ? 0.75 : 0, borderLeftColor: RULE }}>
                  {tag ? (
                    <View style={{ position: "absolute", top: -7, left: 7, backgroundColor: "#ffffff", borderWidth: 0.75, borderColor: DEEP, borderRadius: 7, paddingHorizontal: 5, paddingVertical: 1.5 }}>
                      <Mono color={DEEP} style={{ fontSize: 6 }}>
                        {tag}
                      </Mono>
                    </View>
                  ) : null}
                  <Text style={{ fontWeight: 600, color: fg }}>{st.name}</Text>
                  <Mono color={state === "now" ? "#ffffff" : fg} style={{ marginTop: 3, fontSize: 6.5 }}>
                    {st.sub}
                  </Mono>
                </View>
              );
            })}
          </View>
          <View style={{ height: 28 }}>
            <View style={{ position: "absolute", top: 7, left: `${((pos + 0.5) / 4) * 100}%`, width: 70, marginLeft: -35, alignItems: "center" }}>
              <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: DEEP }} />
              <Mono color={INK} style={{ marginTop: 3 }}>
                You’re here
              </Mono>
            </View>
          </View>
        </Sec>

        <Sec h={planCopy.months.h} d={planCopy.months.d}>
          {plan.months.map((m) => (
            <View key={m.m} wrap={false} style={[s.box, { padding: 12, marginBottom: 7 }]}>
              <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "flex-end", borderBottomWidth: 0.75, borderBottomColor: RULE, paddingBottom: 7 }}>
                <Text style={{ fontWeight: 600, fontSize: 10.5 }}>{m.m}</Text>
                <Text style={{ fontFamily: "Mono", fontSize: 7.5, color: INK_60 }}>
                  {m.from} → <Text style={{ color: DEEP }}>~{m.to}</Text> SCORE
                </Text>
              </View>
              <View style={{ flexDirection: "row", gap: 16, marginTop: 8 }}>
                <View style={{ flex: 1 }}>
                  <Mono>What gets done</Mono>
                  {m.topics.map((t) => (
                    <Item key={t} mark="→" color={INK_60}>
                      {t}
                    </Item>
                  ))}
                </View>
                <View style={{ flex: 1 }}>
                  <Mono color={DEEP}>What Knnekt does alongside</Mono>
                  {m.kn.map((t) => (
                    <Item key={t} mark="•" color={DEEP}>
                      {t}
                    </Item>
                  ))}
                </View>
              </View>
            </View>
          ))}
          <Text style={{ fontSize: 8, color: INK_60, marginTop: 2 }}>{planCopy.months.note}</Text>
        </Sec>

        <Sec h={planCopy.paths.h} d={planCopy.paths.d} keep>
          <View style={{ flexDirection: "row", gap: 10, marginTop: 6 }}>
            {pathOrder.map((k) => {
              const p = PATHS[k];
              const sel = k === "cohort";
              return (
                <View key={k} style={{ flex: 1, borderWidth: 0.75, borderColor: sel ? DEEP : RULE, backgroundColor: sel ? GRAY_100 : "#ffffff", borderRadius: 6, paddingTop: 14, paddingBottom: 10, paddingHorizontal: 12 }}>
                  {sel ? (
                    <View style={{ position: "absolute", top: -7, left: 10, backgroundColor: DEEP, borderRadius: 7, paddingHorizontal: 6, paddingVertical: 2 }}>
                      <Mono color="#ffffff" style={{ fontSize: 6 }}>
                        Fastest path
                      </Mono>
                    </View>
                  ) : null}
                  <Mono color={sel ? DEEP : INK_60}>{p.tag}</Mono>
                  <Text style={{ fontSize: 12.5, fontWeight: 600, marginTop: 5 }}>{p.name}</Text>
                  <Text style={{ fontFamily: "Mono", fontSize: 8, color: INK_70, marginTop: 3 }}>{p.price}</Text>
                  <Text style={{ fontSize: 9, color: INK_70, marginTop: 4 }}>{p.one}</Text>
                  <View style={{ borderTopWidth: 0.75, borderTopColor: RULE, marginTop: 8, paddingTop: 7 }}>
                    <Mono>What’s included</Mono>
                    {p.inc.map((x) => (
                      <Item key={x} mark="✓" color={DEEP}>
                        {x}
                      </Item>
                    ))}
                    <Mono style={{ marginTop: 8 }}>What’s not included</Mono>
                    {p.exc.map((x) => (
                      <Item key={x} mark="×" color={INK_60} textColor={INK_70}>
                        {x}
                      </Item>
                    ))}
                  </View>
                </View>
              );
            })}
          </View>
        </Sec>

        <View wrap={false} style={{ backgroundColor: PANEL, borderRadius: 6, padding: 16, marginTop: 20 }}>
          <Text style={{ fontSize: 14, fontWeight: 600 }}>{next.h}</Text>
          <Text style={{ color: INK_80, marginTop: 4 }}>{next.intro}</Text>
          <View style={{ marginTop: 4 }}>
            {next.bullets.map((b) => (
              <Item key={b} mark="✓" color={DEEP}>
                {b}
              </Item>
            ))}
          </View>
          <View style={{ borderTopWidth: 0.75, borderTopColor: "#8fb3d8", marginTop: 10, paddingTop: 8 }}>
            <Mono color={INK_70}>{next.fine}</Mono>
            <Text style={{ fontSize: 8.5, color: INK_80, marginTop: 4 }}>{next.note(r.route)}</Text>
            <Text style={{ fontSize: 8.5, color: INK_80, marginTop: 4 }}>
              We’ll call {id.phone}. Questions before then? Reply to the email this came with, or write to hello@knnekt.studio.
            </Text>
          </View>
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
