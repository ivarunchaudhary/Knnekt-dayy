import Link from "next/link";
import { containerClass } from "./Container";
import Wordmark from "./Wordmark";

const link = "inline-flex min-h-6 items-center outline-offset-2 outline-black hover:underline";

export default function Footer() {
  return (
    <footer className={`${containerClass} mono-text flex flex-col justify-between gap-x-20 gap-y-10 pt-16 pb-32 font-mono md:aspect-video`}>
      <div className="grid gap-x-1.5 gap-y-10 md:grid-cols-4">
        <div>
          <Wordmark className="text-dark text-lg" />
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:block md:space-y-6">
          <address className="not-italic">
            <span className="flex min-h-6 items-center">Studio</span>
            <span className="text-dark-subtle block">Delhi NCR</span>
            <span className="text-dark-subtle block">India</span>
            <span className="text-dark-subtle block">+91 00000 00000</span>
          </address>
        </div>
        <nav className="grid grid-cols-2 sm:grid-cols-3 md:block md:space-y-6">
          <ul>
            <li>
              <Link className={link} href="/en#work">Our Proof</Link>
            </li>
            <li>
              <Link className={link} href="/en#services">Services</Link>
            </li>
            <li>
              <Link className={link} href="/en#about">Execution Studio</Link>
            </li>
            <li>
              <Link className={link} href="/en#contact">Contact</Link>
            </li>
          </ul>
          <ul>
            <li>
              <a className={link} href="https://www.instagram.com/knnektstudios/" target="_blank" rel="noopener noreferrer">Instagram</a>
            </li>
            <li>
              <a className={link} href="https://x.com/knnektstudios" target="_blank" rel="noopener noreferrer">Twitter / X</a>
            </li>
            <li>
              <a className={link} href="https://www.linkedin.com/company/knnekt-studios" target="_blank" rel="noopener noreferrer">LinkedIn</a>
            </li>
          </ul>
          <ul>
            <li>
              <Link className={`text-dark-subtle hover:text-dark ${link}`} href="/en/privacy-policy">Privacy Policy</Link>
            </li>
            <li>
              <Link className={`text-dark-subtle hover:text-dark ${link}`} href="/en/imprint">Imprint</Link>
            </li>
            <li>
              <Link className={`text-dark-subtle hover:text-dark ${link}`} href="/en/terms-and-conditions">Terms &amp; Conditions</Link>
            </li>
          </ul>
        </nav>
        <div>
          <p>
            <a className={link} href="mailto:hello@knnekt.studio">hello@knnekt.studio</a>
          </p>
          <p>Knnekt® — Startup Operating Partner</p>
          <p className="text-dark-subtle">©{new Date().getFullYear()} All rights reserved</p>
        </div>
      </div>
      <svg
        viewBox="0 0 1000 56"
        role="img"
        aria-label="Every startup needs that one friend."
        className="pointer-events-none mt-20 w-full selection:bg-transparent"
      >
        <text
          x="0"
          y="46"
          textLength="1000"
          lengthAdjust="spacingAndGlyphs"
          fontSize="56"
          fontWeight="600"
          letterSpacing="-0.03em"
          className="fill-dark font-sans"
        >
          Every startup needs that one friend.
        </text>
      </svg>
    </footer>
  );
}
