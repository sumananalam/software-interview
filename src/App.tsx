import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { DashboardPage } from './pages/DashboardPage';
import { InterviewSetupPage } from './pages/InterviewSetupPage';
import { InterviewSessionPage } from './pages/InterviewSessionPage';
import { ResultsPage } from './pages/ResultsPage';
import { HistoryPage } from './pages/HistoryPage';
import { ProfilePage } from './pages/ProfilePage';

function AppContent() {
  const { user, loading } = useAuth();
  const [activePage, setActivePage] = useState<string>('landing');
  const [sessionData, setSessionData] = useState<any>(null);
  const [selectedSessionId, setSelectedSessionId] = useState<number>(0);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-slate-400">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-xs">Loading InterviewMate...</p>
        </div>
      </div>
    );
  }

  // Auto direct landing if logged in and on landing
  const effectivePage = (!user && ['dashboard', 'interview_setup', 'interview_session', 'results', 'history', 'profile'].includes(activePage)) 
    ? 'login' 
    : activePage;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      <Navbar activePage={effectivePage} setActivePage={setActivePage} />

      <main className="flex-1">
        {effectivePage === 'landing' && <LandingPage setActivePage={setActivePage} />}
        {effectivePage === 'login' && <LoginPage setActivePage={setActivePage} />}
        {effectivePage === 'register' && <RegisterPage setActivePage={setActivePage} />}
        {effectivePage === 'dashboard' && <DashboardPage setActivePage={setActivePage} setSelectedSessionId={setSelectedSessionId} />}
        {effectivePage === 'interview_setup' && <InterviewSetupPage setActivePage={setActivePage} setSessionData={setSessionData} />}
        {effectivePage === 'interview_session' && <InterviewSessionPage sessionData={sessionData} setActivePage={setActivePage} setSelectedSessionId={setSelectedSessionId} />}
        {effectivePage === 'results' && <ResultsPage sessionId={selectedSessionId} setActivePage={setActivePage} />}
        {effectivePage === 'history' && <HistoryPage setActivePage={setActivePage} setSelectedSessionId={setSelectedSessionId} />}
        {effectivePage === 'profile' && <ProfilePage />}
      </main>

      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
