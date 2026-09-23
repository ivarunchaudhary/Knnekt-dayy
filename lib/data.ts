const cdn = "/sanity";
/** The clients' own assets — a mark, a frame from their shoot — rather than something bought in. */
const own = "/cases";

/**
 * The ticker band under the intro headline: the studio in seven figures.
 * `[figure, label]`, the figure carries the weight, the label gives it meaning.
 */
export const proofPoints: [string, string][] = [
  ["300+", "startups behind the playbook"],
  ["15", "founders a cohort, no more"],
  ["90", "days, kickoff to pitch day"],
  ["100", "first customers, in market"],
  ["6", "pillars in one honest score"],
  ["4", "functions under one roof"],
  ["Any", "stage, any industry"],
];

export type WorkItem = {
  slug: string;
  client: string;
  title: string;
  /** What they build and who for */
  sector: string;
  /** Which engagement they took */
  tier: string;
  blurb: string;
  quote: string;
  attribution: string;
  /** What we told them not to buy */
  refused: string;
  timeline: [string, string][];
  delivered: string[];
  results: [string, string][];
  wide?: boolean;
  vimeo?: string;
  /** width / height of the clip */
  vimeoAspect?: number;
  alt?: string;
  mobile?: { src: string; w: number; h: number };
  desktop?: { src: string; w: number; h: number };
};

/**
 * Representative engagements. Where the client has given us their own mark or
 * photography, the card carries it; the rest stand in until those founders
 * consent to their own photos, quotes and scorecards.
 */
export const work: WorkItem[] = [
  {
    slug: "i-say-move",
    client: "I Say Move",
    title: "Clarity, then launch",
    sector: "Athleisure · Gen Z",
    tier: "Launch 30",
    blurb:
      "Twelve weeks of weekly commitments turned a fashion-and-pop athleisure idea into a shipped, in-market product.",
    quote:
      "Knnekt gave me a clear vision to launch. Within two months I shipped my product and gained the traction that helped me understand my customers.",
    attribution: "Founder · Athleisure · In market",
    refused:
      "They wanted a big paid launch on day one. We refused. Proving the drop with organic demand first meant they didn’t burn cash on an audience they hadn’t earned.",
    timeline: [
      ["Week 1–3", "Diagnosis: positioning before product."],
      ["Week 4–8", "Product line built, storefront shipped."],
      ["Week 9–12", "First drop live, demand tested with real buyers."],
    ],
    delivered: ["Brand & positioning system", "Shopify storefront", "First product drop", "Demand-gen playbook"],
    results: [
      ["Live", "product in market"],
      ["71", "Startup Operating Score"],
      ["+26", "operating points"],
    ],
    wide: true,
    alt: "Coach reviewing data on a laptop while athletes train on an indoor track",
    mobile: { src: `${cdn}/630edbc02eae351ece1f45cce3e1ede17718cca4-1200x1249.webp`, w: 2500, h: 2600 },
    desktop: { src: `${cdn}/3ed3108d64274ac97731fb2c2eaf99dc6653bb67-1200x1560.webp`, w: 2500, h: 3250 },
  },
  {
    slug: "klypp",
    client: "Klypp",
    title: "The story before the raise",
    sector: "AI · equity-firm SaaS",
    tier: "Build & Scale",
    blurb:
      "An AI data and client-management platform for equity firms: built, piloted, and repositioned for the round.",
    quote: "The platform was never the question. Knnekt made us answer who it’s really for.",
    attribution: "Founder · Equity-firm SaaS · In market",
    refused:
      "They wanted a paid-acquisition push at pilot stage. We refused. Spending to grow before positioning is proven just buys the wrong customers faster.",
    timeline: [
      ["Week 1–3", "Diagnosis: positioning, not product."],
      ["Week 4–8", "AI data pipeline and client management hardened."],
      ["Week 6–12", "Two equity-firm pilots onboarded."],
      ["Month 4", "Positioning and go-to-market narrative rebuilt."],
    ],
    delivered: [
      "AI data & client-management platform",
      "Two pilot deployments",
      "Positioning & messaging system",
      "Diligence-ready metrics deck",
    ],
    results: [
      ["2 pilots", "live with equity firms"],
      ["74", "Startup Operating Score"],
      ["+13", "operating points"],
    ],
    alt: "Person holding a tablet displaying an AI assistant interface",
    mobile: { src: `${cdn}/39491c8a82d60f80a16f404d543c829d3123d7d7-1200x1249.webp`, w: 2500, h: 2600 },
    desktop: { src: `${cdn}/2119998eb4a41a635571378dbf2c62f5c91e5de0-1200x1560.webp`, w: 2500, h: 3250 },
  },
  {
    slug: "qolorr",
    client: "Qolorr",
    title: "Luxury, made ownable",
    sector: "Luxury content-commerce",
    tier: "Build & Scale",
    blurb:
      "Luxury content-commerce with ownership tags and resale: scope cut to the one thing that proves the model.",
    quote: "They cut half my roadmap and I launched twice as fast. The no’s were the value.",
    attribution: "Founder · Luxury commerce · Launched",
    refused:
      "They wanted every feature in v1. We refused. We shipped the one that proves the model and parked the rest until it earned its place.",
    timeline: [
      ["Week 1–3", "Diagnosis: scope, not features."],
      ["Week 4–8", "Ownership-tag platform built."],
      ["Week 9–12", "Creator storefronts live."],
    ],
    delivered: ["Ownership-tag platform", "Creator storefront system", "Brand & positioning", "Launch campaign"],
    results: [
      ["Launched", "storefronts live"],
      ["79", "Startup Operating Score"],
      ["+27", "operating points"],
    ],
    alt: "The Qolorr wordmark, white on black",
    mobile: { src: `${own}/qolorr-mobile.webp`, w: 2500, h: 2600 },
    desktop: { src: `${own}/qolorr-desktop.webp`, w: 2500, h: 3250 },
  },
  {
    slug: "khoj",
    client: "Khoj",
    title: "A plan they could run themselves",
    sector: "D2C · beverage",
    tier: "The Founder’s Roadmap",
    blurb:
      "Early-stage D2C beverage. The honest sell was a plan, not execution, so a ₹10k roadmap and six calls is what we gave them.",
    quote: "They talked me out of spending ₹50k I didn’t need to. I ran the roadmap myself and it worked.",
    attribution: "Founder · D2C beverage · Roadmap",
    refused:
      "They came for a full build. We refused. A ₹10k roadmap was the honest sell, and we’d rather they came back ready than pay for execution they couldn’t use.",
    timeline: [
      ["Week 1–3", "Diagnosis: not ready to build."],
      ["Roadmap", "90-day plan handed over."],
      ["Calls", "Six 1:1s across the quarter."],
    ],
    delivered: ["Personalised 90-day roadmap", "Operating manuals & library", "Six 1:1 guidance calls", "Founder community"],
    results: [
      ["Self-run", "they executed it"],
      ["55", "Startup Operating Score"],
      ["+17", "operating points"],
    ],
    wide: true,
    alt: "A woman in Punjabi jewellery drinking from a brass glass, in front of a shelf of spice jars",
    mobile: { src: `${own}/khoj-mobile.webp`, w: 2500, h: 2600 },
    desktop: { src: `${own}/khoj-desktop.webp`, w: 2500, h: 1625 },
  },
];

