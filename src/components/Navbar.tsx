import React from 'react';
import { Brain, Sparkles, LogOut, User as UserIcon, LayoutDashboard, History, PlayCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface NavbarProps {
  activePage: string;
  setActivePage: (page: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activePage, setActivePage }) => {
  const { user, logout } = useAuth();

  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl bg-slate-950/80 border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between gap-8">
        {/* Zone 1: Brand */}
        <div 
          onClick={() => setActivePage(user ? 'dashboard' : 'landing')}
          className="flex items-center gap-3 cursor-pointer shrink-0"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-violet-600 via-indigo-600 to-cyan-400 p-0.5 shadow-lg shadow-indigo-500/25">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <Brain className="w-5 h-5 text-indigo-400" />
            </div>
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-bold tracking-tight text-white whitespace-nowrap">
              Interview<span className="text-indigo-400">Mate</span>
            </span>
            <span className="text-[10px] uppercase tracking-widest text-slate-400 font-semibold">AI Mock Platform</span>
          </div>
        </div>

        {/* Zone 2: Navigation Links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-300">
          {!user ? (
            <>
              <button onClick={() => setActivePage('landing')} className={`hover:text-white transition-colors whitespace-nowrap shrink-0 ${activePage === 'landing' ? 'text-indigo-400 font-semibold' : ''}`}>Home</button>
              <button onClick={() => setActivePage('landing')} className="hover:text-white transition-colors whitespace-nowrap shrink-0">Features</button>
              <button onClick={() => setActivePage('landing')} className="hover:text-white transition-colors whitespace-nowrap shrink-0">How It Works</button>
            </>
          ) : (
            <>
              <button onClick={() => setActivePage('dashboard')} className={`flex items-center gap-2 hover:text-white transition-colors whitespace-nowrap shrink-0 ${activePage === 'dashboard' ? 'text-indigo-400 font-semibold' : ''}`}>
                <LayoutDashboard className="w-4 h-4" /> Dashboard
              </button>
              <button onClick={() => setActivePage('interview_setup')} className={`flex items-center gap-2 hover:text-white transition-colors whitespace-nowrap shrink-0 ${activePage === 'interview_setup' ? 'text-indigo-400 font-semibold' : ''}`}>
                <PlayCircle className="w-4 h-4" /> Practice Interview
              </button>
              <button onClick={() => setActivePage('history')} className={`flex items-center gap-2 hover:text-white transition-colors whitespace-nowrap shrink-0 ${activePage === 'history' ? 'text-indigo-400 font-semibold' : ''}`}>
                <History className="w-4 h-4" /> History
              </button>
              <button onClick={() => setActivePage('profile')} className={`flex items-center gap-2 hover:text-white transition-colors whitespace-nowrap shrink-0 ${activePage === 'profile' ? 'text-indigo-400 font-semibold' : ''}`}>
                <UserIcon className="w-4 h-4" /> Profile
              </button>
            </>
          )}
        </nav>

        {/* Zone 3: Primary Action */}
        <div className="flex items-center gap-4 shrink-0">
          {!user ? (
            <div className="flex items-center gap-3">
              <button 
                onClick={() => setActivePage('login')}
                className="px-4 py-2 text-sm font-medium text-slate-300 hover:text-white transition-colors whitespace-nowrap shrink-0"
              >
                Login
              </button>
              <button 
                onClick={() => setActivePage('register')}
                className="px-5 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-violet-600 to-indigo-600 rounded-xl hover:from-violet-500 hover:to-indigo-500 shadow-lg shadow-indigo-500/25 transition-all whitespace-nowrap shrink-0"
              >
                Get Started
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <div className="hidden sm:flex flex-col text-right">
                <span className="text-xs font-semibold text-white">{user.name}</span>
                <span className="text-[10px] text-indigo-400">{user.preferred_job_role}</span>
              </div>
              <button 
                onClick={logout}
                className="flex items-center gap-2 px-3.5 py-2 text-xs font-medium text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl hover:bg-red-500/20 transition-all whitespace-nowrap shrink-0"
                title="Logout"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
