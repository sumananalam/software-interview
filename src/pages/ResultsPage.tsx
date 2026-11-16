import React, { useEffect, useState } from 'react';
import { Brain, Award, CheckCircle2, AlertTriangle, Lightbulb, ArrowLeft, RefreshCw, ChevronDown, ChevronUp, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface ResultsPageProps {
  sessionId: number;
  setActivePage: (page: string) => void;
}

export const ResultsPage: React.FC<ResultsPageProps> = ({ sessionId, setActivePage }) => {
  const { token } = useAuth();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [expandedQ, setExpandedQ] = useState<{ [id: number]: boolean }>({});

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const res = await fetch(`/api/interviews/sessions/${sessionId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) {
          const resData = await res.json();
          setData(resData);
          // Expand all by default
          const exp: { [id: number]: boolean } = {};
          resData.answers?.forEach((a: any) => { exp[a.question_id] = true; });
          setExpandedQ(exp);
        }
      } catch (err) {
        console.error('Failed to fetch results', err);
      } finally {
        setLoading(false);
      }
    };
    if (sessionId) {
      fetchResults();
    }
  }, [sessionId, token]);

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-80px)] bg-slate-950 flex items-center justify-center text-slate-400">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-xs">Loading evaluation results...</p>
        </div>
      </div>
    );
  }

  if (!data || !data.session) {
    return (
      <div className="min-h-[calc(100vh-80px)] bg-slate-950 flex items-center justify-center text-slate-400">
        <div className="text-center space-y-4">
          <p>Session results not found.</p>
          <button onClick={() => setActivePage('dashboard')} className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-semibold">
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const { session, answers } = data;

  const toggleExpand = (qId: number) => {
    setExpandedQ({ ...expandedQ, [qId]: !expandedQ[qId] });
  };

  const parseJSON = (str: string) => {
    try {
      return JSON.parse(str);
    } catch {
      return [str];
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] bg-slate-950 text-slate-100 p-6 lg:p-12">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Top bar return */}
        <div className="flex items-center justify-between">
          <button 
            onClick={() => setActivePage('dashboard')}
            className="flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Dashboard
          </button>
          <button 
            onClick={() => setActivePage('interview_setup')}
            className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl transition-all shadow-lg shadow-indigo-500/20"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Practice Again
          </button>
        </div>

        {/* Score Hero Banner */}
        <div className="p-8 sm:p-10 rounded-3xl bg-gradient-to-r from-violet-950/50 via-indigo-950/50 to-slate-900 border border-indigo-500/30 backdrop-blur-xl flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-3 text-center sm:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5" /> Gemini AI Evaluation Report
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white">{session.job_role_title} Interview</h1>
            <p className="text-xs text-slate-300">
              {session.interview_type} · {session.difficulty} · Completed on {new Date(session.created_at).toLocaleDateString()}
            </p>
          </div>

          <div className="flex flex-col items-center justify-center p-6 rounded-2xl bg-slate-950/80 border border-indigo-500/30 min-w-[160px]">
            <span className="text-3xl sm:text-4xl font-extrabold text-indigo-400 tabular-nums">{session.score} <span className="text-lg text-slate-400">/ 10</span></span>
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-widest mt-1">Overall Score</span>
          </div>
        </div>

        {/* Question Feedback List */}
        <div className="space-y-6">
          <h3 className="text-lg font-bold text-white tracking-tight">Question-wise AI Feedback & Breakdown</h3>

          {answers.map((ans: any, idx: number) => {
            const strengths = parseJSON(ans.strengths);
            const missingConcepts = parseJSON(ans.missing_concepts);
            const suggestions = parseJSON(ans.suggestions);
            const isExpanded = expandedQ[ans.question_id];

            return (
              <div key={ans.id} className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 backdrop-blur-xl space-y-6">
                <div 
                  onClick={() => toggleExpand(ans.question_id)}
                  className="flex items-start justify-between gap-4 cursor-pointer"
                >
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center gap-3">
                      <span className="px-2.5 py-0.5 rounded-md bg-indigo-500/10 text-indigo-400 text-xs font-semibold">
                        Question {idx + 1}
                      </span>
                      <span className="text-xs font-semibold text-indigo-300 tabular-nums">Score: {ans.score}/10</span>
                    </div>
                    <h4 className="text-base font-semibold text-white leading-relaxed">{ans.question_text}</h4>
                  </div>
                  <button className="text-slate-400 hover:text-white p-1">
                    {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                  </button>
                </div>

                {isExpanded && (
                  <div className="space-y-6 pt-4 border-t border-slate-800 text-xs sm:text-sm">
                    {/* Your Answer */}
                    <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800/80 space-y-2">
                      <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Your Submitted Answer:</span>
                      <p className="text-slate-300 leading-relaxed whitespace-pre-wrap">{ans.user_answer}</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Strengths */}
                      <div className="p-4 rounded-2xl bg-emerald-500/5 border border-emerald-500/20 space-y-2">
                        <div className="flex items-center gap-2 text-emerald-400 font-semibold text-xs">
                          <CheckCircle2 className="w-4 h-4" /> Strengths Identified
                        </div>
                        <ul className="space-y-1.5 text-slate-300">
                          {strengths.map((s: string, i: number) => (
                            <li key={i} className="flex items-start gap-2">
                              <span className="text-emerald-400 mt-0.5">•</span> <span>{s}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Missing Concepts */}
                      <div className="p-4 rounded-2xl bg-amber-500/5 border border-amber-500/20 space-y-2">
                        <div className="flex items-center gap-2 text-amber-400 font-semibold text-xs">
                          <AlertTriangle className="w-4 h-4" /> Missing Concepts / Weaknesses
                        </div>
                        <ul className="space-y-1.5 text-slate-300">
                          {missingConcepts.map((m: string, i: number) => (
                            <li key={i} className="flex items-start gap-2">
                              <span className="text-amber-400 mt-0.5">•</span> <span>{m}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {/* Suggestions */}
                    <div className="p-4 rounded-2xl bg-indigo-500/5 border border-indigo-500/20 space-y-2">
                      <div className="flex items-center gap-2 text-indigo-400 font-semibold text-xs">
                        <Lightbulb className="w-4 h-4" /> Suggestions for Improvement
                      </div>
                      <ul className="space-y-1.5 text-slate-300">
                        {suggestions.map((s: string, i: number) => (
                          <li key={i} className="flex items-start gap-2">
                            <span className="text-indigo-400 mt-0.5">•</span> <span>{s}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Sample Improved Answer */}
                    <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                      <span className="text-[11px] font-semibold text-indigo-400 uppercase tracking-wider">Sample Model Answer:</span>
                      <p className="text-slate-300 leading-relaxed whitespace-pre-wrap">{ans.sample_improved_answer}</p>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
