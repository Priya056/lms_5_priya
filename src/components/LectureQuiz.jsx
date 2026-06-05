import { useState, useEffect } from 'react';
import { useToast } from '../lib/ToastContext';
import { addXP } from '../lib/xp';
import { getQuizResult, saveQuizResult } from '../lib/storage';

export default function LectureQuiz({ quiz, courseId, weekNum }) {
  const [started, setStarted] = useState(false);
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState(null);
  const [answered, setAnswered] = useState([]);
  const [done, setDone] = useState(false);
  const { showXPToast } = useToast();

  const existing = getQuizResult(courseId, weekNum);

  function handleOption(idx) {
    if (selected !== null) return;
    setSelected(idx);
    const correct = idx === quiz[current].correct;
    setAnswered(prev => [...prev, { selected: idx, correct }]);
  }

  function handleNext() {
    if (current < quiz.length - 1) {
      setCurrent(c => c + 1);
      setSelected(null);
    } else {
      const score = answered.filter(a => a.correct).length + (selected === quiz[current].correct ? 1 : 0);
      const xp = score * 5;
      addXP(xp);
      showXPToast(xp);
      saveQuizResult(courseId, weekNum, { score, total: quiz.length, completedAt: new Date().toISOString() });
      setDone(true);
    }
  }

  if (!started) {
    return (
      <div className="mt-10 pt-6 border-t border-border">
        <h3 className="font-semibold text-text-primary mb-1">Test Your Knowledge</h3>
        <p className="text-sm text-text-muted mb-4">{quiz.length} questions about this lecture</p>
        {existing && (
          <p className="text-xs text-text-muted mb-3">
            Previous score: <span className="text-text-primary font-medium">{existing.score} / {existing.total}</span>
          </p>
        )}
        <button onClick={() => setStarted(true)} className="btn-secondary">
          Start Quiz
        </button>
      </div>
    );
  }

  if (done) {
    const score = answered.filter(a => a.correct).length;
    const pct = Math.round(score / quiz.length * 100);
    return (
      <div className="mt-10 pt-6 border-t border-border">
        <h3 className="font-semibold text-text-primary mb-4">Quiz Complete!</h3>
        <div className="card text-center py-8">
          <div className="text-5xl mb-3">{pct >= 80 ? '🏆' : pct >= 60 ? '👍' : '📚'}</div>
          <div className="text-3xl font-bold text-text-primary mb-1">{score} / {quiz.length}</div>
          <div className="text-text-muted text-sm mb-4">{pct}% correct · +{score * 5} XP earned</div>
          <div className="flex gap-3 justify-center">
            <button onClick={() => { setStarted(false); setDone(false); setCurrent(0); setSelected(null); setAnswered([]); }} className="btn-secondary text-sm">Retake Quiz</button>
          </div>
        </div>
      </div>
    );
  }

  const q = quiz[current];
  return (
    <div className="mt-10 pt-6 border-t border-border">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-text-primary">Test Your Knowledge</h3>
        <span className="text-xs text-text-muted">Question {current + 1} of {quiz.length}</span>
      </div>

      <div className="card">
        <p className="text-sm font-medium text-text-primary mb-4">{q.question}</p>
        <div className="space-y-2">
          {q.options.map((opt, i) => {
            let bg = 'bg-bg-primary border-border hover:border-accent-purple/50';
            if (selected !== null) {
              if (i === q.correct) bg = 'bg-success/10 border-success text-success';
              else if (i === selected && i !== q.correct) bg = 'bg-error/10 border-error text-error';
              else bg = 'bg-bg-primary border-border opacity-50';
            }
            return (
              <button
                key={i}
                onClick={() => handleOption(i)}
                disabled={selected !== null}
                className={`w-full text-left px-3 py-2.5 rounded-lg border text-sm transition-all duration-150 ${bg}`}
              >
                <span className="font-medium mr-2">{String.fromCharCode(65 + i)}.</span>
                {opt}
              </button>
            );
          })}
        </div>

        {selected !== null && (
          <div className="mt-4 flex justify-end">
            <button onClick={handleNext} className="btn-primary text-sm">
              {current < quiz.length - 1 ? 'Next Question' : 'Finish Quiz'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
