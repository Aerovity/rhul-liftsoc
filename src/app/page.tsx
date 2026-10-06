import { Experience } from "@/components/Experience";
import { LogoDefs } from "@/components/Logo";
import {
  About,
  Committee,
  Den,
  Disciplines,
  Footer,
  Hero,
  Join,
  LiftsMarquee,
  Loader,
  Nav,
  Overlays,
  Sessions,
  TaglineMarquee,
} from "@/components/sections";

export default function Home() {
  return (
    <>
      <LogoDefs />
      {/* without JS there is nothing to lift the curtain, so never draw it */}
      <noscript>
        <style>{"[data-loader]{display:none!important}"}</style>
      </noscript>
      <Loader />
      <Overlays />
      <Nav />
      <main>
        <Hero />
        <LiftsMarquee />
        <About />
        <Disciplines />
        <Den />
        <Sessions />
        <Committee />
        <TaglineMarquee />
        <Join />
      </main>
      <Footer />
      <Experience />
    </>
  );
}
