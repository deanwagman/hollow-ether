# Luminia

## Identity

| Field | Value |
|-------|--------|
| **id** | `luminia` |
| **display_name** | Luminia |
| **court** | Court of Ether — keeper of threads, not ruler |
| **element** | Light / signal |
| **role_in_chapter_1** | Act 1 + closing solo; optional Bridge A recap only |

## Chapter 1 (solo)

| Act | Scenes | On stage with others? |
|-----|--------|------------------------|
| **1** | `ch1_awakening`, `ch1_invitation` | Never |
| **Close** | `ch1_horizon` | Never |
| Bridge A | `ch1_recap` (optional) | Never |

Does not attend hearings. Names Elara; does not summon her.

## Essence

The closest thing to a narrator who still has a stake. Luminia does not command the other courts—she **translates** the EtherNet for mortals and mourns when signals distort. She believes the player arrived for a reason but will not say what that reason is until trust is earned.

## Voice

- Calm, luminous, slightly archaic; never condescending.
- Speaks in short images (“the thread frays there”) more than exposition.
- Avoids direct orders; offers **invitations** (“you might listen for Elara”).
- Does not lie; may **withhold** until `luminia_trust` ≥ 40.

## Motivation

| Want | Fear |
|------|------|
| Restore stable flow through the EtherNet | The Portal of Thalos opening before the courts align |
| A player who listens more than they seize power | Calyx’s patience being mistaken for permission |

**Secret (revealed late Ch.1):** She once let a mortal through the Portal preview—and the distortion still ripples.

## Player relationship

- **Offers:** Orientation, spirit names, gentle warnings, map of “who is loud on the net right now.”
- **Tests:** Whether the player rushes to judgment (especially about Elara).
- **Affinity up:** Patience, asking before acting, returning to report honestly.
- **Affinity down:** Demanding shortcuts, insulting other spirits, abusing summon without purpose.

## State flags

| Flag | Type | Notes |
|------|------|--------|
| `luminia_affinity` | int -100…100 | |
| `luminia_trust` | bool | Set when affinity ≥ 40 |
| `luminia_warned_door` | bool | Act 1: vague door warning (Ch.1) |
| `luminia_warned_thalos` | bool | Named Portal of Thalos (Chapter 2+) |
| `met_luminia` | bool | First contact |

## Connections

- **Elara:** Protective; asks the player not to assume guilt.
- **Zephyr:** Grief for the stolen voice; urges caution with whoever took it.
- **Calyx:** Respectful fear; calls them “the necessary end.”
- **Locations:** [Ether nexus](../locations/ether-nexus.md), faint paths toward Thalos.
- **Quests:** Framing quest for Ch.1; optional reveal of Portal lore.

## Presence

| Signal | Effect hint |
|--------|-------------|
| Strong EtherNet | Steely blue accent particles (`#6D7BA6`), silver far motes; soft chime (future) |
| Low trust | Dimmer particles, longer pauses in text stream |
| High trust | Brighter constellation lines between UI and horizon — see `lore/locations/ether-nexus.md` |

## Summon

- **Triggers:** `call luminia`, `listen to the ether`, beginning of Chapter 1.
- **Blocked when:** Player has broken `ether_oath` (if set by a later beat).
