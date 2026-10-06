import type { HeroScene } from "./heroScene";
import { $, type Ctx, gsap, INTRO_DONE } from "./shared";

/**
 * The curtain: the crest draws itself while the counter runs to 100, then
 * the loader wipes upward into the hero entrance. Everything is one timeline
 * built up front, so the gsap context can revert it in full.
 */
export function intro({ lenis }: Ctx, scene: HeroScene) {
  const loader = $("[data-loader]");
  const crest = $<SVGUseElement>("[data-loader-logo] [data-draw]");
  const count = $("[data-count]");
  const source = $<SVGPathElement>("[data-logo-source]");

  const done = () => {
    lenis.start();
    document.documentElement.dataset.intro = "done";
    document.documentElement.dispatchEvent(new Event(INTRO_DONE));
  };

  const entrance = gsap
    .timeline()
    .to("[data-hero-big] > span", { yPercent: 0, opacity: 1, duration: 1.8, stagger: 0.12, ease: "expo.out" }, 0)
    .to("[data-hero-title] [data-w]", { yPercent: 0, duration: 1.3, stagger: 0.07, ease: "expo.out" }, 0.35)
    .to("[data-hero-fade]", { opacity: 1, y: 0, duration: 1.1, stagger: 0.1, ease: "power3.out" }, 0.55)
    .fromTo("[data-nav] > *", { y: -30, opacity: 0 }, { y: 0, opacity: 1, duration: 1.1, stagger: 0.08, ease: "expo.out" }, 0.45)
    .add(() => scene.assemble(), 0);

  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!loader || !crest || !count || !source || reduced) {
    if (loader) gsap.set(loader, { display: "none" });
    done();
    return;
  }

  lenis.stop();
  entrance.pause();
  const len = source.getTotalLength();
  const o = { v: 0 };
  gsap.set(crest, { strokeDasharray: len, strokeDashoffset: len, fillOpacity: 0 });
  gsap
    .timeline({ onComplete: done })
    .to(crest, { strokeDashoffset: 0, duration: 1.8, ease: "power2.inOut" }, 0)
    .to(crest, { fillOpacity: 1, duration: 0.8, ease: "power2.out" }, 1.35)
    .to(
      o,
      {
        v: 100,
        duration: 2.3,
        ease: "power2.inOut",
        onUpdate: () => {
          count.textContent = String(Math.round(o.v)).padStart(3, "0");
        },
      },
      0,
    )
    .to("[data-loader-logo]", { scale: 0.86, opacity: 0, duration: 0.6, ease: "power3.in" }, 2.45)
    .to(count, { yPercent: 100, opacity: 0, duration: 0.5, ease: "power3.in" }, 2.45)
    .to(loader, { clipPath: "inset(0% 0% 100% 0%)", duration: 1.1, ease: "expo.inOut" }, 2.8)
    .add(() => {
      entrance.play(0);
    }, 2.95)
    .set(loader, { display: "none" });
}
