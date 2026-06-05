import { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { weekLabels, courses } from '../data/courses';
import { problems } from '../data/problems';
import { getNotes, saveNotes, getFlashcardsDone, saveFlashcardsDone } from '../lib/storage';
import { addXP } from '../lib/xp';
import { useToast } from '../lib/ToastContext';
import AIMentor from '../components/AIMentor';
import LectureQuiz from '../components/LectureQuiz';
import FlashcardModal from '../components/FlashcardModal';
import NotesPad from '../components/NotesPad';
import { saveLastVisited } from '../lib/storage';

export default function LecturePage() {
  const { courseId, weekNum } = useParams();
  const week = parseInt(weekNum, 10);
  const navigate = useNavigate();
  const { showXPToast } = useToast();
  const contentRef = useRef(null);
  const [scrollPct, setScrollPct] = useState(0);

  const [noteData, setNoteData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [aiDrawerOpen, setAiDrawerOpen] = useState(false);
  const [flashcardOpen, setFlashcardOpen] = useState(false);
  const [notesOpen, setNotesOpen] = useState(false);
  const [flashcardData, setFlashcardData] = useState(null);
  const [flashDone, setFlashDone] = useState(getFlashcardsDone());

  const course = courses.find(c => c.id === courseId);
  const labels = weekLabels[courseId] || [];
  const weekProblems = problems.filter(p => p.courseId === courseId && p.weekNum === week);

  useEffect(() => {
    setLoading(true);
    import(`../data/notes/${courseId}/week${week}.json`)
      .then(m => { setNoteData(m.default || m); setLoading(false); })
      .catch(() => { setNoteData(null); setLoading(false); });

    import(`../data/flashcards/${courseId}/week${week}.json`)
      .then(m => setFlashcardData(m.default || m))
      .catch(() => setFlashcardData(null));

    saveLastVisited(courseId, `/course/${courseId}/lecture/${week}`);
  }, [courseId, week]);

  useEffect(() => {
    const el = contentRef.current;
    if (!el) return;
    function onScroll() {
      const scrollTop = el.scrollTop;
      const scrollHeight = el.scrollHeight - el.clientHeight;
      setScrollPct(scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0);
    }
    el.addEventListener('scroll', onScroll, { passive: true });
    return () => el.removeEventListener('scroll', onScroll);
  }, [loading]);

  const totalWeeks = labels.length;
  const flashKey = `${courseId}_week${week}`;

  function handleFlashComplete(score, total) {
    const xp = score * 5;
    addXP(xp);
    showXPToast(xp);
    const done = getFlashcardsDone();
    done[flashKey] = true;
    saveFlashcardsDone(done);
    setFlashDone({ ...done });
    setFlashcardOpen(false);
  }

  const breadcrumb = [
    { label: 'Dashboard', to: '/dashboard' },
    { label: course?.shortTitle || courseId, to: `/course/${courseId}` },
    { label: labels[week] || `Week ${week}` },
  ];

  function handleCopyCode(code, e) {
    navigator.clipboard?.writeText(String(code));
    const btn = e?.target || e?.currentTarget;
    if (btn) {
      btn.textContent = 'Copied ✓';
      btn.classList.add('copied');
      setTimeout(() => {
        btn.textContent = 'Copy';
        btn.classList.remove('copied');
      }, 1500);
    }
  }

  return (
    <div className="flex h-screen overflow-hidden page-fade relative">
      {/* Scroll progress bar */}
      <div className="fixed top-0 left-0 right-0 z-50 h-[3px]" style={{ background: 'var(--fa-surface)' }}>
        <div className="h-full transition-all duration-150" style={{ width: `${scrollPct}%`, background: 'var(--fa-gradient)' }} />
      </div>

      {/* Left sidebar — week list */}
      <aside className="w-52 flex-shrink-0 border-r border-border bg-bg-sidebar overflow-y-auto hidden lg:block">
        <div className="p-3">
          <Link to={`/course/${courseId}`} className="flex items-center gap-1.5 text-xs text-text-muted hover:text-text-primary mb-3 transition-colors">
            <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M15 18l-6-6 6-6"/></svg>
            {course?.shortTitle}
          </Link>

          <p className="text-xs font-semibold uppercase tracking-wider text-text-muted mb-2 px-1">Lectures</p>
          {labels.map((label, i) => (
            <button
              key={i}
              onClick={() => navigate(`/course/${courseId}/lecture/${i}`)}
              className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs mb-0.5 transition-all duration-150 ${
                i === week
                  ? 'bg-accent-purple/8 text-accent-purple border-l-[3px] border-accent-purple pl-[calc(0.625rem-3px)]'
                  : 'text-text-muted hover:text-text-primary hover:bg-white/5'
              }`}
            >
              <span className="opacity-60 mr-1">{i}.</span> {label}
            </button>
          ))}
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 overflow-y-auto" ref={contentRef}>
        {/* Breadcrumb */}
        <div className="sticky top-0 px-6 py-3 z-10" style={{ background: 'rgba(8,8,18,0.95)', backdropFilter: 'blur(12px)', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
          <div className="flex items-center gap-2 text-xs text-text-muted">
            {breadcrumb.map((b, i) => (
              <span key={i} className="flex items-center gap-2">
                {i > 0 && <span className="text-accent-cyan">›</span>}
                {b.to ? <Link to={b.to} className="hover:text-text-primary transition-colors">{b.label}</Link> : <span className="gradient-text">{b.label}</span>}
              </span>
            ))}
          </div>
        </div>

        <div className="max-w-3xl mx-auto px-6 py-8">
          {loading ? (
            <div className="space-y-4">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="shimmer-bg rounded-lg h-4" style={{ width: `${60 + (i % 3) * 15}%` }} />
              ))}
            </div>
          ) : !noteData ? (
            <div className="text-center py-20">
              <svg width="64" height="64" viewBox="0 0 64 64" fill="none" className="mx-auto mb-4" style={{ opacity: 0.3 }}>
                <circle cx="32" cy="32" r="28" stroke="currentColor" strokeWidth="2" className="text-text-muted"/>
                <path d="M24 24h16v4H24zM24 36h16v4H24z" fill="currentColor" className="text-text-muted"/>
              </svg>
              <h2 className="text-lg font-semibold text-text-primary mb-2">Notes not available</h2>
              <p className="text-text-muted text-sm mb-4">Lecture notes for Week {week} haven't been added yet.</p>
              <Link to={`/course/${courseId}`} className="btn-primary text-sm">Back to Course</Link>
            </div>
          ) : (
            <>
              {/* Title */}
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs text-text-muted">{noteData.source}</span>
                </div>
                <h1 className="text-2xl font-semibold gradient-text">{noteData.title}</h1>
              </div>

              {/* Related problems chips */}
              {weekProblems.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-6">
                  <span className="text-xs text-text-muted self-center">Problems:</span>
                  {weekProblems.map(p => (
                    <Link
                      key={p.id}
                      to={`/course/${courseId}/problem/${p.id}`}
                      className="gradient-border text-xs px-2.5 py-1 text-accent-purple hover:text-white transition-all"
                      style={{ background: 'var(--fa-surface)' }}
                      onMouseEnter={e => { e.currentTarget.style.background = 'var(--fa-gradient)'; }}
                      onMouseLeave={e => { e.currentTarget.style.background = 'var(--fa-surface)'; }}
                    >
                      {p.title}
                    </Link>
                  ))}
                </div>
              )}

              {/* Markdown content */}
              <div className="prose">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  components={{
                    code({ node, inline, className, children, ...props }) {
                      if (inline) {
                        return <code className={className} {...props}>{children}</code>;
                      }
                      const langMatch = (className || '').match(/language-(\w+)/);
                      const lang = langMatch ? langMatch[1].toUpperCase() : 'CODE';
                      return (
                        <div className="code-block-wrapper">
                          <div className="code-block-header">
                            <span className="code-block-lang">{lang}</span>
                            <button
                              className="code-block-copy"
                              onClick={(e) => {
                                navigator.clipboard?.writeText(String(children));
                                const btn = e.currentTarget;
                                btn.textContent = 'Copied ✓';
                                btn.classList.add('copied');
                                setTimeout(() => { btn.textContent = 'Copy'; btn.classList.remove('copied'); }, 1500);
                              }}
                            >
                              Copy
                            </button>
                          </div>
                          <pre style={{ margin: 0, border: 'none', borderRadius: 0 }}>
                            <code>{children}</code>
                          </pre>
                        </div>
                      );
                    },
                  }}
                >
                  {noteData.content}
                </ReactMarkdown>
              </div>

              {/* Flashcards */}
              {noteData.flashcards && noteData.flashcards.length > 0 && (
                <div className="mt-10 pt-6 border-t border-border">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-text-primary">Quick Review</h3>
                      <p className="text-sm text-text-muted">Test your knowledge with {noteData.flashcards.length} flashcards</p>
                    </div>
                    <button
                      onClick={() => setFlashcardOpen(true)}
                      className={`btn-${flashDone[flashKey] ? 'secondary' : 'primary'} flex items-center gap-2`}
                    >
                      {flashDone[flashKey] ? 'Review Again' : 'Start Flashcards'}
                    </button>
                  </div>
                </div>
              )}

              {/* Legacy flashcards from separate JSON */}
              {!noteData.flashcards && flashcardData && (
                <div className="mt-10 pt-6 border-t border-border">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-text-primary">Quick Review</h3>
                      <p className="text-sm text-text-muted">Test your knowledge with {flashcardData.length} flashcards</p>
                    </div>
                    <button
                      onClick={() => setFlashcardOpen(true)}
                      className={`btn-${flashDone[flashKey] ? 'secondary' : 'primary'} flex items-center gap-2`}
                    >
                      {flashDone[flashKey] ? 'Review Again' : 'Start Flashcards'}
                    </button>
                  </div>
                </div>
              )}

              {/* Quiz */}
              {noteData.quiz && noteData.quiz.length > 0 && (
                <LectureQuiz quiz={noteData.quiz} courseId={courseId} weekNum={week} />
              )}
            </>
          )}
        </div>
      </div>

      {/* My Notes panel (right) */}
      <div className={`flex-shrink-0 border-l border-border overflow-hidden transition-all duration-300 ${notesOpen ? 'w-80' : 'w-0'}`}>
        {notesOpen && (
          <NotesPad pageType="lecture" pageId={`${courseId}_week${week}`} onClose={() => setNotesOpen(false)} />
        )}
      </div>

      {/* AI Drawer */}
      {aiDrawerOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="absolute inset-0 bg-black/40" onClick={() => setAiDrawerOpen(false)} />
          <div className="relative w-[380px] bg-bg-surface border-l border-border h-full flex flex-col" style={{ animation: 'slideUp 350ms ease-out' }}>
            <div className="flex items-center justify-between px-4 py-3 border-b border-border">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold" style={{ background: 'var(--fa-gradient)' }}>FA</div>
                <span className="font-semibold text-sm text-text-primary">Fraylon Mentor</span>
              </div>
              <button onClick={() => setAiDrawerOpen(false)} className="text-text-muted hover:text-text-primary">
                <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M18 6L6 18M6 6l12 12"/></svg>
              </button>
            </div>
            <AIMentor
              mode="lecture"
              contextTitle={noteData?.title}
              contextSource={noteData?.source}
              contextContent={noteData?.content?.slice(0, 500)}
            />
          </div>
        </div>
      )}

      {/* Floating buttons */}
      <div className="fixed bottom-6 right-6 flex flex-col gap-2 z-40">
        <button
          onClick={() => setNotesOpen(!notesOpen)}
          title="My Notes"
          className="w-11 h-11 rounded-full bg-bg-surface border border-border text-text-muted hover:text-text-primary hover:border-accent-purple transition-all shadow-lg flex items-center justify-center"
        >
          <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
        </button>
        <button
          onClick={() => setAiDrawerOpen(true)}
          className="h-11 px-4 rounded-full text-white shadow-lg flex items-center justify-center gap-2 hover:brightness-110 transition-all"
          style={{ background: 'var(--fa-gradient)' }}
          title="Ask Fraylon AI"
        >
          <span className="text-sm font-semibold">Ask Fraylon AI</span>
          <span className="text-sm">✦</span>
        </button>
      </div>

      {/* Flashcard modal */}
      {flashcardOpen && (noteData?.flashcards || flashcardData) && (
        <FlashcardModal
          cards={noteData?.flashcards || flashcardData}
          title={noteData?.title}
          onClose={() => setFlashcardOpen(false)}
          onComplete={handleFlashComplete}
        />
      )}
    </div>
  );
}
