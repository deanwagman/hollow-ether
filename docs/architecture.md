# EtherNetic architecture

High-level layout for the monorepo. Narrative gameplay currently runs in the client; the server is bootstrapped for future APIs.

## Packages

| Package | Path | Role |
|---------|------|------|
| `@ethernetic/client` | `client/` | React, Three.js (R3F), Zustand game state, mock dialogue |
| `@ethernetic/server` | `server/` | NestJS API (health check today) |

## Development request flow

```text
Browser (localhost:5173)
  ├── /, assets        → Vite dev server (React app)
  ├── /api/*           → Vite proxy → Nest (localhost:3000)
  └── game dialogue    → local mockInteract + Zustand (not via API yet)
```

`npm run dev` starts Vite and Nest together (`concurrently`). In dev, use relative API paths (`fetch('/api/health')`) so the proxy applies.

Direct Nest access (e.g. `curl http://localhost:3000/api/health`) still works when running `dev:server` alone.

## Planned (not implemented)

- **`packages/shared`** — `GameFlags`, `SceneId`, `mockInteract` shared by client and server
- **`POST /api/sessions`** — create session
- **`GET /api/sessions/:id`** — canonical state snapshot
- **`POST /api/sessions/:id/interact`** — player text → spirit lines + flag updates
- **Production static hosting** — Nest serves `client/dist` at `/`, API at `/api`
- **Prisma + Postgres** — persistent sessions and player profiles
- **LLM pipeline** — intent classifier + narrative generator (see `docs/Plan.md` Phase 3)
