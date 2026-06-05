import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../lib/AuthContext';
import { getUsers, saveUsers } from '../lib/storage';

export default function AuthPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [mode, setMode] = useState('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const users = getUsers();
  const hasNoUsers = users.length === 0;

  function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);

    setTimeout(() => {
      if (mode === 'register') {
        const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRe.test(email)) { setError('Invalid email address.'); setLoading(false); return; }
        if (password.length < 8) { setError('Password must be at least 8 characters.'); setLoading(false); return; }
        if (!name.trim()) { setError('Please enter your name.'); setLoading(false); return; }

        const allUsers = getUsers();
        if (allUsers.find((u) => u.email === email)) {
          setError('An account with this email already exists.');
          setLoading(false);
          return;
        }

        const newUser = {
          id: crypto.randomUUID(),
          name: name.trim(),
          email,
          password: btoa(password),
          createdAt: new Date().toISOString(),
        };
        saveUsers([...allUsers, newUser]);
        login({ userId: newUser.id, name: newUser.name, email: newUser.email });
        navigate('/dashboard');
      } else {
        const allUsers = getUsers();
        const user = allUsers.find((u) => u.email === email);
        if (!user || user.password !== btoa(password)) {
          setError('Invalid email or password.');
          setLoading(false);
          return;
        }
        login({ userId: user.id, name: user.name, email: user.email });
        navigate('/dashboard');
      }
      setLoading(false);
    }, 300);
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ background: 'radial-gradient(ellipse at 50% 40%, rgba(139,92,246,0.08) 0%, #080812 60%)' }}>
      <div className="w-full max-w-md">
        {hasNoUsers && (
          <div className="mb-4 px-4 py-3 rounded-lg bg-accent-purple/10 border border-accent-purple/30 text-sm text-text-primary text-center">
            No account? Create one — your data stays in this browser.
          </div>
        )}

        <div className="bg-bg-surface border border-border-2 rounded-2xl p-8" style={{ backdropFilter: 'blur(20px)', boxShadow: '0 25px 50px rgba(0,0,0,0.5)', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
          {/* Logo */}
          <div className="flex items-center justify-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'var(--fa-gradient)' }}>
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M10 2L3 6v8l7 4 7-4V6L10 2z" stroke="white" strokeWidth="1.5" strokeLinejoin="round" fill="rgba(255,255,255,0.1)" />
                <path d="M10 2v12M3 6l7 4 7-4" stroke="white" strokeWidth="1.5" strokeLinejoin="round" />
              </svg>
            </div>
            <div className="text-2xl font-bold">
              <span className="text-white">Fraylon</span>
              <span className="gradient-text">Academy</span>
            </div>
          </div>

          <h2 className="text-center text-lg font-semibold text-text-primary mb-1">
            {mode === 'login' ? 'Welcome back' : 'Create your account'}
          </h2>
          <p className="text-center text-sm text-text-muted mb-6">
            {mode === 'login' ? 'Sign in to continue learning' : 'Start your CS50 journey today'}
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'register' && (
              <div>
                <label className="block text-sm font-medium text-text-primary mb-1.5">Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="John Doe"
                  className="w-full px-3.5 py-2.5 rounded-lg bg-bg-primary border border-border text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent-purple transition-colors text-sm"
                  style={{ '--tw-ring-color': 'rgba(139,92,246,0.15)' }}
                  required
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-text-primary mb-1.5">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full px-3.5 py-2.5 rounded-lg bg-bg-primary border border-border text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent-purple transition-colors text-sm"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-text-primary mb-1.5">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={mode === 'register' ? 'At least 8 characters' : '--------'}
                className="w-full px-3.5 py-2.5 rounded-lg bg-bg-primary border border-border text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent-purple transition-colors text-sm"
                style={{ boxShadow: 'none' }}
                required
              />
            </div>

            {error && (
              <div className="flex items-center gap-2 px-3 py-2.5 rounded-lg bg-error/10 border border-error/30 text-sm text-error">
                <svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16"/><path d="M7.002 11a1 1 0 1 1 2 0 1 1 0 0 1-2 0M7.1 4.995a.905.905 0 1 1 1.8 0l-.35 3.507a.553.553 0 0 1-1.1 0z"/></svg>
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary py-2.5 mt-2 flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                mode === 'login' ? 'Sign In' : 'Create Account'
              )}
            </button>
          </form>

          <p className="mt-5 text-center text-sm text-text-muted">
            {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
            <button
              onClick={() => { setMode(mode === 'login' ? 'register' : 'login'); setError(''); }}
              className="text-accent-purple hover:text-accent-cyan font-medium transition-colors"
            >
              {mode === 'login' ? 'Create one' : 'Sign in'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
