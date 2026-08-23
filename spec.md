# KLAI Agentic — spec / save point

Entry for Google's **All Things Agentic Hackathon** (Devpost). Deadline **2026-08-31 5pm PDT = 08:00 Bangkok Sep 1**.

## What it is
A governed AI partner for messy operational workflows. One loop:
`ingest → sweep → propose → [HUMAN GATE] → execute`. The discipline IS the gate — nothing auto-closes. Rejections/edits persist as **decision memory** and shape future proposals. Framed (with Peak) as **a module in a chain**, not a standalone product: AI prepares one part, human decides, agent executes only approved.

## Architecture
- **Gemini 3.5 Flash** via **Vertex AI global endpoint** (regional us-central1 = 404 for 3.5; global = 200)
- **GenKit** (`@genkit-ai/google-genai`, plugin name `vertexai`, ref `vertexai/gemini-3.5-flash`) — the OLD `@genkit-ai/vertexai` REJECTS location `global`
- **Cloud Run** us-central1, runtime SA `klai-run@klai-agentic.iam` (ADC, no keys in repo)
- **Firestore** native us-central1 — `runs` (board) + `cases` (audit-field state machine: confidence · requires_human_review · approval_status · approved_by · approved_at · execution_status · execution_artifact · reasoning_summary · user_feedback)
- **Cloud Storage** for raw dumps

## Endpoints (src/server.js)
`GET /health` · `POST /ingest` (sweep+propose → board + action cards) · `GET /cases` (pending) · `POST /gate` (approve/reject/edit → decision memory) · `POST /execute` (bounded, approved-only, emits who/what/when artifact) · `POST /hello`.

## Decisions made
- Track **B = Collaborative Partner + decision-memory** (differentiator vs Taskmaster).
- Execute is **bounded**: artifact/patch STORE only — no messages sent, no money moved.
- Region permanent (Firestore location can't move) — us-central1 for CR+Firestore, Vertex global only for the LLM call.
- Demo uses **scrubbed** input (`demo/kol-campaign-scrubbed.txt`); `demo/` is gitignored + dockerignored (PII never leaves the machine).
- No installer/platform level — not a scored criterion.

## Done
- Full loop live: https://klai-agentic-760656259079.us-central1.run.app (rev 00004)
- Repo PUBLIC: https://github.com/peuarchukiati-rgb/klai-agentic
- Gate UI (public/index.html), validated by Peak on 2 real inputs
- DEVPOST-DRAFT.md aligned to final narrative (Follow One Decision + decision-memory proof)

## Video (2026-08-23) — code-gen pipeline in ~/klai-video (separate from this repo)
Narrative converged over many iterations to **"FOLLOW ONE DECISION"**: track one decision (lock a 20-product scope for Brand-1) through raw → state → proposal → gate → reject-with-reason → next-pass-changes. Proof captured LIVE from the deployed app (ingest → reject → re-ingest same input → the approve-scope proposal is gone, replaced by BLOCKED + "present for sign-off"). Current cut = **v8** (~1:08): eclipse-atmosphere stage (corona + starfield + grain), still frames (no ken-burns), persistent loop stepper (RAW→STATE→PROPOSAL→GATE(+human)→EXECUTE ↻ loops), English edge-tts draft voice. Voice = Peak's "KLAI Field Notes" register ("Intelligence is everywhere. Discipline isn't."). Two external reviewers (Clawbie + ChatGPT) verdict = GO.
Build: `~/klai-video/build6.py` → `~/klai-video/out/klai-agentic-v8.mp4`. Narrative: `~/klai-video/NARRATIVE-v6.md`. Clean tokenized input: `~/klai-video/demo-scope.txt`. Data all tokenized (Brand-1/KOL-A/CREATOR-n) — real client source stays scrubbed.

## What's next
1. **Finalize video** (Peak's call): upgrade voice (ElevenLabs or Peak read) + optionally lengthen/polish; then export final.
2. **Submit Devpost** (Peak): paste DEVPOST-DRAFT.md, attach video, repo, live URL.
3. Optional: commit the video pipeline source into the repo (text only; gitignore mp4/audio/shots) once the cut is final.

## Files the next session must read
`~/klai-video/NARRATIVE-v6.md` · `~/klai-video/build6.py` · `DEVPOST-DRAFT.md` · `src/server.js` · `src/pipeline.js` · `README.md`

---
HANDOFF CONTEXT — do not delete; the next session reads this block first
project: klai-agentic (hackathon)
updated: 2026-08-23 11:35 · M3 / L2 session
state: build+repo done & live; video draft v8 "Follow One Decision" (eclipse stage + loop stepper), reviewers say GO — PAUSED as checkpoint with time to spare
next: finalize video voice/polish → submit Devpost (both Peak's hands); code side is done
blocked_on: Peak — voice choice + Devpost form; no code work pending
key_files: ~/klai-video/NARRATIVE-v6.md, ~/klai-video/build6.py, DEVPOST-DRAFT.md, src/server.js, src/pipeline.js
---
