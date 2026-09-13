const cdn = "/sanity";

/** Marquee claims under the intro headline — the studio in seven short facts. */
export const proofPoints = [
  "Built on 300+ startups",
  "Every stage",
  "Every industry",
  "Only 15 founders",
  "90 days",
  "First 100 customers",
  "One honest score",
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
 * Representative engagements. Real founder photos, quotes and scorecards go live
 * as founders consent — the imagery here stands in until they do.
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
      "They wanted a big paid launch on day one. We refused — proving the drop with organic demand first meant they didn’t burn cash on an audience they hadn’t earned.",
    timeline: [
      ["Week 1–3", "Diagnosis: positioning before product."],
      ["Week 4–8", "Product line built, storefront shipped."],
      ["Week 9–12", "First drop live, demand tested with real buyers."],
    ],
    delivered: ["Brand & positioning system", "Shopify storefront", "First product drop", "Demand-gen playbook"],
    results: [
      ["Live", "product in market"],
      ["45 → 71", "Startup Operating Score"],
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
      "An AI data and client-management platform for equity firms — built, piloted, and repositioned for the round.",
    quote: "The platform was never the question. Knnekt made us answer who it’s really for.",
    attribution: "Founder · Equity-firm SaaS · In market",
    refused:
      "They wanted a paid-acquisition push at pilot stage. We refused — spending to grow before positioning is proven just buys the wrong customers faster.",
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
      ["61 → 74", "Startup Operating Score"],
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
      "Luxury content-commerce with ownership tags and resale — scope cut to the one thing that proves the model.",
    quote: "They cut half my roadmap and I launched twice as fast. The no’s were the value.",
    attribution: "Founder · Luxury commerce · Launched",
    refused:
      "They wanted every feature in v1. We refused — we shipped the one that proves the model and parked the rest until it earned its place.",
    timeline: [
      ["Week 1–3", "Diagnosis: scope, not features."],
      ["Week 4–8", "Ownership-tag platform built."],
      ["Week 9–12", "Creator storefronts live."],
    ],
    delivered: ["Ownership-tag platform", "Creator storefront system", "Brand & positioning", "Launch campaign"],
    results: [
      ["Launched", "storefronts live"],
      ["52 → 79", "Startup Operating Score"],
      ["+27", "operating points"],
    ],
    alt: "A tablet displaying a storefront with colourful products, placed on a textured surface",
    mobile: { src: `${cdn}/bbff6ed0309689de764e93892703550fadad9282-1200x1249.webp`, w: 2500, h: 2600 },
    desktop: { src: `${cdn}/b8eceb16e50d10afb9000094a5bb048d19b394de-1200x1560.webp`, w: 2500, h: 3250 },
  },
  {
    slug: "khoj",
    client: "Khoj",
    title: "A plan they could run themselves",
    sector: "D2C · beverage",
    tier: "The Founder’s Roadmap",
    blurb:
      "Early-stage D2C beverage. The honest sell was a plan, not execution — so a ₹10k roadmap and six calls is what we gave them.",
    quote: "They talked me out of spending ₹50k I didn’t need to. I ran the roadmap myself and it worked.",
    attribution: "Founder · D2C beverage · Roadmap",
    refused:
      "They came for a full build. We refused — a ₹10k roadmap was the honest sell, and we’d rather they came back ready than pay for execution they couldn’t use.",
    timeline: [
      ["Week 1–3", "Diagnosis: not ready to build."],
      ["Roadmap", "90-day plan handed over."],
      ["Calls", "Six 1:1s across the quarter."],
    ],
    delivered: ["Personalised 90-day roadmap", "Operating manuals & library", "Six 1:1 guidance calls", "Founder community"],
    results: [
      ["Self-run", "they executed it"],
      ["38 → 55", "Startup Operating Score"],
      ["+17", "operating points"],
    ],
    wide: true,
    alt: "Close-up of a hand holding a smartphone displaying a drinks ordering app",
    mobile: { src: `${cdn}/61bf8880b19c1615bd75b1d3c26e955fbf61d6d0-1200x1249.webp`, w: 2500, h: 2600 },
    desktop: { src: `${cdn}/83c6a0d8ba17e548268a785223b31db9a5fa87a3-1200x780.webp`, w: 2500, h: 1625 },
  },
];

