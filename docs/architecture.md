# EtherNetic architecture

High-level layout for the monorepo. **Canonical game state** lives on the server per `sessionId`; the client mirrors it via TanStack Query.

## Packages

| Package | Path | Role |
|---------|------|------|
| `@ethernetic/shared` | `packages/shared/` | Types, `mockInteract`, `createInitialSession`, `applyInteract` |
| `@ethernetic/client` | `client/` | React, R3F, TanStack Query, UI |
| `@ethernetic/server` | `server/` | NestJS sessions API |

## Development request flow

```text
Browser (localhost:5173)
  ├── /, assets              → Vite
  ├── /api/sessions          → Vite proxy → Nest (create session)
  ├── /api/sessions/:id/interact → Nest (applyInteract via shared)
  └── TanStack Query cache   → mirrors server GameState in UI
```

`npm run dev` starts Vite and Nest together.

**Sessions are in-memory** on the server. Restarting Nest clears all sessions. A full page refresh creates a new session (no `localStorage` resume yet).

Direct API: `curl -X POST http://localhost:5173/api/sessions`

## API (Phase 1)

| Method | Path | Description |
|--------|------|-------------|
| `POST` | `/api/sessions` | Create session + opening state |
| `GET` | `/api/sessions/:id` | Get state snapshot |
| `POST` | `/api/sessions/:id/interact` | `{ "text": "..." }` → updated state |

## Planned (not implemented)

- `localStorage` session resume
- Prisma + Postgres
- LLM behind interact
- Production: Nest serves `client/dist` at `/`
