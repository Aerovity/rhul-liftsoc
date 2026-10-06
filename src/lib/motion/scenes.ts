import { $, $$, clamp, type Ctx, gsap, ScrollTrigger } from "./shared";

/** In-page links glide via Lenis; the bar tucks away while scrolling down. */
export function nav({ lenis, on }: Ctx) {
  const bar = $("[data-nav]");
  on(document, "click", (e: MouseEvent) => {
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey) return;
    const a = (e.target as Element | null)?.closest?.<HTMLAnchorElement>('a[href^="#"]');
    if (!a) return;
    const id = a.getAttribute("href")!;
    e.preventDefault();
    if (id === "#top") lenis.scrollTo(0, { duration: 2.2 });
    else {
      const target = $(id);
      if (target) lenis.scrollTo(target, { duration: 1.8 });
    }
  });

  let hidden = false;
  lenis.on("scroll", (e: { scroll: number; direction: number }) => {
    const h = e.scroll > innerHeight * 0.6 && e.direction === 1;
    if (h === hidden) return;
    hidden = h;
    gsap.to(bar, { yPercent: h ? -120 : 0, duration: 0.6, ease: "expo.out" });
  });
}

/** Endless marquees that speed up and lean with scroll velocity. */
export function marquee({ signals, defer }: Ctx) {
  const tracks = $$("[data-marquee-track]");
  const loops = tracks.map((tr) => {
    const r = tr.dataset.dir === "r";
    return gsap.fromTo(tr, { xPercent: r ? -50 : 0 }, { xPercent: r ? 0 : -50, duration: r ? 34 : 28, ease: "none", repeat: -1 });
  });
  const skews = tracks.map((t) => gsap.quickTo(t, "skewX", { duration: 0.5, ease: "power3" }));
  const tick = () => {
    signals.vel *= 0.9;
    const ts = 1 + Math.min(Math.abs(signals.vel) * 0.3, 7);
    loops.forEach((t) => t.timeScale(ts));
    skews.forEach((f) => f(clamp(-signals.vel * 0.5, -14, 14)));
  };
  gsap.ticker.add(tick);
  defer(() => gsap.ticker.remove(tick));
  gsap.to("[data-scroll-tick]", { y: 38, duration: 1.4, repeat: -1, ease: "power2.inOut" });
}

/** Pinned hero: the outline wordmark parts as the crest flies at the camera. */
export function hero({ signals }: Ctx) {
  const sec = $("[data-hero]");
  gsap.set("[data-hero-title] [data-w]", { yPercent: 115 });
  gsap.set("[data-hero-fade]", { opacity: 0, y: 24 });
  gsap.set("[data-hero-big] > span", { yPercent: 40, opacity: 0 });
  gsap.set("[data-nav] > *", { opacity: 0 });
  gsap
    .timeline({
      scrollTrigger: {
        trigger: sec,
        start: "top top",
        end: "bottom bottom",
        scrub: true,
        onUpdate: (s) => {
          signals.heroP = s.progress;
        },
      },
    })
    .to("[data-hero-l]", { xPercent: -45, ease: "none" }, 0)
    .to("[data-hero-r]", { xPercent: 45, ease: "none" }, 0)
    .to("[data-hero-ui]", { opacity: 0, y: -60, ease: "none", duration: 0.3 }, 0);
  ScrollTrigger.create({
    trigger: sec,
    start: "top bottom",
    end: "bottom top",
    onToggle: (s) => {
      signals.heroVis = s.isActive;
    },
  });
}

/** Generic scroll reveals, plus the discipline names sliding in from alternate sides. */
export function reveals() {
  $$("[data-split]").forEach((el) => {
    if (el.dataset.split === "hero") return;
    gsap.from($$("[data-w]", el), { yPercent: 115, duration: 1.25, stagger: 0.04, ease: "expo.out", scrollTrigger: { trigger: el, start: "top 88%" } });
  });
  $$("[data-fade]").forEach((el) =>
    gsap.from(el, { opacity: 0, y: 32, duration: 1.2, ease: "power3.out", scrollTrigger: { trigger: el, start: "top 92%" } }),
  );
  $$("[data-line]").forEach((el) =>
    gsap.from(el, { scaleX: 0, transformOrigin: "0% 50%", duration: 1.5, ease: "expo.inOut", scrollTrigger: { trigger: el, start: "top 94%" } }),
  );
  $$("[data-words]").forEach((el) =>
    gsap.fromTo(
      $$("[data-w]", el),
      { opacity: 0.14 },
      { opacity: 1, stagger: 0.1, ease: "none", scrollTrigger: { trigger: el, start: "top 78%", end: "bottom 50%", scrub: true } },
    ),
  );
  $$("[data-disc]").forEach((row, i) =>
    gsap.from($("[data-disc-name]", row), {
      xPercent: i % 2 ? 18 : -18,
      opacity: 0,
      ease: "none",
      scrollTrigger: { trigger: row, start: "top 98%", end: "top 60%", scrub: 1 },
    }),
  );
}

