import HeroBackground from "./HeroBackground";
import Wordmark from "./Wordmark";
import { containerClass } from "./Container";

export default function Hero() {
  return (
    <header className="relative h-svh bg-darker">
      <div className={`${containerClass} text-light relative z-20 flex h-full items-center justify-between`}>
        <Wordmark className="text-xl sm:text-2xl" />
        <div className="text-right text-xs sm:text-base">
          <p>India’s first Startup Execution Studio</p>
          <p className="text-light-subtle -mt-1">Growth. Technology. AI. Legal.</p>
        </div>
      </div>
      <HeroBackground />
    </header>
  );
}
