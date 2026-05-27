# EtherNetic

AI-driven narrative experience on a minimalist, reactive 3D world.

## Development

```bash
npm install
npm run build:shared   # first time / after editing packages/shared
npm run dev
```

Starts **both** the client and API:

| Service | URL |
|---------|-----|
| App (Vite) | http://localhost:5173 |
| API (proxied) | http://localhost:5173/api/* → Nest on :3000 |

Game state is **server-authoritative** (in-memory sessions). A page refresh starts a new session. Restarting the API clears all sessions.

```bash
curl -X POST http://localhost:5173/api/sessions
# {"sessionId":"...","state":{...}}
```

### Scripts

| Script | Purpose |
|--------|---------|
| `npm run dev` | Client + server |
| `npm run dev:client` | Vite only (game will not load without API) |
| `npm run dev:server` | Nest only |
| `npm run build:shared` | Compile shared game logic |
| `npm run test:shared` | Unit tests for `applyInteract` |
| `npm run build:server` | Shared + Nest build |

After editing mock dialogue in `packages/shared`, run `npm run build:shared` (or keep `tsc -w` running in that package).

### Workspaces

| Package | Path |
|---------|------|
| `@ethernetic/client` | `client/` |
| `@ethernetic/server` | `server/` |
| `@ethernetic/shared` | `packages/shared/` |

## Phase 1 — Ether Nexus (Act 1)

Act 1 Luminia dialogue runs through the sessions API. See [docs/architecture.md](docs/architecture.md) and [lore/chapters/chapter-01.md](lore/chapters/chapter-01.md).

Design tokens: `client/src/styles/`, `client/src/theme/tokens.ts`.