export const services = [
  {
    id: "discover",
    title: "Discover Novel Opportunities",
    text: "The right problem is the one worth solving. We quickly uncover actionable opportunities through data and business insights, ensuring that every discovery is grounded in what matters most for your business and your users.",
    capabilities: [
      "Business & Market Research",
      "Data-Driven Insights",
      "AI & UX Audits",
      "Customer Journey Mapping",
      "Brand Perception Analysis",
      "Agentic Opportunities",
    ],
    vimeo: "1184110361",
    vimeoAspect: 1280 / 536,
    mediaClass: "-mb-3 px-5 lg:px-14",
    bg: `${cdn}/7fa74a1ccdcb8015276c6112898c48b4bdcb3da7-1920x1112.webp`,
  },
  {
    id: "envision",
    title: "Envision Innovative Strategies",
    text: "Great strategies don’t just come from ideas—they come from clear, actionable plans. We create pragmatic roadmaps that balance ambition with feasibility, focusing on what will drive immediate and long-term impact for both business and users.",
    capabilities: [
      "CX, Product & AI Strategy",
      "Vision & Roadmapping",
      "Value Proposition Design",
      "Northstar Metric Framework",
      "Brand Strategy & Positioning",
      "Technical Solution Design",
    ],
    vimeo: "1184110358",
    vimeoAspect: 1280 / 536,
    mediaClass: "mt-1 px-7 lg:mt-2 lg:px-16",
    bg: `${cdn}/5972f7b6bc093c048edc54c40149f78a8af834ae-1920x1112.webp`,
  },
  {
    id: "build",
    title: "Build Engaging Touchpoints",
    text: "We turn strategy into action—fast and efficiently. Whether designing intuitive interfaces, visual identities or building scalable platforms, we focus on building holistic experiences that are both joyful and effective.",
    capabilities: [
      "UX & UI Design",
      "AI Enabled Products",
      "Brand & Visual Design",
      "Platforms & Design Systems",
      "Intelligent Experiences",
      "Agile Software Engineering",
    ],
    vimeo: "1184110386",
    vimeoAspect: 1280 / 536,
    mediaClass: "my-1 px-7 lg:my-2 lg:px-16",
    bg: `${cdn}/5c0766161f4835c1f8d9489e22128bfc71aad1ff-1920x1112.webp`,
  },
  {
    id: "elevate",
    title: "Elevate Delivery Capabilities",
    text: "We make sure teams can deliver better outcomes, faster. By working closely with you to optimize workflows, upskill teams, and implement the right tools, we help you scale with confidence and consistency.",
    capabilities: [
      "AI Consulting",
      "UX/UI Delivery",
      "Agentic Workflows",
      "Performance & Analytics",
      "Continuous Improvement",
      "Change Management",
    ],
    vimeo: "1184110390",
    vimeoAspect: 1280 / 536,
    mediaClass: "mt-2 px-10 lg:mt-3 lg:px-20",
    bg: `${cdn}/84a716626708bc871945e911c39039eb81ec16c1-1920x1112.webp`,
  },
];

export const principles = [
  {
    a: "We’re Not Just a Vendor.",
    b: "We’re Your Partner in Crime.",
    alt: "Two people are standing indoors near large windows, one wearing a brown jacket and the other in dark clothing, engaged in conversation",
    src: `${cdn}/99281afbb83464441f7ec29f3f025202d7000443-1200x849.webp`,
  },
  {
    a: "We Don’t Just Follow Trends.",
    b: "We Shape New Territories.",
    alt: "Person sitting at a workbench with a 3D printer and tools organized on a pegboard wall",
    src: `${cdn}/146fe6a793fd3671a74e623447f36b2cc5abf929-1200x849.webp`,
  },
  {
    a: "We Don’t Play by the Book.",
    b: "We Write It Together.",
    alt: "Three people collaborating in front of a whiteboard, with one person seated at a table with a laptop",
    src: `${cdn}/26923509ab3eb9c18db9333b483f2198c570ef6a-1200x849.webp`,
  },
  {
    a: "We Don’t Sell Empty Ideas.",
    b: "We Recommend What Actually Works.",
    alt: "Two people having a discussion in a meeting room with a laptop and a large screen displaying a diagram",
    src: `${cdn}/954a137137d858217286a7dd6b315e23ad4121d6-1200x849.webp`,
  },
  {
    a: "We Don’t Overstrategize.",
    b: "We Keep It Efficient & Real.",
    alt: "Person working at a desk with a laptop, with several awards and certificates displayed on a shelf in the background",
    src: `${cdn}/9c6ad38a21c66d2f9c66155cc8ba04f7f11fbba6-1200x849.webp`,
  },
  {
    a: "We Don’t Rush.",
    b: "We Build for the Long Haul.",
    alt: "Three people standing and arranging sticky notes on a whiteboard during a team workshop",
    src: `${cdn}/185dc8311ae3dd2ab6f7344a60e642a552b94a91-1200x849.webp`,
  },
];

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

