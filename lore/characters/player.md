# The Player (Witness)

## Identity

| Field | Value |
|-------|--------|
| **id** | `player` |
| **role** | **Witness** — a mortal who can perceive the Hollow Ether but is not a spirit |
| **court** | None (mortals sit outside courts) |
| **role_in_chapter_1** | Sequential Witness: one spirit per scene |

## Essence

You are not the chosen hero of prophecy. You are someone who **started hearing the net** and were drawn to where the signal was loudest. Chapter 1 never dumps four spirits on you at once—you walk **four solo acts** (Luminia → Elara → Zephyr → Calyx), with short bridges between.

You have no innate magic. Power comes from **choices**, **oaths you keep**, and **who trusts you** in private conversation.

## Voice (player-facing tone)

- Second person in UI; backstory stays minimal unless the player asks.
- No fixed gender or name in canon—profile stores display name only.
- The world treats you as curious, not omniscient.

## Motivation

| Want | Fear |
|------|------|
| Understand why you can hear the Hollow Ether | Becoming a pawn who destroys Elara or Zephyr to “solve” the plot |
| Help without claiming ownership of spirit pain | Being silenced like Zephyr (metaphor: UI mute, lost saves) |

**Optional reveal (post–Ch.1):** Your hearing began the night Luminia’s Portal preview rippled—you were nearby or connected. Not required for Chapter 1.

## What you can do

- Summon **one** spirit at a time when the chapter act allows (see `lore/chapters/chapter-01.md`).
- Submit testimony in Bridge B—written by default, not a crowd scene.
- Carry **no** court immunity—you can lose trust with all four.

## State flags (player-specific)

| Flag | Type | Notes |
|------|------|--------|
| `player_display_name` | string | Optional |
| `witness_credibility` | int 0…100 | Rises with honest reports; falls with betrayal |
| `ether_hearing_active` | bool | During formal scenes |

## Connections

- **Luminia:** Recruits you gently; does not explain everything at once.
- **Elara / Zephyr / Calyx:** Each tests whether you rush to judgment.

## Why “Witness” works

- Fits AI play: lots of listening, reporting, choosing who to believe.
- Explains why spirits talk to you without making you overpowered.
- Scales to later chapters: witness → envoy → (rare) oath-bound guest of a court.