/** The four pillars, run as one plan under one roof. */
export const services = [
  {
    id: "growth",
    title: "Growth & Marketing",
    text: "How you’re found, understood and remembered, turning attention into customers who come back and bring others. Positioning first, then demand: we don’t spend to grow before the story is proven.",
    capabilities: ["Positioning", "Branding", "Marketing", "Content creation", "Demand generation", "Retention"],
    bg: `${cdn}/7fa74a1ccdcb8015276c6112898c48b4bdcb3da7-1920x1112.webp`,
  },
  {
    id: "technology",
    title: "Technology",
    text: "The product and the systems behind it, built properly so they hold weight as you grow, without a rebuild later. Website and MVP inside the quarter, with the ops stack that keeps them running.",
    capabilities: ["Website development", "App development", "Ops stack", "Integrations", "Analytics setup", "Automation"],
    bg: `${cdn}/5972f7b6bc093c048edc54c40149f78a8af834ae-1920x1112.webp`,
  },
  {
    id: "ai",
    title: "AI Enablement",
    text: "AI put to work across the business, so the repeatable runs itself and your team spends its time on the rare. Inside the product where it earns its place, and behind it where it saves you hires.",
    capabilities: ["Workflow automation", "Sales & support AI", "Custom AI tools", "Data setup", "Prompt systems", "Agentic workflows"],
    bg: `${cdn}/5c0766161f4835c1f8d9489e22128bfc71aad1ff-1920x1112.webp`,
  },
  {
    id: "legal",
    title: "Legal & Compliance",
    text: "The paperwork that decides whether a raise goes smoothly, handled early, before it gets expensive to fix. Incorporation, cap table and contracts done once, properly, and a data room that holds up.",
    capabilities: ["Incorporation", "Cap table", "Contracts", "IP assignment", "Compliance", "Data room"],
    bg: `${cdn}/84a716626708bc871945e911c39039eb81ec16c1-1920x1112.webp`,
  },
];

/** What an agency does, and what we do instead. */
export const principles = [
  {
    a: "An agency sells you whatever you ask for.",
    b: "We say no when you’re not ready.",
    alt: "Two people are standing indoors near large windows, one wearing a brown jacket and the other in dark clothing, engaged in conversation",
    src: `${cdn}/99281afbb83464441f7ec29f3f025202d7000443-1200x849.webp`,
  },
  {
    a: "An agency bills the hours and ships a deck.",
    b: "We build it with you.",
    alt: "Person sitting at a workbench with a 3D printer and tools organized on a pegboard wall",
    src: `${cdn}/146fe6a793fd3671a74e623447f36b2cc5abf929-1200x849.webp`,
  },
  {
    a: "Four vendors who never meet.",
    b: "One studio, four functions.",
    alt: "Three people collaborating in front of a whiteboard, with one person seated at a table with a laptop",
    src: `${cdn}/26923509ab3eb9c18db9333b483f2198c570ef6a-1200x849.webp`,
  },
  {
    a: "An agency hands you a login and leaves.",
    b: "We own the outcome.",
    alt: "Two people having a discussion in a meeting room with a laptop and a large screen displaying a diagram",
    src: `${cdn}/954a137137d858217286a7dd6b315e23ad4121d6-1200x849.webp`,
  },
  {
    a: "Fluff metrics on a dashboard.",
    b: "Revenue, retention, runway.",
    alt: "Person working at a desk with a laptop, with several awards and certificates displayed on a shelf in the background",
    src: `${cdn}/9c6ad38a21c66d2f9c66155cc8ba04f7f11fbba6-1200x849.webp`,
  },
  {
    a: "A hidden, moving invoice.",
    b: "Fixed price, flexible scope.",
    alt: "Three people standing and arranging sticky notes on a whiteboard during a team workshop",
    src: `${cdn}/185dc8311ae3dd2ab6f7344a60e642a552b94a91-1200x849.webp`,
  },
];

