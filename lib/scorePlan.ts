/**
 * The path forward: what a graded result turns into once we know the business
 * model. Where the venture sits on the model's startup map, what "launch-ready"
 * means for it and how much of that is done, the four-rung ladder from launch
 * to investor-ready, and the month-by-month plan. Pure, like `grade`: the
 * result page and the PDF both read from here, so they can't disagree.
 */
import type { Result } from "./score";

type Model = "d2c" | "saas" | "mkt" | "gen";
type Phase = "launch" | "build" | "scale";
type Built = "inc" | "web" | "mvp" | "price" | "cust" | "fund";

/** Business model per `cat` answer, and what the report calls it. */
const MODEL: Model[] = ["d2c", "saas", "mkt", "saas", "gen", "d2c", "gen"];
const MODEL_NAME = ["D2C", "SaaS", "Marketplace", "AI-native", "Services", "Creator-led", ""];

type Step = [label: string, reached: (p: number[], r: Result) => boolean];
const min = (p: number[]) => Math.min(...p);
const committed = (_: number[], r: Result) => r.g1 !== null && r.g1 > 0;

/** Each model's startup map, in order. A step is reached when its test passes. */
const JOURNEY: Record<Model, Step[]> = {
  d2c: [
    ["Founder Commitment", committed],
    ["Problem Identification", (p) => p[0] >= 40],
    ["Market Selection", (p) => p[0] >= 55],
    ["Customer Validation", (p) => p[1] >= 55],
    ["Positioning", (p) => p[0] >= 65 && p[1] >= 55],
    ["Offer Validation", (p) => p[1] >= 65],
    ["MVP / Product", (p) => p[2] >= 60],
    ["First Revenue", (p) => p[3] >= 45],
    ["Repeatable Sales", (p) => p[3] >= 65],
    ["Operational Systems", (p) => p[4] >= 60],
    ["Scale Ready", (p) => min(p) >= 65],
    ["Investment Ready", (p) => p[5] >= 65],
  ],
  saas: [
    ["Problem Validation", (p) => p[1] >= 45],
    ["ICP", (p) => p[0] >= 55],
    ["MVP Development", (p) => p[2] >= 55],
    ["Beta Users", (p) => p[1] >= 60],
    ["Product Usage", (p) => p[2] >= 65],
    ["Retention", (p) => p[3] >= 55],
    ["GTM", (p) => p[3] >= 60],
    ["PMF", (p) => p[3] >= 70 && p[1] >= 70],
    ["Scale", (p) => min(p) >= 70],
  ],
  mkt: [
    ["Founder Commitment", committed],
    ["Problem Identification", (p) => p[0] >= 45],
    ["Demand-Side Validation", (p) => p[1] >= 50],
    ["Supply-Side Validation", (p) => p[1] >= 62],
    ["Liquidity", (p) => p[3] >= 45],
    ["Transactions", (p) => p[3] >= 55],
    ["Unit Economics", (p) => p[3] >= 65 && p[5] >= 50],
    ["GTM", (p) => p[3] >= 68],
    ["PMF", (p) => min(p) >= 68],
    ["Scale", (p) => min(p) >= 72],
  ],
  gen: [
    ["Founder Commitment", committed],
    ["Problem Clarity", (p) => p[0] >= 45],
    ["Customer Validation", (p) => p[1] >= 55],
    ["Offer / Product", (p) => p[2] >= 55],
    ["First Revenue", (p) => p[3] >= 45],
    ["Repeatable Sales", (p) => p[3] >= 65],
    ["Operational Systems", (p) => p[4] >= 60],
    ["Scale Ready", (p) => min(p) >= 68],
  ],
};

/** Where each model's map turns from Launch to Build, and Build to Scale. */
const PHASE_BOUND: Record<Model, [number, number]> = { d2c: [6, 8], saas: [2, 5], mkt: [4, 6], gen: [3, 5] };

