import HeroBackground from "./HeroBackground";
import Wordmark from "./Wordmark";
import { containerClass } from "./Container";

export default function Hero() {
  return (
    <header className="bg-darker relative h-svh">
      <div className={`${containerClass} relative z-20 flex h-full items-center justify-between`}>
        <Wordmark className="text-xl text-white sm:text-2xl" />
        <div className="text-right text-xs text-white sm:text-base">
          <p>Let’s rethink tomorrow</p>
          <p className="-mt-1 text-white/50">Strategy. Design. Technology.</p>
        </div>
      </div>
      <HeroBackground />
    </header>
  );
}
