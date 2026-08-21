# VO SCRIPT — read-aloud only (teleprompter)
*Record silent screen first, then read this over it. Calm, ~2.4 words/sec. Pause at ‖ marks. Full map: NARRATION-MAP.md*

---

**[1 · ORIGIN — over the `CLOSED` shot]**

A week ago, my own AI agent made a decision for me. ‖
It read a thread, decided it was handled, and closed it. ‖
`Closed`. ‖
The problem is — I still didn't know what it was. ‖
Nobody approved it. Nobody saw it. ‖
The model wasn't wrong because it was dumb. ‖
It was wrong because nothing made it stop and ask. ‖
That's the gap I kept hitting. Not intelligence. ‖ **Discipline.** ‖
So I built the missing piece — a module that sits between the AI and the human, and refuses to close the loop without you.

---

**[2 · THESIS — over the four-role line]**

It's one loop. ‖
The AI prepares. The system records every state. ‖
The human approves — one decision at a time. ‖
And only then does the agent execute. ‖
Four roles, one seam. ‖
My job in this chain is small, and it's the important one: I decide. ‖
Everything else is built so that I can.

---

**[3a · INGEST — paste the chat, hit Sweep]**

Here's a real one. ‖
A KOL campaign chat — thirty-plus creators, pricing, drafts, slots, all tangled across a morning. ‖
This is the kind of mess that never becomes a plan; it just scrolls away. ‖
I drop the raw thread in. One pass.

**[3b · WOW 1 — board snaps in, hold]**

Structured. ‖
Every creator, what stage they're in, who they're blocked on. ‖
It didn't invent anything — where the chat was silent, it says so.

**[3c · CARDS]**

Then it proposes — only the things that actually need me. ‖
Not a to-do dump. Decisions. ‖
Each card carries its reason, pulled from the thread, so I'm never approving blind. ‖
This is the queue the AI is *not* allowed to clear on its own.

**[3d · WOW 2 — reject, type reason, hold on "remembered"]**

Watch this one. I reject it — and I say why. ‖
That reason doesn't vanish. It's written to memory, against this thread. ‖
Next time the AI proposes, it reads my past decisions back first — ‖
and it won't hand me the same shape I already turned down. ‖
It's not a task-runner. It learns the way I decide.

**[3e · WOW 3 — approve → execute → artifact renders, hold]**

The ones I approve — and only those — the agent executes. ‖
Bounded. It doesn't send messages or move money. ‖
It turns my decision into a concrete, ready artifact — who, what, when. ‖
Approved, executed, and every step is on the record: who approved it, when, and why. ‖
The loop closes — but only because I closed it.

---

**[4 · GENERALIZATION + GCP — second input, then diagram]**

It's not tuned to one kind of mess. ‖
A meeting transcript runs the same loop — same structure, same gate. ‖
Underneath: Gemini on Vertex, Cloud Run, Firestore holding the audit trail. ‖
It's live, it scales to zero, and every decision I made is queryable tomorrow.

---

**[5 · CLOSE — thesis line, then black + URL]**

The AI got smart enough a while ago. ‖
What it's missing isn't a better model — ‖
it's the discipline to stop and let a human decide. ‖
That's the whole module. ‖
I'm not a developer. I built this on Google Cloud in a day. ‖
That's the point.
