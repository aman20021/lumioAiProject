// components/PromptInput.tsx
'use client';
import React, { useState } from 'react';
import EmailForm from './EmailForm';

const PromptInput: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResponse('');

        try {
            const res = await fetch('/api/prompt', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ prompt }),
            });
            console.log("data" , res);
            const data = await res.json();
            console.log("data" , data);
        if (res.ok) {
            setResponse(data.result);
        } else {
            setResponse(`Error: ${data.error || 'Something went wrong'}`);
        }

        } catch (error) {
            setResponse(`Error: ${(error as Error).message}`);
        } finally {
            setLoading(false);
        }


  };

  return (
    <div style={{ maxWidth: 600, margin: 'auto', padding: 20 }}>
      <h2>Enter a Prompt</h2>

      <form onSubmit={handleSubmit}>
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          rows={4}
          placeholder="Type your prompt here..."
          style={{ width: '100%', padding: 10, fontSize: 16 }}
        />

        <button type="submit" disabled={loading} style={{ marginTop: 10 , cursor: loading ? 'not-allowed' : 'pointer',}} >
          {loading ? 'Loading...' : 'Submit'}
        </button>

      </form>
      {response && (
        <div style={{ marginTop: 20 }}>
          <h3>Response:</h3>
          <pre>{response}</pre>
        </div>
      )}
      <EmailForm prompt={prompt} result={response} />
    </div>
  );
};

export default PromptInput;
