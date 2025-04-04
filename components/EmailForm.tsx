// Frontend Component (e.g., components/EmailForm.tsx)
"use client";
import { useState } from 'react';

export default function EmailForm({ prompt, result }: { prompt: string, result: string }) {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const response = await fetch('/api/sendEmail', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, prompt, result })
      });

      if (!response.ok) throw new Error('Failed to send email');
      setStatus('Email sent successfully!');
    } catch (error) {
      setStatus(`Error sending email,  ${error}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-4">
        <form onSubmit={handleSubmit} className="mt-4">
            <div className="flex gap-2">
                <input
                type="email"
                required
                placeholder="Enter your email"
                className="p-2 border rounded flex-grow"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                />
                <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 bg-blue-600 text-white rounded disabled:bg-gray-400 cursor-pointer"
                >
                {loading ? 'Sending...' : 'Send Result'}
                </button>
            </div>
            {status && <p className="mt-2 text-sm text-gray-600">{status}</p>}
        </form>
    </div>
  );
}