import { useState, useMemo } from 'react';
import { Search, MapPin, SlidersHorizontal, X, Briefcase } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchJobs, fetchSavedJobs, saveJob, unsaveJob } from '../lib/queries';
import { useAuth } from '../lib/auth';
import { useJobStore } from '../store/jobStore';
import { sampleJobs } from '../data/sampleJobs';
import JobCard from '../components/JobCard';
import toast from 'react-hot-toast';

const JOB_TYPES = ['full_time', 'part_time', 'contract', 'temp', 'seasonal'] as const;
const SHIFTS = ['first', 'second', 'third', 'flexible', 'weekends', 'rotating'] as const;
const CATEGORIES = ['Warehouse', 'Healthcare', 'Restaurant/Service', 'Construction/Trades', 'Other'] as const;
const PAY_RANGES = [
  { label: 'Any Pay', min: 0 },
  { label: '$12+/hr', min: 12 },
  { label: '$15+/hr', min: 15 },
  { label: '$18+/hr', min: 18 },
  { label: '$20+/hr', min: 20 },
  { label: '$25+/hr', min: 25 },
] as const;

function formatJobType(type: string): string {
  return type.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}

function formatShift(shift: string): string {
  const map: Record<string, string> = {
    first: '1st Shift', second: '2nd Shift', third: '3rd Shift',
    flexible: 'Flexible', weekends: 'Weekends', rotating: 'Rotating',
  };
  return map[shift] || shift;
}

