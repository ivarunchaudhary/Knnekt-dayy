import Collaboration from "@/components/Collaboration";
import Contact from "@/components/Contact";
import Facts from "@/components/Facts";
import Faculty from "@/components/Faculty";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import Insights from "@/components/Insights";
import Intro from "@/components/Intro";
import Journey from "@/components/Journey";
import Nav from "@/components/Nav";
import Pricing from "@/components/Pricing";
import Services from "@/components/Services";
import Testimonials from "@/components/Testimonials";

export default function HomePage() {
  return (
    <>
      <a
        className="mono-text fixed top-2 left-1/2 z-40 -translate-x-1/2 -translate-y-full rounded-full bg-white px-4 py-2 font-mono opacity-0 ring-1 ring-white ring-offset-2 ring-offset-dark transition outline-none focus-visible:translate-y-0 focus-visible:opacity-100"
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
            <Services />
            <Collaboration />
            <Facts />
            <Journey />
            <Pricing />
            <Faculty />
            <Testimonials />
            <Insights />
            <Contact />
          </main>
        </div>
        <Footer />
      </div>
    </>
  );
}
