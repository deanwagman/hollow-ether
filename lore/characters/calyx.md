# Calyx

## Identity

| Field | Value |
|-------|--------|
| **id** | `calyx` |
| **display_name** | Calyx |
| **court** | Court of Root — endings, compost, what must rot so new growth isn’t poison |
| **element** | Earth / decay (sacred, not evil) |
| **role_in_chapter_1** | Act 4 solo only; red herring via rumor until then |

## Chapter 1 (solo)

| Act | Scenes | On stage with others? |
|-----|--------|------------------------|
| **4** | `ch1_root_threshold`, `ch1_calyx_cleared` | Never |

**Not in Bridge B hearing.** Player meets Calyx only after Zephyr’s voice returns. Rumors in Acts 2–3 (Root soil, “allowed” silence) replace ensemble confrontation.

## Essence

Calyx ends things that cling past their season—including lies, oaths, and distorted signals near Thalos. Mortals fear them; other spirits negotiate.

**Chapter 1 truth:** Calyx did **not** steal Zephyr’s voice.

**Chapter 1 appearance:** Red herring through **rumors** until Act 4 one-on-one—then denial and `calyx_cleared_of_theft`. True thief unnamed until a later chapter. Morally complicated: facilitated conditions, did not ring the Bell.

## Voice

- Slow, certain, few adjectives; each sentence feels weighed.
- Uses growth metaphors (“that story has fruit still”) not threats.
- Never begs; may offer a **hard bargain** once per chapter (see below).
- Disrespect is met with silence, not insults.

## Motivation

| Want | Fear |
|------|------|
| The EtherNet to shed corrupted threads before the Portal opens | Premature mercy that preserves a lie |
| Players who accept cost | Being reduced to “evil spirit” in mortal tales |

**Secret:** The Mute Bell was forged in Root court soil—but on commission from the **real** thief (unnamed until a later chapter). Calyx facilitated the *conditions*, not the act—why they are easy to misread.

## Hard bargain (plain language)

Once per chapter, Calyx can offer to **fix one mistake** in the story’s canonical state—for example:

- Remove a rumor flag you spread about Elara, or  
- Undo one bad choice so a hearing goes differently.

**The cost** is always something you lose on purpose, for example:

- Permanently lower affinity with one other spirit, or  
- Give up a piece of lore (a memory slot never shown), or  
- Accept `calyx_influence_high` for the rest of the chapter (darker world).

So: not a shop purchase—a **trade**. You get clarity or a reset; Calyx gets proof you accept that endings have price. Exact costs are defined in `lore/quests/` when that path is written.

## Player relationship

- **Offers:** Unsparing truth, removal of a false quest branch, optional bargain above.
- **Tests:** Whether you want easy comfort or honest endings; whether you blame them for Zephyr without evidence.
- **Affinity up:** Accepting consequences, finishing what you start, not slandering Elara to please them.
- **Affinity down:** Treating decay as horror, demanding they fix everything without sacrifice.

## State flags

| Flag | Type | Notes |
|------|------|--------|
| `calyx_affinity` | int -100…100 | Often starts lower than others |
| `calyx_bargain_offered` | bool | |
| `calyx_bargain_accepted` | bool | Player took the trade; apply chosen cost |
| `calyx_cleared_of_theft` | bool | Set when Ch.1 (or Ch.2 open) proves they did not steal the voice |
| `player_accused_calyx` | bool | Player publicly blamed Calyx— affects reunion scenes |
| `calyx_influence_high` | bool | World darkens; use sparingly |
| `met_calyx` | bool | Usually after other spirits |

## Connections

- **Elara:** Called her “useful delay”—meant tactically, sounds cruel.
- **Zephyr:** Knows Bell’s origin; will trade info for a future favor.
- **Luminia:** Ancient respect; disagree on Thalos timing.
- **Locations:** Root thresholds, edges of Thalos approach.
- **Quests:** Optional bargain path; influences Portal readiness.

## Presence

| Signal | Effect hint |
|--------|-------------|
| Default | Desaturated palette, slow falling motes like leaf ash |
| High influence | Lower ambient light, bass drone |
| Trusted | Green-gold undertone—growth, not horror |

## Summon

- **Triggers:** `call calyx`, `end this`, deep Root locations, high `calyx_influence_high` scenes.
- **Blocked when:** Player has `immature_oath` (broken promise to Gale court—define in quests).
