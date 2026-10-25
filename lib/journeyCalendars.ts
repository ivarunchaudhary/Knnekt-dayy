/*
 * The calendars behind each stage of "Day 1 to Pitch Day": the Roadmap Sprint's two
 * weeks, a week per theme from Day 11 to Day 100, and Pitch Day itself, hour by hour.
 * One entry per stage, in the order of `journeyPhases`.
 */

/** The drawing on a tile or a Day 100 card; see `components/JourneyIllustration`. */
export type JourneyArt =
  | "orientation"
  | "cohort"
  | "dinner"
  | "masterclass"
  | "halfDay"
  | "dayOff"
  | "pitch"
  | "fieldDay"
  | "fireside"
  | "hackathon"
  | "demoNight"
  | "boardMeeting"
  | "offsite"
  | "openHouse"
  | "dryRun"
  | "arrival"
  | "rehearsal"
  | "guests"
  | "investorTables"
  | "networking"
  | "celebration";

/** What a tile is, which sets its colour bar and tint (`kc-class`, `kc-build`, …). */
export type TileKind = "class" | "build" | "hours" | "master" | "review" | "orient" | "pitch" | "sat" | "sun" | "extra";

export type CalendarTile = {
  kind: TileKind;
  title: string;
  /** The small bold line above the title: the class number, "Off", "Half day". */
  time?: string;
  /** The day's main event, drawn taller. */
  lead?: boolean;
  art?: JourneyArt;
};

export type CalendarDay = {
  dow: string;
  num: string;
  /** Sunday off, Saturday's half day and Pitch Day get their own header colour. */
  tone?: "off" | "half" | "pitch";
  tiles: CalendarTile[];
};

export type CalendarWeek = {
  span: string;
  /** From Day 11 each week has a theme, shown as a coloured tag on its tab. */
  theme?: string;
  days: CalendarDay[];
};

type CalendarBase = {
  id: string;
  /** The region's accessible name. */
  name: string;
  /** The button that opens it; the phone sheet takes its title from this. */
  label: string;
  /** The button once it's open. */
  hide?: string;
};

export type WeekCalendar = CalendarBase & { legend: [TileKind, string][]; weeks: CalendarWeek[] };

export type ScheduleItem = { time: string; title: string; line: string; art: JourneyArt; main?: boolean };

export type DayCalendar = CalendarBase & { schedule: ScheduleItem[] };

export type StageCalendar = WeekCalendar | DayCalendar;

const masterclass: CalendarTile = { kind: "master", title: "Masterclass", art: "masterclass" };

const dayOff: CalendarDay = { dow: "Sun", num: "Off", tone: "off", tiles: [{ kind: "sun", time: "Off", title: "Studio closed", art: "dayOff" }] };

const halfDay = (...extra: CalendarTile[]): CalendarDay => ({
  dow: "Sat",
  num: "Half day",
  tone: "half",
  tiles: [{ kind: "sat", time: "Half day", title: "Studio open till 3:00 PM", art: "halfDay" }, ...extra],
});

/** A Roadmap Sprint day: the sprint class, two build sprints round office hours, and how the day ends. */
const sprintDay = (dow: string, day: number, title: string, last: CalendarTile = { kind: "build", title: "Build sprint 2" }): CalendarDay => ({
  dow,
  num: `Day ${day}`,
  tiles: [
    { kind: "class", lead: true, time: `Sprint ${100 + day}`, title },
    { kind: "build", title: "Build sprint 1" },
    { kind: "hours", title: "Office Hours · 1:1" },
    last,
  ],
});

const weekdays = ["Mon", "Tue", "Wed", "Thu", "Fri"];

/**
 * A week from Day 11 on: Sunday off, a class a day Monday to Friday (Day 11 is Class 101)
 * with whatever else is on that day after it, then Saturday's half day.
 */
const classWeek = (theme: string, first: number, days: ([string, ...CalendarTile[]] | CalendarDay)[], saturday: CalendarTile[] = []): CalendarWeek => ({
  theme,
  span: `Wk ${(first - 1) / 5 + 1} · Days ${first}–${first + 4}`,
  days: [
    dayOff,
    ...days.map((d, i): CalendarDay => {
      if (!Array.isArray(d)) return d;
      const [title, ...rest] = d;
      const day = first + i;
      return { dow: weekdays[i], num: `Day ${day}`, tiles: [{ kind: "class", lead: true, time: `Class ${day + 90}`, title }, ...rest] };
    }),
    halfDay(...saturday),
  ],
});

const classLegend: [TileKind, string][] = [
  ["class", "Class / focus session"],
  ["master", "Masterclass"],
  ["extra", "Extra curriculum"],
  ["pitch", "Pitch Day"],
];

