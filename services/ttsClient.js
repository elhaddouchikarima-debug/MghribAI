const TTS_MODEL = 'hexgrad/Kokoro-82M';
const TTS_URL = 'https://router.huggingface.co/deepinfra/v1/openai/audio/speech';
const TTS_VOICES = { en: 'af_heart', fr: 'ff_siwis', es: 'ef_dora', it: 'if_sara' };

async function synthesizeWithKokoro(text, lang) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 45000);
  try {
    const response = await fetch(TTS_URL, {
      method: 'POST',
      signal: controller.signal,
      headers: {
        Authorization: `Bearer ${process.env.HF_TOKEN}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ model: TTS_MODEL, input: text, voice: TTS_VOICES[lang] })
    });
    if (!response.ok) {
      const error = new Error(response.status === 429 ? 'rate_limit' : 'tts_provider_error');
      error.status = response.status;
      throw error;
    }
    const audio = Buffer.from(await response.arrayBuffer());
    const contentType = response.headers.get('content-type') || '';
    if (!contentType.startsWith('audio/') || audio.length < 100 || audio.length > 5 * 1024 * 1024) {
      const error = new Error('invalid_tts_response');
      error.status = 502;
      throw error;
    }
    return audio;
  } finally {
    clearTimeout(timeout);
  }
}

module.exports = { synthesizeWithKokoro, TTS_MODEL, TTS_VOICES };
