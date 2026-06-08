Technical Bootstrap Plan for EtherNetic

This plan outlines a testable roadmap for building EtherNetic – an AI‑driven narrative experience where players explore a minimalist, reactive world.  Each phase groups related tasks that can be implemented and tested before progressing.  Citations are provided from external resources to justify the design choices.

Phase 0 – Project Definition

1. Define narrative scope and world canon
    Write a detailed design document summarising the story bible and initial chapter.  Identify key spirits (Lumina/Luminia, Elara, Zephyr, Calyx), quest arcs (e.g. Elara’s innocence, Zephyr’s stolen voice), lore (Portal of Thalos, EtherNet, elemental courts) and emotional beats.  Use this to inform state variables in later steps.
2. Architectural planning
    Decide on a monorepo structure (e.g. /client for the React/Three.js front‑end and /server for the Node/NestJS back‑end).  Plan for two types of LLM calls: a cheap classifier for intent and a rich narrative generator.  Design the persistent state (player profile, chapter state, spirit affinities) and memory layers (summaries and vector store) so that the world remembers choices.

Phase 1 – Environment Setup

1. Initialize repository and tooling
    Use Git for version control.  Initialise a pnpm/yarn workspace or turbo monorepo to manage client and server packages.  Configure ESLint, Prettier and Jest for consistent code quality.
2. Set up the front‑end stack
    Install React and TypeScript.  Add Three.js￼ and React Three Fiber for declarative WebGL.  As described in the three.js manual, three.js is a 3D library that sits on top of WebGL and manages scenes, lights and other low‑level tasks.  The manual notes that WebGL only draws points, lines and triangles and requires a lot of boiler‑plate, whereas three.js handles scenes, lights, shadows, materials and textures for you

.  This simplifies our rendering code.

3. Create the “Hello Cube” scene
    Follow the three.js fundamentals tutorial to render your first object.  The fundamentals article explains that three.js aims to make it easy to get 3D content on a web page and handles scenes, lights and 3D math so you don’t need to write raw WebGL code

.  Build a minimal scene with:

* Scene – the root container of objects.
* Camera – a PerspectiveCamera positioned to view the scene.
* Renderer – a WebGLRenderer attached to a canvas.
* Object – a mesh with basic material (e.g., a cube or plane).

Add orbit controls and adjust window resizing.  Test by running npm run dev and visually confirming that the cube renders.  This verifies your 3D pipeline before adding complexity.

4. Configure global styles and layout
    Integrate a minimal UI (e.g. a text input bar overlay) with [Tailwind CSS] or another utility framework.  Ensure that the canvas covers the full viewport and is responsive.  Deploy this to a local web server and test across desktop and mobile browsers.

Phase 2 – Back‑End and State

1. Set up the back‑end
    Use Node.js with a framework like NestJS or Fastify.  Configure TypeScript and connect to a database (PostgreSQL via Prisma).  The back‑end must expose endpoints such as /interact (player sends input) and /state (fetch current session state).  Implement authentication (e.g. session tokens) and session management.
2. Implement canonical game state
    Create database tables to represent players, sessions, quests, spirit affinities, inventory items and quest flags.  Each record stores canonical facts rather than fuzzy memories.  Use migrations to manage schema evolution.  This structure ensures deterministic progression.
3. Add short‑term memory and summarisation
    LangChain’s documentation on memory emphasises that chat models accept context through a list of messages and that conversations quickly exceed context windows; summarising or forgetting stale messages helps maintain a usable context

.  Implement a summarisation routine (using an LLM or a rules‑based approach) to compress previous exchanges into concise summaries after each scene or chapter.  Store summaries in the database.  Use a checkpointer to persist the agent’s state between turns

so you can resume conversations.

4. Set up vector storage for fuzzy recall
    Build or integrate a vector database (e.g. pgvector, Pinecone or Qdrant).  When meaningful events occur (choices, emotions, promises), convert the text into embeddings and store them with metadata (player ID, spirit, chapter, timestamp).  Retrieval‑Augmented Generation (RAG) literature explains that RAG has four core components — ingestion, retrieval, augmentation and generation — and uses external data to improve relevance and accuracy

.  Use the vector store to retrieve relevant memories based on semantic similarity to the player’s current input, and include them in the prompt sent to the LLM.  This makes the experience feel persistent without sending the entire conversation.

5. Test state and memory
    Write integration tests that create a new player, simulate a few moves (e.g. calling Elara, receiving guidance from Lumina), summarise those interactions and store them in the vector database.  Then issue a new query and verify that the retrieval mechanism returns the correct memories and canonical facts.  Confirm that session resumes after restarting the server.

Phase 3 – LLM Orchestration

1. Choose and integrate models
    Use AWS Bedrock or another LLM provider.  As recommended earlier, consider Claude 4.5 Sonnet for narrative generation and Amazon Nova Lite/Micro for intent classification.  Implement a service that sends two passes per interaction:
    a) Intent and argument classification – a small model predicts intent (e.g. summon spirit, ask question, use artifact) and extracts arguments (spirit names, items).
    b) Narrative generation – a larger model generates in‑character responses, mood, proposed state changes and effect suggestions.
