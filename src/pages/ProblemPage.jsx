import { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../lib/AuthContext';
import { getSubmissions, saveSubmissions } from '../lib/storage';
import { addXP, updateStreak, checkAndUnlockBadges } from '../lib/xp';
import { useToast } from '../lib/ToastContext';
import { problems } from '../data/problems';
import AIMentor from '../components/AIMentor';
import PomodoroTimer from '../components/PomodoroTimer';
import CodeDiffViewer from '../components/CodeDiffViewer';
import NotesPad from '../components/NotesPad';

export default function ProblemPage() {
  const { courseId, problemId } = useParams();
  const { session } = useAuth();
  const { showBadgeToast, showXPToast } = useToast();

  const problem = problems.find(p => p.id === problemId);
  const [code, setCode] = useState('');
  const [testResults, setTestResults] = useState(null);
  const [running, setRunning] = useState(false);
  const [activeTab, setActiveTab] = useState('description');
  const [openAccordion, setOpenAccordion] = useState(null);
  const [hintsShown, setHintsShown] = useState(0);
  const [hintsOpened, setHintsOpened] = useState(false);
  const [startTime] = useState(Date.now());
  const [diffOpen, setDiffOpen] = useState(false);
  const textareaRef = useRef(null);

  const userSubs = getSubmissions().filter(s => s.userId === session?.userId && s.problemId === problemId);
  const failCount = userSubs.filter(s => !s.passed).length;

  useEffect(() => {
    const subs = getSubmissions().filter(s => s.userId === session?.userId && s.problemId === problemId);
    if (subs.length > 0) {
      const last = subs.sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt))[0];
      setCode(last.code || '');
    }
  }, [problemId, session?.userId]);

  function handleKeyDown(e) {
    if (e.key === 'Tab') {
      e.preventDefault();
      const ta = textareaRef.current;
      const start = ta.selectionStart;
      const end = ta.selectionEnd;
      const newCode = code.substring(0, start) + '    ' + code.substring(end);
      setCode(newCode);
      setTimeout(() => { ta.selectionStart = ta.selectionEnd = start + 4; }, 0);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const ta = textareaRef.current;
      const start = ta.selectionStart;
      const lineStart = code.lastIndexOf('\n', start - 1) + 1;
      const currentLine = code.substring(lineStart, start);
      const indent = currentLine.match(/^(\s*)/)[1];
      const newCode = code.substring(0, start) + '\n' + indent + code.substring(start);
      setCode(newCode);
      setTimeout(() => { ta.selectionStart = ta.selectionEnd = start + 1 + indent.length; }, 0);
    } else if (e.ctrlKey && e.key === 'Enter') {
      handleSubmit();
    }
  }

  function runTests(codeToTest) {
    if (!problem) return [];
    return problem.tests.map(test => {
      try {
        const passed = test.passFn(codeToTest);
        return { name: test.name, passed: !!passed, reason: passed ? '' : 'Pattern not found in code' };
      } catch {
        return { name: test.name, passed: false, reason: 'Test evaluation error' };
      }
    });
  }

  function handleRunTests() {
    setRunning(true);
    setTimeout(() => {
      const results = runTests(code);
      setTestResults(results);
      setRunning(false);
    }, 600);
  }

  function handleSave() {
    const subs = getSubmissions();
    const existing = subs.find(s => s.userId === session?.userId && s.problemId === problemId);
    if (existing) {
      existing.code = code;
      saveSubmissions(subs);
    }
  }

  function handleSubmit() {
    setRunning(true);
    setTimeout(() => {
      const results = runTests(code);
      const passed = results.every(r => r.passed);
      setTestResults(results);
      setRunning(false);

      const sub = {
        id: crypto.randomUUID(),
        userId: session?.userId,
        problemId,
        courseId,
        code,
        passed,
        testResults: results,
        submittedAt: new Date().toISOString(),
      };
      const all = getSubmissions();
      saveSubmissions([...all, sub]);

      const isFirstSolve = !all.some(s => s.userId === session?.userId && s.problemId === problemId && s.passed);
      const isFirstTry = !all.some(s => s.userId === session?.userId && s.problemId === problemId);
      let xpEarned = 10;
      if (passed && isFirstSolve) xpEarned += 25;
      if (passed && isFirstTry && passed) xpEarned += 50;
      addXP(xpEarned);
      showXPToast(xpEarned);
      updateStreak();

      const weekNum = problem?.weekNum || 0;
      const newBadges = checkAndUnlockBadges({
        problemId, courseId, weekNum, passed,
        hintsOpened, startTime, failCount: passed ? failCount : failCount + 1,
      });
      newBadges.forEach(b => showBadgeToast(b.id));
    }, 800);
  }

  function toggleAccordion(name) {
    if (name === 'Hints') setHintsOpened(true);
    setOpenAccordion(open => open === name ? null : name);
  }

  const lines = code.split('\n');
  const allPassed = testResults && testResults.every(r => r.passed);

  if (!problem) {
    return (
      <div className="flex items-center justify-center h-screen bg-bg-primary">
        <div className="text-center">
          <div className="text-4xl mb-3">🔍</div>
          <h2 className="text-lg font-semibold text-text-primary">Problem not found</h2>
        </div>
      </div>
    );
  }

  const breadcrumb = [
    { label: 'Dashboard', to: '/dashboard' },
    { label: courseId === 'cs50p' ? 'CS50 Python' : 'CS50 AI', to: `/course/${courseId}` },
    { label: problem.title },
  ];

  return (
    <div className="flex flex-col h-screen page-fade">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 px-4 py-2.5 border-b border-border text-xs bg-bg-primary flex-shrink-0" style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
        {breadcrumb.map((b, i) => (
          <span key={i} className="flex items-center gap-2 text-text-muted">
            {i > 0 && <span className="text-accent-cyan">›</span>}
            {b.to ? <Link to={b.to} className="hover:text-text-primary transition-colors">{b.label}</Link> : <span className="text-text-primary gradient-text">{b.label}</span>}
          </span>
        ))}
      </div>

      {/* 3-panel layout */}
      <div className="flex flex-1 overflow-hidden">
        {/* LEFT PANEL */}
        <div className="w-[30%] min-w-64 border-r border-border overflow-y-auto flex flex-col bg-bg-sidebar">
          {/* Tabs */}
          <div className="flex border-b border-border flex-shrink-0">
            {['description', 'notes'].map(t => (
              <button
                key={t}
                onClick={() => setActiveTab(t)}
                className={`flex-1 py-2.5 text-xs font-medium capitalize transition-colors ${activeTab === t ? 'text-accent-purple border-b-2 border-accent-purple' : 'text-text-muted hover:text-text-primary'}`}
              >
                {t === 'notes' ? 'My Notes' : 'Description'}
              </button>
            ))}
          </div>

          {activeTab === 'notes' ? (
            <NotesPad pageType="problem" pageId={problemId} inline />
          ) : (
            <div className="p-4 space-y-4">
              <div>
                <h1 className="text-lg font-semibold text-text-primary">{problem.title}</h1>
                <code className="text-xs text-text-muted mt-1 inline-block">{problem.slug}</code>
              </div>

              <p className="text-sm text-text-primary leading-relaxed">{problem.description}</p>

              {[
                { label: 'Understanding', content: problem.understanding },
                { label: 'Hints', content: null },
                { label: 'Specification', content: problem.specification, isMarkdown: true },
                { label: 'Common Mistakes', content: null, isList: true, items: problem.commonMistakes },
              ].map(item => (
                <Accordion
                  key={item.label}
                  label={item.label}
                  open={openAccordion === item.label}
                  onToggle={() => toggleAccordion(item.label)}
                >
                  {item.label === 'Hints' ? (
                    <div className="space-y-2">
                      {problem.hints.slice(0, hintsShown).map((h, i) => (
                        <div key={i} className="flex gap-2 text-sm text-text-primary">
                          <span className="text-accent-purple font-bold flex-shrink-0">{i + 1}.</span>
                          {h}
                        </div>
                      ))}
                      {hintsShown < problem.hints.length && (
                        <button
                          onClick={() => setHintsShown(n => n + 1)}
                          className="text-xs text-accent-purple hover:text-accent-cyan transition-colors"
                        >
                          Show next hint ({hintsShown + 1}/{problem.hints.length})
                        </button>
                      )}
                      {hintsShown === 0 && (
                        <p className="text-xs text-text-muted">Click to reveal hints one at a time.</p>
                      )}
                    </div>
                  ) : item.isList ? (
                    <ul className="space-y-1.5">
                      {item.items?.map((m, i) => (
                        <li key={i} className="flex gap-2 text-sm text-text-primary">
                          <span className="text-error flex-shrink-0">×</span>
                          {m}
                        </li>
                      ))}
                    </ul>
                  ) : item.isMarkdown ? (
                    <div className="prose text-sm">
                      {item.content?.split('\n').map((line, i) => {
                        if (line.startsWith('```')) return null;
                        return <p key={i} className="my-1 text-sm text-text-primary">{line}</p>;
                      })}
                    </div>
                  ) : (
                    <p className="text-sm text-text-primary leading-relaxed">{item.content}</p>
                  )}
                </Accordion>
              ))}
            </div>
          )}
        </div>

        {/* CENTER PANEL - IDE */}
        <div className="w-[40%] flex flex-col border-r border-border">
          {/* Toolbar */}
          <div className="flex items-center justify-between px-4 py-2 border-b border-border flex-shrink-0 bg-bg-sidebar" style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
            <div className="flex items-center gap-3">
              <span className="text-xs px-2 py-0.5 rounded font-medium" style={{ background: 'rgba(16,185,129,0.15)', color: '#10b981', border: '1px solid rgba(16,185,129,0.3)' }}>Python 3</span>
              <span className="text-xs text-text-muted">{lines.length} lines</span>
            </div>
            <div className="flex items-center gap-2">
              {userSubs.length >= 2 && (
                <button onClick={() => setDiffOpen(true)} className="text-xs text-text-muted hover:text-text-primary transition-colors">
                  Compare Attempts
                </button>
              )}
            </div>
          </div>

          {/* Code editor */}
          <div className="flex-1 flex overflow-hidden bg-bg-code">
            {/* Line numbers */}
            <div className="flex-shrink-0 pt-4 pb-4 pl-3 pr-2 text-right select-none" style={{ minWidth: 44 }}>
              {lines.map((_, i) => (
                <div key={i} className="leading-6" style={{ fontSize: 12, color: '#4a4a6a', fontFamily: 'JetBrains Mono, monospace' }}>
                  {i + 1}
                </div>
              ))}
            </div>
            <textarea
              ref={textareaRef}
              value={code}
              onChange={e => setCode(e.target.value)}
              onKeyDown={handleKeyDown}
              spellCheck={false}
              placeholder="# Write your Python code here..."
              className="flex-1 resize-none p-4 pl-0 bg-transparent text-text-primary outline-none font-mono leading-6 overflow-auto"
              style={{ fontSize: 13, tabSize: 4 }}
            />
          </div>

          {/* Button row */}
          <div className="flex gap-2 px-4 py-3 border-t border-border flex-shrink-0 bg-bg-code">
            <button onClick={handleSave} className="btn-secondary text-xs py-1.5">Save</button>
            <button onClick={handleRunTests} disabled={running} className="btn-secondary text-xs py-1.5 flex items-center gap-1.5 disabled:opacity-60">
              {running ? <div className="w-3 h-3 border border-accent-purple border-t-transparent rounded-full animate-spin" /> : null}
              Run Tests
            </button>
            <button onClick={handleSubmit} disabled={running} className="btn-primary text-xs py-1.5 flex items-center gap-1.5 disabled:opacity-60">
              Submit
            </button>
          </div>

          {/* Test results */}
          {testResults && (
            <div className="border-t border-border overflow-y-auto flex-shrink-0" style={{ maxHeight: 280 }}>
              <div className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium ${allPassed ? '' : ''}`}
                style={allPassed
                  ? { background: 'rgba(16,185,129,0.12)', color: '#10b981', borderLeft: '3px solid #10b981' }
                  : { background: 'rgba(244,63,94,0.12)', color: '#f43f5e', borderLeft: '3px solid #f43f5e' }
                }
              >
                {allPassed ? (
                  <><svg width="14" height="14" fill="currentColor" viewBox="0 0 16 16"><path d="M13.854 3.646a.5.5 0 010 .708l-7 7a.5.5 0 01-.708 0l-3.5-3.5a.5.5 0 11.708-.708L6.5 10.293l6.646-6.647a.5.5 0 01.708 0z"/></svg>
                  All {testResults.length} tests passed</>
                ) : (
                  <><svg width="14" height="14" fill="currentColor" viewBox="0 0 16 16"><path d="M4.646 4.646a.5.5 0 01.708 0L8 7.293l2.646-2.647a.5.5 0 01.708.708L8.707 8l2.647 2.646a.5.5 0 01-.708.708L8 8.707l-2.646 2.647a.5.5 0 01-.708-.708L7.293 8 4.646 5.354a.5.5 0 010-.708z"/></svg>
                  {testResults.filter(r => !r.passed).length} / {testResults.length} tests failed</>
                )}
              </div>
              <div className="p-2 space-y-1">
                {testResults.map((r, i) => (
                  <div
                    key={i}
                    className="px-3 py-2 rounded-lg text-xs"
                    style={{
                      borderLeft: `3px solid ${r.passed ? '#10b981' : '#f43f5e'}`,
                      background: r.passed ? 'rgba(16,185,129,0.06)' : 'rgba(244,63,94,0.06)',
                      animation: `slideUp 150ms ease-out ${i * 80}ms both`,
                    }}
                  >
                    <div className={`flex items-center gap-2 font-medium ${r.passed ? 'text-success' : 'text-error'}`}>
                      {r.passed ? (
                        <svg width="12" height="12" fill="currentColor" viewBox="0 0 16 16"><path d="M13.854 3.646a.5.5 0 010 .708l-7 7a.5.5 0 01-.708 0l-3.5-3.5a.5.5 0 11.708-.708L6.5 10.293l6.646-6.647a.5.5 0 01.708 0z"/></svg>
                      ) : (
                        <svg width="12" height="12" fill="currentColor" viewBox="0 0 16 16"><path d="M4.646 4.646a.5.5 0 01.708 0L8 7.293l2.646-2.647a.5.5 0 01.708.708L8.707 8l2.647 2.646a.5.5 0 01-.708.708L8 8.707l-2.646 2.647a.5.5 0 01-.708-.708L7.293 8 4.646 5.354a.5.5 0 010-.708z"/></svg>
                      )}
                      {r.name}
                    </div>
                    {!r.passed && r.reason && <div className="text-text-muted mt-0.5 pl-5">{r.reason}</div>}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* RIGHT PANEL - AI Mentor */}
        <div className="w-[30%] min-w-56 flex flex-col border-l border-border bg-bg-surface">
          <AIMentor mode="problem" problem={problem} currentCode={code} />
        </div>
      </div>

      <PomodoroTimer />
      {diffOpen && <CodeDiffViewer submissions={userSubs} currentCode={code} onClose={() => setDiffOpen(false)} />}
    </div>
  );
}

function Accordion({ label, open, onToggle, children }) {
  return (
    <div className="border border-border rounded-lg overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between px-3 py-2.5 text-sm font-medium text-text-primary hover:bg-white/5 transition-colors"
      >
        {label}
        <svg
          width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"
          className={`transition-transform duration-200 text-text-muted ${open ? 'rotate-90' : ''}`}
        >
          <path d="M9 18l6-6-6-6"/>
        </svg>
      </button>
      <div className={`overflow-hidden transition-all duration-200 ${open ? 'max-h-96' : 'max-h-0'}`}>
        <div className="px-3 py-3 border-t border-border">
          {children}
        </div>
      </div>
    </div>
  );
}
