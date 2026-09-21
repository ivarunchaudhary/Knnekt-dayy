/**
 * The Startup Operating Score, v2.1: the question bank, the scoring, the
 * gates, the archetype and the verdict, plus the copy the report is built
 * from. Everything the quiz shows comes from here, so the copy stays data
 * and the arithmetic stays in one place.
 *
 * The bank runs in sections: company context, the six pillars (three
 * questions each, one page per pillar) and one resourcing question. Only the
 * pillar questions score; the rest shape the readout and the call.
 */
import { scorePillars } from "./data";

/** How the instrument behaves. The only values here meant to move. */
export const CONFIG = {
  INSTRUMENT_VERSION: "v2.1",
  THRESHOLD_DOOR_A: 65,
  THRESHOLD_STOP: 30,
  /** The Demand gate reads raw pillar values (0–20), never percentages. */
  DEMAND_GATE_RAW: 6,
  RETAKE_LOCKOUT_DAYS: 60,
  /** Seconds the result page waits before sending an opted-in founder to WhatsApp. */
  WA_REDIRECT_SECS: 8,
  /** Each pillar's three questions are worth 8, 6 and 6. */
  PILLAR_MAX: 20,
};

export const pillars = [
  { key: "clarity", name: "Strategic Clarity" },
  { key: "evidence", name: "Customer Evidence" },
  { key: "product", name: "Product Execution" },
  { key: "traction", name: "Commercial Traction" },
  { key: "ops", name: "Operational Readiness" },
  { key: "investment", name: "Investment Readiness" },
] as const;
export type PillarKey = (typeof pillars)[number]["key"];
const IDX = { clarity: 0, evidence: 1, product: 2, traction: 3, ops: 4, investment: 5 };

/** Tie-break when ranking constraints: the earliest-stage one always wins. */
const NECK_ORDER = [1, 3, 0, 2, 4, 5];

/** Non-scoring questions the readout reads by name. */
export type Key = "cat" | "venName" | "founders" | "built" | "desc" | "exp" | "g1" | "g2" | "g3";

type Base = { sec: number; q: string; h?: string; sub?: string };
export type Question =
  | (Base & { kind: "single"; key?: Key; pillar?: number; options: { label: string; points: number }[]; specify?: number })
  | (Base & { kind: "short"; key: Key; placeholder: string; min: number; max: number })
  | (Base & { kind: "text"; key: Key; placeholder: string; min: number; sweet: number; max: number })
  | (Base & { kind: "multi"; key: Key; options: { label: string }[]; excl: number });

/** A picked option index, typed text, a set of picks, or nothing yet. */
export type Answer = number | string | number[] | null;
export type Answers = Answer[];

const single = (sec: number, q: string, h: string, options: [string, number][], extra: { key?: Key; pillar?: number; sub?: string; specify?: number } = {}): Question => ({
  kind: "single",
  sec,
  q,
  h: h || undefined,
  options: options.map(([label, points]) => ({ label, points })),
  ...extra,
});

/** Section labels, indexed by `sec`: 0 context, 1–6 pillars, 7 resourcing. */
export const SECTIONS = ["Company context", "Pillar 1 of 6", "Pillar 2 of 6", "Pillar 3 of 6", "Pillar 4 of 6", "Pillar 5 of 6", "Pillar 6 of 6", "Resourcing"];

