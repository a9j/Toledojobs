import { Briefcase, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
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
          <a href="#" className="hover:text-orange transition-colors no-underline text-white">
            For Employers
          </a>
          <a href="#" className="hover:text-orange transition-colors no-underline text-white">
            Trades
          </a>
          <button className="bg-orange hover:bg-orange-dark text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors cursor-pointer">
            Sign In
          </button>
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
          <Link
            to="/"
            className="py-2 hover:text-orange transition-colors no-underline text-white"
            onClick={() => setMenuOpen(false)}
          >
            Find Jobs
          </Link>
          <a href="#" className="py-2 hover:text-orange transition-colors no-underline text-white">
            For Employers
          </a>
          <a href="#" className="py-2 hover:text-orange transition-colors no-underline text-white">
            Trades
          </a>
          <button className="bg-orange hover:bg-orange-dark text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors mt-1 cursor-pointer">
            Sign In
          </button>
        </nav>
      )}
    </header>
  );
}
