/**
 * The Startup Operating Score: twenty-one questions — three per pillar, then
 * three gates that can override the number — and the readout the answers
 * produce. Everything the quiz page shows comes from here, so the copy stays
 * data and the arithmetic stays in one place.
 */
import { scorePillars } from "./data";

export type Option = { label: string; points: number };
export type Gate = "hours" | "validation" | "pay";
export type Question =
  | { kind: "pillar"; pillar: number; text: string; options: Option[] }
  | { kind: "gate"; gate: Gate; text: string; options: { label: string; value: string }[] };

/** Full pillar names, in `scorePillars` order. */
export const pillarNames = ["Clarity", "Customer Evidence", "Product", "Commercial Traction", "Operational Readiness", "Investor Readiness"];

/** Each pillar asks three questions worth 7, 5 and 5 — seventeen a pillar. */
export const PILLAR_MAX = 17;

const pillar = (name: string, text: string, options: [string, number][]): Question => ({
  kind: "pillar",
  pillar: scorePillars.indexOf(name),
  text,
  options: options.map(([label, points]) => ({ label, points })),
});

const gate = (g: Gate, text: string, options: [string, string][]): Question => ({
  kind: "gate",
  gate: g,
  text,
  options: options.map(([label, value]) => ({ label, value })),
});

export const questions: Question[] = [
  // Evidence first: it's the question the sample card opens with, and the one founders most want to skip.
  pillar("Evidence", "How do you know customers actually want this?", [
    ["They’ve paid or pre-ordered", 7],
    ["A few said they would", 4],
    ["I’m confident they will", 2],
    ["I haven’t really asked yet", 1],
  ]),
  pillar("Evidence", "How many buyers outside friends and family have you spoken to?", [
    ["0–5", 1],
    ["6–25", 3],
    ["25+, or a paid pilot", 5],
  ]),
  pillar("Evidence", "Can you name why someone said no?", [
    ["No one has really said no yet", 1],
    ["Vaguely", 3],
    ["Yes — in their exact words", 5],
  ]),

  pillar("Clarity", "Who is the specific person who buys this?", [
    ["A big market — “anyone who…”", 1],
    ["A segment or persona", 4],
    ["A specific, named person and their pain", 7],
  ]),
  pillar("Clarity", "What does it cost that person if you don’t exist?", [
    ["I couldn’t say", 1],
    ["Roughly", 3],
    ["Precisely — in their words", 5],
  ]),
  pillar("Clarity", "Can you say what you’re not building this quarter?", [
    ["Everything’s on the list", 1],
    ["A rough sense", 3],
    ["Yes, and it’s written down", 5],
  ]),

  pillar("Product", "Can someone use it right now?", [
    ["Nothing shipped", 1],
    ["Something exists, but it’s rough", 4],
    ["Live, and people are using it", 7],
  ]),
  pillar("Product", "How long has launch been “two weeks away”?", [
    ["Months — and it’s fear, not tech", 1],
    ["A while, mostly technical reasons", 3],
    ["It’s already out", 5],
  ]),
  pillar("Product", "When something breaks, how do you find out?", [
    ["A customer tells us", 1],
    ["We notice, eventually", 3],
    ["We see it before they do", 5],
  ]),

  pillar("Traction", "The one number that tells you this is working?", [
    ["There isn’t one", 1],
    ["A vanity metric — followers, signups", 3],
    ["A real number that matters", 7],
  ]),
  pillar("Traction", "Did it move in the last 30 days?", [
    ["No, or I can’t say", 1],
    ["Flat", 3],
    ["It moved", 5],
  ]),
  pillar("Traction", "Where did your last ten customers come from?", [
    ["I couldn’t tell you", 1],
    ["Word of mouth, mostly", 3],
    ["A channel we can repeat", 5],
  ]),

  pillar("Ops", "If you took two weeks off, what happens?", [
    ["It stops", 1],
    ["It limps", 4],
    ["It runs", 7],
  ]),
  pillar("Ops", "Is there a written process for anything you do weekly?", [
    ["Nothing written", 1],
    ["Some of it", 3],
    ["Most of it", 5],
  ]),
  pillar("Ops", "Do you know your monthly burn to the rupee?", [
    ["Not really", 1],
    ["Roughly", 3],
    ["To the rupee — and the runway", 5],
  ]),

  pillar("Invest", "If an investor asked for your deck right now?", [
    ["Nothing exists", 1],
    ["A rough deck; the metrics don’t hold", 4],
    ["Deck and metrics, ready to send", 7],
  ]),
  pillar("Invest", "Cap table and incorporation?", [
    ["Haven’t thought about it", 1],
    ["Messy", 3],
    ["Clean, diligence-ready", 5],
  ]),
  pillar("Invest", "Can you say how much you need, and what it buys?", [
    ["No idea", 1],
    ["A number, not a plan", 3],
    ["A number and the milestones it buys", 5],
  ]),

  gate("hours", "How many hours a week can you genuinely put in?", [
    ["Under 5", "<5"],
    ["5–20", "5-20"],
    ["20–40", "20-40"],
    ["40+", "40+"],
  ]),
  gate("validation", "Paying customers, or funding in the bank?", [
    ["Neither", "neither"],
    ["Funding in the bank", "funding"],
    ["Revenue", "revenue"],
    ["Both", "both"],
  ]),
  gate("pay", "If you’re one of the 15, could you fund a ₹3,00,000 quarter?", [
    ["No", "no"],
    ["It’d stretch", "stretch"],
    ["Yes", "yes"],
  ]),
];

