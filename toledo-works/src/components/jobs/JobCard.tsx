import { useNavigate } from 'react-router-dom';
import { Heart, MapPin, Clock } from 'lucide-react';
import type { Job } from '../../types';
import { formatPay, timeAgo, cn } from '../../lib/utils';
import { SHIFT_LABELS } from '../../lib/constants';
import { useAuth } from '../../context/AuthContext';
import { useToggleSaveJob, useSavedJobs } from '../../hooks/useJobs';
import Card from '../ui/Card';
import Badge from '../ui/Badge';

interface JobCardProps {
  job: Job & { company?: Job['company'] };
}

export default function JobCard({ job }: JobCardProps) {
  const navigate = useNavigate();
  const { profile } = useAuth();
  const toggleSave = useToggleSaveJob();
  const { data: savedJobs } = useSavedJobs(profile?.id);

  const isSaved = savedJobs?.some((s: { job_id?: string }) => s.job_id === job.id) ?? false;

  const handleSave = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!profile) return;
    toggleSave.mutate({ profileId: profile.id, jobId: job.id, isSaved });
  };

  return (
    <Card
      hover
      className="relative"
      onClick={() => navigate(`/jobs/${job.id}`)}
    >
      {/* Save Button */}
      <button
        type="button"
        onClick={handleSave}
        className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 transition-colors"
        aria-label={isSaved ? 'Unsave job' : 'Save job'}
      >
        <Heart
          className={cn(
            'w-5 h-5',
            isSaved ? 'fill-red text-red' : 'text-gray-400'
          )}
        />
      </button>

      {/* Title & Company */}
      <h3 className="text-lg font-bold text-navy pr-10 leading-tight">
        {job.title}
      </h3>
      <p className="text-sm text-gray-600 mt-0.5">
        {job.company?.company_name}
      </p>

      {/* Pay Range - Most Prominent */}
      <p className="text-2xl font-bold text-orange mt-2">
        {formatPay(job.pay_min, job.pay_max, job.pay_type)}
      </p>

      {/* Location & Shift */}
      <div className="flex flex-wrap items-center gap-3 mt-2 text-sm text-gray-600">
        {(job.neighborhood || job.zip_code) && (
          <span className="inline-flex items-center gap-1">
            <MapPin className="w-4 h-4" />
            {job.neighborhood || job.zip_code}
          </span>
        )}
        {job.shift && (
          <Badge variant="gray">{SHIFT_LABELS[job.shift] || job.shift}</Badge>
        )}
      </div>

      {/* Status Badges */}
      <div className="flex flex-wrap gap-1.5 mt-3">
        {job.is_urgently_hiring && (
          <Badge variant="red">Hiring Now</Badge>
        )}
        {!job.is_degree_required && (
          <Badge variant="green">No Degree</Badge>
        )}
        {job.is_spanish_friendly && (
          <Badge variant="navy">Spanish Friendly</Badge>
        )}
        {job.has_benefits && (
          <Badge variant="green">Benefits</Badge>
        )}
        {job.company?.is_founding_employer && (
          <Badge variant="yellow">Founding Employer</Badge>
        )}
      </div>

      {/* Posted Time */}
      <p className="text-xs text-gray-400 mt-3 flex items-center gap-1">
        <Clock className="w-3 h-3" />
        {timeAgo(job.created_at)}
      </p>
    </Card>
  );
}
