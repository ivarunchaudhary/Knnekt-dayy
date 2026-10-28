import Image from "next/image";
import Link from "next/link";
import { CONTACT_PHONE } from "@/lib/contact";
import { containerClass } from "./Container";
import Wordmark from "./Wordmark";

const link = "inline-flex min-h-6 items-center outline-offset-2 outline-dark hover:underline";

export default function Footer() {
  return (
    <footer className="mono-text relative flex flex-col overflow-hidden font-mono">
      <div className={`${containerClass} relative z-10 flex flex-col justify-between gap-x-20 gap-y-10 pt-8 pb-8 md:pt-16 md:pb-12`}>
        {/* On a phone the wordmark and the studio share the first row and the
            two link lists share the next, so the footer is three short rows
            rather than five tall ones. */}
        <div className="grid grid-cols-2 gap-x-4 gap-y-6 md:grid-cols-4 md:gap-x-1.5 md:gap-y-10">
          <div>
            <Wordmark mark className="text-dark text-[2rem]" />
          </div>
          <div className="md:space-y-6">
            <address className="not-italic">
              <span className="flex min-h-6 items-center">Studio</span>
              <span className="text-dark-subtle block">Gurugram</span>
              <span className="text-dark-subtle block">India</span>
              <a className={`text-dark-subtle hover:text-dark ${link}`} href={`tel:${CONTACT_PHONE.tel}`}>{CONTACT_PHONE.display}</a>
            </address>
          </div>
          <nav className="col-span-2 grid grid-cols-2 gap-x-4 md:col-span-1 md:block md:space-y-6">
            <ul>
              <li>
                <a className={link} href="https://www.instagram.com/knnekt.studios/" target="_blank" rel="noopener noreferrer">Instagram</a>
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
                <Link className={`text-dark-subtle hover:text-dark ${link}`} href="/en/terms-and-conditions">Terms &amp; Conditions</Link>
              </li>
              <li>
                {/* Reopens the cookie banner on its settings (components/CookieBanner.tsx), to change or withdraw consent. */}
                <button type="button" data-kc-consent-open className={`text-dark-subtle hover:text-dark cursor-pointer uppercase ${link}`}>
                  Cookie settings
                </button>
              </li>
            </ul>
          </nav>
          <div className="col-span-2 md:col-span-1">
            <p>
              <a className={link} href="mailto:hello@knnekt.studio">hello@knnekt.studio</a>
            </p>
            <p>Knnekt Studios</p>
            <p>Startup Operating Score</p>
            <p className="text-dark-subtle">©{new Date().getFullYear()} All rights reserved</p>
            <p className="text-dark-subtle">Knnekt Studios is operated by Qolorr Retail Pvt Ltd.</p>
          </div>
        </div>
      </div>
      {/* The sign-off, the last words before the picture. It is set in the sans
          because the rest of the footer is mono housekeeping and this is not
          housekeeping — `normal-case` undoes the footer's mono uppercasing. It
          is sized off the container rather than the viewport (`cqi`) so the
          single line always fits the measure it is given — `nowrap` is then
          safe at every width. From md up the picture is pulled up 14% of the
          width, which would otherwise bring the olive tree's crown in behind
          the line; the 15% foot cancels that pull and leaves the line a whole
          percent of clear white to sit on. The tree reaches the picture's top
          edge, so the line stays above it rather than being nudged down into
          the sky. */}
      <div className={`${containerClass} @container relative z-10 pb-4 md:pb-[15%]`}>
        <p className="text-dark text-center font-sans text-[min(4.6cqi,4rem)] leading-none font-medium tracking-tight whitespace-nowrap normal-case">
          Every Startup Needs One Friend
        </p>
      </div>
      {/* The picture runs the full width at its own 2100x750 ratio, so nothing
          is cropped: the four of them, the books, the print and the dog all stay
          in frame. Its top fades in from the page (`.kn-foot-img`), which is
          what lets it slide up under the text on a negative margin from md up
          and join the page with no visible seam. */}
      <div className="kn-foot-art relative z-0 w-full md:-mt-[14%]">
        <Image
          src="/images/footer--team-olive.webp"
          alt="The Knnekt team relaxing on marble steps above the clouds: two sharing a coffee, one reading beneath an olive tree, one throwing a paper plane, a dog asleep beside him"
          width={2100}
          height={750}
          sizes="100vw"
          className="kn-foot-img select-none"
        />
      </div>
    </footer>
  );
}