/** The cohort — fifteen founders a quarter. */
export const team = [
  { alt: "Person with long blonde hair wearing a white top and hoop earrings, standing outdoors in front of a window", src: `${cdn}/dcb621c0f613969c6d206a3ab4857a5aba9d02b0-400x400.webp` },
  { alt: "Person with short brown hair and a beard, wearing a grey sweatshirt indoors", src: `${cdn}/811759779651a949df88ca8ce197173b0d082693-400x400.webp` },
  { alt: "Person with dark curly hair wearing a brown jacket and hoop earrings, standing indoors", src: `${cdn}/bd9e5e51e3b9e7739cd84135f09c6c1f96c1b39e-400x400.webp` },
  { alt: "Person with short curly hair and beard, wearing a black shirt, standing in front of a wooden staircase", src: `${cdn}/fe5ae30ece1efe816083177137ee19377ac0a83f-400x400.webp` },
  { alt: "Person with long wavy brown hair, wearing a black turtleneck, standing in front of shelves", src: `${cdn}/a5591c65324bcacfd21cabe16ed535bd7853edd5-400x400.webp` },
  { alt: "Person with short dark hair and glasses, wearing a white shirt, standing in front of light curtains", src: `${cdn}/a029c831eb3986aec632ec8e71a00b096cd0369c-400x400.webp` },
  { alt: "Person with long dark hair with green highlights, wearing glasses and a grey sweater, indoors", src: `${cdn}/f501cb2a0b61b54fc7a0702eb87c8df8e2198827-400x400.webp` },
  { alt: "Person with short light brown hair, wearing a grey sweatshirt, standing outdoors", src: `${cdn}/fd8f27d99b3ce35f5d1363da538df84586e72ad2-400x400.webp` },
  { alt: "Person with shoulder-length blonde hair, wearing a black top, standing in front of a wooden staircase", src: `${cdn}/8fb0c09f3bc8e17a7b5eecf844bec1d653e3d63b-400x400.webp` },
  { alt: "Person with short light brown hair, wearing a black shirt, standing indoors near a window", src: `${cdn}/ac769d3350cf47c71a58bae3ae7b59bcc4d5a1ea-400x400.webp` },
  { alt: "Person with short dark hair and a beard, wearing a black jacket and grey t-shirt, indoors with warm lighting", src: `${cdn}/bf3058c905b49cf3dc71dc55257ec02fa40f5afb-400x400.webp` },
  { alt: "Person with dark hair tied back, wearing a beige turtleneck sweater and hoop earrings, standing indoors", src: `${cdn}/cfc12095e86efb371285ab2914add93ecdc9bc94-400x400.webp` },
];

/** The 90 days, stage by stage — ticker in the facts list. */
export const journey = [
  "Day 1–10 · Plan it together",
  "Day 11–90 · Build & launch",
  "Day 90 · First 100 customers",
  "Day 90 · Fund-ready",
  "Day 90 · Pitch day",
];

/** The four movements of the quarter, walked through by the scroll-driven spine. */
export type JourneyPhase = {
  days: string;
  tag: string;
  title: string;
  body: string;
  /**
   * The slice of the quarter this movement owns, so the strip and the rows agree on
   * which one is live. The labels overlap on purpose—"Days 11–90" and "By day 90"
   * are narrative, not sequential—so the boundaries are stated rather than parsed.
   */
  from: number;
  to: number;
  bars: [string, string][];
};

export const journeyPhases: JourneyPhase[] = [
  {
    days: "Days 1\u201310",
    tag: "Plan \u00b7 ten live classes",
    from: 1,
    to: 10,
    title: "We plan it with you.",
    body: "Ten live classes. We read your real constraints, then map all 90 days to the goal\u2014together.",
    bars: [
      ["Read constraints", "Where you actually are."],
      ["Map 90 days", "Week by week, one plan."],
      ["Set the goal", "The number we build around."],
    ],
  },
  {
    days: "Days 11\u201390",
    tag: "Build & launch",
    from: 11,
    to: 82,
    title: "We build. You steer.",
    body: "The full studio ships across product, growth, AI, legal and compliance while you make the calls.",
    bars: [
      ["Website & MVP", "Real product\u2014with AI inside."],
      ["Growth engine", "Positioning to demand."],
      ["Legal & compliance", "Structure, done right."],
    ],
  },
  {
    days: "By day 90",
    tag: "The outcome",
    from: 83,
    to: 89,
    title: "100 customers. Fund-ready. Real traction.",
    body: "At day 90 you have proof\u2014not a pretty deck. Customers using what we built.",
    bars: [
      ["100 customers", "In market, paying attention."],
      ["Fund-ready", "The metrics and the narrative."],
      ["Real traction", "Momentum you can point to."],
    ],
  },
  {
    days: "Day 90",
    tag: "Pitch day",
    from: 90,
    to: 90,
    title: "Then you pitch it live.",
    body: "The cohort\u2019s demo day\u2014you present 90 days of proof to a room of investors and operators.",
    bars: [
      ["Present live", "You take the stage."],
      ["The room", "Investors and operators."],
      ["Warm intros", "The conversations that follow."],
    ],
  },
];

/** Pillars light up on the spine as the quarter reaches each one. */
export const journeyPillars: [string, number][] = [
  ["Growth", 22],
  ["Technology", 29],
  ["AI", 36],
  ["Legal", 43],
];

export const studioVimeo = "1184110386";
export const studioVimeoAspect = 1280 / 536;
export const scoreVimeo = "1184110361";
export const scoreVimeoAspect = 1280 / 536;

/* ------------------------------------------------------------------------- *
 * Faculty — who actually takes the classes                                   *
 * ------------------------------------------------------------------------- */

export type FacultyMember = {
  /** Real name, once the person is signed. Absent → the card shows the seat and a "named at kickoff" chip. */
  name?: string;
  /** The seat: what they are to the cohort, not where they work. */
  seat: string;
  /** The class they take. */
  teaches: string;
  /** One line on why they’re in the room. */
  note: string;
  src: string;
  alt: string;
};

export type FacultyGroup = {
  id: string;
  kicker: string;
  title: string;
  text: string;
  people: FacultyMember[];
};

/**
 * Two rooms: the investors who take the weekly masterclasses, and the studio
 * team that builds alongside the cohort for the whole quarter.
 *
 * Names and photos are stand-ins until each person is signed — drop a `name`
 * onto a member and the card swaps the seat for the name and loses the chip.
 */
