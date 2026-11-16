import React, { useState, useEffect } from 'react';
import { Brain, Clock, ArrowRight, ArrowLeft, CheckCircle2, AlertCircle, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface InterviewSessionPageProps {
  sessionData: any;
  setActivePage: (page: string) => void;
  setSelectedSessionId: (id: number) => void;
}

export const InterviewSessionPage: React.FC<InterviewSessionPageProps> = ({ sessionData, setActivePage, setSelectedSessionId }) => {
  const { token } = useAuth();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<{ [questionId: number]: string }>({});
  const [timeLeft, setTimeLeft] = useState(180); // 3 minutes per question
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const questions = sessionData?.questions || [];
  const currentQuestion = questions[currentIndex];

  useEffect(() => {
    if (!sessionData || !questions.length) {
      setActivePage('interview_setup');
    }
  }, [sessionData, questions]);

  useEffect(() => {
    setTimeLeft(180);
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [currentIndex]);

  const handleAnswerChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setAnswers({
      ...answers,
      [currentQuestion.id]: e.target.value
    });
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleSubmitInterview = async () => {
    setSubmitting(true);
    setError('');

    const formattedAnswers = questions.map((q: any) => ({
      question_id: q.id,
      user_answer: answers[q.id] || 'No answer provided.'
    }));

    try {
      const res = await fetch(`/api/interviews/sessions/${sessionData.sessionId}/submit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ answers: formattedAnswers })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to submit interview');
      }

      setSelectedSessionId(sessionData.sessionId);
      setActivePage('results');
    } catch (err: any) {
      setError(err.message || 'Failed to submit interview');
      setSubmitting(false);
    }
  };

  if (!currentQuestion) return null;

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const s = secs % 60;
    return `${mins}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="min-h-[calc(100vh-80px)] bg-slate-950 text-slate-100 p-6 lg:p-12 flex items-center justify-center">
      <div className="max-w-4xl w-full p-8 sm:p-10 rounded-3xl bg-slate-900/60 border border-slate-800 backdrop-blur-xl shadow-2xl space-y-8">
        {/* Header progress */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
              <Brain className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">{sessionData.jobRole} Interview</h2>
              <p className="text-xs text-slate-400">{sessionData.interview_type} · {sessionData.difficulty}</p>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs font-semibold text-indigo-400">
              <Clock className="w-4 h-4" />
              <span className="tabular-nums">{formatTime(timeLeft)}</span>
            </div>
            <div className="text-xs font-semibold text-slate-400">
              Question <span className="text-white font-bold">{currentIndex + 1}</span> of <span className="text-white font-bold">{questions.length}</span>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-violet-600 to-indigo-600 transition-all duration-300"
            style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
          />
        </div>

        {error && (
          <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center gap-3 text-red-400 text-xs">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Question Card */}
        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-slate-950/60 border border-slate-800/80 space-y-3">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 text-[11px] font-semibold uppercase tracking-wider">
              Question {currentIndex + 1}
            </div>
            <h3 className="text-lg sm:text-xl font-semibold text-white leading-relaxed">
              {currentQuestion.question_text}
            </h3>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-300">Your Answer / Response:</label>
            <textarea
              rows={6}
              value={answers[currentQuestion.id] || ''}
              onChange={handleAnswerChange}
              placeholder="Type your detailed professional answer here..."
              className="w-full p-4 bg-slate-950 border border-slate-800 rounded-2xl text-white placeholder-slate-600 text-sm focus:outline-none focus:border-indigo-500 transition-colors leading-relaxed resize-none"
            />
          </div>
        </div>

        {/* Navigation & Submission Controls */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-800">
          <button
            onClick={handlePrev}
            disabled={currentIndex === 0}
            className="flex items-center gap-2 px-5 py-2.5 text-xs font-semibold text-slate-300 bg-slate-800 hover:bg-slate-700 rounded-xl transition-all disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <ArrowLeft className="w-4 h-4" /> Previous
          </button>

          <div className="flex items-center gap-3">
            {currentIndex < questions.length - 1 ? (
              <button
                onClick={handleNext}
                className="flex items-center gap-2 px-6 py-3 text-xs font-semibold text-white bg-gradient-to-r from-violet-600 to-indigo-600 rounded-xl hover:from-violet-500 hover:to-indigo-500 shadow-lg shadow-indigo-500/25 transition-all"
              >
                Next Question <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={handleSubmitInterview}
                disabled={submitting}
                className="flex items-center gap-2 px-8 py-3.5 text-xs font-semibold text-white bg-gradient-to-r from-emerald-600 to-teal-600 rounded-xl hover:from-emerald-500 hover:to-teal-500 shadow-lg shadow-emerald-500/25 transition-all disabled:opacity-50"
              >
                {submitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Gemini AI Evaluating...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" /> Submit for AI Evaluation
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
