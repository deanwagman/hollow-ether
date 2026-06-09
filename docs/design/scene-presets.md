# Scene presets (Ether Nexus — Act 1)

Implementation: [`client/src/theme/presets.ts`](../../client/src/theme/presets.ts).

**Acceptance reference:** [`assets/act1-invitation-midway-demo.png`](../../assets/act1-invitation-midway-demo.png) — compare invitation midway composition side-by-side with the live app.

## Layout

```text
┌─────────────────────────────────────┐
│         session-header              │
│      narrative-stage (20vh)         │  ← presence / orb
│  ┌─────────────────────────────┐    │
│  │ session-main                │    │
│  │  borderless SNL + scrim     │    │
│  │  input bar                  │    │
│  └─────────────────────────────┘    │
└─────────────────────────────────────┘
```

CSS tokens in `client/src/styles/tokens.css`:

- `--layout-stage-height` — narrative-stage height (20vh)
- `--layout-content-width` — `min(80vw, 75rem)` shared by stage and main

WebGL framing: [`client/src/scenes/nexus/stageFraming.ts`](../../client/src/scenes/nexus/stageFraming.ts).

## `resolvePreset(sceneId, flags)`

Returns a `VisualPreset` for the WebGL layer. Order of application:

1. **Base** from `SCENE_PRESETS[sceneId]`
2. **Flag modifiers** (additive)
3. **Complete override** if `flags.act1_invitation_accepted` → `COMPLETE_PRESET` (regardless of `sceneId`)

Player remains on `ch1_invitation_commit` with `inputDisabled: true` after accept; visuals use complete preset.

## Base presets

| SceneId | Particles | Figure | Ripple | Bloom |
|---------|-----------|--------|--------|-------|
| `ch1_awakening` | dim, slow | 0 | subtle idle | low |
| `ch1_invitation` | brighter | ~0.6 | active | medium |
| `ch1_invitation_commit` | peak | ~0.85 | stronger | medium-high |

## Complete override

| Condition | Visual |
|-----------|--------|
| `act1_invitation_accepted` | Fade figure; low bloom; idle ripple hold |

## Flag modifiers

| Flag | Effect |
|------|--------|
| `luminia_trust` | +particle opacity, +drift speed |
| `luminia_warned_door` | +fog density (Turn) |

## Scene change transition (Turn)

1. Dim ambient slightly (optional CSS on SNL)
2. **Beat** — ripple pulse or preset step
3. **Turn** — lerp WebGL preset + fade header / SNL (600ms)

## Reactive beats

| Event | Response |
|-------|----------|
| Interact success | `pulseToken++` → ripple Beat |
| `currentScene` change | Turn lerp to new base preset |
| Accept | Complete override + closing bloom Beat |
