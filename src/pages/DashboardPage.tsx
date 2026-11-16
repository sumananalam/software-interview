import React, { useEffect, useState } from 'react';
import { Brain, PlayCircle, Award, CheckCircle2, TrendingUp, Clock, ChevronRight, BarChart2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { DashboardStats, InterviewSession } from '../types';

interface DashboardPageProps {
  setActivePage: (page: string) => void;
  setSelectedSessionId: (id: number) => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({ setActivePage, setSelectedSessionId }) => {
  const { user, token } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch('/api/stats', {
          headers: { Authorization: `Bearer ${token}` }
        });
        const contentType = res.headers.get('content-type');
        if (res.ok && contentType && contentType.includes('application/json')) {
          const data = await res.json();
          setStats(data);
        }
      } catch (err) {
        console.error('Failed to fetch dashboard stats', err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, [token]);

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-80px)] bg-slate-950 flex items-center justify-center text-slate-400">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-xs">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-80px)] bg-slate-950 text-slate-100 p-6 lg:p-10">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Welcome Banner */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 p-8 rounded-3xl bg-gradient-to-r from-violet-950/40 via-indigo-950/40 to-slate-900/60 border border-indigo-500/20 backdrop-blur-xl">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold">
              <Brain className="w-3.5 h-3.5" /> Ready for Success
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Welcome back, {user?.name || 'Candidate'}!
            </h1>
            <p className="text-xs sm:text-sm text-slate-300">
              Your preferred track is <span className="text-indigo-400 font-semibold">{user?.preferred_job_role || 'Software Engineering'}</span>. Ready to practice your next interview?
            </p>
          </div>

          <button 
            onClick={() => setActivePage('interview_setup')}
            className="flex items-center justify-center gap-3 px-6 py-3.5 text-sm font-semibold text-white bg-gradient-to-r from-violet-600 to-indigo-600 rounded-2xl hover:from-violet-500 hover:to-indigo-500 shadow-xl shadow-indigo-500/25 transition-all transform hover:-translate-y-0.5 whitespace-nowrap"
          >
            <PlayCircle className="w-5 h-5" /> Start New Interview
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 backdrop-blur-xl flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-xs font-medium text-slate-400">Interviews Completed</span>
              <h3 className="text-3xl font-extrabold text-white tabular-nums">{stats?.totalInterviewsCompleted || 0}</h3>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center text-violet-400">
              <Award className="w-6 h-6" />
            </div>
          </div>

          <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 backdrop-blur-xl flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-xs font-medium text-slate-400">Average Score</span>
              <h3 className="text-3xl font-extrabold text-indigo-400 tabular-nums">
                {stats?.averageScore ? `${stats.averageScore}/10` : '0/10'}
              </h3>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
              <TrendingUp className="w-6 h-6" />
            </div>
          </div>

          <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 backdrop-blur-xl flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-xs font-medium text-slate-400">Questions Attempted</span>
              <h3 className="text-3xl font-extrabold text-white tabular-nums">{stats?.questionsAttempted || 0}</h3>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
              <CheckCircle2 className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* Recent History Section */}
        <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/60 border border-slate-800 backdrop-blur-xl space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-white tracking-tight">Recent Interview History</h3>
            <button 
              onClick={() => setActivePage('history')}
              className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 transition-colors"
            >
              View All History →
            </button>
          </div>

          {stats?.recentHistory && stats.recentHistory.length > 0 ? (
            <div className="divide-y divide-slate-800/80">
              {stats.recentHistory.map((session) => (
                <div key={session.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 first:pt-0 last:pb-0">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 shrink-0">
                      <Brain className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-white">{session.job_role_title}</h4>
                      <p className="text-xs text-slate-400 flex items-center gap-2 mt-0.5">
                        <span>{session.interview_type}</span>
                        <span>·</span>
                        <span>{session.difficulty}</span>
                        <span>·</span>
                        <span>{new Date(session.created_at).toLocaleDateString()}</span>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 justify-between sm:justify-end">
                    <div className="text-right">
                      <span className="text-sm font-bold text-indigo-400 tabular-nums">{session.score} / 10</span>
                      <p className="text-[10px] text-slate-500 uppercase tracking-wider">{session.status}</p>
                    </div>
                    <button 
                      onClick={() => {
                        setSelectedSessionId(session.id);
                        setActivePage('results');
                      }}
                      className="px-3.5 py-2 text-xs font-medium text-white bg-slate-800 hover:bg-slate-700 rounded-xl transition-colors flex items-center gap-1.5"
                    >
                      View Report <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 space-y-4">
              <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center mx-auto text-slate-500">
                <Clock className="w-6 h-6" />
              </div>
              <p className="text-sm text-slate-400">No interview sessions completed yet.</p>
              <button 
                onClick={() => setActivePage('interview_setup')}
                className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 rounded-xl hover:bg-indigo-500 transition-colors"
              >
                Start Your First Interview
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