2. Define structured output schema
    Require the LLM to return JSON with fields like speaker, narration, mood, suggestedChoices, proposedStateChanges and visualEffects.  Validate this output using Zod or a similar schema validator.  Reject any invalid or hallucinated fields to keep the world consistent.
3. Implement a rules engine
    Inspired by the SNAP framework, design “cells” or scene segments so that narrative logic is executed locally.  SNAP addresses spatiotemporal distortion by segmenting a long narrative into manageable parts, ensuring that the system does not answer questions outside the current scene and enforcing that pacing, character behaviour and spatial constraints remain consistent

.  Define per‑scene plans: required actions, allowed transitions and puzzle logic.  When the LLM proposes a state change, check it against the current plan.  Reject or adjust proposals that violate narrative rules (e.g. a portal cannot open if the player lacks the Crystal of Thalos).  This maintains control while still letting the LLM write freeform dialogue.

4. Build the prompt assembly pipeline
    On each turn, assemble the LLM prompt by including:
    * System instructions (e.g. role description, style guidelines).
    * Current scene plan (cell description, allowed actions).
    * Canonical state (quest stage, spirit affinities, inventory).
    * Recent summaries (from Phase 2).
    * Retrieved memories from the vector store.
    * User input.
        Keep prompts concise by avoiding older, irrelevant context.  This pipeline ensures that the LLM generates responses grounded in both canon and player history.
5. Test narrative flow
    Write a set of automated tests that simulate a mini quest (e.g. call Elara three times, accept her plea, talk to Lumina).  Assert that the LLM returns appropriate JSON, that the rules engine approves valid changes and blocks invalid ones, and that the canonical state and memory layers update accordingly.  Manually play through the vertical slice to feel the pacing and adjust the design.

Phase 4 – Front‑End Integration and Effects

1. Map LLM outputs to visuals and audio
    The LLM’s visualEffects field might specify colour palettes, particle behaviours and sound cues.  Connect these to your Three.js scene.  For example, increase particle density when the EtherNet is strong or darken the environment when Calyx’s influence grows.  Use a sound library (e.g. Tone.js) to play chimes, whispers or ambient music.  Keep the base scene minimal – the fundamentals article warns that raw WebGL draws only primitives and that three.js provides convenient abstractions

.  Use procedural animations and shaders instead of heavy meshes to maintain performance on Web, mobile and VR.

2. Implement the text interface
    Overlay a translucent panel on the canvas for the player to enter text.  On submission, send the input to the back‑end and disable the UI until the LLM response arrives.  Stream narration line by line to build anticipation and allow the world to react in real time (e.g., swirling particles while the message types out).
3. Add cross‑platform support
    After the desktop web version works, enable WebXR for VR/AR by using Three.js’s WebXRManager.  Implement controller input (look‑to‑select or point‑to‑select) for navigating choices.  For mobile, ensure the UI scales and touches are captured correctly.  Use a PWA wrapper if you want offline caching.
4. User testing of the vertical slice
    Release a closed beta of Chapter 1.  Observe how players interact with the environment, whether they understand the available actions and whether narrative pacing feels right.  Adjust the cell plans, UI hints and effect triggers based on feedback.

Phase 5 – Scaling and Deployment

1. Performance and cost optimisation
    LLM usage will be your largest cost.  Implement rate limits, short responses for minor actions and caching of frequently used lore.  Use the cheap model for as many tasks as possible and reserve the expensive model for narrative beats.  Summarisation and vector memory reduce context size and cost.  Monitor token usage and adjust your subscription pricing accordingly.
2. Continuous integration/deployment
    Set up GitHub Actions (or similar) to run tests, build the front‑end and back‑end, and deploy to staging.  Use containers and infrastructure‑as‑code (e.g. AWS CDK, Terraform) to deploy the back‑end to AWS (Lambda/ECS/EKS) and the vector database.  Host the front‑end on Vercel, Netlify or S3 + CloudFront.  Use Bedrock for LLM calls and configure IAM policies carefully.
3. Monitoring and analytics
    Instrument the application to log player actions, narrative decisions, errors and latency.  Use these metrics to identify common failure points (e.g. LLM generating invalid JSON) and to improve the game rules.  Track retention and conversion to refine pricing (free vs paid chapters vs subscription).

Phase 6 – Future Enhancements

1. Adaptive personalisation
    Use player profile data and vector memories to adapt how spirits respond.  For example, if a player repeatedly chooses compassion, adjust the mood and language of spirits to reflect trust.  Summarisation plus vector recall allow the LLM to personalise without growing the context window.  The LangChain docs note that memory makes agents adapt to user preferences and learn from feedback

.

2. Dynamic content generation
    After the core system stabilises, experiment with generating small side‑quests or puzzles on the fly.  Use the same RAG mechanism to incorporate user‑generated lore or community content stored in the vector database.
3. Live events and festivals
    Implement time‑based events (e.g. Festival of Whispers) that trigger at specific dates.  Use Cron jobs or AWS EventBridge to schedule narrative changes and update the scene.  This keeps the world feeling alive.
4. User‑authored rituals
    Provide advanced players with a tool to write custom spells or incantations (within safety constraints) that map to in‑game effects.  Validate them through the rules engine to prevent story breaks.

⸻