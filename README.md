# EtherNetic

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

Starts **both** the client and API:

| Service | URL |
|---------|-----|
| App (Vite) | http://localhost:5173 |
| API (proxied) | http://localhost:5173/api/* → Nest on :3000 |
| Postgres | `localhost:5432` (Docker) |

Game state is **server-authoritative** and stored in **PostgreSQL** (Prisma). Restarting the API keeps existing sessions. A browser refresh resumes the same session via `localStorage` (`ethernetic_session_id`). Use **New game** in the UI to start over.

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
| `npm run test:shared` | Unit tests for `applyInteract` |
| `npm run test:server` | Unit tests for LLM demo + narrative + session |
| `npm run build:server` | Shared + Prisma generate + Nest build |
| `npm run prisma:migrate -w server` | Create/apply dev migrations |
| `npm run prisma:generate -w server` | Regenerate Prisma client |

After editing mock dialogue in `packages/shared`, run `npm run build:shared`.

### Act 1 narrative POC (game mode)

Luminia on `/api/sessions/.../interact` with **rules in code** and **optional Bedrock dialogue**.

**Server** (`server/.env`):

```bash
NARRATIVE_PROVIDER=llm    # or mock (default, no AWS)
LLM_PROVIDER=bedrock
AWS_REGION=us-east-2
BEDROCK_MODEL_ID=us.amazon.nova-lite-v1:0
# + AWS credentials
```

**Client:** `VITE_LLM_DEMO=false` in `client/.env.development.local` (game uses sessions, not demo chat).

**Manual checklist** (Act 1 Luminia demo — 3 scenes, no Elara on stage):

| Step | Action | Expected |
|------|--------|----------|
| 1 | New game | Luminia opening line |
| 2 | `"who am I?"` | Natural reply; still awakening |
| 3 | Any second message (e.g. `"tell me more"`) | Scene → invitation + transition beats |
| 4 | Ask about Elara, courts, or send another message | Scene → invitation commit |
| 5 | Push back, then `"I'm ready to listen for Elara"` | Act 1 closing; input disabled |
| 6 | Refresh | Session + history resume |
| 7 | `NARRATIVE_PROVIDER=mock`, restart | Keyword mock; same scene rules |

Step 3 needs **≥2 turns** and orientation from step 2. If stuck in invitation, ask about Elara/courts or send one more message.

After updating game state shape, use **New game** for existing browser sessions.

### LLM demo (AWS Bedrock)

Separate free-form chat when `VITE_LLM_DEMO=true` (see [client/.env.example](client/.env.example)):

1. In [server/.env.example](server/.env.example), copy vars into `server/.env`:
   - `DEMO_LLM_ENABLED=true`
   - `LLM_PROVIDER=bedrock` (or `mock` without AWS)
   - `AWS_REGION`, `BEDROCK_MODEL_ID` (enable the model in the Bedrock console)
2. Ensure AWS credentials (`AWS_PROFILE` or default chain).
3. Create `client/.env.development.local` with `VITE_LLM_DEMO=true` (see [client/.env.example](client/.env.example)).
4. `npm run dev`, then chat in the browser.

Verify without the UI:

```bash
curl http://localhost:5173/api/demo/llm-ping
curl -X POST http://localhost:5173/api/demo/chat \
  -H 'Content-Type: application/json' \
  -d '{"text":"Hello from EtherNetic"}'
```

With `LLM_PROVIDER=mock`, replies are `[mock] Echo: ...` for local testing without AWS.

### Workspaces

| Package | Path |
|---------|------|
| `@ethernetic/client` | `client/` |
| `@ethernetic/server` | `server/` |
| `@ethernetic/shared` | `packages/shared/` |

## Phase 1 — Ether Nexus (Act 1)

Act 1 Luminia dialogue runs through the sessions API. See [docs/architecture.md](docs/architecture.md) and [lore/chapters/chapter-01.md](lore/chapters/chapter-01.md).

Design tokens: `client/src/styles/`, `client/src/theme/tokens.ts`.
