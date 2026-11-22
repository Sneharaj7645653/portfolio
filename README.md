# Sneha Raj — 3D Portfolio World

An immersive, **fully 3D** single-world portfolio for Sneha Raj — blending Computer Science & ML depth with outcome-driven Product Strategy, wrapped in an enchanted nature/storybook aesthetic with a **Day (Botanical Sky)** ⟷ **Night (Campfire & Twilight)** toggle.

## Stack

- **React 18** + **Vite**
- **React Three Fiber** (`@react-three/fiber` v8) + **three.js** — the 3D world
- **@react-three/drei** — `Html`, `Sparkles`, `Stars`, `Float`
- **@react-three/postprocessing** — Bloom (glowing fireflies / campfire) + Vignette
- **Tailwind CSS** — CSS-variable semantic tokens driving the HUD's day/night theme
- **Framer Motion** — HUD panel/nav transitions
- **Lucide React** icons

## Getting started

```bash
npm install
npm run dev      # http://localhost:5173
npm run build
npm run preview
```

## How it works

It's **one continuous 3D world**, not separate pages. Five "stations" are laid out along the world; the camera **flies between them** (with gentle mouse parallax) as you navigate. Content is delivered through an elegant DOM **HUD** layered over the canvas, so all text stays crisp, selectable, and accessible.

| # | Station | In-world scene | HUD panel |
|---|---|---|---|
| 1 | **Home** | Girl playing badminton, blossom tree, cat, flowers, floating clouds | Name, pitch, metrics, contact |
| 2 | **CS Realm** | Floating tech crystals over a grove | Software-Dev ⟷ ML/DL toggle, stack, featured project |
| 3 | **Product** | Floating roadmap cards | Competencies + case studies (Problem → Execution) |
| 4 | **Journey** | A real **3D uphill trail** with climbing signposts (labelled in-world), trees & a summit trophy | Milestones + Trail Triumphs |
| 5 | **Sanctuary** | Reading nook under a blossom tree, a crackling campfire, cozy cats | Tabs: Books · Poetry (modal) · Badminton · Sustainability |

Navigate via the **top nav**, the **prev/next arrows**, and switch mood with the **Day/Night toggle** (bottom-center). Night brings a starfield, glowing fireflies, a moon, and a bloom-lit campfire; day brings a blue sky, drifting petals, and clouds.

## Project structure

```
src/
  App.jsx                     # ThemeProvider → World + Hud, shares active-station state
  data.js                     # all content — search "[PLACEHOLDER"
  theme/ThemeContext.jsx      # day/night (localStorage + OS preference)
  three/
    World.jsx                 # Canvas, lighting/fog/sky, camera rig, 5 scenes, postprocessing
    props.jsx                 # low-poly meshes: trees, girl, cat, signpost, campfire, book…
  components/
    Hud.jsx                   # DOM overlay: nav, per-station panels, poem modal, prev/next
    ThemeToggle.jsx  shared.jsx
```

## Notes

- **Content**: everything lives in [src/data.js](src/data.js) (real resume data + a few `[PLACEHOLDER` spots for bio, book titles, sustainability notes; two sample poems included).
- **Performance**: `dpr` is capped and geometry is low-poly; best on a machine with WebGL/GPU. This build is intentionally **3D-only** (no 2D fallback) per the design brief — very old/low-end mobile GPUs may struggle.
- **Verification**: `npm run build` and `npm run preview` both pass. The live WebGL scene should be spot-checked in a browser.
