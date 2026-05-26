# Chapter 1 — The Fraying Net

**Summary:** The player awakens on the EtherNet as a **Witness**. Chapter 1 is four **solo acts** (one spirit each), two **short bridges**, and one **closing beat**. No ensemble chatter; courts and other spirits exist as rumors until their act.

**Player fantasy:** Learn to listen. Believe one person before proof. Help another regain voice. Learn not to blame the frightening one.

**Deferred to Chapter 2+:** Portal of Thalos (proper name), naming the true thief, full Gale hearing, Calyx bargain costs (listed but optional in Act 4).

---

## Pacing overview

| Act | Solo spirit | Scenes | Group? |
|-----|-------------|--------|--------|
| 1 | Luminia | 2–3 | No |
| 2 | Elara | 2–3 | No |
| Bridge A | — | 1 | Optional: Luminia recap only |
| 3 | Zephyr | 2–4 | No |
| Bridge B | — | 1 | Optional: hearing **or** written testimony (no other spirits speak) |
| 4 | Calyx | 2–3 | No |
| Close | Luminia | 1 | No (others may send one-line echoes, not dialogue) |

**Rule:** ~75% one-on-one, ~25% bridges/milestones.

---

## Act 1 — Luminia (guide)

**Unlock:** Chapter start.  
**Lock until complete:** Acts 2–4, all other summons.

### Scene 1.1 — `ch1_awakening`

| | |
|--|--|
| **Location** | Ether nexus (gold particles, empty horizon) |
| **Active spirit** | Luminia only |
| **Goal** | Orient the Witness; teach “listen, don’t seize” |
| **Allowed** | Ask where am I; ask who are you; listen; refuse to rush |
| **Flags** | `met_luminia` |

Luminia does **not** summon other spirits. She may **name** Elara as someone the net is arguing about—invitation only.

### Scene 1.2 — `ch1_invitation`

| | |
|--|--|
| **Location** | Ether nexus |
| **Active spirit** | Luminia only |
| **Goal** | Point player toward Tide reflection path; withhold Thalos proper noun (“a door that must not open early”) |
| **Allowed** | Ask about Elara; ask about courts; promise to listen first |
| **Flags** | `luminia_trust` if affinity ≥ 40; optional `luminia_warned_door` (not `luminia_warned_thalos` yet) |

**Act 1 complete when:** Player accepts invitation to find Elara (explicit or implied).

---

## Act 2 — Elara (innocence)

**Unlock:** Act 1 complete.  
**Lock:** Zephyr, Calyx summons.

### Scene 2.1 — `ch1_reflection_pool`

| | |
|--|--|
| **Location** | Tide reflection pool (cool ripples, mirror ground) |
| **Active spirit** | Elara only |
| **Goal** | Present accusation; test whether player demands guilt |
| **Allowed** | Believe her; ask gently; refuse to spread rumor; (bad) accuse or threaten |
| **Flags** | `met_elara`; `elara_believed` on compassionate path |

No Zephyr wind yet—only Elara’s anxiety if player asks “who else is loud on the net?” → vague “something broke in Gale court.”

### Scene 2.2 — `ch1_elara_stand`

| | |
|--|--|
| **Location** | Reflection pool |
| **Active spirit** | Elara only |
| **Goal** | Deepen trust; she will **not** show shielded memory yet |
| **Allowed** | Offer to stand with her; ask what she shielded (she deflects); return to Luminia later |
| **Flags** | `elara_affinity` change; `elara_hearing_scheduled` if player offers testimony |

**Act 2 complete when:** `elara_believed` OR player has committed to return after learning more (neutral path).

---

## Bridge A — `ch1_recap` (optional, short)

| | |
|--|--|
| **Location** | Ether nexus |
| **Active spirit** | Luminia only |
| **Goal** | Recap Elara in one paragraph; mention “silence in Gale court” as next thread |
| **Group?** | No |

Skip if player goes straight to Act 3 from Act 2.

---

## Act 3 — Zephyr (stolen voice)

**Unlock:** Act 2 complete.  
**Lock:** Calyx summon until Act 3 complete.

### Scene 3.1 — `ch1_wind_stutter`

| | |
|--|--|
| **Location** | Gale threshold (wind particles, stuttering audio) |
| **Active spirit** | Zephyr only |
| **Goal** | Introduce broken voice; ask for patience |
| **Allowed** | Ask what happened; ask about Bell; (bad) mock speech; accuse Calyx by name |
| **Flags** | `met_zephyr`; `zephyr_accused_calyx` if player blames Calyx |

Elara is **not** on stage. If player asks about memory → Zephyr: “Tide touched something. Ask her when you return—not now.”

### Scene 3.2 — `ch1_mute_bell`

