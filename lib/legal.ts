/**
 * Text of the Privacy Policy and Terms and Conditions for knnekt.studio and
 * score.knnekt.studio, rendered by app/en/[page]/page.tsx. Edit the wording here.
 */

export type Para = string | { lead: string; text: string };

export type Block =
  | { p: Para }
  | { ul: Para[] }
  | { table: { head: string[]; rows: string[][] } };

export type LegalSection = { title: string; blocks: Block[] };

export type LegalDoc = {
  title: string;
  effective: string;
  intro?: string;
  sections: LegalSection[];
  footer: string;
};

export const EFFECTIVE = "1 November 2026";

export const privacyPolicy: LegalDoc = {
  title: "Privacy Policy",
  effective: EFFECTIVE,
  sections: [
    {
      title: "Who we are",
      blocks: [
        {
          p: "Knnekt Studios is a brand of Qolorr Retail Private Limited (CIN U63999DL2024PTC426242), with its registered office at 404, Third Floor, B Block, Silver Oakwood Residency 2, Ward No. 8, Mehrauli, New Delhi 110030 (“Knnekt Studios,” “we,” “us”). Our studio is in Gurugram, Haryana, India. For anything about your personal data, write to hello@knnekt.studio or call +91 91408 45927.",
        },
      ],
    },
    {
      title: "What this policy covers",
      blocks: [
        {
          p: "This policy explains how we handle personal data when you visit knnekt.studio, take the Startup Operating Score at score.knnekt.studio, hear from us by WhatsApp, email or phone, attend a Selection Session, or join a cohort. It doesn’t cover other companies’ websites, even when we link to them.",
        },
      ],
    },
    {
      title: "What we collect",
      blocks: [
        {
          table: {
            head: ["Where it comes from", "What we collect"],
            rows: [
              [
                "The Startup Operating Score",
                "Your name, email, phone number and startup name; your answers about your stage, customers, revenue, team, operations, location, time commitment and readiness to invest",
              ],
              [
                "The contact form",
                "Your name, email, startup, stage, what you’re looking for and your message",
              ],
              [
                "Our website",
                "Pages you visit, how you got there, your device and browser, approximate location, and actions such as starting or completing the score, collected through cookies and similar technologies",
              ],
              [
                "WhatsApp, email and calls",
                "Your phone number and email, the messages we exchange, call notes, and call recordings if you agree to them",
              ],
              [
                "Selection Sessions",
                "Notes from your session and your one-on-one, and our selection decision",
              ],
              [
                "Payments",
                "Your billing details and payment status. Card and bank details are handled by our payment gateway; we don’t store them",
              ],
              [
                "The cohort",
                "Your founder agreement, studio access records, your roadmap, and the business information you share with the studio team during the build",
              ],
              ["Our WhatsApp community", "Your phone number, if you choose to join"],
            ],
          },
        },
        {
          p: "We don’t ask for sensitive information such as health data, biometrics or government ID numbers through the website or the score.",
        },
      ],
    },
    {
      title: "Why we use it",
      blocks: [
        {
          table: {
            head: ["Purpose", "What we use", "Our basis"],
            rows: [
              [
                "To create and send your score report",
                "Your score answers and contact details",
                "Your consent, given when you submit the score",
              ],
              [
                "To call you about your report and invite you to a Selection Session",
                "Contact details, score and report",
                "Your consent",
              ],
              [
                "To send your report, reminders, invitations and payment notices on WhatsApp and email",
                "Phone number and email",
                "Your consent, given in the score form",
              ],
              [
                "To choose who joins a cohort",
                "Score, report, call notes, session notes",
                "Your consent, and the purpose you applied for",
              ],
              [
                "To run the programme, take payments and keep records",
                "Agreement, payment and programme data",
                "Our contract with you, and our legal obligations (tax, company law)",
              ],
              [
                "To improve our calls and scripts",
                "Call recordings, with your agreement",
                "Your consent, asked at the start of each recorded call",
              ],
              [
                "To measure and improve our website and ads",
                "Website and event data",
                "Your consent, through our cookie choices",
              ],
              [
                "To invite you to a future cohort if you weren’t selected",
                "Contact details, score and report",
                "Your consent; you can opt out at any time",
              ],
              [
                "To comply with the law and protect our rights",
                "Whatever the law or the dispute requires",
                "Legal obligation",
              ],
            ],
          },
        },
        {
          p: "You can withdraw your consent at any time by writing to hello@knnekt.studio or replying “STOP” on WhatsApp. Withdrawing doesn’t affect anything we did before, and it may mean we can’t continue with your application.",
        },
      ],
    },
    {
      title: "Cookies, Google Analytics and the Meta pixel",
      blocks: [
        { p: "We use three kinds of cookies and similar technologies:" },
        {
          ul: [
            {
              lead: "Essential:",
              text: "needed for the website and score form to work, for example to save your progress through the form. These are always on.",
            },
            {
              lead: "Analytics:",
              text: "Google Analytics tells us how people use the site, so we can improve it.",
            },
            {
              lead: "Advertising:",
              text: "the Meta pixel, and Meta’s Conversions API, tell us which ads lead people to take the score. When you submit the score, we send Meta a scrambled (hashed) version of your email and phone number with the event, so Meta can match it to an ad. Meta’s own privacy policy applies to what Meta does with it.",
            },
          ],
        },
        {
          p: "Analytics and advertising cookies only run if you accept them in our cookie banner, and you can change your choice at any time from the link in the footer. You can also block cookies in your browser, use Google’s Analytics opt-out browser add-on, or manage ad settings in your Meta account. If you tell us you’re under 18, we don’t send your data to Meta or use it to target ads.",
        },
      ],
    },
    {
      title: "Who we share it with",
      blocks: [
        { p: "We never sell your personal data. We share it only with:" },
        {
          table: {
            head: ["Who", "Why"],
            rows: [
              [
                "Google (Analytics, Gmail, Drive, Calendar)",
                "Website analytics, email, file storage and invitations",
              ],
              ["Meta (ads and WhatsApp)", "Measuring our ads; WhatsApp messaging"],
              ["AiSensy", "Sending our WhatsApp messages"],
              ["Notion", "Keeping our application pipeline"],
              [
                "Anthropic (Claude)",
                "Transcribing and scoring a small number of recorded sales calls",
              ],
              ["Vercel", "Hosting our website and score form"],
              [
                "Our payment gateway",
                "Taking your deposit and instalments. We’ll name the provider here before we take payments online",
              ],
              [
                "Our studio team and vetted partners",
                "Delivering the programme, under confidentiality obligations",
              ],
              ["Investors and guests at Pitch Day", "Only what you choose to present"],
              ["Government or courts", "Only when the law requires it"],
              [
                "A buyer or successor",
                "Only if our business is reorganised or sold, under this same policy",
              ],
            ],
          },
        },
        {
          p: "These companies process data on our behalf and under our instructions, and we expect them to keep it secure.",
        },
      ],
    },
    {
      title: "Call recordings",
      blocks: [
        {
          p: "We record sales calls so we can improve how we run them. At the start of every recorded call we tell you and ask if that’s all right; if you say no, we don’t record, or we delete the recording straight away. Recordings are kept in a restricted folder that only our sales team can open. Each week we have a small number transcribed and scored by an AI tool (Anthropic’s Claude) to coach ourselves. We delete every recording 30 days after your application’s final outcome, and we never share recordings outside our team or use them in advertising.",
        },
      ],
    },
    {
      title: "Founders under 18",
      blocks: [
        {
          p: "Anyone can take the Startup Operating Score. If you’re under 18, we ask you to confirm that a parent or guardian agrees before you submit, and we don’t use your data for ad tracking or targeted advertising. To join a cohort, you need to be 18 or over, or a parent or guardian must sign the founder agreement with you. A parent or guardian can contact us at any time to see, correct or delete their child’s data.",
        },
      ],
    },
    {
      title: "How long we keep it",
      blocks: [
        {
          table: {
            head: ["Data", "How long"],
            rows: [
              [
                "Score data and call notes, if you’re not selected",
                "24 months, so we can invite you to a future cohort; deleted sooner if you ask",
              ],
              ["Contact form messages", "24 months"],
              ["Call recordings", "30 days after your application’s final outcome"],
              [
                "Cohort founders’ records",
                "For the programme, then as long as tax and company law require us to keep financial records",
              ],
              ["Analytics data", "As set in Google Analytics (up to 14 months)"],
            ],
          },
        },
        { p: "When a period ends, we delete the data or remove anything that identifies you." },
      ],
    },
    {
      title: "Where it’s stored",
      blocks: [
        {
          p: "Some of the tools we use store data on servers outside India, including in the United States. We transfer data abroad only as Indian law allows, and to countries the Government of India hasn’t restricted.",
        },
      ],
    },
    {
      title: "Keeping it secure",
      blocks: [
        {
          p: "We limit access to the people who need it, protect our accounts with two-step sign-in, keep recordings and pipeline data in restricted folders, and choose tools with recognised security practices. No system is perfectly secure; if a breach affects your data, we’ll tell you and the authorities as the law requires.",
        },
      ],
    },
    {
      title: "Your rights",
      blocks: [
        { p: "You can ask us to:" },
        {
          ul: [
            "tell you what personal data we hold about you and how we use it",
            "correct, complete or update it",
            "delete it, unless the law requires us to keep it",
            "stop using it, by withdrawing your consent",
            "deal with a complaint about how we’ve handled it",
            "let someone you nominate exercise these rights if you can’t",
          ],
        },
        {
          p: "Write to hello@knnekt.studio. We’ll confirm we’ve received your request and respond within 30 days.",
        },
      ],
    },
    {
      title: "Grievance officer",
      blocks: [
        {
          p: "Grievance Team, Qolorr Retail Private Limited, hello@knnekt.studio, 404, Third Floor, B Block, Silver Oakwood Residency 2, Ward No. 8, Mehrauli, New Delhi 110030. If you’re not satisfied with our response, you can approach the Data Protection Board of India once its complaints process applies.",
        },
      ],
    },
    {
      title: "Changes to this policy",
      blocks: [
        {
          p: "We’ll post any update here with a new effective date, and tell you directly if a change affects how we use the data you’ve already given us.",
        },
      ],
    },
    {
      title: "Disputes",
      blocks: [
        {
          p: "If you have a complaint about how we handle your data, please write to us first; most things can be sorted out quickly. Any dispute about this policy that we can’t resolve is settled by arbitration in Gurugram, Haryana, as set out in section 12 of our Terms and Conditions. This doesn’t affect your right to approach the Data Protection Board of India, a consumer commission, or any other authority the law lets you go to.",
        },
      ],
    },
  ],
  footer: "Read this together with our Terms and Conditions.",
};

