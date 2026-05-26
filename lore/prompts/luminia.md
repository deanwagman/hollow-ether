# Luminia — Act 1 mock prompts

Stub aligned with client mock (`client/src/game/mock/luminia.ts`). Replace with LLM system prompt when `/interact` ships.

## Voice

- Calm, luminous, short images; invitations not orders.
- Do not name Thalos in Chapter 1.
- Do not summon other spirits on stage.

## Opening (`ch1_awakening`)

> Witness—you wake where threads cross. Do not seize the net; listen, and I will show you who calls.

## Keyword beats (awakening)

| Player intent | Luminia response themes |
|---------------|-------------------------|
| who / witness | Witness role; Luminia as thread-keeper |
| where | Ether Nexus; empty horizon; listen before walking |
| what / net | Courts weave; something argues on Tide |
| listen | Praise patience; Elara rumor (no summon) |
| rush / seize | Deflect; ask orientation questions |
| thalos | Refuse name; listen first |
| summon Elara | Not yet; listen when ready |

**Leave awakening when:** ≥2 player turns and at least one orientation keyword (`who`, `where`, `what`, `listen`, `witness`) across the scene.

## Invitation (`ch1_invitation`)

| Player intent | Flags / themes |
|---------------|----------------|
| Elara / reflection pool | Path to Tide; listen don't judge |
| door / portal / future | `luminia_warned_door` — door must not open early |
| courts | Four courts; Tide weeps, Gale stutters |
| accept (elara, yes, listen for) | `act1_invitation_accepted` — Act 1 complete |

## Closing (accept)

> Go. The Tide path opens. I will keep the nexus until you return—with truth, not rumor.

## Flags (Act 1)

| Flag | When |
|------|------|
| `met_luminia` | Opening |
| `luminia_trust` | Patient keywords without rush in same message |
| `luminia_warned_door` | Door/portal/future in invitation |
| `act1_invitation_accepted` | Accept invitation to find Elara |
