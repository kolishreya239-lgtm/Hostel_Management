import React, { useState } from 'react';
import { X, Shield, Lock, Mail, User as UserIcon, CheckCircle2, Sparkles, ArrowRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { UserRole } from '../../types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultRole?: UserRole;
  onSuccess: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  defaultRole = 'admin',
  onSuccess
}) => {
  const { login, demoUsers } = useAuth();
  const [isRegister, setIsRegister] = useState(false);
  const [selectedRole, setSelectedRole] = useState<UserRole>(defaultRole);
  const [email, setEmail] = useState('admin@hostelhub.com');
  const [password, setPassword] = useState('password123');
  const [name, setName] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleRoleSelect = (role: UserRole) => {
    setSelectedRole(role);
    const demo = demoUsers.find(u => u.role === role);
    if (demo) {
      setEmail(demo.email);
      setPassword('password123');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError('Please provide a valid email or username.');
      return;
    }
    const success = login(email, selectedRole);
    if (success) {
      onSuccess();
      onClose();
    } else {
      setError('Invalid credentials. Please select one of the demo presets below.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      <div className="flex min-h-full items-center justify-center p-4 text-center">
        <div
          className="w-full max-w-lg transform overflow-hidden rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 sm:p-8 text-left align-middle shadow-2xl transition-all relative z-10"
          onClick={e => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
            <div>
              <span className="inline-flex items-center text-xs font-bold text-brand-600 dark:text-brand-400 bg-brand-50 dark:bg-brand-950/60 px-2.5 py-1 rounded-full uppercase tracking-wider mb-1">
                <Sparkles className="w-3.5 h-3.5 mr-1" /> College Demo Authentication
              </span>
              <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white">
                {isRegister ? 'Student Registration' : 'Sign in to HostelHub'}
              </h3>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* 1-Click Demo Credential Selector */}
          <div className="mt-5 p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
            <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
              Select Demo Role to Instant-Login:
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {demoUsers.map(user => (
                <button
                  type="button"
                  key={user.role}
                  onClick={() => handleRoleSelect(user.role)}
                  className={`p-2 rounded-xl text-left text-xs font-medium border transition-all ${
                    selectedRole === user.role
                      ? 'border-brand-500 bg-brand-500 text-white shadow-sm'
                      : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:border-brand-300'
                  }`}
                >
                  <p className="font-bold capitalize">{user.role}</p>
                  <p className={`text-[10px] truncate ${selectedRole === user.role ? 'text-white/80' : 'text-slate-400'}`}>
                    {user.name.split(' ')[0]}
                  </p>
                </button>
              ))}
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            {error && (
              <div className="p-3 text-xs font-semibold rounded-xl bg-rose-50 text-rose-700 dark:bg-rose-950/50 dark:text-rose-300 border border-rose-200 dark:border-rose-800">
                {error}
              </div>
            )}

            {isRegister && (
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Full Name
                </label>
                <div className="relative">
                  <UserIcon className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="e.g. Rahul Sharma"
                    className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-brand-500 focus:outline-none"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Email / Username
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="name@hostelhub.com"
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-brand-500 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                  Password
                </label>
                <span className="text-xs text-brand-600 dark:text-brand-400 cursor-pointer hover:underline">
                  Forgot Password?
                </span>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-brand-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-400">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={e => setRememberMe(e.target.checked)}
                  className="rounded border-slate-300 text-brand-600 focus:ring-brand-500"
                />
                <span>Remember me on this browser</span>
              </label>
            </div>

            <button
              type="submit"
              className="w-full py-3 px-4 rounded-xl bg-brand-600 hover:bg-brand-700 active:bg-brand-800 text-white font-bold text-sm shadow-md shadow-brand-500/20 transition-all flex items-center justify-center space-x-2"
            >
              <span>{isRegister ? 'Complete Registration' : `Sign in as ${selectedRole.toUpperCase()}`}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Toggle Register / Login */}
          <div className="mt-5 text-center text-xs text-slate-500 dark:text-slate-400">
            {isRegister ? (
              <p>
                Already have an account?{' '}
                <button
                  onClick={() => setIsRegister(false)}
                  className="font-bold text-brand-600 dark:text-brand-400 hover:underline"
                >
                  Sign In
                </button>
              </p>
            ) : (
              <p>
                New student applying for residency?{' '}
                <button
                  onClick={() => setIsRegister(true)}
                  className="font-bold text-brand-600 dark:text-brand-400 hover:underline"
                >
                  Apply Online
                </button>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