export const questions: Question[] = [
  single(0, "Which best describes what you’re building?", "Your benchmark adapts to this answer.", [
    ["Consumer brand / physical product (D2C)", 0],
    ["Software product (SaaS or app)", 0],
    ["Marketplace or platform (two-sided)", 0],
    ["AI-native product", 0],
    ["Services / agency", 0],
    ["Creator or personal brand moving into products", 0],
    ["Something else", 0],
  ], { key: "cat", specify: 6 }),
  { kind: "short", sec: 0, key: "venName", q: "What’s the name of your venture?", h: "A working name is fine, it goes on your report.", placeholder: "e.g. Glow Labs", min: 2, max: 60 },
  single(0, "How many founders are building this?", "", [
    ["Just me, solo founder", 0],
    ["Two founders", 0],
    ["Three or more", 0],
  ], { key: "founders" }),
  {
    kind: "multi",
    sec: 0,
    key: "built",
    q: "What have you already put in place?",
    h: "Tick anything that’s true. Leave it blank if you’re still at the idea stage.",
    options: ["Registered / incorporated the company", "Built a website or store", "Built a working product or MVP", "Set your pricing", "Got your first paying customers", "Raised outside funding", "None, still at the idea stage"].map((label) => ({ label })),
    excl: 6,
  },
  {
    kind: "text",
    sec: 0,
    key: "desc",
    q: "In a few sentences, what are you building?",
    h: "What it is, who it’s for, and where you are right now. This is the one part only you can answer.",
    placeholder: "e.g. A D2C ashwagandha skincare line for women 25–40 with sensitive skin. Formulation locked, no manufacturer yet, pre-launch, zero revenue.",
    min: 150,
    sweet: 400,
    max: 500,
  },
  single(0, "Which best describes your experience building companies?", "", [
    ["This is my first venture.", 0],
    ["I’ve started something before, but didn’t take it far.", 0],
    ["I’ve built and run a company to real revenue.", 0],
    ["I’ve scaled or exited a company previously.", 0],
  ], { key: "exp" }),
  single(0, "What level of weekly commitment does the founding team currently give this venture?", "", [
    ["Occasional: this runs alongside other primary commitments.", 0],
    ["Part-time: a meaningful but secondary allocation.", 1],
    ["Substantially full-time across the founding team.", 2],
    ["Full-time and primary for all founders.", 3],
  ], { key: "g1" }),
  single(0, "Which statement best describes the venture’s current capital position?", "", [
    ["Neither committed customer revenue nor institutional funding.", 0],
    ["Institutional or angel funding secured; revenue not yet established.", 1],
    ["Customer revenue established; no institutional funding.", 2],
    ["Both customer revenue and institutional funding in place.", 3],
  ], { key: "g2" }),

  // 1 · Strategic Clarity
  single(1, "Which statement best describes your understanding of the customer you are building for?", "", [
    ["We are still exploring the problem space.", 0],
    ["We understand the market segment but are still refining the ideal customer profile.", 3],
    ["We have a documented ICP validated through direct customer conversations.", 5],
    ["Our ICP is continuously refined using behavioural and commercial data.", 8],
  ], { pillar: 0, sub: "Customer Definition" }),
  single(1, "Which statement best reflects how your positioning currently holds up in the market?", "", [
    ["Our positioning changes depending on who we are speaking to.", 0],
    ["We can explain what we do, but customers describe it differently.", 2],
    ["Customers consistently repeat our value proposition back to us.", 4],
    ["Customers refer others because they clearly understand our positioning.", 6],
  ], { pillar: 0, sub: "Value Proposition" }),
  single(1, "If your current roadmap disappeared tomorrow, what would you rebuild it from?", "", [
    ["We would be starting from scratch.", 0],
    ["We would rebuild from internal assumptions and founder judgment.", 2],
    ["We would rebuild from documented customer evidence.", 4],
    ["We would rebuild from observed customer behaviour and commercial data.", 6],
  ], { pillar: 0, sub: "Strategic Prioritisation" }),

  // 2 · Customer Evidence
  single(2, "Which statement best represents the basis of your current customer understanding?", "", [
    ["Our understanding is primarily internal.", 0],
    ["We have validated through a limited number of conversations, mostly within our network.", 3],
    ["We have validated through structured conversations with buyers outside our network.", 5],
    ["We validate continuously, and can quote the exact language buyers use.", 8],
  ], { pillar: 1, sub: "Evidence Base" }),
  single(2, "What best describes your understanding of why prospective buyers decline?", "", [
    ["No one has declined; we have not yet put the proposition in front of buyers.", 0],
    ["Prospects go quiet, and we are not certain why.", 2],
    ["We understand the general reasons for hesitation.", 4],
    ["We can state the precise objection, and what we changed in response to it.", 6],
  ], { pillar: 1, sub: "Objection Intelligence" }),
  single(2, "When did customer evidence last change a decision the team had already made?", "", [
    ["It has not.", 0],
    ["More than three months ago.", 2],
    ["Within the last month.", 4],
    ["Continuously: it is how decisions are made here.", 6],
  ], { pillar: 1, sub: "Learning Cadence" }),

  // 3 · Product Execution
  single(3, "Which statement best reflects your current product maturity?", "", [
    ["The core product is still being defined.", 0],
    ["An MVP exists but has not been released beyond the team.", 3],
    ["The product is live and used without founder involvement.", 5],
    ["The product supports consistent delivery at current scale.", 8],
  ], { pillar: 2, sub: "Product Maturity" }),
  single(3, "How are product decisions currently made?", "", [
    ["By whatever appears most broken in a given week.", 0],
    ["By an internal roadmap and founder judgment.", 2],
    ["By explicit customer requests.", 4],
    ["By observed customer behaviour and usage data.", 6],
  ], { pillar: 2, sub: "Prioritisation Method" }),
  single(3, "Which statement best describes your release cadence?", "", [
    ["We have not yet released.", 0],
    ["Releases are infrequent and driven by internal readiness.", 2],
    ["We release regularly against a defined cycle.", 4],
    ["We release continuously and measure the impact of each change.", 6],
  ], { pillar: 2, sub: "Release Discipline" }),

  // 4 · Commercial Traction
  single(4, "Which best describes your sales today?", "", [
    ["No sales yet.", 0],
    ["Sales happen, but only when I personally push: discounts, my own network.", 2],
    ["A repeatable channel brings sales without me, but I’m not sure they’re profitable.", 4],
    ["Repeatable and profitable: customers come back and each sale makes money.", 8],
  ], { pillar: 3, sub: "Commercial Validation" }),
  single(4, "Which statement best represents your current revenue position?", "", [
    ["Pre-revenue.", 0],
    ["Initial commercial activity, not yet repeatable.", 2],
    ["Repeatable revenue generation.", 4],
    ["Predictable growth supported by measurable acquisition.", 6],
  ], { pillar: 3, sub: "Revenue Position" }),
  single(4, "Which statement best describes the primary number you manage the business against?", "", [
    ["We do not yet track a primary metric.", 0],
    ["We track engagement or audience measures.", 2],
    ["We track a commercial metric and review it periodically.", 4],
    ["We track a commercial metric, know its thirty-day movement, and know why it moved.", 6],
  ], { pillar: 3, sub: "Metric Discipline" }),

  // 5 · Operational Readiness
  single(5, "If customer demand doubled next week, what would happen?", "", [
    ["We would struggle significantly.", 0],
    ["We would absorb it manually, at some cost to quality.", 3],
    ["It would require minor operational changes.", 5],
    ["Current systems would support it without material intervention.", 8],
  ], { pillar: 4, sub: "Delivery Capacity" }),
  single(5, "How dependent is day-to-day execution on the founding team?", "", [
    ["Nothing progresses without direct founder involvement.", 0],
    ["Most execution routes through the founders.", 2],
    ["Core processes run with periodic founder oversight.", 4],
    ["The business executes independently of the founders.", 6],
  ], { pillar: 4, sub: "Founder Dependency" }),
  single(5, "How much repeatable work has been systemised or automated?", "", [
    ["Very little: work is handled as it arises.", 0],
    ["Some processes are documented but not consistently followed.", 2],
    ["Core repeatable work is systemised and followed.", 4],
    ["Repeatable work is systemised and progressively automated.", 6],
  ], { pillar: 4, sub: "Systemisation" }),

  // 6 · Investment Readiness
  single(6, "If an investor requested materials today, what could you provide?", "", [
    ["Nothing currently prepared.", 0],
    ["Materials that would require substantial work before sharing.", 3],
    ["A current deck we would share with minor reservations.", 5],
    ["A deck and a populated data room, today.", 8],
  ], { pillar: 5, sub: "Diligence Position" }),
  single(6, "Which statement best reflects your corporate position?", "", [
    ["Not yet incorporated.", 0],
    ["Incorporated; supporting documentation incomplete.", 2],
    ["Incorporated, clean cap table, founder agreements executed.", 4],
    ["All of the above, plus IP assigned and compliance current.", 6],
  ], { pillar: 5, sub: "Corporate Structure" }),
  single(6, "If an investor examined founder equity, vesting and decision rights today, how would that hold up?", "", [
    ["These have not been formalised.", 0],
    ["Informally agreed between founders, not documented.", 2],
    ["Documented, with some areas still unresolved.", 4],
    ["Fully documented and unambiguous.", 6],
  ], { pillar: 5, sub: "Founder Alignment" }),

  // Resourcing
  single(7, "What level of monthly investment is realistic for a focused three-month engagement?", "There is no wrong answer here. It scopes the conversation, it does not qualify you for it.", [
    ["Below ₹60,000 per month.", 0],
    ["₹60,000 to ₹1,00,000 per month.", 1],
    ["₹1,00,000 to ₹2,00,000 per month.", 2],
    ["Above ₹2,00,000 per month.", 3],
  ], { key: "g3" }),
];

