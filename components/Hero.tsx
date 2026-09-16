import HeroBackground from "./HeroBackground";
import HeroFog from "./HeroFog";
import Wordmark from "./Wordmark";
import { containerClass } from "./Container";

export default function Hero() {
  return (
    <header className="relative h-svh bg-darker">
      <div className={`${containerClass} relative z-20 flex h-full items-start justify-between pt-[19vh] text-white`}>
        <Wordmark className="text-xl sm:text-2xl" />
        <div className="text-right text-xs sm:text-base">
          <p>India's first Startup Execution Studio</p>
          <p className="-mt-1 text-white/70">Growth. Technology. AI. Legal.</p>
        </div>
      </div>
      <HeroBackground />
      <HeroFog />
    </header>
  );
}
