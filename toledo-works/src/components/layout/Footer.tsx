import { Link } from 'react-router-dom';

const quickLinks = [
  { to: '/about', label: 'About' },
  { to: '/pricing', label: 'Pricing' },
  { to: '/contact', label: 'Contact' },
  { to: '/privacy', label: 'Privacy' },
  { to: '/terms', label: 'Terms' },
];

export default function Footer() {
  return (
    <footer className="bg-navy text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 bg-orange rounded-md flex items-center justify-center">
                <span className="text-white font-display font-bold text-sm">TW</span>
              </div>
              <span className="font-display font-bold text-xl">Toledo Works</span>
            </div>
            <p className="text-gray-300 text-sm font-body leading-relaxed">
              Connecting Toledo&apos;s workforce with opportunity. Find jobs, discover trades, and build your career in Northwest Ohio.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-display font-semibold text-sm uppercase tracking-wider mb-4 text-gray-300">
              Quick Links
            </h3>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-sm font-body text-gray-300 hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Get Started */}
          <div>
            <h3 className="font-display font-semibold text-sm uppercase tracking-wider mb-4 text-gray-300">
              Get Started
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/jobs"
                  className="text-sm font-body text-gray-300 hover:text-white transition-colors"
                >
                  Find Jobs
                </Link>
              </li>
              <li>
                <Link
                  to="/trades"
                  className="text-sm font-body text-gray-300 hover:text-white transition-colors"
                >
                  Explore Trades
                </Link>
              </li>
              <li>
                <Link
                  to="/employers"
                  className="text-sm font-body text-gray-300 hover:text-white transition-colors"
                >
                  For Employers
                </Link>
              </li>
              <li>
                <Link
                  to="/signup"
                  className="text-sm font-body text-gray-300 hover:text-white transition-colors"
                >
                  Create Account
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-10 pt-6 border-t border-white/10 text-center space-y-2">
          <p className="text-xs font-body text-gray-400">
            Workforce development powered by{' '}
            <a
              href="https://themonakproject.org"
              target="_blank"
              rel="noopener noreferrer"
              className="text-orange hover:text-orange-hover transition-colors"
            >
              The Mona K Project
            </a>
          </p>
          <p className="text-xs font-body text-gray-500">
            &copy; {new Date().getFullYear()} Toledo Works. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