export const faculty: FacultyGroup[] = [
  {
    id: "investors",
    kicker: "Weekly masterclasses",
    title: "The people who write the cheques.",
    text: "One working investor, live, every week of the quarter. Not a panel and not a fireside: a class, with your numbers on the table and the questions you’ll get asked in a real room.",
    people: [
      {
        seat: "Seed investor · Consumer",
        teaches: "What a seed round actually buys",
        note: "Why most decks answer a question nobody asked.",
        src: `${cdn}/dcb621c0f613969c6d206a3ab4857a5aba9d02b0-400x400.webp`,
        alt: "Person with long blonde hair wearing a white top and hoop earrings, standing outdoors in front of a window",
      },
      {
        seat: "Early-stage VC · B2B SaaS",
        teaches: "The metrics that survive diligence",
        note: "Which numbers hold up under a data room, and which quietly don’t.",
        src: `${cdn}/811759779651a949df88ca8ce197173b0d082693-400x400.webp`,
        alt: "Person with short brown hair and a beard, wearing a grey sweatshirt indoors",
      },
      {
        seat: "Angel · 30+ cheques",
        teaches: "Writing the first cheque",
        note: "What makes an angel say yes in the first ten minutes.",
        src: `${cdn}/bd9e5e51e3b9e7739cd84135f09c6c1f96c1b39e-400x400.webp`,
        alt: "Person with dark curly hair wearing a brown jacket and hoop earrings, standing indoors",
      },
      {
        seat: "Growth-stage investor",
        teaches: "From traction to a Series A story",
        note: "The narrative that turns 100 customers into a round.",
        src: `${cdn}/fe5ae30ece1efe816083177137ee19377ac0a83f-400x400.webp`,
        alt: "Person with short curly hair and beard, wearing a black shirt, standing in front of a wooden staircase",
      },
      {
        seat: "Family office · India",
        teaches: "Capital that isn’t venture",
        note: "Revenue-based, strategic and patient money, and when it beats a VC.",
        src: `${cdn}/a5591c65324bcacfd21cabe16ed535bd7853edd5-400x400.webp`,
        alt: "Person with long wavy brown hair, wearing a black turtleneck, standing in front of shelves",
      },
      {
        seat: "Founder-turned-investor",
        teaches: "Both sides of the table",
        note: "What they wish someone had told them before their own raise.",
        src: `${cdn}/a029c831eb3986aec632ec8e71a00b096cd0369c-400x400.webp`,
        alt: "Person with short dark hair and glasses, wearing a white shirt, standing in front of light curtains",
      },
    ],
  },
  {
    id: "studio",
    kicker: "The execution team",
    title: "The people who build it with you.",
    text: "The same four functions the studio runs, as named people you work with every week, not a resourcing pool. They take the ten planning classes, then stay for the eighty days of building.",
    people: [
      {
        seat: "Growth lead",
        teaches: "Positioning before spend",
        note: "Owns the story, the demand engine and the retention loop.",
        src: `${cdn}/f501cb2a0b61b54fc7a0702eb87c8df8e2198827-400x400.webp`,
        alt: "Person with long dark hair with green highlights, wearing glasses and a grey sweater, indoors",
      },
      {
        seat: "Technology lead",
        teaches: "Shipping an MVP you don’t rebuild",
        note: "Website, product and the ops stack behind them, inside the quarter.",
        src: `${cdn}/fd8f27d99b3ce35f5d1363da538df84586e72ad2-400x400.webp`,
        alt: "Person with short light brown hair, wearing a grey sweatshirt, standing outdoors",
      },
      {
        seat: "AI lead",
        teaches: "Where AI earns its place",
        note: "Inside the product where it’s the point, behind it where it saves a hire.",
        src: `${cdn}/8fb0c09f3bc8e17a7b5eecf844bec1d653e3d63b-400x400.webp`,
        alt: "Person with shoulder-length blonde hair, wearing a black top, standing in front of a wooden staircase",
      },
      {
        seat: "Legal & compliance counsel",
        teaches: "Cap table, contracts, clean data room",
        note: "The paperwork that decides whether a raise goes smoothly.",
        src: `${cdn}/ac769d3350cf47c71a58bae3ae7b59bcc4d5a1ea-400x400.webp`,
        alt: "Person with short light brown hair, wearing a black shirt, standing indoors near a window",
      },
      {
        seat: "Design lead",
        teaches: "Brand that survives contact with customers",
        note: "Identity, product surface and the drop that has to convert.",
        src: `${cdn}/bf3058c905b49cf3dc71dc55257ec02fa40f5afb-400x400.webp`,
        alt: "Person with short dark hair and a beard, wearing a black jacket and grey t-shirt, indoors with warm lighting",
      },
      {
        seat: "Studio partner",
        teaches: "The weekly 1:1",
        note: "One honest conversation a week about the calls only you can make.",
        src: `${cdn}/cfc12095e86efb371285ab2914add93ecdc9bc94-400x400.webp`,
        alt: "Person with dark hair tied back, wearing a beige turtleneck sweater and hoop earrings, standing indoors",
      },
    ],
  },
];

/* ------------------------------------------------------------------------- *
 * Testimonials — the ticker                                                  *
 * ------------------------------------------------------------------------- */

export type Testimonial = {
  quote: string;
  /** Attributed by role, the same way the case studies are, until founders consent to be named. */
  attribution: string;
  /** The one figure that backs the quote up. */
  result: string;
  /**
   * The card in the photo stack. The four case-study quotes carry their own
   * case frame; the rest carry a studio photo, never a face that would read as
   * the founder's own.
   */
  image: { src: string; alt: string };
};

