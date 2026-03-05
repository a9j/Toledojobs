import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { Mail, Lock, LogIn } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTranslation } from '../../context/LanguageContext';
import Button from '../ui/Button';
import Input from '../ui/Input';

export default function LoginForm() {
  const { signIn } = useAuth();
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      await signIn(email, password);
      toast.success('Welcome back!');
      navigate('/dashboard');
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : t.common.error;
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-2 mb-2">
              <LogIn className="h-6 w-6 text-orange" />
              <h1 className="text-2xl font-heading font-bold text-navy">
                {t.auth.loginTitle}
              </h1>
            </div>
            <p className="text-gray-500 text-sm">
              Toledo Works
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
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

            <div className="flex justify-end">
              <button
                type="button"
                className="text-sm text-orange hover:text-orange-hover transition-colors"
              >
                {t.auth.forgotPassword}
              </button>
            </div>

            <Button
              type="submit"
              loading={loading}
              className="w-full"
              size="lg"
            >
              {t.auth.loginButton}
            </Button>
          </form>

          {/* Footer link */}
          <p className="text-center text-sm text-gray-500 mt-6">
            {t.auth.noAccount}{' '}
            <Link
              to="/signup"
              className="text-navy font-semibold hover:text-orange transition-colors"
            >
              {t.nav.signup}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
