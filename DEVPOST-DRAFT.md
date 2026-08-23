# Devpost submission — DRAFT (claim-discipline enforced)

> Draft stub. Fill demo specifics after the review checkpoint. Claim rule: no "learns over time / production-ready / enterprise-grade / autonomous / adaptive" until the demo shows it. Use *designed to / built around / captures decision memory / uses prior feedback to shape future proposals*.

## Category
Collaborative Partner. (Also eligible: Individual/Hobbyist; Best Architectural Design.)

## Elevator
KLAI Agentic is a collaborative partner for messy operational workflows, built around explicit state, decision memory, human approval gates, and bounded execution.

**AI prepares. System records. Human approves. Agent executes only approved actions.**

## Inspiration (the dogfood story — lead with this)
While building my own always-on agent, it did the work *and closed the decision without me* — logged "done" while, in my head, I still hadn't decided. The model wasn't the problem; the missing thing was discipline: an agent that waits at the gate. KLAI Agentic makes that gate structural.

## What it does
Turns unstructured input into structured state, proposes what should happen next, captures human approvals and edits as decision memory, and executes only approved actions. The collaboration is not just conversational; it is operational — it uses prior feedback to shape future proposals.

## How it's built
- **Gemini 3.5 Flash** via **Vertex AI** (global endpoint)
- **GenKit** flows: ingest → sweep → propose → gate → execute
- **Cloud Run** (runtime service account, ADC — no keys)
- **Firestore** — `cases` collection with a full audit-field shape (the governance state machine)
- **Cloud Storage** — raw dumps

## Architecture
See `ARCHITECTURE.md`. Invariants: gate is structural (execute refuses un-approved cases) · decision memory (rejections/edits feed future proposals) · auditable state · idempotent by case id.

## What I learned / demo proof
The video **follows one decision** end to end. A messy campaign thread contains one undecided question — *lock a 20-product scope for a client?* The agent sweeps it into structured state, then proposes the decision. At the gate, everything stops: I reject it, with a reason — the client hasn't signed off. On the next pass, **same input**, the agent no longer proposes approving the scope: it marks it **blocked**, and proposes getting the client's sign-off instead. The rejection wasn't just logged — it **changed what the agent proposed next**. That is the difference between a tool and a partner, and it's captured live (ingest → propose → reject-with-reason → re-ingest same input), not staged. Every state — approval_status, approved_by, approved_at, execution_status, user_feedback — is written to Firestore, so the decision trail stays auditable. Lesson: the hard part of an agentic system isn't the model's intelligence, it's the structure that makes it stop and let a human decide.

> Intelligence is everywhere. Discipline isn't. The leverage was never the model — it's the discipline around it.

## Links
- Repo: https://github.com/peuarchukiati-rgb/klai-agentic
- Live: https://klai-agentic-760656259079.us-central1.run.app
- Video: draft cut ready (~1:08, "Follow One Decision"); final voice pass + upload pending
