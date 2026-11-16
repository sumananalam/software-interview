import React from 'react';
import { Brain, Sparkles, Github, Twitter, Linkedin } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-950 border-t border-slate-900 py-16 text-slate-400 text-sm">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
        <div className="space-y-4 md:col-span-1">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-violet-600 to-indigo-600 p-0.5">
              <div className="w-full h-full bg-slate-950 rounded-[6px] flex items-center justify-center">
                <Brain className="w-4 h-4 text-indigo-400" />
              </div>
            </div>
            <span className="text-lg font-bold tracking-tight text-white">Interview<span className="text-indigo-400">Mate</span></span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            AI-powered mock interview platform providing role-specific technical simulations, deep answer evaluation, and actionable feedback.
          </p>
        </div>

        <div>
          <h4 className="text-white font-semibold text-xs uppercase tracking-wider mb-4">Roles & Practice</h4>
          <ul className="space-y-2.5 text-xs">
            <li><span className="hover:text-white transition-colors cursor-pointer">Java Developer</span></li>
            <li><span className="hover:text-white transition-colors cursor-pointer">Frontend Developer</span></li>
            <li><span className="hover:text-white transition-colors cursor-pointer">Python Developer</span></li>
            <li><span className="hover:text-white transition-colors cursor-pointer">Full Stack Engineer</span></li>
            <li><span className="hover:text-white transition-colors cursor-pointer">Data Analyst</span></li>
          </ul>
        </div>

        <div>
          <h4 className="text-white font-semibold text-xs uppercase tracking-wider mb-4">Platform</h4>
          <ul className="space-y-2.5 text-xs">
            <li><span className="hover:text-white transition-colors cursor-pointer">AI Evaluation Engine</span></li>
            <li><span className="hover:text-white transition-colors cursor-pointer">Timed Mock Sessions</span></li>
            <li><span className="hover:text-white transition-colors cursor-pointer">Performance Analytics</span></li>
            <li><span className="hover:text-white transition-colors cursor-pointer">Behavioral & HR Prep</span></li>
          </ul>
        </div>

        <div>
          <h4 className="text-white font-semibold text-xs uppercase tracking-wider mb-4">Secure & Reliable</h4>
          <p className="text-xs text-slate-400 leading-relaxed mb-4">
            Built with enterprise-grade encryption, JWT authentication, and secure Google Gemini API integration.
          </p>
          <div className="flex items-center gap-3 text-slate-400">
            <Github className="w-5 h-5 hover:text-white cursor-pointer transition-colors" />
            <Twitter className="w-5 h-5 hover:text-white cursor-pointer transition-colors" />
            <Linkedin className="w-5 h-5 hover:text-white cursor-pointer transition-colors" />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 pt-8 border-t border-slate-900/80 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-4">
        <p>&copy; {new Date().getFullYear()} InterviewMate Platform. All rights reserved.</p>
        <div className="flex items-center gap-6">
          <span className="hover:text-slate-300 cursor-pointer">Privacy Policy</span>
          <span className="hover:text-slate-300 cursor-pointer">Terms of Service</span>
          <span className="hover:text-slate-300 cursor-pointer">Security</span>
        </div>
      </div>
    </footer>
  );
};
