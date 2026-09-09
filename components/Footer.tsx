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
            <span className="flex min-h-6 items-center">CGN Office</span>
            <span className="text-dark-subtle block">Brüsseler Str. 92</span>
            <span className="text-dark-subtle block">50672 Köln</span>
            <span className="text-dark-subtle block">Germany</span>
          </address>
        </div>
        <nav className="grid grid-cols-2 sm:grid-cols-3 md:block md:space-y-6">
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
              <Link className={`text-dark-subtle hover:text-dark ${link}`} href="/en/privacy-policy">Datenschutzerklärung</Link>
            </li>
            <li>
              <Link className={`text-dark-subtle hover:text-dark ${link}`} href="/en/imprint">Impressum</Link>
            </li>
            <li>
              <Link className={`text-dark-subtle hover:text-dark ${link}`} href="/en/terms-and-conditions">AGB</Link>
            </li>
          </ul>
        </nav>
        <div>
          <p>
            <a className={link} href="mailto:info@knnektstudios.com">info@knnektstudios.com</a>
          </p>
          <p>Knnekt Studios GmbH</p>
          <p className="text-dark-subtle">{new Date().getFullYear()} All rights reserved</p>
        </div>
      </div>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img alt="Let’s rethink tomorrow" loading="lazy" width={1000} height={56} className="pointer-events-none mt-20 w-full selection:bg-transparent" src="/images/claim.svg" />
    </footer>
  );
}
