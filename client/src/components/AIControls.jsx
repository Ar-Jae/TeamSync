
import React, { useState } from 'react';

const AIControls = () => {
  const [prompt, setPrompt] = useState('');
  const [summary, setSummary] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSummarize = async () => {
    if (!prompt.trim()) {
      setError('Please enter some text to summarize.');
      return;
    }
    setLoading(true);
    setError('');
    setSummary('');
    try {
      const res = await fetch('/api/summarize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: prompt }),
      });
      const data = await res.json();
      if (data.summary) setSummary(data.summary);
      else setError(data.error || 'No summary returned');
    } catch (err) {
      setError('Failed to fetch summary');
    }
    setLoading(false);
  };

  return (
    <div style={{ marginBottom: 24 }}>
      <h3>AI Summarization</h3>
      <textarea
        value={prompt}
        onChange={e => setPrompt(e.target.value)}
        placeholder="Enter notes or ideas to summarize..."
        style={{ width: '100%', height: 60 }}
      />
      <br />
      <button onClick={handleSummarize} disabled={loading || !prompt.trim()}>
        {loading ? 'Summarizing...' : 'Summarize with AI'}
      </button>
      {summary && (
        <div style={{ marginTop: 16, background: '#f6f6f6', padding: 12, borderRadius: 4 }}>
          <strong>AI Summary:</strong>
          <div>{summary}</div>
        </div>
      )}
      {error && <div style={{ color: 'red', marginTop: 8 }}>{error}</div>}
    </div>
  );
};

export default AIControls;