/** What launch-ready means per model: label, the pillar that proves it, and the bar. */
const CHECK: Record<Model, [string, number, number][]> = {
  d2c: [
    ["Define your ICP", 0, 55],
    ["Validate the customer problem", 1, 55],
    ["Validate the product proposition", 1, 65],
    ["Set your pricing", 3, 45],
    ["Lock your positioning", 0, 65],
    ["Set brand direction", 2, 45],
    ["Identify supply / manufacturing", 4, 45],
    ["Decide packaging direction", 2, 50],
    ["Map legal requirements", 5, 40],
    ["Plan the website / store", 2, 55],
    ["Build the GTM plan", 3, 50],
    ["Set the acquisition hypothesis", 3, 55],
    ["Model launch economics", 5, 50],
    ["Create the execution roadmap", 0, 60],
  ],
  saas: [
    ["Define your ICP", 0, 55],
    ["Validate the problem", 1, 50],
    ["Scope the product", 2, 50],
    ["Write the MVP spec", 2, 55],
    ["Build a prototype", 2, 60],
    ["Set tech architecture", 2, 62],
    ["Set pricing", 3, 45],
    ["Lock positioning", 0, 62],
    ["Build the GTM plan", 3, 55],
    ["Map legal", 5, 40],
    ["Set the acquisition hypothesis", 3, 58],
    ["Set up analytics", 4, 50],
    ["Create the execution roadmap", 0, 60],
  ],
  mkt: [
    ["Define ICP — both sides", 0, 55],
    ["Validate the problem — both sides", 1, 55],
    ["Set value proposition per side", 0, 60],
    ["Decide which side to seed first", 0, 50],
    ["Plan supply acquisition", 1, 60],
    ["Set demand acquisition hypothesis", 3, 50],
    ["Model liquidity", 3, 55],
    ["Set pricing / take-rate", 3, 50],
    ["Plan trust & safety", 4, 50],
    ["Scope the transaction flow / MVP", 2, 55],
    ["Model unit economics per txn", 5, 50],
    ["Set up legal + payments", 5, 45],
    ["Lock positioning", 0, 62],
    ["Create the execution roadmap", 0, 60],
  ],
  gen: [
    ["Define your ICP", 0, 55],
    ["Validate the problem", 1, 55],
    ["Set the value proposition", 1, 60],
    ["Scope the product / MVP", 2, 55],
    ["Set pricing", 3, 45],
    ["Lock positioning", 0, 62],
    ["Map legal foundation", 5, 40],
    ["Build the GTM plan", 3, 55],
    ["Set the acquisition hypothesis", 3, 55],
    ["Create the execution roadmap", 0, 60],
  ],
};

/**
 * The ordered work per model. A validated item (`pl`) is done once its pillar
 * clears `thr`; a built item (`fact`) once the founder says it exists. `wk` is
 * rough weeks, which is how the work gets boxed into months.
 */
type Work = { ph: Phase; wk: number; you: string; kn: string } & ({ pl: number; thr: number } | { fact: Built });
const v = (ph: Phase, pl: number, thr: number, wk: number, you: string, kn: string): Work => ({ ph, pl, thr, wk, you, kn });
const b = (ph: Phase, fact: Built, wk: number, you: string, kn: string): Work => ({ ph, fact, wk, you, kn });

