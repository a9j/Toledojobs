import { Zap } from 'lucide-react';
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

      {/* Job Feed */}
      <JobFeed />
    </>
  );
}
