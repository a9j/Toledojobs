import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, LogOut, Plus } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import LanguageToggle from '../../components/ui/LanguageToggle';

const navLinks = [
  { to: '/jobs', label: 'Find Jobs' },
  { to: '/trades', label: 'Trades' },
  { to: '/employers', label: 'For Employers' },
  { to: '/pricing', label: 'Pricing' },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, profile, signOut, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  const handleSignOut = async () => {
    await signOut();
    setMenuOpen(false);
    navigate('/');
  };

  const isEmployer = profile?.role === 'employer';

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo / Brand */}
          <Link to="/" className="flex items-center gap-2 shrink-0">
            <div className="w-8 h-8 bg-orange rounded-md flex items-center justify-center">
              <span className="text-white font-display font-bold text-sm">TW</span>
            </div>
            <span className="font-display font-bold text-xl text-navy">
              Toledo Works
            </span>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`px-3 py-2 rounded-md text-sm font-medium font-body transition-colors ${
                  isActive(link.to)
                    ? 'text-orange bg-orange/5'
                    : 'text-gray-700 hover:text-navy hover:bg-gray-50'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Desktop Right Section */}
          <div className="hidden md:flex items-center gap-2">
            <LanguageToggle />

            {loading ? (
              <div className="w-20 h-9 bg-gray-100 rounded-md animate-pulse" />
            ) : user ? (
              <>
                {isEmployer && (
                  <Link
                    to="/jobs/new"
                    className="flex items-center gap-1.5 px-4 py-2 bg-orange text-white text-sm font-medium font-body rounded-md hover:bg-orange-hover transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    Post a Job
                  </Link>
                )}
                <Link
                  to="/dashboard"
                  className={`px-3 py-2 rounded-md text-sm font-medium font-body transition-colors ${
                    isActive('/dashboard')
                      ? 'text-orange bg-orange/5'
                      : 'text-gray-700 hover:text-navy hover:bg-gray-50'
                  }`}
                >
                  Dashboard
                </Link>
                <Link
                  to="/profile"
                  className={`px-3 py-2 rounded-md text-sm font-medium font-body transition-colors ${
                    isActive('/profile')
                      ? 'text-orange bg-orange/5'
                      : 'text-gray-700 hover:text-navy hover:bg-gray-50'
                  }`}
                >
                  Profile
                </Link>
                <button
                  onClick={handleSignOut}
                  className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium font-body text-gray-500 hover:text-red rounded-md hover:bg-gray-50 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  Log Out
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-medium font-body text-navy hover:bg-gray-50 rounded-md transition-colors"
                >
                  Log In
                </Link>
                <Link
                  to="/signup"
                  className="px-4 py-2 bg-navy text-white text-sm font-medium font-body rounded-md hover:bg-navy-light transition-colors"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>

          {/* Mobile Hamburger */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden p-2 rounded-md text-gray-700 hover:bg-gray-100 transition-colors"
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          >
            {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Slide-Down Menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white">
          <div className="px-4 py-3 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setMenuOpen(false)}
                className={`block px-3 py-2.5 rounded-md text-base font-medium font-body transition-colors ${
                  isActive(link.to)
                    ? 'text-orange bg-orange/5'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                {link.label}
              </Link>
            ))}

            <div className="border-t border-gray-100 pt-3 mt-3">
              {loading ? (
                <div className="w-full h-10 bg-gray-100 rounded-md animate-pulse" />
              ) : user ? (
                <>
                  {isEmployer && (
                    <Link
                      to="/jobs/new"
                      onClick={() => setMenuOpen(false)}
                      className="flex items-center gap-2 px-3 py-2.5 mb-1 bg-orange text-white rounded-md text-base font-medium font-body"
                    >
                      <Plus className="w-4 h-4" />
                      Post a Job
                    </Link>
                  )}
                  <Link
                    to="/dashboard"
                    onClick={() => setMenuOpen(false)}
                    className={`block px-3 py-2.5 rounded-md text-base font-medium font-body ${
                      isActive('/dashboard') ? 'text-orange bg-orange/5' : 'text-gray-700'
                    }`}
                  >
                    Dashboard
                  </Link>
                  <Link
                    to="/profile"
                    onClick={() => setMenuOpen(false)}
                    className={`block px-3 py-2.5 rounded-md text-base font-medium font-body ${
                      isActive('/profile') ? 'text-orange bg-orange/5' : 'text-gray-700'
                    }`}
                  >
                    Profile
                  </Link>
                  <button
                    onClick={handleSignOut}
                    className="flex items-center gap-2 w-full px-3 py-2.5 text-base font-medium font-body text-gray-500 hover:text-red rounded-md"
                  >
                    <LogOut className="w-4 h-4" />
                    Log Out
                  </button>
                </>
              ) : (
                <div className="flex flex-col gap-2">
                  <Link
                    to="/login"
                    onClick={() => setMenuOpen(false)}
                    className="block text-center px-4 py-2.5 text-base font-medium font-body text-navy border border-navy rounded-md"
                  >
                    Log In
                  </Link>
                  <Link
                    to="/signup"
                    onClick={() => setMenuOpen(false)}
                    className="block text-center px-4 py-2.5 bg-navy text-white text-base font-medium font-body rounded-md"
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>

            <div className="border-t border-gray-100 pt-3 mt-3 flex justify-center">
              <LanguageToggle />
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
