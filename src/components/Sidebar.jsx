import { useState, useEffect } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../lib/AuthContext';
import { getXP, getStreak } from '../lib/storage';
import { getLevel, getLevelProgress } from '../lib/xp';
import { weekLabels } from '../data/courses';

export default function Sidebar({ collapsed, setCollapsed }) {
  const { session, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [cs50pOpen, setCs50pOpen] = useState(true);
  const [cs50aiOpen, setCs50aiOpen] = useState(false);
  const [xpData, setXpData] = useState(getXP());
  const [streak, setStreak] = useState(getStreak());

  useEffect(() => {
    const refresh = () => { setXpData(getXP()); setStreak(getStreak()); };
    window.addEventListener('storage', refresh);
    const id = setInterval(refresh, 3000);
    return () => { window.removeEventListener('storage', refresh); clearInterval(id); };
  }, []);

  const level = getLevel(xpData.total);
  const progress = getLevelProgress(xpData.total);
  const initials = session?.name?.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2) || 'U';

  function handleLogout() {
    logout();
    navigate('/');
  }

  if (collapsed) {
    return (
      <aside className="fixed left-0 top-0 h-screen w-14 bg-bg-sidebar border-r border-border flex flex-col items-center py-4 gap-4 z-40 transition-all duration-300">
        <button onClick={() => setCollapsed(false)} className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-white/5 text-text-muted hover:text-text-primary transition-colors">
          <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M9 18l6-6-6-6"/></svg>
        </button>
        <NavLink to="/dashboard" title="Dashboard" className={({ isActive }) => `w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${isActive ? 'bg-accent-purple/20 text-accent-purple' : 'text-text-muted hover:text-text-primary hover:bg-white/5'}`}>
          <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
        </NavLink>
        <NavLink to="/course/cs50p" title="CS50 Python" className={({ isActive }) => `w-8 h-8 rounded-lg flex items-center justify-center transition-colors text-sm ${isActive || location.pathname.includes('cs50p') ? 'bg-accent-purple/20 text-accent-purple' : 'text-text-muted hover:text-text-primary hover:bg-white/5'}`}>🐍</NavLink>
        <NavLink to="/course/cs50ai" title="CS50 AI" className={({ isActive }) => `w-8 h-8 rounded-lg flex items-center justify-center transition-colors text-sm ${isActive || location.pathname.includes('cs50ai') ? 'bg-accent-purple/20 text-accent-purple' : 'text-text-muted hover:text-text-primary hover:bg-white/5'}`}>🤖</NavLink>
        <NavLink to="/leaderboard" title="Leaderboard" className={({ isActive }) => `w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${isActive ? 'bg-accent-purple/20 text-accent-purple' : 'text-text-muted hover:text-text-primary hover:bg-white/5'}`}>
          <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z"/></svg>
        </NavLink>
        <NavLink to="/profile" title="Profile" className={({ isActive }) => `w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${isActive ? 'bg-accent-purple/20 text-accent-purple' : 'text-text-muted hover:text-text-primary hover:bg-white/5'}`}>
          <div className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold" style={{ background: 'var(--fa-gradient)' }}>{initials}</div>
        </NavLink>
      </aside>
    );
  }

  return (
    <aside className="fixed left-0 top-0 h-screen w-60 bg-bg-sidebar border-r border-border flex flex-col z-40 transition-all duration-300 overflow-hidden">
      {/* Header with radial glow */}
      <div className="relative px-4 py-4 border-b border-border" style={{ background: 'radial-gradient(circle at 50% 30%, rgba(139,92,246,0.12) 0%, transparent 70%)' }}>
        <div className="flex items-center justify-between relative z-10">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: 'var(--fa-gradient)' }}>
              <svg width="14" height="14" viewBox="0 0 20 20" fill="none">
                <path d="M10 2L3 6v8l7 4 7-4V6L10 2z" stroke="white" strokeWidth="1.5" strokeLinejoin="round" fill="rgba(255,255,255,0.1)" />
                <path d="M10 2v12M3 6l7 4 7-4" stroke="white" strokeWidth="1.5" strokeLinejoin="round" />
              </svg>
            </div>
            <span className="text-sm font-bold">
              <span className="text-white">Fraylon</span>
              <span className="gradient-text">Academy</span>
            </span>
          </div>
          <button onClick={() => setCollapsed(true)} className="w-6 h-6 rounded flex items-center justify-center text-text-muted hover:text-text-primary transition-colors">
            <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M15 18l-6-6 6-6"/></svg>
          </button>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-3 px-2">
        <SidebarItem to="/dashboard" icon={<DashIcon />} label="Dashboard" />

        {/* CS50 Python */}
        <div className="mt-3">
          <button
            onClick={() => setCs50pOpen(!cs50pOpen)}
            className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-text-muted hover:text-text-primary hover:bg-white/5 transition-colors group"
          >
            <div className="flex items-center gap-2">
              <span className="text-base">🐍</span>
              <span className="text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full" style={{ background: 'var(--fa-gradient)' }} />
                CS50 Python
              </span>
            </div>
            <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" className={`transition-transform duration-200 ${cs50pOpen ? 'rotate-90' : ''}`}><path d="M9 18l6-6-6-6"/></svg>
          </button>

          <div className={`overflow-hidden transition-all duration-200 ${cs50pOpen ? 'max-h-96' : 'max-h-0'}`}>
            <div className="ml-2 pl-2 border-l border-border mt-1 space-y-0.5">
              {weekLabels.cs50p.map((label, i) => (
                <div key={i}>
                  <p className="px-2 py-1 text-xs text-text-muted font-medium">{label}</p>
                  <div className="space-y-0.5 mb-1">
                    <SidebarSubItem to={`/course/cs50p/lecture/${i}`} label="Notes" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* CS50 AI */}
        <div className="mt-1">
          <button
            onClick={() => setCs50aiOpen(!cs50aiOpen)}
            className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-text-muted hover:text-text-primary hover:bg-white/5 transition-colors"
          >
            <div className="flex items-center gap-2">
              <span className="text-base">🤖</span>
              <span className="text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full" style={{ background: 'var(--fa-gradient)' }} />
                CS50 AI
              </span>
            </div>
            <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" className={`transition-transform duration-200 ${cs50aiOpen ? 'rotate-90' : ''}`}><path d="M9 18l6-6-6-6"/></svg>
          </button>

          <div className={`overflow-hidden transition-all duration-200 ${cs50aiOpen ? 'max-h-96' : 'max-h-0'}`}>
            <div className="ml-2 pl-2 border-l border-border mt-1 space-y-0.5">
              {weekLabels.cs50ai.map((label, i) => (
                <div key={i}>
                  <p className="px-2 py-1 text-xs text-text-muted font-medium">{label}</p>
                  <div className="space-y-0.5 mb-1">
                    <SidebarSubItem to={`/course/cs50ai/lecture/${i}`} label="Notes" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-3 pt-3 border-t border-border">
          <SidebarItem to="/leaderboard" icon={<StarIcon />} label="Leaderboard" />
          <SidebarItem to="/profile" icon={<UserIcon />} label="Profile" />
        </div>
      </nav>

      {/* User footer */}
      <div className="px-3 py-3" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1.5 text-xs text-text-muted">
            <span>🔥</span>
            <span className="font-medium text-text-primary">{streak.count}</span>
            <span>day streak</span>
          </div>
          <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ background: level.color + '22', color: level.color }}>
            {level.name}
          </span>
        </div>

        <div className="h-1 bg-border rounded-full mb-3 overflow-hidden progress-shimmer">
          <div className="h-full rounded-full transition-all duration-500" style={{ width: `${progress}%`, background: 'var(--fa-gradient)' }} />
        </div>

        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0" style={{ background: 'var(--fa-gradient)' }}>
            {initials}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-xs font-medium text-text-primary truncate">{session?.name}</div>
            <div className="text-xs text-text-muted">{xpData.total} XP</div>
          </div>
          <button onClick={handleLogout} title="Sign out" className="text-text-muted hover:text-error transition-colors">
            <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9"/></svg>
          </button>
        </div>
      </div>
    </aside>
  );
}

function SidebarItem({ to, icon, label }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-all duration-150 ${
          isActive
            ? 'text-accent-purple bg-accent-purple/8 pl-[calc(0.75rem-3px)] border-l-[3px] border-accent-purple'
            : 'text-text-muted hover:text-text-primary hover:bg-white/5'
        }`
      }
    >
      <span className="w-4 h-4 flex-shrink-0">{icon}</span>
      {label}
    </NavLink>
  );
}

function SidebarSubItem({ to, label }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex items-center gap-2 pl-2 pr-2 py-1 rounded text-xs transition-all duration-150 ${
          isActive
            ? 'text-accent-purple font-medium'
            : 'text-text-muted hover:text-text-primary'
        }`
      }
    >
      <span className="w-1 h-1 rounded-full bg-current opacity-50" />
      {label}
    </NavLink>
  );
}

function DashIcon() {
  return <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" width="16" height="16"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>;
}

function StarIcon() {
  return <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" width="16" height="16"><path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z"/></svg>;
}

function UserIcon() {
  return <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" width="16" height="16"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>;
}
