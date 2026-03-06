import { Briefcase, Menu, X, User, LogOut, Building2 } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../lib/auth';
import AuthModal from './AuthModal';

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [authTab, setAuthTab] = useState<'signin' | 'signup'>('signin');
  const { user, profile, signOut } = useAuth();

  function openAuth(tab: 'signin' | 'signup') {
    setAuthTab(tab);
    setAuthOpen(true);
    setMenuOpen(false);
  }

  return (
    <>
      <header className="bg-navy text-white sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 no-underline text-white">
            <Briefcase className="w-7 h-7 text-orange" />
            <span className="text-xl font-bold tracking-tight">Toledo Works</span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
            <Link to="/" className="hover:text-orange transition-colors no-underline text-white">
              Find Jobs
            </Link>
            {user && profile?.role === 'employer' ? (
              <Link to="/employer" className="hover:text-orange transition-colors no-underline text-white flex items-center gap-1">
                <Building2 className="w-4 h-4" /> Employer Dashboard
              </Link>
            ) : (
              <Link to="/employer" className="hover:text-orange transition-colors no-underline text-white">
                For Employers
              </Link>
            )}
            <Link to="/?filter=trades" className="hover:text-orange transition-colors no-underline text-white">
              Trades
            </Link>

            {user ? (
              <div className="flex items-center gap-3">
                <Link to="/dashboard" className="hover:text-orange transition-colors no-underline text-white flex items-center gap-1">
                  <User className="w-4 h-4" />
                  {profile?.full_name || 'Dashboard'}
                </Link>
                <button
                  onClick={() => signOut()}
                  className="text-white/60 hover:text-white transition-colors cursor-pointer bg-transparent border-none"
                  title="Sign out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => openAuth('signin')}
                className="bg-orange hover:bg-orange-dark text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors cursor-pointer border-none"
              >
                Sign In
              </button>
            )}
          </nav>

          {/* Mobile menu toggle */}
          <button
            className="md:hidden text-white cursor-pointer bg-transparent border-none"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile nav */}
        {menuOpen && (
          <nav className="md:hidden border-t border-white/10 px-4 pb-4 flex flex-col gap-3 text-sm">
            <Link to="/" className="py-2 hover:text-orange transition-colors no-underline text-white" onClick={() => setMenuOpen(false)}>
              Find Jobs
            </Link>
            <Link to="/employer" className="py-2 hover:text-orange transition-colors no-underline text-white" onClick={() => setMenuOpen(false)}>
              For Employers
            </Link>
            <Link to="/?filter=trades" className="py-2 hover:text-orange transition-colors no-underline text-white" onClick={() => setMenuOpen(false)}>
              Trades
            </Link>

            {user ? (
              <>
                <Link to="/dashboard" className="py-2 hover:text-orange transition-colors no-underline text-white flex items-center gap-1" onClick={() => setMenuOpen(false)}>
                  <User className="w-4 h-4" /> Dashboard
                </Link>
                <button
                  onClick={() => { signOut(); setMenuOpen(false); }}
                  className="py-2 text-left text-white/60 hover:text-white transition-colors cursor-pointer bg-transparent border-none flex items-center gap-1"
                >
                  <LogOut className="w-4 h-4" /> Sign Out
                </button>
              </>
            ) : (
              <button
                onClick={() => openAuth('signin')}
                className="bg-orange hover:bg-orange-dark text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors mt-1 cursor-pointer border-none"
              >
                Sign In
              </button>
            )}
          </nav>
        )}
      </header>

      <AuthModal open={authOpen} onClose={() => setAuthOpen(false)} defaultTab={authTab} />
    </>
  );
}