const BACKLOG: Record<Model, Work[]> = {
  saas: [
    v("launch", 0, 55, 1, "Nail exactly which firms and roles this is for", "Pressure-test the ICP with you"),
    v("launch", 1, 50, 1, "Confirm the pain is real and urgent with real buyers", "Set up and review your buyer interviews"),
    v("launch", 3, 45, 2, "Test whether people will pay, and how much", "Shape the offer and pricing with you"),
    v("launch", 0, 62, 1, "Sharpen how you describe it so it lands", "Write positioning options with you"),
    v("launch", 3, 55, 2, "Decide how you will reach and win customers", "Design the go-to-market motion"),
    v("launch", 5, 50, 1, "Work out CAC, pricing and payback", "Build the numbers with you"),
    v("launch", 0, 60, 1, "Agree what gets built and when", "Turn it into a sequenced plan"),
    b("build", "mvp", 6, "Build the core product", "Build product, infra and tracking with you"),
    b("build", "web", 2, "Ship the public site or app", "Build and ship it"),
    v("build", 4, 50, 1, "Instrument the product", "Set up tracking and dashboards"),
    v("build", 3, 60, 3, "Ship the launch and get first users", "Run the launch campaign and acquisition"),
    b("build", "cust", 4, "Close your first deals", "Support sales and acquisition"),
    v("scale", 3, 65, 4, "See if they stick and keep paying", "Track retention and fix drop-off"),
    v("scale", 4, 60, 4, "Get out of the day-to-day", "SOPs, hiring and dashboards"),
    v("scale", 5, 65, 4, "Sort documentation and governance", "Build the data room and governance"),
  ],
  d2c: [
    v("launch", 0, 55, 1, "Nail who exactly this is for", "Pressure-test the ICP with you"),
    v("launch", 1, 55, 1, "Talk to real buyers, confirm the pain", "Run and review the interviews"),
    v("launch", 1, 65, 2, "Check people actually want it", "Shape the proposition with you"),
    v("launch", 3, 45, 1, "Decide and test your price", "Model pricing with you"),
    v("launch", 0, 65, 1, "Sharpen the message", "Write positioning with you"),
    v("launch", 2, 45, 1, "Decide the look and feel", "Create brand direction"),
    v("launch", 4, 45, 2, "Find and vet your maker or supplier", "Help source and vet suppliers"),
    v("launch", 5, 40, 1, "Sort incorporation and compliance", "Set up the legal foundation"),
    v("launch", 3, 50, 2, "Plan how you will get customers", "Design the go-to-market"),
    v("launch", 5, 50, 1, "Work out the unit economics", "Build the numbers with you"),
    b("build", "mvp", 4, "Get the product ready", "Build the product with you"),
    b("build", "web", 2, "Get the store live", "Build and ship the store"),
    v("build", 3, 55, 3, "Ship the launch", "Run launch and acquisition"),
    b("build", "cust", 3, "Close first sales", "Support acquisition"),
    v("scale", 3, 65, 4, "Turn one-off sales into a repeatable motion", "Build the sales engine"),
    v("scale", 4, 60, 4, "Systemise operations", "SOPs, hiring and dashboards"),
    v("scale", 5, 65, 3, "Sort documentation and governance", "Data room and governance"),
  ],
  mkt: [
    v("launch", 0, 55, 1, "Define both the supply and demand user", "Pressure-test both ICPs with you"),
    v("launch", 1, 55, 2, "Confirm the pain for buyers and sellers", "Run the two-sided interviews"),
    v("launch", 0, 50, 1, "Pick your cold-start side", "Model the cold-start with you"),
    v("launch", 3, 50, 2, "Plan how you will pull in demand", "Design demand acquisition"),
    v("launch", 3, 50, 1, "Decide how you make money per transaction", "Model take-rate with you"),
    v("launch", 0, 62, 1, "Sharpen the message for both sides", "Write positioning with you"),
    v("launch", 5, 50, 1, "Work out unit economics per transaction", "Build the numbers with you"),
    b("build", "mvp", 6, "Build the core marketplace flow", "Build product and payments with you"),
    b("build", "web", 2, "Ship the live platform", "Build and ship it"),
    v("build", 3, 55, 4, "Get the first real transactions happening", "Seed supply and demand with you"),
    b("build", "cust", 3, "Get money moving through the platform", "Support both sides to transact"),
    v("scale", 5, 50, 4, "Show each transaction makes sense", "Track and fix unit economics"),
    v("scale", 4, 60, 4, "Systemise operations and trust/safety", "SOPs, trust and safety, dashboards"),
    v("scale", 5, 65, 3, "Sort documentation and governance", "Data room and governance"),
  ],
  gen: [
    v("launch", 0, 55, 1, "Nail who exactly this is for", "Pressure-test the ICP with you"),
    v("launch", 1, 55, 1, "Confirm the pain with real customers", "Run and review interviews"),
    v("launch", 3, 45, 2, "Test that people will pay", "Shape offer and pricing with you"),
    v("launch", 0, 62, 1, "Sharpen the message", "Write positioning with you"),
    v("launch", 5, 40, 1, "Sort incorporation and compliance", "Set up the legal foundation"),
    v("launch", 3, 55, 2, "Plan how you will get customers", "Design the go-to-market"),
    v("launch", 5, 50, 1, "Work out the unit economics", "Build the numbers with you"),
    b("build", "mvp", 5, "Get the product ready", "Build the product with you"),
    b("build", "web", 2, "Ship the site or product", "Build and ship it"),
    v("build", 3, 58, 3, "Ship the launch", "Run launch and acquisition"),
    b("build", "cust", 3, "Close first sales", "Support acquisition"),
    v("scale", 3, 65, 4, "Turn wins into a repeatable motion", "Build the engine with you"),
    v("scale", 4, 60, 4, "Systemise operations", "SOPs, hiring and dashboards"),
    v("scale", 5, 65, 3, "Documentation and governance", "Data room and governance"),
  ],
};

