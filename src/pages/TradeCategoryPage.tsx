import { useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
  ArrowLeft, DollarSign, Clock, MapPin, Shield, Award, ChevronDown,
  HardHat, Flame, SlidersHorizontal, Loader2,
} from 'lucide-react';
import { fetchTradesJobs } from '../lib/queries';
import { sampleJobs } from '../data/sampleJobs';
import FoundingEmployerBadge from '../components/FoundingEmployerBadge';
import type { Job } from '../types/database';

function formatPay(job: Job): string {
  if (!job.pay_min && !job.pay_max) return 'Pay not listed';
  const suffix = job.pay_type === 'hourly' ? '/hr' : job.pay_type === 'salary' ? '/yr' : '';
  if (job.pay_min && job.pay_max) return `$${job.pay_min}–$${job.pay_max}${suffix}`;
  return `$${job.pay_min || job.pay_max}${suffix}`;
}

export default function TradeCategoryPage() {
  const { category } = useParams<{ category: string }>();
  const decodedCategory = decodeURIComponent(category || '');

  const { data: liveJobs, isLoading, error } = useQuery({
    queryKey: ['tradesJobs'],
    queryFn: fetchTradesJobs,
    retry: false,
  });

  const allTradesJobs = error ? sampleJobs.filter((j) => j.trade_category) : (liveJobs ?? sampleJobs.filter((j) => j.trade_category));

  // Filters
  const [prevailingWage, setPrevailingWage] = useState(false);
  const [perDiem, setPerDiem] = useState(false);
  const [overtime, setOvertime] = useState(false);
  const [unionFilter, setUnionFilter] = useState<string>('');
  const [experienceFilter, setExperienceFilter] = useState<string>('');
  const [showFilters, setShowFilters] = useState(false);

  const filteredJobs = useMemo(() => {
    let jobs = allTradesJobs.filter((j) => {
      if (!j.trade_category) return false;
      return j.trade_category === decodedCategory
        || decodedCategory.includes(j.trade_category)
        || j.trade_category.includes(decodedCategory.split('/')[0]);
    });

    if (prevailingWage) jobs = jobs.filter((j) => j.prevailing_wage);
    if (perDiem) jobs = jobs.filter((j) => j.per_diem_included);
    if (overtime) jobs = jobs.filter((j) => j.overtime_available);
    if (unionFilter) jobs = jobs.filter((j) => j.union_status === unionFilter);
    if (experienceFilter) jobs = jobs.filter((j) => j.experience_level === experienceFilter);

    // Sort by pay high to low
    jobs.sort((a, b) => (b.pay_max || b.pay_min || 0) - (a.pay_max || a.pay_min || 0));
    return jobs;
  }, [allTradesJobs, decodedCategory, prevailingWage, perDiem, overtime, unionFilter, experienceFilter]);

  const activeFilterCount = [prevailingWage, perDiem, overtime, !!unionFilter, !!experienceFilter].filter(Boolean).length;

  function clearFilters() {
    setPrevailingWage(false);
    setPerDiem(false);
    setOvertime(false);
    setUnionFilter('');
    setExperienceFilter('');
  }

  return (
    <div>
      {/* Header banner */}
      <div className="bg-gradient-to-r from-[#0f1a2e] to-navy text-white py-8 md:py-12">
        <div className="max-w-5xl mx-auto px-4">
          <Link to="/trades" className="inline-flex items-center gap-1 text-white/50 hover:text-orange text-sm no-underline mb-4 transition-colors">
            <ArrowLeft className="w-4 h-4" /> All Trades
          </Link>
          <div className="flex items-center gap-3">
            <HardHat className="w-8 h-8 text-orange" />
            <div>
              <h1 className="text-3xl md:text-4xl font-black">{decodedCategory.replace('/', ' / ')}</h1>
              <p className="text-white/50 mt-1">
                {filteredJobs.length} {filteredJobs.length === 1 ? 'job' : 'jobs'} &middot; Sorted by highest pay
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-6 md:py-8">
        {/* Filter bar */}
        <div className="flex items-center gap-2 mb-6 flex-wrap">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold border cursor-pointer transition-colors ${
              activeFilterCount > 0
                ? 'bg-orange text-white border-orange'
                : 'bg-white text-navy border-gray-300 hover:border-orange'
            }`}
          >
            <SlidersHorizontal className="w-4 h-4" />
            Filters{activeFilterCount > 0 && ` (${activeFilterCount})`}
            <ChevronDown className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
          </button>

          {activeFilterCount > 0 && (
            <button
              onClick={clearFilters}
              className="text-sm text-gray-500 hover:text-navy bg-transparent border-none cursor-pointer underline"
            >
              Clear all
            </button>
          )}

          {/* Quick toggles */}
          <div className="hidden md:flex gap-2 ml-auto">
            {[
              { label: 'Prevailing Wage', active: prevailingWage, toggle: () => setPrevailingWage(!prevailingWage) },
              { label: 'Per Diem', active: perDiem, toggle: () => setPerDiem(!perDiem) },
              { label: 'Overtime', active: overtime, toggle: () => setOvertime(!overtime) },
            ].map((f) => (
              <button
                key={f.label}
                onClick={f.toggle}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold border cursor-pointer transition-colors ${
                  f.active
                    ? 'bg-navy text-white border-navy'
                    : 'bg-white text-navy border-gray-300 hover:border-navy'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* Expanded filters */}
        {showFilters && (
          <div className="bg-white border border-gray-200 rounded-xl p-4 mb-6 grid grid-cols-2 md:grid-cols-5 gap-3">
            <label className={`flex items-center gap-2 p-2.5 rounded-lg border cursor-pointer transition-all text-sm ${
              prevailingWage ? 'border-orange bg-orange/5 text-navy' : 'border-gray-200 text-gray-600'
            }`}>
              <input type="checkbox" checked={prevailingWage} onChange={(e) => setPrevailingWage(e.target.checked)} className="sr-only" />
              <DollarSign className={`w-4 h-4 ${prevailingWage ? 'text-orange' : 'text-gray-400'}`} />
              Prevailing Wage
            </label>

            <label className={`flex items-center gap-2 p-2.5 rounded-lg border cursor-pointer transition-all text-sm ${
              perDiem ? 'border-orange bg-orange/5 text-navy' : 'border-gray-200 text-gray-600'
            }`}>
              <input type="checkbox" checked={perDiem} onChange={(e) => setPerDiem(e.target.checked)} className="sr-only" />
              <DollarSign className={`w-4 h-4 ${perDiem ? 'text-orange' : 'text-gray-400'}`} />
              Per Diem
            </label>

            <label className={`flex items-center gap-2 p-2.5 rounded-lg border cursor-pointer transition-all text-sm ${
              overtime ? 'border-orange bg-orange/5 text-navy' : 'border-gray-200 text-gray-600'
            }`}>
              <input type="checkbox" checked={overtime} onChange={(e) => setOvertime(e.target.checked)} className="sr-only" />
              <Clock className={`w-4 h-4 ${overtime ? 'text-orange' : 'text-gray-400'}`} />
              Overtime
            </label>

            <select
              value={unionFilter}
              onChange={(e) => setUnionFilter(e.target.value)}
              className="border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-navy outline-none focus:border-orange"
            >
              <option value="">Union Status</option>
              <option value="union">Union</option>
              <option value="non_union">Non-Union</option>
              <option value="either">Either</option>
            </select>

            <select
              value={experienceFilter}
              onChange={(e) => setExperienceFilter(e.target.value)}
              className="border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-navy outline-none focus:border-orange"
            >
              <option value="">Experience Level</option>
              <option value="apprentice">Apprentice</option>
              <option value="journeyman">Journeyman</option>
              <option value="master">Master</option>
            </select>
          </div>
        )}

        {/* Job Cards - trade-optimized layout */}
        {isLoading ? (
          <div className="flex justify-center py-16"><Loader2 className="w-8 h-8 text-orange animate-spin" /></div>
        ) : filteredJobs.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <HardHat className="w-16 h-16 mx-auto mb-4 opacity-30" />
            <p className="text-xl font-bold text-navy">No {decodedCategory.replace('/', ' / ')} jobs right now</p>
            <p className="text-sm mt-2">Check back soon or browse other trades</p>
            <Link to="/trades" className="text-orange hover:underline mt-4 inline-block font-semibold no-underline">
              View All Trades
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredJobs.map((job) => (
              <TradeJobCard key={job.id} job={job} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function TradeJobCard({ job }: { job: Job }) {
  const payDisplay = useMemo(() => {
    if (!job.pay_max && !job.pay_min) return null;
    const top = job.pay_max || job.pay_min || 0;
    const suffix = job.pay_type === 'hourly' ? '/hr' : '/yr';
    return { amount: `$${top}`, suffix };
  }, [job]);

  return (
    <Link
      to={`/jobs/${job.id}`}
      className="block bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md hover:border-orange/30 transition-all no-underline group"
    >
      <div className="flex items-start gap-4">
        {/* Pay - large and prominent */}
        {payDisplay && (
          <div className="shrink-0 bg-gradient-to-br from-navy to-[#0f1a2e] rounded-xl px-4 py-3 text-center min-w-[80px]">
            <p className="text-xl md:text-2xl font-black text-orange leading-none">{payDisplay.amount}</p>
            <p className="text-[10px] text-white/50 uppercase font-bold mt-0.5">{payDisplay.suffix}</p>
          </div>
        )}

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h3 className="text-lg font-bold text-navy group-hover:text-orange transition-colors">
                {job.title}
              </h3>
              <p className="text-sm text-gray-500 flex items-center gap-1.5">
                {job.company?.company_name || 'Company'}
                {job.company?.is_founding_employer && <FoundingEmployerBadge />}
              </p>
            </div>
            {job.is_urgently_hiring && (
              <span className="inline-flex items-center gap-1 bg-red-50 text-red-600 text-xs font-bold px-2 py-0.5 rounded-full shrink-0">
                <Flame className="w-3 h-3" /> Urgent
              </span>
            )}
          </div>

          {/* Trade-specific badges */}
          <div className="flex flex-wrap gap-1.5 mt-3">
            {/* Union status */}
            <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full ${
              job.union_status === 'union'
                ? 'bg-blue-50 text-blue-700'
                : job.union_status === 'non_union'
                ? 'bg-gray-100 text-gray-600'
                : 'bg-gray-50 text-gray-500'
            }`}>
              <Shield className="w-3 h-3" />
              {job.union_status === 'union' ? 'Union' : job.union_status === 'non_union' ? 'Non-Union' : 'Union or Non'}
            </span>

            {/* Pay range full */}
            <span className="inline-flex items-center gap-1 text-xs bg-navy/5 text-navy font-medium px-2.5 py-1 rounded-full">
              <DollarSign className="w-3 h-3" /> {formatPay(job)}
            </span>

            {job.neighborhood && (
              <span className="inline-flex items-center gap-1 text-xs bg-navy/5 text-navy px-2.5 py-1 rounded-full">
                <MapPin className="w-3 h-3" /> {job.neighborhood}
              </span>
            )}

            {job.overtime_available && (
              <span className="text-xs bg-green-50 text-green-700 font-semibold px-2.5 py-1 rounded-full">
                OT Available
              </span>
            )}

            {job.prevailing_wage && (
              <span className="text-xs bg-amber-50 text-amber-700 font-semibold px-2.5 py-1 rounded-full">
                Prevailing Wage
              </span>
            )}

            {job.per_diem_included && (
              <span className="text-xs bg-purple-50 text-purple-700 font-semibold px-2.5 py-1 rounded-full">
                Per Diem
              </span>
            )}

            {job.project_duration && (
              <span className="text-xs bg-navy/5 text-navy px-2.5 py-1 rounded-full">
                <Clock className="w-3 h-3 inline mr-1" />{job.project_duration}
              </span>
            )}

            {job.experience_level && (
              <span className="text-xs bg-orange/10 text-orange font-semibold px-2.5 py-1 rounded-full capitalize">
                {job.experience_level}
              </span>
            )}
          </div>

          {/* Certifications chips */}
          {job.certifications_required.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-2">
              {job.certifications_required.map((cert) => (
                <span key={cert} className="inline-flex items-center gap-1 text-[11px] bg-navy/10 text-navy font-medium px-2 py-0.5 rounded">
                  <Award className="w-3 h-3" /> {cert}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
