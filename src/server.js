// KLAI Agentic — Cloud Run entrypoint.
// Checkpoint scope: prove the pipe (Vertex + Firestore) + a live decision-memory hook.
// Real ingest→sweep→propose→gate→execute logic lands after Peak's review.
import express from 'express';
import { ai, MODEL, MODEL_REF } from './genkit.js';
import { db, CASES, newAuditDoc, priorFeedback } from './firestore.js';

const app = express();
app.use(express.json({ limit: '4mb' }));

const log = (case_id, stage, status, error) =>
  console.log(JSON.stringify({ case_id, stage, status, ...(error ? { error } : {}) }));

const newId = (p) => `${p}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;

app.get('/health', (_req, res) => res.status(200).json({ ok: true, model: MODEL }));

// Plumbing proof: Vertex Gemini call + Firestore write, in one request.
app.post('/hello', async (req, res) => {
  const caseId = newId('HELLO');
  try {
    const prompt = req.body?.text || 'Say hi from KLAI Agentic in one short sentence.';
    const { text } = await ai.generate({ model: MODEL_REF, prompt });
    await db.collection(CASES).doc(caseId).set(
      newAuditDoc({ case_id: caseId, stage: 'hello', status: 'ok', reasoning_summary: text })
    );
    log(caseId, 'hello', 'ok');
    res.json({ case_id: caseId, model: MODEL, response: text });
  } catch (e) {
    log(caseId, 'hello', 'error', e.message);
    res.status(500).json({ case_id: caseId, error: e.message });
  }
});

// Decision-memory hook (minimal): a human decision writes feedback onto the case.
app.post('/gate', async (req, res) => {
  const { case_id, decision, reason, thread } = req.body || {};
  if (!case_id || !decision) return res.status(400).json({ error: 'case_id + decision required' });
  const status = decision === 'reject' ? 'rejected' : decision === 'edit' ? 'edited' : 'approved';
  try {
    await db.collection(CASES).doc(case_id).set(
      {
        approval_status: status,
        approved_by: 'peak',
        approved_at: new Date().toISOString(),
        user_feedback: reason || null,
        ...(thread ? { thread } : {}),
      },
      { merge: true }
    );
    log(case_id, 'gate', status);
    res.json({ case_id, approval_status: status });
  } catch (e) {
    log(case_id, 'gate', 'error', e.message);
    res.status(500).json({ error: e.message });
  }
});

// Decision-memory read-back: propose pulls prior rejections/edits for the thread
// into context. Proves the loop is Collaborative Partner, not Taskmaster-with-gate.
app.post('/propose', async (req, res) => {
  const caseId = newId('PROP');
  const { thread, text } = req.body || {};
  try {
    const prior = await priorFeedback(thread);
    const memoryNote = prior.length
      ? `Prior operator feedback on this thread (honor it):\n${prior.map((p) => `- ${p.feedback}`).join('\n')}`
      : 'No prior feedback on this thread.';
    const prompt = `${memoryNote}\n\nDraft a short proposal for: ${text || '(no input)'}`;
    const { text: out } = await ai.generate({ model: MODEL_REF, prompt });
    await db.collection(CASES).doc(caseId).set(
      newAuditDoc({ case_id: caseId, stage: 'propose', thread: thread || null, reasoning_summary: out })
    );
    log(caseId, 'propose', 'ok');
    res.json({ case_id: caseId, used_prior_feedback: prior, proposal: out });
  } catch (e) {
    log(caseId, 'propose', 'error', e.message);
    res.status(500).json({ error: e.message });
  }
});

const port = process.env.PORT || 8080;
app.listen(port, () => console.log(JSON.stringify({ stage: 'boot', status: 'listening', port })));