const PHASES: Phase[] = ["launch", "build", "scale"];

/** The four rungs, launch to investor-ready. */
export const LADDER = [
  { name: "Launch", sub: "get to market" },
  { name: "Build", sub: "prove traction" },
  { name: "Scale", sub: "grow it" },
  { name: "Investor-ready", sub: "the goal" },
] as const;

/** The two ways to work through the plan. The cohort is the default pick. */
export const PATHS = {
  roadmap: {
    tag: "Roadmap only · solo",
    name: "The Founder’s Roadmap",
    price: "₹10k · one-time",
    one: "Run the full launch → investor-ready path yourself, at your own pace.",
    inc: ["Your roadmap, launch → investor-ready", "Manuals + our playbook", "6 founder calls along the way", "Yours to keep, forever"],
    exc: ["You build it — we don’t execute", "No done-for-you growth / tech / AI / legal", "No team working beside you"],
  },
  cohort: {
    tag: "The cohort · done with you",
    name: "Build90",
    price: "₹60k–1L · / month",
    one: "We work with you and execute alongside you — the fastest path to investor-ready.",
    inc: ["We build it with you", "Growth, tech, AI & legal — done", "Weekly 1:1s + a live dashboard", "Real traction, not just a plan"],
    exc: ["Not self-paced", "Not a template pack", "Monthly, while we work together"],
  },
} as const;
export type PathKey = keyof typeof PATHS;

export type Month = { m: string; from: number; to: number; topics: string[]; kn: string[] };

export type Plan = {
  /** Where the venture sits on its map, with the model: "Problem Identification · Marketplace". */
  stage: string;
  check: { done: number; total: number; items: { label: string; done: boolean }[]; footer: string };
  /** The rung the work starts on, and the rung the founder has already built up to. */
  ladder: { start: number; built: number };
  months: Month[];
  /** "90-day roadmap", or "30-day" when everything left fits in the first month. */
  roadmapLabel: string;
};

