// Firestore client + the `cases` document shape (audit fields = state-machine proof).
// Auth via ADC. Project resolved from ADC / GOOGLE_CLOUD_PROJECT / metadata.
import { Firestore } from '@google-cloud/firestore';

export const db = new Firestore();
export const CASES = 'cases';

// The audit-field shape from PLAN §3 — every case carries governance state.
export function newAuditDoc(fields = {}) {
  return {
    confidence: null,
    requires_human_review: true,
    approval_status: 'pending', // pending | approved | rejected | edited
    approved_by: null,
    approved_at: null,
    execution_status: 'none', // none | running | done | failed
    execution_artifact_url: null,
    reasoning_summary: null,
    // decision-memory: rejection_reason / operator_edit land here and are read
    // back by future propose() calls on the same thread.
    user_feedback: null,
    created_at: new Date().toISOString(),
    ...fields,
  };
}

// Decision-memory read: prior human feedback (rejections/edits) for a thread.
// Dumb for now (last N), but the architectural hook is live from checkpoint 1.
export async function priorFeedback(thread, limit = 5) {
  if (!thread) return [];
  const snap = await db
    .collection(CASES)
    .where('thread', '==', thread)
    .where('approval_status', 'in', ['rejected', 'edited'])
    .limit(limit)
    .get();
  return snap.docs.map((d) => ({ case_id: d.id, feedback: d.get('user_feedback') }));
}
