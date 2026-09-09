import { founderPortrait } from "@/lib/data";
import Container from "./Container";
import GradientBackground from "./GradientBackground";

export default function Contact() {
  return (
    <Container id="contact" className="pt-20 pb-40 md:py-20">
      <div className="rounded-xl lg:flex lg:justify-between bg-darker relative overflow-hidden text-white lg:aspect-[1/0.5] lg:flex-col">
        <div className="px-4 pt-5 sm:p-8 md:py-10 relative z-10 lg:px-12 lg:py-14">
          <h2 className="font-medium text-2xl md:text-3xl">
            <span className="block text-white/50">Have a project in mind?</span>
            <span className="mt-1 block">Let’s talk about your tomorrow.</span>
          </h2>
        </div>
        <div className="mt-20 md:mt-10 lg:mt-0 relative z-10 grid gap-1.5 lg:grid-cols-12">
          <div className="px-2.5 pb-2.5 sm:px-6 sm:pb-6 md:p-3 lg:col-span-7 lg:col-start-6 lg:pl-0 xl:col-span-6 xl:col-start-7">
            <div className="text-dark rounded-xl bg-white p-4 sm:flex sm:justify-between md:p-2">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                alt="Portrait image of Oliver Ecker"
                loading="lazy" decoding="async"
                width={500}
                height={500}
                className="size-20 rounded-lg sm:order-2 md:size-[10.9375rem]"
                sizes="(min-width: 768px) 10.9375rem, 5rem"
                src={founderPortrait}
              />
              <div className="mt-7 flex flex-col items-start justify-between sm:mt-0 sm:p-3">
                <p>
                  <span className="block">Oliver Ecker</span>
                  <span className="text-dark-very-subtle -mt-0.5 block">Founder &amp; Managing Director</span>
                </p>
                <p className="mt-6">
                  <a className="mono-text group flex items-center gap-5 rounded-full pr-4 font-mono outline-offset-2 outline-black" href="mailto:hi@knnektstudios.com">
                    <span className="rounded-full px-7 py-3 transition-colors lg:px-5 bg-black text-white group-hover:bg-black/80 group-focus-visible:bg-black/80">Get in Touch</span>
                    <span className="text-dark/50 group-hover:text-dark group-focus-visible:text-dark transition-colors">hi@knnektstudios.com</span>
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
        <GradientBackground />
      </div>
    </Container>
  );
}