export function plan(r: Result): Plan {
  const p = r.pct;
  const ci = r.cat === null ? 6 : r.cat;
  const model = MODEL[ci];
  const has = (i: number) => r.built.includes(i);
  const B: Record<Built, boolean> = { inc: has(0), web: has(1), mvp: has(2), price: has(3), cust: has(4), fund: has(5) };

  // Startup map: score tests first, then moved on by what the founder has built.
  const jr = JOURNEY[model];
  let predOpen = jr.findIndex(([, ok]) => !ok(p, r));
  if (predOpen === -1) predOpen = jr.length;
  let factReached = -1;
  const markKeys = (keys: string[]) =>
    jr.forEach(([label], i) => {
      if (keys.some((k) => label.toLowerCase().includes(k)) && i > factReached) factReached = i;
    });
  if (B.mvp) markKeys(["mvp", "prototype", "development"]);
  if (B.cust) markKeys(["first revenue", "transaction", "product usage", "revenue", "repeatable"]);
  const firstOpen = Math.min(Math.max(predOpen, factReached + 1), jr.length);
  const nowIdx = firstOpen >= jr.length ? jr.length - 1 : firstOpen;
  const nowLabel = jr[nowIdx][0];
  const stage = MODEL_NAME[ci] ? `${nowLabel} · ${MODEL_NAME[ci]}` : nowLabel;

  // Phase: where the map puts them, and where the earliest unfinished work is.
  const [b0, b1] = PHASE_BOUND[model];
  const posPhase = nowIdx < b0 ? 0 : nowIdx < b1 ? 1 : 2;
  const unfinished = BACKLOG[model].filter((it) => ("fact" in it ? !B[it.fact] : p[it.pl] < it.thr));
  const startPhase = unfinished.length ? PHASES.indexOf(unfinished[0].ph) : 2;

  // Launch-ready: score-derived, then ticked by what they've already built.
  const force: string[] = [];
  if (B.inc) force.push("legal", "incorporat", "payments");
  if (B.web) force.push("website", "store");
  if (B.mvp) force.push("mvp", "prototype", "product scope", "transaction flow");
  if (B.price) force.push("pricing", "take-rate");
  if (B.cust) force.push("acquisition", "revenue", "traction");
  const items = CHECK[model].map(([label, pl, thr]) => ({ label, done: p[pl] >= thr || force.some((k) => label.toLowerCase().includes(k)) }));
  const done = items.filter((i) => i.done).length;
  const check = {
    done,
    total: items.length,
    items,
    footer: done >= items.length ? "You’re ready to launch. The call is about actually building and launching." : "Each arrow is something that can stall a launch. On the call we build the plan to close them.",
  };

  // The work, boxed: the first four weeks are month one, the rest months two and three.
  const box: { you: string[]; kn: string[] }[] = [
    { you: [], kn: [] },
    { you: [], kn: [] },
  ];
  let weeks = 0;
  unfinished.forEach((it) => {
    weeks += it.wk || 2;
    const k = weeks > 4 ? 1 : 0;
    box[k].you.push(it.you);
    box[k].kn.push(it.kn);
  });

  // Score checkpoints: estimates, never below where they start.
  const step = (from: number, delta: number, ceil: number) => Math.max(from, Math.min(ceil, from + delta));
  const jL = step(r.overall, 15, 58);
  const jB = step(jL, 20, 80);
  const jInv = step(jB, 8, 90);
  const jMid = Math.round((jL + jB) / 2);
  const pick = (arr: string[], n: number, fallback: string[]) => (arr.length ? arr.slice(0, n) : fallback.slice(0, n));
  const half = Math.ceil(box[1].you.length / 2);
  const months: Month[] = [
    {
      m: "Month 1",
      from: r.overall,
      to: jL,
      topics: pick(box[0].you, 4, ["Lock who it’s for and the offer", "Test pricing and messaging", "Build a go-to-market plan you can run"]),
      kn: pick(box[0].kn, 3, ["Shape GTM + pricing with you", "Sequence the plan and set targets"]),
    },
    {
      m: "Month 2",
      from: jL,
      to: jMid,
      topics: pick(box[1].you.slice(0, half), 4, ["Launch and get the product to market", "Bring in your first paying customers", "Stand up the numbers that matter"]),
      kn: pick(box[1].kn.slice(0, half), 3, ["Execute growth, tech, AI & legal with you", "Set up your live dashboard + tracking"]),
    },
    {
      m: "Month 3",
      from: jMid,
      to: jInv,
      topics: pick(box[1].you.slice(half), 4, ["Make sales repeatable without you", "Tighten CAC, retention and payback", "Get the investor story and docs ready"]),
      kn: pick(box[1].kn.slice(half), 3, ["Drive growth experiments with you", "Prep and pressure-test the raise"]),
    },
  ];

  const roadmapLabel = startPhase === 2 && !unfinished.length ? "scale plan" : `${box[1].you.length ? 90 : 30}-day roadmap`;

  return { stage, check, ladder: { start: startPhase, built: posPhase }, months, roadmapLabel };
}

/** Copy the report sections share, on screen and on paper. */
export const planCopy = {
  constraints: { h: "Your top 3 constraints", d: "The few things most in your way — and what each is quietly costing you." },
  pillars: { h: "Your six pillars", d: "Each scored 0–100. Hollow bars are where the constraints come from." },
  stand: { h: "Where you stand", d: (bench: string) => `Where ${bench} founders sit at your stage, and where you land.` },
  left: { h: "Where you are — and what’s left", d: "Ticked is done (including what you’ve already built). Arrows are what’s left before you can launch." },
  ladder: { h: "Scale — launch to investor-ready", d: "The four stages, and where your venture sits today." },
  months: {
    h: "Your next 3 months",
    d: "What gets done each month, what we do alongside you, and where your score should land.",
    note: "One path, launch → investor-ready. Checkpoints are estimates from founders on a similar path — yours moves with the work you put in.",
  },
  paths: { h: "Two ways to get there", d: "Join the cohort and we build it with you — or take the roadmap and run it yourself. Same destination, your call." },
  lrDone: (n: number) => (n ? `You’ve already got ${n} of these sorted. Ticked means done. The arrows are what’s still left before you can launch.` : "Nothing locked in yet. Each arrow below is a step towards being ready to launch."),
};