/** One page per section: context, each pillar, resourcing. Question indexes per page. */
export const pages: { sec: number; qs: number[] }[] = (() => {
  const out: { sec: number; qs: number[] }[] = [];
  questions.forEach((q, i) => {
    const last = out[out.length - 1];
    if (last && last.sec === q.sec) last.qs.push(i);
    else out.push({ sec: q.sec, qs: [i] });
  });
  return out;
})();

/** What the page header says for each section. */
export function pageMeta(sec: number): { eye: string; h: string; hint: string } {
  if (sec === 0) return { eye: "Company context", h: "First, some context.", hint: "A few quick questions about the company and the team. Your benchmark and report adapt to these." };
  if (sec === 7) return { eye: "Resourcing", h: "One last question.", hint: "" };
  return { eye: SECTIONS[sec], h: pillars[sec - 1].name, hint: "Pick the statement that is most true today, not where you hope to be." };
}

const indexOf = (key: Key) => questions.findIndex((q) => q.key === key);

/** Whether a question has an answer the page will accept. Blank multi = idea stage, allowed. */
export function answered(i: number, answers: Answers, catOther = ""): boolean {
  const q = questions[i];
  const a = answers[i];
  if (q.kind === "text") return typeof a === "string" && a.trim().length >= q.min;
  if (q.kind === "short") return typeof a === "string" && a.trim().length >= q.min;
  if (q.kind === "multi") return true;
  if (typeof a !== "number") return false;
  if (q.specify !== undefined && a === q.specify) return catOther.trim().length >= 2;
  return true;
}

