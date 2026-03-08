import { Briefcase, Menu, X, User, LogOut, Building2, Search, Plus } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../lib/auth';

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, profile, signOut } = useAuth();

  const isEmployer = user && profile?.role === 'employer';
  const isSeeker = user && profile?.role === 'job_seeker';

  return (
    <header className="bg-navy text-white sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 no-underline text-white">
          <Briefcase className="w-7 h-7 text-orange" />
          <span className="text-xl font-bold tracking-tight">Toledo Works</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
          <Link to="/jobs" className="hover:text-orange transition-colors no-underline text-white flex items-center gap-1">
            <Search className="w-4 h-4" /> Find Jobs
          </Link>

          {isEmployer ? (
            <>
              <Link to="/dashboard" className="hover:text-orange transition-colors no-underline text-white flex items-center gap-1">
                <Building2 className="w-4 h-4" /> Dashboard
              </Link>
              <Link
                to="/dashboard/post"
                className="bg-orange hover:bg-orange-dark text-white px-3 py-1.5 rounded-lg text-sm font-semibold transition-colors no-underline inline-flex items-center gap-1"
              >
                <Plus className="w-4 h-4" /> Post a Job
              </Link>
            </>
          ) : isSeeker ? (
            <Link to="/my-jobs" className="hover:text-orange transition-colors no-underline text-white">
              My Jobs
            </Link>
          ) : (
            <Link to="/employers" className="hover:text-orange transition-colors no-underline text-white">
              For Employers
            </Link>
          )}

          <Link to="/jobs?category=trades" className="hover:text-orange transition-colors no-underline text-white">
            Trades
          </Link>

          {user ? (
            <div className="flex items-center gap-3">
              <Link to={isEmployer ? '/dashboard' : '/profile'} className="hover:text-orange transition-colors no-underline text-white flex items-center gap-1">
                <User className="w-4 h-4" />
                {profile?.full_name || 'Profile'}
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
            <div className="flex items-center gap-2">
              <Link
                to="/login"
                className="text-white hover:text-orange transition-colors no-underline text-sm font-medium"
              >
                Log In
              </Link>
              <Link
                to="/signup"
                className="bg-orange hover:bg-orange-dark text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors no-underline"
              >
                Sign Up
              </Link>
            </div>
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
          <Link to="/jobs" className="py-2 hover:text-orange transition-colors no-underline text-white flex items-center gap-2" onClick={() => setMenuOpen(false)}>
            <Search className="w-4 h-4" /> Find Jobs
          </Link>

          {isEmployer ? (
            <>
              <Link to="/dashboard" className="py-2 hover:text-orange transition-colors no-underline text-white flex items-center gap-2" onClick={() => setMenuOpen(false)}>
                <Building2 className="w-4 h-4" /> Dashboard
              </Link>
              <Link to="/dashboard/post" className="py-2 text-orange font-semibold no-underline flex items-center gap-2" onClick={() => setMenuOpen(false)}>
                <Plus className="w-4 h-4" /> Post a Job
              </Link>
            </>
          ) : isSeeker ? (
            <Link to="/my-jobs" className="py-2 hover:text-orange transition-colors no-underline text-white" onClick={() => setMenuOpen(false)}>
              My Jobs
            </Link>
          ) : (
            <Link to="/employers" className="py-2 hover:text-orange transition-colors no-underline text-white" onClick={() => setMenuOpen(false)}>
              For Employers
            </Link>
          )}

          <Link to="/jobs?category=trades" className="py-2 hover:text-orange transition-colors no-underline text-white" onClick={() => setMenuOpen(false)}>
            Trades
          </Link>

          {user ? (
            <>
              <Link to={isEmployer ? '/dashboard' : '/profile'} className="py-2 hover:text-orange transition-colors no-underline text-white flex items-center gap-1" onClick={() => setMenuOpen(false)}>
                <User className="w-4 h-4" /> {isEmployer ? 'My Account' : 'My Profile'}
              </Link>
              <button
                onClick={() => { signOut(); setMenuOpen(false); }}
                className="py-2 text-left text-white/60 hover:text-white transition-colors cursor-pointer bg-transparent border-none flex items-center gap-1"
              >
                <LogOut className="w-4 h-4" /> Sign Out
              </button>
            </>
          ) : (
            <div className="flex gap-2 mt-1">
              <Link
                to="/login"
                className="flex-1 text-center py-2 border border-white/30 rounded-lg text-white no-underline hover:bg-white/10 transition-colors"
                onClick={() => setMenuOpen(false)}
              >
                Log In
              </Link>
              <Link
                to="/signup"
                className="flex-1 text-center bg-orange hover:bg-orange-dark text-white py-2 rounded-lg font-semibold transition-colors no-underline"
                onClick={() => setMenuOpen(false)}
              >
                Sign Up
              </Link>
            </div>
          )}
        </nav>
      )}
    </header>
  );
}
