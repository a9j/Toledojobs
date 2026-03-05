import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useMyApplications } from '../../hooks/useApplications';
import Card from '../ui/Card';
import Badge from '../ui/Badge';
import Skeleton from '../ui/Skeleton';
import { Link } from 'react-router-dom';
import {
  Building2,
  Clock,
  ChevronDown,
  ChevronUp,
  FileText,
} from 'lucide-react';
import { timeAgo } from '../../lib/utils';
import type { Application } from '../../types';

const STATUS_CONFIG: Record<
  Application['status'],
  { variant: 'gray' | 'orange' | 'navy' | 'green' | 'red' | 'yellow'; label: string }
> = {
  applied: { variant: 'navy', label: 'Applied' },
  reviewed: { variant: 'yellow', label: 'Reviewed' },
  interview: { variant: 'orange', label: 'Interview' },
  hired: { variant: 'green', label: 'Hired' },
  rejected: { variant: 'red', label: 'Not Selected' },
};

export default function ApplicationHistory() {
  const { user } = useAuth();
  const { data: applications, isLoading } = useMyApplications(user?.id);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  function toggleExpand(id: string) {
    setExpandedId((prev) => (prev === id ? null : id));
  }

  if (isLoading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i} className="space-y-3">
            <Skeleton className="h-5 w-48" />
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-4 w-24" />
          </Card>
        ))}
      </div>
    );
  }

  if (!applications?.length) {
    return (
      <Card className="text-center py-12">
        <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
        <h3 className="text-lg font-semibold text-gray-700">No applications yet</h3>
        <p className="text-gray-400 text-sm mt-1">
          When you apply to jobs, your history will appear here.
        </p>
        <Link
          to="/jobs"
          className="inline-block mt-4 text-orange font-semibold text-sm hover:underline"
        >
          Browse open jobs
        </Link>
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      <h2 className="text-lg font-bold text-navy">Application History</h2>
      <p className="text-sm text-gray-500 mb-4">
        {applications.length} application{applications.length !== 1 ? 's' : ''}
      </p>

      {applications.map((app) => {
        const status = STATUS_CONFIG[app.status];
        const isExpanded = expandedId === app.id;

        return (
          <Card key={app.id} className="overflow-hidden">
            <button
              onClick={() => toggleExpand(app.id)}
              className="w-full text-left"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <h3 className="font-semibold text-gray-900 truncate">
                    {app.job?.title || 'Job'}
                  </h3>
                  <div className="flex items-center gap-2 text-sm text-gray-500 mt-0.5">
                    <Building2 className="w-3.5 h-3.5 shrink-0" />
                    <span className="truncate">
                      {app.job?.company?.company_name || 'Company'}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <Badge variant={status.variant}>{status.label}</Badge>
                  {isExpanded ? (
                    <ChevronUp className="w-4 h-4 text-gray-400" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-gray-400" />
                  )}
                </div>
              </div>

              <div className="flex items-center gap-1 text-xs text-gray-400 mt-2">
                <Clock className="w-3 h-3" />
                Applied {timeAgo(app.applied_at)}
              </div>
            </button>

            {isExpanded && (
              <div className="mt-4 pt-4 border-t border-gray-100 space-y-3">
                {app.candidate_summary && (
                  <div>
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">
                      Your Summary
                    </p>
                    <p className="text-sm text-gray-700 leading-relaxed">
                      {app.candidate_summary}
                    </p>
                  </div>
                )}

                {app.notes && (
                  <div>
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">
                      Employer Notes
                    </p>
                    <p className="text-sm text-gray-700 leading-relaxed">{app.notes}</p>
                  </div>
                )}

                {!app.candidate_summary && !app.notes && (
                  <p className="text-sm text-gray-400 italic">No additional details available.</p>
                )}

                <Link
                  to={`/jobs/${app.job_id}`}
                  className="inline-block text-sm text-orange font-semibold hover:underline"
                >
                  View Job Posting
                </Link>
              </div>
            )}
          </Card>
        );
      })}
    </div>
  );
}
