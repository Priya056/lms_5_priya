import { createContext, useContext, useState, useCallback } from 'react';
import { badges as badgeDefs } from '../data/badges';

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback((toast) => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { ...toast, id }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  const showBadgeToast = useCallback((badgeId) => {
    const badge = badgeDefs.find((b) => b.id === badgeId);
    if (!badge) return;
    showToast({
      type: 'badge',
      icon: badge.icon,
      title: badge.name,
      message: 'Achievement unlocked!',
    });
  }, [showToast]);

  const showXPToast = useCallback((amount) => {
    showToast({ type: 'xp', amount });
  }, [showToast]);

  return (
    <ToastContext.Provider value={{ showToast, showBadgeToast, showXPToast }}>
      {children}
      <ToastContainer toasts={toasts} />
    </ToastContext.Provider>
  );
}

function ToastContainer({ toasts }) {
  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 pointer-events-none">
      {toasts.map((t) => (
        <Toast key={t.id} toast={t} />
      ))}
    </div>
  );
}

function Toast({ toast }) {
  return (
    <div
      className="pointer-events-auto flex items-center gap-3 bg-bg-surface border border-accent-purple rounded-xl px-4 py-3 shadow-xl"
      style={{ animation: 'toastIn 300ms ease-out', minWidth: 260 }}
    >
      {toast.type === 'badge' && (
        <>
          <span className="text-2xl">{toast.icon}</span>
          <div>
            <div className="text-xs text-text-muted">{toast.message}</div>
            <div className="text-sm font-semibold text-text-primary">{toast.title}</div>
          </div>
        </>
      )}
      {toast.type === 'xp' && (
        <>
          <span className="text-lg">⚡</span>
          <div className="text-sm font-semibold text-accent-purple">+{toast.amount} XP earned!</div>
        </>
      )}
      {toast.type === 'info' && (
        <>
          <span className="text-lg">{toast.icon || 'ℹ️'}</span>
          <div className="text-sm text-text-primary">{toast.message}</div>
        </>
      )}
    </div>
  );
}

export function useToast() {
  return useContext(ToastContext);
}
