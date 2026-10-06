import type { Group } from "three";
import { LOGO_PATH, LOGO_VIEWBOX } from "@/lib/logo";
import { $, clamp, type Ctx, gsap } from "./shared";

export type HeroScene = { assemble: () => void };

/** Polished (0.1) or brushed (0.36) chrome. */
const ROUGHNESS = 0.1;

/**
 * The crest as extruded chrome: every shape of the logo is its own piece,
 * so the intro can fly them in from scattered positions. Scroll through the
 * hero spins the crest a full turn and dollies the camera into it.
 *
 * three.js is loaded lazily so it never blocks first paint.
 */
export function heroScene({ signals, defer, disposed }: Ctx): HeroScene {
  let pieces: Group[] | null = null;
  let wantAssemble = false;

  const assemble = () => {
    if (!pieces) {
      wantAssemble = true;
      return;
    }
    pieces.forEach((pc, i) => {
      const h = pc.userData.home as { x: number; y: number; z: number };
      const delay = 0.15 + i * 0.045;
      pc.position.set(h.x + (Math.random() - 0.5) * 9, h.y + (Math.random() - 0.5) * 6, h.z + 3 + Math.random() * 4);
      pc.rotation.set((Math.random() - 0.5) * 6, (Math.random() - 0.5) * 6, (Math.random() - 0.5) * 6);
      gsap.to(pc.position, { x: h.x, y: h.y, z: h.z, duration: 2.6, delay, ease: "expo.out" });
      gsap.to(pc.rotation, { x: 0, y: 0, z: 0, duration: 2.8, delay, ease: "expo.out" });
      gsap.to(pc.scale, { x: 1, y: 1, z: 1, duration: 1.8, delay, ease: "expo.out" });
    });
  };

  const canvas = $<HTMLCanvasElement>("[data-gl]");
  if (canvas) build(canvas);

  async function build(canvas: HTMLCanvasElement) {
    let THREE: typeof import("three");
    let SVGLoader: typeof import("three/addons/loaders/SVGLoader.js").SVGLoader;
    try {
      [THREE, { SVGLoader }] = await Promise.all([import("three"), import("three/addons/loaders/SVGLoader.js")]);
    } catch (err) {
      console.warn("[liftsoc] three.js failed to load", err);
      return;
    }
    if (disposed()) return;

    const host = canvas.parentElement!;
    let renderer: InstanceType<typeof THREE.WebGLRenderer>;
    try {
      renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: "high-performance" });
    } catch {
      return; // no WebGL: the outline wordmark carries the hero alone
    }
    renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;
    renderer.outputColorSpace = THREE.SRGBColorSpace;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(32, 1, 0.05, 100);

    // a dark studio with a few bright softboxes, baked into the reflections
    const pmrem = new THREE.PMREMGenerator(renderer);
    const studio = new THREE.Scene();
    studio.add(new THREE.Mesh(new THREE.BoxGeometry(40, 40, 40), new THREE.MeshBasicMaterial({ color: 0x030303, side: THREE.BackSide })));
    const panel = (w: number, h: number, p: [number, number, number], v: number) => {
      const m = new THREE.MeshBasicMaterial({ color: 0xffffff, side: THREE.DoubleSide });
      m.color.setScalar(v);
      const mesh = new THREE.Mesh(new THREE.PlaneGeometry(w, h), m);
      mesh.position.set(...p);
      mesh.lookAt(0, 0, 0);
      studio.add(mesh);
    };
    panel(22, 2.2, [0, 11, 3], 7);
    panel(1.4, 16, [-10, 0, 4], 5);
    panel(1.2, 16, [10, 1, -2], 4);
    panel(12, 1, [0, -7, -10], 3);
    panel(7, 7, [4, 4, 12], 1.6);
    panel(0.7, 12, [-5, 0, -11], 6);
    panel(0.5, 12, [6, -1, 11], 3);
    const envRT = pmrem.fromScene(studio, 0.035);
    scene.environment = envRT.texture;

    const mat = new THREE.MeshStandardMaterial({ color: 0xffffff, metalness: 1, roughness: ROUGHNESS });
    const group = new THREE.Group();
    scene.add(group);

    const S = 0.0165;
    const CX = 119;
    const CY = 158;
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${LOGO_VIEWBOX}"><path fill="#fff" fill-rule="evenodd" d="${LOGO_PATH}"/></svg>`;
    const shapes = new SVGLoader().parse(svg).paths.flatMap((p) => p.toShapes());
    const built: Group[] = shapes.map((shape, i) => {
      const g = new THREE.ExtrudeGeometry(shape, {
        depth: 11,
        bevelEnabled: true,
        bevelThickness: 1.4,
        bevelSize: 0.55,
        bevelSegments: 3,
        curveSegments: 8,
      });
      g.computeBoundingBox();
      const c = new THREE.Vector3();
      g.boundingBox!.getCenter(c);
      g.translate(-c.x, -c.y, -c.z);
      const mesh = new THREE.Mesh(g, mat);
      mesh.scale.set(S, -S, S);
      const pc = new THREE.Group();
      pc.add(mesh);
      const z = (((i * 7) % 5) - 2) * 0.04;
      const hx = (c.x - CX) * S;
      const hy = -(c.y - CY) * S;
      pc.position.set(hx, hy, z);
      pc.userData.home = { x: hx, y: hy, z };
      pc.scale.setScalar(0.001);
      group.add(pc);
      return pc;
    });

    // drifting dust for depth
    const N = 1100;
    const pos = new Float32Array(N * 3);
    for (let i = 0; i < N; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 18;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 11;
      pos[i * 3 + 2] = -8 + Math.random() * 10;
    }
    const dustGeo = new THREE.BufferGeometry();
    dustGeo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    const dust = new THREE.Points(
      dustGeo,
      new THREE.PointsMaterial({ color: 0xffffff, size: 0.018, transparent: true, opacity: 0.5, depthWrite: false }),
    );
    scene.add(dust);

    pieces = built;
    if (wantAssemble) assemble();

    // keep the crest framed at any aspect ratio
    let baseZ = 10;
    const resize = () => {
      const w = host.clientWidth;
      const h = host.clientHeight;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      const t = Math.tan(THREE.MathUtils.degToRad(16));
      baseZ = Math.max(4.1 / t, 3.4 / (t * camera.aspect));
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(host);

    const ease = (x: number) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2);
    const t0 = performance.now();
    let raf = 0;
    const loop = () => {
      raf = requestAnimationFrame(loop);
      if (!signals.heroVis) return;
      const t = (performance.now() - t0) / 1000;
      const p = signals.heroP || 0;
      const e = ease(p);
      signals.mx += (signals.tmx - signals.mx) * 0.05;
      signals.my += (signals.tmy - signals.my) * 0.05;
      group.rotation.y = signals.mx * 0.42 + e * Math.PI * 2 + Math.sin(t * 0.45) * 0.07;
      group.rotation.x = signals.my * 0.22 + Math.sin(t * 0.32) * 0.04;
      group.position.y = 0.55 + Math.sin(t * 0.9) * 0.05;
      camera.position.z = baseZ * (1 - e * 0.86);
      camera.position.x = -signals.mx * 0.25;
      camera.position.y = signals.my * 0.15;
      camera.lookAt(0, 0.1, 0);
      dust.rotation.y = t * 0.015 + signals.mx * 0.08;
      dust.position.y = Math.sin(t * 0.2) * 0.2;
      canvas.style.opacity = String(1 - clamp((p - 0.72) / 0.26, 0, 1));
      renderer.render(scene, camera);
    };
    loop();

    defer(() => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      built.forEach((pc) => gsap.killTweensOf([pc.position, pc.rotation, pc.scale]));
      scene.traverse((o) => {
        const m = o as { geometry?: { dispose(): void } };
        m.geometry?.dispose();
      });
      mat.dispose();
      envRT.dispose();
      pmrem.dispose();
      renderer.dispose();
      canvas.style.opacity = "";
      pieces = null;
    });
  }

  return { assemble };
}
