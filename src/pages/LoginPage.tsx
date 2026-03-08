import { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { Briefcase, Loader2 } from 'lucide-react';
import { useAuth } from '../lib/auth';
import toast from 'react-hot-toast';

export default function LoginPage() {
  const { user, signIn, loading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (loading) return <div className="flex justify-center py-24"><Loader2 className="w-8 h-8 text-orange animate-spin" /></div>;
  if (user) return <Navigate to="/profile" replace />;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    const { error } = await signIn(email, password);
    if (error) {
      toast.error(error);
    } else {
      toast.success('Welcome back!');
    }
    setSubmitting(false);
  }

  return (
    <div className="min-h-[calc(100vh-140px)] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-4">
            <Briefcase className="w-8 h-8 text-orange" />
            <span className="text-2xl font-bold text-navy">Toledo Works</span>
          </div>
          <h1 className="text-3xl font-extrabold text-navy">Welcome back</h1>
          <p className="text-gray-500 mt-2">Sign in to your account</p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 shadow-lg p-6">
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="block text-sm font-medium text-navy mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-navy outline-none focus:border-orange transition-colors"
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
                className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-navy outline-none focus:border-orange transition-colors"
                placeholder="Your password"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="bg-orange hover:bg-orange-dark text-white py-3 rounded-lg font-semibold transition-colors cursor-pointer border-none disabled:opacity-50 text-base"
            >
              {submitting ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500">
              Don't have an account?{' '}
              <Link to="/signup" className="text-orange hover:text-orange-dark font-semibold no-underline">
                Sign Up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
