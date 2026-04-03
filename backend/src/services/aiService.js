const axios = require('axios');
const env = require('../config/env');

async function generateReply({ message }) {
  const prompt = `You are a helpful assistant.\nUser: ${message}\nAssistant:`;

  try {
    const res = await axios.post(
      `${env.OLLAMA_URL}/api/generate`,
      {
        model: env.OLLAMA_MODEL,
        prompt,
        stream: false,
      },
      {
        timeout: env.OLLAMA_TIMEOUT_MS,
      },
    );

    const text = res?.data?.response;
    if (!text) return 'No response returned from Ollama.';
    return String(text).trim();
  } catch (err) {
    const statusCode = err?.response?.status || 502;
    let messageText =
      err?.response?.data?.error || err?.message || 'AI request failed';

    const isConnRefused =
      err?.code === 'ECONNREFUSED' || /ECONNREFUSED/i.test(messageText);
    if (isConnRefused) {
      messageText = `Ollama is not reachable at ${env.OLLAMA_URL}`;
    }

    const e = new Error(messageText);
    e.statusCode = statusCode;
    throw e;
  }
}

module.exports = {
  generateReply,
};

