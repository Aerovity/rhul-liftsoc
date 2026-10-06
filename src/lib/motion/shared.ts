import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type Lenis from "lenis";

gsap.registerPlugin(ScrollTrigger);

export { gsap, ScrollTrigger };

export const $ = <T extends Element = HTMLElement>(sel: string, root: ParentNode = document) =>
  root.querySelector<T>(sel);

export const $$ = <T extends Element = HTMLElement>(sel: string, root: ParentNode = document) =>
  Array.from(root.querySelectorAll<T>(sel));

export const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v));

/** Live values passed between modules (pointer, scroll velocity, hero progress). */
export type Signals = {
  /** pointer target and smoothed value, both in -1…1 */
  tmx: number;
  tmy: number;
  mx: number;
  my: number;
  /** 0…1 through the pinned hero */
  heroP: number;
  heroVis: boolean;
  /** lenis scroll velocity, decayed each frame by the marquee */
  vel: number;
};

export type Ctx = {
  lenis: Lenis;
  signals: Signals;
  /** register teardown work */
  defer: (fn: () => void) => void;
  /** addEventListener that removes itself on teardown */
  on: (
    target: EventTarget,
    type: string,
    fn: (e: never) => void,
    opts?: AddEventListenerOptions,
  ) => void;
  /** true once torn down — async work must check before touching the DOM */
  disposed: () => boolean;
};

/** Fired on <html> once the loader has lifted. */
export const INTRO_DONE = "liftsoc:intro-done";
