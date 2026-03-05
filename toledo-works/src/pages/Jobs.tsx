import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import JobSearch from '../components/jobs/JobSearch';
import QuickFilterChips from '../components/jobs/QuickFilterChips';
import JobFeed from '../components/jobs/JobFeed';
import JobFilters from '../components/jobs/JobFilters';
import { useJobs } from '../hooks/useJobs';
import { useTranslation } from '../context/LanguageContext';
import { SlidersHorizontal, X } from 'lucide-react';

export default function Jobs() {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const [showFilters, setShowFilters] = useState(false);

  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    category: searchParams.get('category') || '',
    zip_code: searchParams.get('zip') || '',
    job_type: '',
    shift: '',
    is_urgently_hiring: false,
    is_degree_required: undefined as boolean | undefined,
    is_spanish_friendly: false,
    has_benefits: false,
    union_status: '',
    prevailing_wage: false,
    pay_min: 0,
  });

  const { data: jobs, isLoading } = useJobs({
    search: filters.search || undefined,
    category: filters.category || undefined,
    zip_code: filters.zip_code || undefined,
    job_type: filters.job_type || undefined,
    shift: filters.shift || undefined,
    is_urgently_hiring: filters.is_urgently_hiring || undefined,
    is_degree_required: filters.is_degree_required,
    is_spanish_friendly: filters.is_spanish_friendly || undefined,
    has_benefits: filters.has_benefits || undefined,
    union_status: filters.union_status || undefined,
    prevailing_wage: filters.prevailing_wage || undefined,
    pay_min: filters.pay_min || undefined,
  });

  const handleSearch = ({ search, zip }: { search: string; zip: string }) => {
    setFilters((prev) => ({ ...prev, search, zip_code: zip }));
  };

  const handleQuickFilter = (key: string, value: boolean | string | number) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      category: '',
      zip_code: '',
      job_type: '',
      shift: '',
      is_urgently_hiring: false,
      is_degree_required: undefined,
      is_spanish_friendly: false,
      has_benefits: false,
      union_status: '',
      prevailing_wage: false,
      pay_min: 0,
    });
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <h1 className="font-display text-3xl font-bold mb-6">{t.jobs.title}</h1>

      <JobSearch
        initialSearch={filters.search}
        initialZip={filters.zip_code}
        onSearch={handleSearch}
      />

      <div className="my-4">
        <QuickFilterChips filters={filters} onFilterChange={handleQuickFilter} />
      </div>

      <div className="flex gap-6">
        {/* Desktop Filters Sidebar */}
        <div className="hidden lg:block w-72 flex-shrink-0">
          <JobFilters filters={filters} onFilterChange={(f) => setFilters(f)} onClear={clearFilters} />
        </div>

        {/* Mobile Filter Button */}
        <div className="lg:hidden fixed bottom-20 right-4 z-40">
          <button
            onClick={() => setShowFilters(true)}
            className="bg-navy text-white p-3 rounded-full shadow-lg"
          >
            <SlidersHorizontal className="w-6 h-6" />
          </button>
        </div>

        {/* Mobile Filter Sheet */}
        {showFilters && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <div className="absolute inset-0 bg-black/50" onClick={() => setShowFilters(false)} />
            <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl max-h-[80vh] overflow-y-auto p-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-display font-bold text-lg">{t.jobs.filters}</h2>
                <button onClick={() => setShowFilters(false)}>
                  <X className="w-6 h-6 text-gray-500" />
                </button>
              </div>
              <JobFilters filters={filters} onFilterChange={(f) => { setFilters(f); setShowFilters(false); }} onClear={clearFilters} />
            </div>
          </div>
        )}

        {/* Job Feed */}
        <div className="flex-1 min-w-0">
          <JobFeed jobs={jobs || []} loading={isLoading} />
        </div>
      </div>
    </div>
  );
}
