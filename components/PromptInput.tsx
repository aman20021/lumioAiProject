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

      <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Your Prompt</label>
            <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                rows={4}
                placeholder="Type your question or request here..."
                className="w-full p-4 text-base leading-6 border border-gray-300 rounded-lg shadow-sm 
                        focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all
                        hover:border-gray-400 resize-none"
            />
            </div>

            <button
                    type="submit"
                    disabled={loading}
                    className={`w-full py-3 px-6 text-white font-medium rounded-lg transition-all
                        ${loading 
                        ? 'bg-blue-400 cursor-not-allowed opacity-80' 
                        : 'bg-blue-600 hover:bg-blue-700 shadow-lg hover:shadow-blue-200'
                        }`}
                    >
                    {loading ? (
                        <span className="flex items-center justify-center gap-2">
                        <span className="animate-spin">↻</span>
                        Generating...
                        </span>
                    ) : (
                        'Get Answer'
                    )}
            </button>
        </form>

        {response && (
            <div className="mt-8 border border-gray-200 rounded-lg overflow-hidden">
                <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                    <h3 className="text-lg font-medium text-gray-800">Response</h3>
                </div>
                <div className="max-h-[60vh] overflow-y-auto p-4">
                    <pre className="whitespace-pre-wrap font-sans text-white-700 leading-6">
                    {response}
                    </pre>
                </div>
            </div>
        )}
      <EmailForm prompt={prompt} result={response} />
    </div>
  );
};

export default PromptInput;