export const stageCalendars: StageCalendar[] = [
  {
    id: "cal-sprint",
    name: "Roadmap Sprint calendar",
    label: "See the Day 0–10 calendar",
    legend: [
      ["class", "Sprint class"],
      ["build", "Build sprint"],
      ["hours", "Office Hours · 1:1"],
      ["master", "Masterclass"],
      ["review", "Review"],
      ["orient", "Orientation"],
      ["pitch", "Roadmap Day"],
    ],
    weeks: [
      {
        span: "Week 1 · Days 0–5",
        days: [
          {
            dow: "Sun",
            num: "Day 0",
            tiles: [
              { kind: "orient", lead: true, title: "Day 0 · Orientation", art: "orientation" },
              { kind: "orient", title: "Welcome" },
              { kind: "orient", title: "Meet the cohort", art: "cohort" },
              { kind: "orient", title: "Dinner together", art: "dinner" },
            ],
          },
          sprintDay("Mon", 1, "Startup Metrics 101: Your Baseline"),
          sprintDay("Tue", 2, "How to Set Your North Star and KPIs"),
          sprintDay("Wed", 3, "ICP, Positioning and Your First Channel"),
          sprintDay("Thu", 4, "How to Plan an MVP", masterclass),
          sprintDay("Fri", 5, "AI-Native Operations", { kind: "review", title: "Week-1 review" }),
          halfDay(),
        ],
      },
      {
        span: "Week 2 · Days 6–10",
        days: [
          dayOff,
          sprintDay("Mon", 6, "Startup Legal 101: Cap Table, IP and Compliance"),
          sprintDay("Tue", 7, "How to Prioritise and Plan 90 Days"),
          sprintDay("Wed", 8, "Scope, Risk and the Pivot Line"),
          sprintDay("Thu", 9, "How to Think Like an Investor", masterclass),
          {
            dow: "Fri",
            num: "Day 10",
            tone: "pitch",
            tiles: [
              { kind: "pitch", title: "Pod rehearsal" },
              { kind: "pitch", title: "Present your roadmap" },
              { kind: "pitch", lead: true, time: "Sprint 110", title: "Roadmap Day: The 5-Minute Pitch", art: "pitch" },
              { kind: "pitch", title: "Celebration" },
            ],
          },
          halfDay(),
        ],
      },
    ],
  },
  {
    id: "cal-prove",
    name: "Set up and prove calendar",
    label: "See the Days 11–30 calendar",
    legend: classLegend,
    weeks: [
      classWeek("Positioning", 11, [
        ["Positioning 101: Who It’s For"],
        ["How to Write Your One-Line Pitch"],
        ["Messaging That Converts: Value and Proof"],
        ["Pricing 101: Models and First Hypotheses", masterclass],
        ["Positioning Review: Lock the Story", { kind: "extra", title: "Founder dinner", art: "dinner" }],
      ]),
      classWeek("Prove it with customers", 16, [
        ["How to Run Customer Discovery Interviews"],
        ["Outbound 101: Getting Your First Replies"],
        ["Reading the Signal: Interview Synthesis"],
        ["Landing Pages and Smoke Tests", masterclass],
        ["Demand Review: What the Market Said"],
      ]),
      classWeek("Legal set-up", 21, [
        ["Incorporation: Choosing the Right Entity"],
        ["Founder Agreements and Vesting"],
        ["Cap Table and ESOP Basics", { kind: "extra", title: "Customer field day", art: "fieldDay" }],
        ["IP Assignment and Commercial Contracts", masterclass],
        ["Data Privacy and Compliance 101"],
      ]),
      classWeek("Scope the product", 26, [
        ["MVP Scope: Must-Haves vs Nice-to-Haves"],
        ["User Journeys and Core Flows"],
        ["How to Choose Your Tech Stack"],
        ["Build Plan: Milestones and Owners", masterclass],
        ["Day 30 Review: Scope Sign-Off"],
      ]),
    ],
  },
  {
    id: "cal-build",
    name: "Build calendar",
    label: "See the Days 31–100 calendar",
    legend: classLegend,
    weeks: [
      classWeek("Product foundations", 31, [
        ["Design Systems 101"],
        ["Website Architecture That Converts"],
        ["Bringing Your Brand Into the Product"],
        ["Writing Product and Website Copy", masterclass],
        ["Website Review: Ready for Launch", { kind: "extra", title: "Investor fireside chat", art: "fireside" }],
      ]),
      classWeek("Website live", 36, [
        ["Launch Checklist: QA and Performance"],
        ["Analytics 101: Events and Funnels"],
        ["SEO Fundamentals for Startups"],
        ["Launch Day Playbook", masterclass],
        ["Launch Review: First Week Data"],
      ]),
      classWeek(
        "MVP core",
        41,
        [
          ["Building the Core Feature: Part 1"],
          ["Building the Core Feature: Part 2"],
          ["Onboarding That Activates Users"],
          ["QA and Internal Testing", masterclass],
          ["MVP Demo: Show What Works"],
        ],
        [{ kind: "extra", title: "AI build hackathon", art: "hackathon" }],
      ),
      classWeek("Growth engine", 46, [
        ["Channel Strategy: Picking Your First Two"],
        ["Content Engine 101"],
        ["Running Your First Campaigns"],
        ["Funnels, Conversion and CAC", masterclass],
        ["Growth Review: What’s Working"],
      ]),
      classWeek("AI inside", 51, [
        ["Where AI Earns Its Place in Your Product"],
        ["Building Your First AI Feature"],
        ["Testing AI With Real Users"],
        ["AI Guardrails, Cost and Quality", masterclass],
        ["AI Demo: Prototype to Product", { kind: "extra", title: "Midpoint demo night", art: "demoNight" }],
      ]),
      classWeek("First customers", 56, [
        ["Onboarding Your First Customers"],
        ["Support as a Growth Loop"],
        ["Feedback Sprints: What to Fix First"],
        ["Retention 101: Why Users Stay", masterclass],
        ["Customer Review: Health and Next Steps"],
      ]),
      classWeek("Ops on autopilot", 61, [
        ["Mapping Your Workflows"],
        ["Automating Sales Follow-Up"],
        ["Automating Support With AI", { kind: "extra", title: "Mock board meeting", art: "boardMeeting" }],
        ["Data Foundations: One Source of Truth", masterclass],
        ["Ops Review: What Runs Without You"],
      ]),
      classWeek("Metrics that matter", 66, [
        ["Revenue Metrics: MRR, ARR and Growth"],
        ["Cohorts and Retention Analysis"],
        ["Runway and Burn: Building the Model"],
        ["Building Your Live Dashboard", masterclass],
        ["Metrics Review: What Investors Ask For"],
      ]),
      classWeek("Clean records", 71, [
        ["Customer and Vendor Contracts in Order"],
        ["Compliance Check: Tax, GST and Filings"],
        ["Data Room 101: Structure and Contents"],
        ["Financial Statements Investors Trust", masterclass],
        ["Legal Review: Diligence-Ready", { kind: "extra", time: "Half day", title: "Founder offsite · reset and recharge", art: "offsite" }],
      ]),
      classWeek("Scale demand", 76, [
        ["Doubling Down on What Works"],
        ["Referral Loops and Word of Mouth"],
        ["Partnerships and Distribution"],
        ["Paid Acquisition: Testing With Discipline", masterclass],
        ["Growth Review: Scaling the Channel"],
      ]),
      classWeek(
        "Traction story",
        81,
        [
          ["Reading Your Traction Honestly"],
          ["Customer Proof: Testimonials and Quotes"],
          ["Writing Your Case Studies"],
          ["The Fundraising Narrative", masterclass],
          ["Story Review: Traction to Thesis"],
        ],
        [{ kind: "extra", title: "Studio open house", art: "openHouse" }],
      ),
      classWeek("Data room", 86, [
        ["What Investors Ask in Diligence"],
        ["The Financial Model Investors Expect"],
        ["Finalising Your Data Room"],
        ["Mock Diligence", masterclass],
        ["Diligence Review", { kind: "extra", title: "Investor dry run", art: "dryRun" }],
      ]),
      classWeek("Pitch prep", 91, [
        ["Building the Pitch Deck"],
        ["The Five-Minute Pitch"],
        ["Investor Q&A: Hard Questions Drill"],
        ["Pitch Rehearsal With Your Pod", masterclass],
        ["Pitch Review: Feedback and Final Cuts"],
      ]),
      classWeek("Pitch week", 96, [
        ["Final Deck Lock"],
        ["Full Run-Through"],
        ["Investor Q&A Practice"],
        ["Dress Rehearsal", masterclass],
        {
          dow: "Fri",
          num: "Day 100",
          tone: "pitch",
          tiles: [{ kind: "pitch", lead: true, time: "Day 100", title: "Pitch Day: present it live", art: "pitch" }],
        },
      ]),
    ],
  },
  {
    id: "cal-day100",
    name: "Day 100 schedule",
    label: "See the Day 100 schedule",
    hide: "Hide the schedule",
    schedule: [
      { time: "9:30", title: "Arrival", line: "Check in, badges and coffee", art: "arrival" },
      { time: "10:00", title: "Final rehearsal", line: "With your pod", art: "rehearsal" },
      { time: "11:30", title: "Fireside chat", line: "With a founder who has raised", art: "fireside" },
      { time: "12:30", title: "Networking", line: "Meet the guests", art: "guests" },
      { time: "1:30", title: "Lunch", line: "Cohort, team and guests", art: "dinner" },
      { time: "2:30", title: "Pitch to investors", line: "Five minutes, live", art: "pitch", main: true },
      { time: "4:30", title: "Investor conversations", line: "One-to-one tables", art: "investorTables" },
      { time: "6:00", title: "Networking", line: "Investors and operators", art: "networking" },
      { time: "7:00–8:00", title: "Celebration", line: "Cohort, team and guests, till 8 PM", art: "celebration" },
    ],
  },
];
