import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './lib/AuthContext';
import { ToastProvider } from './lib/ToastContext';
import AppLayout from './components/AppLayout';
import AuthPage from './pages/AuthPage';
import Dashboard from './pages/Dashboard';
import CourseOverview from './pages/CourseOverview';
import LecturePage from './pages/LecturePage';
import ProblemPage from './pages/ProblemPage';
import ProfilePage from './pages/ProfilePage';
import LeaderboardPage from './pages/LeaderboardPage';
import ConceptMapPage from './pages/ConceptMapPage';

export default function App() {
  return (
    <HashRouter>
      <AuthProvider>
        <ToastProvider>
          <Routes>
            <Route path="/" element={<AuthPage />} />
            <Route element={<AppLayout />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/course/:courseId" element={<CourseOverview />} />
              <Route path="/course/:courseId/lecture/:weekNum" element={<LecturePage />} />
              <Route path="/course/:courseId/problem/:problemId" element={<ProblemPage />} />
              <Route path="/course/:courseId/map" element={<ConceptMapPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/leaderboard" element={<LeaderboardPage />} />
            </Route>
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </ToastProvider>
      </AuthProvider>
    </HashRouter>
  );
}
