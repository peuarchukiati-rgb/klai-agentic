# KLAI Agentic — Hackathon Build Plan (v2)

**Event:** All Things Agentic Hackathon (Google) · Devpost
**Deadline:** 2026-08-31, 5:00pm PDT = **08:00 Bangkok, Sep 1** (submit night of Aug 31 BKK, ~13 days from 08-18)
**Track (LOCKED):** Collaborative Partner ($20k) — framed as *governed execution with decision memory*. Auto-eligible secondaries: Individual/Hobbyist ($10k), Best Architectural Design ($5k).
**Build tool:** Claude Code (Opus) — allowed; rules restrict only the *runtime* stack, not the IDE.

---

## 0. The core insight (locked with Peak 2026-08-18)

One skeleton, many flesh. The **gated loop** is the reusable core; the internals per use-case differ.

```
INGEST → SWEEP → PROPOSE → [ HUMAN GATE ] → EXECUTE
 raw     to STORE  plan +     approve/edit/    bounded action on
 in      (state)   confidence  reject (=disc.)  approved items only
```

**The discipline IS the gate.** Everything else can vary; the gate does not. This came from a real dogfood pain: on the morning of 2026-08-18, Peak's own tg-cockpit agent ran a probe→classify→close loop and **auto-closed a decision, skipping Peak** ("logged CLOSED, but in my head I still don't know what this is or what to do"). That failure — agent acts without waiting for the human — is *exactly* the friction this project removes.

### Build once, two skins — CONVERGED to the DIGEST LOOP
Intake form locked 2026-08-18 (interview + 2 sweeps): **daily-dump → overnight process → morning digest → GATE → execute.** No upfront classification (the 4-type router was killed — Peak couldn't commit to a taxonomy he didn't trust; the useful axis is relevance + recurrence + lifecycle-state, not content-type). Full design: **`DIGEST-LOOP-PROPOSAL.md`**.

| stage | Personal skin | Business skin (demo) |
|---|---|---|
| Ingest | Peak's day-long dumps (dump-and-run, mostly tg-cockpit) | messy ops/intake dump |
| Process (overnight, async) | sweep + rank by relevance-to-Peak + recurrence + learn | sweep → structured STORE + upgrade plan |
| Digest (morning, at wake) | threw / matters / learned / build-next | what matters + proposed upgrades |
| **Gate** | **Peak เคาะ per item — never auto-close** | **operator approves per item** |
| Execute (bounded) | promote to memory / build-spec / new skill | build-spec / patch STORE / artifact |
| Venue | component ④ growth-diary + @Scriptorium_Observation_bot (weekly→daily; NOT a new bot) | Cloud Run page + Telegram approve |

