# Mystic Monochrome Style Guide

Canonical visual language for EtherNetic. Implemented in `client/src/styles/` and `client/src/theme/tokens.ts`.

## 1. Colour palette

### Base

| Token | Hex | Use |
|-------|-----|-----|
| `base-black` | `#0A0A0A` | Deepest background |
| `base-charcoal` | `#1E1E1E` | Elevated surfaces |
| `base-navy` | `#0C1440` | Depth, viewport background |

### Contrast (text)

| Token | Hex | Use |
|-------|-----|-----|
| `text-primary` | `#F5F5F5` | Primary copy |
| `text-secondary` | `#E0E0E0` | Secondary copy |
| `text-muted` | `#A8ADB8` | Placeholders (≥4.5:1 on navy/charcoal) |

Avoid mid-tone greys that soften contrast.

### Highlight (accent — use sparingly)

| Token | Hex | Use |
|-------|-----|-----|
| `accent` | `#6D7BA6` | Glows, borders, status, focus |
| `accent-muted` | `#AFAFAF` | Secondary glow, silver highlights |

Maintain monochrome feel: one ethereal accent family, not full colour illustrations.

### Surfaces

- Panels: `rgba(0, 0, 0, 0.6)` with subtle accent outline
- Borders: accent at ~35% opacity
- Glow: accent at ~45% opacity, diffuse only

## 2. Typography

| Role | Font | CSS variable | Notes |
|------|------|--------------|-------|
| Headings / UI chrome | **Oxanium** | `--font-display` | Default; **Iceland** is an approved swap for large headings |
| Secondary buttons / nav | **Audiowide** | `--font-nav` | Rounded forms soften chrome |
| Code / data readouts | **Kode Mono** | `--font-mono` | Progress, timers, flags; **Lekton** is alternate |
| Body / dialogue | **Noto Sans** + **Noto Sans JP** | `--font-body` | Cross-language body and narrative |

### Weights and case

- Body: regular/light
- Headings: medium/bold
- No italics or decorative scripts
- Labels and nav: **uppercase** + generous letter-spacing
- Consistent leading on body copy

## 3. Layout and geometry

- Strong grid, generous negative space
- Angular motifs (hexagons, triangles, thin bars) — outlined, not filled
- Translucent dark panels with optional subtle grain (future)
- Accent outline for panel separation

## 4. Effects and motion

- Soft halos on interactive elements — no intense neon
- Slow horizontal scan or border pulse (5–10s per cycle)
- Transitions: fades and short slides; no harsh zoom/rotate on UI
- Respect `prefers-reduced-motion` (disable scan/pulse)

## 5. Icons and UI elements

- Outline icons, 1–2px stroke, white or accent
- Buttons: dark fill, 1px glowing outline, uppercase centred label; hover = slight glow expand/pulse
- Inputs: thin border, pale grey placeholder; focus = accent glow

## 6. Imagery and backgrounds

- Solid darks or subtle gradients (darker toward bottom)
- Barely perceptible patterns only
- Illustrations: monochrome line art / silhouettes

## 7. Accessibility

- Minimum **4.5:1** contrast for text on backgrounds
- Never use accent colour as the only differentiator — pair with label or icon
- Test focus states and reduced-motion preferences

## 8. Three.js / viewport

Canvas colours mirror CSS via `client/src/theme/tokens.ts`:

- Background: navy → black gradient feel (`#0C1440` / `#0A0A0A`)
- Accent light: `#6D7BA6`
- Hero mesh: silver/pewter (`#AFAFAF`), not gold
