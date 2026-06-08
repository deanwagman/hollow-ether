# EtherNetic architecture

High-level layout for the monorepo. **Canonical game state** lives on the server per `sessionId`, persisted in **PostgreSQL** via **Prisma**; the client mirrors it via TanStack Query.

## Packages

| Package | Path | Role |
|---------|------|------|
| `@ethernetic/shared` | `packages/shared/` | Types, rules, `applyInteract`, `mockInteract` |
| `@ethernetic/client` | `client/` | React, R3F, TanStack Query, UI |
| `@ethernetic/server` | `server/` | NestJS sessions API, LLM demo, Prisma |

## Development request flow

```text
Browser (localhost:5173)
  ├── /, assets              → Vite
  ├── /api/sessions          → Vite proxy → Nest → Prisma → Postgres
  ├── /api/sessions/:id/interact → rules-first → NarrativeService (optional LLM) → Prisma
  ├── /api/demo/chat, /api/demo/llm-ping → Nest → LlmProvider (Bedrock or mock)
  └── TanStack Query cache   → mirrors server GameState in UI (game mode)
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
| `GET` | `/api/demo/llm-ping` | Bedrock/mock smoke test (requires `DEMO_LLM_ENABLED=true`) |
| `POST` | `/api/demo/chat` | `{ "text": "...", "history"?: [...] }` → `{ reply, modelId }` |

## Game narrative (Act 1 POC)

Hybrid interact on `/api/sessions/:id/interact`:

```text
SessionService.interact
  → resolveInteractRules (shared: flags, scene, scripted beats)
  → if replaceSpiritLines (Act 1 accept): skip LLM
  → else if NARRATIVE_PROVIDER=llm: NarrativeService → LlmProvider
  → else: getSpiritLines (keyword mock)
  → applyInteractWithSpiritLines → Postgres
```

Scene-scoped prompts live in [server/src/narrative/prompts/](server/src/narrative/prompts/) (mirrors [lore/prompts/luminia.md](lore/prompts/luminia.md) by scene).

| Env (server) | Purpose |
|--------------|---------|
| `NARRATIVE_PROVIDER` | `llm` = Bedrock Luminia on `/interact`; `mock` = keyword dialogue (default, CI-safe) |

**Env matrix:**

| NARRATIVE_PROVIDER | LLM_PROVIDER | Result |
|--------------------|--------------|--------|
| `mock` | any | Keyword mock dialogue; no Bedrock |
| `llm` | `bedrock` | Game uses Bedrock for Luminia |
| `llm` | `mock` | Game uses echo LLM (tests / no AWS) |

## LLM demo (dev)

Free-form chat with AWS Bedrock (or a mock echo provider). **Separate** from game sessions — use only when `VITE_LLM_DEMO=true`.

```text
VITE_LLM_DEMO=true (client)
  → same Ether Nexus UI, POST /api/demo/chat
  → DemoService → LlmProvider
       ├── bedrock: BedrockRuntime Converse (AWS_REGION, BEDROCK_MODEL_ID)
       └── mock: deterministic echo (CI / no AWS)
```

| Env (server) | Purpose |
|--------------|---------|
| `DEMO_LLM_ENABLED` | `true` exposes demo routes; otherwise 404 |
| `LLM_PROVIDER` | `bedrock` or `mock` |
| `AWS_REGION` | Bedrock region |
| `BEDROCK_MODEL_ID` | Model ID enabled in your account |
| `DEMO_LLM_MAX_TOKENS` | Max tokens per reply (default 512) |

Client flag: `VITE_LLM_DEMO=true` in `client/.env.development.local` (see `client/.env.example`).

## Planned (not implemented)

- Session TTL / cleanup of old rows
- Structured JSON from LLM (flags/scenes proposed by model)
- Production: Nest serves `client/dist` at `/`