/** One line per pillar, for when it lands in the founder's top three constraints. */
const constraintWhy = [
  "You can’t name the person, so nothing downstream can aim.",
  "You’re building before demand is proven.",
  "Nobody can use it yet, so nobody can tell you the truth.",
  "Revenue isn’t repeatable yet.",
  "Too much still depends on you.",
  "A raise would stall on the first diligence question.",
];

/** The first move the report hands back, per pillar. */
const firstMove = [
  "Write the one-sentence buyer, and their pain, in their words",
  "Run 10 problem interviews",
  "Ship the rough version to five real users",
  "Pick the one number, and report it weekly",
  "Get delivery out of your hands",
  "Clean the cap table before anyone asks for it",
];

/** Named for the strongest pillar: it's what the founder leads with, for better or worse. */
const archetypes = ["The Visionary", "The Listener", "The Builder", "The Seller", "The Operator", "The Raiser"];

export type Verdict = "BUILD" | "ROADMAP" | "WAIT" | "STOP";

export const verdicts: Record<Verdict, { tag: string; line: string; sub: string; cta: string; href: string }> = {
  BUILD: {
    tag: "The 90-Day Cohort",
    line: "You know what you’re building. You’re short of hands.",
    sub: "This is an execution problem, not a strategy one. On the call we’ll tell you which pillars you actually need — and which one we’d refuse to sell you today.",
    cta: "Apply for the cohort →",
    href: "/en#contact",
  },
  ROADMAP: {
    tag: "The Founder’s Roadmap",
    line: "You don’t have an execution problem. You have a direction problem.",
    sub: "You don’t need us to build things — you need the plan, and someone who won’t let you hide from it. The Roadmap is the honest sell here, and it counts against a cohort seat if you come back ready.",
    cta: "Get your roadmap →",
    href: "/en#contact",
  },
  WAIT: {
    tag: "Ready, not resourced",
    line: "You’re ready. You’re just not resourced yet.",
    sub: "We could have offered you the Roadmap here. We didn’t — you don’t have the problem it solves. Take the free call anyway, get the plan, and come back when the quarter stops being frightening.",
    cta: "Book the call anyway →",
    href: "/en#contact",
  },
  STOP: {
    tag: "Not yet — and that’s a real answer",
    line: "There isn’t enough here yet for us to help you.",
    sub: "Taking your money right now would be dishonest. Go have twenty conversations with people who might actually pay, write down every reason they said no, then retake the score. If the number moves, come back.",
    cta: "Read what the score measures →",
    href: "/en/insights/what-a-startup-operating-score-actually-measures",
  },
};

export type Answers = (number | null)[];

export type Readout = {
  /** Per pillar, 0–100. */
  pillars: number[];
  /** Overall, 0–100. */
  total: number;
  answered: number;
};

/** What the answers so far add up to. Unanswered questions count as nothing. */
export function readout(answers: Answers): Readout {
  const raw = scorePillars.map(() => 0);
  let answered = 0;
  questions.forEach((q, i) => {
    const a = answers[i];
    if (a === null || a === undefined) return;
    answered += 1;
    if (q.kind === "pillar") raw[q.pillar] += q.options[a].points;
  });
  const pillars = raw.map((v) => Math.round((v / PILLAR_MAX) * 100));
  const total = Math.round((raw.reduce((a, b) => a + b, 0) / (PILLAR_MAX * scorePillars.length)) * 100);
  return { pillars, total, answered };
}

export type Result = Readout & {
  verdict: Verdict;
  /** Why a gate overrode the number, if one did. */
  gateNote: string | null;
  archetype: string;
  /** The three weakest pillars, as indexes into `scorePillars`. */
  weak: number[];
  constraints: [string, string][];
  roadmap: string[];
  /** Where the founder sits on the climb, in percent. */
  climb: number;
};

/** The full report, once all twenty-one are answered. */
export function grade(answers: Answers): Result {
  const r = readout(answers);
  const gates: Partial<Record<Gate, string>> = {};
  questions.forEach((q, i) => {
    const a = answers[i];
    if (q.kind === "gate" && a !== null && a !== undefined) gates[q.gate] = q.options[a].value;
  });

  const evidence = r.pillars[scorePillars.indexOf("Evidence")];
  const traction = r.pillars[scorePillars.indexOf("Traction")];
  const canPay = gates.pay !== "no";

  let verdict: Verdict;
  let gateNote: string | null = null;
  if (gates.hours === "<5" || r.total < 30) {
    verdict = "STOP";
    gateNote = gates.hours === "<5" ? "Commitment gate fired — under 5 hours a week" : "Score under 30";
  } else if (gates.validation === "neither") {
    verdict = "ROADMAP";
    gateNote = "Validation gate fired — nobody has voted with money yet";
  } else if (evidence <= 35 && traction <= 35) {
    verdict = "ROADMAP";
    gateNote = "Demand gate fired — polished, and wanted by nobody yet";
  } else if (r.total >= 65 && canPay) {
    verdict = "BUILD";
  } else if (r.total >= 65) {
    verdict = "WAIT";
  } else {
    verdict = "ROADMAP";
  }

  const order = r.pillars.map((v, i) => [v, i] as const).sort((a, b) => a[0] - b[0]);
  const weakest = order.slice(0, 3).map(([, i]) => i);
  const strongest = order[order.length - 1][1];

  return {
    ...r,
    verdict,
    gateNote,
    archetype: archetypes[strongest],
    weak: weakest,
    constraints: weakest.map((i) => [pillarNames[i], constraintWhy[i]]),
    roadmap: weakest.map((i) => firstMove[i]),
    climb: r.total,
  };
}
