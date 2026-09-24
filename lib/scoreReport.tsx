/**
 * The founder's report as a PDF, three A4 pages: the diagnosis, the path
 * forward and the fee, as the result screen shows them, in the site's type and
 * palette. The answers stay out of it; they live behind "Your answers" on the
 * result screen and in the webhook's payload. The API route attaches this to
 * the founder's email, copies the studio, and forwards it to the webhook, so
 * every copy is the same document.
 */
import { join } from "node:path";
import { Document, Font, Page, StyleSheet, Text, View, renderToBuffer, type Styles } from "@react-pdf/renderer";
import { feeIncludes, ledgerIn, paymentSteps, pricing, pricingFacts } from "./data";
import { archetypes, gateCopy, pillars, verdicts, type Identity, type Result } from "./score";
import { LADDER, plan as planFor, planCopy } from "./scorePlan";

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
const GRAY_200 = "#d3e3f6";
const PANEL = "#a8cef4";

const s = StyleSheet.create({
  page: { fontFamily: "Blank", fontSize: 9, color: INK, paddingTop: 62, paddingBottom: 48, paddingHorizontal: 44, lineHeight: 1.3 },
  head: { position: "absolute", top: 26, left: 44, right: 44, flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingBottom: 9, borderBottomWidth: 0.75, borderBottomColor: RULE },
  brand: { fontSize: 11, fontWeight: 600 },
  foot: { position: "absolute", top: 808, left: 44, right: 44, flexDirection: "row", justifyContent: "space-between" },
  mono: { fontFamily: "Mono", fontSize: 6.5, letterSpacing: 0.8, textTransform: "uppercase", color: INK_60 },
  eye: { flexDirection: "row", alignItems: "center", marginTop: 4 },
  eyeRule: { flex: 1, height: 0.75, backgroundColor: RULE, marginLeft: 8 },
  secH: { fontSize: 11.5, fontWeight: 600, marginTop: 16 },
  secD: { fontSize: 8.5, color: INK_70, marginTop: 2, marginBottom: 7 },
  box: { borderWidth: 0.75, borderColor: RULE, borderRadius: 6 },
  li: { flexDirection: "row", fontSize: 8.5, marginTop: 2.5 },
  mark: { fontFamily: "Mono", width: 10, fontSize: 8 },
  small: { fontSize: 8, color: INK_70 },
});

const Mono = ({ children, color, style }: { children: React.ReactNode; color?: string; style?: Styles[string] }) => <Text style={[s.mono, color ? { color } : {}, style ?? {}]}>{children}</Text>;

