import { useState } from 'react';

export default function FlashcardModal({ cards, title, onClose, onComplete }) {
  const [queue, setQueue] = useState([...cards]);
  const [current, setCurrent] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [known, setKnown] = useState(0);
  const [done, setDone] = useState(false);

  const card = queue[current];

  function handleGotIt() {
    setKnown(k => k + 1);
    advance();
  }

  function handleReview() {
    const remaining = queue.filter((_, i) => i !== current);
    remaining.push(card);
    setQueue(remaining);
    setFlipped(false);
    setCurrent(Math.min(current, remaining.length - 1));
    if (remaining.length === 0) finish();
  }

  function advance() {
    setFlipped(false);
    if (current >= queue.length - 1) {
      finish();
    } else {
      setCurrent(c => c + 1);
    }
  }

  function finish() {
    setDone(true);
    onComplete(known + 1, cards.length);
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
      <div className="bg-bg-surface border border-border rounded-2xl w-full max-w-lg" style={{ animation: 'slideUp 200ms ease-out' }}>
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <div>
            <h3 className="font-semibold text-text-primary">{title} — Flashcards</h3>
            <p className="text-xs text-text-muted mt-0.5">{queue.length} cards remaining</p>
          </div>
          <button onClick={onClose} className="text-text-muted hover:text-text-primary">
            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M18 6L6 18M6 6l12 12"/></svg>
          </button>
        </div>

        {done ? (
          <div className="px-6 py-10 text-center">
            <div className="text-5xl mb-3">🎉</div>
            <h4 className="text-lg font-semibold text-text-primary">Review Complete!</h4>
            <p className="text-text-muted text-sm mt-1">+{known * 5} XP earned for knowing {known} cards</p>
            <button onClick={onClose} className="btn-primary mt-4">Done</button>
          </div>
        ) : (
          <div className="px-6 py-6">
            {/* Progress */}
            <div className="h-1 bg-border rounded-full mb-6 overflow-hidden">
              <div
                className="h-full bg-accent-purple rounded-full transition-all duration-300"
                style={{ width: `${((cards.length - queue.length) / cards.length) * 100}%` }}
              />
            </div>

            {/* Flip card */}
            <div
              className="flip-card w-full cursor-pointer select-none"
              style={{ height: 220 }}
              onClick={() => setFlipped(!flipped)}
            >
              <div className={`flip-card-inner relative w-full h-full ${flipped ? 'flipped' : ''}`}>
                {/* Front */}
                <div className="flip-card-front w-full h-full bg-bg-primary rounded-xl border border-border p-6 flex flex-col items-center justify-center text-center">
                  <div className="text-xs text-text-muted mb-3 uppercase tracking-wider">Question</div>
                  <p className="text-base font-medium text-text-primary">{card?.front}</p>
                  <p className="text-xs text-text-muted mt-4">Click to reveal answer</p>
                </div>
                {/* Back */}
                <div className="flip-card-back w-full h-full bg-accent-purple/10 rounded-xl border border-accent-purple/30 p-6 flex flex-col items-center justify-center text-center">
                  <div className="text-xs text-accent-purple mb-3 uppercase tracking-wider">Answer</div>
                  <p className="text-sm text-text-primary">{card?.back}</p>
                </div>
              </div>
            </div>

            {/* Buttons */}
            {flipped && (
              <div className="flex gap-3 mt-5">
                <button onClick={handleReview} className="flex-1 btn-danger text-sm flex items-center justify-center gap-2">
                  Review Again
                </button>
                <button onClick={handleGotIt} className="flex-1 btn-primary text-sm flex items-center justify-center gap-2" style={{ background: '#10b981' }}>
                  Got it ✓
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
