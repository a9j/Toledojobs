import { useParams } from 'react-router-dom';
import { User, Calendar, ChevronDown } from 'lucide-react';
import toast from 'react-hot-toast';
import { useApplications, useUpdateApplicationStatus } from '../../hooks/useApplications';
import { timeAgo } from '../../lib/utils';
import type { Application } from '../../types';
import Card from '../ui/Card';
import Badge from '../ui/Badge';

const STATUS_OPTIONS: { value: Application['status']; label: string }[] = [
  { value: 'applied', label: 'Applied' },
  { value: 'reviewed', label: 'Reviewed' },
  { value: 'interview', label: 'Interview' },
  { value: 'hired', label: 'Hired' },
  { value: 'rejected', label: 'Rejected' },
];

function statusBadgeVariant(status: Application['status']): 'gray' | 'navy' | 'orange' | 'green' | 'red' {
  switch (status) {
    case 'applied':
      return 'gray';
    case 'reviewed':
      return 'navy';
    case 'interview':
      return 'orange';
    case 'hired':
      return 'green';
    case 'rejected':
      return 'red';
    default:
      return 'gray';
  }
}

export default function ApplicationList() {
  const { jobId } = useParams<{ jobId: string }>();
  const { data: applications, isLoading } = useApplications(jobId);
  const updateStatus = useUpdateApplicationStatus();

  function handleStatusChange(applicationId: string, newStatus: Application['status']) {
    updateStatus.mutate(
      { id: applicationId, status: newStatus },
      {
        onSuccess: () => toast.success(`Status updated to ${newStatus}`),
        onError: () => toast.error('Failed to update status'),
      }
    );
  }

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-10">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/3" />
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-28 bg-gray-200 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-navy mb-2">Applications</h1>
      <p className="text-sm text-gray-500 mb-6">
        {applications?.length ?? 0} applicant{applications?.length !== 1 ? 's' : ''}
      </p>

      {!applications || applications.length === 0 ? (
        <Card className="py-12 text-center">
          <User className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <h3 className="text-lg font-semibold text-gray-700 mb-1">No applications yet</h3>
          <p className="text-gray-500 text-sm">
            Applications will appear here as candidates apply to this job.
          </p>
        </Card>
      ) : (
        <div className="space-y-3">
          {applications.map((app) => (
            <Card key={app.id} className="flex flex-col sm:flex-row sm:items-start gap-4">
              {/* Applicant Info */}
              <div className="flex items-start gap-3 flex-1 min-w-0">
                <div className="w-10 h-10 rounded-full bg-navy/10 flex items-center justify-center shrink-0">
                  {app.applicant?.avatar_url ? (
                    <img
                      src={app.applicant.avatar_url}
                      alt=""
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  ) : (
                    <User className="w-5 h-5 text-navy" />
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-semibold text-navy">
                      {app.applicant?.full_name || 'Anonymous Applicant'}
                    </span>
                    <Badge variant={statusBadgeVariant(app.status)}>
                      {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                    </Badge>
                  </div>

                  <div className="flex items-center gap-1 text-xs text-gray-500 mt-0.5">
                    <Calendar className="w-3 h-3" />
                    Applied {timeAgo(app.applied_at)}
                  </div>

                  {app.candidate_summary && (
                    <p className="text-sm text-gray-600 mt-2 leading-relaxed">
                      {app.candidate_summary}
                    </p>
                  )}
                </div>
              </div>

              {/* Status Dropdown */}
              <div className="shrink-0 relative">
                <label htmlFor={`status-${app.id}`} className="sr-only">
                  Update status
                </label>
                <div className="relative">
                  <select
                    id={`status-${app.id}`}
                    value={app.status}
                    onChange={(e) =>
                      handleStatusChange(app.id, e.target.value as Application['status'])
                    }
                    className="appearance-none w-full sm:w-40 px-3 py-2 pr-8 rounded-card border border-gray-300 bg-white text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-orange/50 focus:border-orange cursor-pointer"
                  >
                    {STATUS_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="w-4 h-4 text-gray-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