/** The Den: vertical scroll drives a horizontal gallery. */
export function den({ defer }: Ctx) {
  const sec = $("[data-hscroll]");
  const track = $("[data-h-track]", sec ?? document);
  if (!sec || !track) return;
  const dist = () => Math.max(0, track.scrollWidth - innerWidth);
  const setHeight = () => {
    sec.style.height = `${dist() + innerHeight}px`;
  };
  setHeight();
  ScrollTrigger.addEventListener("refreshInit", setHeight);
  defer(() => {
    ScrollTrigger.removeEventListener("refreshInit", setHeight);
    sec.style.height = "";
  });

  const count = $("[data-h-count]", sec);
  const items = $$("[data-h-img]", sec).length;
  const st = { trigger: sec, start: "top top", end: "bottom bottom", scrub: 0.8, invalidateOnRefresh: true };
  gsap.to(track, {
    x: () => -dist(),
    ease: "none",
    scrollTrigger: {
      ...st,
      onUpdate: (s) => {
        if (count) count.textContent = String(Math.min(items, 1 + Math.floor(s.progress * items))).padStart(2, "0");
      },
    },
  });
  gsap.fromTo("[data-h-bg]", { xPercent: 0 }, { xPercent: -45, ease: "none", scrollTrigger: { ...st } });
  gsap.fromTo("[data-h-bar]", { scaleX: 0 }, { scaleX: 1, ease: "none", scrollTrigger: { ...st } });
  $$("[data-h-img]", sec).forEach((img) =>
    gsap.fromTo(img, { xPercent: 7 }, { xPercent: -7, ease: "none", scrollTrigger: { ...st } }),
  );
}

/** Session cards flip up into place and tilt under the pointer. */
export function cards({ on }: Ctx) {
  gsap.to("[data-live-dot]", { opacity: 0.2, duration: 0.8, repeat: -1, yoyo: true, ease: "sine.inOut" });
  const cd = $("[data-countdown]");
  if (cd) gsap.from(cd, { yPercent: 40, opacity: 0, duration: 1.4, ease: "expo.out", scrollTrigger: { trigger: cd, start: "top 90%" } });

  const tilt = matchMedia("(hover: hover)").matches;
  $$("[data-card]").forEach((c, i) => {
    gsap.from(c, { y: 120, rotateX: -18, opacity: 0, duration: 1.4, delay: i * 0.12, ease: "expo.out", scrollTrigger: { trigger: c, start: "top 92%" } });
    if (!tilt) return;
    on(c, "mousemove", (e: MouseEvent) => {
      const r = c.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      gsap.to(c, { rotateY: x * 10, rotateX: -y * 10, duration: 0.6, ease: "power3.out", transformPerspective: 1100 });
    });
    on(c, "mouseleave", () => gsap.to(c, { rotateY: 0, rotateX: 0, duration: 1.2, ease: "elastic.out(1,.4)" }));
  });
}

/** The silver crest in the join section draws itself as it scrolls in. */
export function joinCrest() {
  const svg = $("[data-join-logo]");
  const crest = $<SVGUseElement>("[data-join-logo] [data-draw]");
  const source = $<SVGPathElement>("[data-logo-source]");
  if (!svg || !crest || !source) return;
  const len = source.getTotalLength();
  gsap.set(crest, { strokeDasharray: len, strokeDashoffset: len, fillOpacity: 0 });
  gsap
    .timeline({ scrollTrigger: { trigger: svg, start: "top 90%", end: "top 30%", scrub: 1 } })
    .to(crest, { strokeDashoffset: 0, ease: "none", duration: 1 }, 0)
    .to(crest, { fillOpacity: 1, ease: "none", duration: 0.4 }, 0.7);
}

/** The giant footer wordmark rises letter by letter. */
export function footer() {
  gsap.fromTo(
    "[data-c]",
    { yPercent: 105 },
    { yPercent: 0, stagger: 0.06, ease: "power3.out", scrollTrigger: { trigger: "[data-footer]", start: "top 85%", end: "bottom bottom", scrub: 1 } },
  );
}

/** Film grain that jitters every third frame. */
export function grain({ defer }: Ctx) {
  const g = $("[data-grain]");
  if (!g) return;
  let f = 0;
  const tick = () => {
    if (++f % 3) return;
    g.style.transform = `translate(${Math.random() * 10 - 5}%,${Math.random() * 10 - 5}%)`;
  };
  gsap.ticker.add(tick);
  defer(() => {
    gsap.ticker.remove(tick);
    g.style.transform = "";
  });
}
