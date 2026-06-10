# Characters

Spirit profiles for Hollow Ether. Each file is canon for prompts, rules, and state—not player-facing copy.

## File format

| Section | Purpose |
|--------|---------|
| **Identity** | IDs, names, court, role in Chapter 1 |
| **Voice** | How they speak (for narrative LLM) |
| **Motivation** | What they want; what they hide |
| **Player relationship** | How affinity moves; what they offer |
| **State flags** | Canonical booleans/numbers the rules engine owns |
| **Connections** | Ties to other spirits, locations, quests |
| **Presence** | Visual/audio hints for the reactive world |

## Naming

- `id` — stable key for DB and JSON (snake_case).
- Display names are canonical (e.g. Luminia, not Lumina). Zephyr’s *speech* may be broken; their name is not.

## Chapter 1 pacing

One **active spirit per scene**. Other spirits are rumors or silent memory until their act. Full flow: `lore/chapters/chapter-01.md`.

See also: `lore/core/courts.md`, `lore/characters/player.md`, `lore/chapters/README.md`.

## Affinity scale

Shared across spirits unless noted otherwise:

| Range | Label | Behaviour |
|-------|--------|-----------|
| -100 … -40 | Wary | Short replies; withholds help |
| -39 … 39 | Neutral | Polite; tests the player |
| 40 … 100 | Trusted | Deeper lore; stronger effects |

Affinity changes only through **approved** quest beats or explicit compassionate/cruel choices—not freeform chat flattery.
