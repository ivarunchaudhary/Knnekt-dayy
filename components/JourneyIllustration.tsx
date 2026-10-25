import type { ReactNode } from "react";
import type { JourneyArt } from "@/lib/journeyCalendars";

/*
 * The small drawings on the calendar tiles and the Day 100 cards, one per kind of
 * event, drawn in a 160 × 104 box. They stand in until there are real photos; the
 * `ig-*` classes are their slow loops, which stop under reduced motion.
 */
const art: Record<JourneyArt, ReactNode> = {
  /** Day 0 · Orientation. */
  orientation: (
    <>
      <g transform="translate(56 90) scale(1.15)">
        <path d="M-10 0V-14Q-10 -22 0 -22Q10 -22 10 -14V0Z" fill="#3b81e3" />
        <path d="M7 -15Q14 -26 13 -34" stroke="#3b81e3" strokeWidth="4.5" strokeLinecap="round" fill="none" />
        <circle cx="13" cy="-35" r="2.6" fill="#c88c63" />
        <circle cy="-28" r="6.5" fill="#c88c63" />
        <path d="M-6.5 -29Q-6.5 -36 0 -36Q6.5 -36 7 -30Q3 -33 -2 -32Z" fill="#2b2a35" />
      </g>
      <g transform="translate(104 90) scale(1.15)">
        <path d="M-10 0V-14Q-10 -22 0 -22Q10 -22 10 -14V0Z" fill="#ff7a6b" />
        <path d="M7 -15Q14 -26 13 -34" stroke="#ff7a6b" strokeWidth="4.5" strokeLinecap="round" fill="none" />
        <circle cx="13" cy="-35" r="2.6" fill="#f2c6a0" />
        <circle cy="-28" r="6.5" fill="#f2c6a0" />
        <path d="M-6.5 -29Q-6.5 -36 0 -36Q6.5 -36 7 -30Q3 -33 -2 -32Z" fill="#2b2a35" />
      </g>
      <g className="ig-float">
        <rect x="64" y="14" width="32" height="22" rx="4" fill="#fff" stroke="#8b7cf6" strokeWidth="2.5" />
        <rect x="69" y="20" width="10" height="10" rx="2" fill="#8b7cf6" />
        <rect x="82" y="21" width="10" height="3.5" rx="1.75" fill="#8b7cf6" opacity=".55" />
        <rect x="82" y="27" width="7" height="3" rx="1.5" fill="#8b7cf6" opacity=".35" />
      </g>
      <rect x="28" y="30" width="5" height="5" rx="1.5" fill="#ffc24b" transform="rotate(20 28 30)" className="ig-twinkle" style={{ animationDelay: "0s" }} />
      <rect
        x="132"
        y="24"
        width="5"
        height="5"
        rx="1.5"
        fill="#34c9a0"
        transform="rotate(-15 132 24)"
        className="ig-twinkle"
        style={{ animationDelay: "0.4s" }}
      />
      <rect
        x="124"
        y="54"
        width="5"
        height="5"
        rx="1.5"
        fill="#ff7a6b"
        transform="rotate(35 124 54)"
        className="ig-twinkle"
        style={{ animationDelay: "0.8s" }}
      />
      <rect
        x="36"
        y="56"
        width="5"
        height="5"
        rx="1.5"
        fill="#3b81e3"
        transform="rotate(-30 36 56)"
        className="ig-twinkle"
        style={{ animationDelay: "1.2s" }}
      />
    </>
  ),
  /** Meet the cohort. */
  cohort: (
    <>
      <g transform="translate(36 54) scale(1.0)">
        <path d="M-12 14V4Q-12 -6 0 -6Q12 -6 12 4V14Z" fill="#ff7a6b" />
        <circle cy="-15" r="7" fill="#f2c6a0" />
        <path d="M-7 -16Q-7 -24 0 -24Q7 -24 7.5 -17Q3 -20 -2 -19Z" fill="#2b2a35" />
      </g>
      <g transform="translate(66 50) scale(1.0)">
        <path d="M-12 14V4Q-12 -6 0 -6Q12 -6 12 4V14Z" fill="#34c9a0" />
        <circle cy="-15" r="7" fill="#8e5b3c" />
        <path d="M-7 -16Q-7 -24 0 -24Q7 -24 7.5 -17Q3 -20 -2 -19Z" fill="#2b2a35" />
      </g>
      <g transform="translate(96 50) scale(1.0)">
        <path d="M-12 14V4Q-12 -6 0 -6Q12 -6 12 4V14Z" fill="#3b81e3" />
        <circle cy="-15" r="7" fill="#c88c63" />
        <path d="M-7 -16Q-7 -24 0 -24Q7 -24 7.5 -17Q3 -20 -2 -19Z" fill="#2b2a35" />
      </g>
      <g transform="translate(126 54) scale(1.0)">
        <path d="M-12 14V4Q-12 -6 0 -6Q12 -6 12 4V14Z" fill="#ffc24b" />
        <circle cy="-15" r="7" fill="#f2c6a0" />
        <path d="M-7 -16Q-7 -24 0 -24Q7 -24 7.5 -17Q3 -20 -2 -19Z" fill="#2b2a35" />
      </g>
      <path d="M14 64H146L138 74H22Z" fill="#16253f" />
      <rect x="20" y="74" width="120" height="4" rx="2" fill="#16253f" opacity=".5" />
      <rect x="28" y="78" width="4" height="18" fill="#16253f" opacity=".55" />
      <rect x="128" y="78" width="4" height="18" fill="#16253f" opacity=".55" />
      <rect x="54" y="58" width="16" height="6" rx="1.5" fill="#fff" opacity=".9" />
      <rect x="92" y="58" width="16" height="6" rx="1.5" fill="#fff" opacity=".9" />
      <g className="ig-float">
        <rect x="44" y="10" width="30" height="16" rx="8" fill="#fff" stroke="#34c9a0" strokeWidth="2" />
        <circle cx="53" cy="18" r="1.8" fill="#34c9a0" />
        <circle cx="59" cy="18" r="1.8" fill="#34c9a0" />
        <circle cx="65" cy="18" r="1.8" fill="#34c9a0" />
      </g>
      <rect x="88" y="6" width="30" height="16" rx="8" fill="#3b81e3" className="ig-twinkle" style={{ animationDuration: "2.6s" }} />
      <path d="M97 14h12" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" />
    </>
  ),
  /** Dinner together, the founder dinner, and lunch on Day 100. */
  dinner: (
    <>
      <line x1="52" y1="0" x2="52" y2="12" stroke="#16253f" strokeWidth="1.5" />
      <path d="M43 20Q52 8 61 20Z" fill="#ffc24b" />
      <ellipse cx="52" cy="22" rx="16" ry="5" fill="#ffc24b" opacity=".25" className="ig-pulse" />
      <line x1="108" y1="0" x2="108" y2="12" stroke="#16253f" strokeWidth="1.5" />
      <path d="M99 20Q108 8 117 20Z" fill="#ffc24b" />
      <ellipse cx="108" cy="22" rx="16" ry="5" fill="#ffc24b" opacity=".25" className="ig-pulse" />
      <g transform="translate(34 46) scale(0.95)">
        <path d="M-12 14V4Q-12 -6 0 -6Q12 -6 12 4V14Z" fill="#ff7a6b" />
        <circle cy="-15" r="7" fill="#f2c6a0" />
        <path d="M-7 -16Q-7 -24 0 -24Q7 -24 7.5 -17Q3 -20 -2 -19Z" fill="#2b2a35" />
      </g>
      <g transform="translate(62 44) scale(0.95)">
        <path d="M-12 14V4Q-12 -6 0 -6Q12 -6 12 4V14Z" fill="#3b81e3" />
        <circle cy="-15" r="7" fill="#c88c63" />
        <path d="M-7 -16Q-7 -24 0 -24Q7 -24 7.5 -17Q3 -20 -2 -19Z" fill="#2b2a35" />
      </g>
      <g transform="translate(98 44) scale(0.95)">
        <path d="M-12 14V4Q-12 -6 0 -6Q12 -6 12 4V14Z" fill="#34c9a0" />
        <circle cy="-15" r="7" fill="#8e5b3c" />
        <path d="M-7 -16Q-7 -24 0 -24Q7 -24 7.5 -17Q3 -20 -2 -19Z" fill="#2b2a35" />
      </g>
      <g transform="translate(126 46) scale(0.95)">
        <path d="M-12 14V4Q-12 -6 0 -6Q12 -6 12 4V14Z" fill="#8b7cf6" />
        <circle cy="-15" r="7" fill="#f2c6a0" />
        <path d="M-7 -16Q-7 -24 0 -24Q7 -24 7.5 -17Q3 -20 -2 -19Z" fill="#2b2a35" />
      </g>
      <path d="M10 62H150V70Q150 74 146 74H14Q10 74 10 70Z" fill="#fff" stroke="#16253f" strokeWidth="1.5" />
      <path d="M10 70H150" stroke="#ff7a6b" strokeWidth="3" opacity=".7" />
      <ellipse cx="34" cy="62" rx="9" ry="3.2" fill="#fff" stroke="#16253f" strokeWidth="1.2" />
      <ellipse cx="34" cy="61" rx="5" ry="1.8" fill="#34c9a0" />
      <ellipse cx="62" cy="62" rx="9" ry="3.2" fill="#fff" stroke="#16253f" strokeWidth="1.2" />
      <ellipse cx="62" cy="61" rx="5" ry="1.8" fill="#ffc24b" />
      <ellipse cx="98" cy="62" rx="9" ry="3.2" fill="#fff" stroke="#16253f" strokeWidth="1.2" />
      <ellipse cx="98" cy="61" rx="5" ry="1.8" fill="#ff7a6b" />
      <ellipse cx="126" cy="62" rx="9" ry="3.2" fill="#fff" stroke="#16253f" strokeWidth="1.2" />
      <ellipse cx="126" cy="61" rx="5" ry="1.8" fill="#34c9a0" />
      <ellipse cx="80" cy="60" rx="13" ry="5" fill="#ffc24b" />
      <ellipse cx="80" cy="58" rx="9" ry="3" fill="#ff7a6b" />
      <path d="M43 52H49L48 58H44Z" fill="#ec6aa8" opacity=".8" />
      <line x1="46" y1="58" x2="46" y2="62" stroke="#16253f" strokeWidth="1.2" />
      <path d="M109 52H115L114 58H110Z" fill="#ec6aa8" opacity=".8" />
      <line x1="112" y1="58" x2="112" y2="62" stroke="#16253f" strokeWidth="1.2" />
      <rect x="72" y="46" width="3" height="10" fill="#fff" stroke="#16253f" strokeWidth=".8" />
      <path d="M73.5 46q-2 -4 0 -6q2 2 0 6" fill="#ffc24b" className="ig-twinkle" />
      <rect x="86" y="46" width="3" height="10" fill="#fff" stroke="#16253f" strokeWidth=".8" />
      <path d="M87.5 46q-2 -4 0 -6q2 2 0 6" fill="#ffc24b" className="ig-twinkle" style={{ animationDelay: ".6s" }} />
      <rect x="18" y="74" width="4" height="22" fill="#16253f" opacity=".55" />
      <rect x="138" y="74" width="4" height="22" fill="#16253f" opacity=".55" />
    </>
  ),
  /** Masterclass, every Thursday. */
  masterclass: (
    <>
      <rect x="22" y="14" width="70" height="44" rx="5" fill="#fff" stroke="#16253f" strokeWidth="2.5" />
      <path
        d="M30 49L46.5 38.2L60.5 42.6L84 23"
        fill="none"
        stroke="#ff7a6b"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="ig-draw"
      />
      <g transform="translate(116 70) scale(1.05)">
        <path d="M-10 0V-14Q-10 -22 0 -22Q10 -22 10 -14V0Z" fill="#ff7a6b" />
        <path d="M7 -15Q14 -26 13 -34" stroke="#ff7a6b" strokeWidth="4.5" strokeLinecap="round" fill="none" />
        <circle cx="13" cy="-35" r="2.6" fill="#f2c6a0" />
        <circle cy="-28" r="6.5" fill="#f2c6a0" />
        <path d="M-6.5 -29Q-6.5 -36 0 -36Q6.5 -36 7 -30Q3 -33 -2 -32Z" fill="#2b2a35" />
      </g>
      <rect x="104" y="70" width="24" height="18" rx="3" fill="#16253f" />
      <circle cx="34" cy="90" r="6" fill="#f2c6a0" />
      <path d="M26 99Q34 87 42 99Z" fill="#3b81e3" />
      <circle cx="52" cy="90" r="6" fill="#c88c63" />
      <path d="M44 99Q52 87 60 99Z" fill="#34c9a0" />
      <circle cx="70" cy="90" r="6" fill="#8e5b3c" />
      <path d="M62 99Q70 87 78 99Z" fill="#ffc24b" />
      <circle cx="88" cy="90" r="6" fill="#f2c6a0" />
      <path d="M80 99Q88 87 96 99Z" fill="#8b7cf6" />
    </>
  ),
  /** Saturday: the half day. */
  halfDay: (
    <>
      <circle cx="64" cy="54" r="32" fill="#fff" stroke="#16253f" strokeWidth="3" />
      <path d="M64 54L64 22A32 32 0 0 1 96 54Z" fill="#ffc24b" opacity=".85" />
      <line x1="64" y1="54" x2="64" y2="32" stroke="#16253f" strokeWidth="3.5" strokeLinecap="round" />
      <line x1="64" y1="54" x2="82" y2="54" stroke="#16253f" strokeWidth="3.5" strokeLinecap="round" />
      <circle cx="64" cy="54" r="3.5" fill="#16253f" />
      <rect x="108" y="30" width="30" height="56" rx="3" fill="#fff" stroke="#16253f" strokeWidth="2.5" />
      <path d="M112 33V83L126 79V37Z" fill="#34c9a0" className="ig-door" />
      <text x="123" y="24" textAnchor="middle" fontSize="9" fontWeight="700" fill="#16253f">
        TILL 3
      </text>
    </>
  ),
  /** Sunday: the studio is closed. */
  dayOff: (
    <>
      <path d="M58 22A24 24 0 1 0 82 50A18 18 0 1 1 58 22Z" fill="#8b7cf6" opacity=".85" className="ig-float" />
      <circle cx="98" cy="22" r="1.8" fill="#ffc24b" className="ig-twinkle" style={{ animationDelay: "0s" }} />
      <circle cx="112" cy="38" r="1.8" fill="#ffc24b" className="ig-twinkle" style={{ animationDelay: "0.6s" }} />
      <circle cx="30" cy="40" r="1.8" fill="#ffc24b" className="ig-twinkle" style={{ animationDelay: "1.1s" }} />
      <line x1="104" y1="52" x2="96" y2="62" stroke="#16253f" strokeWidth="2" />
      <line x1="104" y1="52" x2="112" y2="62" stroke="#16253f" strokeWidth="2" />
      <rect x="82" y="62" width="44" height="22" rx="4" fill="#16253f" />
      <text x="104" y="77" textAnchor="middle" fontSize="9" fontWeight="700" fill="#fff" letterSpacing="1">
        CLOSED
      </text>
    </>
  ),
  /** Roadmap Day, Pitch Day, and the pitch to investors. */
  pitch: (
    <>
      <path d="M80 6L46 92H114Z" fill="#fff" opacity=".22" className="ig-pulse" />
      <rect x="92" y="18" width="50" height="32" rx="4" fill="#fff" opacity=".95" stroke="#16253f" strokeWidth="0" />
      <rect x="99" y="36" width="7" height="9" rx="1.5" fill="#ffc24b" />
      <rect x="109" y="30" width="7" height="15" rx="1.5" fill="#34c9a0" />
      <rect x="119" y="24" width="7" height="21" rx="1.5" fill="#ff7a6b" />
      <g transform="translate(70 84) scale(1.15)">
        <path d="M-10 0V-14Q-10 -22 0 -22Q10 -22 10 -14V0Z" fill="#ffc24b" />
        <path d="M7 -15Q14 -26 13 -34" stroke="#ffc24b" strokeWidth="4.5" strokeLinecap="round" fill="none" />
        <circle cx="13" cy="-35" r="2.6" fill="#c88c63" />
        <circle cy="-28" r="6.5" fill="#c88c63" />
        <path d="M-6.5 -29Q-6.5 -36 0 -36Q6.5 -36 7 -30Q3 -33 -2 -32Z" fill="#2b2a35" />
      </g>
      <rect x="20" y="84" width="120" height="8" rx="4" fill="#fff" opacity=".35" />
    </>
  ),
  /** Customer field day. */
  fieldDay: (
    <>
      <rect x="88" y="34" width="54" height="44" rx="3" fill="#fff" stroke="#16253f" strokeWidth="2.5" />
      <path d="M84 34L92 20H138L146 34Z" fill="#ff7a6b" />
      <path
        d="M92 34v5a5 5 0 0 0 10 0v-5M102 34v5a5 5 0 0 0 10 0v-5M112 34v5a5 5 0 0 0 10 0v-5M122 34v5a5 5 0 0 0 10 0v-5"
        fill="#fff"
        stroke="#ff7a6b"
        strokeWidth="1.5"
      />
      <rect x="108" y="56" width="16" height="22" rx="2" fill="#34c9a0" />
      <g transform="translate(46 90) scale(1.1)">
        <path d="M-10 0V-14Q-10 -22 0 -22Q10 -22 10 -14V0Z" fill="#3b81e3" />
        <circle cy="-28" r="6.5" fill="#c88c63" />
        <path d="M-6.5 -29Q-6.5 -36 0 -36Q6.5 -36 7 -30Q3 -33 -2 -32Z" fill="#2b2a35" />
      </g>
      <g transform="translate(70 90) scale(1.0)">
        <path d="M-10 0V-14Q-10 -22 0 -22Q10 -22 10 -14V0Z" fill="#ffc24b" />
        <circle cy="-28" r="6.5" fill="#f2c6a0" />
        <path d="M-6.5 -29Q-6.5 -36 0 -36Q6.5 -36 7 -30Q3 -33 -2 -32Z" fill="#2b2a35" />
      </g>
      <g className="ig-float">
        <rect x="24" y="22" width="40" height="26" rx="13" fill="#3b81e3" />
        <text x="44" y="39" textAnchor="middle" fontSize="12" fontWeight="700" fill="#fff">
          ?
        </text>
      </g>
    </>
  ),
  /** The investor fireside chat. */
  fireside: (
    <>
      <path d="M80 92Q66 78 74 64Q78 72 82 70Q78 58 88 48Q88 62 96 68Q100 78 80 92Z" fill="#ff7a6b" className="ig-float" />
      <path d="M80 92Q74 84 78 76Q82 82 86 80Q88 86 80 92Z" fill="#ffc24b" />
      <rect x="62" y="90" width="36" height="5" rx="2.5" fill="#16253f" />
      <g transform="translate(34 92) scale(1.05)">
        <path d="M-10 0V-14Q-10 -22 0 -22Q10 -22 10 -14V0Z" fill="#3b81e3" />
        <circle cy="-28" r="6.5" fill="#c88c63" />
        <path d="M-6.5 -29Q-6.5 -36 0 -36Q6.5 -36 7 -30Q3 -33 -2 -32Z" fill="#2b2a35" />
      </g>
      <g transform="translate(126 92) scale(1.05)">
        <path d="M-10 0V-14Q-10 -22 0 -22Q10 -22 10 -14V0Z" fill="#34c9a0" />
        <circle cy="-28" r="6.5" fill="#8e5b3c" />
        <path d="M-6.5 -29Q-6.5 -36 0 -36Q6.5 -36 7 -30Q3 -33 -2 -32Z" fill="#2b2a35" />
      </g>
      <rect x="14" y="26" width="38" height="20" rx="10" fill="#fff" stroke="#3b81e3" strokeWidth="2" />
      <rect x="108" y="20" width="40" height="20" rx="10" fill="#fff" stroke="#34c9a0" strokeWidth="2" />
      <circle cx="24" cy="36" r="2" fill="#3b81e3" />
      <circle cx="33" cy="36" r="2" fill="#3b81e3" />
      <circle cx="42" cy="36" r="2" fill="#3b81e3" />
    </>
  ),
  /** AI build hackathon. */
  hackathon: (
    <>
      <rect x="28" y="44" width="40" height="26" rx="3" fill="#fff" stroke="#16253f" strokeWidth="2.5" />
      <rect x="34" y="52" width="10" height="12" rx="2" fill="#3b81e3" />
      <rect x="48" y="52" width="14" height="4" rx="2" fill="#3b81e3" opacity=".5" />
      <rect x="22" y="70" width="52" height="5" rx="2.5" fill="#16253f" />
      <rect x="92" y="44" width="40" height="26" rx="3" fill="#fff" stroke="#16253f" strokeWidth="2.5" />
      <rect x="98" y="52" width="10" height="12" rx="2" fill="#ff7a6b" />
      <rect x="112" y="52" width="14" height="4" rx="2" fill="#ff7a6b" opacity=".5" />
      <rect x="86" y="70" width="52" height="5" rx="2.5" fill="#16253f" />
      <path d="M84 10L70 40H82L76 60L94 28H82Z" fill="#ffc24b" className="ig-twinkle" />
      <rect x="12.0" y="76" width="136" height="6" rx="3" fill="#16253f" />
      <rect x="20.0" y="82" width="4" height="14" fill="#16253f" opacity=".6" />
      <rect x="136.0" y="82" width="4" height="14" fill="#16253f" opacity=".6" />
    </>
  ),
  /** Midpoint demo night. */
  demoNight: (
    <>
      <rect x="40" y="10" width="80" height="46" rx="5" fill="#fff" stroke="#16253f" strokeWidth="2.5" />
      <path
        d="M48 47L68.0 35.3L84.0 39.900000000000006L112 19"
        fill="none"
        stroke="#34c9a0"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="ig-draw"
      />
      <circle cx="30" cy="86" r="6" fill="#f2c6a0" />
      <path d="M22 95Q30 83 38 95Z" fill="#3b81e3" />
      <circle cx="52" cy="86" r="6" fill="#c88c63" />
      <path d="M44 95Q52 83 60 95Z" fill="#ff7a6b" />
      <circle cx="74" cy="86" r="6" fill="#8e5b3c" />
      <path d="M66 95Q74 83 82 95Z" fill="#ffc24b" />
      <circle cx="96" cy="86" r="6" fill="#f2c6a0" />
      <path d="M88 95Q96 83 104 95Z" fill="#8b7cf6" />
      <circle cx="118" cy="86" r="6" fill="#c88c63" />
      <path d="M110 95Q118 83 126 95Z" fill="#34c9a0" />
      <circle cx="140" cy="86" r="6" fill="#8e5b3c" />
      <path d="M132 95Q140 83 148 95Z" fill="#ec6aa8" />
      <rect x="20" y="18" width="5" height="5" rx="1.5" fill="#ffc24b" transform="rotate(20 20 18)" className="ig-twinkle" style={{ animationDelay: "0s" }} />
      <rect
        x="140"
        y="16"
        width="5"
        height="5"
        rx="1.5"
        fill="#ec6aa8"
        transform="rotate(-20 140 16)"
        className="ig-twinkle"
        style={{ animationDelay: "0.4s" }}
      />
      <rect
        x="132"
        y="54"
        width="5"
        height="5"
        rx="1.5"
        fill="#3b81e3"
        transform="rotate(40 132 54)"
        className="ig-twinkle"
        style={{ animationDelay: "0.8s" }}
      />
      <rect x="26" y="56" width="5" height="5" rx="1.5" fill="#ff7a6b" transform="rotate(15 26 56)" className="ig-twinkle" style={{ animationDelay: "1.2s" }} />
    </>
  ),
  /** Mock board meeting. */
  boardMeeting: (
    <>
      <rect x="54" y="8" width="52" height="34" rx="5" fill="#fff" stroke="#16253f" strokeWidth="2.5" />
      <path
        d="M62 33L72.2 26.700000000000003L82.6 30.1L98 17"
        fill="none"
        stroke="#3b81e3"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="ig-draw"
      />
      <circle cx="36" cy="58" r="6" fill="#f2c6a0" />
      <path d="M28 67Q36 55 44 67Z" fill="#ff7a6b" />
      <circle cx="80" cy="54" r="6" fill="#c88c63" />
      <path d="M72 63Q80 51 88 63Z" fill="#16253f" />
      <circle cx="124" cy="58" r="6" fill="#8e5b3c" />
      <path d="M116 67Q124 55 132 67Z" fill="#34c9a0" />
      <path d="M14 72H146L136 88H24Z" fill="#16253f" />
      <rect x="36" y="74" width="16" height="10" rx="2" fill="#fff" opacity=".9" />
      <rect x="72" y="74" width="16" height="10" rx="2" fill="#fff" opacity=".9" />
      <rect x="108" y="74" width="16" height="10" rx="2" fill="#fff" opacity=".9" />
    </>
  ),
  /** Founder offsite. */
  offsite: (
    <>
      <circle cx="122" cy="28" r="14" fill="#ffc24b" className="ig-pulse" style={{ opacity: ".9" }} />
      <path d="M20 92Q60 70 100 92Z" fill="#34c9a0" opacity=".55" />
      <path d="M70 92Q110 64 150 92Z" fill="#34c9a0" />
      <rect x="38" y="58" width="5" height="30" fill="#16253f" />
      <circle cx="40" cy="52" r="14" fill="#34c9a0" />
      <circle cx="32" cy="58" r="9" fill="#34c9a0" />
      <g transform="translate(84 86) scale(1.05)">
        <path d="M-10 0V-14Q-10 -22 0 -22Q10 -22 10 -14V0Z" fill="#ff7a6b" />
        <path d="M7 -15Q14 -26 13 -34" stroke="#ff7a6b" strokeWidth="4.5" strokeLinecap="round" fill="none" />
        <circle cx="13" cy="-35" r="2.6" fill="#f2c6a0" />
        <circle cy="-28" r="6.5" fill="#f2c6a0" />
        <path d="M-6.5 -29Q-6.5 -36 0 -36Q6.5 -36 7 -30Q3 -33 -2 -32Z" fill="#2b2a35" />
      </g>
    </>
  ),
  /** Studio open house. */
  openHouse: (
    <>
      <path d="M30 46L80 14L130 46Z" fill="#8b7cf6" />
      <rect x="38" y="46" width="84" height="44" fill="#fff" stroke="#16253f" strokeWidth="2.5" />
      <rect x="70" y="60" width="20" height="30" rx="2" fill="#ffc24b" className="ig-door" style={{ transformOrigin: "70px 75px" }} />
      <g transform="translate(52 92) scale(0.95)">
        <path d="M-10 0V-14Q-10 -22 0 -22Q10 -22 10 -14V0Z" fill="#3b81e3" />
        <path d="M7 -15Q14 -26 13 -34" stroke="#3b81e3" strokeWidth="4.5" strokeLinecap="round" fill="none" />
        <circle cx="13" cy="-35" r="2.6" fill="#c88c63" />
        <circle cy="-28" r="6.5" fill="#c88c63" />
        <path d="M-6.5 -29Q-6.5 -36 0 -36Q6.5 -36 7 -30Q3 -33 -2 -32Z" fill="#2b2a35" />
      </g>
      <g transform="translate(108 92) scale(0.95)">
        <path d="M-10 0V-14Q-10 -22 0 -22Q10 -22 10 -14V0Z" fill="#ff7a6b" />
        <path d="M7 -15Q14 -26 13 -34" stroke="#ff7a6b" strokeWidth="4.5" strokeLinecap="round" fill="none" />
        <circle cx="13" cy="-35" r="2.6" fill="#f2c6a0" />
        <circle cy="-28" r="6.5" fill="#f2c6a0" />
        <path d="M-6.5 -29Q-6.5 -36 0 -36Q6.5 -36 7 -30Q3 -33 -2 -32Z" fill="#2b2a35" />
      </g>
      <rect x="20" y="30" width="5" height="5" rx="1.5" fill="#34c9a0" transform="rotate(15 20 30)" className="ig-twinkle" style={{ animationDelay: "0s" }} />
      <rect
        x="142"
        y="26"
        width="5"
        height="5"
        rx="1.5"
        fill="#ffc24b"
        transform="rotate(-10 142 26)"
        className="ig-twinkle"
        style={{ animationDelay: "0.6s" }}
      />
    </>
  ),
  /** Investor dry run. */
  dryRun: (
    <>
      <g transform="translate(46 90) scale(1.1)">
        <path d="M-10 0V-14Q-10 -22 0 -22Q10 -22 10 -14V0Z" fill="#ffc24b" />
        <path d="M7 -15Q14 -26 13 -34" stroke="#ffc24b" strokeWidth="4.5" strokeLinecap="round" fill="none" />
        <circle cx="13" cy="-35" r="2.6" fill="#c88c63" />
        <circle cy="-28" r="6.5" fill="#c88c63" />
        <path d="M-6.5 -29Q-6.5 -36 0 -36Q6.5 -36 7 -30Q3 -33 -2 -32Z" fill="#2b2a35" />
      </g>
      <rect x="20" y="20" width="44" height="26" rx="4" fill="#fff" stroke="#16253f" strokeWidth="2.5" />
      <rect x="27" y="28" width="22" height="4" rx="2" fill="#3b81e3" />
      <rect x="27" y="35" width="14" height="4" rx="2" fill="#3b81e3" opacity=".5" />
      <rect x="90" y="22" width="22" height="28" rx="4" fill="#fff" stroke="#34c9a0" strokeWidth="2.5" />
      <text x="101" y="41" textAnchor="middle" fontSize="12" fontWeight="700" fill="#34c9a0">
        8
      </text>
      <rect x="116" y="22" width="22" height="28" rx="4" fill="#fff" stroke="#3b81e3" strokeWidth="2.5" />
      <text x="127" y="41" textAnchor="middle" fontSize="12" fontWeight="700" fill="#3b81e3">
        9
      </text>
      <circle cx="101" cy="74" r="6" fill="#f2c6a0" />
      <path d="M93 83Q101 71 109 83Z" fill="#16253f" />
      <circle cx="127" cy="74" r="6" fill="#8e5b3c" />
      <path d="M119 83Q127 71 135 83Z" fill="#ff7a6b" />
    </>
  ),
  /** Day 100: arrival. */
  arrival: (
    <>
      <path d="M30 96V40Q30 14 56 14H104Q130 14 130 40V96" fill="none" stroke="#16253f" strokeWidth="4" />
      <rect x="44" y="20" width="72" height="16" rx="8" fill="#3b81e3" />
      <text x="80" y="31.5" textAnchor="middle" fontSize="9" fontWeight="700" fill="#fff" letterSpacing="1.5">
        WELCOME
      </text>
      <g className="ig-walk">
        <g transform="translate(80 94) scale(1.2)">
          <path d="M-10 0V-14Q-10 -22 0 -22Q10 -22 10 -14V0Z" fill="#ff7a6b" />
          <circle cy="-28" r="6.5" fill="#f2c6a0" />
          <path d="M-6.5 -29Q-6.5 -36 0 -36Q6.5 -36 7 -30Q3 -33 -2 -32Z" fill="#2b2a35" />
        </g>
        <path d="M74 66L80 76L86 66" fill="none" stroke="#ffc24b" strokeWidth="1.6" />
        <rect x="76" y="75" width="8" height="10" rx="1.5" fill="#fff" stroke="#ffc24b" strokeWidth="1.5" />
      </g>
      <rect x="18" y="30" width="5" height="5" rx="1.5" fill="#ffc24b" transform="rotate(20 18 30)" className="ig-twinkle" style={{ animationDelay: "0s" }} />
      <rect
        x="142"
        y="26"
        width="5"
        height="5"
        rx="1.5"
        fill="#34c9a0"
        transform="rotate(-15 142 26)"
        className="ig-twinkle"
        style={{ animationDelay: "0.5s" }}
      />
      <rect x="140" y="70" width="5" height="5" rx="1.5" fill="#ec6aa8" transform="rotate(30 140 70)" className="ig-twinkle" style={{ animationDelay: "1s" }} />
    </>
  ),
  /** Day 100: final rehearsal. */
  rehearsal: (
    <>
      <path d="M80 6L46 92H114Z" fill="#ffc24b" opacity=".22" className="ig-pulse" />
      <rect x="92" y="18" width="50" height="32" rx="4" fill="#fff" opacity=".95" stroke="#16253f" strokeWidth="2" />
      <rect x="99" y="36" width="7" height="9" rx="1.5" fill="#ffc24b" />
      <rect x="109" y="30" width="7" height="15" rx="1.5" fill="#34c9a0" />
      <rect x="119" y="24" width="7" height="21" rx="1.5" fill="#ff7a6b" />
      <g transform="translate(70 84) scale(1.15)">
        <path d="M-10 0V-14Q-10 -22 0 -22Q10 -22 10 -14V0Z" fill="#ffc24b" />
        <path d="M7 -15Q14 -26 13 -34" stroke="#ffc24b" strokeWidth="4.5" strokeLinecap="round" fill="none" />
        <circle cx="13" cy="-35" r="2.6" fill="#c88c63" />
        <circle cy="-28" r="6.5" fill="#c88c63" />
        <path d="M-6.5 -29Q-6.5 -36 0 -36Q6.5 -36 7 -30Q3 -33 -2 -32Z" fill="#2b2a35" />
      </g>
      <rect x="20" y="84" width="120" height="8" rx="4" fill="#16253f" opacity=".35" />
    </>
  ),
  /** Day 100: networking with the guests. */
  guests: (
    <>
      <g transform="translate(40 94) scale(1.05)">
        <path d="M-10 0V-14Q-10 -22 0 -22Q10 -22 10 -14V0Z" fill="#3b81e3" />
        <circle cy="-28" r="6.5" fill="#c88c63" />
        <path d="M-6.5 -29Q-6.5 -36 0 -36Q6.5 -36 7 -30Q3 -33 -2 -32Z" fill="#2b2a35" />
      </g>
      <g transform="translate(80 92) scale(1.1)">
        <path d="M-10 0V-14Q-10 -22 0 -22Q10 -22 10 -14V0Z" fill="#34c9a0" />
        <circle cy="-28" r="6.5" fill="#8e5b3c" />
        <path d="M-6.5 -29Q-6.5 -36 0 -36Q6.5 -36 7 -30Q3 -33 -2 -32Z" fill="#2b2a35" />
      </g>
      <g transform="translate(120 94) scale(1.05)">
        <path d="M-10 0V-14Q-10 -22 0 -22Q10 -22 10 -14V0Z" fill="#8b7cf6" />
        <circle cy="-28" r="6.5" fill="#f2c6a0" />
        <path d="M-6.5 -29Q-6.5 -36 0 -36Q6.5 -36 7 -30Q3 -33 -2 -32Z" fill="#2b2a35" />
      </g>
      <g className="ig-float">
        <rect x="18" y="14" width="34" height="18" rx="9" fill="#fff" stroke="#3b81e3" strokeWidth="2" />
        <circle cx="28" cy="23" r="1.8" fill="#3b81e3" />
        <circle cx="35" cy="23" r="1.8" fill="#3b81e3" />
        <circle cx="42" cy="23" r="1.8" fill="#3b81e3" />
      </g>
      <rect x="64" y="8" width="34" height="18" rx="9" fill="#34c9a0" />
      <path d="M72 17h18" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" />
      <g className="ig-float" style={{ animationDelay: "-1.4s" }}>
        <rect x="108" y="16" width="34" height="18" rx="9" fill="#fff" stroke="#8b7cf6" strokeWidth="2" />
        <path d="M117 25h16" stroke="#8b7cf6" strokeWidth="2.4" strokeLinecap="round" />
      </g>
    </>
  ),
  /** Day 100: investor conversations. */
  investorTables: (
    <>
      <g transform="translate(46 92) scale(1.05)">
        <path d="M-10 0V-14Q-10 -22 0 -22Q10 -22 10 -14V0Z" fill="#3b81e3" />
        <circle cy="-28" r="6.5" fill="#c88c63" />
        <path d="M-6.5 -29Q-6.5 -36 0 -36Q6.5 -36 7 -30Q3 -33 -2 -32Z" fill="#2b2a35" />
      </g>
      <g transform="translate(114 92) scale(1.05)">
        <path d="M-10 0V-14Q-10 -22 0 -22Q10 -22 10 -14V0Z" fill="#34c9a0" />
        <circle cy="-28" r="6.5" fill="#8e5b3c" />
        <path d="M-6.5 -29Q-6.5 -36 0 -36Q6.5 -36 7 -30Q3 -33 -2 -32Z" fill="#2b2a35" />
      </g>
      <rect x="45.0" y="70" width="70" height="6" rx="3" fill="#16253f" />
      <rect x="53.0" y="76" width="4" height="14" fill="#16253f" opacity=".6" />
      <rect x="103.0" y="76" width="4" height="14" fill="#16253f" opacity=".6" />
      <g className="ig-float">
        <rect x="20" y="16" width="46" height="22" rx="11" fill="#3b81e3" />
        <circle cx="33" cy="27" r="2" fill="#fff" />
        <circle cx="43" cy="27" r="2" fill="#fff" />
        <circle cx="53" cy="27" r="2" fill="#fff" />
      </g>
      <rect x="94" y="22" width="46" height="22" rx="11" fill="#34c9a0" />
      <path d="M108 33l5 5 10-10" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
    </>
  ),
  /** Day 100: networking with investors and operators. */
  networking: (
    <>
      <g transform="translate(40 94) scale(1.05)">
        <path d="M-10 0V-14Q-10 -22 0 -22Q10 -22 10 -14V0Z" fill="#3b81e3" />
        <circle cy="-28" r="6.5" fill="#c88c63" />
        <path d="M-6.5 -29Q-6.5 -36 0 -36Q6.5 -36 7 -30Q3 -33 -2 -32Z" fill="#2b2a35" />
      </g>
      <g transform="translate(80 92) scale(1.1)">
        <path d="M-10 0V-14Q-10 -22 0 -22Q10 -22 10 -14V0Z" fill="#34c9a0" />
        <circle cy="-28" r="6.5" fill="#8e5b3c" />
        <path d="M-6.5 -29Q-6.5 -36 0 -36Q6.5 -36 7 -30Q3 -33 -2 -32Z" fill="#2b2a35" />
      </g>
      <g transform="translate(120 94) scale(1.05)">
        <path d="M-10 0V-14Q-10 -22 0 -22Q10 -22 10 -14V0Z" fill="#8b7cf6" />
        <circle cy="-28" r="6.5" fill="#f2c6a0" />
        <path d="M-6.5 -29Q-6.5 -36 0 -36Q6.5 -36 7 -30Q3 -33 -2 -32Z" fill="#2b2a35" />
      </g>
      <path d="M49 60H55L54 66H50Z" fill="#ec6aa8" />
      <line x1="52" y1="66" x2="52" y2="70" stroke="#16253f" strokeWidth="1.2" />
      <path d="M89 60H95L94 66H90Z" fill="#ec6aa8" />
      <line x1="92" y1="66" x2="92" y2="70" stroke="#16253f" strokeWidth="1.2" />
      <path d="M129 60H135L134 66H130Z" fill="#ec6aa8" />
      <line x1="132" y1="66" x2="132" y2="70" stroke="#16253f" strokeWidth="1.2" />
      <rect x="24" y="18" width="5" height="5" rx="1.5" fill="#ffc24b" transform="rotate(20 24 18)" className="ig-twinkle" style={{ animationDelay: "0s" }} />
      <rect
        x="138"
        y="16"
        width="5"
        height="5"
        rx="1.5"
        fill="#ec6aa8"
        transform="rotate(-20 138 16)"
        className="ig-twinkle"
        style={{ animationDelay: "0.6s" }}
      />
      <g className="ig-float">
        <rect x="18" y="14" width="34" height="18" rx="9" fill="#fff" stroke="#3b81e3" strokeWidth="2" />
        <circle cx="28" cy="23" r="1.8" fill="#3b81e3" />
        <circle cx="35" cy="23" r="1.8" fill="#3b81e3" />
        <circle cx="42" cy="23" r="1.8" fill="#3b81e3" />
      </g>
      <rect x="64" y="8" width="34" height="18" rx="9" fill="#34c9a0" />
      <path d="M72 17h18" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" />
      <g className="ig-float" style={{ animationDelay: "-1.4s" }}>
        <rect x="108" y="16" width="34" height="18" rx="9" fill="#fff" stroke="#8b7cf6" strokeWidth="2" />
        <path d="M117 25h16" stroke="#8b7cf6" strokeWidth="2.4" strokeLinecap="round" />
      </g>
    </>
  ),
  /** Day 100: the celebration. */
  celebration: (
    <>
      <g transform="translate(56 90) scale(1.1)">
        <path d="M-10 0V-14Q-10 -22 0 -22Q10 -22 10 -14V0Z" fill="#ff7a6b" />
        <path d="M7 -15Q14 -26 13 -34" stroke="#ff7a6b" strokeWidth="4.5" strokeLinecap="round" fill="none" />
        <circle cx="13" cy="-35" r="2.6" fill="#f2c6a0" />
        <circle cy="-28" r="6.5" fill="#f2c6a0" />
        <path d="M-6.5 -29Q-6.5 -36 0 -36Q6.5 -36 7 -30Q3 -33 -2 -32Z" fill="#2b2a35" />
      </g>
      <g transform="translate(104 90) scale(1.1)">
        <path d="M-10 0V-14Q-10 -22 0 -22Q10 -22 10 -14V0Z" fill="#3b81e3" />
        <path d="M7 -15Q14 -26 13 -34" stroke="#3b81e3" strokeWidth="4.5" strokeLinecap="round" fill="none" />
        <circle cx="13" cy="-35" r="2.6" fill="#c88c63" />
        <circle cy="-28" r="6.5" fill="#c88c63" />
        <path d="M-6.5 -29Q-6.5 -36 0 -36Q6.5 -36 7 -30Q3 -33 -2 -32Z" fill="#2b2a35" />
      </g>
      <path d="M74 40L80 22L86 40Z" fill="#ffc24b" />
      <rect x="30" y="20" width="5" height="5" rx="1.5" fill="#ffc24b" transform="rotate(20 30 20)" className="ig-twinkle" style={{ animationDelay: "0s" }} />
      <rect
        x="60"
        y="12"
        width="5"
        height="5"
        rx="1.5"
        fill="#34c9a0"
        transform="rotate(-15 60 12)"
        className="ig-twinkle"
        style={{ animationDelay: "0.3s" }}
      />
      <rect
        x="100"
        y="14"
        width="5"
        height="5"
        rx="1.5"
        fill="#ec6aa8"
        transform="rotate(30 100 14)"
        className="ig-twinkle"
        style={{ animationDelay: "0.6s" }}
      />
      <rect
        x="130"
        y="22"
        width="5"
        height="5"
        rx="1.5"
        fill="#3b81e3"
        transform="rotate(-30 130 22)"
        className="ig-twinkle"
        style={{ animationDelay: "0.9s" }}
      />
      <rect x="40" y="46" width="5" height="5" rx="1.5" fill="#8b7cf6" transform="rotate(45 40 46)" className="ig-twinkle" style={{ animationDelay: "1.2s" }} />
      <rect
        x="124"
        y="48"
        width="5"
        height="5"
        rx="1.5"
        fill="#ff7a6b"
        transform="rotate(10 124 48)"
        className="ig-twinkle"
        style={{ animationDelay: "1.5s" }}
      />
    </>
  ),
};

export default function JourneyIllustration({ name }: { name: JourneyArt }) {
  return (
    <svg className="kc-ig" viewBox="0 0 160 104" aria-hidden="true">
      {art[name]}
    </svg>
  );
}
