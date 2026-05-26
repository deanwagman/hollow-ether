# Chapters

Chapter files define **player pacing**: acts, scenes, and who is on stage. Character files define **who they are**; chapters define **when** they appear.

## Design rules

1. **One active spirit per scene** — only one speaks; the LLM sets a single `speaker`.
2. **Offstage mentions are fine** — “Luminia told me…” without summoning her.
3. **Group scenes are milestones** — hearings, restoration, exoneration; not the default.
4. **Acts are sequential** — finish Act N before Act N+1 unlocks (rules engine / scene plan).

## File format

Each chapter file includes:

- **Summary** — tone and scope
- **Acts** — numbered blocks with solo focus spirit
- **Scenes** — id, location, goal, allowed intents, flags set
- **Deferred** — what is *not* in this chapter

See `chapter-01.md` for the template.
