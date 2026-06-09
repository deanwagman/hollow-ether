# EtherNetic architecture

High-level layout for the monorepo. **Canonical game state** lives on the server per `sessionId`, persisted in **PostgreSQL** via **Prisma**; the client mirrors it via TanStack Query.

## Packages

| Package | Path | Role |
|---------|------|------|
| `@ethernetic/shared` | `packages/shared/` | Types, rules, `applyInteract`, `mockInteract` |
| `@ethernetic/client` | `client/` | React, R3F, Suspended Narrative Layer, TanStack Query |
| `@ethernetic/server` | `server/` | NestJS sessions API, narrative LLM, Prisma |

## Development request flow

```text
Browser (localhost:5173)
  ├── /, assets              → Vite
  ├── /api/sessions          → Vite proxy → Nest → Prisma → Postgres
  ├── /api/sessions/:id/interact → rules-first → NarrativeService (optional LLM) → Prisma
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
| `GET` | `/api/health` | API health check |

## Game narrative (Act 1)

Hybrid interact on `/api/sessions/:id/interact`:

```text
SessionService.interact
  → resolveInteractRules (shared: flags, scene, scripted beats)
  → if replaceSpiritLines (Act 1 accept): skip LLM
  → else if NARRATIVE_PROVIDER=llm: NarrativeService → LlmProvider
  → else: getSpiritLines (keyword mock)
  → applyInteractWithSpiritLines → Postgres
```

Scene-scoped prompts: [server/src/narrative/prompts/](server/src/narrative/prompts/).

**Act 1 arc:** `ch1_awakening` → `ch1_invitation` → `ch1_invitation_commit` → accept closes Act 1.

Visual system: [docs/design/visual-grammar.md](design/visual-grammar.md), presets in `client/src/theme/presets.ts`.

| Env (server) | Purpose |
|--------------|---------|
| `NARRATIVE_PROVIDER` | `llm` = Bedrock Luminia on `/interact`; `mock` = keyword dialogue (default, CI-safe) |
| `LLM_PROVIDER` | `bedrock` or `mock` |
| `LLM_MAX_TOKENS` | Max tokens per LLM reply (default 512) |
| `AWS_REGION`, `BEDROCK_MODEL_ID` | Bedrock when `LLM_PROVIDER=bedrock` |

**Env matrix:**

| NARRATIVE_PROVIDER | LLM_PROVIDER | Result |
|--------------------|--------------|--------|
| `mock` | any | Keyword mock dialogue; no Bedrock |
| `llm` | `bedrock` | Bedrock for Luminia on `/interact` |
| `llm` | `mock` | Echo LLM (tests / no AWS) |

## Planned (not implemented)

- Session TTL / cleanup of old rows
- Structured JSON from LLM (flags/scenes proposed by model)
- Production: Nest serves `client/dist` at `/`