/** Whether the founder has actually put something into a question. Same as
 *  `answered`, except a blank multi counts as still waiting: the page will
 *  accept it empty, but we must not scroll anyone past a question they have
 *  not read. Use this to decide where to move next, never to gate Continue. */
export function touched(i: number, answers: Answers, catOther = ""): boolean {
  if (questions[i].kind === "multi") {
    const a = answers[i];
    return Array.isArray(a) && a.length > 0;
  }
  return answered(i, answers, catOther);
}

export type Gate = "COMMITMENT" | "CAPITAL" | "DEMAND" | "RESOURCING";
export type Archetype = "Explorer" | "Visionary" | "Builder" | "Operator" | "Architect" | "Scaler";
export type Route = "STOP" | "B" | "A" | "WAIT";

export const archetypes: Record<Archetype, { name: string; sub: string }> = {
  Explorer: { name: "The Explorer", sub: "Idea-rich, evidence-poor. You have a thesis and no proof of anything yet, including that the problem is real." },
  Visionary: { name: "The Visionary", sub: "You can describe this business precisely, which is rarer than you’d think. Nobody outside the building has confirmed it." },
  Builder: { name: "The Builder", sub: "You are investing in product faster than the market is validating demand. Your execution isn’t the problem. Your evidence is." },
  Operator: { name: "The Operator", sub: "You are selling faster than the business can deliver. Growth is now the risk, not the goal." },
  Architect: { name: "The Architect", sub: "The business is right and under-levered. You are currently the integration layer between functions, and that is the ceiling." },
  Scaler: { name: "The Scaler", sub: "Nothing here is the constraint except capacity. The decision is which functions to resource properly, and it is fewer than you think." },
};