/** One at a time, on a stack of photos that shuffles forward with each quote. */
export const testimonials: Testimonial[] = [
  {
    quote: "Knnekt gave me a clear vision to launch. Within two months I shipped my product and gained the traction that helped me understand my customers.",
    attribution: "Founder · Athleisure · In market",
    result: "45 → 71 score",
    image: { src: `${cdn}/630edbc02eae351ece1f45cce3e1ede17718cca4-1200x1249.webp`, alt: "Coach reviewing data on a laptop while athletes train on an indoor track" },
  },
  {
    quote: "The platform was never the question. Knnekt made us answer who it’s really for.",
    attribution: "Founder · Equity-firm SaaS · In market",
    result: "2 pilots live",
    image: { src: `${cdn}/39491c8a82d60f80a16f404d543c829d3123d7d7-1200x1249.webp`, alt: "Person holding a tablet displaying an AI assistant interface" },
  },
  {
    quote: "They cut half my roadmap and I launched twice as fast. The no’s were the value.",
    attribution: "Founder · Luxury commerce · Launched",
    result: "52 → 79 score",
    image: { src: `${own}/qolorr-mobile.webp`, alt: "The Qolorr wordmark, white on black" },
  },
  {
    quote: "They talked me out of spending ₹50k I didn’t need to. I ran the roadmap myself and it worked.",
    attribution: "Founder · D2C beverage · Roadmap",
    result: "38 → 55 score",
    image: { src: `${own}/khoj-mobile.webp`, alt: "A woman in Punjabi jewellery drinking from a brass glass, in front of a shelf of spice jars" },
  },
  {
    quote: "I’d been quoted four vendors and three months just to get to a kickoff. Here it was one plan and one invoice.",
    attribution: "Founder · Logistics SaaS · Building",
    result: "One fixed price",
    image: { src: `${cdn}/485eab86632782a606942f1209ba6c34d2668eda-1200x1601.webp`, alt: "A long, bright open-plan office with people working at shared desks" },
  },
  {
    quote: "The score was brutal and it was the most useful hour of my year. I knew exactly what was broken before I spent a rupee.",
    attribution: "Founder · Healthtech · Pre-launch",
    result: "Free report, kept",
    image: { src: `${cdn}/131a923cb1ee419e62639e344a4d1a0ce6913048-1200x1601.webp`, alt: "Person with a hand to their face, reading something on a desktop computer" },
  },
  {
    quote: "The weekly 1:1 is the part I’d pay for on its own. Someone senior, every week, who’d actually read my numbers.",
    attribution: "Founder · Fintech · Building",
    result: "12 weekly 1:1s",
    image: { src: `${cdn}/25d452de1b87378bd8baa6e3860b17d5b656edaf-1200x1560.webp`, alt: "Person in a grey sweater reading a message on their phone" },
  },
  {
    quote: "Pitch day put me in front of people I’d been cold-emailing for a year. Two of those conversations are still going.",
    attribution: "Founder · Marketplace · Raising",
    result: "Warm intros, day 90",
    image: { src: `${cdn}/747377142fa2afc1e416f378ebd1d672a90a184d-1200x1601.webp`, alt: "Four people talking on a bench outside an office building" },
  },
  {
    quote: "We shipped the MVP in week seven and had paying users in week nine. Nothing about that was normal for us.",
    attribution: "Founder · Vertical SaaS · In market",
    result: "MVP by week 7",
    image: { src: `${cdn}/4ba968d2595fbd0923b413c381b2d5b7577d3215-1200x1599.webp`, alt: "Person at a workbench with a 3D printer and tools on a pegboard wall" },
  },
  {
    quote: "Legal was the thing I kept putting off. It got handled in the first month, before it got expensive.",
    attribution: "Founder · Consumer app · In market",
    result: "Clean data room",
    image: { src: `${cdn}/a7836cfbeb7410fcc0226cd2f630461ff0199920-1200x1601.webp`, alt: "Person working at a counter beside a large plant, in a sunlit room" },
  },
  {
    quote: "Fifteen founders in the same room, all one quarter deep. I stopped feeling like the only one having that week.",
    attribution: "Founder · Edtech · Building",
    result: "Cohort of 15",
    image: { src: `${cdn}/6d4203a26a935285c7869dcc83ff68ed568778c1-1200x1249.webp`, alt: "A group gathered around a table with laptops, mid-discussion" },
  },
  {
    quote: "I came in wanting a rebrand. I left with positioning, a product and customers. The rebrand never mattered.",
    attribution: "Founder · B2B services · In market",
    result: "100 customers",
    image: { src: `${cdn}/2e36adf958deec74eccfb3384d2da6277f206d96-1200x1601.webp`, alt: "Person assembling something at a wooden workbench in a studio" },
  },
];

/* ------------------------------------------------------------------------- *
 * Pricing                                                                    *
 * ------------------------------------------------------------------------- */

/**
 * One fee, and the four things we promise about it. Stated as flat rules rather
 * than plan cards, because there is only one number to explain.
 */
export const pricingFacts: [string, string][] = [
  ["One partner, not five", "Four functions under one roof. No vendor management, no invoices you didn’t expect."],
  ["We move scope, not price", "If the roadmap changes at day 40, we rebuild the plan, at the same fee."],
  ["A desk, not a login", "Three months at WeWork, building beside the cohort and the studio team."],
  ["Fifteen founders, no more", "We take the number we can actually move. That’s the whole reason for the call."],
];

export type PaymentStep = {
  title: string;
  body: string;
  /** What leaves your account at this point. */
  amount: string;
  when: string;
};

/** The whole fee, scheduled before the quarter starts. */
export const paymentSteps: PaymentStep[] = [
  {
    title: "Book your seat",
    body: "Pay ₹15,000 within 48 hours of the call to book your seat. It counts against the fee, so it isn’t extra, and it is non-refundable once the seat is held.",
    amount: "₹15,000",
    when: "Within 48 hrs of the call",
  },
  {
    title: "Three payments while we build",
    body: "The balance splits into three across the first 45 days, so you’re paying alongside the work, not ahead of it.",
    amount: "3 × ₹95,000",
    when: "Within 45 days",
  },
  {
    title: "Days 46 to 90",
    body: "The build keeps running to pitch day. There’s nothing left to pay for it.",
    amount: "₹0",
    when: "Nothing further",
  },
];

