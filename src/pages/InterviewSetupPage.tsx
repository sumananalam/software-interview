import React, { useEffect, useState } from 'react';
import { Brain, PlayCircle, Briefcase, Layers, Sliders, Hash, ArrowRight, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { JobRole } from '../types';

interface InterviewSetupPageProps {
  setActivePage: (page: string) => void;
  setSessionData: (data: any) => void;
}

export const InterviewSetupPage: React.FC<InterviewSetupPageProps> = ({ setActivePage, setSessionData }) => {
  const { token } = useAuth();
  const [roles, setRoles] = useState<JobRole[]>([]);
  const [selectedRoleId, setSelectedRoleId] = useState<number>(1);
  const [interviewType, setInterviewType] = useState<string>('Technical');
  const [difficulty, setDifficulty] = useState<string>('Intermediate');
  const [numQuestions, setNumQuestions] = useState<number>(5);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const res = await fetch('/api/job-roles');
        if (res.ok) {
          const data = await res.json();
          setRoles(data);
          if (data.length > 0) setSelectedRoleId(data[0].id);
        }
      } catch (err) {
        console.error('Failed to fetch job roles', err);
      }
    };
    fetchRoles();
  }, []);

  const handleStartInterview = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/interviews/sessions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          job_role_id: selectedRoleId,
          interview_type: interviewType,
          difficulty,
          num_questions: numQuestions
        })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to create interview session');
      }

      setSessionData(data);
      setActivePage('interview_session');
    } catch (err: any) {
      setError(err.message || 'Failed to start interview session');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] bg-slate-950 text-slate-100 p-6 lg:p-12 flex items-center justify-center">
      <div className="max-w-3xl w-full p-8 sm:p-10 rounded-3xl bg-slate-900/60 border border-slate-800 backdrop-blur-xl shadow-2xl">
        <div className="text-center mb-8 space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-violet-600 to-indigo-600 p-0.5 mx-auto">
            <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
              <Brain className="w-6 h-6 text-indigo-400" />
            </div>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">Configure Your Mock Interview</h2>
          <p className="text-xs sm:text-sm text-slate-400">Select your target role, difficulty, and format to begin</p>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center gap-3 text-red-400 text-xs">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleStartInterview} className="space-y-6">
          {/* Job Role Selection */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-300 flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-indigo-400" /> Select Job Role
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {roles.map((role) => (
                <div 
                  key={role.id}
                  onClick={() => setSelectedRoleId(role.id)}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all ${selectedRoleId === role.id ? 'bg-indigo-600/10 border-indigo-500 text-white shadow-lg shadow-indigo-500/10' : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'}`}
                >
                  <h4 className="text-sm font-semibold text-white mb-1">{role.title}</h4>
                  <p className="text-[11px] text-slate-400 line-clamp-2">{role.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Interview Type & Difficulty */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-300 flex items-center gap-2">
                <Layers className="w-4 h-4 text-indigo-400" /> Interview Type
              </label>
              <div className="grid grid-cols-2 gap-3">
                {['Technical', 'HR'].map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setInterviewType(type)}
                    className={`py-3 px-4 rounded-xl border text-xs font-semibold transition-all ${interviewType === type ? 'bg-indigo-600/20 border-indigo-500 text-white' : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'}`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-300 flex items-center gap-2">
                <Sliders className="w-4 h-4 text-indigo-400" /> Difficulty Level
              </label>
              <div className="grid grid-cols-3 gap-2">
                {['Beginner', 'Intermediate', 'Advanced'].map((diff) => (
                  <button
                    key={diff}
                    type="button"
                    onClick={() => setDifficulty(diff)}
                    className={`py-3 px-2 rounded-xl border text-[11px] font-semibold transition-all text-center ${difficulty === diff ? 'bg-indigo-600/20 border-indigo-500 text-white' : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'}`}
                  >
                    {diff}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Number of Questions */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-300 flex items-center gap-2">
              <Hash className="w-4 h-4 text-indigo-400" /> Number of Questions
            </label>
            <div className="grid grid-cols-3 gap-3">
              {[5, 10, 15].map((num) => (
                <button
                  key={num}
                  type="button"
                  onClick={() => setNumQuestions(num)}
                  className={`py-3 rounded-xl border text-xs font-semibold transition-all ${numQuestions === num ? 'bg-indigo-600/20 border-indigo-500 text-white' : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'}`}
                >
                  {num} Questions
                </button>
              ))}
            </div>
          </div>

          <button 
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 py-4 text-sm font-semibold text-white bg-gradient-to-r from-violet-600 to-indigo-600 rounded-2xl hover:from-violet-500 hover:to-indigo-500 shadow-xl shadow-indigo-500/25 transition-all disabled:opacity-50 mt-4"
          >
            {loading ? 'Preparing AI Questions...' : 'Start Interview Session'} <ArrowRight className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