/** Why a pillar is the bottleneck, when it is. */
const NECK: Record<PillarKey, string> = {
  clarity: "The company cannot be described consistently, which means it cannot be sold, hired for, or funded consistently.",
  evidence: "The business is currently running on internal assumptions. Every downstream decision inherits that risk.",
  product: "You have demand and clarity, and no usable thing to attach them to.",
  traction: "Nobody has voted with money yet, or the number that matters isn’t moving.",
  ops: "Growth is the risk. The business would struggle under its own success.",
  investment: "Everything real exists; the paperwork doesn’t. This is the cheapest constraint on the list and the one most often fixed too early.",
};

/** What a weak pillar quietly costs. */
const COST: Record<PillarKey, string[]> = {
  clarity: ["Effort spread across too many bets", "No clear story to pull people in", "You keep re-deciding the same things"],
  evidence: ["Building things nobody asked for", "Messaging that doesn’t land", "Money spent before you have proof"],
  product: ["The plan just sits there unbuilt", "You lose momentum", "You spend all day on small tasks"],
  traction: ["Revenue you can’t predict", "Sales you can’t repeat", "Tough investor conversations"],
  ops: ["Everything runs through you", "Growth turns into chaos", "Quality drops as volume climbs"],
  investment: ["Nothing documented or reported", "Worse terms if you raise", "Harder to hire senior people"],
};

/** The first thing to fix, per pillar. Rendered in fixed pillar order, never lowest-first. */
export const POINTS: Record<PillarKey, string> = {
  clarity: "A single written positioning line that survives contact with a buyer",
  evidence: "Structured conversations with buyers outside your own network",
  product: "Something a stranger can use without you in the room",
  traction: "Commercial proof: someone paying, or a clear reason they didn’t",
  ops: "Knowing what breaks first if volume doubles",
  investment: "A data room that exists before anyone asks for it",
};

/**
 * The verdict, per route. Nobody books anything: the studio calls the number
 * the founder gave, so every line is written for that call.
 */
export const verdicts: Record<Route, { band: string; bandSub: string; title: string; body: string }> = {
  STOP: {
    band: "Very early",
    bandSub: "Let’s talk first",
    title: "Start with a conversation.",
    body: "There isn’t quite enough here yet to prescribe a program honestly. When we call, we’ll assess where you are, tell you the one thing to fix first, and be straight about whether working together makes sense yet.",
  },
  B: {
    band: "Direction",
    bandSub: "Clarity is the constraint",
    title: "You have a direction problem, not an execution one.",
    body: "What stands between you and progress isn’t hands. It’s the absence of someone asking, every week, whether you did what you said. On the call we’ll walk your score, then map the fastest route to launch-ready.",
  },
  A: {
    band: "Execution",
    bandSub: "You’re short of hands",
    title: "You know what you’re building. You’re short of hands.",
    body: "The problem isn’t clarity. It’s fragmentation: work scattered across freelancers and tools with nobody joining the dots. On the call we’ll pinpoint which capabilities you actually need next, and how we’d operate beside you.",
  },
  WAIT: {
    band: "Ready",
    bandSub: "Timing, not readiness",
    title: "Ready. Let’s get the timing right.",
    body: "You’d score well enough to work with us. When we call, we’ll tell you exactly what we’d do in your position and you can set the pace. We won’t push you to spend before it’s sensible.",
  },
};

export const gateCopy: Record<Exclude<Gate, "RESOURCING">, [string, string]> = {
  COMMITMENT: ["Commitment", "At under five hours a week, no amount of help will move the needle. That is why this counts for more than everything else here."],
  CAPITAL: ["Capital position", "You do not have paying customers or funding yet. Getting money in is the biggest thing to sort before spending more, so it counts for more than your score here."],
  DEMAND: ["Demand", "Both Customer Evidence and Commercial Traction are close to empty. That mix is the most common lead-up to an expensive mistake, so it counts for more than the rest of your score."],
};

