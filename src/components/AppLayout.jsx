import { useState } from 'react';
import { Outlet, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../lib/AuthContext';
import Sidebar from './Sidebar';
import SettingsModal from './SettingsModal';

export default function AppLayout() {
  const { session, loading } = useAuth();
  const [collapsed, setCollapsed] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const location = useLocation();

  const hideNavbar = location.pathname.includes('/problem/');

  if (loading) {
    return (
      <div className="min-h-screen bg-bg-primary flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-t-transparent rounded-full animate-spin" style={{ borderColor: '#8b5cf6', borderTopColor: 'transparent' }} />
      </div>
    );
  }

  if (!session) return <Navigate to="/" replace />;

  return (
    <div className="min-h-screen bg-bg-primary flex">
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
      <main
        className="flex-1 min-h-screen transition-all duration-300 flex flex-col"
        style={{ marginLeft: collapsed ? '3.5rem' : '15rem' }}
      >
        {!hideNavbar && (
          <nav
            className="sticky top-0 z-30 flex items-center justify-between px-5 py-2.5"
            style={{
              background: 'rgba(8,8,18,0.95)',
              backdropFilter: 'blur(12px)',
              borderBottom: '1px solid rgba(255,255,255,0.04)',
            }}
          >
            <div />
            <button
              onClick={() => setSettingsOpen(true)}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-text-muted hover:text-text-primary hover:bg-white/5 transition-colors"
              title="AI Tutor Settings"
            >
              <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                <path d="M12 15a3 3 0 100-6 3 3 0 000 6z"/>
                <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 01-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/>
              </svg>
            </button>
          </nav>
        )}
        <div className="flex-1">
          <Outlet />
        </div>
      </main>
      <SettingsModal open={settingsOpen} onClose={() => setSettingsOpen(false)} />
    </div>
  );
}
