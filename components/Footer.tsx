import Image from "next/image";
import Link from "next/link";
import { containerClass } from "./Container";
import Wordmark from "./Wordmark";

const link = "inline-flex min-h-6 items-center outline-offset-2 outline-dark hover:underline";

export default function Footer() {
  return (
    <footer className="mono-text relative flex flex-col overflow-hidden font-mono">
      <div className={`${containerClass} relative z-10 flex flex-col justify-between gap-x-20 gap-y-10 pt-16 pb-14 md:pb-0`}>
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
                <Link className={link} href="/en#faculty">Faculty</Link>
              </li>
              <li>
                <Link className={link} href="/en#pricing">Pricing</Link>
              </li>
              <li>
                <Link className={link} href="/en/insights">Insights</Link>
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
      </div>
      {/* The picture keeps its own 2100x747 ratio from md up, so nothing is
          cropped — both figures, the books, the print and the dog all stay in
          frame. Its top rows are white, which is what lets it slide up under
          the text on a negative margin and join the page with no visible seam.
          The overlap is a percentage, so it tracks the width: the image is
          35.6% of the width tall, and pulling it up 14% puts the text's last
          rows — socials and the legal links — over the top 39% of the sky,
          which measures 12:1 or better against #141a22. Any deeper and they'd
          reach the blue, where the 50%-opacity legal links stop holding up.
          Below md that ratio leaves a ~140px sliver the floating nav covers, so
          the band is cropped to 4:3, pinned bottom-left to the corner that
          holds all three figures, and sits under the text rather than beneath
          it. */}
      <div className="relative z-0 aspect-[4/3] w-full sm:aspect-[2/1] md:-mt-[14%] md:aspect-auto">
        <Image
          src="/images/footer--clouds.webp"
          alt="Three people at work on marble steps above a bank of clouds"
          width={2100}
          height={747}
          sizes="100vw"
          className="absolute inset-0 h-full w-full select-none object-cover object-left-bottom [mask-image:linear-gradient(to_bottom,transparent_0,#000_9%)] md:static md:h-auto md:object-contain"
          priority={false}
        />
      </div>
    </footer>
  );
}
