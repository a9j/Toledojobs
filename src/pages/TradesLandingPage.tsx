import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  HardHat, Zap, Flame, Wrench, Wind, Droplets, Hammer, Truck,
  Cog, Sun, Home, Weight, Paintbrush, Blocks, Car, Shovel,
  GraduationCap, ExternalLink, Heart, ChevronRight,
} from 'lucide-react';
import { sampleJobs } from '../data/sampleJobs';

const TRADE_CATEGORIES = [
  { slug: 'Welding', label: 'Welding', icon: Flame, emoji: null },
  { slug: 'Electrical', label: 'Electrical', icon: Zap, emoji: null },
  { slug: 'HVAC', label: 'HVAC', icon: Wind, emoji: null },
  { slug: 'Plumbing', label: 'Plumbing', icon: Droplets, emoji: null },
  { slug: 'Carpentry', label: 'Carpentry', icon: Hammer, emoji: null },
  { slug: 'CDL/Driving', label: 'CDL / Driving', icon: Truck, emoji: null },
  { slug: 'CNC/Machining', label: 'CNC / Machining', icon: Cog, emoji: null },
  { slug: 'Solar/Energy', label: 'Solar / Energy', icon: Sun, emoji: null },
  { slug: 'Roofing', label: 'Roofing', icon: Home, emoji: null },
  { slug: 'Heavy Equipment', label: 'Heavy Equipment', icon: Weight, emoji: null },
  { slug: 'Painting', label: 'Painting', icon: Paintbrush, emoji: null },
  { slug: 'Concrete/Masonry', label: 'Concrete / Masonry', icon: Blocks, emoji: null },
  { slug: 'Auto/Diesel Mechanic', label: 'Auto / Diesel', icon: Car, emoji: null },
  { slug: 'General Labor', label: 'General Labor', icon: Shovel, emoji: null },
];

const APPRENTICESHIP_PROGRAMS = [
  {
    name: 'The Mona K Project',
    subtitle: 'Green Trades Workforce Academy',
    description: 'Training in solar installation, weatherization, and energy retrofits. Building a greener Toledo through skilled trades workforce development.',
    highlight: true,
  },
  {
    name: 'IBEW Local 8',
    subtitle: 'Electrical Apprenticeship',
    description: 'Five-year electrical apprenticeship program combining classroom instruction with paid on-the-job training. Full union benefits from day one.',
    highlight: false,
  },
  {
    name: 'UA Local 50',
    subtitle: 'Plumbing & Pipefitting',
    description: 'Apprenticeship in plumbing, pipefitting, and HVAC service. Earn while you learn with excellent wages and benefits.',
    highlight: false,
  },
  {
    name: 'Ironworkers Local 55',
    subtitle: 'Ironworker Apprenticeship',
    description: 'Three-year apprenticeship program for structural and reinforcing ironwork. Includes welding certification training.',
    highlight: false,
  },
  {
    name: 'Carpenters Local 351',
    subtitle: 'Carpentry Apprenticeship',
    description: 'Four-year carpentry apprenticeship covering residential, commercial, and industrial construction techniques.',
    highlight: false,
  },
  {
    name: 'Owens Community College',
    subtitle: 'Skilled Trades Programs',
    description: 'Certificate and associate degree programs in welding, HVAC, electrical, and industrial maintenance. Financial aid available.',
    highlight: false,
  },
  {
    name: 'OhioMeansJobs Lucas County',
    subtitle: 'WIOA-Funded Training',
    description: 'Free workforce training in high-demand trades through WIOA funding. Career coaching, job placement assistance, and support services included.',
    highlight: false,
  },
];

