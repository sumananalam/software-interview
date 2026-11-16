import React, { useEffect, useState } from 'react';
import { Brain, History, ChevronRight, Award, Calendar, Layers } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { InterviewSession } from '../types';

interface HistoryPageProps {
  setActivePage: (page: string) => void;
  setSelectedSessionId: (id: number) => void;
}

export const HistoryPage: React.FC<HistoryPageProps> = ({ setActivePage, setSelectedSessionId }) => {
  const { token } = useAuth();
  const [history, setHistory] = useState<InterviewSession[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await fetch('/api/interviews/history', {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setHistory(data);
        }
      } catch (err) {
        console.error('Failed to fetch history', err);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, [token]);

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-80px)] bg-slate-950 flex items-center justify-center text-slate-400">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-xs">Loading interview history...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-80px)] bg-slate-950 text-slate-100 p-6 lg:p-12">
      <div className="max-w-5xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold">
              <History className="w-3.5 h-3.5" /> Practice Records
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">Interview History</h1>
            <p className="text-xs sm:text-sm text-slate-400">Review all your past mock interview sessions, scores, and feedback reports</p>
          </div>
          <button 
            onClick={() => setActivePage('interview_setup')}
            className="px-5 py-3 text-xs font-semibold text-white bg-gradient-to-r from-violet-600 to-indigo-600 rounded-xl hover:from-violet-500 hover:to-indigo-500 shadow-lg shadow-indigo-500/20 transition-all"
          >
            Start New Interview
          </button>
        </div>

        {history.length > 0 ? (
          <div className="space-y-4">
            {history.map((session) => (
              <div 
                key={session.id}
                onClick={() => {
                  setSelectedSessionId(session.id);
                  setActivePage('results');
                }}
                className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 hover:border-indigo-500/50 backdrop-blur-xl transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4 group"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 group-hover:scale-105 transition-transform shrink-0">
                    <Brain className="w-6 h-6" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-base font-semibold text-white group-hover:text-indigo-300 transition-colors">{session.job_role_title}</h3>
                    <div className="flex items-center gap-3 text-xs text-slate-400">
                      <span className="flex items-center gap-1"><Layers className="w-3.5 h-3.5" /> {session.interview_type}</span>
                      <span>·</span>
                      <span>{session.difficulty}</span>
                      <span>·</span>
                      <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> {new Date(session.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-6 justify-between sm:justify-end">
                  <div className="text-right">
                    <span className="text-lg font-bold text-indigo-400 tabular-nums">{session.score} / 10</span>
                    <p className="text-[10px] text-slate-500 uppercase tracking-widest">{session.status}</p>
                  </div>
                  <div className="w-9 h-9 rounded-xl bg-slate-800 flex items-center justify-center text-slate-300 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                    <ChevronRight className="w-4 h-4" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-12 text-center rounded-3xl bg-slate-900/40 border border-slate-800 space-y-4">
            <History className="w-12 h-12 text-slate-600 mx-auto" />
            <h3 className="text-base font-semibold text-white">No interview history found</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">Complete your first mock interview to see detailed evaluation reports here.</p>
            <button 
              onClick={() => setActivePage('interview_setup')}
              className="px-5 py-2.5 text-xs font-semibold text-white bg-indigo-600 rounded-xl hover:bg-indigo-500 transition-colors"
            >
              Start First Interview
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
