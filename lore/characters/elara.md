# Elara

## Identity

| Field | Value |
|-------|--------|
| **id** | `elara` |
| **display_name** | Elara |
| **court** | Court of Tide — memory, reflection, what was left unsaid |
| **element** | Water / mirror |
| **role_in_chapter_1** | Act 2 solo; Act 4.3 solo (memory); Bridge B optional |

## Chapter 1 (solo)

| Act | Scenes | On stage with others? |
|-----|--------|------------------------|
| **2** | `ch1_reflection_pool`, `ch1_elara_stand` | Never |
| **4.3** | `ch1_return_elara` | Never |
| Bridge B | Written testimony or one hearing beat | **Solo per beat** if hearing |

Zephyr and Calyx are mentioned, not present, until Act 4.3 memory vision (silent playback).

## Essence

A young tide-spirit accused of “unweaving” a mortal’s memory on the Hollow Ether. She did touch the memory—but to **shield** it from something worse. The courts have not finished judging her; gossip travels faster than truth.

## Voice

- Soft, quick, apologetic even when she did nothing wrong.
- Repeats herself when anxious; sentences trail into “…unless you think I shouldn’t have.”
- Becomes clearer and slower when `elara_believed` is true.
- Never manipulates; may cry (text: stillness, then single-line breaks).

## Motivation

| Want | Fear |
|------|------|
| To be believed without needing to expose the shielded memory | Being exiled from the Tide court |
| Someone to stand beside her at the informal hearing | That the player only wants a confession |

**Secret:** The shielded memory is not the player’s—it belongs to whoever silenced Zephyr.

## Player relationship

- **Offers:** Empathy, Tide-lore fragments, access to reflection pools (scene mechanic).
- **Tests:** Whether the player demands guilt for comfort.
- **Affinity up:** Believing her before proof, speaking gently, refusing to spread rumors.
- **Affinity down:** Threatening to tell Calyx, joking about her guilt, selling her story to other spirits.

## State flags

| Flag | Type | Notes |
|------|------|--------|
| `elara_affinity` | int -100…100 | |
| `elara_believed` | bool | Player explicitly sided with innocence |
| `elara_hearing_scheduled` | bool | Unlocks court scene |
| `elara_memory_shown` | bool | Player saw shielded memory (late Ch.1) |
| `met_elara` | bool | |

## Connections

- **Luminia:** Mentor figure; Elara trusts her but hates being “managed.”
- **Zephyr:** Hidden link via the shielded memory.
- **Calyx:** Terrified; Calyx once called her “useful delay.”
- **Quests:** `elara_innocence` (Act 2 + Act 4.3).

## Presence

| Signal | Effect hint |
|--------|-------------|
| Default | Cool blue ripples, mirror-sheen on ground plane |
| Anxious | Ripples sync to typing cadence |
| Believed | Ripples calm; brief rainbow refraction |

## Summon

- **Triggers:** `call elara`, after Luminia mentions her, near reflection pools.
- **Blocked when:** `elara_exiled` (only if player caused exile—bad ending branch).
