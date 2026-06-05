import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../lib/AuthContext';
import { getSubmissions, getXP, getStreak, getPomodoroToday } from '../lib/storage';
import { courses } from '../data/courses';
import { problems } from '../data/problems';
import ProgressHeatmap from '../components/ProgressHeatmap';

export default function Dashboard() {
  const { session } = useAuth();
  const [submissions, setSubmissions] = useState([]);
  const [xpData, setXpData] = useState(getXP());
  const [streak, setStreak] = useState(getStreak());
  const [pomodoroToday, setPomodoroToday] = useState(getPomodoroToday());

  useEffect(() => {
    const subs = getSubmissions().filter(s => s.userId === session?.userId);
    setSubmissions(subs);
    setXpData(getXP());
    setStreak(getStreak());
    setPomodoroToday(getPomodoroToday());
  }, [session]);

  const passedSubs = submissions.filter(s => s.passed);
  const uniqueSolved = new Set(passedSubs.map(s => s.problemId)).size;
  const totalSubs = submissions.length;
  const passRate = totalSubs > 0 ? Math.round((passedSubs.length / totalSubs) * 100) : 0;
  const recent = [...submissions].sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt)).slice(0, 10);

  function getCourseProgress(courseId) {
    const courseProbs = problems.filter(p => p.courseId === courseId);
    const solved = new Set(passedSubs.filter(s => s.courseId === courseId).map(s => s.problemId)).size;
    return { solved, total: courseProbs.length, pct: courseProbs.length ? Math.round(solved / courseProbs.length * 100) : 0 };
  }

  function getLastVisited(courseId) {
    try {
      const lv = JSON.parse(localStorage.getItem('fa_last_visited') || '{}');
      return lv[courseId] || `/course/${courseId}`;
    } catch {
      return `/course/${courseId}`;
    }
  }

  return (
    <div className="page-fade p-6 max-w-6xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-[28px] font-semibold gradient-text">Hello, {session?.name?.split(' ')[0]}</h1>
        <p className="text-text-muted text-sm mt-1">
          {streak.count > 0 ? `🔥 ${streak.count}-day streak — keep it up!` : 'Start coding to build your streak!'}
        </p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <StatCard label="Problems Solved" value={uniqueSolved} color="#10b981" />
        <StatCard label="Total Submissions" value={totalSubs} color="#8b5cf6" />
        <StatCard label="Pass Rate" value={`${passRate}%`} color="#f59e0b" />
      </div>

      {/* Heatmap */}
      <div className="mb-8">
        <ProgressHeatmap submissions={submissions} />
      </div>

      {/* Course cards */}
      <div className="mb-8">
        <h2 className="text-base font-semibold text-text-primary mb-4">Your Courses</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {courses.map(course => {
            const prog = getCourseProgress(course.id);
            return (
              <div key={course.id} className="card group cursor-pointer" style={{ borderTop: '0.5px solid rgba(255,255,255,0.08)' }}>
                <div className="flex items-start gap-4">
                  <div className="text-4xl">{course.icon}</div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-text-primary">{course.shortTitle}</h3>
                    <p className="text-sm text-text-muted mt-1 line-clamp-2">{course.description}</p>

                    <div className="mt-3">
                      <div className="flex items-center justify-between text-xs text-text-muted mb-1.5">
                        <span>{prog.solved} / {prog.total} problems solved</span>
                        <span>{prog.pct}%</span>
                      </div>
                      <div className="h-1.5 bg-border rounded-full overflow-hidden progress-shimmer">
                        <div
                          className="h-full rounded-full transition-all duration-700"
                          style={{ width: `${prog.pct}%`, background: 'var(--fa-gradient)' }}
                        />
                      </div>
                    </div>

                    <div className="mt-3 flex gap-2">
                      <Link to={getLastVisited(course.id)} className="btn-primary text-xs px-3 py-1.5">
                        Continue
                      </Link>
                      <Link to={`/course/${course.id}/map`} className="btn-secondary text-xs px-3 py-1.5">
                        Concept Map
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* XP & Focus */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <div className="card" style={{ borderTop: '0.5px solid rgba(255,255,255,0.08)' }}>
          <div className="flex items-center gap-3 mb-2">
            <span className="text-lg">⚡</span>
            <span className="font-semibold text-text-primary">XP Progress</span>
          </div>
          <div className="text-[32px] font-semibold gradient-text">{xpData.total}</div>
          <div className="text-xs text-text-muted mt-0.5">Total XP earned</div>
        </div>
        <div className="card" style={{ borderTop: '0.5px solid rgba(255,255,255,0.08)' }}>
          <div className="flex items-center gap-3 mb-2">
            <span className="text-lg">🍅</span>
            <span className="font-semibold text-text-primary">Focus Sessions</span>
          </div>
          <div className="text-[32px] font-semibold gradient-text">{pomodoroToday.count}</div>
          <div className="text-xs text-text-muted mt-0.5">Pomodoros today</div>
        </div>
      </div>

      {/* Recent activity */}
      <div>
        <h2 className="text-base font-semibold text-text-primary mb-4">Recent Activity</h2>
        {recent.length === 0 ? (
          <div className="card text-center py-10" style={{ borderTop: '0.5px solid rgba(255,255,255,0.08)' }}>
            <svg width="48" height="48" viewBox="0 0 48 48" fill="none" className="mx-auto mb-3" style={{ opacity: 0.3 }}>
              <circle cx="24" cy="24" r="20" stroke="currentColor" strokeWidth="2" className="text-text-muted"/>
              <path d="M24 14v10l6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="text-text-muted"/>
            </svg>
            <p className="text-text-muted text-sm mb-3">No submissions yet. Start solving problems!</p>
            <Link to="/course/cs50p" className="btn-primary text-xs">Start CS50 Python</Link>
          </div>
        ) : (
          <div className="card overflow-hidden p-0" style={{ borderTop: '0.5px solid rgba(255,255,255,0.08)' }}>
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="px-4 py-3 text-left text-xs font-medium text-text-muted uppercase tracking-wider">Problem</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-text-muted uppercase tracking-wider hidden sm:table-cell">Course</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-text-muted uppercase tracking-wider">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-text-muted uppercase tracking-wider hidden md:table-cell">Date</th>
                </tr>
              </thead>
              <tbody>
                {recent.map((sub, i) => {
                  const prob = problems.find(p => p.id === sub.problemId);
                  const course = courses.find(c => c.id === sub.courseId);
                  return (
                    <tr key={sub.id || i} className="border-b border-border last:border-0 hover:bg-white/2 transition-colors" style={i % 2 === 1 ? { background: 'rgba(255,255,255,0.02)' } : {}}>
                      <td className="px-4 py-3 text-sm text-text-primary">
                        {prob ? (
                          <Link to={`/course/${sub.courseId}/problem/${sub.problemId}`} className="hover:text-accent-purple transition-colors">
                            {prob.title}
                          </Link>
                        ) : sub.problemId}
                      </td>
                      <td className="px-4 py-3 text-sm text-text-muted hidden sm:table-cell">
                        {course?.shortTitle || sub.courseId}
                      </td>
                      <td className="px-4 py-3">
                        {sub.passed ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium" style={{ background: 'rgba(16,185,129,0.15)', color: '#10b981', border: '1px solid rgba(16,185,129,0.3)' }}>
                            <svg width="10" height="10" fill="currentColor" viewBox="0 0 16 16"><path d="M13.854 3.646a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6.5 10.293l6.646-6.647a.5.5 0 0 1 .708 0z"/></svg>
                            Passed
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium" style={{ background: 'rgba(244,63,94,0.15)', color: '#f43f5e', border: '1px solid rgba(244,63,94,0.3)' }}>
                            <svg width="10" height="10" fill="currentColor" viewBox="0 0 16 16"><path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/></svg>
                            Failed
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-xs text-text-muted hidden md:table-cell">
                        {sub.submittedAt ? new Date(sub.submittedAt).toLocaleDateString() : '—'}
                      </td>
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

function StatCard({ label, value, color }) {
  return (
    <div className="bg-bg-surface border border-border rounded-xl p-5 relative overflow-hidden transition-all duration-200" style={{ borderTop: `3px solid ${color}`, borderTopColor: undefined }}>
      <div className="h-0.5 w-full absolute top-0 left-0" style={{ background: color }} />
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-text-muted">{label}</p>
          <p className="text-[32px] font-semibold gradient-text mt-1">{value}</p>
        </div>
      </div>
    </div>
  );
}
