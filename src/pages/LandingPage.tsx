import React from 'react';
import { Brain, Sparkles, ArrowRight, CheckCircle2, ShieldCheck, Zap, BarChart3, Code, Award, Users } from 'lucide-react';

interface LandingPageProps {
  setActivePage: (page: string) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ setActivePage }) => {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-indigo-500 selection:text-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-32 lg:pt-32 lg:pb-40">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-900/40 via-slate-950/80 to-slate-950 pointer-events-none" />
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-violet-600/10 blur-[140px] rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="max-w-3xl mx-auto text-center space-y-8">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold tracking-wide uppercase">
              <Sparkles className="w-3.5 h-3.5" /> Powered by Google Gemini AI
            </div>

            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-[1.1]">
              Practice Smarter. <br />
              <span className="bg-gradient-to-r from-violet-400 via-indigo-300 to-cyan-400 bg-clip-text text-transparent">
                Interview Better.
              </span>
            </h1>

            <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl mx-auto">
              Master technical and HR interviews with AI-powered simulations. Get rigorous role-specific questions, instant concept scoring, and actionable educational feedback.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <button 
                onClick={() => setActivePage('register')}
                className="w-full sm:w-auto flex items-center justify-center gap-3 px-8 py-4 text-base font-semibold text-white bg-gradient-to-r from-violet-600 to-indigo-600 rounded-2xl hover:from-violet-500 hover:to-indigo-500 shadow-xl shadow-indigo-500/25 transition-all transform hover:-translate-y-0.5"
              >
                Start Practicing Free <ArrowRight className="w-5 h-5" />
              </button>
              <button 
                onClick={() => setActivePage('login')}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 text-base font-semibold text-slate-300 bg-slate-900/80 border border-slate-800 rounded-2xl hover:bg-slate-800 hover:text-white transition-all"
              >
                Sign In to Account
              </button>
            </div>

            <div className="pt-8 flex items-center justify-center gap-8 text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-indigo-400" /> Java, Frontend & Python Roles
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-indigo-400" /> Instant AI Scoring & Suggestions
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-24 bg-slate-900/50 border-t border-slate-800/80 relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
            <h2 className="text-xs font-bold uppercase tracking-widest text-indigo-400">Advanced Platform Capabilities</h2>
            <h3 className="text-3xl font-bold text-white tracking-tight">Everything you need to ace your next interview</h3>
            <p className="text-sm text-slate-400">Designed to simulate real-world hiring standards with robust AI evaluation and structured analytics.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 rounded-3xl bg-slate-950/60 border border-slate-800 hover:border-indigo-500/50 transition-all group">
              <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Code className="w-6 h-6 text-indigo-400" />
              </div>
              <h4 className="text-lg font-semibold text-white mb-3">Role-Specific Questions</h4>
              <p className="text-sm text-slate-400 leading-relaxed">
                Choose from Java Developer, Frontend Developer, Python, Full Stack, Data Analyst, and Behavioral HR tracks tailored to industry standards.
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-slate-950/60 border border-slate-800 hover:border-indigo-500/50 transition-all group">
              <div className="w-12 h-12 rounded-2xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Zap className="w-6 h-6 text-violet-400" />
              </div>
              <h4 className="text-lg font-semibold text-white mb-3">AI Answer Evaluation</h4>
              <p className="text-sm text-slate-400 leading-relaxed">
                Google Gemini evaluates your technical accuracy, clarity, completeness, and missing concepts with constructive feedback and model answers.
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-slate-950/60 border border-slate-800 hover:border-indigo-500/50 transition-all group">
              <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <BarChart3 className="w-6 h-6 text-cyan-400" />
              </div>
              <h4 className="text-lg font-semibold text-white mb-3">Performance Analytics</h4>
              <p className="text-sm text-slate-400 leading-relaxed">
                Track your progress over time with comprehensive score breakdown charts, interview history logs, and strength improvement metrics.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 border-t border-slate-900">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
            <h2 className="text-xs font-bold uppercase tracking-widest text-indigo-400">Simple Workflow</h2>
            <h3 className="text-3xl font-bold text-white tracking-tight">How InterviewMate works</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="p-6 rounded-2xl bg-slate-900/30 border border-slate-800/60 relative">
              <span className="text-4xl font-extrabold text-indigo-500/20 absolute top-4 right-6">01</span>
              <h4 className="text-white font-semibold mb-2 mt-4">Select Role & Level</h4>
              <p className="text-xs text-slate-400 leading-relaxed">Choose your target job role, interview type (Technical/HR), and difficulty level.</p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900/30 border border-slate-800/60 relative">
              <span className="text-4xl font-extrabold text-indigo-500/20 absolute top-4 right-6">02</span>
              <h4 className="text-white font-semibold mb-2 mt-4">Take Timed Session</h4>
              <p className="text-xs text-slate-400 leading-relaxed">Answer questions one at a time with built-in countdown timers and progress trackers.</p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900/30 border border-slate-800/60 relative">
              <span className="text-4xl font-extrabold text-indigo-500/20 absolute top-4 right-6">03</span>
              <h4 className="text-white font-semibold mb-2 mt-4">Get AI Feedback</h4>
              <p className="text-xs text-slate-400 leading-relaxed">Gemini evaluates accuracy, highlights missing concepts, and provides sample improved answers.</p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900/30 border border-slate-800/60 relative">
              <span className="text-4xl font-extrabold text-indigo-500/20 absolute top-4 right-6">04</span>
              <h4 className="text-white font-semibold mb-2 mt-4">Track Growth</h4>
              <p className="text-xs text-slate-400 leading-relaxed">Review your past scores, identify weak areas, and level up your interview readiness.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
