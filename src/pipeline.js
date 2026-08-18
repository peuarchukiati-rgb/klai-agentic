// Sweep + Propose: messy dump -> structured operating view + gated action cards.
// One Gemini (Vertex 3.5) call returns JSON; honors prior operator decisions
// (decision memory) so past rejections/edits shape new proposals.
import { ai, MODEL_REF } from './genkit.js';

const stripFence = (t) => t.replace(/^\s*```(?:json)?/i, '').replace(/```\s*$/, '').trim();

export async function sweepAndPropose(text, prior = []) {
  const memo = prior.length
    ? `Prior operator decisions on this thread — HONOR them (do not re-propose rejected shapes):\n${prior.map((p) => `- ${p.feedback}`).join('\n')}\n\n`
    : '';
  const prompt = `${memo}You are KLAI's sweep+propose engine. Turn this messy, anonymized operational/coordination chat into a structured operating view plus action cards a manager can approve one by one.
Return ONLY valid JSON (no prose, no code fence) matching exactly:
{
 "campaign_state": "one sentence",
 "items": [{"token":"KOL-A or role","stage":"scheduled|storyline|draft|review|on-hold|published|negotiating|unknown","blocked_on":"who/what or null","note":"short context"}],
 "blocked": ["one short line each — what is stuck and on whom"],
 "deadlines": ["one short line each, with the time if stated"],
 "actions": [{"title":"imperative next action","detail":"why + evidence from the chat","confidence":"low|med|high"}]
}
Rules: do NOT invent facts; use "unknown" where the chat is silent. Keep every identity as its token. 4-8 actions max, the ones that actually need a human decision.

CHAT:
${text}`;
  const { text: out } = await ai.generate({
    model: MODEL_REF,
    prompt,
    config: { temperature: 0.2, maxOutputTokens: 8192, thinkingConfig: { thinkingBudget: 0 } },
  });
  // robust: take the first {...last} block even if the model adds stray text.
  const grab = () => {
    const s = stripFence(out);
    const i = s.indexOf('{'), j = s.lastIndexOf('}');
    return i >= 0 && j > i ? s.slice(i, j + 1) : s;
  };
  try {
    return JSON.parse(grab());
  } catch {
    return { campaign_state: 'parse-failed', items: [], blocked: [], deadlines: [], actions: [], _raw: out.slice(0, 600) };
  }
}
