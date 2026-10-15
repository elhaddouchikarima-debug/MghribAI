const MODEL = 'swiss-ai/Apertus-v1.5-70B:featherless-ai';
const CHAT_COMPLETIONS_URL = 'https://router.huggingface.co/v1/chat/completions';

function sanitizeProviderDetail(detail) {
  let safe = String(detail || '').replace(/[\u0000-\u001f\u007f]+/g, ' ').trim();
  if (process.env.HF_TOKEN) safe = safe.split(process.env.HF_TOKEN).join('[redacted]');
  safe = safe.replace(/Bearer\s+[^\s,;"']+/gi, 'Bearer [redacted]');
  return safe.slice(0, 220);
}

async function createChatCompletion(messages, { maxTokens = 1200, timeoutMs = 45000 } = {}) {
  if (!process.env.HF_TOKEN) {
    const error = new Error('Translation service is not configured');
    error.status = 503;
    error.code = 'missing_token';
    throw error;
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  try {
    let response;
    try {
      response = await fetch(CHAT_COMPLETIONS_URL, {
        method: 'POST',
        signal: controller.signal,
        headers: {
          Authorization: `Bearer ${process.env.HF_TOKEN}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: MODEL,
          messages,
          temperature: 0.2,
          max_tokens: maxTokens,
          stream: false
        })
      });
    } catch (error) {
      if (error.name === 'AbortError') throw error;
      const networkError = new Error('huggingface_network_error');
      networkError.code = 'network_error';
      throw networkError;
    }
    if (!response.ok) {
      const error = new Error(response.status === 429 ? 'rate_limit' : 'provider_error');
      error.status = response.status;
      error.code = 'provider_error';
      const responseBody = await response.text().catch(() => '');
      try {
        const parsed = JSON.parse(responseBody);
        const detail = parsed.error?.message || parsed.error || parsed.message || parsed.detail || '';
        error.providerDetail = sanitizeProviderDetail(detail);
      } catch {
        error.providerDetail = sanitizeProviderDetail(responseBody);
      }
      throw error;
    }
    const payload = await response.json();
    const content = payload.choices?.[0]?.message?.content;
    if (typeof content !== 'string' || !content.trim()) {
      const error = new Error('invalid_response');
      error.status = 502;
      error.code = 'invalid_response';
      throw error;
    }
    return content;
  } finally {
    clearTimeout(timeout);
  }
}

function parseJsonObject(content) {
  try {
    const value = JSON.parse(content);
    if (value && typeof value === 'object' && !Array.isArray(value)) return value;
  } catch { /* try a fenced or surrounded JSON object */ }
  const first = content.indexOf('{');
  const last = content.lastIndexOf('}');
  if (first >= 0 && last > first) {
    try {
      const value = JSON.parse(content.slice(first, last + 1));
      if (value && typeof value === 'object' && !Array.isArray(value)) return value;
    } catch { /* handled by caller */ }
  }
  const error = new Error('invalid_response');
  error.status = 502;
  error.code = 'invalid_response';
  throw error;
}

module.exports = { createChatCompletion, parseJsonObject, sanitizeProviderDetail };
