# The Digest Loop — converged proposal (2026-08-18)

Replaces the abandoned **4-type router**. Result of an interview + 2 timeboxed sweeps with Peak. This is the shape of the engine's intake/gate — one engine, two skins.

---

## Why the 4-type router died
Peak couldn't เคาะ it — it forced committing to a taxonomy (① external / ② thesis / ③ creative / ④ internal) he didn't trust ("ยังไม่รู้"). Real observation from Peak: content-TYPE is noisy — his own thoughts don't arrive as "posts", and external noise dominates volume. **The useful axis isn't "what is it" — it's "does it matter to ME · does it recur · what lifecycle-state is it in".** Classification dissolves; lifecycle + relevance replace it.

## The shape
**Daily-dump → overnight process → morning digest → GATE → execute.**

1. **INGEST** — throw all day, zero friction, dump-and-run. **No classification asked at capture.**
2. **PROCESS** (overnight, async, *while Peak sleeps*) — agent sweeps the day's dumps → structures → **ranks by relevance-to-Peak (user-model lens) + recurrence** → enriches/learns → drafts "what could be built next".
3. **DIGEST** (morning, at wake) — a shaped list: *"yesterday you threw X · what matters to you (ranked) · what it learned overnight · what could be built · how it gets cooler."* Recurrence-weighted: hot threads top, one-offs skimmable.
4. **GATE** — Peak reviews the digest, เคาะ per item. **Nothing auto-closed.** (= the fix to the 2026-08-18 gate-skip bug.)
5. **EXECUTE** — approved items only → **bounded** (build-spec / patch STORE / promote to memory / emit artifact).

## Evidence (validated on real data, not assumed)
1. **Relevance-lens works** — on 13 real throws (Aug 16–18 landing ledger), relevance-to-Peak predicted which advanced vs died, matching Peak's own verdicts: external-noise (Munder=vaporware, Terminal3=not-our-build, Arak=pitch>code) → low → parked/left; on-thesis (Deep Review, unsloth, KLAI-thesis-fork, containment×3, autoresearch) → high → taken/adapted/closed.
2. **Recurrence is real + meaningful** — containment/protocol thread recurred 5× across Aug 17–18 = the hot thread; a recurrence-weighted digest surfaces it top, correctly.
3. **Night-dump / morning-pickup rhythm proven** — 11/13 throws land **21:00–03:30**; the only morning activity (08:17, 08:37) = *closing the night's work*. → overnight-batch → morning-digest fits Peak's actual life rhythm. "Work while I sleep, deliver at wake" = behavior, not aspiration.

**Caveat (honest):** small sample (13 throws, 3 days, KLAI-heavy). Enough signal for a 13-day demo; NOT proof the lens survives diverse high-volume noise.

## Design rules (extracted from the interview — non-negotiable)
- **Capture = auto/invisible · decide = human/surfaced/waited-on** (Peak's own line).
- **Don't nudge on first sight.** Let items ride; surface on **recurrence**, not immediacy.
- **Let noise die quietly** — unordered company/test dumps never resurface.
- **Default = dump→daily digest · escape hatch = the rare hot one → dig live now inline** (not either/or; Peak said hot ones are few).
- **Relevance ranking REQUIRES a user-model.** Peak's moat: he already has one (Scriptorium/memory/directions) → port it as the lens. Others building a digest can't rank *to you* — he can.
- **Never auto-close. The digest is a gate, not a report.**

## Two skins, one engine
| | Personal skin | Business skin (hackathon demo) |
|---|---|---|
| Ingest | Peak's day-long dumps (mostly via tg-cockpit / Telegram) | messy ops/intake dump |
| Process | overnight sweep + relevance-rank + learn | async sweep → structured STORE + upgrade plan |
| Digest | morning: threw / matters / learned / build-next | "what matters + proposed upgrades" |
| Gate | Peak เคาะ per item | operator approves per item |
| Execute | promote to memory / build-spec / new skill | build-spec / patch STORE / artifact |
| **Venue** | **plugs into component ④ growth-diary + @Scriptorium_Observation_bot (already designed — change weekly→daily overnight-digest + gate; NOT a new orphan bot)** | Cloud Run page + Telegram approve |

## Maps to hackathon (why this is the strongest version yet)
- **async background heavy-lifting** = the overnight process → *literally the hackathon theme*
- **decision-memory** (Collaborative Partner differentiator) = the relevance-lens learning from approvals + recurrence
- **gate = discipline** = the fix to a real, dogfooded bug (agent skipped Peak's decision this very morning)
- **STORE / Firestore** = state + user-model + audit fields
- **10-sec-understandable demo:** "dump all day → wake up to a digest you approve." Anyone gets it (Clawbie's demo-dataset requirement satisfied).

## Build implication
The **gate pattern already exists + is dogfood-proven** in `/probe` (decision-card → WAIT, fixed 2026-08-18). So: personal skin ≈ upgrade component ④ to daily + relevance-rank; business skin = the same loop on the Google stack (GenKit / Cloud Run / Vertex / Firestore). Not a rebuild — a wire-up.

## Closed (2026-08-18 — Peak เคาะ)
- **Digest delivery time = 08:00** (Peak's wake). Overnight process window ~03:30–07:30 (fits last-throw-lands-03:30 rhythm).
- **Gate channel = Cloud Run gate page (primary, video hero) + Telegram (secondary, reuse `sendPeak()`).** NOT WhatsApp (Business-API overhead) / NOT Discord (unused). Channel ≠ scoring point — judges score *human-approve-visible*, which the page carries.
- **"learned overnight" generation** = agent re-reads the day's dumps + enriches against the user-model. (confirmed as-designed)
- **relevance-lens v1** = seed from existing memory + CLAUDE.md directions; grows from gate decisions (decision-memory). (confirmed as-designed)
- **Repo = public · Entry = solo** (Individual/Hobbyist $10k eligible).

## Still open (parked — NOT blocking D1)
- **Demo dataset** — one messy business/ops intake dump non-experts grok in 10 sec (+1 backup). Decide during build.
