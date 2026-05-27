# EtherNetic

AI-driven narrative experience on a minimalist, reactive 3D world.

## Development

```bash
npm install
npm run dev
```

Starts **both** the client and API:

| Service | URL |
|---------|-----|
| App (Vite) | http://localhost:5173 |
| API (proxied) | http://localhost:5173/api/* → Nest on :3000 |

Gameplay (Act 1 mock) runs in the browser; the server exposes `/api/health` today.

```bash
curl http://localhost:5173/api/health
# {"status":"ok","service":"ethernetic"}
```

### Single-process dev

| Script | Use when |
|--------|----------|
| `npm run dev:client` | Front-end only (no API) |
| `npm run dev:server` | Nest only — http://localhost:3000/api/health |

### Build

- Client: `npm run build`
- Server: `npm run build:server` — run with `npm run start -w server`

### Workspaces

| Package | Path | Description |
|---------|------|-------------|
| `@ethernetic/client` | `client/` | React + Three.js (R3F) front-end |
| `@ethernetic/server` | `server/` | NestJS API |

## Phase 1 — Ether Nexus (Act 1)

- Fixed camera (no orbit controls)
- Particle starfield, Mystic Monochrome palette ([docs/design/mystic-monochrome.md](docs/design/mystic-monochrome.md))
- Act 1 Luminia mock dialogue via Zustand ([lore/chapters/chapter-01.md](lore/chapters/chapter-01.md))

Lore and narrative systems live under `lore/`. See [docs/Plan.md](docs/Plan.md) for the full roadmap and [docs/architecture.md](docs/architecture.md) for API plans.

Design tokens: `client/src/styles/`, `client/src/theme/tokens.ts`.
