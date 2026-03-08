import { Zap, HardHat, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import SearchBar from '../components/SearchBar';
import FilterChips from '../components/FilterChips';
import JobFeed from '../components/JobFeed';

export default function HomePage() {
  return (
    <>
      {/* Hero Section */}
      <section className="bg-navy text-white py-16 md:py-24 relative overflow-hidden">
        {/* Decorative background shapes */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-20 -right-20 w-80 h-80 bg-orange/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-32 -left-20 w-96 h-96 bg-orange/5 rounded-full blur-3xl" />
        </div>

        <div className="max-w-5xl mx-auto px-4 text-center relative z-10">
          <div className="inline-flex items-center gap-1.5 bg-orange/15 text-orange text-sm font-semibold px-3 py-1 rounded-full mb-6">
            <Zap className="w-4 h-4" />
            Built for the 419
          </div>

          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight leading-tight">
            Toledo is hiring.
            <br />
            <span className="text-orange">Find your next job</span> in the 419.
          </h1>

          <p className="text-lg md:text-xl text-white/70 mt-4 max-w-2xl mx-auto">
            Warehouse, trades, healthcare, restaurants &mdash; real jobs from real
            employers across the Toledo area. No degree? No problem.
          </p>

          <div className="mt-8">
            <SearchBar />
            <FilterChips />
          </div>
        </div>
      </section>

      {/* Trades Banner */}
      <section className="bg-gradient-to-r from-[#0f1a2e] to-navy">
        <Link
          to="/trades"
          className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between no-underline group"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-orange/15 flex items-center justify-center">
              <HardHat className="w-5 h-5 text-orange" />
            </div>
            <div>
              <p className="text-white font-bold text-sm md:text-base">
                Skilled trades? We built a section just for you.
              </p>
              <p className="text-white/40 text-xs md:text-sm">
                Welding, electrical, HVAC, plumbing &mdash; pay-first listings sorted by rate.
              </p>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-orange group-hover:translate-x-1 transition-transform shrink-0" />
        </Link>
      </section>

      {/* Job Feed */}
      <JobFeed />
    </>
  );
}
