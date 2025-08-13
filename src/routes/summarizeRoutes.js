// summarizeRoutes.js
const express = require('express');
const router = express.Router();
const { summarizeText } = require('../../services/openaiService');

router.post('/', async (req, res) => {
  try {
    const { text } = req.body;
    if (!text) return res.status(400).json({ error: 'Text is required' });
    const summary = await summarizeText(text);
    res.json({ summary });
  } catch (err) {
    if (err.response && err.response.status === 401) {
      return res.status(401).json({ error: 'OpenAI API key is missing or invalid.' });
    }
    if (err.response && err.response.status === 429) {
      return res.status(429).json({ error: 'You have reached the OpenAI usage limit. Please try again later.' });
    }
    res.status(500).json({ error: err.message || 'Internal server error' });
  }
});

module.exports = router;
