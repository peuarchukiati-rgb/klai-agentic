# KLAI Agentic

A governed AI partner for messy operational workflows. It turns unstructured input into structured state, proposes what should happen next, captures human approvals and edits as decision memory, and executes only approved actions.

> AI prepares. System records. Human approves. Agent executes only approved actions.

Built on **Gemini 3.5 (Vertex AI)**, **GenKit**, **Cloud Run**, **Firestore**, and **Cloud Storage**. Entry for the All Things Agentic Hackathon (Google) — Collaborative Partner track.

## Loop
```
ingest → sweep → propose → [human gate] → execute
```
The discipline is the gate: nothing auto-closes. Rejections and edits persist as decision memory and shape future proposals.

## Stack / GCP
- Runtime: Cloud Run (region `us-central1`)
- LLM: Gemini 3.5 via Vertex AI (`GEMINI_MODEL`)
- State: Firestore (native, `us-central1`) — collection `cases` with audit fields
- Blobs: Cloud Storage (`klai-agentic-dumps-<projectnum>`)
- Framework: GenKit (JS)
- Auth: Application Default Credentials (no API keys in the repo)

## Run locally
```bash
npm install
gcloud auth application-default login           # one-time ADC
export GOOGLE_CLOUD_PROJECT=klai-agentic
export GCP_LOCATION=global                        # Gemini 3.5 lives on the Vertex global endpoint
export GEMINI_MODEL=gemini-3.5-flash
npm start                                        # http://localhost:8080
curl -s localhost:8080/health
curl -s -X POST localhost:8080/hello -H 'content-type: application/json' -d '{"text":"hi"}'
```

## Deploy (Cloud Run)
```bash
gcloud run deploy klai-agentic \
  --source . --region us-central1 --allow-unauthenticated \
  --service-account klai-run@klai-agentic.iam.gserviceaccount.com \
  --set-env-vars GOOGLE_CLOUD_PROJECT=klai-agentic,GCP_LOCATION=global,GEMINI_MODEL=gemini-3.5-flash
```
> Firestore + Cloud Run are in `us-central1`; only the Gemini call uses the Vertex `global` endpoint (Gemini 3.5 returns 404 on regional `us-central1`).

## Endpoints (checkpoint scope)
- `GET /health` — liveness + active model
- `POST /hello` — plumbing proof: Vertex Gemini call + Firestore write
- `POST /gate` — human decision; writes `approval_status` + `user_feedback` (decision memory)
- `POST /propose` — reads prior thread feedback back into a fresh proposal

Real `ingest/sweep/execute` logic + the digest loop land after the first review checkpoint. See `PLAN.md` and `DIGEST-LOOP-PROPOSAL.md`.
