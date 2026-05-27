# EtherNetic architecture

High-level layout for the monorepo. **Canonical game state** lives on the server per `sessionId`, persisted in **PostgreSQL** via **Prisma**; the client mirrors it via TanStack Query.

## Packages

| Package | Path | Role |
|---------|------|------|
| `@ethernetic/shared` | `packages/shared/` | Types, `mockInteract`, `createInitialSession`, `applyInteract` |
| `@ethernetic/client` | `client/` | React, R3F, TanStack Query, UI |
| `@ethernetic/server` | `server/` | NestJS sessions API + Prisma |

## Development request flow

```text
Browser (localhost:5173)
  ├── /, assets              → Vite
  ├── /api/sessions          → Vite proxy → Nest → Prisma → Postgres
  ├── /api/sessions/:id/interact → same
  └── TanStack Query cache   → mirrors server GameState in UI
```

`npm run dev` starts Vite and Nest. Postgres runs via `npm run db:up` (Docker Compose).

**Sessions survive API restart** (same `sessionId` in DB). The browser stores `sessionId` in `localStorage` under `ethernetic_session_id` and attempts `GET /api/sessions/:id` on load before creating a new session.

## Data model

| Model | Storage |
|-------|---------|
| `Session` | `id` (UUID), `state` (JSON `GameState`), timestamps |

## API

| Method | Path | Description |
|--------|------|-------------|
| `POST` | `/api/sessions` | Create session + opening state |
| `GET` | `/api/sessions/:id` | Get state snapshot |
| `POST` | `/api/sessions/:id/interact` | `{ "text": "..." }` → updated state |

## Planned (not implemented)

- Session TTL / cleanup of old rows
- LLM behind interact
- Production: Nest serves `client/dist` at `/`
