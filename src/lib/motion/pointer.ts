import { $, $$, clamp, type Ctx, gsap } from "./shared";

/**
 * Feeds the hero scene a -1…1 pointer value (mouse, or device tilt on
 * phones) and drives the difference-blend cursor dot, which swells over
 * anything clickable.
 */
export function cursor(ctx: Ctx) {
  const { on, signals } = ctx;
  on(window, "mousemove", (e: MouseEvent) => {
    signals.tmx = (e.clientX / innerWidth) * 2 - 1;
    signals.tmy = (e.clientY / innerHeight) * 2 - 1;
  });
  gyro(ctx);

  const dot = $("[data-cursor-dot]");
  if (!dot || matchMedia("(hover: none)").matches) return;

  const xTo = gsap.quickTo(dot, "x", { duration: 0.22, ease: "power3" });
  const yTo = gsap.quickTo(dot, "y", { duration: 0.22, ease: "power3" });
  let shown = false;
  on(window, "mousemove", (e: MouseEvent) => {
    xTo(e.clientX);
    yTo(e.clientY);
    if (!shown) {
      shown = true;
      gsap.to(dot, { opacity: 1, duration: 0.3 });
    }
  });

  let big = false;
  on(document, "mouseover", (e: MouseEvent) => {
    const t = (e.target as Element | null)?.closest?.("a,button,[data-card],[data-h-img]");
    if (!!t === big) return;
    big = !!t;
    const s = t ? (t.matches("[data-h-img]") ? 110 : 64) : 12;
    gsap.to(dot, { width: s, height: s, marginLeft: -s / 2, marginTop: -s / 2, duration: 0.45, ease: "expo.out" });
  });
}

function gyro({ on, signals, disposed }: Ctx) {
  if (!matchMedia("(hover: none), (pointer: coarse)").matches || !("DeviceOrientationEvent" in window)) return;
  let b0: number | null = null;
  let g0 = 0;
  const onOrient = (e: DeviceOrientationEvent) => {
    if (e.beta == null || e.gamma == null) return;
    if (b0 === null) {
      b0 = e.beta;
      g0 = e.gamma;
    }
    // slowly re-centre so however you hold the phone becomes neutral
    b0 += (e.beta - b0) * 0.004;
    g0 += (e.gamma - g0) * 0.004;
    signals.tmx = clamp((e.gamma - g0) / 22, -1.4, 1.4);
    signals.tmy = clamp((e.beta - b0) / 22, -1.4, 1.4);
  };
  const listen = () => on(window, "deviceorientation", onOrient);
  const D = DeviceOrientationEvent as unknown as { requestPermission?: () => Promise<string> };
  if (typeof D.requestPermission === "function") {
    // iOS only grants motion access from inside a user gesture
    on(
      window,
      "touchend",
      () => {
        D.requestPermission!()
          .then((s) => s === "granted" && !disposed() && listen())
          .catch(() => {});
      },
      { once: true },
    );
  } else listen();
}

/** Buttons lean toward the pointer and spring back when it leaves. */
export function magnetic({ on }: Ctx) {
  if (!matchMedia("(hover: hover)").matches) return;
  $$("[data-magnetic]").forEach((el) => {
    on(el, "mousemove", (e: MouseEvent) => {
      const r = el.getBoundingClientRect();
      gsap.to(el, {
        x: (e.clientX - r.left - r.width / 2) * 0.32,
        y: (e.clientY - r.top - r.height / 2) * 0.32,
        duration: 0.5,
        ease: "power3.out",
      });
    });
    on(el, "mouseleave", () => gsap.to(el, { x: 0, y: 0, duration: 1, ease: "elastic.out(1,.35)" }));
  });
}
