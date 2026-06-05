import { useState } from 'react';

export default function CodeDiffViewer({ submissions, currentCode, onClose }) {
  const sorted = [...submissions].sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt));
  const [selectedIdx, setSelectedIdx] = useState(0);
  const selected = sorted[selectedIdx];

  const prevLines = (selected?.code || '').split('\n');
  const currLines = currentCode.split('\n');
  const maxLines = Math.max(prevLines.length, currLines.length);

  let changed = 0;
  const rows = [];
  for (let i = 0; i < maxLines; i++) {
    const prev = prevLines[i];
    const curr = currLines[i];
    if (prev === undefined) {
      rows.push({ type: 'added', prev: null, curr });
      changed++;
    } else if (curr === undefined) {
      rows.push({ type: 'removed', prev, curr: null });
      changed++;
    } else if (prev !== curr) {
      rows.push({ type: 'changed', prev, curr });
      changed++;
    } else {
      rows.push({ type: 'same', prev, curr });
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative w-full max-w-3xl bg-bg-surface border-l border-border h-full flex flex-col" style={{ animation: 'slideUp 200ms ease-out' }}>
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-border flex-shrink-0">
          <div>
            <h3 className="font-semibold text-text-primary text-sm">Compare Attempts</h3>
            <p className="text-xs text-text-muted mt-0.5">You changed {changed} line{changed !== 1 ? 's' : ''} since the selected attempt</p>
          </div>
          <button onClick={onClose} className="text-text-muted hover:text-text-primary">
            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M18 6L6 18M6 6l12 12"/></svg>
          </button>
        </div>

        {/* Attempt selector */}
        <div className="px-4 py-2 border-b border-border flex-shrink-0">
          <select
            value={selectedIdx}
            onChange={e => setSelectedIdx(Number(e.target.value))}
            className="bg-bg-primary border border-border text-text-primary rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:border-accent-purple"
          >
            {sorted.map((s, i) => (
              <option key={i} value={i}>
                Attempt {sorted.length - i} — {new Date(s.submittedAt).toLocaleString()} {s.passed ? '✓' : '✗'}
              </option>
            ))}
          </select>
        </div>

        {/* Diff */}
        <div className="flex-1 overflow-y-auto">
          <div className="flex text-xs font-mono" style={{ fontSize: 12 }}>
            {/* Previous */}
            <div className="flex-1 border-r border-border overflow-hidden">
              <div className="px-3 py-1.5 bg-bg-primary text-text-muted text-xs font-sans border-b border-border">
                Attempt {sorted.length - selectedIdx} — {new Date(selected?.submittedAt).toLocaleDateString()}
              </div>
              {rows.map((row, i) => (
                <div
                  key={i}
                  className="px-3 py-0.5 leading-5"
                  style={{
                    background: row.type === 'removed' || row.type === 'changed' ? 'rgba(244,63,94,0.1)' : 'transparent',
                    borderLeft: row.type === 'removed' || row.type === 'changed' ? '3px solid #f43f5e' : '3px solid transparent',
                  }}
                >
                  <span style={{ color: row.type === 'removed' || row.type === 'changed' ? '#f43f5e' : '#f0efff' }}>
                    {row.prev ?? ''}
                  </span>
                </div>
              ))}
            </div>

            {/* Current */}
            <div className="flex-1 overflow-hidden">
              <div className="px-3 py-1.5 bg-bg-primary text-text-muted text-xs font-sans border-b border-border">
                Current Code
              </div>
              {rows.map((row, i) => (
                <div
                  key={i}
                  className="px-3 py-0.5 leading-5"
                  style={{
                    background: row.type === 'added' || row.type === 'changed' ? 'rgba(16,185,129,0.1)' : 'transparent',
                    borderLeft: row.type === 'added' || row.type === 'changed' ? '3px solid #10b981' : '3px solid transparent',
                  }}
                >
                  <span style={{ color: row.type === 'added' || row.type === 'changed' ? '#10b981' : '#f0efff' }}>
                    {row.curr ?? ''}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
