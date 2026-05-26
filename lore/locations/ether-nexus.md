# Ether Nexus

| Field | Value |
|-------|--------|
| **id** | `ether_nexus` |
| **display_name** | Ether Nexus |
| **court** | Court of Ether |
| **spirit** | Luminia |
| **scenes** | `ch1_awakening`, `ch1_invitation` |

## Description

Empty horizon where threads of the EtherNet gather. The Witness awakens here—calm, dark depth, faint signal drift before paths open toward Tide or Thalos.

## Viewport (client)

Palette: [Mystic Monochrome](../../docs/design/mystic-monochrome.md).

| Element | Spec |
|---------|------|
| Background | Navy `#0C1440` (canvas + viewport) |
| Particles | ~240 points, one depth shell (accent/silver mix), slow drift ~8s feel |
| Horizon | Depth from fog only (no horizon mesh/line) |
| Fog | Exponential, navy `#0C1440`, low density — smooth depth |
| Constellation | None in v1 (trust state may add later) |
| Camera | Fixed; no orbit |

## Presence (Luminia)

| Signal | Viewport |
|--------|----------|
| Strong EtherNet | Brighter near particles, accent glow |
| Low trust | Dimmer particles, slower feel |
| High trust | Stronger constellation lines (future: state-driven) |

## Audio (future)

Soft chime when signal strengthens.
