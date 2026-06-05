import { useMemo, useState } from 'react';

export default function ProgressHeatmap({ submissions }) {
  const [tooltip, setTooltip] = useState(null);

  const cellSize = 11;
  const gap = 2;
  const weeks = 53;
  const days = 7;

  const countMap = useMemo(() => {
    const map = {};
    submissions.forEach(s => {
      if (s.submittedAt) {
        const d = s.submittedAt.slice(0, 10);
        map[d] = (map[d] || 0) + 1;
      }
    });
    return map;
  }, [submissions]);

  const cells = useMemo(() => {
    const result = [];
    const now = new Date();
    // Start from 53 weeks ago (Sunday)
    const start = new Date(now);
    start.setDate(start.getDate() - (weeks * 7 - 1));
    // Align to Sunday
    start.setDate(start.getDate() - start.getDay());

    for (let w = 0; w < weeks; w++) {
      for (let d = 0; d < days; d++) {
        const date = new Date(start);
        date.setDate(start.getDate() + w * 7 + d);
        if (date > now) continue;
        const dateStr = date.toISOString().slice(0, 10);
        const count = countMap[dateStr] || 0;
        result.push({ w, d, date: dateStr, count, display: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) });
      }
    }
    return result;
  }, [countMap]);

  function getColor(count) {
    if (count === 0) return '#111128';
    if (count === 1) return '#4c2889';
    if (count === 2) return '#7c5cb2';
    return '#8b5cf6';
  }

  const longestStreak = useMemo(() => {
    const sorted = Object.keys(countMap).sort();
    let max = 0, cur = 0, prev = null;
    sorted.forEach(d => {
      if (prev) {
        const diff = (new Date(d) - new Date(prev)) / 86400000;
        if (diff === 1) { cur++; max = Math.max(max, cur); }
        else cur = 1;
      } else { cur = 1; }
      prev = d;
    });
    return Math.max(max, sorted.length > 0 ? 1 : 0);
  }, [countMap]);

  const mostActive = useMemo(() => {
    const entries = Object.entries(countMap);
    if (!entries.length) return null;
    return entries.sort((a, b) => b[1] - a[1])[0];
  }, [countMap]);

  const svgWidth = weeks * (cellSize + gap);
  const svgHeight = days * (cellSize + gap);

  return (
    <div className="card relative">
      <h3 className="text-sm font-semibold text-text-primary mb-4">Submission Activity</h3>
      <div className="overflow-x-auto pb-2">
        <svg
          width={svgWidth}
          height={svgHeight}
          style={{ display: 'block' }}
          onMouseLeave={() => setTooltip(null)}
        >
          {cells.map((cell) => (
            <rect
              key={cell.date}
              x={cell.w * (cellSize + gap)}
              y={cell.d * (cellSize + gap)}
              width={cellSize}
              height={cellSize}
              rx={2}
              fill={getColor(cell.count)}
              style={{ cursor: cell.count > 0 ? 'pointer' : 'default', transition: 'fill 0.1s' }}
              onMouseEnter={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                setTooltip({ x: rect.left, y: rect.top, ...cell });
              }}
            />
          ))}
        </svg>
      </div>

      {tooltip && (
        <div
          className="fixed z-50 px-2.5 py-1.5 rounded-lg text-xs text-text-primary bg-bg-surface border border-border shadow-lg pointer-events-none"
          style={{ left: tooltip.x - 20, top: tooltip.y - 50 }}
        >
          <strong>{tooltip.display}</strong>
          <br />
          {tooltip.count} submission{tooltip.count !== 1 ? 's' : ''}
        </div>
      )}

      <div className="flex items-center gap-6 mt-3 text-xs text-text-muted">
        <span>Longest streak: <span className="text-text-primary font-medium">{longestStreak} day{longestStreak !== 1 ? 's' : ''}</span></span>
        {mostActive && (
          <span>Most active: <span className="text-text-primary font-medium">{new Date(mostActive[0]).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} ({mostActive[1]} submissions)</span></span>
        )}
      </div>

      {/* Legend */}
      <div className="flex items-center gap-2 mt-2 text-xs text-text-muted">
        <span>Less</span>
        {[0, 1, 2, 3].map(n => (
          <div key={n} style={{ width: 11, height: 11, borderRadius: 2, background: getColor(n) }} />
        ))}
        <span>More</span>
      </div>
    </div>
  );
}
