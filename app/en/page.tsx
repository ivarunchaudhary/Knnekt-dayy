import Collaboration from "@/components/Collaboration";
import Contact from "@/components/Contact";
import Culture from "@/components/Culture";
import Facts from "@/components/Facts";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import Intro from "@/components/Intro";
import Nav from "@/components/Nav";
import Services from "@/components/Services";
import Work from "@/components/Work";

export default function HomePage() {
  return (
    <>
      <a
        className="mono-text fixed top-2 left-1/2 z-40 -translate-x-1/2 -translate-y-full rounded-full bg-white px-4 py-2 font-mono opacity-0 ring-1 ring-white ring-offset-2 ring-offset-black transition outline-none focus-visible:translate-y-0 focus-visible:opacity-100"
        href="#main"
      >
        Skip to main content
      </a>
      <div className="bg-white">
        <Nav />
        <div id="main">
          <main>
            <Hero />
            <Intro />
            <Work />
            <Services />
            <Collaboration />
            <Facts />
            <Culture />
            <Contact />
          </main>
        </div>
        <Footer />
      </div>
    </>
  );
}
