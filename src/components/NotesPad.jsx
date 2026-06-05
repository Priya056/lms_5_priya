import { useState, useEffect, useRef, useCallback } from 'react';
import { getNotes, saveNotes } from '../lib/storage';
import ReactMarkdown from 'react-markdown';

export default function NotesPad({ pageType, pageId, inline, onClose }) {
  const [content, setContent] = useState(() => getNotes(pageType, pageId));
  const [mode, setMode] = useState('write');
  const [saved, setSaved] = useState(false);
  const timerRef = useRef(null);

  useEffect(() => {
    setContent(getNotes(pageType, pageId));
  }, [pageType, pageId]);

  const handleChange = useCallback((val) => {
    setContent(val);
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      saveNotes(pageType, pageId, val);
      setSaved(true);
      setTimeout(() => setSaved(false), 1500);
    }, 500);
  }, [pageType, pageId]);

  function handleExport() {
    try {
      const allKeys = Object.keys(localStorage).filter(k => k.startsWith('fa_notes_'));
      let md = '';
      allKeys.forEach(k => {
        const label = k.replace('fa_notes_', '').replace(/_/g, ' ');
        const text = JSON.parse(localStorage.getItem(k) || '""');
        if (text) md += `# ${label}\n\n${text}\n\n---\n\n`;
      });
      const blob = new Blob([md], { type: 'text/markdown' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'fraylon-notes.md';
      a.click();
      URL.revokeObjectURL(url);
    } catch {}
  }

  const wrapper = inline
    ? 'flex flex-col h-full'
    : 'flex flex-col h-full bg-bg-surface';

  return (
    <div className={wrapper}>
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-border flex-shrink-0">
        <div className="flex items-center gap-1">
          <button
            onClick={() => setMode('write')}
            className={`text-xs px-2 py-1 rounded transition-colors ${mode === 'write' ? 'bg-accent-purple/20 text-accent-purple' : 'text-text-muted hover:text-text-primary'}`}
          >
            Write
          </button>
          <button
            onClick={() => setMode('preview')}
            className={`text-xs px-2 py-1 rounded transition-colors ${mode === 'preview' ? 'bg-accent-purple/20 text-accent-purple' : 'text-text-muted hover:text-text-primary'}`}
          >
            Preview
          </button>
        </div>
        <div className="flex items-center gap-2">
          {saved && <span className="text-xs text-success animate-fade-in">Saved</span>}
          <button onClick={handleExport} title="Export notes" className="text-text-muted hover:text-text-primary transition-colors">
            <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
          </button>
          {onClose && (
            <button onClick={onClose} className="text-text-muted hover:text-text-primary transition-colors">
              <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M18 6L6 18M6 6l12 12"/></svg>
            </button>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden">
        {mode === 'write' ? (
          <textarea
            value={content}
            onChange={e => handleChange(e.target.value)}
            placeholder="Write your notes here... (Markdown supported)"
            className="w-full h-full p-3 bg-transparent text-text-primary placeholder:text-text-muted outline-none resize-none font-mono text-xs leading-relaxed"
            style={{ fontSize: 13 }}
          />
        ) : (
          <div className="p-3 overflow-y-auto h-full prose text-xs">
            {content ? (
              <ReactMarkdown>{content}</ReactMarkdown>
            ) : (
              <p className="text-text-muted italic">Nothing to preview yet.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
