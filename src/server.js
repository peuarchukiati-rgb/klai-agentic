// KLAI Agentic — Cloud Run entrypoint.
// Loop: ingest (dump) -> sweep+propose (structured board + action cards)
// -> HUMAN GATE (approve/reject/edit, never auto-close) -> bounded execute.
// Decision memory: rejections/edits persist and shape future proposals.
import express from 'express';
import { ai, MODEL, MODEL_REF } from './genkit.js';
import { db, CASES, newAuditDoc, priorFeedback } from './firestore.js';
import { sweepAndPropose } from './pipeline.js';

const app = express();
app.use(express.json({ limit: '4mb' }));
app.use(express.static('public'));

const log = (case_id, stage, status, error) =>
  console.log(JSON.stringify({ case_id, stage, status, ...(error ? { error } : {}) }));
const newId = (p) => `${p}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;

app.get('/health', (_req, res) => res.status(200).json({ ok: true, model: MODEL }));

// INGEST: messy dump -> structured board + gated action cards.
app.post('/ingest', async (req, res) => {
  const { text, thread } = req.body || {};
  if (!text) return res.status(400).json({ error: 'text required' });
  const run_id = newId('RUN');
  try {
    const prior = await priorFeedback(thread);
    const r = await sweepAndPropose(text, prior);
    await db.collection('runs').doc(run_id).set({
      run_id, thread: thread || null,
      campaign_state: r.campaign_state, items: r.items || [], blocked: r.blocked || [], deadlines: r.deadlines || [],
      used_prior_feedback: prior, created_at: new Date().toISOString(),
    });
    const cards = [];
    for (const a of (r.actions || [])) {
      const case_id = newId('CARD');
      await db.collection(CASES).doc(case_id).set(newAuditDoc({
        case_id, run_id, thread: thread || null, stage: 'propose',
        title: a.title, detail: a.detail, confidence: a.confidence || 'med', reasoning_summary: a.detail,
      }));
      cards.push({ case_id, ...a });
    }
    log(run_id, 'ingest', 'ok');
    res.json({ run_id, board: { campaign_state: r.campaign_state, items: r.items, blocked: r.blocked, deadlines: r.deadlines }, cards, ...(r._raw ? { _debug: r._raw } : {}) });
  } catch (e) {
    log(run_id, 'ingest', 'error', e.message);
    res.status(500).json({ run_id, error: e.message });
  }
});

// List pending action cards for the gate UI.
app.get('/cases', async (_req, res) => {
  try {
    const snap = await db.collection(CASES).where('approval_status', '==', 'pending').limit(50).get();
    const cards = snap.docs
      .filter((d) => d.get('stage') === 'propose')
      .map((d) => ({ case_id: d.id, title: d.get('title'), detail: d.get('detail'), confidence: d.get('confidence'), run_id: d.get('run_id'), execution_status: d.get('execution_status') }));
    res.json(cards);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// HUMAN GATE: a decision. No auto-close. Writes decision memory.
app.post('/gate', async (req, res) => {
  const { case_id, decision, reason, thread } = req.body || {};
  if (!case_id || !decision) return res.status(400).json({ error: 'case_id + decision required' });
  const approval_status = decision === 'reject' ? 'rejected' : decision === 'edit' ? 'edited' : 'approved';
  try {
    await db.collection(CASES).doc(case_id).set(
      { approval_status, approved_by: 'peak', approved_at: new Date().toISOString(), user_feedback: reason || null, ...(thread ? { thread } : {}) },
      { merge: true }
    );
    log(case_id, 'gate', approval_status);
    res.json({ case_id, approval_status });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// EXECUTE: bounded, approved-only. Emits an artifact / patches STORE.
app.post('/execute', async (req, res) => {
  const { case_id } = req.body || {};
  if (!case_id) return res.status(400).json({ error: 'case_id required' });
  try {
    const snap = await db.collection(CASES).doc(case_id).get();
    if (snap.get('approval_status') !== 'approved') {
      return res.json({ case_id, execution_status: 'skipped-not-approved' });
    }
    // bounded: turn the approved action into a concrete brief artifact (no side effects beyond STORE).
    const { text: artifact } = await ai.generate({
      model: MODEL_REF,
      prompt: `Turn this approved action into a tight, ready-to-send task brief (who / what / when, 3-5 lines). For "when", use the specific date/time stated in the action or context if present (e.g. "10:00 tomorrow", "Aug 6"); if none is stated, write "no date stated" — never a placeholder like [Insert Date]. Action: ${snap.get('title')}\nContext: ${snap.get('detail')}`,
      config: { temperature: 0.3, maxOutputTokens: 800 },
    });
    await db.collection(CASES).doc(case_id).set({ execution_status: 'done', stage: 'execute', execution_artifact: artifact }, { merge: true });
    log(case_id, 'execute', 'done');
    res.json({ case_id, execution_status: 'done', artifact });
  } catch (e) {
    log(case_id, 'execute', 'error', e.message);
    res.status(500).json({ error: e.message });
  }
});

// Decision-memory smoke endpoint (kept from checkpoint).
app.post('/hello', async (req, res) => {
  const caseId = newId('HELLO');
  try {
    const { text } = await ai.generate({ model: MODEL_REF, prompt: req.body?.text || 'Say hi from KLAI Agentic.' });
    res.json({ case_id: caseId, model: MODEL, response: text });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

const port = process.env.PORT || 8080;
app.listen(port, () => console.log(JSON.stringify({ stage: 'boot', status: 'listening', port })));