export default function JobSearchPage() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { filters } = useJobStore();

  const [searchTerm, setSearchTerm] = useState(filters.search);
  const [zipCode, setZipCode] = useState(filters.zipCode);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [selectedShifts, setSelectedShifts] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [minPay, setMinPay] = useState(0);
  const [noDegree, setNoDegree] = useState(false);
  const [spanishFriendly, setSpanishFriendly] = useState(false);
  const [hiringNow, setHiringNow] = useState(false);
  const [hasBenefits, setHasBenefits] = useState(false);
  const [hasOvertime, setHasOvertime] = useState(false);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  const { data: liveJobs, error } = useQuery({
    queryKey: ['jobs', filters],
    queryFn: () => fetchJobs(filters),
    retry: false,
  });

  const jobs = error ? sampleJobs : (liveJobs ?? sampleJobs);

  const { data: savedJobIds = [] } = useQuery({
    queryKey: ['savedJobs', user?.id],
    queryFn: () => fetchSavedJobs(user!.id),
    enabled: !!user,
  });

  const saveMutation = useMutation({
    mutationFn: (jobId: string) => {
      if (!user) throw new Error('Must be signed in');
      const isSaved = savedJobIds.includes(jobId);
      return isSaved ? unsaveJob(user.id, jobId) : saveJob(user.id, jobId);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['savedJobs'] }),
    onError: (err: Error) => toast.error(err.message),
  });

  function handleToggleSave(jobId: string) {
    if (!user) { toast.error('Sign in to save jobs'); return; }
    saveMutation.mutate(jobId);
  }

  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      if (searchTerm && !job.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
          !job.description.toLowerCase().includes(searchTerm.toLowerCase())) return false;
      if (zipCode && job.zip_code !== zipCode) return false;
      if (selectedTypes.length > 0 && !selectedTypes.includes(job.job_type)) return false;
      if (selectedShifts.length > 0 && !selectedShifts.includes(job.shift)) return false;
      if (selectedCategories.length > 0) {
        const jobCat = job.category || (job.trade_category ? 'Construction/Trades' : null);
        if (!jobCat || !selectedCategories.includes(jobCat)) return false;
      }
      if (minPay > 0 && (!job.pay_min || job.pay_min < minPay)) return false;
      if (noDegree && job.is_degree_required) return false;
      if (spanishFriendly && !job.is_spanish_friendly) return false;
      if (hiringNow && !job.is_urgently_hiring) return false;
      if (hasBenefits && !job.has_benefits) return false;
      if (hasOvertime && !job.overtime_available) return false;
      return true;
    });
  }, [jobs, searchTerm, zipCode, selectedTypes, selectedShifts, selectedCategories, minPay, noDegree, spanishFriendly, hiringNow, hasBenefits, hasOvertime]);

  const activeFilterCount = [
    selectedTypes.length > 0,
    selectedShifts.length > 0,
    selectedCategories.length > 0,
    minPay > 0,
    noDegree,
    spanishFriendly,
    hiringNow,
    hasBenefits,
    hasOvertime,
  ].filter(Boolean).length;

  function clearAllFilters() {
    setSelectedTypes([]);
    setSelectedShifts([]);
    setSelectedCategories([]);
    setMinPay(0);
    setNoDegree(false);
    setSpanishFriendly(false);
    setHiringNow(false);
    setHasBenefits(false);
    setHasOvertime(false);
    setSearchTerm('');
    setZipCode('');
  }

  function toggleArrayItem(arr: string[], item: string, setter: (v: string[]) => void) {
    setter(arr.includes(item) ? arr.filter((x) => x !== item) : [...arr, item]);
  }

  const filterContent = (
    <div className="space-y-6">
      {/* Job Type */}
      <div>
        <h3 className="text-sm font-semibold text-navy mb-2">Job Type</h3>
        <div className="space-y-1.5">
          {JOB_TYPES.map((type) => (
            <label key={type} className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
              <input
                type="checkbox"
                checked={selectedTypes.includes(type)}
                onChange={() => toggleArrayItem(selectedTypes, type, setSelectedTypes)}
                className="rounded border-gray-300 text-orange accent-orange"
              />
              {formatJobType(type)}
            </label>
          ))}
        </div>
      </div>

      {/* Shift */}
      <div>
        <h3 className="text-sm font-semibold text-navy mb-2">Shift</h3>
        <div className="space-y-1.5">
          {SHIFTS.map((shift) => (
            <label key={shift} className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
              <input
                type="checkbox"
                checked={selectedShifts.includes(shift)}
                onChange={() => toggleArrayItem(selectedShifts, shift, setSelectedShifts)}
                className="rounded border-gray-300 accent-orange"
              />
              {formatShift(shift)}
            </label>
          ))}
        </div>
      </div>

      {/* Pay Range */}
      <div>
        <h3 className="text-sm font-semibold text-navy mb-2">Pay Range</h3>
        <select
          value={minPay}
          onChange={(e) => setMinPay(Number(e.target.value))}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-navy outline-none focus:border-orange"
        >
          {PAY_RANGES.map((r) => (
            <option key={r.min} value={r.min}>{r.label}</option>
          ))}
        </select>
      </div>

      {/* Category */}
      <div>
        <h3 className="text-sm font-semibold text-navy mb-2">Category</h3>
        <div className="space-y-1.5">
          {CATEGORIES.map((cat) => (
            <label key={cat} className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
              <input
                type="checkbox"
                checked={selectedCategories.includes(cat)}
                onChange={() => toggleArrayItem(selectedCategories, cat, setSelectedCategories)}
                className="rounded border-gray-300 accent-orange"
              />
              {cat}
            </label>
          ))}
        </div>
      </div>

      {/* Quick Toggles */}
      <div>
        <h3 className="text-sm font-semibold text-navy mb-2">Quick Filters</h3>
        <div className="space-y-1.5">
          {[
            { label: 'No Degree Required', checked: noDegree, setter: setNoDegree },
            { label: 'Spanish-Friendly', checked: spanishFriendly, setter: setSpanishFriendly },
            { label: 'Hiring Now', checked: hiringNow, setter: setHiringNow },
            { label: 'Benefits', checked: hasBenefits, setter: setHasBenefits },
            { label: 'Overtime', checked: hasOvertime, setter: setHasOvertime },
          ].map((toggle) => (
            <label key={toggle.label} className="flex items-center justify-between cursor-pointer group">
              <span className="text-sm text-gray-700">{toggle.label}</span>
              <button
                type="button"
                onClick={() => toggle.setter(!toggle.checked)}
                className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors border-none cursor-pointer ${
                  toggle.checked ? 'bg-orange' : 'bg-gray-300'
                }`}
              >
                <span className={`inline-block h-3.5 w-3.5 rounded-full bg-white transition-transform ${
                  toggle.checked ? 'translate-x-4.5' : 'translate-x-0.5'
                }`} />
              </button>
            </label>
          ))}
        </div>
      </div>

      {activeFilterCount > 0 && (
        <button
          onClick={clearAllFilters}
          className="w-full text-sm text-gray-500 hover:text-navy py-2 border border-gray-200 rounded-lg bg-white cursor-pointer"
        >
          Clear All Filters
        </button>
      )}
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {/* Search Bar */}
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row bg-white rounded-xl shadow-md overflow-hidden border border-gray-200">
          <div className="flex items-center flex-1 px-4 py-3 gap-2 border-b sm:border-b-0 sm:border-r border-gray-200">
            <Search className="w-5 h-5 text-gray-400 shrink-0" />
            <input
              type="text"
              placeholder="Job title, keyword, or company..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full outline-none text-navy placeholder-gray-400 text-base bg-transparent"
            />
          </div>
          <div className="flex items-center px-4 py-3 gap-2 sm:w-48">
            <MapPin className="w-5 h-5 text-gray-400 shrink-0" />
            <input
              type="text"
              placeholder="Zip code"
              value={zipCode}
              onChange={(e) => setZipCode(e.target.value)}
              className="w-full outline-none text-navy placeholder-gray-400 text-base bg-transparent"
              maxLength={5}
            />
          </div>
          {/* Mobile filter toggle */}
          <button
            onClick={() => setShowMobileFilters(true)}
            className="md:hidden flex items-center justify-center gap-2 bg-navy text-white px-4 py-3 font-semibold text-sm cursor-pointer border-none"
          >
            <SlidersHorizontal className="w-4 h-4" />
            Filters
            {activeFilterCount > 0 && (
              <span className="bg-orange text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {activeFilterCount}
              </span>
            )}
          </button>
        </div>
      </div>

      <div className="flex gap-6">
        {/* Desktop Sidebar */}
        <aside className="hidden md:block w-64 shrink-0">
          <div className="bg-white rounded-xl border border-gray-200 p-5 sticky top-20">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-bold text-navy flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-orange" /> Filters
              </h2>
              {activeFilterCount > 0 && (
                <span className="text-xs bg-orange/10 text-orange font-semibold px-2 py-0.5 rounded-full">
                  {activeFilterCount}
                </span>
              )}
            </div>
            {filterContent}
          </div>
        </aside>

        {/* Job Results */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-navy flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-orange" />
              {filteredJobs.length} Job{filteredJobs.length !== 1 ? 's' : ''} Found
            </h2>
            {error && (
              <span className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded">
                Sample listings
              </span>
            )}
          </div>

          {filteredJobs.length > 0 ? (
            <div className="space-y-4">
              {filteredJobs.map((job) => (
                <JobCard
                  key={job.id}
                  job={job}
                  isSaved={savedJobIds.includes(job.id)}
                  onToggleSave={handleToggleSave}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 text-gray-400">
              <Briefcase className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p className="text-lg font-medium">No jobs match your filters</p>
              <p className="text-sm mt-1">Try adjusting your search or filters</p>
              <button
                onClick={clearAllFilters}
                className="mt-4 text-orange hover:text-orange-dark font-medium text-sm cursor-pointer bg-transparent border-none"
              >
                Clear all filters
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Filter Bottom Sheet */}
      {showMobileFilters && (
        <div className="fixed inset-0 z-[100] md:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowMobileFilters(false)} />
          <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between p-4 border-b border-gray-100">
              <h2 className="text-lg font-bold text-navy">Filters</h2>
              <button
                onClick={() => setShowMobileFilters(false)}
                className="text-gray-400 hover:text-navy bg-transparent border-none cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="overflow-y-auto p-4 flex-1">
              {filterContent}
            </div>
            <div className="p-4 border-t border-gray-100">
              <button
                onClick={() => setShowMobileFilters(false)}
                className="w-full bg-orange hover:bg-orange-dark text-white py-3 rounded-lg font-semibold transition-colors cursor-pointer border-none"
              >
                Show {filteredJobs.length} Result{filteredJobs.length !== 1 ? 's' : ''}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
