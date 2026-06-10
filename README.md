# Hollow Ether

AI-driven narrative experience on a minimalist, reactive 3D world.

## Development

### First-time setup

```bash
npm install
npm run build:shared
cp server/.env.example server/.env
npm run db:up
npm run prisma:migrate -w server   # applies migrations (or: prisma migrate deploy)
```

### Daily dev

```bash
npm run db:setup       # first time: start Postgres + apply migrations
npm run dev            # starts Postgres (Docker), waits for :5432, then client + server
```

If the server logs `Can't reach database server at localhost:5432`:

1. Ensure **Docker Desktop** is running.
2. Run `npm run db:setup` (or `npm run db:up` then `npm run prisma:deploy -w server`).
3. Run `npm run dev` again.

Vite `proxy error: ECONNREFUSED` on `/api/*` means the API is not up yet—usually because Postgres was not reachable.

| Service | URL |
|---------|-----|
| App (Vite) | http://localhost:5173 |
| API (proxied) | http://localhost:5173/api/* → Nest on :3000 |
| Postgres | `localhost:5432` (Docker) |

Game state is **server-authoritative** and stored in **PostgreSQL** (Prisma). Restarting the API keeps existing sessions. A browser refresh resumes the same session via `localStorage` (`hollow_ether_session_id`). Use **New game** in the UI to start over.

```bash
curl -X POST http://localhost:5173/api/sessions
# {"sessionId":"...","state":{...}}
```

### Scripts

| Script | Purpose |
|--------|---------|
| `npm run dev` | Client + server |
| `npm run dev:client` | Vite only (needs API) |
| `npm run dev:server` | Nest only (needs Postgres + `server/.env`) |
| `npm run db:up` | Start Postgres via Docker Compose |
| `npm run db:ensure` | `db:up` + wait until port 5432 is ready |
| `npm run db:setup` | `db:ensure` + `prisma migrate deploy` |
| `npm run db:down` | Stop Postgres container |
| `npm run build:shared` | Compile shared game logic |
| `npm run test:shared` | Unit tests for shared rules |
| `npm run test:client` | Unit tests for visual presets |
| `npm run test:server` | Unit tests for narrative + session |
| `npm run build:server` | Shared + Prisma generate + Nest build |
| `npm run prisma:migrate -w server` | Create/apply dev migrations |
| `npm run prisma:generate -w server` | Regenerate Prisma client |

After editing mock dialogue in `packages/shared`, run `npm run build:shared`.

### Act 1 — Ether Nexus

Luminia on `/api/sessions/.../interact` with **rules in code** and **optional Bedrock dialogue**. Visual design: [docs/design/visual-grammar.md](docs/design/visual-grammar.md) (Suspended Narrative Layer + scene presets).

**Server** (`server/.env`):

```bash
NARRATIVE_PROVIDER=llm    # or mock (default, no AWS)
LLM_PROVIDER=bedrock
AWS_REGION=us-east-2
BEDROCK_MODEL_ID=us.amazon.nova-lite-v1:0
LLM_MAX_TOKENS=512
# + AWS credentials
```

Remove stale `DEMO_LLM_*` vars from local `server/.env` if present.

**Play checklist** (3 scenes):

| Step | Action | Expected |
|------|--------|----------|
| 1 | New game | Luminia opening; awakening visuals (no figure) |
| 2 | `"who am I?"` | Natural reply; still awakening |
| 3 | Second message (e.g. `"tell me more"`) | → invitation + transition beats |
| 4 | Ask about Elara, courts, or another message | → invitation commit |
| 5 | `"I'm ready to listen for Elara"` | Act 1 closing; input disabled |
| 6 | Refresh | Session + history resume |

**Visual checklist:**

| Step | Expected |
|------|----------|
| Awakening | Dim particles; SNL shows dialogue; no Luminia figure |
| Invitation | Brighter field; figure visible; ripple on send |
| Accept | Closing beat; visuals settle; SNL readable |
| Mobile / reduced motion | Lite preset; no bloom pulses |

Step 3 needs **≥2 turns** and orientation from step 2.

### Workspaces

| Package | Path |
|---------|------|
| `@hollow-ether/client` | `client/` |
| `@hollow-ether/server` | `server/` |
| `@hollow-ether/shared` | `packages/shared/` |

## Phase 1 — Ether Nexus (Act 1)

Act 1 Luminia dialogue runs through the sessions API. See [docs/architecture.md](docs/architecture.md) and [lore/chapters/chapter-01.md](lore/chapters/chapter-01.md).

Design: [docs/design/](docs/design/). Tokens: `client/src/styles/`, `client/src/theme/tokens.ts`.
