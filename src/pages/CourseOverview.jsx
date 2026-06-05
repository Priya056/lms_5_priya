import { Link } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import { courses, weekLabels } from '../data/courses';
import { problems } from '../data/problems';
import { getSubmissions } from '../lib/storage';
import { useAuth } from '../lib/AuthContext';

export default function CourseOverview() {
  const { courseId } = useParams();
  const { session } = useAuth();
  const course = courses.find(c => c.id === courseId);
  const labels = weekLabels[courseId] || [];
  const submissions = getSubmissions().filter(s => s.userId === session?.userId && s.courseId === courseId);
  const passedIds = new Set(submissions.filter(s => s.passed).map(s => s.problemId));

  if (!course) {
    return <div className="p-6 text-text-muted">Course not found</div>;
  }

  return (
    <div className="page-fade p-6 max-w-4xl">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-4">
          <span className="text-5xl">{course.icon}</span>
          <div>
            <h1 className="text-2xl font-semibold gradient-text">{course.shortTitle}</h1>
            <p className="text-text-muted text-sm mt-1 max-w-xl">{course.description}</p>
          </div>
        </div>
        <div className="flex gap-3">
          <Link to={`/course/${courseId}/map`} className="btn-secondary text-sm">View Concept Map</Link>
        </div>
      </div>

      {/* Weeks */}
      <div className="space-y-3">
        <h2 className="text-base font-semibold text-text-primary mb-4">Curriculum</h2>
        {labels.map((label, i) => {
          const weekProbs = problems.filter(p => p.courseId === courseId && p.weekNum === i);
          const solvedCount = weekProbs.filter(p => passedIds.has(p.id)).length;
          const pct = weekProbs.length ? Math.round(solvedCount / weekProbs.length * 100) : 0;

          return (
            <div key={i} className="card group" style={{ borderTop: '0.5px solid rgba(255,255,255,0.08)' }}>
              <div className="flex items-center gap-4">
                <div className="w-9 h-9 rounded-lg bg-bg-primary flex items-center justify-center text-sm font-bold text-accent-purple flex-shrink-0">
                  {i}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-medium text-text-primary text-sm">{label}</h3>
                    {weekProbs.length > 0 && (
                      <span className="text-xs text-text-muted">{solvedCount}/{weekProbs.length}</span>
                    )}
                  </div>
                  {weekProbs.length > 0 && (
                    <div className="h-1 bg-border rounded-full overflow-hidden progress-shimmer">
                      <div className="h-full rounded-full" style={{ width: `${pct}%`, background: 'var(--fa-gradient)' }} />
                    </div>
                  )}
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  <Link
                    to={`/course/${courseId}/lecture/${i}`}
                    className="text-xs px-2.5 py-1 rounded-lg bg-bg-primary border border-border text-text-muted hover:border-accent-purple hover:text-accent-purple transition-all"
                  >
                    Notes
                  </Link>
                  {weekProbs.length > 0 && (
                    <Link
                      to={`/course/${courseId}/problem/${weekProbs[0].id}`}
                      className="gradient-border text-xs px-2.5 py-1 text-accent-purple hover:text-white transition-all"
                      style={{ background: 'var(--fa-surface)' }}
                      onMouseEnter={e => { e.currentTarget.style.background = 'var(--fa-gradient)'; }}
                      onMouseLeave={e => { e.currentTarget.style.background = 'var(--fa-surface)'; }}
                    >
                      Problems ({weekProbs.length})
                    </Link>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
