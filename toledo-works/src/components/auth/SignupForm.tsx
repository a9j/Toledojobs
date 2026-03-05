import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { UserPlus, Mail, Lock, Briefcase, Search } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTranslation } from '../../context/LanguageContext';
import Button from '../ui/Button';
import Input from '../ui/Input';

type Role = 'job_seeker' | 'employer';

export default function SignupForm() {
  const { signUp } = useAuth();
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState<Role>('job_seeker');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error('Passwords do not match.');
      return;
    }

    if (password.length < 6) {
      toast.error('Password must be at least 6 characters.');
      return;
    }

    setLoading(true);

    try {
      await signUp(email, password, role);
      toast.success('Account created! Check your email to confirm.');
      navigate('/login');
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : t.common.error;
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-2 mb-2">
              <UserPlus className="h-6 w-6 text-orange" />
              <h1 className="text-2xl font-heading font-bold text-navy">
                {t.auth.signupTitle}
              </h1>
            </div>
            <p className="text-gray-500 text-sm">
              Toledo Works
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Role selection */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                {t.auth.selectRole}
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setRole('job_seeker')}
                  className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all duration-200 ${
                    role === 'job_seeker'
                      ? 'border-orange bg-orange/5 text-navy shadow-sm'
                      : 'border-gray-200 text-gray-500 hover:border-gray-300'
                  }`}
                >
                  <Search
                    className={`h-6 w-6 ${
                      role === 'job_seeker' ? 'text-orange' : 'text-gray-400'
                    }`}
                  />
                  <span className="text-sm font-semibold">{t.auth.jobSeeker}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setRole('employer')}
                  className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all duration-200 ${
                    role === 'employer'
                      ? 'border-orange bg-orange/5 text-navy shadow-sm'
                      : 'border-gray-200 text-gray-500 hover:border-gray-300'
                  }`}
                >
                  <Briefcase
                    className={`h-6 w-6 ${
                      role === 'employer' ? 'text-orange' : 'text-gray-400'
                    }`}
                  />
                  <span className="text-sm font-semibold">{t.auth.employerRole}</span>
                </button>
              </div>
            </div>

            {/* Email */}
            <div className="relative">
              <Mail className="absolute left-3 top-[38px] h-4 w-4 text-gray-400 pointer-events-none" />
              <Input
                label={t.auth.email}
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                className="pl-10"
              />
            </div>

            {/* Password */}
            <div className="relative">
              <Lock className="absolute left-3 top-[38px] h-4 w-4 text-gray-400 pointer-events-none" />
              <Input
                label={t.auth.password}
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="pl-10"
              />
            </div>

            {/* Confirm password */}
            <div className="relative">
              <Lock className="absolute left-3 top-[38px] h-4 w-4 text-gray-400 pointer-events-none" />
              <Input
                label={t.auth.confirmPassword}
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                required
                error={
                  confirmPassword && password !== confirmPassword
                    ? 'Passwords do not match'
                    : undefined
                }
                className="pl-10"
              />
            </div>

            <Button
              type="submit"
              loading={loading}
              className="w-full"
              size="lg"
            >
              {t.auth.signupButton}
            </Button>
          </form>

          {/* Footer link */}
          <p className="text-center text-sm text-gray-500 mt-6">
            {t.auth.hasAccount}{' '}
            <Link
              to="/login"
              className="text-navy font-semibold hover:text-orange transition-colors"
            >
              {t.nav.login}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
