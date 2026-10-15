const WHISPER_MODEL = 'openai/whisper-large-v3';
const WHISPER_URL = `https://router.huggingface.co/hf-inference/models/${WHISPER_MODEL}`;

async function transcribeWithWhisper(audio, mimeType) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 55000);
  try {
    const response = await fetch(WHISPER_URL, {
      method: 'POST',
      signal: controller.signal,
      headers: {
        Authorization: `Bearer ${process.env.HF_TOKEN}`,
        'Content-Type': mimeType,
        'X-Wait-For-Model': 'true'
      },
      body: audio
    });
    if (!response.ok) {
      const error = new Error(response.status === 429 ? 'rate_limit' : 'speech_provider_error');
      error.status = response.status;
      throw error;
    }
    const result = await response.json();
    const text = Array.isArray(result) ? result[0]?.text : result?.text;
    if (typeof text !== 'string' || !text.trim()) {
      const error = new Error('empty_transcription');
      error.status = 422;
      throw error;
    }
    return text.trim();
  } finally {
    clearTimeout(timeout);
  }
}

module.exports = { transcribeWithWhisper, WHISPER_MODEL };
