# LIFT SOC — RHUL Lifting Society

The website for the Royal Holloway Lifting Society. Next.js (App Router) with
GSAP + ScrollTrigger, Lenis smooth scroll and a three.js chrome crest, plus a
polar bear cub that chases your cursor.

## Run it

Everything runs through [bun](https://bun.sh).

```bash
bun install
bun run dev        # http://localhost:3000
bun run build      # production build (the page is fully static)
bun run start      # serve the build
bun run lint
bun run typecheck
```

## Editing content

Committee names, session times, discipline blurbs, links and the Den photos
all live in [`src/content.ts`](src/content.ts). Session times are London time;
the countdown works them out in `Europe/London` whatever the visitor's timezone.

Photos live in `public/assets/photos/` (WebP, ~1200px on the long side is plenty).

## How it fits together

| Path | What |
| --- | --- |
| `src/components/sections.tsx` | All page markup, server-rendered. Elements carry `data-*` hooks for motion. |
| `src/components/Split.tsx` | Splits headings into word/letter spans at render time, so animation never rewrites React's DOM. |
| `src/components/Logo.tsx` | The crest path ships once in a hidden `<defs>`; every logo `<use>`s it. |
| `src/lib/motion/` | The motion layer: loader and intro, cursor, nav, marquees, reveals, the Den's horizontal scroll, cards, and the three.js hero (`heroScene.ts`, lazy-loaded). `startExperience()` returns a full teardown. |
| `src/lib/bear.ts` + `src/components/BearPet.tsx` | The cursor-chasing bear and its on/off toggle (remembered in `localStorage`). |

### The bear

`public/assets/bear/bear.webp` is a 13-frame sheet (160×103 per frame): frame 0
is the standing pose, frames 1–12 are the run cycle. All frames face right with
the nose on the same spot, so his head stays steady while his body bounds along.
He's shown only on devices with a fine pointer and skipped under
`prefers-reduced-motion`. Size is the `--bear-w` variable in `globals.css`.