Validated on real data: relevance-lens predicts advance-vs-die (matches Peak's own verdicts); recurrence flags the hot thread; night-dump/morning-pickup rhythm proven (11/13 throws 21:00–03:30). Gate pattern already dogfood-proven in `/probe` (decision-card→WAIT). **One build, two payoffs** — hackathon demo runs the business skin; personal skin closes the tg-cockpit gate work.

---

## 1. Why this wins the brief
Judges want *agent + architecture + Google Cloud deploy + 4-min video* — **no public marketing site required.** "Don't want to build a new website" = not a blocker.

| Criterion | Weight | Hit |
|---|---|---|
| Innovation & Operational Utility | 40% | real dogfooded friction (agent skipping the human gate) + bounded *real* execution, not chat |
| Architectural Discipline & Tech Stack | 30% | explicit STORE state, decoupled stages, gate = governance boundary, idempotent/audited |
| Demo & Production Readiness | 30% | visible Cloud Run + Vertex + Firestore in video; clean repo; architecture diagram |

**Collaborative Partner framing (must be explicit in write-up/demo, per Clawbie):** the human doesn't just approve —
- agent asks clarifying questions when confidence is low
- approvals/rejections persist as **decision memory** in STORE
- next proposals improve from prior feedback (learns the operator's working style)

This is KLAI's thesis made literal: **STORE = state → decision memory = the AI learning your judgment.** Not a stretch — it's on-brand. *(Taskmaster = fallback framing only; architecture stays compatible.)*

### Locked copy (reuse verbatim — video / README / deck / Devpost)
- **Positioning:** *KLAI Agentic is a collaborative partner for messy operational workflows, built around explicit state, decision memory, human approval gates, and bounded execution.*
- **Trust:** *AI prepares. System records. Human approves. Agent executes only approved actions.*
- **Track-fit:** *The collaboration is not just conversational; it is operational. KLAI learns from approvals, edits, and rejections and uses that decision memory to shape future proposals.*
- **One-liner (short):** *KLAI Agentic turns unstructured input into structured state, proposes what should happen next, captures human approvals/edits as decision memory, and executes only approved actions — on Gemini, GenKit, Cloud Run, Firestore, Cloud Storage.*

### Claim discipline (submission rule — do not overclaim before the build proves it)
BANNED until demoed real: "learns user preferences over time", "production-ready", "enterprise-grade", "autonomous", "adaptive". Use instead: **designed to / built around / supports / captures decision memory / uses prior feedback to shape future proposals**. The last is allowed ONLY once the demo shows a prior rejection visibly changing the next proposal (= V1 acceptance §6 last item).

---

## 2. Reuse vs build (kill the "build new" fear)
| Piece | Source | Action |
|---|---|---|
| IPSD engine prompts + guardrails | `~/klai-worker/src/worker.js` | reuse verbatim → Propose stage |
| Sweep loop (parse→blueprint→gap→reconcile→log) | `~/.claude/skills/sweep/SKILL.md` | reuse as Sweep stage spec |
| Sweep Log "would-ask-human" points | sweep skill | = the **gate queue**, for free |
| session-harvest classifier + 4-type taxonomy | `~/.claude/skills/session-harvest/`, tg-cockpit session | seeds the personal-skin classifier |
| Gemini wrapper, code-gen, normalizers | worker.js | port JS, swap endpoint → Vertex |
| Telegram notify (`sendPeak`) | worker.js | reuse as gate notification/approve channel |
| klai-web cinematic site | live | untouched, NOT in submission |

Net-new: glue stages into one pipeline, minimal gate UI, bounded execute stage, Google stack wiring. **Port + wire, not rebuild.**

---

## 3. Architecture → Google stack
Mandatory (runtime only): Gemini 3.5+ · ≥1 Google Agent Framework · ≥1 Google Cloud service.

| Layer | Now | Move to | Why |
|---|---|---|---|
| Runtime | Cloudflare Worker (JS) | **Cloud Run** (container, keep JS/TS) | least-rewrite port; visible GCP compute |
| LLM | Gemini free via generativelanguage API | **Gemini 3.5 Flash via Vertex AI** | meets req; Vertex = clean GCP-usage proof |
| Agent framework | none | **GenKit (JS/TS)** | JS-native → reuse engine; flows model the stages. *(ADK=Python → rewrite → avoid in 13 days)* |
| STORE (state) | Cloudflare KV | **Firestore** | queryable state persistence = scores the 30% |
| Blob (dumps) | — | **Cloud Storage** | raw dump store; "massive dataset" framing |
| Gate UI | — | tiny Cloud Run page + Telegram approve | show human-in-loop in video |

**Firestore record shape (audit / state-machine proof, per Clawbie):**
`confidence · requires_human_review · approval_status · approved_by · approved_at · execution_status · execution_artifact_url · reasoning_summary · user_feedback`

**GenKit flows:** `ingest` (→ Cloud Storage) → `sweep` (→ Firestore STORE + Sweep Log) → `propose` (IPSD engine → plan + confidence) → `gate` (surface pending → approve/edit/reject → persist) → `execute` (approved items only → artifact → Firestore + notify).

**Architecture guarantees to state in README/diagram/narration (cheap points):** each stage writes explicit state · retries don't duplicate execution · execution only on approved items · every decision logged.

---

## 4. Execute stage — BOUNDED (v1 scope, per Clawbie)
Execute = *real but bounded*. Only these:
- generate structured build-spec
- patch/update STORE
- emit approved action artifact (task / brief / output package)

Judges reward reliable over overclaimed. No broad "act on the whole world" integrations.

---

## 5. Non-goals (guard scope creep)
- no multi-tenant auth
- no rich product dashboard
- no fully-autonomous high-risk actions
- no action integrations beyond the bounded executor
- klai-web redesign is out of scope

## 6. V1 demo acceptance criteria
- [ ] raw dump accepted (paste/file/GCS)
- [ ] structured STORE persisted to Firestore
- [ ] proposal generated with confidence tags
- [ ] human approves ≥1 item at the gate
- [ ] approved item executes → visible artifact
- [ ] end-to-end run visible on Cloud Run / Vertex / Firestore
- [ ] one prior rejection visibly shapes the next proposal (decision-memory proof — the Collaborative Partner differentiator)

## 7. Risk register
| Risk | Mitigation |
|---|---|
| Vertex auth/config delay | do D1-2 first, hello-world before engine |
| GenKit integration friction | keep engine logic in plain JS modules; GenKit only wraps flows |
| Gate UI time sink | tiny page only (pending / confidence / approve-reject-edit / result) |
| Execute over-expansion | hard-bounded list (§4); anything else = non-goal |
| Weak dataset/demo story | pick + lock demo dump early (§9); rehearse 10-sec comprehension |
| Scope creep + framing drift | §5 non-goals + Collaborative-Partner language in every surface |

## 8. Fallback submission plan
If execute isn't fully done by deadline: submit with **bounded artifact execution only**, emphasize the *governed action pipeline* + show partial-but-real E2E. A clean small loop beats a broken big one.

---

## 9. Timeline — 13 days
| Day | Milestone |
|---|---|
| D1–2 (18–19) | GCP: enable Vertex/Firestore/GCS/Cloud Run; hello-world GenKit flow on Cloud Run calling Gemini 3.5 |
| D3–4 | port `gemini()` + IPSD prompts into GenKit; `sweep` → Firestore STORE + Sweep Log on a real dump |
| D5–6 | `propose` flow → plan+confidence; wire Firestore state between stages; audit fields |
| D7–8 | gate: tiny Cloud Run page + Telegram approve; decisions persist; decision-memory feeds next propose |
| D9 | bounded `execute`; end-to-end dry run (business skin) |
| D10 | architecture diagram + README spin-up |
| D11 | record ~4-min demo video (live run on GCP) |
| D12 | polish, cost check ($150 credit), edge cases, personal-skin pass (closes tg-cockpit skill) |
| D13 (31) | submit before 5pm PDT / night of Aug 31 BKK |

## 10. Submission checklist
- [ ] category = Collaborative Partner
- [ ] hosted URL (Cloud Run) — optional but do it
- [ ] text description: features, tech, data sources, learnings (lead with the dogfood story)
- [ ] public repo (this folder) + README spin-up
- [ ] architecture diagram
- [ ] ~4-min demo video
- [ ] (bonus) Substack/social + #AllThingsAgenticHackathon

---

## 11. Decisions (locked 2026-08-18 — Peak เคาะ)
- **Digest delivery = 08:00** BKK (Peak wake). Overnight process window ~03:30–07:30.
- **Gateway = Cloud Run gate page (primary, video hero) + Telegram (secondary, reuse `sendPeak()`).** NOT WhatsApp / NOT Discord — channel is not a scoring point; the page carries human-approve-visible.
- **Repo = public. Entry = solo** (Individual/Hobbyist $10k eligible).

### Still open (parked — NOT blocking D1)
- **Demo dataset** — one messy business/ops intake dump non-experts grok in 10 sec (+ 1 backup, same flow). KLAI intake transcript = on-brand but watch jargon. Decide during build.

---

HANDOFF CONTEXT — do not delete; the next session reads this block first
project: klai-agentic (hackathon entry)
updated: 2026-08-18 · M3 / L2
state: LOCKED — track B (Collaborative Partner + decision-memory), GenKit, one gated-loop engine + 2 skins. Intake CONVERGED to the DIGEST LOOP; 4-type router killed. Open items CLOSED 2026-08-18: digest=08:00, gate=Cloud Run page + Telegram, repo=public, entry=solo, learned-overnight + lens-v1 confirmed as-designed. Only demo dataset parked. Validated on real data. See DIGEST-LOOP-PROPOSAL.md. Nothing built yet.
next: D1-2 — GCP enable Vertex+Firestore+GCS+Cloud Run, hello-world GenKit flow on Cloud Run calling Gemini 3.5. Personal skin = upgrade component ④ growth-diary to daily 08:00 overnight-digest + gate.
blocked_on: Peak go on D1 build (demo dataset pick during build — not blocking)
key_files: PLAN.md (this) · ~/klai-worker/src/worker.js (engine to port) · ~/.claude/skills/sweep/SKILL.md · ~/.claude/skills/session-harvest/SKILL.md · tg-cockpit session 1dc2b63c-81c3-4d0c-9e42-516f51d0d080.jsonl (the skill fight)
---
