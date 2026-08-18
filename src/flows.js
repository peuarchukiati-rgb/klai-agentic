// The digest loop as GenKit flows (Google Agent Framework mandate).
// SKELETON: stubs wire the shape + state; real sweep/propose/execute logic
// (against Peak's chosen demo dataset) lands after the review checkpoint.
import { z } from 'genkit';
import { ai, MODEL_REF } from './genkit.js';
import { db, CASES, newAuditDoc, priorFeedback } from './firestore.js';
import { newCode } from './engine.js';

// INGEST — dump-and-run: capture raw, no classification, zero friction.
export const ingestFlow = ai.defineFlow(
  { name: 'ingest', inputSchema: z.object({ text: z.string(), thread: z.string().optional() }), outputSchema: z.object({ case_id: z.string() }) },
  async ({ text, thread }) => {
    const case_id = newCode('CASE');
    await db.collection(CASES).doc(case_id).set(newAuditDoc({ case_id, stage: 'ingest', thread: thread || null, raw: text }));
    return { case_id };
  }
);

// SWEEP — structure raw into state (skeleton: single-pass; ranking by
// relevance + recurrence lands post-review).
export const sweepFlow = ai.defineFlow(
  { name: 'sweep', inputSchema: z.object({ case_id: z.string() }), outputSchema: z.object({ case_id: z.string(), structured: z.string() }) },
  async ({ case_id }) => {
    const snap = await db.collection(CASES).doc(case_id).get();
    const raw = snap.get('raw') || '';
    const { text } = await ai.generate({ model: MODEL_REF, prompt: `Reconcile this into a short structured note (what it is, why it might matter):\n\n${raw}` });
    await db.collection(CASES).doc(case_id).set({ structured: text, stage: 'sweep' }, { merge: true });
    return { case_id, structured: text };
  }
);

// PROPOSE — draft next action, honoring prior human feedback on the thread
// (decision memory read-back = Collaborative Partner differentiator).
export const proposeFlow = ai.defineFlow(
  { name: 'propose', inputSchema: z.object({ case_id: z.string(), thread: z.string().optional() }), outputSchema: z.object({ case_id: z.string(), proposal: z.string() }) },
  async ({ case_id, thread }) => {
    const snap = await db.collection(CASES).doc(case_id).get();
    const prior = await priorFeedback(thread);
    const memo = prior.length ? `Prior operator feedback (honor it):\n${prior.map((p) => `- ${p.feedback}`).join('\n')}\n\n` : '';
    const { text } = await ai.generate({ model: MODEL_REF, prompt: `${memo}Propose the next concrete action for:\n${snap.get('structured') || snap.get('raw') || ''}` });
    await db.collection(CASES).doc(case_id).set({ reasoning_summary: text, stage: 'propose', requires_human_review: true }, { merge: true });
    return { case_id, proposal: text };
  }
);

// GATE — human decision. No auto-close. Writes decision memory.
export const gateFlow = ai.defineFlow(
  { name: 'gate', inputSchema: z.object({ case_id: z.string(), decision: z.enum(['approve', 'reject', 'edit']), reason: z.string().optional(), thread: z.string().optional() }), outputSchema: z.object({ case_id: z.string(), approval_status: z.string() }) },
  async ({ case_id, decision, reason, thread }) => {
    const approval_status = decision === 'reject' ? 'rejected' : decision === 'edit' ? 'edited' : 'approved';
    await db.collection(CASES).doc(case_id).set({ approval_status, approved_by: 'peak', approved_at: new Date().toISOString(), user_feedback: reason || null, ...(thread ? { thread } : {}) }, { merge: true });
    return { case_id, approval_status };
  }
);

// EXECUTE — bounded: only runs on approved items; emits an artifact / patches STORE.
export const executeFlow = ai.defineFlow(
  { name: 'execute', inputSchema: z.object({ case_id: z.string() }), outputSchema: z.object({ case_id: z.string(), execution_status: z.string() }) },
  async ({ case_id }) => {
    const snap = await db.collection(CASES).doc(case_id).get();
    if (snap.get('approval_status') !== 'approved') {
      return { case_id, execution_status: 'skipped-not-approved' };
    }
    // skeleton: real bounded execution (build-spec / patch STORE / artifact) post-review.
    await db.collection(CASES).doc(case_id).set({ execution_status: 'done', stage: 'execute' }, { merge: true });
    return { case_id, execution_status: 'done' };
  }
);
