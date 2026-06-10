# Visual grammar

Canonical rules for Hollow Ether atmosphere, motion, and UI layers. Global palette and typography: [mystic-monochrome.md](mystic-monochrome.md). Location-specific numbers: [scene-presets.md](scene-presets.md).

## North star

*The world is dark and still; only threads of signal move.*

Every effect must map to **narrative state** (scene, flag, or player action). If it does not, defer it.

## Layers

| Layer | Owner | Act 1 Ether Nexus |
|-------|--------|-------------------|
| **Sky / depth** | WebGL | Particles, fog, bloom, vignette |
| **Presence** | WebGL | Plasma orb in narrative-stage (invitation+) |
| **Signal** | WebGL | Ripple floor pulses on send / scene change |
| **Suspended Narrative Layer (SNL)** | HTML | Dialogue (spirit + player) in session-main |
| **Chrome** | HTML | Input bar, New game, Send |

**SNL** is the dialogue stratum suspended above the world. It is **not** defined by glassmorphism — surface treatment (translucent panel, border, optional blur) is an implementation detail per location.

**Chrome** is separate from SNL: input and navigation sit below the dialogue region.

### Session layout

Three vertical regions — HTML and WebGL must agree:

| Region | Class | Rule |
|--------|-------|------|
| **Header** | `.session-header` | Scene label; sizing unchanged from prior scene-title |
| **Narrative stage** | `.narrative-stage` | ~20vh presence slot; `min(80vw, 1200px)`; characters, tokens, artifacts, images (WebGL orb aligned here for now) |
| **Main** | `.session-main` | Remaining height; same content width; SNL + chrome |

Shared width token: `--layout-content-width`. Stage height: `--layout-stage-height`.

**No overlap:** WebGL presence must render inside the narrative-stage band, not over session-main dialogue. Camera lookAt sits below orb Y — see `client/src/scenes/nexus/stageFraming.ts`.

**Ether Nexus SNL default:** borderless text with text-shadow + soft scrim — not a boxed panel.

### SNL anti-patterns

- Backdrop blur or rgba stacks for their own sake
- 3D text for dynamic LLM dialogue in v1
- Duplicating the same line in WebGL and HTML
- Centered chat panels that stretch to fill the viewport

## Effect budget (on screen at once)

| Tier | Max | Act 1 examples |
|------|-----|----------------|
| Ambient | 2 | Particles + fog |
| Hero | 1 dominant | Ripple floor *or* figure emphasis — awakening hides figure (opacity 0) |
| Accent | 1 | Bloom + vignette count as one post stack |
| Reactive | 1 pulse | Send ripple OR accept closing beat |

## Motion speeds

| Name | Duration | Use |
|------|----------|-----|
| **Breath** | 6–10s | Particle drift, figure idle scale |
| **Turn** | 600ms (`--motion-turn`) | Header + SNL fade; R3F preset lerp |
| **Beat** | 250ms | Send pulse, Act 1 accept bloom |
| **Reveal** | 35ms/char (+ jitter) | Spirit dialogue typewriter in SNL (HTML only; not WebGL effect budget) |

Shared constants: `client/src/theme/motion.ts`.

## Reduced motion and lite preset

When `prefers-reduced-motion: reduce` **or** viewport ≤768px:

- No bloom / vignette
- Reduced particle drift; no ripple pulse animation
- CSS Turn animations disabled

Bloom and vignette tuning is **desktop-primary**; mobile verify focuses on SNL readability and FPS.

## Pre-ship checklist

1. Effect maps to scene, flag, or player action?
2. Within effect budget for this scene?
3. Uses Breath / Turn / Beat timing?
4. SNL readable over canvas (4.5:1 contrast)?
5. Send and New game clickable (`pointer-events` on chrome only)?
6. Presence visible inside narrative-stage, not occluding session-main?
7. Reduced-motion / lite fallback verified?
