import { useState, useRef, useEffect } from 'react';
import { getChatHistory, saveChatHistory } from '../lib/storage';

const API_URL = 'https://api.anthropic.com/v1/messages';

function getApiKey() {
  return localStorage.getItem('fa_api_key') || import.meta.env.VITE_ANTHROPIC_API_KEY || '';
}

export default function AIMentor({ mode, problem, currentCode, contextTitle, contextSource, contextContent }) {
  const chatId = problem?.id || `lecture_${contextTitle}`;
  const [messages, setMessages] = useState(() => getChatHistory(chatId));
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const endRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  useEffect(() => {
    saveChatHistory(chatId, messages);
  }, [messages, chatId]);

  function buildSystemPrompt() {
    if (mode === 'lecture') {
      return `You are Fraylon Mentor, a Harvard CS50 expert tutor. Your style is Socratic — never give the answer directly. Ask guiding questions, reference relevant CS50 concepts, and give short encouraging nudges. Keep all responses to 2–4 sentences maximum. The student is reading CS50 lecture notes for: ${contextTitle}. Source: ${contextSource}. Help them understand concepts from this lecture.`;
    }
    return `You are Fraylon Mentor, a Harvard CS50 expert tutor. Your style is Socratic — never give the answer directly. Ask guiding questions, reference relevant CS50 concepts, and give short encouraging nudges. Keep all responses to 2–4 sentences maximum. Current problem: ${problem?.title}. Description: ${problem?.description}. Student's current code: \`\`\`python\n${currentCode || '(no code yet)'}\n\`\`\``;
  }

  async function sendMessage() {
    if (!input.trim() || loading) return;

    const apiKey = getApiKey();
    if (!apiKey) {
      setError('Could not reach AI Tutor. Check your API key in Settings.');
      return;
    }

    const userMsg = { role: 'user', content: input.trim() };
    const updated = [...messages, userMsg];
    setMessages(updated);
    setInput('');
    setLoading(true);
    setError('');

    try {
      const resp = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey,
          'anthropic-version': '2023-06-01',
          'anthropic-dangerous-direct-browser-access': 'true',
        },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 1000,
          system: buildSystemPrompt(),
          messages: updated.map(m => ({ role: m.role, content: m.content })),
        }),
      });

      if (!resp.ok) {
        const err = await resp.json().catch(() => ({}));
        throw new Error(err.error?.message || `API error ${resp.status}`);
      }

      const data = await resp.json();
      const aiMsg = { role: 'assistant', content: data.content[0].text };
      setMessages(prev => [...prev, aiMsg]);
    } catch (err) {
      setError('Could not reach AI Tutor. Check your API key in Settings.');
    } finally {
      setLoading(false);
    }
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  }

  function clearChat() {
    setMessages([]);
    saveChatHistory(chatId, []);
  }

  return (
    <div className="flex flex-col h-full bg-bg-surface">
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-2.5 border-b border-border flex-shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold" style={{ background: 'var(--fa-gradient)' }}>FA</div>
          <span className="text-xs font-semibold text-text-primary">Fraylon Mentor</span>
        </div>
        <button
          onClick={clearChat}
          title="Clear chat"
          className="text-text-muted hover:text-text-primary transition-colors p-1"
        >
          <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a1 1 0 011-1h4a1 1 0 011 1v2"/></svg>
        </button>
      </div>

      {/* Error banner */}
      {error && (
        <div className="px-3 py-2 text-xs text-error bg-error/10 border-b border-error/20 flex items-center gap-2">
          <svg width="12" height="12" fill="currentColor" viewBox="0 0 16 16"><path d="M4.646 4.646a.5.5 0 01.708 0L8 7.293l2.646-2.647a.5.5 0 01.708.708L8.707 8l2.647 2.646a.5.5 0 01-.708.708L8 8.707l-2.646 2.647a.5.5 0 01-.708-.708L7.293 8 4.646 5.354a.5.5 0 010-.708z"/></svg>
          {error}
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3">
        {messages.length === 0 && (
          <div className="text-center py-6">
            <div className="w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-2 text-white text-lg font-bold" style={{ background: 'var(--fa-gradient)' }}>FA</div>
            <p className="text-xs text-text-muted">Ask me anything about {mode === 'lecture' ? 'this lecture' : 'this problem'}!</p>
          </div>
        )}

        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            {msg.role === 'assistant' && (
              <div className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold mr-2 flex-shrink-0 mt-1" style={{ background: 'var(--fa-gradient)' }}>FA</div>
            )}
            <div
              className={`max-w-[85%] px-3 py-2 text-xs leading-relaxed ${
                msg.role === 'user'
                  ? 'text-white'
                  : 'bg-bg-surface-2 text-text-primary'
              }`}
              style={msg.role === 'user'
                ? { background: 'var(--fa-accent)', borderRadius: '18px 18px 4px 18px' }
                : { borderRadius: '18px 18px 18px 4px' }
              }
            >
              {msg.content}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex justify-start">
            <div className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold mr-2 flex-shrink-0 mt-1" style={{ background: 'var(--fa-gradient)' }}>FA</div>
            <div className="bg-bg-surface-2 px-4 py-3" style={{ borderRadius: '18px 18px 18px 4px' }}>
              <div className="flex gap-1">
                <span className="typing-dot" />
                <span className="typing-dot" />
                <span className="typing-dot" />
              </div>
            </div>
          </div>
        )}
        <div ref={endRef} />
      </div>

      {/* Input */}
      <div className="p-3 border-t border-border flex-shrink-0">
        {!getApiKey() && (
          <div className="text-xs text-text-muted mb-2 px-1">Set your Anthropic API key in Settings (gear icon) to enable AI.</div>
        )}
        <div className="flex gap-2">
          <textarea
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={mode === 'lecture' ? 'Ask about this lecture...' : 'Ask about this problem...'}
            rows={2}
            className="flex-1 bg-bg-primary border border-border rounded-lg px-2.5 py-2 text-xs text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent-purple resize-none transition-colors"
          />
          <button
            onClick={sendMessage}
            disabled={!input.trim() || loading}
            className="w-8 h-8 self-end rounded-lg flex items-center justify-center text-white disabled:opacity-40 transition-all flex-shrink-0"
            style={{ background: 'var(--fa-gradient)' }}
          >
            <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M22 2L11 13M22 2L15 22l-4-9-9-4 20-7z"/></svg>
          </button>
        </div>
      </div>
    </div>
  );
}
