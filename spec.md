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
- Video docs: NARRATION-MAP.md (4-min structure) + VO-SCRIPT.md (teleprompter)
- DEVPOST-DRAFT.md 90% (repo link + demo-proof filled)

## What's next
1. **Record ~4-min video** (Peak): screen-record the scrubbed KOL run one-take → read VO-SCRIPT over it → capture 3 wow-beats (board / reject·remembered / execute-artifact).
2. **Submit Devpost** (Peak): paste DEVPOST-DRAFT.md, attach video link, repo, live URL.

## Files the next session must read
`NARRATION-MAP.md` · `VO-SCRIPT.md` · `DEVPOST-DRAFT.md` · `src/server.js` · `src/pipeline.js` · `README.md`

---
HANDOFF CONTEXT — do not delete; the next session reads this block first
project: klai-agentic (hackathon)
updated: 2026-08-21 15:05 · M3 / L2 session
state: build DONE + repo PUBLIC + video docs ready; loop live on Cloud Run, validated on 2 inputs
next: Peak records ~4-min video (screen-record scrubbed run + read VO-SCRIPT), then submit Devpost
blocked_on: Peak's hands only (screen recording + Devpost form) — no code work left
key_files: NARRATION-MAP.md, VO-SCRIPT.md, DEVPOST-DRAFT.md, src/server.js, src/pipeline.js
---
