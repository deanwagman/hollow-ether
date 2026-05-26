# EtherNetic

AI-driven narrative experience on a minimalist, reactive 3D world.

## Development

```bash
npm install
npm run dev
```

Opens the client at `http://localhost:5173` (Vite default).

### Workspaces

| Package | Path | Description |
|---------|------|-------------|
| `@ethernetic/client` | `client/` | React + Three.js (R3F) front-end |
| `@ethernetic/server` | `server/` | Stub — Phase 2+ |

## Phase 1 — Ether Nexus (Act 1 viewport)

- Fixed camera (no orbit controls)
- Layered particles, fog, horizon, static constellation lines ([lore/locations/ether-nexus.md](lore/locations/ether-nexus.md))
- Mystic Monochrome palette ([docs/design/mystic-monochrome.md](docs/design/mystic-monochrome.md))
- Placeholder text input bar (plain CSS, no backend)

Lore and narrative systems live under `lore/`. See `docs/Plan.md` for the full roadmap.

Design tokens and the Mystic Monochrome style guide: `docs/design/mystic-monochrome.md`, `client/src/styles/`, `client/src/theme/tokens.ts`.