/** What happens after the last answer. The founder does nothing; we call. */
export const next = {
  h: "What happens next",
  intro: "Your report is on its way to your inbox: the full breakdown, every answer, attached as a PDF. In the meantime, we’ll:",
  bullets: [
    "Call you on the number you gave us to walk through your score and where it comes from",
    "Pressure-test your venture, your stage and your next moves",
    "Tell you what to do first and what to skip",
    "Help you decide: join the Build90 cohort, or take the roadmap and run it yourself",
  ],
  fine: "Free · Yours to keep · We call you, you don’t book anything",
  note: (route: Route) =>
    route === "STOP" ? "Nothing to buy on the call. If now isn’t the right time, we’ll say so." : "No pressure to join. If now isn’t the right time, or the roadmap is the better fit, we’ll tell you straight.",
};

/** Benchmarks per business model: median, top third, scale-ready. */
const MODEL = ["d2c", "saas", "mkt", "saas", "gen", "d2c", "gen"] as const;
const MODEL_NAME = ["D2C", "SaaS", "Marketplace", "AI-native", "Services", "Creator-led", "all models"];
const BENCH: Record<(typeof MODEL)[number], [number, number, number]> = { d2c: [37, 71, 82], saas: [44, 79, 85], mkt: [39, 70, 82], gen: [40, 72, 83] };

const CONF_COPY = {
  low: "Right now you’re deciding on gut more than proof. The job for the next month is getting that proof, not building more.",
  med: "You’ve got some real signal and a clearer direction. What’s missing is turning that plan into something live that customers actually use.",
  high: "You’ve proven people want this. The question now isn’t what to build, it’s how to grow without the wheels coming off.",
};

export type Result = {
  /** Per pillar, raw 0–20 and 0–100. */
  raw: number[];
  pct: number[];
  rawTotal: number;
  overall: number;
  gates: Gate[];
  primary: number;
  secondary: number | null;
  arch: Archetype;
  route: Route;
  g1: number | null;
  g2: number | null;
  g3: number | null;
  cat: number | null;
  catOther: string;
  exp: number | null;
  founders: number | null;
  venName: string;
  desc: string;
  built: number[];
  /** When a STOP verdict may be retaken. */
  unlock: Date;
  /** Model benchmark: name, [median, top third, scale-ready]. */
  benchName: string;
  bench: [number, number, number];
  confidence: { pct: number; tone: "low" | "med" | "high"; label: string; body: string };
  /** Up to three: primary, secondary, tertiary. */
  constraints: { label: string; name: string; why: string; cost: string[] }[];
};

const num = (a: Answer): number | null => (typeof a === "number" ? a : null);
const str = (a: Answer): string => (typeof a === "string" ? a.trim() : "");

