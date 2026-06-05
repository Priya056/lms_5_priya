import { useState } from 'react';

export default function SettingsModal({ open, onClose }) {
  const [key, setKey] = useState(() => localStorage.getItem('fa_api_key') || '');
  const [saved, setSaved] = useState(false);

  if (!open) return null;

  const hasKey = !!localStorage.getItem('fa_api_key');

  function handleSave() {
    localStorage.setItem('fa_api_key', key.trim());
    setSaved(true);
    setTimeout(() => setSaved(false), 1500);
  }

  function handleClear() {
    localStorage.removeItem('fa_api_key');
    setKey('');
    setSaved(false);
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div className="relative bg-bg-surface border border-border-2 rounded-2xl w-full max-w-md p-6" style={{ animation: 'slideUp 200ms ease-out', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-semibold text-text-primary">AI Tutor Settings</h2>
          <button onClick={onClose} className="text-text-muted hover:text-text-primary transition-colors">
            <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M18 6L6 18M6 6l12 12"/></svg>
          </button>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-text-primary mb-1.5">Anthropic API Key</label>
          <input
            type="password"
            value={key}
            onChange={e => setKey(e.target.value)}
            placeholder="sk-ant-..."
            className="w-full px-3.5 py-2.5 rounded-lg bg-bg-primary border border-border text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent-purple transition-colors text-sm"
            style={{ focus: { boxShadow: '0 0 0 3px rgba(139,92,246,0.15)' } }}
          />
          <p className="text-xs text-text-muted mt-2">Your key is stored only in your browser. Never shared.</p>
        </div>

        <div className="flex items-center gap-2 mb-5 text-xs">
          <div className={`w-2 h-2 rounded-full ${hasKey ? 'bg-success' : 'bg-error'}`} />
          <span className={hasKey ? 'text-success' : 'text-error'}>{hasKey ? 'Connected' : 'Not configured'}</span>
        </div>

        <div className="flex gap-3">
          <button onClick={handleSave} className="btn-primary flex-1 flex items-center justify-center gap-2">
            {saved ? (
              <><svg width="14" height="14" fill="currentColor" viewBox="0 0 16 16"><path d="M13.854 3.646a.5.5 0 010 .708l-7 7a.5.5 0 01-.708 0l-3.5-3.5a.5.5 0 11.708-.708L6.5 10.293l6.646-6.647a.5.5 0 01.708 0z"/></svg> Saved</>
            ) : 'Save Key'}
          </button>
          {hasKey && (
            <button onClick={handleClear} className="btn-secondary flex-1">Clear</button>
          )}
        </div>
      </div>
    </div>
  );
}
