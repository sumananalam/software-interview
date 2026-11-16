import React, { useState } from 'react';
import { User, Mail, Briefcase, Award, CheckCircle2, Save, AlertCircle, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const ProfilePage: React.FC = () => {
  const { user, token, updateUser } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [preferredRole, setPreferredRole] = useState(user?.preferred_job_role || 'Java Developer');
  const [successMessage, setSuccessMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccessMessage('');

    try {
      const res = await fetch('/api/auth/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ name, preferred_job_role: preferredRole })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to update profile');
      }

      updateUser(data.user);
      setSuccessMessage('Profile updated successfully!');
    } catch (err: any) {
      setError(err.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] bg-slate-950 text-slate-100 p-6 lg:p-12 flex items-center justify-center">
      <div className="max-w-xl w-full p-8 sm:p-10 rounded-3xl bg-slate-900/60 border border-slate-800 backdrop-blur-xl shadow-2xl space-y-8">
        <div className="text-center space-y-3">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-violet-600 to-indigo-600 p-0.5 mx-auto shadow-lg shadow-indigo-500/25">
            <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
              <User className="w-8 h-8 text-indigo-400" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Student Profile</h2>
          <p className="text-xs text-slate-400">Manage your account settings and preferred interview track</p>
        </div>

        {successMessage && (
          <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center gap-3 text-emerald-400 text-xs">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}

        {error && (
          <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center gap-3 text-red-400 text-xs">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleUpdate} className="space-y-6">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300 flex items-center gap-2">
              <User className="w-4 h-4 text-indigo-400" /> Full Name
            </label>
            <input 
              type="text" 
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white text-sm focus:outline-none focus:border-indigo-500 transition-colors"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300 flex items-center gap-2">
              <Mail className="w-4 h-4 text-indigo-400" /> Email Address
            </label>
            <input 
              type="email" 
              disabled
              value={user?.email || ''}
              className="w-full px-4 py-3 bg-slate-950/50 border border-slate-800/80 rounded-xl text-slate-500 text-sm cursor-not-allowed"
            />
            <p className="text-[10px] text-slate-500">Email address cannot be changed.</p>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300 flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-indigo-400" /> Preferred Job Role
            </label>
            <select 
              value={preferredRole}
              onChange={(e) => setPreferredRole(e.target.value)}
              className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white text-sm focus:outline-none focus:border-indigo-500 transition-colors"
            >
              <option value="Java Developer">Java Developer</option>
              <option value="Frontend Developer">Frontend Developer</option>
              <option value="Python Developer">Python Developer</option>
              <option value="Full Stack Developer">Full Stack Developer</option>
              <option value="Data Analyst">Data Analyst</option>
              <option value="HR & Behavioral">HR & Behavioral</option>
            </select>
          </div>

          <button 
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 py-3.5 text-sm font-semibold text-white bg-gradient-to-r from-violet-600 to-indigo-600 rounded-xl hover:from-violet-500 hover:to-indigo-500 shadow-lg shadow-indigo-500/25 transition-all disabled:opacity-50"
          >
            {loading ? 'Saving Changes...' : <><Save className="w-4 h-4" /> Save Profile Changes</>}
          </button>
        </form>
      </div>
    </div>
  );
};
