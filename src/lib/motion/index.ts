import Lenis from "lenis";
import { heroScene } from "./heroScene";
import { intro } from "./intro";
import { cursor, magnetic } from "./pointer";
import { cards, den, footer, grain, hero, joinCrest, marquee, nav, reveals } from "./scenes";
import { type Ctx, gsap, ScrollTrigger, $$, type Signals } from "./shared";

/**
 * Boots smooth scroll and every scroll/pointer effect on the page, and
 * returns a function that undoes all of it (React strict mode mounts twice).
 */
export function startExperience(): () => void {
  const cleanups: Array<() => void> = [];
  let dead = false;

  const lenis = new Lenis({ lerp: 0.085, smoothWheel: true });
  const signals: Signals = { tmx: 0, tmy: 0, mx: 0, my: 0, heroP: 0, heroVis: true, vel: 0 };
  const ctx: Ctx = {
    lenis,
    signals,
    defer: (fn) => cleanups.push(fn),
    on: (target, type, fn, opts) => {
      target.addEventListener(type, fn as EventListener, opts);
      cleanups.push(() => target.removeEventListener(type, fn as EventListener, opts));
    },
    disposed: () => dead,
  };

  if ("scrollRestoration" in history) history.scrollRestoration = "manual";
  window.scrollTo(0, 0);

  lenis.on("scroll", ScrollTrigger.update);
  lenis.on("scroll", (e: Lenis) => {
    signals.vel = e.velocity || 0;
  });
  const raf = (t: number) => lenis.raf(t * 1000);
  gsap.ticker.add(raf);
  gsap.ticker.lagSmoothing(0);

  const scope = gsap.context(() => {
    cursor(ctx);
    magnetic(ctx);
    nav(ctx);
    marquee(ctx);
    hero(ctx);
    reveals();
    den(ctx);
    cards(ctx);
    joinCrest();
    footer();
    grain(ctx);
  });

  const scene = heroScene(ctx);
  scope.add(() => intro(ctx, scene));

  // layout settles as fonts and photos land — re-measure once it has
  let rt = 0;
  const refresh = () => {
    clearTimeout(rt);
    rt = window.setTimeout(() => ScrollTrigger.refresh(), 160);
  };
  document.fonts?.ready.then(() => !dead && refresh());
  $$<HTMLImageElement>("img").forEach((img) => {
    if (!img.complete) ctx.on(img, "load", refresh);
  });
  ctx.on(window, "load", refresh);

  return () => {
    dead = true;
    clearTimeout(rt);
    cleanups.reverse().forEach((fn) => {
      try {
        fn();
      } catch {
        /* keep tearing down */
      }
    });
    scope.revert();
    gsap.ticker.remove(raf);
    lenis.destroy();
  };
}
