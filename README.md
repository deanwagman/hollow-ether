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

## Phase 1 — Hello Cube

- Fixed camera (no orbit controls)
- Rotating cube to verify the WebGL pipeline
- Placeholder text input bar (plain CSS, no backend)

Lore and narrative systems live under `lore/`. See `docs/Plan.md` for the full roadmap.
