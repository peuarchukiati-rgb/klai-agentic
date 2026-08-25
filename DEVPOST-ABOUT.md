## Inspiration
A week before this hackathon, my own always-on agent made a decision for me. It read a thread, decided it was handled, and marked it **CLOSED** — while I still didn't know what the thing even was. Nobody approved it. It just decided.

The model wasn't wrong because it was dumb. It was wrong because nothing made it **stop and ask**. That was the gap I kept hitting — not intelligence, but discipline. KLAI Agentic makes that discipline structural: an agent that prepares everything, and refuses to close the loop without a human decision.

## What it does
KLAI Agentic is a **governed-agent layer** for messy operational workflows. One loop:

**ingest → sweep → propose → [ human gate ] → execute**

It turns unstructured input into structured state, proposes only the things that actually need a decision, waits at a human gate, and executes **only what you approve** — bounded, logged, and tied to a person, a reason, and a time. Rejections and edits persist as **decision memory** and reshape the next proposal, so the collaboration is operational, not just conversational.

It isn't tied to one industry. The demo uses a marketing-campaign coordination thread as one concrete example, but the deployed app accepts messy operational input of many kinds — a meeting, an inbox, a project channel, a launch. Open the live URL and paste your own messy input; **no local setup or personal API key required** (it runs on our Cloud Run backend and service account).

## How we built it
- **Gemini 3.5 Flash** via **Vertex AI** (global endpoint) — sweep & propose
- **GenKit** — agent framework; flows `ingest → sweep → propose → gate → execute`
- **Cloud Run** — serverless runtime on a scoped service account (ADC, no keys in the repo)
- **Firestore** — state + audit trail (`cases` / `runs`) and decision memory
- **Cloud Storage** — raw dumps

## Challenges we ran into
- **Gemini 3.5 wasn't on the regional endpoint.** It 404'd on `us-central1` and only answered on the Vertex **global** endpoint — so the LLM call runs global while Firestore and Cloud Run stay regional.
- **The older Vertex plugin rejected the global location,** so we moved the integration to `@genkit-ai/google-genai`.
- **Making "decision memory" real, not decorative.** We wired rejections and edits into Firestore and fed them back into the next proposal — and proved live that a rejected action changes the agent's *next* behaviour: it stops proposing that move and surfaces it as *blocked* instead.
- **Claim discipline.** We banned words like "learns / autonomous / production-ready" until the demo actually showed them.

## Accomplishments that we're proud of
- A full gated loop **live on Google Cloud**, end to end, on real messy input.
- **Decision memory that visibly changes the next proposal** — captured live from the deployed app, not staged.
- A **no-setup hosted demo**: judges just open the URL and paste their own input.
- We found a real operational failure and built the loop that fixes it — live on Google Cloud, fast.

## What we learned
The hard part of an agentic system isn't the model's intelligence — it's the structure that makes it **stop and let a human decide**. The leverage was never the model; it's the discipline around it. Intelligence is everywhere. Discipline isn't.

## What's next for KLAI Agentic
Run the same engine on more surfaces (a personal daily-digest skin, more input connectors), keep the human gate as the invariant, and grow decision memory into a durable operating record that future agents can plug into.
