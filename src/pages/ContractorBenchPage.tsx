import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowLeft, Search, SlidersHorizontal, Mail, Heart, CheckCircle,
} from 'lucide-react';
import SkillsCardDisplay from '../components/SkillsCardDisplay';
import type { SkillsCardData } from '../components/SkillsCardDisplay';
import { joinBenchWaitlist } from '../lib/queries';
import toast from 'react-hot-toast';

const MOCK_WORKERS: SkillsCardData[] = [
  {
    name: 'Marcus J.',
    primaryTrade: 'Electrical',
    experienceLevel: 'journeyman',
    yearsInTrade: 8,
    certifications: ['Journeyman Electrician', 'OSHA 30', 'First Aid/CPR'],
    ownTools: true,
    ownPPE: true,
    reliableTransport: true,
    unionStatus: 'union_member',
    availableNow: true,
    willingToTravel: false,
  },
  {
    name: 'Sarah K.',
    primaryTrade: 'HVAC',
    experienceLevel: 'journeyman',
    yearsInTrade: 5,
    certifications: ['EPA 608', 'OSHA 10', 'HVAC Certified'],
    ownTools: true,
    ownPPE: true,
    reliableTransport: true,
    unionStatus: 'willing_to_join',
    availableNow: true,
    willingToTravel: true,
  },
  {
    name: 'Carlos R.',
    primaryTrade: 'Welding',
    experienceLevel: 'master',
    yearsInTrade: 15,
    certifications: ['AWS D1.1', 'MIG Welding', 'TIG Welding', 'OSHA 30'],
    ownTools: true,
    ownPPE: true,
    reliableTransport: true,
    unionStatus: 'union_member',
    availableNow: false,
    willingToTravel: true,
  },
  {
    name: 'Devon W.',
    primaryTrade: 'Plumbing',
    experienceLevel: 'apprentice',
    yearsInTrade: 2,
    certifications: ['OSHA 10', 'First Aid/CPR'],
    ownTools: false,
    ownPPE: true,
    reliableTransport: true,
    unionStatus: 'willing_to_join',
    availableNow: true,
    willingToTravel: false,
  },
  {
    name: 'James T.',
    primaryTrade: 'Carpentry',
    experienceLevel: 'journeyman',
    yearsInTrade: 10,
    certifications: ['OSHA 30', 'Fall Protection', 'Scaffolding'],
    ownTools: true,
    ownPPE: true,
    reliableTransport: true,
    unionStatus: 'union_member',
    availableNow: true,
    willingToTravel: true,
  },
  {
    name: 'Keisha M.',
    primaryTrade: 'Solar/Energy',
    experienceLevel: 'journeyman',
    yearsInTrade: 4,
    certifications: ['OSHA 10', 'NABCEP PV Associate', 'First Aid/CPR'],
    ownTools: true,
    ownPPE: true,
    reliableTransport: true,
    unionStatus: 'willing_to_join',
    availableNow: true,
    willingToTravel: true,
  },
];

export default function ContractorBenchPage() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email || submitting) return;
    setSubmitting(true);
    try {
      await joinBenchWaitlist(email);
      setSubmitted(true);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Something went wrong';
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div>
      {/* Header */}
      <div className="bg-gradient-to-br from-[#0f1a2e] via-navy to-[#1a2d4d] text-white py-12 md:py-16">
        <div className="max-w-5xl mx-auto px-4">
          <Link to="/trades" className="inline-flex items-center gap-1 text-white/50 hover:text-orange text-sm no-underline mb-6 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to Trades
          </Link>

          <div className="flex items-center gap-2 mb-4">
            <span className="bg-orange/20 text-orange text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
              Coming Soon
            </span>
          </div>

          <h1 className="text-3xl md:text-5xl font-black leading-tight">
            Contractor Bench
          </h1>
          <p className="text-xl md:text-2xl text-white/50 mt-3 max-w-2xl font-medium">
            Browse available tradespeople by skill, certification, and availability.
          </p>
          <p className="text-sm text-white/30 mt-4">
            Available to Pro tier employers. Free during Founding Employer period.
          </p>
        </div>
      </div>

      {/* Mock preview */}
      <div className="max-w-6xl mx-auto px-4 py-10 md:py-14">
        {/* Fake search/filter bar */}
        <div className="flex items-center gap-3 mb-6 opacity-60 pointer-events-none">
          <div className="flex-1 flex items-center gap-2 bg-white border border-gray-300 rounded-lg px-4 py-2.5">
            <Search className="w-5 h-5 text-gray-400" />
            <span className="text-gray-400 text-sm">Search by trade, certification, or location...</span>
          </div>
          <div className="flex items-center gap-2 bg-white border border-gray-300 rounded-lg px-4 py-2.5">
            <SlidersHorizontal className="w-4 h-4 text-gray-400" />
            <span className="text-gray-400 text-sm">Filters</span>
          </div>
        </div>

        {/* Skills Card grid preview */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {MOCK_WORKERS.map((worker, i) => (
            <SkillsCardDisplay
              key={worker.name}
              data={worker}
              compact
              blurred={i > 1}
            />
          ))}
        </div>

        <p className="text-center text-sm text-gray-400 mt-6">
          Showing preview data. Real worker profiles coming soon.
        </p>
      </div>

      {/* Email Capture */}
      <section className="bg-gradient-to-r from-[#0f1a2e] to-navy py-12 md:py-16">
        <div className="max-w-lg mx-auto px-4 text-center">
          {submitted ? (
            <div className="text-center">
              <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />
              <h2 className="text-2xl font-black text-white mb-2">You're on the list!</h2>
              <p className="text-white/50">
                We'll notify you at <span className="text-orange font-semibold">{email}</span> when Contractor Bench launches.
              </p>
            </div>
          ) : (
            <>
              <Mail className="w-10 h-10 text-orange mx-auto mb-4" />
              <h2 className="text-2xl md:text-3xl font-black text-white mb-2">
                Get notified when Contractor Bench launches
              </h2>
              <p className="text-white/50 mb-6">
                Be the first to search Toledo's skilled trades workforce.
              </p>

              <form onSubmit={handleSubmit} className="flex gap-2 max-w-md mx-auto">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@company.com"
                  className="flex-1 px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder:text-white/30 outline-none focus:border-orange transition-colors"
                />
                <button
                  type="submit"
                  disabled={submitting}
                  className="bg-orange hover:bg-orange-dark text-white font-bold px-6 py-3 rounded-lg transition-colors cursor-pointer border-none shrink-0 disabled:opacity-50"
                >
                  {submitting ? 'Saving...' : 'Notify Me'}
                </button>
              </form>
            </>
          )}
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
          <p className="text-xs mt-4 text-white/20">
            &copy; {new Date().getFullYear()} Toledo Works. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