export default function TradesLandingPage() {
  const jobCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const cat of TRADE_CATEGORIES) {
      counts[cat.slug] = sampleJobs.filter(
        (j) => j.trade_category === cat.slug || j.trade_category === cat.slug.split('/')[0]
      ).length;
    }
    // Also count Machining → CNC/Machining, etc.
    for (const j of sampleJobs) {
      if (!j.trade_category) continue;
      const match = TRADE_CATEGORIES.find(
        (c) => c.slug === j.trade_category || c.slug.includes(j.trade_category!)
      );
      if (match && !counts[match.slug]) counts[match.slug] = 1;
      else if (match) {
        // recount to be safe
      }
    }
    // Accurate recount
    for (const cat of TRADE_CATEGORIES) {
      counts[cat.slug] = sampleJobs.filter((j) => {
        if (!j.trade_category) return false;
        return j.trade_category === cat.slug
          || cat.slug.includes(j.trade_category)
          || j.trade_category.includes(cat.slug.split('/')[0]);
      }).length;
    }
    return counts;
  }, []);

  const totalTradesJobs = useMemo(
    () => sampleJobs.filter((j) => j.trade_category).length,
    []
  );

  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-[#0f1a2e] via-navy to-[#1a2d4d] text-white py-16 md:py-24 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-orange/5 rounded-full blur-[120px]" />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-orange/3 rounded-full blur-[80px]" />
          {/* Industrial texture overlay */}
          <div className="absolute inset-0 opacity-[0.03]" style={{
            backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.1) 2px, rgba(255,255,255,0.1) 4px)',
          }} />
        </div>

        <div className="max-w-5xl mx-auto px-4 text-center relative z-10">
          <div className="inline-flex items-center gap-2 bg-orange/15 text-orange text-sm font-bold px-4 py-1.5 rounded-full mb-6 uppercase tracking-wider">
            <HardHat className="w-4 h-4" />
            Skilled Trades
          </div>

          <h1 className="text-4xl md:text-6xl font-black tracking-tight leading-[1.1]">
            Toledo was built by trades.
            <br />
            <span className="text-orange">Find your next gig.</span>
          </h1>

          <p className="text-lg md:text-xl text-white/60 mt-5 max-w-2xl mx-auto font-medium">
            {totalTradesJobs} active trades jobs in the 419. Welding, electrical, HVAC, plumbing &mdash;
            real work from real contractors. Pay-first, no-BS listings.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 mt-8">
            <Link
              to="/trades/bench"
              className="bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-white/20 px-5 py-3 rounded-lg font-semibold transition-colors no-underline text-sm"
            >
              Contractor Bench (Coming Soon)
            </Link>
            <Link
              to="/profile"
              className="bg-orange hover:bg-orange-dark text-white px-6 py-3 rounded-lg font-bold transition-colors no-underline text-sm"
            >
              Build Your Skills Card
            </Link>
          </div>
        </div>
      </section>

      {/* Trade Category Grid */}
      <section className="max-w-6xl mx-auto px-4 py-12 md:py-16">
        <h2 className="text-2xl md:text-3xl font-black text-navy mb-2">Browse by Trade</h2>
        <p className="text-gray-500 mb-8">Tap a trade to see all open positions, sorted by pay.</p>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-4">
          {TRADE_CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            const count = jobCounts[cat.slug] || 0;
            return (
              <Link
                key={cat.slug}
                to={`/trades/${encodeURIComponent(cat.slug)}`}
                className="group bg-[#0f1a2e] hover:bg-navy text-white rounded-xl p-4 md:p-5 transition-all hover:shadow-lg hover:shadow-orange/10 hover:-translate-y-0.5 no-underline flex flex-col items-center text-center relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-t from-orange/0 to-orange/0 group-hover:from-orange/10 transition-all" />
                <div className="relative z-10">
                  <div className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-white/10 group-hover:bg-orange/20 flex items-center justify-center mb-3 transition-colors">
                    <Icon className="w-6 h-6 md:w-7 md:h-7 text-orange" />
                  </div>
                  <p className="font-bold text-sm md:text-base leading-tight">{cat.label}</p>
                  <p className="text-xs text-white/40 mt-1">
                    {count} {count === 1 ? 'job' : 'jobs'}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Apprenticeships & Training */}
      <section className="bg-gray-50 py-12 md:py-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-center gap-3 mb-2">
            <GraduationCap className="w-7 h-7 text-orange" />
            <h2 className="text-2xl md:text-3xl font-black text-navy">Apprenticeships & Training</h2>
          </div>
          <p className="text-gray-500 mb-8">
            Local programs to start or advance your trades career. Most are earn-while-you-learn.
          </p>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {APPRENTICESHIP_PROGRAMS.map((prog) => (
              <div
                key={prog.name}
                className={`rounded-xl p-5 transition-all ${
                  prog.highlight
                    ? 'bg-gradient-to-br from-orange/10 to-orange/5 border-2 border-orange/30'
                    : 'bg-white border border-gray-200 hover:border-navy/20 hover:shadow-sm'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className={`font-bold text-lg ${prog.highlight ? 'text-orange' : 'text-navy'}`}>
                      {prog.name}
                    </h3>
                    <p className="text-sm font-semibold text-gray-500 mt-0.5">{prog.subtitle}</p>
                  </div>
                  <ExternalLink className={`w-4 h-4 shrink-0 mt-1 ${prog.highlight ? 'text-orange' : 'text-gray-400'}`} />
                </div>
                <p className="text-sm text-gray-600 mt-3 leading-relaxed">{prog.description}</p>
                {prog.highlight && (
                  <p className="text-xs font-bold text-orange mt-3 flex items-center gap-1">
                    <Heart className="w-3 h-3 fill-orange" /> Mission Partner
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trades CTA Banner */}
      <section className="bg-gradient-to-r from-[#0f1a2e] to-navy py-12">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-black text-white mb-3">
            Got skills? Show them off.
          </h2>
          <p className="text-white/60 mb-6 max-w-xl mx-auto">
            Build your digital Skills Card — a trade credential that shows employers exactly what you bring.
            Certifications, experience, tools, availability — all in one view.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link
              to="/profile"
              className="bg-orange hover:bg-orange-dark text-white px-6 py-3 rounded-lg font-bold transition-colors no-underline inline-flex items-center gap-2"
            >
              <HardHat className="w-5 h-5" /> Build Your Skills Card
            </Link>
            <Link
              to="/jobs"
              className="bg-white/10 border border-white/20 text-white hover:bg-white/20 px-6 py-3 rounded-lg font-semibold transition-colors no-underline inline-flex items-center gap-2"
            >
              Browse All Jobs <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Trades Footer */}
      <footer className="bg-[#0a1221] text-white/70 py-10">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <p className="text-base md:text-lg flex items-center justify-center gap-2 flex-wrap">
            Workforce development powered by{' '}
            <span className="text-orange font-bold text-lg md:text-xl">The Mona K Project</span>
            <Heart className="w-5 h-5 text-orange fill-orange" />
          </p>
          <p className="text-sm text-white/30 mt-3">
            Building a stronger Toledo through trades workforce development.
          </p>
          <p className="text-xs mt-4 text-white/20">
            &copy; {new Date().getFullYear()} Toledo Works. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