/** What the fee covers, as `[the thing, what it means]`. */
export const feeIncludes: [string, string][] = [
  ["Ten live planning classes", "your 90-day roadmap, built with you in days 1–10"],
  ["Website and product development", "real product, with AI inside it"],
  ["Growth and marketing", "positioning through to demand"],
  ["Legal and compliance", "from incorporation to data room, whatever the build needs"],
  ["The full studio team", "plus vetted partners on call"],
  ["Weekly 1:1s and masterclasses", "an industry expert, live, every week"],
  ["Three months at WeWork", "and a live dashboard on the build"],
  ["Pitch day", "you present 90 days of proof to investors and operators"],
];

/** The one number on the page, and the cohort it buys a seat in. */
export const pricing = {
  fee: "₹3,00,000",
  gst: "+ GST",
  total: "₹3,00,000 + GST",
  cohort: "The 90 · Q3 cohort",
  seats: 15,
  seatsLeft: 6,
  fine: "You only pay after the call, and only if we both decide to build.",
};

/** Clarity both ways: what the fee buys, and what deliberately stays on your card. */
export const ledgerIn: string[] = [
  "Website development",
  "Product development",
  "Marketing strategy",
  "Legal & compliance",
  "The full studio team",
  "Vetted partners",
  "Weekly masterclasses",
  "3 months at WeWork",
  "The founder cohort",
  "Weekly 1:1s",
];

export const ledgerOut: [string, string][] = [
  ["Ad spend", "Your budget, your call."],
  ["Tool subscriptions", "You own the accounts."],
  ["Shoots", "Only if the plan needs one."],
  ["Anything extra outside the roadmap", "No scope creep, no surprises."],
];

/* ------------------------------------------------------------------------- *
 * Insights                                                                   *
 * ------------------------------------------------------------------------- */

export type PostBlock =
  | { h: string }
  | { p: string }
  | { list: string[] }
  | { quote: string };

export type Post = {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  /** ISO date — formatted at render so the markup stays locale-stable. */
  date: string;
  readingTime: string;
  author: string;
  cover: { src: string; w: number; h: number; alt: string };
  body: PostBlock[];
};

