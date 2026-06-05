import { useEffect, useState } from 'react';
import { useAuth } from '../lib/AuthContext';
import { getSubmissions, getBadges, getXP } from '../lib/storage';
import { getLevel } from '../lib/xp';
import { badges as badgeDefs } from '../data/badges';
import { problems } from '../data/problems';
import { courses } from '../data/courses';

export default function ProfilePage() {
  const { session } = useAuth();
  const [submissions, setSubmissions] = useState([]);
  const [userBadges, setUserBadges] = useState([]);
  const [xpData, setXpData] = useState(getXP());

  useEffect(() => {
    setSubmissions(getSubmissions().filter(s => s.userId === session?.userId));
    setUserBadges(getBadges());
    setXpData(getXP());
  }, [session]);

  const passedSubs = submissions.filter(s => s.passed);
  const uniqueSolved = new Set(passedSubs.map(s => s.problemId)).size;
  const level = getLevel(xpData.total);
  const unlockedIds = new Set(userBadges.map(b => b.id));
  const createdAt = (() => {
    try {
      const users = JSON.parse(localStorage.getItem('fa_users') || '[]');
      const user = users.find(u => u.id === session?.userId);
      return user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Unknown';
    } catch { return 'Unknown'; }
  })();

  return (
    <div className="page-fade p-6 max-w-4xl">
      {/* Header */}
      <div className="card mb-6" style={{ borderTop: '0.5px solid rgba(255,255,255,0.08)' }}>
        <div className="flex items-start gap-5">
          <div className="w-16 h-16 rounded-full flex items-center justify-center text-white text-2xl font-bold" style={{ background: 'var(--fa-gradient)' }}>
            {session?.name?.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)}
          </div>
          <div className="flex-1">
            <h1 className="text-xl font-semibold text-text-primary">{session?.name}</h1>
            <p className="text-text-muted text-sm">{session?.email}</p>
            <p className="text-text-muted text-xs mt-1">Member since {createdAt}</p>

            <div className="flex items-center gap-4 mt-3">
              <div className="text-center">
                <div className="text-lg font-bold gradient-text">{uniqueSolved}</div>
                <div className="text-xs text-text-muted">Solved</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-text-primary">{submissions.length}</div>
                <div className="text-xs text-text-muted">Submissions</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold gradient-text">{xpData.total}</div>
                <div className="text-xs text-text-muted">XP</div>
              </div>
              <div className="px-3 py-1 rounded-full text-xs font-medium" style={{ background: level.color + '22', color: level.color }}>
                {level.name}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Badges */}
      <div className="mb-6">
        <h2 className="text-base font-semibold text-text-primary mb-4">
          Achievement Badges
          <span className="ml-2 text-sm font-normal text-text-muted">{userBadges.length} / {badgeDefs.length} unlocked</span>
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {badgeDefs.map(badge => {
            const unlocked = unlockedIds.has(badge.id);
            const ub = userBadges.find(b => b.id === badge.id);
            return (
              <div
                key={badge.id}
                className={`card text-center py-4 transition-all ${unlocked ? '' : 'opacity-40'}`}
                style={{ borderTop: unlocked ? '0.5px solid rgba(255,255,255,0.08)' : undefined }}
              >
                <div className="text-3xl mb-2" style={{ filter: unlocked ? 'none' : 'grayscale(100%)' }}>
                  {badge.icon}
                </div>
                <div className="text-xs font-semibold text-text-primary mb-1">{badge.name}</div>
                {unlocked ? (
                  <>
                    <p className="text-xs text-text-muted">{badge.description}</p>
                    {ub?.unlockedAt && (
                      <p className="text-xs gradient-text mt-1">{new Date(ub.unlockedAt).toLocaleDateString()}</p>
                    )}
                  </>
                ) : (
                  <div className="flex items-center justify-center gap-1 text-xs text-text-muted">
                    <svg width="10" height="10" fill="currentColor" viewBox="0 0 16 16"><path d="M8 1a2 2 0 012 2v4H6V3a2 2 0 012-2zm3 6V3a3 3 0 00-6 0v4a2 2 0 00-2 2v5a2 2 0 002 2h6a2 2 0 002-2V9a2 2 0 00-2-2H11z"/></svg>
                    ???
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Full submission history */}
      <div>
        <h2 className="text-base font-semibold text-text-primary mb-4">Submission History</h2>
        {submissions.length === 0 ? (
          <div className="card text-center py-8" style={{ borderTop: '0.5px solid rgba(255,255,255,0.08)' }}>
            <svg width="48" height="48" viewBox="0 0 48 48" fill="none" className="mx-auto mb-3" style={{ opacity: 0.3 }}>
              <circle cx="24" cy="24" r="20" stroke="currentColor" strokeWidth="2" className="text-text-muted"/>
              <path d="M24 14v10l6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="text-text-muted"/>
            </svg>
            <p className="text-text-muted text-sm">No submissions yet.</p>
          </div>
        ) : (
          <div className="card overflow-hidden p-0" style={{ borderTop: '0.5px solid rgba(255,255,255,0.08)' }}>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="px-4 py-3 text-left text-xs font-medium text-text-muted uppercase tracking-wider">Problem</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-text-muted uppercase tracking-wider">Course</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-text-muted uppercase tracking-wider">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-text-muted uppercase tracking-wider">Date</th>
                </tr>
              </thead>
              <tbody>
                {[...submissions].sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt)).map((sub, i) => {
                  const prob = problems.find(p => p.id === sub.problemId);
                  const course = courses.find(c => c.id === sub.courseId);
                  return (
                    <tr key={i} className="border-b border-border last:border-0 hover:bg-white/2 transition-colors" style={i % 2 === 1 ? { background: 'rgba(255,255,255,0.02)' } : {}}>
                      <td className="px-4 py-3 text-text-primary">{prob?.title || sub.problemId}</td>
                      <td className="px-4 py-3 text-text-muted">{course?.shortTitle}</td>
                      <td className="px-4 py-3">
                        {sub.passed ? (
                          <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ background: 'rgba(16,185,129,0.15)', color: '#10b981', border: '1px solid rgba(16,185,129,0.3)' }}>Passed</span>
                        ) : (
                          <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ background: 'rgba(244,63,94,0.15)', color: '#f43f5e', border: '1px solid rgba(244,63,94,0.3)' }}>Failed</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-text-muted text-xs">{sub.submittedAt ? new Date(sub.submittedAt).toLocaleString() : '—'}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
