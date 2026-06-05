import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { getSession, setSession, clearSession } from '../lib/storage';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [session, setSessionState] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const s = getSession();
    setSessionState(s);
    setLoading(false);
  }, []);

  const login = useCallback((sessionData) => {
    setSession(sessionData);
    setSessionState(sessionData);
  }, []);

  const logout = useCallback(() => {
    clearSession();
    setSessionState(null);
  }, []);

  return (
    <AuthContext.Provider value={{ session, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
