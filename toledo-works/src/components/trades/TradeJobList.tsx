import { useState, useMemo } from 'react';
import { useJobs } from '../../hooks/useJobs';
import { Chip } from '../ui/Chip';
import JobCard from '../jobs/JobCard';
import type { Job } from '../../types';

interface TradeJobListProps {
  tradeCategory: string;
}

type TradeFilter = 'prevailing_wage' | 'per_diem' | 'union' | 'overtime';

const FILTER_CHIPS: { key: TradeFilter; label: string }[] = [
  { key: 'prevailing_wage', label: 'Prevailing Wage' },
  { key: 'per_diem', label: 'Per Diem' },
  { key: 'union', label: 'Union' },
  { key: 'overtime', label: 'OT Available' },
];

function matchesFilter(job: Job, filter: TradeFilter): boolean {
  switch (filter) {
    case 'prevailing_wage':
      return job.prevailing_wage;
    case 'per_diem':
      return job.per_diem_included;
    case 'union':
      return job.union_status === 'union';
    case 'overtime':
      return job.overtime_available;
    default:
      return true;
  }
}

export default function TradeJobList({ tradeCategory }: TradeJobListProps) {
  const { data: jobs = [], isLoading } = useJobs({ trade_category: tradeCategory });
  const [activeFilters, setActiveFilters] = useState<Set<TradeFilter>>(new Set());

  const toggleFilter = (filter: TradeFilter) => {
    setActiveFilters((prev) => {
      const next = new Set(prev);
      if (next.has(filter)) {
        next.delete(filter);
      } else {
        next.add(filter);
      }
      return next;
    });
  };

  const filtered = useMemo(() => {
    let result = jobs;

    if (activeFilters.size > 0) {
      result = result.filter((job) =>
        Array.from(activeFilters).every((f) => matchesFilter(job, f))
      );
    }

    // Default sort: pay high-to-low
    return [...result].sort((a, b) => {
      const payA = a.pay_max ?? a.pay_min ?? 0;
      const payB = b.pay_max ?? b.pay_min ?? 0;
      return payB - payA;
    });
  }, [jobs, activeFilters]);

  return (
    <div className="space-y-4">
      {/* Filter chips */}
      <div className="flex flex-wrap gap-2">
        {FILTER_CHIPS.map(({ key, label }) => (
          <Chip
            key={key}
            variant={activeFilters.has(key) ? 'primary' : 'outline'}
            onClick={() => toggleFilter(key)}
            className="cursor-pointer"
          >
            {label}
          </Chip>
        ))}
      </div>

      {/* Results */}
      {isLoading ? (
        <div className="text-center text-gray-400 py-12">Loading jobs...</div>
      ) : filtered.length === 0 ? (
        <div className="text-center text-gray-400 py-12">
          No jobs found for this trade
          {activeFilters.size > 0 ? ' with the selected filters' : ''}.
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((job) => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>
      )}
    </div>
  );
}
