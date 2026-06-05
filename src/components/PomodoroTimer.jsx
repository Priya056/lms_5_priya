import { useState, useEffect, useRef } from 'react';
import { getPomodoroToday, savePomodoroToday } from '../lib/storage';

const PRESETS = [
  { focus: 15, break: 5 },
  { focus: 25, break: 5 },
  { focus: 45, break: 10 },
];

export default function PomodoroTimer() {
  const [expanded, setExpanded] = useState(false);
  const [mode, setMode] = useState('focus'); // focus | break
  const [presetIdx, setPresetIdx] = useState(1);
  const [secondsLeft, setSecondsLeft] = useState(25 * 60);
  const [running, setRunning] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const intervalRef = useRef(null);
  const totalSeconds = (mode === 'focus' ? PRESETS[presetIdx].focus : PRESETS[presetIdx].break) * 60;

  useEffect(() => {
    setSecondsLeft((mode === 'focus' ? PRESETS[presetIdx].focus : PRESETS[presetIdx].break) * 60);
    setRunning(false);
  }, [presetIdx, mode]);

  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(() => {
        setSecondsLeft(s => {
          if (s <= 1) {
            clearInterval(intervalRef.current);
            setRunning(false);
            handleSessionEnd();
            return 0;
          }
          return s - 1;
        });
      }, 1000);
    }
    return () => clearInterval(intervalRef.current);
  }, [running]);

  function handleSessionEnd() {
    // Play chime
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.frequency.value = 440;
      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
      osc.start();
      osc.stop(ctx.currentTime + 0.3);
    } catch {}

    if (mode === 'focus') {
      const today = getPomodoroToday();
      today.count += 1;
      savePomodoroToday(today);
      setMode('break');
    } else {
      setMode('focus');
    }
  }

  function reset() {
    setRunning(false);
    clearInterval(intervalRef.current);
    setSecondsLeft((mode === 'focus' ? PRESETS[presetIdx].focus : PRESETS[presetIdx].break) * 60);
  }

  const mm = String(Math.floor(secondsLeft / 60)).padStart(2, '0');
  const ss = String(secondsLeft % 60).padStart(2, '0');
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const progress = 1 - secondsLeft / totalSeconds;
  const dashoffset = circumference * (1 - progress);

  return (
    <div className="absolute bottom-6 left-6 z-40">
      {!expanded ? (
        <button
          onClick={() => setExpanded(true)}
          className="w-12 h-12 rounded-full bg-bg-surface border border-border text-text-muted hover:border-accent-purple hover:text-text-primary transition-all shadow-lg flex flex-col items-center justify-center"
        >
          <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
          <span className="text-xs font-mono" style={{ fontSize: 10, lineHeight: 1, marginTop: 2 }}>{mm}:{ss}</span>
        </button>
      ) : (
        <div className="bg-bg-surface border border-border rounded-2xl p-4 shadow-xl w-52">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-text-primary">{mode === 'focus' ? '🍅 Focus' : '☕ Break'}</span>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setSettingsOpen(s => !s)}
                className="text-text-muted hover:text-text-primary transition-colors"
              >
                <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="3"/><path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83"/></svg>
              </button>
              <button onClick={() => setExpanded(false)} className="text-text-muted hover:text-text-primary transition-colors">
                <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M18 6L6 18M6 6l12 12"/></svg>
              </button>
            </div>
          </div>

          {settingsOpen && (
            <div className="mb-3 flex gap-1">
              {PRESETS.map((p, i) => (
                <button
                  key={i}
                  onClick={() => setPresetIdx(i)}
                  className={`flex-1 text-xs py-1 rounded border transition-colors ${i === presetIdx ? 'border-accent-purple text-accent-purple bg-accent-purple/10' : 'border-border text-text-muted hover:border-accent-purple/50'}`}
                >
                  {p.focus}m
                </button>
              ))}
            </div>
          )}

          {/* SVG ring */}
          <div className="flex justify-center mb-3">
            <div className="relative" style={{ width: 100, height: 100 }}>
              <svg width="100" height="100" style={{ transform: 'rotate(-90deg)' }}>
                <circle cx="50" cy="50" r={radius} fill="none" stroke="#1e1e3a" strokeWidth="6" />
                <circle
                  cx="50" cy="50" r={radius} fill="none"
                  stroke={mode === 'focus' ? '#8b5cf6' : '#10b981'} strokeWidth="6"
                  strokeDasharray={circumference}
                  strokeDashoffset={dashoffset}
                  strokeLinecap="round"
                  style={{ transition: 'stroke-dashoffset 1s linear' }}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="font-mono font-bold text-text-primary" style={{ fontSize: 20 }}>{mm}:{ss}</span>
              </div>
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setRunning(r => !r)}
              className="flex-1 btn-primary text-xs py-1.5"
              style={{ background: mode === 'break' ? '#22c55e' : undefined }}
            >
              {running ? 'Pause' : 'Start'}
            </button>
            <button onClick={reset} className="btn-secondary text-xs py-1.5 px-2">
              Reset
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
