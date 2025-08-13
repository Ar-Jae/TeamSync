// openaiService.js
// Service to interact with OpenAI API for summarization

const axios = require('axios');

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';

async function summarizeText(text) {
  if (!OPENAI_API_KEY) throw new Error('OpenAI API key not set');
  const response = await axios.post(
    OPENAI_API_URL,
    {
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: 'You are a helpful assistant that summarizes notes.' },
        { role: 'user', content: `Summarize the following notes:\n${text}` }
      ],
      max_tokens: 150,
      temperature: 0.5
    },
    {
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json'
      }
    }
  );
  return response.data.choices[0].message.content.trim();
}

module.exports = { summarizeText };
