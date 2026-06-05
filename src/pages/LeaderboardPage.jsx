import { useState, useEffect } from 'react';
import { useAuth } from '../lib/AuthContext';
import { getXP, getSubmissions } from '../lib/storage';
import { getLevel } from '../lib/xp';

export default function LeaderboardPage() {
  const { session } = useAuth();
  const [entries, setEntries] = useState([]);
  const [filter, setFilter] = useState('all');
  const [timeFilter, setTimeFilter] = useState('all');

  useEffect(() => {
    const allEntries = [];
    const keys = Object.keys(localStorage).filter(k => k.startsWith('fa_leaderboard_'));

    keys.forEach(k => {
      try {
        const userId = k.replace('fa_leaderboard_', '');
        const data = JSON.parse(localStorage.getItem(k));
        allEntries.push({ userId, ...data });
      } catch {}
    });

    const currentExists = allEntries.find(e => e.userId === session?.userId);
    if (!currentExists && session) {
      const xp = getXP();
      const subs = getSubmissions().filter(s => s.userId === session.userId && s.passed);
      const solved = new Set(subs.map(s => s.problemId)).size;
      const cs50p = subs.filter(s => s.courseId === 'cs50p').length;
      const cs50ai = subs.filter(s => s.courseId === 'cs50ai').length;
      allEntries.push({
        userId: session.userId,
        name: session.name,
        xp: xp.total,
        solved,
        topCourse: cs50p >= cs50ai ? 'cs50p' : 'cs50ai',
        weeklyXP: xp.weeklyXP || 0,
      });
    }

    setEntries(allEntries);
  }, [session]);

  const filtered = entries
    .filter(e => filter === 'all' || e.topCourse === filter)
    .sort((a, b) => (timeFilter === 'week' ? (b.weeklyXP || 0) - (a.weeklyXP || 0) : b.xp - a.xp));

  const currentUserIdx = filtered.findIndex(e => e.userId === session?.userId);
  const medals = ['🥇', '🥈', '🥉'];

  return (
    <div className="page-fade p-6 max-w-3xl">
      <h1 className="text-2xl font-semibold gradient-text mb-6">Leaderboard</h1>

      {/* Filters */}
      <div className="flex items-center gap-3 mb-6 flex-wrap">
        <div className="flex rounded-lg overflow-hidden border border-border">
          {[['all', 'All Courses'], ['cs50p', 'CS50 Python'], ['cs50ai', 'CS50 AI']].map(([val, label]) => (
            <button
              key={val}
              onClick={() => setFilter(val)}
              className={`px-3 py-1.5 text-xs transition-colors ${filter === val ? 'text-white' : 'text-text-muted hover:text-text-primary hover:bg-white/5'}`}
              style={filter === val ? { background: 'var(--fa-gradient)' } : {}}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="flex rounded-lg overflow-hidden border border-border">
          {[['all', 'All Time'], ['week', 'This Week']].map(([val, label]) => (
            <button
              key={val}
              onClick={() => setTimeFilter(val)}
              className={`px-3 py-1.5 text-xs transition-colors ${timeFilter === val ? 'text-white' : 'text-text-muted hover:text-text-primary hover:bg-white/5'}`}
              style={timeFilter === val ? { background: 'var(--fa-gradient)' } : {}}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="card text-center py-16" style={{ borderTop: '0.5px solid rgba(255,255,255,0.08)' }}>
          <div className="text-5xl mb-3">🏆</div>
          <h3 className="font-semibold text-text-primary mb-1">No entries yet</h3>
          <p className="text-text-muted text-sm mb-4">Be the first on the board — solve a problem to appear here!</p>
          <a href="#/course/cs50p" className="btn-primary text-sm">Start CS50 Python</a>
        </div>
      ) : (
        <div className="card overflow-hidden p-0" style={{ borderTop: '0.5px solid rgba(255,255,255,0.08)' }}>
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="px-4 py-3 text-left text-xs font-medium text-text-muted uppercase tracking-wider w-12">Rank</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-text-muted uppercase tracking-wider">Player</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-text-muted uppercase tracking-wider">XP</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-text-muted uppercase tracking-wider hidden sm:table-cell">Solved</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-text-muted uppercase tracking-wider hidden md:table-cell">Top Course</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((entry, i) => {
                const isCurrentUser = entry.userId === session?.userId;
                return (
                  <tr
                    key={entry.userId || i}
                    className={`border-b border-border last:border-0 transition-colors ${
                      isCurrentUser ? 'border-l-2 border-l-accent-purple bg-accent-purple/5' : 'hover:bg-white/2'
                    }`}
                  >
                    <td className="px-4 py-3 text-sm">
                      {i < 3 ? (
                        <span className="text-lg">{medals[i]}</span>
                      ) : (
                        <span className="text-text-muted font-medium">{i + 1}</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold" style={{ background: 'var(--fa-gradient)' }}>
                          {entry.name?.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)}
                        </div>
                        <span className={`text-sm ${isCurrentUser ? 'gradient-text font-semibold' : 'text-text-primary'}`}>
                          {entry.name}
                          {isCurrentUser && <span className="ml-1.5 text-xs font-normal text-text-muted">(you)</span>}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <span className="text-sm font-semibold gradient-text">
                        {timeFilter === 'week' ? entry.weeklyXP || 0 : entry.xp}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right text-sm text-text-muted hidden sm:table-cell">{entry.solved || 0}</td>
                    <td className="px-4 py-3 text-right text-xs text-text-muted hidden md:table-cell">
                      {entry.topCourse === 'cs50p' ? '🐍 CS50 Python' : '🤖 CS50 AI'}
                    </td>
                  </tr>
                );
              })}

              {currentUserIdx > 10 && (
                <>
                  <tr><td colSpan={5} className="px-4 py-1 text-center text-xs text-text-muted">···</td></tr>
                  <tr className="border-t border-border bg-accent-purple/5 border-l-2 border-l-accent-purple">
                    <td className="px-4 py-3 text-sm text-text-muted">{currentUserIdx + 1}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold" style={{ background: 'var(--fa-gradient)' }}>
                          {session?.name?.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)}
                        </div>
                        <span className="text-sm gradient-text font-semibold">{session?.name} <span className="text-xs font-normal text-text-muted">(you)</span></span>
                      </div>
                    </td>
                    <td colSpan={3} />
                  </tr>
                </>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