/** The full readout once every page is answered. Pure: no DOM, no network. */
export function grade(answers: Answers, catOther = ""): Result {
  const raw = [0, 0, 0, 0, 0, 0];
  questions.forEach((q, i) => {
    const a = answers[i];
    if (q.kind === "single" && q.pillar !== undefined && typeof a === "number") raw[q.pillar] += q.options[a].points;
  });
  const pct = raw.map((r) => Math.round((r / CONFIG.PILLAR_MAX) * 100));
  const rawTotal = raw.reduce((a, b) => a + b, 0);
  const overall = Math.round((rawTotal / (CONFIG.PILLAR_MAX * 6)) * 100);

  const g1 = num(answers[indexOf("g1")]);
  const g2 = num(answers[indexOf("g2")]);
  const g3 = num(answers[indexOf("g3")]);
  const cat = num(answers[indexOf("cat")]);
  const exp = num(answers[indexOf("exp")]);
  const founders = num(answers[indexOf("founders")]);
  const builtAnswer = answers[indexOf("built")];
  const built = Array.isArray(builtAnswer) ? builtAnswer : [];

  // Gates, evaluated before the score.
  const gates: Gate[] = [];
  if (g1 === 0) gates.push("COMMITMENT");
  if (g2 === 0) gates.push("CAPITAL");
  if (raw[IDX.evidence] <= CONFIG.DEMAND_GATE_RAW && raw[IDX.traction] <= CONFIG.DEMAND_GATE_RAW) gates.push("DEMAND");

  // Bottlenecks.
  const ranked = NECK_ORDER.slice().sort((a, b) => pct[a] - pct[b] || NECK_ORDER.indexOf(a) - NECK_ORDER.indexOf(b));
  const primary = ranked[0];
  let secondary: number | null = ranked[1];
  if (pct[secondary] >= Math.max(...pct) - 10) secondary = null;

  // Archetype, first match wins.
  const hi = pct.indexOf(Math.max(...pct));
  const lo = primary;
  const othersAtLeast = (n: number, skip: number) => pct.every((v, i) => i === skip || v >= n);
  let arch: Archetype;
  if (overall < CONFIG.THRESHOLD_STOP) arch = "Explorer";
  else if (Math.min(...pct) >= 70) arch = "Scaler";
  else if (lo === IDX.ops && (pct[IDX.evidence] >= 60 || pct[IDX.traction] >= 60)) arch = "Operator";
  else if ((lo === IDX.evidence || lo === IDX.traction) && hi === IDX.product) arch = "Builder";
  else if ((lo === IDX.evidence || lo === IDX.traction) && hi === IDX.clarity) arch = "Visionary";
  else if ((lo === IDX.investment || lo === IDX.ops) && othersAtLeast(55, lo)) arch = "Architect";
  else if (lo === IDX.evidence || lo === IDX.traction) arch = "Visionary";
  else arch = "Builder";

  // Routing, first match wins, gates before score.
  let route: Route;
  if (gates.includes("COMMITMENT")) route = "STOP";
  else if (overall < CONFIG.THRESHOLD_STOP) route = "STOP";
  else if (gates.includes("DEMAND")) route = "B";
  else if (gates.includes("CAPITAL")) route = "B";
  else if (overall >= CONFIG.THRESHOLD_DOOR_A && g3 !== 0) route = "A";
  else if (overall >= CONFIG.THRESHOLD_DOOR_A) route = "WAIT";
  else route = "B";
  if (route === "WAIT") gates.push("RESOURCING");

  // Benchmark and market confidence.
  const ci = cat === null ? 6 : cat;
  const benchName = MODEL_NAME[ci];
  const bench = BENCH[MODEL[ci]];
  const confPct = Math.round(0.45 * pct[1] + 0.3 * pct[3] + 0.25 * pct[0]);
  const tone = confPct < 45 ? "low" : confPct < 70 ? "med" : "high";
  const confidence = {
    pct: confPct,
    tone,
    label: tone === "low" ? "Market confidence: low" : tone === "med" ? "Market confidence: moderate" : "Market confidence: high",
    body: CONF_COPY[tone],
  } as const;

  // Constraints: primary, then secondary if it's really weak, then the weakest of the rest.
  const byWeak = NECK_ORDER.slice().sort((a, b) => pct[a] - pct[b]);
  const consIdx = [primary];
  if (secondary !== null && secondary !== primary && pct[secondary] < 60) consIdx.push(secondary);
  byWeak.forEach((i) => {
    if (consIdx.length < 3 && !consIdx.includes(i) && pct[i] < 52) consIdx.push(i);
  });
  const labels = ["Primary", "Secondary", "Tertiary"];
  const constraints = consIdx.slice(0, 3).map((i, n) => ({ label: labels[n], name: pillars[i].name, why: NECK[pillars[i].key], cost: COST[pillars[i].key] }));

  return {
    raw,
    pct,
    rawTotal,
    overall,
    gates,
    primary,
    secondary,
    arch,
    route,
    g1,
    g2,
    g3,
    cat,
    catOther: catOther.trim(),
    exp,
    founders,
    venName: str(answers[indexOf("venName")]) || "Your venture",
    desc: str(answers[indexOf("desc")]),
    built,
    unlock: new Date(Date.now() + CONFIG.RETAKE_LOCKOUT_DAYS * 864e5),
    benchName,
    bench,
    confidence,
    constraints,
  };
}

export type Identity = { name: string; email: string; phone: string; optin: boolean };

export type Response = { section: string; question: string; answer: string };