function Sec({ h, d, children, keep = false, style }: { h: string; d?: string; children: React.ReactNode; keep?: boolean; style?: Styles[string] }) {
  return (
    <View wrap={!keep} style={style}>
      <View minPresenceAhead={80}>
        <Text style={s.secH}>{h}</Text>
        {d ? <Text style={s.secD}>{d}</Text> : <View style={{ height: 7 }} />}
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
    {children.split(/(₹[\d,]+)/).map((part, i) =>
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
  const gates = r.gates.filter((g): g is Exclude<typeof g, "RESOURCING"> => g !== "RESOURCING");
  const pos = plan.ladder.built > plan.ladder.start ? (plan.ladder.start + plan.ladder.built) / 2 : plan.ladder.start;

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
        <View style={{ flexDirection: "row", alignItems: "flex-end", marginTop: 12 }}>
          <View style={{ width: 150 }}>
            <Mono color={DEEP}>{r.venName}</Mono>
            <View style={{ flexDirection: "row", alignItems: "flex-end", marginTop: 6 }}>
              <Text style={{ fontSize: 52, fontWeight: 600, lineHeight: 0.9, letterSpacing: -1.5 }}>{r.overall}</Text>
              <Mono style={{ marginLeft: 5, marginBottom: 5 }}>/ 100</Mono>
            </View>
          </View>
          <View style={{ flex: 1, paddingBottom: 2 }}>
            <Mono>{plan.stage}</Mono>
            <Text style={{ fontSize: 16, fontWeight: 600, lineHeight: 1.2, marginTop: 4 }}>{arch.name}</Text>
            <Text style={{ color: INK_70, marginTop: 3 }}>{arch.sub}</Text>
          </View>
        </View>

        <View style={[s.box, { flexDirection: "row", marginTop: 12 }]}>
          {facts.map(([k, v], i) => (
            <View key={k} style={{ flex: i === 0 ? 1.4 : 1, paddingVertical: 7, paddingHorizontal: 10, borderLeftWidth: i ? 0.75 : 0, borderLeftColor: RULE }}>
              <Mono>{k}</Mono>
              <Text style={{ fontWeight: 600, marginTop: 3 }}>{v}</Text>
            </View>
          ))}
        </View>

        <View wrap={false} style={{ flexDirection: "row", gap: 8, marginTop: 8 }}>
          <View style={{ flex: 1, backgroundColor: GRAY_100, borderRadius: 6, padding: 10 }}>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <View style={{ width: 6, height: 6, borderRadius: 3, marginRight: 7, backgroundColor: r.confidence.tone === "high" ? DEEP : r.confidence.tone === "med" ? SKY : INK_40 }} />
              <Text style={{ flex: 1, fontWeight: 600 }}>{r.confidence.label}</Text>
              <Text style={{ fontSize: 13, fontWeight: 600, color: DEEP, marginLeft: 8 }}>{r.confidence.pct}%</Text>
            </View>
            <Text style={[s.small, { color: INK_80, marginTop: 4 }]}>{r.confidence.body}</Text>
          </View>
          <View style={{ flex: 1.6, backgroundColor: PANEL, borderRadius: 6, padding: 10 }}>
            <Mono color={DEEP}>
              {verdict.band} · {verdict.bandSub}
            </Mono>
            <Text style={{ fontSize: 11, fontWeight: 600, marginTop: 4 }}>{verdict.title}</Text>
            <Text style={[s.small, { color: INK_80, marginTop: 3 }]}>{verdict.body}</Text>
          </View>
        </View>

        {gates.length ? (
          <View wrap={false} style={{ borderWidth: 0.75, borderColor: "#abc5df", backgroundColor: GRAY_100, borderRadius: 6, paddingHorizontal: 10, paddingVertical: 2, marginTop: 6 }}>
            {gates.map((g, i) => (
              <View key={g} style={{ flexDirection: "row", paddingVertical: 5, borderTopWidth: i ? 0.75 : 0, borderTopColor: "#abc5df" }}>
                <View style={{ width: 118 }}>
                  <Text style={{ fontSize: 8.5, fontWeight: 600, color: DEEP }}>{gateCopy[g][0]}</Text>
                  <Mono style={{ fontSize: 5.5, marginTop: 1 }}>Outweighs your score</Mono>
                </View>
                <Text style={[s.small, { flex: 1, color: INK_80 }]}>{gateCopy[g][1]}</Text>
              </View>
            ))}
          </View>
        ) : null}

        <Sec h={planCopy.constraints.h} d={planCopy.constraints.d} keep>
          <View style={{ flexDirection: "row", gap: 8 }}>
            {r.constraints.map((c, i) => (
              <View key={c.name} style={{ flex: 1, backgroundColor: GRAY_100, borderLeftWidth: 2, borderLeftColor: consColor[i], borderTopRightRadius: 6, borderBottomRightRadius: 6, padding: 9 }}>
                <Mono color={consColor[i]}>{c.label} constraint</Mono>
                <Text style={{ fontWeight: 600, marginTop: 4 }}>{c.name}</Text>
                <Text style={[s.small, { marginTop: 2 }]}>{c.why}</Text>
                <View style={{ borderTopWidth: 0.75, borderTopColor: RULE, marginTop: 6, paddingTop: 5 }}>
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

        <View wrap={false} style={{ flexDirection: "row", gap: 24 }}>
          <Sec h={planCopy.pillars.h} d={planCopy.pillars.d} style={{ flex: 1 }}>
            {pillars.map((p, i) => {
              const w = weak.includes(i);
              const v = r.pct[i];
              return (
                <View key={p.key} style={{ flexDirection: "row", alignItems: "center", marginTop: i ? 5 : 0 }}>
                  <Text style={{ width: 98, fontSize: 8, color: w ? INK : INK_70, fontWeight: w ? 600 : 400 }}>{p.name}</Text>
                  <View style={{ flex: 1, height: 9, backgroundColor: "#f4f8fd", borderRadius: 2 }}>
                    <View style={{ width: `${Math.max(v, 2)}%`, height: 9, borderRadius: 2, backgroundColor: w ? GRAY_100 : DEEP, borderWidth: w ? 1 : 0, borderColor: DEEP }} />
                  </View>
                  <Text style={{ width: 20, textAlign: "right", fontSize: 8, fontWeight: 600, color: w ? INK : DEEP }}>{v}</Text>
                </View>
              );
            })}
          </Sec>

          <Sec h={planCopy.stand.h} d={planCopy.stand.d(r.benchName)} style={{ flex: 1 }}>
            <View style={{ height: 44, marginTop: 2 }}>
              <View style={{ position: "absolute", top: 18, left: 0, right: 0, height: 5, borderRadius: 3, backgroundColor: GRAY_100 }} />
              <View style={{ position: "absolute", top: 18, left: 0, width: `${r.overall}%`, height: 5, borderRadius: 3, backgroundColor: DEEP }} />
              {marks.map(([at]) => (
                <View key={at} style={{ position: "absolute", left: `${at}%`, top: 0, width: 20, marginLeft: -10, alignItems: "center" }}>
                  <Mono>{at}</Mono>
                  <View style={{ width: 0.75, height: 10, backgroundColor: INK_60, marginTop: 2 }} />
                </View>
              ))}
              <View style={{ position: "absolute", left: `${r.overall}%`, top: 15, width: 50, marginLeft: -25, alignItems: "center" }}>
                <View style={{ width: 11, height: 11, borderRadius: 6, backgroundColor: DEEP, borderWidth: 2, borderColor: "#ffffff" }} />
                <Text style={{ fontSize: 8.5, fontWeight: 600, color: DEEP, marginTop: 1 }}>You {r.overall}</Text>
              </View>
            </View>
            <View style={{ flexDirection: "row", flexWrap: "wrap", columnGap: 12, rowGap: 4, marginTop: 6 }}>
              <Mono color={DEEP}>● You {r.overall}</Mono>
              {marks.map(([at, label]) => (
                <View key={label} style={{ flexDirection: "row", alignItems: "center" }}>
                  <View style={{ width: 0.75, height: 7, backgroundColor: INK_60, marginRight: 4 }} />
                  <Mono>
                    {label} {at}
                  </Mono>
                </View>
              ))}
            </View>
          </Sec>
        </View>

        {/* Page 02: the path forward */}
        <View break style={s.eye}>
          <Mono>Page 02 — Your path forward</Mono>
          <View style={s.eyeRule} />
        </View>

        <Sec h={planCopy.left.h} d={planCopy.left.d} keep>
          <View style={[s.box, { paddingVertical: 10, paddingHorizontal: 12 }]}>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <View style={{ flexDirection: "row", alignItems: "flex-end" }}>
                <Text style={{ fontSize: 20, fontWeight: 600, lineHeight: 1 }}>{plan.check.done}</Text>
                <Text style={{ fontSize: 10, color: INK_40, marginLeft: 2 }}>/{plan.check.total}</Text>
                <Text style={{ fontWeight: 600, color: INK_70, marginLeft: 6 }}>launch-ready</Text>
              </View>
              <View style={{ flex: 1, height: 5, borderRadius: 3, backgroundColor: GRAY_100, marginLeft: 14 }}>
                <View style={{ width: `${Math.round((plan.check.done / plan.check.total) * 100)}%`, height: 5, borderRadius: 3, backgroundColor: DEEP }} />
              </View>
            </View>
            <Text style={{ fontSize: 8.5, color: DEEP, marginTop: 6 }}>{planCopy.lrDone(plan.check.done)}</Text>
            <View style={{ flexDirection: "row", flexWrap: "wrap", marginTop: 4, justifyContent: "space-between" }}>
              {plan.check.items.map((it) => (
                <View key={it.label} style={{ width: "32%", flexDirection: "row", borderBottomWidth: 0.75, borderBottomColor: RULE, paddingVertical: 3.5 }}>
                  <Text style={[s.mark, { color: it.done ? DEEP : INK }]}>{it.done ? "✓" : "→"}</Text>
                  <Text style={{ flex: 1, fontSize: 8.5, color: it.done ? INK_60 : INK }}>{it.label}</Text>
                </View>
              ))}
            </View>
            <Text style={[s.small, { marginTop: 6 }]}>{plan.check.footer}</Text>
          </View>
        </Sec>

        <Sec h={planCopy.ladder.h} d={planCopy.ladder.d} keep>
          <View style={[s.box, { flexDirection: "row", marginTop: 5 }]}>
            {LADDER.map((st, i) => {
              const { start, built } = plan.ladder;
              const state = i < start ? "past" : i === start ? "now" : built > start && i <= built ? "built" : "fut";
              const tag = i === start ? "Start here" : i === built && built > start ? "Built to here" : "";
              const bg = state === "now" ? DEEP : state === "fut" ? "#ffffff" : GRAY_100;
              const fg = state === "now" ? "#ffffff" : state === "fut" ? INK_40 : state === "past" ? INK_60 : INK;
              return (
                <View key={st.name} style={{ flex: 1, backgroundColor: bg, paddingTop: 12, paddingBottom: 8, paddingHorizontal: 9, borderLeftWidth: i ? 0.75 : 0, borderLeftColor: RULE }}>
                  {tag ? (
                    <View style={{ position: "absolute", top: -7, left: 7, backgroundColor: "#ffffff", borderWidth: 0.75, borderColor: DEEP, borderRadius: 7, paddingHorizontal: 5, paddingVertical: 1.5 }}>
                      <Mono color={DEEP} style={{ fontSize: 6 }}>
                        {tag}
                      </Mono>
                    </View>
                  ) : null}
                  <Text style={{ fontWeight: 600, color: fg }}>{st.name}</Text>
                  <Mono color={state === "now" ? "#ffffff" : fg} style={{ marginTop: 2, fontSize: 6 }}>
                    {st.sub}
                  </Mono>
                </View>
              );
            })}
          </View>
          <View style={{ height: 22 }}>
            <View style={{ position: "absolute", top: 5, left: `${((pos + 0.5) / 4) * 100}%`, width: 70, marginLeft: -35, alignItems: "center" }}>
              <View style={{ width: 7, height: 7, borderRadius: 4, backgroundColor: DEEP }} />
              <Mono color={INK} style={{ marginTop: 2 }}>
                You’re here
              </Mono>
            </View>
          </View>
        </Sec>

        <Sec h={planCopy.months.h} d={planCopy.months.d} keep>
          <View style={{ flexDirection: "row", gap: 8 }}>
            {plan.months.map((m) => (
              <View key={m.m} style={[s.box, { flex: 1, paddingVertical: 9, paddingHorizontal: 10 }]}>
                <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "flex-end", borderBottomWidth: 0.75, borderBottomColor: RULE, paddingBottom: 5 }}>
                  <Text style={{ fontWeight: 600, fontSize: 10 }}>{m.m}</Text>
                  <Text style={{ fontFamily: "Mono", fontSize: 6.5, color: INK_60 }}>
                    {m.from} → <Text style={{ color: DEEP }}>~{m.to}</Text> SCORE
                  </Text>
                </View>
                <Mono style={{ marginTop: 7 }}>What gets done</Mono>
                {m.topics.map((t) => (
                  <Item key={t} mark="→" color={INK_60}>
                    {t}
                  </Item>
                ))}
                <Mono color={DEEP} style={{ marginTop: 8 }}>
                  What Knnekt does alongside
                </Mono>
                {m.kn.map((t) => (
                  <Item key={t} mark="•" color={DEEP}>
                    {t}
                  </Item>
                ))}
              </View>
            ))}
          </View>
          <Text style={{ fontSize: 7.5, color: INK_60, marginTop: 6 }}>{planCopy.months.note}</Text>
        </Sec>

        {/* Page 03: the fee, as the pricing section on the site sets it out */}
        <View break style={s.eye}>
          <Mono>Page 03 — The fee</Mono>
          <View style={s.eyeRule} />
        </View>

        <Sec h={planCopy.fee.h} d={planCopy.fee.d} keep>
          <View style={{ flexDirection: "row", gap: 5 }}>
            {["Application-only", `${pricing.seats} seats per cohort`].map((chip) => (
              <Mono key={chip} color={INK_70} style={{ backgroundColor: GRAY_200, borderRadius: 8, paddingHorizontal: 7, paddingVertical: 3.5 }}>
                {chip}
              </Mono>
            ))}
          </View>
          <View style={{ flexDirection: "row", borderTopWidth: 0.75, borderTopColor: RULE, borderBottomWidth: 0.75, borderBottomColor: RULE, marginTop: 10 }}>
            {pricingFacts.map(([title, body], i) => (
              <View key={title} style={{ flex: 1, paddingVertical: 8, paddingLeft: i ? 9 : 0, paddingRight: 9, borderLeftWidth: i ? 0.75 : 0, borderLeftColor: RULE }}>
                <Text style={{ fontWeight: 600 }}>{title}</Text>
                <Text style={[s.small, { marginTop: 2 }]}>{body}</Text>
              </View>
            ))}
          </View>

          <View style={{ flexDirection: "row", gap: 16, marginTop: 14, alignItems: "flex-start" }}>
            <View style={{ flex: 1.06 }}>
              <Mono color={INK_80}>How you pay it</Mono>
              <View style={{ borderTopWidth: 1, borderTopColor: INK, marginTop: 6 }}>
                {paymentSteps.map((step, i) => (
                  <View key={step.title} style={{ flexDirection: "row", alignItems: "flex-start", borderBottomWidth: 0.75, borderBottomColor: RULE, paddingVertical: 8 }}>
                    <View style={{ width: 15, height: 15, borderRadius: 8, borderWidth: 0.75, borderColor: INK, alignItems: "center", justifyContent: "center", marginRight: 9 }}>
                      <Text style={{ fontFamily: "Mono", fontSize: 6.5 }}>{i + 1}</Text>
                    </View>
                    <View style={{ flex: 1 }}>
                      <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "baseline" }}>
                        <Text style={{ fontWeight: 600 }}>{step.title}</Text>
                        <Text style={{ fontFamily: "Mono", fontSize: 10.5 }}>{step.amount}</Text>
                      </View>
                      <Text style={[s.small, { marginTop: 3 }]}>
                        <Rupees>{step.body}</Rupees>
                      </Text>
                      <Mono color={INK_40} style={{ marginTop: 3 }}>
                        {step.when}
                      </Mono>
                    </View>
                  </View>
                ))}
              </View>
              <Text style={[s.small, { marginTop: 6 }]}>
                Total <Text style={{ fontFamily: "Mono", color: INK }}>{pricing.total}</Text>. Every rupee is scheduled before you start: no milestone invoices, no change orders, no surprise line at day
                70.
              </Text>
            </View>

            <View style={{ flex: 0.94, backgroundColor: PANEL, borderRadius: 6, padding: 13 }}>
              <Text style={{ fontSize: 12.5, fontWeight: 600 }}>What the fee covers</Text>
              <Mono color={INK_70} style={{ marginTop: 3 }}>
                {pricing.cohort}
              </Mono>
              <View style={{ marginTop: 5 }}>
                {feeIncludes.map(([thing, note]) => (
                  <Item key={thing} mark="✓" color={DEEP} textColor={INK_80}>
                    <Text style={{ fontWeight: 600, color: INK }}>{thing}</Text>, {note}
                  </Item>
                ))}
              </View>
              <View style={{ borderTopWidth: 0.75, borderTopColor: "#8fb3d8", marginTop: 9, paddingTop: 8 }}>
                <Mono color={INK_70}>Program fee</Mono>
                <Text style={{ fontFamily: "Mono", fontSize: 19, lineHeight: 1, marginTop: 4 }}>
                  {pricing.fee}{" "}
                  <Text style={[s.mono, { color: INK_70 }]}>{pricing.gst}</Text>
                </Text>
              </View>
              <View style={{ flexDirection: "row", gap: 2, marginTop: 10 }}>
                {Array.from({ length: pricing.seats }, (_, i) => (
                  <View key={i} style={{ flex: 1, height: 10, borderRadius: 2, backgroundColor: i < pricing.seats - pricing.seatsLeft ? INK : "#8fb3d8" }} />
                ))}
              </View>
              <Mono color={INK_70} style={{ marginTop: 4 }}>
                {pricing.seatsLeft} of {pricing.seats} seats left · {pricing.cohort}
              </Mono>
              <Text style={[s.small, { color: INK_80, marginTop: 7 }]}>{pricing.fine}</Text>
            </View>
          </View>
        </Sec>

        <View wrap={false} style={{ backgroundColor: GRAY_100, borderWidth: 0.75, borderColor: "#abc5df", borderRadius: 6, paddingVertical: 11, paddingHorizontal: 13, marginTop: 12 }}>
          <Text style={{ fontSize: 12.5, fontWeight: 600 }}>
            Included{"  "}
            <Text style={[s.mono, { color: INK_40 }]}>in the 90</Text>
          </Text>
          <Text style={[s.small, { marginTop: 2 }]}>Everything the roadmap needs to hit the goal.</Text>
          <View style={{ flexDirection: "row", gap: 14, marginTop: 6 }}>
            {[0, 1, 2].map((c) => {
              const per = Math.ceil(ledgerIn.length / 3);
              return (
                <View key={c} style={{ flex: 1 }}>
                  {ledgerIn.slice(c * per, (c + 1) * per).map((item) => (
                    <View key={item} style={{ flexDirection: "row", alignItems: "center", borderTopWidth: 0.75, borderTopColor: RULE, paddingVertical: 4.5 }}>
                      <View style={{ width: 4, height: 4, borderRadius: 2, backgroundColor: INK, marginRight: 7 }} />
                      <Text style={{ fontSize: 8.5 }}>{item}</Text>
                    </View>
                  ))}
                </View>
              );
            })}
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
