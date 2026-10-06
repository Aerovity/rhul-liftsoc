import { gsap } from "gsap";
import { INTRO_DONE } from "@/lib/motion/shared";

/**
 * The polar bear cub that chases your cursor.
 *
 * Sprite sheet (public/assets/bear/bear.webp) is 13 frames of 160×103: frame
 * 0 is the standing pose, frames 1–12 the run cycle. Every frame faces right
 * with the nose on the same spot, so his head stays steady while his body
 * bounds behind it; facing left is a horizontal flip.
 *
 * Behaviour: he heads for wherever the cursor IS, not the path it took, and
 * he is a little slower than the mouse so he never quite catches it. He
 * pulls up just below the pointer, turns to face it, and stands breathing
 * until it moves away again.
 */

/* Per 60fps frame, scaled by deltaTime, so he runs the same pace at 60Hz and 144Hz. */
const MAX_SPEED = 5.6; // ≈ 336px/s
const EASING = 0.075;
const ARRIVE = 42; // px: closer than this and he stops
const LEAVE = 68; // px: must exceed this to set off again (hysteresis)
const BELOW = 24; // px: he settles this far under the pointer, never on top of it
const STORAGE_KEY = "liftsoc:bear";

const store = {
  get: () => {
    try {
      return localStorage.getItem(STORAGE_KEY);
    } catch {
      return null;
    }
  },
  set: (v: string) => {
    try {
      localStorage.setItem(STORAGE_KEY, v);
    } catch {
      /* private mode: he just won't remember */
    }
  },
};

export function mountBear(root: HTMLElement, toggle: HTMLButtonElement): () => void {
  // pointer-driven and purely decorative: skip on touch and reduced motion
  if (!matchMedia("(hover: hover) and (pointer: fine)").matches) return () => {};
  if (matchMedia("(prefers-reduced-motion: reduce)").matches) return () => {};

  const sprite = root.querySelector<HTMLElement>("[data-bear-sprite]")!;

  // he starts parked bottom-centre and waits for the pointer to move
  let x = innerWidth * 0.5;
  let y = innerHeight - 24;
  let tx = x;
  let ty = y;
  let facing = 1;
  let running = false;
  let hasTarget = false;
  // a stored 'off' must not bail out: the toggle has to exist to bring him back
  let visible = store.get() !== "off";

  const setX = gsap.quickSetter(root, "x", "px") as (v: number) => void;
  const setY = gsap.quickSetter(root, "y", "px") as (v: number) => void;
  setX(x);
  setY(y);

  const face = (dir: number) => {
    if (dir === facing) return;
    facing = dir;
    sprite.style.scale = `${facing} 1`;
  };

  const onMove = (e: PointerEvent) => {
    if (e.pointerType !== "mouse") return;
    tx = e.clientX;
    ty = e.clientY + BELOW;
    hasTarget = true;
  };

  const tick = (_t: number, deltaMs: number) => {
    if (!hasTarget || !visible) return;
    const dt = Math.min(deltaMs / 16.667, 3); // clamp so a stalled tab can't teleport him
    const dx = tx - x;
    const dy = ty - y;
    const dist = Math.hypot(dx, dy);

    // hysteresis stops him twitching between run and stand at the boundary
    if (running && dist < ARRIVE) running = false;
    else if (!running && dist > LEAVE) running = true;

    if (running) {
      // toward where the cursor IS, capped so he can never quite keep up
      const step = Math.min(dist * EASING, MAX_SPEED) * dt;
      x += (dx / dist) * step;
      y += (dy / dist) * step;
      // only flip on decisive horizontal travel, otherwise he flickers
      if (Math.abs(dx) > 14) face(dx < 0 ? -1 : 1);
    } else if (Math.abs(dx) > 24) {
      // standing still, he still turns his head to keep you in view
      face(dx < 0 ? -1 : 1);
    }

    sprite.classList.toggle("is-running", running);
    setX(x);
    setY(y);
  };

  const paint = () => {
    const label = visible ? "Send the bear home" : "Bring the bear back";
    toggle.classList.toggle("is-off", !visible);
    toggle.title = label;
    toggle.setAttribute("aria-label", label);
    toggle.setAttribute("aria-pressed", String(visible));
  };

  const setVisible = (next: boolean) => {
    visible = next;
    store.set(visible ? "on" : "off");
    paint();
    if (visible) {
      // he trots back in from the bottom of the screen
      x = innerWidth * 0.5;
      y = innerHeight + 40;
      running = true;
      setX(x);
      setY(y);
      gsap.to(root, { autoAlpha: 1, duration: 0.35, ease: "power2.out" });
    } else {
      gsap.to(root, { autoAlpha: 0, duration: 0.28, ease: "power2.in" });
    }
  };

  const onToggle = () => setVisible(!visible);
  paint();

  // The toggle waits until the hero's bottom row has faded out, so it never
  // sits on top of the "Scroll" cue.
  let introDone = false;
  let toggleShown = false;
  const syncToggle = () => {
    const want = introDone && scrollY > innerHeight * 0.5;
    if (want === toggleShown) return;
    toggleShown = want;
    gsap.to(toggle, { autoAlpha: want ? 1 : 0, duration: want ? 0.5 : 0.3, ease: "power2.out" });
  };

  // hold back until the loader has lifted, so he doesn't run over the curtain
  const html = document.documentElement;
  const appear = () => {
    introDone = true;
    syncToggle();
    if (visible) gsap.fromTo(root, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.6, ease: "power3.out", delay: 0.6 });
  };
  if (html.dataset.intro === "done") appear();
  else html.addEventListener(INTRO_DONE, appear, { once: true });

  gsap.ticker.add(tick);
  window.addEventListener("pointermove", onMove, { passive: true });
  window.addEventListener("scroll", syncToggle, { passive: true });
  toggle.addEventListener("click", onToggle);

  return () => {
    gsap.ticker.remove(tick);
    window.removeEventListener("pointermove", onMove);
    window.removeEventListener("scroll", syncToggle);
    toggle.removeEventListener("click", onToggle);
    html.removeEventListener(INTRO_DONE, appear);
    gsap.killTweensOf([root, toggle]);
    gsap.set([root, toggle], { clearProps: "all" });
    sprite.classList.remove("is-running");
    sprite.style.scale = "";
  };
}