/** Newest first. The homepage shows the first three; /en/insights shows them all. */
export const insights: Post[] = [
  {
    slug: "the-no-that-saved-the-quarter",
    title: "The no that saved the quarter",
    excerpt:
      "Four of the last ten founders who came to us wanted to buy something they weren’t ready to use. Here’s how we decide when to refuse the work.",
    category: "Operating",
    date: "2026-08-28",
    readingTime: "6 min read",
    author: "Knnekt Studios",
    cover: {
      src: `${cdn}/99281afbb83464441f7ec29f3f025202d7000443-1200x849.webp`,
      w: 2000,
      h: 1414,
      alt: "Two people standing indoors near large windows, engaged in conversation",
    },
    body: [
      { p: "An agency’s incentive is to say yes. You arrive with a brief and a budget, and the brief becomes the scope, and the scope becomes the invoice. Nobody in that chain is paid to ask whether the brief was right." },
      { p: "We price a quarter, not a deliverable, which means a bad brief costs us as much as it costs you. That one structural fact is why we can afford to refuse work, and why we do, roughly four times in ten." },
      { h: "The three refusals we make most" },
      { p: "They’re always the same shapes. Once you’ve seen a few hundred startups, the pattern is almost boring." },
      { list: [
        "Paid acquisition before positioning is proven. Spending to grow before you know who it’s for just buys the wrong customers faster, and teaches you nothing you can act on.",
        "Every feature in v1. The roadmap is usually a list of things the founder is afraid to cut. We ship the one that proves the model and park the rest until it earns its place.",
        "A full build for a company that needs a plan. Sometimes the honest sell is a ₹10,000 roadmap and six calls. We’d rather you came back ready than paid us for execution you couldn’t use.",
      ] },
      { h: "What refusing actually looks like" },
      { p: "It isn’t a lecture. It’s a number. The Startup Operating Score puts six pillars on the table before anyone talks about scope, and the conversation stops being about what you want to buy and starts being about which constraint is actually binding." },
      { quote: "They talked me out of spending ₹50k I didn’t need to. I ran the roadmap myself and it worked." },
      { p: "That founder is not a customer this quarter. They will be, and the version of them that comes back will be worth building with. That’s the whole trade." },
      { h: "The cost of saying yes anyway" },
      { p: "Every studio has the engagement it took because the quarter looked thin. It never ends well: the work is fine, the outcome isn’t, and the case study quietly never gets written. Fifteen founders a quarter is a small number partly because it keeps us from needing the sixteenth." },
    ],
  },
  {
    slug: "what-a-startup-operating-score-actually-measures",
    title: "What a Startup Operating Score actually measures",
    excerpt:
      "Six pillars, five minutes, no card. What each one is looking for, why founders consistently mis-score themselves on two of them, and what the report is for.",
    category: "The score",
    date: "2026-08-12",
    readingTime: "8 min read",
    author: "Knnekt Studios",
    cover: {
      src: `${cdn}/9c6ad38a21c66d2f9c66155cc8ba04f7f11fbba6-1200x849.webp`,
      w: 2000,
      h: 1414,
      alt: "Person working at a desk with a laptop, with awards and certificates on a shelf behind them",
    },
    body: [
      { p: "Every startup has a number. Most of the ones on offer measure how fundable you look. Ours measures how well the company runs, which is a different question, and a more useful one if you’re the person who has to run it on Monday." },
      { h: "The six pillars" },
      { list: [
        "Clarity: can you say who it’s for and why they switch, in one sentence, without a deck?",
        "Product: does the thing exist, does it work, and is anyone using it without being asked?",
        "Demand: do customers arrive through a channel you can describe and repeat?",
        "Economics: do you know what a customer costs, what they’re worth, and how long the money lasts?",
        "Structure: cap table, contracts, IP and compliance: would a data room survive contact with a lawyer?",
        "Execution: the gap between what you said you’d do last month and what happened.",
      ] },
      { h: "The two everyone gets wrong" },
      { p: "Founders over-score Clarity and under-score Structure, almost without exception." },
      { p: "Clarity feels solved because you’ve said the sentence a hundred times, to friends, to your co-founder, to yourself in the shower. Fluency isn’t clarity. The test isn’t whether you can say it; it’s whether a stranger can repeat it back and get it right." },
      { p: "Structure gets under-scored because nothing has broken yet. Cap tables, IP assignment and contractor agreements are invisible right up until a term sheet makes them the only thing anyone wants to talk about. By then the cheap fix is gone." },
      { h: "What you get back" },
      { p: "A free report: your archetype, your top three constraints in order, and one clear next move. It’s yours whether or not we ever work together, and it’s deliberately written so you could hand it to someone else to execute." },
      { h: "What it’s not" },
      { p: "It isn’t a lead magnet with a score glued on, and it doesn’t flatter you: the average first score is in the forties. If it comes back low, that isn’t a sales hook. It’s usually the roadmap conversation, not the cohort one." },
    ],
  },
  {
    slug: "why-ninety-days",
    title: "Why ninety days, and not six months",
    excerpt:
      "A quarter is long enough to build something real and short enough that nobody can hide in it. What we learned trying both.",
    category: "The method",
    date: "2026-07-30",
    readingTime: "5 min read",
    author: "Knnekt Studios",
    cover: {
      src: `${cdn}/185dc8311ae3dd2ab6f7344a60e642a552b94a91-1200x849.webp`,
      w: 2000,
      h: 1414,
      alt: "Three people standing and arranging sticky notes on a whiteboard during a team workshop",
    },
    body: [
      { p: "Ninety days is not a marketing number. It’s the shortest window in which a company can go from a plan to customers using something real, and the longest one in which nobody loses the thread." },
      { h: "Six months lets everyone hide" },
      { p: "On a six-month engagement, month two feels early and month five feels late, and the only month anyone remembers is the last one. Scope drifts because there’s room for it to. The founder stops making hard calls because there’s always next month. We’ve run it. It produces better-looking work and worse outcomes." },
      { h: "Thirty days is a sprint, not a company" },
      { p: "You can ship something in thirty days. You cannot ship something, put it in front of customers, learn from what they do, and fix it. The learning loop is the product; thirty days buys you exactly one pass through it, which is a coin toss." },
      { h: "The shape of the ninety" },
      { list: [
        "Days 1–10: ten live classes. We read the real constraints and map all ninety days to one goal, together.",
        "Days 11–90: the studio ships across product, growth, AI and legal while the founder makes the calls.",
        "By day 90: customers in market, the metrics and the narrative to raise on, and a pitch day to say it out loud.",
      ] },
      { h: "The forcing function" },
      { p: "The thing that makes a quarter work isn’t the length. It’s that the end date is fixed and public: fifteen founders, one pitch day, a room of investors who are already in the calendar. Nobody renegotiates a deadline that other people are flying in for." },
    ],
  },
  {
    slug: "the-four-vendor-problem",
    title: "The four-vendor problem",
    excerpt:
      "A brand agency, a dev shop, a growth consultant and a lawyer. Each one competent, none of them in the same room. Why that arrangement fails so reliably.",
    category: "Operating",
    date: "2026-07-09",
    readingTime: "6 min read",
    author: "Knnekt Studios",
    cover: {
      src: `${cdn}/26923509ab3eb9c18db9333b483f2198c570ef6a-1200x849.webp`,
      w: 2000,
      h: 1414,
      alt: "Three people collaborating in front of a whiteboard, with one person seated at a table with a laptop",
    },
    body: [
      { p: "The default way to build a startup in India is to hire four specialists who never meet. It’s defensible on paper: each one is good at their thing, each one is replaceable, and you keep control. In practice it puts the hardest job in the company on the least experienced person in it: you." },
      { h: "The integration tax" },
      { p: "Nobody quotes you for integration, and integration is most of the work. The brand agency’s positioning doesn’t reach the dev shop, so the product says something different from the website. The growth consultant optimises a funnel built on a promise the product doesn’t keep. The lawyer papers a structure nobody told them was about to change." },
      { quote: "Four vendors who never meet. One studio, four functions." },
      { h: "The escalation problem" },
      { p: "When two vendors disagree, there’s no forum. There’s you, forwarding emails between two people who are each right within their own scope. The decision gets made by whoever is more insistent, or it doesn’t get made at all, which is worse, because the work continues either way." },
      { h: "What one roof actually changes" },
      { list: [
        "One plan, prioritised across all four functions, so growth and product are never solving different quarters.",
        "One dashboard, so you can see the whole quarter rather than four status calls.",
        "One price, so nobody’s incentive is to expand their slice.",
        "One partner in the middle who owns the outcome instead of their scope.",
      ] },
      { p: "None of this is magic. It’s just that the coordination work gets done by someone who has done it three hundred times, instead of by a founder doing it for the first time while also running the company." },
    ],
  },
  {
    slug: "shipping-an-mvp-you-dont-rebuild",
    title: "Shipping an MVP you don’t rebuild in year two",
    excerpt:
      "Most MVPs get thrown away, not because they were built badly, but because they answered the wrong question. The four decisions that decide which kind you get.",
    category: "Technology",
    date: "2026-06-18",
    readingTime: "7 min read",
    author: "Knnekt Studios",
    cover: {
      src: `${cdn}/146fe6a793fd3671a74e623447f36b2cc5abf929-1200x849.webp`,
      w: 2000,
      h: 1414,
      alt: "Person sitting at a workbench with a 3D printer and tools organised on a pegboard wall",
    },
    body: [
      { p: "“Minimum viable” has been read as “cheap and disposable” for so long that founders now budget for the rewrite before they’ve shipped the original. That’s a choice, not a law." },
      { h: "The rebuild is almost never technical" },
      { p: "When a product gets rewritten in year two, the reason is rarely the framework. It’s that the data model encoded an assumption about the business that turned out to be wrong: one user per account, one currency, one kind of customer. And every screen inherited it." },
      { h: "Four decisions that survive" },
      { list: [
        "Model the business, not the screens. Get the nouns right: what is an account, an order, a member. Then the UI can change a dozen times without a migration.",
        "Boring infrastructure. Managed database, managed auth, one hosting platform. Novelty in the stack buys nothing and costs you the whole quarter when it breaks.",
        "Instrument from day one. If you ship without knowing what people do, your first month of customer data is gone and you can’t get it back.",
        "Put AI where it’s the point, not everywhere. Inside the product when it’s the reason someone switches; behind it when it saves you a hire. Anywhere else it’s a demo.",
      ] },
      { h: "What you should throw away" },
      { p: "Plenty, just not the foundation. The onboarding flow, the pricing page, half the features: all of that should be cheap to replace, and will be replaced. Build those fast and loose on purpose. The distinction that matters isn’t quality, it’s which parts you’ve committed to." },
      { h: "The test" },
      { p: "Before we ship anything, we ask one question: if this works, what breaks first? If the answer is “the code,” we didn’t build it properly. If the answer is “we’ll need to hire,” we built the right thing." },
    ],
  },
  {
    slug: "fundraising-is-a-metrics-problem",
    title: "Fundraising is a metrics problem before it’s a story problem",
    excerpt:
      "Founders rewrite the deck when the numbers are what’s failing. What investors actually check, and the order they check it in.",
    category: "Funding",
    date: "2026-05-27",
    readingTime: "7 min read",
    author: "Knnekt Studios",
    cover: {
      src: `${cdn}/954a137137d858217286a7dd6b315e23ad4121d6-1200x849.webp`,
      w: 2000,
      h: 1414,
      alt: "Two people having a discussion in a meeting room with a laptop and a large screen displaying a diagram",
    },
    body: [
      { p: "After a round of rejections, the instinct is always to rewrite the deck. Sometimes that’s right. Usually the deck was fine and it was carrying numbers that couldn’t hold it up." },
      { h: "The order of checks" },
      { p: "A partner meeting runs the same sequence almost every time, and it isn’t the sequence in your deck." },
      { list: [
        "Is anyone using this, and did they choose to? Retention before growth, always.",
        "Where do customers come from, and can you do it again? One repeatable channel beats four experiments.",
        "What does a customer cost and what are they worth? Approximate is fine. Unknown is not.",
        "How long does the money last? Runway is the question behind every other question.",
        "Is the company cleanly owned? Cap table, IP, contracts, the check that quietly kills deals after the handshake.",
      ] },
      { h: "The story’s actual job" },
      { p: "The narrative doesn’t substitute for those answers. It sequences them: it tells the investor which number to look at first and what it implies about the next one. A great story on weak metrics reads as evasion. Honest metrics with no story read as a spreadsheet nobody champions internally." },
      { h: "Build the data room before you need it" },
      { p: "The founders who raise quickly are rarely the ones with the best numbers. They’re the ones who could answer every question in the room and produce the document within an hour. Diligence is a speed test, and a slow answer reads as a bad one." },
      { quote: "The platform was never the question. Knnekt made us answer who it’s really for." },
      { h: "Ninety days of proof" },
      { p: "This is most of why the quarter is shaped the way it is. At day 90 you have customers using what we built, the economics that come with them, and a structure that survives a lawyer, and then you pitch it live, to a room that has already been briefed." },
    ],
  },
];

