// GenKit + Vertex AI wiring via the @genkit-ai/google-genai plugin (the older
// @genkit-ai/vertexai plugin rejects the 'global' location, where Gemini 3.5 lives).
// Auth via ADC (local: gcloud auth application-default; Cloud Run: klai-run SA).
// No API key in the repo.
import { genkit } from 'genkit';
import { vertexAI } from '@genkit-ai/google-genai';

// Gemini 3.5 is served on the Vertex 'global' endpoint (404 on us-central1 regional).
// Firestore + Cloud Run stay in us-central1; only the model call uses 'global'.
const LOCATION = process.env.GCP_LOCATION || 'global';

export const ai = genkit({
  plugins: [vertexAI({ location: LOCATION })],
});

// Bare model id; ai.generate() is called with `vertexai/${MODEL}`.
export const MODEL = process.env.GEMINI_MODEL || 'gemini-3.5-flash';
export const MODEL_REF = `vertexai/${MODEL}`;