/** The intake step's label, sitting ahead of the bank's own sections. */
export const INTAKE_SECTION = "Before we start";

/** The four things the opening step asks. They score nothing, but the founder
 *  answered them, so the report has to show them back the same way as the rest. */
export function intakeResponses(id: Identity): Response[] {
  const row = (question: string, answer: string): Response => ({ section: INTAKE_SECTION, question, answer: answer.trim() || "-" });
  return [
    row("Your name", id.name),
    row("Email", id.email),
    row("Contact number", id.phone),
    row("Add me to the Knnekt founder WhatsApp community.", id.optin ? "Yes, add me" : "No thanks"),
  ];
}

/** Every question with the founder's answer in words, the intake step first when
 *  we know who answered. Read-only, for the report and the PDF. */
export function responses(answers: Answers, catOther = "", id?: Identity): Response[] {
  const bank = questions.map((q, i) => {
    const a = answers[i];
    let val: string;
    if (q.kind === "multi") val = Array.isArray(a) && a.length ? a.map((ix) => q.options[ix]?.label ?? "").join(", ") : "none selected";
    else if (q.kind === "text" || q.kind === "short") val = str(a) || "-";
    else if (typeof a === "number" && q.options[a]) {
      val = q.options[a].label;
      if (q.specify !== undefined && a === q.specify && catOther.trim()) val += ` (${catOther.trim()})`;
    } else val = "-";
    return { section: SECTIONS[q.sec], question: q.q, answer: val };
  });
  return id ? [...intakeResponses(id), ...bank] : bank;
}

/** What the founder's pillars shrink to for the bars: `scorePillars` order matches `pillars`. */
export const shortNames = scorePillars;

/** The outbound payload: everything the inbox, the CRM and the call need. Shape is fixed by the build spec. */
export function payload(r: Result, id: Identity, answers: Answers, event: "result" | "report" = "result") {
  const pillarMap: Record<string, { raw: number; pct: number }> = {};
  pillars.forEach((p, i) => {
    pillarMap[p.key] = { raw: r.raw[i], pct: r.pct[i] };
  });
  const pick = <T,>(list: T[], i: number | null) => (i === null ? null : (list[i] ?? null));
  return {
    event,
    instrument_version: CONFIG.INSTRUMENT_VERSION,
    name: id.name,
    email: id.email,
    phone: id.phone || null,
    venture_name: r.venName,
    venture_category: pick(["D2C", "SaaS", "Marketplace", "AI-native", "Services", "Creator", "Other"], r.cat),
    venture_category_other: r.cat === 6 ? r.catOther || null : null,
    venture_description: r.desc || null,
    founder_count: pick(["solo", "two", "three_plus"], r.founders),
    founder_experience: pick(["first", "started_before", "to_revenue", "scaled_exited"], r.exp),
    built_milestones: r.built.map((i) => ["incorporated", "website", "mvp", "pricing", "first_customers", "funding", "none"][i]),
    overall_readiness: r.overall,
    raw_total: r.rawTotal,
    pillars: pillarMap,
    archetype: r.arch,
    primary_bottleneck: pillars[r.primary].key,
    secondary_bottleneck: r.secondary === null ? null : pillars[r.secondary].key,
    gates_fired: r.gates,
    verdict_auto: { STOP: "STOP", B: "DOOR_B", A: "DOOR_A", WAIT: "WAIT" }[r.route],
    g1_hours: pick(["<5", "5-20", "20-40", "40+"], r.g1),
    g2_capital: pick(["neither", "funding_only", "revenue_only", "both"], r.g2),
    g3_band: pick(["below_floor", "60k-1L", "1L-2L", "2L+"], r.g3),
    community_optin: id.optin,
    benchmark: { model: r.benchName, median: r.bench[0], top_third: r.bench[1], scale_ready: r.bench[2] },
    market_confidence: r.confidence.pct,
    responses: responses(answers, r.catOther, id),
    retake_unlock_at: r.route === "STOP" ? r.unlock.toISOString() : null,
    submitted_at: new Date().toISOString(),
  };
}
export type Payload = ReturnType<typeof payload>;