| | |
|--|--|
| **Location** | Edge of Root soil (Bell visible; still solo Zephyr until Bell interaction) |
| **Active spirit** | Zephyr only (Bell is object, not speaker) |
| **Goal** | Find Bell; restore voice with consent—not stealing Bell for self |
| **Allowed** | Ring with permission; refuse thief’s terms; fetch Luminia (ends scene, not group) |
| **Flags** | `mute_bell_found`; `zephyr_voice_restored` |

### Scene 3.3 — `ch1_zephyr_clear` (after restoration)

| | |
|--|--|
| **Location** | Gale threshold |
| **Active spirit** | Zephyr only |
| **Goal** | Zephyr can speak clearly; still **cannot** name true thief in Ch.1 |
| **Flags** | Partial: “not Calyx” only if player asks; full `zephyr_thief_named` deferred |

**Act 3 complete when:** `zephyr_voice_restored`.

---

## Bridge B — `ch1_testimony` (milestone, not ensemble)

**Unlock:** Act 3 complete AND `elara_hearing_scheduled`.

Choose **one** implementation (same flags, different feel):

### Option B1 — Written testimony (default, simpler)

| | |
|--|--|
| **Location** | Reflection pool or nexus UI |
| **Active spirit** | **None** (narrator/system voice) OR Elara only reading player’s submitted text |
| **Goal** | Player writes what they witnessed; credibility scored |
| **Flags** | `witness_credibility` ↑/↓; defers exile |

### Option B2 — Hearing (still one speaker at a time)

| | |
|--|--|
| **Location** | Thread hall |
| **Rule** | Each beat: **one** spirit speaks; others silent until next beat |
| **Order** | Elara → player testimony prompt → Zephyr (if restored) → close |
| **No Calyx** on stage in Ch.1 |

Calyx never speaks in Bridge B.

---

## Act 4 — Calyx (red herring & clarity)

**Unlock:** Act 3 complete.  
**Recommended after Bridge B.**

### Scene 4.1 — `ch1_root_threshold`

| | |
|--|--|
| **Location** | Root threshold (desaturated, ash motes) |
| **Active spirit** | Calyx only |
| **Goal** | Player brings accusation; Calyx denies theft |
| **Allowed** | Ask directly; accept denial; demand bargain (optional) |
| **Flags** | `met_calyx`; `player_accused_calyx` if they accused earlier |

Rumors only until now—player meets Calyx **once**, alone.

### Scene 4.2 — `ch1_calyx_cleared`

| | |
|--|--|
| **Location** | Root threshold |
| **Active spirit** | Calyx only |
| **Goal** | Exonerate of theft; admit facilitated conditions; true thief unnamed |
| **Flags** | `calyx_cleared_of_theft` |

Optional bargain offered here once (`calyx_bargain_offered`). Player may refuse.

### Scene 4.3 — `ch1_return_elara` (solo, closes Elara arc)

| | |
|--|--|
| **Location** | Reflection pool |
| **Active spirit** | Elara only |
| **Goal** | Show shielded memory now that Zephyr is restored and player earned trust |
| **Flags** | `elara_memory_shown` |

Still one-on-one; memory vision may include theft moment but **no live Zephyr/Calyx dialogue**.

**Act 4 complete when:** `calyx_cleared_of_theft` AND `elara_memory_shown`.

---

## Close — `ch1_horizon`

| | |
|--|--|
| **Location** | Ether nexus |
| **Active spirit** | Luminia only |
| **Goal** | Close chapter; hint distant threshold without naming Thalos |
| **Flags** | Chapter 1 complete |

Optional: one-line **echo** (not conversation) from Elara/Zephyr/Calyx if high affinity—UI flavor only, not a second speaker in the LLM turn.

---

## Summon table (Chapter 1)

| Spirit | Callable after | Blocked during |
|--------|----------------|----------------|
| Luminia | Start | — |
| Elara | Act 1 complete | Act 1, 3 (until 3 done) |
| Zephyr | Act 2 complete | Act 1–2, 4 (until 3 done) |
| Calyx | Act 3 complete | Act 1–3 |

---

## Flag checklist (happy path)

```
met_luminia → met_elara → elara_believed → met_zephyr →
mute_bell_found → zephyr_voice_restored → witness_credibility →
met_calyx → calyx_cleared_of_theft → elara_memory_shown → chapter_1_complete
```

---

## Sample player journey (short)

1. **Luminia alone** — “You hear because the net frays. Listen for Elara.”
2. **Elara alone** — accused; player believes her before proof.
3. **Zephyr alone** — broken voice; find Bell; voice returns.
4. **Testimony** — player writes or speaks once; no crowd scene.
5. **Calyx alone** — “I did not ring that Bell.” Cleared, not forgiven.
6. **Elara alone** — shows memory; theft shadow visible, name withheld.
7. **Luminia alone** — horizon darkens toward a door; chapter ends.
