import { useState } from 'react';
import { X } from 'lucide-react';
import { useAuth } from '../lib/auth';
import toast from 'react-hot-toast';

interface AuthModalProps {
  open: boolean;
  onClose: () => void;
  defaultTab?: 'signin' | 'signup';
}

export default function AuthModal({ open, onClose, defaultTab = 'signin' }: AuthModalProps) {
  const { signIn, signUp } = useAuth();
  const [tab, setTab] = useState<'signin' | 'signup'>(defaultTab);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [role, setRole] = useState<'job_seeker' | 'employer'>('job_seeker');
  const [submitting, setSubmitting] = useState(false);

  if (!open) return null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);

    if (tab === 'signin') {
      const { error } = await signIn(email, password);
      if (error) {
        toast.error(error);
      } else {
        toast.success('Welcome back!');
        onClose();
      }
    } else {
      const { error } = await signUp(email, password, role, fullName);
      if (error) {
        toast.error(error);
      } else {
        toast.success('Account created! Check your email to confirm.');
        onClose();
      }
    }

    setSubmitting(false);
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-navy bg-transparent border-none cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <h2 className="text-2xl font-bold text-navy mb-1">
          {tab === 'signin' ? 'Sign In' : 'Create Account'}
        </h2>
        <p className="text-sm text-gray-500 mb-6">
          {tab === 'signin' ? 'Welcome back to Toledo Works' : 'Join the 419 workforce'}
        </p>

        <div className="flex gap-1 bg-gray-100 rounded-lg p-1 mb-6">
          <button
            onClick={() => setTab('signin')}
            className={`flex-1 py-2 text-sm font-medium rounded-md transition-colors cursor-pointer border-none ${
              tab === 'signin' ? 'bg-white text-navy shadow-sm' : 'text-gray-500 bg-transparent'
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => setTab('signup')}
            className={`flex-1 py-2 text-sm font-medium rounded-md transition-colors cursor-pointer border-none ${
              tab === 'signup' ? 'bg-white text-navy shadow-sm' : 'text-gray-500 bg-transparent'
            }`}
          >
            Sign Up
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {tab === 'signup' && (
            <>
              <div>
                <label className="block text-sm font-medium text-navy mb-1">Full Name</label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-navy outline-none focus:border-orange transition-colors"
                  placeholder="John Smith"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-navy mb-1">I am a...</label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setRole('job_seeker')}
                    className={`flex-1 py-2 text-sm font-medium rounded-lg border cursor-pointer transition-colors ${
                      role === 'job_seeker'
                        ? 'bg-orange text-white border-orange'
                        : 'bg-white text-navy border-gray-300 hover:border-orange'
                    }`}
                  >
                    Job Seeker
                  </button>
                  <button
                    type="button"
                    onClick={() => setRole('employer')}
                    className={`flex-1 py-2 text-sm font-medium rounded-lg border cursor-pointer transition-colors ${
                      role === 'employer'
                        ? 'bg-orange text-white border-orange'
                        : 'bg-white text-navy border-gray-300 hover:border-orange'
                    }`}
                  >
                    Employer
                  </button>
                </div>
              </div>
            </>
          )}

          <div>
            <label className="block text-sm font-medium text-navy mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-navy outline-none focus:border-orange transition-colors"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-navy mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-navy outline-none focus:border-orange transition-colors"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="bg-orange hover:bg-orange-dark text-white py-3 rounded-lg font-semibold transition-colors cursor-pointer border-none disabled:opacity-50"
          >
            {submitting ? 'Please wait...' : tab === 'signin' ? 'Sign In' : 'Create Account'}
          </button>
        </form>
      </div>
    </div>
  );
}