export const bcorpLogo = `${cdn}/bd521b8a0aefb26c89e049ec70d8c3dbd6166970-400x400.webp`;
export const officesVimeo = "1184095687";
export const officesVimeoAspect = 16 / 9;
export const founderPortrait = `${cdn}/b6c4df15de20e1699da43919380d4d3516666aca-400x400.webp`;

export const culture = [
  { title: "Warm and Inviting Spaces", text: "Designed to foster creativity and collaboration in a comfortable, welcoming environment.", width: "lg:w-[31.5vw]", sizes: "31.5vw", alt: "Several people working at computers in a bright, modern office space", src: `${cdn}/485eab86632782a606942f1209ba6c34d2668eda-1200x1601.webp`, w: 2000, h: 2668 },
  { title: "Fitness Meets Work", text: "Stay healthy with our dedicated gym and personal training, part of our employee wellness program.", width: "lg:w-[25vw]", sizes: "25vw", alt: "Two people in a gym setting, one preparing to lift a barbell while the other observes", src: `${cdn}/f431370f13af511e64fc9b36094824ba966cd6d3-1200x1601.webp`, w: 2000, h: 2668 },
  { title: "Your Social Hub", text: "Located in vibrant city centers, our offices are places for connection and face-to-face collaboration.", width: "lg:w-[27.5vw]", sizes: "27.5vw", alt: "Three people sitting outside on a bench, eating and talking in front of a large window with the text “Let’s rethink tomorrow”", src: `${cdn}/747377142fa2afc1e416f378ebd1d672a90a184d-1200x1601.webp`, w: 2000, h: 2668 },
  { title: "Fueling Creativity", text: "We care about good food—our in-house chef ensures everyone stays energized and inspired.", width: "lg:w-[31.5vw]", sizes: "31.5vw", alt: "Person preparing food at a kitchen counter with pastries and bottles, next to a large plant", src: `${cdn}/a7836cfbeb7410fcc0226cd2f630461ff0199920-1200x1601.webp`, w: 2000, h: 2668 },
  { title: "Unleash Your Inner Tinkerer", text: "Our lab is packed with 3D printers, VR/AR setups, and tools to bring ideas to life.", width: "lg:w-[25vw]", sizes: "25vw", alt: "Person seated at a workbench, reaching for tools on a pegboard wall with a 3D printer nearby", src: `${cdn}/4ba968d2595fbd0923b413c381b2d5b7577d3215-1200x1599.webp`, w: 2000, h: 2664 },
  { title: "Hands-On Creativity", text: "Step away from the screen and recharge in our wood workshop, where you can build with your hands.", width: "lg:w-[33.5vw]", sizes: "33.5vw", alt: "Person working with a vise and hand tools at a wooden workbench in a workshop", src: `${cdn}/2e36adf958deec74eccfb3384d2da6277f206d96-1200x1601.webp`, w: 2000, h: 2668 },
  { title: "Only the Best Tools", text: "We provide top-tier equipment, ensuring you have what you need to excel.", width: "lg:w-[30vw]", sizes: "30vw", alt: "Person with green hair working at a desk with an Apple computer and laptop in a sunlit office", src: `${cdn}/131a923cb1ee419e62639e344a4d1a0ce6913048-1200x1601.webp`, w: 2000, h: 2668 },
  { title: "Work, Anywhere", text: "Whether in the office or remote, flexibility is key—work where you’re most inspired.", width: "lg:w-[35vw]", sizes: "35vw", alt: "Person sitting on a white metal chair outdoors, working on a laptop surrounded by greenery", src: `${cdn}/273b9c06149127d309bae39b8cb47ff3d371be0c-1200x1601.webp`, w: 2000, h: 2668 },
  { title: "Where Work Meets Play", text: "Offsites and team events help us connect, collaborate, and recharge as a group.", width: "lg:w-[27.5vw]", sizes: "27.5vw", alt: "Group of people attending a meeting or presentation in a room with a presenter using a laptop", src: `${cdn}/681ad599c470d0e5757e221d3c6a359b73d52269-1200x1601.webp`, w: 2000, h: 2668 },
];
