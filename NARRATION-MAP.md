# KLAI Agentic — Demo Video Narration Map
*~4:00 · narrative-led (not a product tour) · VO in English · Peak's KFC/KLEAR template*

**Framing:** This is not a standalone product. It's a **module in a chain** — the AI does one part (read the mess, structure it, propose), a human does one part (decide), the agent does the last part (execute only what was approved). The film is about **the seam between AI and human** — where it broke, and how discipline fixes it. Origin-first.

**Style contract (locked from Peak's past videos):**
- ONE continuous screen take for the demo section. Record silent, VO in post.
- Calm/confident VO, ~2.4 words/sec. Total ~460 words.
- 3 wow-beats, each held ~3s: (1) board materializes, (2) reject → "remembered", (3) execute → artifact.
- LLM waits: speed 3–4× but keep ~1.5s of visible progress (proves real work, not a mockup).
- Real app footage only. On-screen callouts pinned to each beat. No mockups.
- Close on builder-not-dev / discipline. One line, then cut.
- Public footage uses the **scrubbed** input only (`demo/kol-campaign-scrubbed.txt`) — no client names.

---

## BEAT 1 — ORIGIN / THE BREAK  ·  0:00–0:38
**On screen:** black → a real chat log scrolling fast (the tg-cockpit auto-close moment, or a stand-in terminal line reading `status: CLOSED`). Cold, still. One red callout pins on the word `CLOSED`.

**VO (~90w):**
> "A week ago, my own AI agent made a decision for me. It read a thread, decided it was handled, and closed it. `Closed`. The problem is — I still didn't know what it was. Nobody approved it. Nobody saw it. The model wasn't wrong because it was dumb. It was wrong because nothing made it stop and ask. That's the gap I kept hitting. Not intelligence. **Discipline.** So I built the missing piece — a module that sits between the AI and the human, and refuses to close the loop without you."

**Callouts:** `CLOSED — nobody approved` → fades → `the missing piece: the gate`

---

## BEAT 2 — THESIS / THE CHAIN  ·  0:38–0:55
**On screen:** a single clean line animates across the screen — the four roles, one arrow between each:
`AI prepares → System records → Human approves → Agent executes only approved`
Each phrase lights as it's spoken.

**VO (~55w):**
> "It's one loop. The AI prepares. The system records every state. The human approves — one decision at a time. And only then does the agent execute. Four roles, one seam. My job in this chain is small and it's the important one: I decide. Everything else is built so that I can."

**Callout:** the word **`approves`** stays lit after the others dim.

---

## BEAT 3 — LIVE LOOP (one take)  ·  0:55–3:15

### 3a — Ingest the mess  ·  0:55–1:20
**On screen:** the real gate UI (dark). Paste the scrubbed KOL coordination chat into the box. Hit **Sweep & Propose**. Show ~1.5s of "sweeping…".

**VO (~55w):**
> "Here's a real one. A KOL campaign chat — thirty-plus creators, pricing, drafts, slots, all tangled across a morning. This is the kind of mess that never becomes a plan; it just scrolls away. I drop the raw thread in. One pass."

### 3b — WOW 1: board materializes  ·  1:20–1:35
**On screen:** the operating view snaps in — campaign state line + the per-creator table (KOL-A…KOL-Z, stage / blocked-on). **Hold 3s.** Callout sweeps down the "Blocked on" column.

**VO (~30w):**
> "Structured. Every creator, what stage they're in, who they're blocked on. It didn't invent anything — where the chat was silent, it says so."

**Callout:** `26 creators · pulled from noise · nothing invented`

### 3c — Action cards / the human's queue  ·  1:35–2:05
**On screen:** scroll to Action Cards. Read one aloud as it's shown (e.g. a pricing-confirm card with its evidence line).

**VO (~50w):**
> "Then it proposes — only the things that actually need me. Not a to-do dump. Decisions. Each card carries its reason, pulled from the thread, so I'm never approving blind. This is the queue the AI is *not* allowed to clear on its own."

**Callout:** `proposes · does not decide`

### 3d — WOW 2: reject → remembered  ·  2:05–2:35
**On screen:** click **Reject** on one card. Type a short reason. Button flips to **`rejected · remembered`**. **Hold 3s.**

**VO (~55w):**
> "Watch this one. I reject it — and I say why. That reason doesn't vanish. It's written to memory, against this thread. Next time the AI proposes, it reads my past decisions back first — and it won't hand me the same shape I already turned down. It's not a task-runner. It learns the way I decide."

**Callout:** `rejection → decision memory → next proposal honors it`

### 3e — Approve → WOW 3: bounded execute  ·  2:35–3:15
**On screen:** click **Approve** on a different card → **Execute**. ~1.5s "executing…" → an artifact `<pre>` block renders (who / what / when task brief). **Hold 3s** on the finished brief.

**VO (~60w):**
> "The ones I approve — and only those — the agent executes. Bounded. It doesn't send messages or move money. It turns my decision into a concrete, ready artifact — who, what, when. Approved, executed, and every step is on the record: who approved it, when, and why. The loop closes — but only because I closed it."

**Callout:** `approved-only · bounded · fully audited`

---

## BEAT 4 — GENERALIZATION + GCP  ·  3:15–3:40
**On screen:** quick cut — paste a totally different input (a Plaud meeting transcript) → same loop runs, same board/cards shape. Then a 3s glance at the architecture diagram (Cloud Run · Vertex Gemini 3.5 · Firestore).

**VO (~50w):**
> "It's not tuned to one kind of mess. A meeting transcript runs the same loop — same structure, same gate. Underneath: Gemini on Vertex, Cloud Run, Firestore holding the audit trail. It's live, it scales to zero, and every decision I made is queryable tomorrow."

**Callout:** `same loop · any input · live on Google Cloud`

---

## BEAT 5 — CLOSE  ·  3:40–4:00
**On screen:** back to the clean thesis line, `approves` lit. Then cut to black with the URL. Still. Quiet.

**VO (~45w):**
> "The AI got smart enough a while ago. What it's missing isn't a better model — it's the discipline to stop and let a human decide. That's the whole module. I'm not a developer. I built this on Google Cloud in a day. That's the point."

**Callout (final card):** `KLAI Agentic — the gate is the discipline` · URL

---

## Shot checklist (record order — not film order)
1. Clean run of the scrubbed KOL input, start→board→cards, ONE take, no cursor fumbling.
2. Reject-with-reason on a card that clearly shouldn't proceed → capture the `remembered` flip.
3. Approve→Execute on a card with a clear date in it → capture the artifact render.
4. Second input (Plaud transcript) → board only (2–3s of footage).
5. Architecture diagram (from ARCHITECTURE.md, render to image) — 3s.
6. The `CLOSED` origin shot — real or restaged terminal line.
7. Thesis line animation (can be built in edit, not screen-recorded).

## Timing math
460 words ÷ 2.4 w/s ≈ 192s of speech across 240s of film → ~48s of breathing room for the held wow-beats. On budget.
