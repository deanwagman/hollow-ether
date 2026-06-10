# Ether Nexus

| Field | Value |
|-------|--------|
| **id** | `ether_nexus` |
| **display_name** | Ether Nexus |
| **court** | Court of Ether |
| **spirit** | Luminia |
| **scenes** | `ch1_awakening`, `ch1_invitation`, `ch1_invitation_commit` |

## Description

Empty horizon where threads of the Hollow Ether gather. The Witness awakens here—calm, dark depth, faint signal drift before paths open toward Tide or Thalos.

## Viewport (client)

Palette: [Mystic Monochrome](../../docs/design/mystic-monochrome.md). Presets: [scene-presets.md](../../docs/design/scene-presets.md).

| Element | Spec |
|---------|------|
| Background | Navy `#0C1440` (canvas) |
| Particles | ~280 points, tiered sizes, slow drift |
| Ripple floor | Thread mesh shader; pulses on send / scene change |
| Luminia silhouette | Billboard SVG; hidden in awakening, visible invitation+ |
| Fog | Exponential, scene-driven density |
| Post | Bloom + vignette (lite/reduced-motion off) |
| Camera | Fixed; no orbit |
| UI | [Suspended Narrative Layer](../../docs/design/visual-grammar.md) centered over canvas |

## Presence (Luminia)

| Signal | Viewport |
|--------|----------|
| `ch1_awakening` | Figure hidden; dim particles |
| `ch1_invitation` / commit | Figure visible; brighter preset |
| `luminia_trust` | Brighter particles, faster drift |
| `act1_invitation_accepted` | Complete preset — fade, hold still |

## Audio (future)

Soft chime when signal strengthens.