export const termsAndConditions: LegalDoc = {
  title: "Terms and Conditions",
  effective: EFFECTIVE,
  sections: [
    {
      title: "About these terms",
      blocks: [
        {
          p: "These terms apply when you use knnekt.studio or score.knnekt.studio, take the Startup Operating Score, or apply to a Knnekt Studios cohort. Knnekt Studios is a brand of Qolorr Retail Private Limited (CIN U63999DL2024PTC426242), with its registered office at 404, Third Floor, B Block, Silver Oakwood Residency 2, Ward No. 8, Mehrauli, New Delhi 110030 (“Knnekt Studios,” “we,” “us”). By using the website or the score, you agree to these terms and to our Privacy Policy. If you don’t agree, please don’t use them.",
        },
      ],
    },
    {
      title: "Using the website",
      blocks: [
        {
          p: "You agree to give us accurate information and to use the website lawfully. You won’t copy or scrape the website, the score or its questions; try to break, overload or get around its security; or use it to send anything harmful or misleading.",
        },
      ],
    },
    {
      title: "The Startup Operating Score and report",
      blocks: [
        {
          p: "The score is free. Your report is based only on your answers and is for your information. It isn’t legal, financial, tax or investment advice, and it doesn’t promise any result. Benchmarks in the report are indicative, based on founders who have taken the score. You can keep and use your report for your own startup. The questions, scoring method and report format belong to us.",
        },
      ],
    },
    {
      title: "Applying to a cohort",
      blocks: [
        {
          p: "Taking the score, our call and a Selection Session are how we choose who joins a cohort. Selection is our decision, and taking the score or attending a session doesn’t guarantee a seat. Each cohort has 15 seats. We decide founders who are working alongside another job case by case.",
        },
      ],
    },
    {
      title: "The cohort",
      blocks: [
        {
          p: "If you’re selected, the cohort is governed by a separate founder agreement that you sign before your seat is confirmed. If anything in these terms conflicts with the founder agreement, the founder agreement applies. In summary:",
        },
        {
          ul: [
            {
              lead: "Fee:",
              text: "₹3,00,000 + GST, the founding price for Cohort 01.",
            },
            {
              lead: "Deposit:",
              text: "₹15,000 + GST, paid within 2–3 days of your decision call. It counts towards the fee and is non-refundable once your seat is held.",
            },
            {
              lead: "Instalments:",
              text: "₹95,000 + GST each on Day 0, Day 31 and Day 45. Nothing is due after Day 45.",
            },
            {
              lead: "Late payment:",
              text: "if an instalment is more than 7 days overdue, build work and studio access may pause until it’s paid.",
            },
            {
              lead: "Studio access:",
              text: "your access card is issued once instalment 1 is received.",
            },
            {
              lead: "30-Day Promise:",
              text: "if the first 30 days don’t feel right, we refund your instalment. You need to have attended the weekly classes, done your roadmap tasks, and asked us in writing by Day 30. The deposit isn’t refunded.",
            },
            {
              lead: "Goal Promise:",
              text: "we set your goal together on Day 10. If we don’t reach it by Day 100, we keep building with you for up to 30 more days, free, on the milestone still pending, provided you attended the weekly classes and did your roadmap tasks.",
            },
            {
              lead: "No promise of funding:",
              text: "we prepare you for investors and grant schemes and bring investors to Pitch Day, but we can’t promise funding, grants, investment, revenue or any other outcome.",
            },
            {
              lead: "Under 18:",
              text: "you can join a cohort if you’re 18 or over, or if a parent or guardian signs the founder agreement with you.",
            },
          ],
        },
      ],
    },
    {
      title: "Intellectual property",
      blocks: [
        {
          p: "The website, the score, our reports, classes, templates and materials, and the Knnekt Studios name and logo belong to us. You may not reuse them without our written permission. Your business, your ideas and the information you share with us stay yours. You allow us to use your score answers to produce your report and run selection. Who owns the work we build together in a cohort is set out in the founder agreement.",
        },
      ],
    },
    {
      title: "Messages and calls",
      blocks: [
        {
          p: "When you submit the score, you agree that we can contact you by phone, WhatsApp and email about your report and your application. We may record calls if you agree at the start of the call. You can stop marketing messages at any time by replying “STOP” on WhatsApp or writing to hello@knnekt.studio; we’ll still send messages you need, such as payment notices, if you’re in a cohort.",
        },
      ],
    },
    {
      title: "Testimonials and results",
      blocks: [
        {
          p: "The founder stories on our website are real, and we name founders only with their consent. Every startup is different; past results don’t predict yours.",
        },
      ],
    },
    {
      title: "Disclaimers and limits on our liability",
      blocks: [
        {
          p: "We provide the website and the score as they are, and we don’t guarantee they’ll always be available or error-free. To the extent the law allows, we aren’t liable for indirect or consequential losses, such as lost profits, lost data or lost opportunities, and our total liability to you is limited to the fees you paid us in the 12 months before the event that gave rise to the claim. Nothing in these terms limits liability that can’t be limited by law.",
        },
      ],
    },
    {
      title: "Indemnity",
      blocks: [
        {
          p: "You agree to cover any loss we suffer because you broke these terms, gave us false information, or misused the website or the score.",
        },
      ],
    },
    {
      title: "Links to other websites",
      blocks: [
        {
          p: "We link to other websites and tools for your convenience. We aren’t responsible for their content or their privacy practices.",
        },
      ],
    },
    {
      title: "Governing law, arbitration and disputes",
      blocks: [
        {
          p: { lead: "12.1 Governing law.", text: "These terms are governed by the laws of India." },
        },
        {
          p: {
            lead: "12.2 Talk to us first.",
            text: "If you have a dispute with us, write to hello@knnekt.studio and tell us what it’s about. We’ll both try in good faith to resolve it within 30 days of your message.",
          },
        },
        {
          p: {
            lead: "12.3 Arbitration.",
            text: "Any dispute arising out of or relating to these terms, the website or the score, including about their existence, validity or termination, that isn’t resolved within those 30 days will be finally resolved by arbitration under the Arbitration and Conciliation Act, 1996 (“the Act”). The arbitration will be ad hoc, not administered by an arbitral institution.",
          },
        },
        {
          p: {
            lead: "12.4 The arbitrators.",
            text: "If the total value of the claims and counterclaims stated in the notice of arbitration and the reply to it is ₹1,00,00,000 (one crore rupees) or less, or can’t be quantified, there will be a sole arbitrator, appointed by agreement between us within 30 days of one of us receiving the notice of arbitration. If the total value is more than ₹1,00,00,000, there will be three arbitrators: each side appoints one within 30 days of the notice of arbitration being received, and those two appoint the presiding arbitrator within 30 days of the second appointment. If an appointment isn’t made in time, either of us may ask the appropriate court to make it under Section 11 of the Act.",
          },
        },
        {
          p: {
            lead: "12.5 Seat, venue and language.",
            text: "The seat and venue of the arbitration is Gurugram, Haryana, India. It will be conducted in English. Hearings may be held online if the tribunal agrees.",
          },
        },
        {
          p: {
            lead: "12.6 Fees and costs.",
            text: "The arbitrators’ fees will follow the Fourth Schedule to the Act. Until the award, each of us pays our own costs and half of the tribunal’s fees and expenses. The tribunal may decide in its award who finally bears the costs.",
          },
        },
        {
          p: {
            lead: "12.7 The award.",
            text: "The award is final and binding on both of us. The proceedings and the award are confidential, except where disclosure is needed to enforce or challenge the award, or the law requires it.",
          },
        },
        {
          p: {
            lead: "12.8 Courts.",
            text: "Subject to this arbitration agreement, the courts in Gurugram, Haryana, have exclusive jurisdiction over any dispute about these terms, including applications for interim relief under Section 9 of the Act and any other application relating to the arbitration. Either of us may ask these courts for urgent interim relief at any time.",
          },
        },
        {
          p: {
            lead: "12.9 Your statutory rights.",
            text: "Nothing in this section stops you from filing a complaint before a consumer commission under the Consumer Protection Act, 2019, or with the Data Protection Board of India, where the law gives you that right.",
          },
        },
        {
          p: {
            lead: "12.10 Cohort disputes.",
            text: "Disputes under a founder agreement are resolved as that agreement sets out.",
          },
        },
      ],
    },
    {
      title: "Changes and contact",
      blocks: [
        {
          p: "We may update these terms; the version on this page, with its effective date, is the one that applies. Questions or complaints: write to our Grievance Team at hello@knnekt.studio or call +91 91408 45927.",
        },
      ],
    },
  ],
  footer: "Read this together with our Privacy Policy.",
};
