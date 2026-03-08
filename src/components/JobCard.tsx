import { MapPin, Clock, DollarSign, Bookmark, Flame } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { Job } from '../types/database';
import FoundingEmployerBadge from './FoundingEmployerBadge';

function formatPay(job: Job): string {
  if (!job.pay_min && !job.pay_max) return 'Pay not listed';
  const type = job.pay_type === 'hourly' ? '/hr' : job.pay_type === 'salary' ? '/yr' : '';
  if (job.pay_min && job.pay_max) {
    return `$${job.pay_min}–$${job.pay_max}${type}`;
  }
  return `$${job.pay_min || job.pay_max}${type}`;
}

function formatJobType(type: string): string {
  return type.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}

function formatShift(shift: string): string {
  const map: Record<string, string> = {
    first: '1st Shift',
    second: '2nd Shift',
    third: '3rd Shift',
    flexible: 'Flexible',
    weekends: 'Weekends',
    rotating: 'Rotating',
  };
  return map[shift] || shift;
}

function timeAgo(dateStr: string): string {
  const now = new Date();
  const date = new Date(dateStr);
  const diffMs = now.getTime() - date.getTime();
  const diffHrs = Math.floor(diffMs / (1000 * 60 * 60));
  if (diffHrs < 1) return 'Just now';
  if (diffHrs < 24) return `${diffHrs}h ago`;
  const diffDays = Math.floor(diffHrs / 24);
  if (diffDays === 1) return '1 day ago';
  if (diffDays < 7) return `${diffDays} days ago`;
  return `${Math.floor(diffDays / 7)}w ago`;
}

interface JobCardProps {
  job: Job;
  isSaved?: boolean;
  onToggleSave?: (jobId: string) => void;
}

export default function JobCard({ job, isSaved, onToggleSave }: JobCardProps) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md hover:border-orange/30 transition-all group">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <Link
              to={`/jobs/${job.id}`}
              className="text-lg font-bold text-navy group-hover:text-orange transition-colors truncate no-underline"
            >
              {job.title}
            </Link>
            {job.is_urgently_hiring && (
              <span className="inline-flex items-center gap-1 bg-red-50 text-red-600 text-xs font-semibold px-2 py-0.5 rounded-full">
                <Flame className="w-3 h-3" />
                Urgent
              </span>
            )}
          </div>
          <p className="text-sm text-gray-500 mt-0.5 flex items-center gap-1.5">
            {job.company?.company_name || 'Company'}
            {job.company?.is_founding_employer && <FoundingEmployerBadge />}
          </p>
        </div>
        <button
          onClick={() => onToggleSave?.(job.id)}
          className={`transition-colors shrink-0 bg-transparent border-none cursor-pointer p-1 ${
            isSaved ? 'text-orange' : 'text-gray-300 hover:text-orange'
          }`}
          aria-label={isSaved ? 'Unsave job' : 'Save job'}
        >
          <Bookmark className={`w-5 h-5 ${isSaved ? 'fill-orange' : ''}`} />
        </button>
      </div>

      <div className="flex flex-wrap gap-2 mt-3">
        <span className="inline-flex items-center gap-1 text-xs bg-navy/5 text-navy px-2.5 py-1 rounded-full">
          <DollarSign className="w-3.5 h-3.5" />
          {formatPay(job)}
        </span>
        <span className="inline-flex items-center gap-1 text-xs bg-navy/5 text-navy px-2.5 py-1 rounded-full">
          <Clock className="w-3.5 h-3.5" />
          {formatJobType(job.job_type)} &middot; {formatShift(job.shift)}
        </span>
        {job.zip_code && (
          <span className="inline-flex items-center gap-1 text-xs bg-navy/5 text-navy px-2.5 py-1 rounded-full">
            <MapPin className="w-3.5 h-3.5" />
            {job.neighborhood || job.zip_code}
          </span>
        )}
      </div>

      <div className="flex flex-wrap gap-1.5 mt-3">
        {!job.is_degree_required && (
          <span className="text-xs bg-green-50 text-green-700 px-2 py-0.5 rounded-full">
            No Degree
          </span>
        )}
        {job.is_spanish_friendly && (
          <span className="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full">
            Espa&ntilde;ol
          </span>
        )}
        {job.has_benefits && (
          <span className="text-xs bg-purple-50 text-purple-700 px-2 py-0.5 rounded-full">
            Benefits
          </span>
        )}
        {job.trade_category && (
          <Link
            to={`/trades/${encodeURIComponent(job.trade_category)}`}
            className="text-xs bg-amber-50 text-amber-700 px-2 py-0.5 rounded-full no-underline hover:bg-amber-100 transition-colors inline-flex items-center gap-1"
            onClick={(e) => e.stopPropagation()}
          >
            Trades &middot; {job.trade_category}
          </Link>
        )}
      </div>

      <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100">
        <span className="text-xs text-gray-400">{timeAgo(job.created_at)}</span>
        <Link
          to={`/jobs/${job.id}`}
          className="bg-orange hover:bg-orange-dark text-white text-sm font-semibold px-4 py-1.5 rounded-lg transition-colors no-underline"
        >
          Apply Now
        </Link>
      </div>
    </div>
  );
}
