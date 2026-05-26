# Zephyr

## Identity

| Field | Value |
|-------|--------|
| **id** | `zephyr` |
| **display_name** | Zephyr |
| **court** | Court of Gale — messengers, oaths spoken on the wind |
| **element** | Air / voice |
| **role_in_chapter_1** | Act 3 solo only; Thalos named in Chapter 2+ |

## Chapter 1 (solo)

| Act | Scenes | On stage with others? |
|-----|--------|------------------------|
| **3** | `ch1_wind_stutter`, `ch1_mute_bell`, `ch1_zephyr_clear` | Never |

May reference Elara (“ask Tide later”); Calyx only as rumor until player meets Root in Act 4.

## Essence

Once the loudest herald between courts. Something—or someone—**captured Zephyr’s voice** in a vessel (working name: the Mute Bell). They can still think and write through the EtherNet, but sound is wrong: scraped whispers, reversed syllables, or silence where emphasis should be.

## Voice

**Before restoration (`zephyr_voice_restored` = false):**

- Broken typography: `st—olen`, words split across lines, ALL CAPS for pain.
- Occasional clear phrase when emotion spikes (rules: max one clear sentence per scene).
- Never comedic about the disability; frustration is allowed.

**After restoration:**

- Musical, declarative, slightly vain; loves good lines.
- Remembers who helped and who used their weakness.

## Motivation

| Want | Fear |
|------|------|
| Voice returned without owing the thief a favor | Permanent silence; becoming a warning instead of a herald |
| To name the thief publicly at the Gale hearing | Hurting Elara if the truth spills too early |

**Secret:** They heard the thief’s true name at the moment of theft—but cannot speak it until the voice returns.

## Player relationship

- **Offers:** Wind-carry messages (short player hints), Gale oath-magic (one promise per chapter), truth at restoration.
- **Tests:** Whether the player mocks the broken speech or tries to “fix” them without consent.
- **Affinity up:** Patience, fetching lore about the Mute Bell, not forcing Elara’s memory early.
- **Affinity down:** Impersonating their voice, using their silence to win arguments.

## State flags

| Flag | Type | Notes |
|------|------|--------|
| `zephyr_affinity` | int -100…100 | |
| `zephyr_voice_restored` | bool | Major Ch.1 milestone |
| `mute_bell_found` | bool | Artifact located |
| `zephyr_thief_named` | bool | Requires voice restored; Ch.1 may only name “not Calyx” |
| `zephyr_accused_calyx` | bool | Player or Zephyr pointed at Calyx |
| `met_zephyr` | bool | |

## Connections

- **Elara:** Shielded memory ties to the theft; Zephyr will not betray her if player earned `elara_believed`.
- **Luminia:** Old friends; guilt—Luminia was distracted the night of the theft.
- **Calyx:** Primary **red herring**—Zephyr and the player may blame Root court; `calyx_cleared_of_theft` should feel like a twist, not a retcon. True thief held for a later chapter.
- **Artifacts:** Mute Bell (`lore/artifacts/` when written).
- **Quests:** `zephyr_stolen_voice` (Act 3).

## Presence

| Signal | Effect hint |
|--------|-------------|
| Broken voice | Particle wind stutters; audio crackle if enabled |
| High affinity | Stronger directional wind toward points of interest |
| Restored | Clear tone; brief harmonic bloom on summon |

## Summon

- **Triggers:** `call zephyr`, wind-heavy scenes, after hearing rumors of silence.
- **Blocked when:** Player stole Mute Bell for themselves (`zephyr_betrayed` branch).