const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

/** Formatted by hand rather than with `Intl`, so server and client always agree. */
export function formatPostDate(iso: string) {
  const [y, m, d] = iso.split("-").map(Number);
  return `${d} ${MONTHS[m - 1]} ${y}`;
}

export const getPost = (slug: string) => insights.find((p) => p.slug === slug);

/**
 * The Startup Operating Score section: the six pillars and the sample report the
 * card cycles through — a founder scored at 61, what it flagged, where that puts
 * them on the climb, and the first lines of the roadmap it hands back.
 */
export const scorePillars = ["Clarity", "Evidence", "Product", "Traction", "Ops", "Invest"];

export const scoreSample = {
  score: 61,
  archetype: "The Builder",
  /** Bar heights per pillar, in percent, in `scorePillars` order. */
  bars: [78, 42, 72, 64, 48, 66],
  /** Which pillars the report flags as the weak ones. */
  weak: [1, 4],
  question: {
    label: "Customer Evidence · 1 of 3",
    text: "Which statement best represents the basis of your current customer understanding?",
    options: [
      "Our understanding is primarily internal.",
      "We have validated through a limited number of conversations, mostly within our network.",
      "We have validated through structured conversations with buyers outside our network.",
      "We validate continuously, and can quote the exact language buyers use.",
    ],
    remaining: "One page per pillar · 5 min",
  },
  constraints: [
    ["Customer Evidence", "You’re building before demand is proven."],
    ["Operational Readiness", "Too much still depends on you."],
    ["Commercial Traction", "Revenue isn’t repeatable yet."],
  ] as [string, string][],
  /** Where the sample founder sits on the track, in percent, and the marks they climb past. */
  climb: { you: 34, marks: [[46, "Median"], [68, "Scale-ready"], [87, "Investor-ready"]] as [number, string][] },
  roadmap: [
    ["Prove demand before building further", true],
    ["Ship the pre-order page", true],
    ["Run 10 problem interviews", false],
    ["Get delivery out of your hands", false],
  ] as [string, boolean][],
};

/** Edit from the admin panel as the real count comes in. */
export const scoredThisMonth = 1284;
