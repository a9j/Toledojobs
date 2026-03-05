import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useMyApplications } from '../../hooks/useApplications';
import { useSavedJobs, useToggleSaveJob } from '../../hooks/useJobs';
import Card from '../ui/Card';
import Badge from '../ui/Badge';
import Button from '../ui/Button';
import Skeleton from '../ui/Skeleton';
import SmartMatch from '../ai/SmartMatch';
import { Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import {
  Briefcase,
  Bookmark,
  BookmarkX,
  Sparkles,
  MapPin,
  Building2,
  Clock,
} from 'lucide-react';
import { cn, formatPay, timeAgo } from '../../lib/utils';
import type { Application } from '../../types';

type Tab = 'applied' | 'saved' | 'matched';

const STATUS_BADGE: Record<Application['status'], { variant: 'gray' | 'orange' | 'navy' | 'green' | 'red' | 'yellow'; label: string }> = {
  applied: { variant: 'navy', label: 'Applied' },
  reviewed: { variant: 'yellow', label: 'Reviewed' },
  interview: { variant: 'orange', label: 'Interview' },
  hired: { variant: 'green', label: 'Hired' },
  rejected: { variant: 'red', label: 'Not Selected' },
};

export default function SeekerDashboard() {
  const { user, profile } = useAuth();
  const [activeTab, setActiveTab] = useState<Tab>('applied');

  const { data: applications, isLoading: appsLoading } = useMyApplications(user?.id);
  const { data: savedJobs, isLoading: savedLoading } = useSavedJobs(user?.id);
  const toggleSave = useToggleSaveJob();

  function handleUnsave(jobId: string) {
    if (!user) return;
    toggleSave.mutate(
      { profileId: user.id, jobId, isSaved: true },
      { onSuccess: () => toast.success('Removed from saved jobs') }
    );
  }

  const tabs: { key: Tab; label: string; icon: React.ReactNode; count?: number }[] = [
    { key: 'applied', label: 'Applied', icon: <Briefcase className="w-4 h-4" />, count: applications?.length },
    { key: 'saved', label: 'Saved', icon: <Bookmark className="w-4 h-4" />, count: savedJobs?.length },
    { key: 'matched', label: 'Matched For You', icon: <Sparkles className="w-4 h-4" /> },
  ];

  return (
    <div className="space-y-6">
      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 p-1 rounded-card">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={cn(
              'flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg text-sm font-medium transition-colors',
              activeTab === tab.key
                ? 'bg-white text-navy shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
            )}
          >
            {tab.icon}
            {tab.label}
            {tab.count !== undefined && tab.count > 0 && (
              <span className="bg-navy/10 text-navy text-xs font-bold px-1.5 py-0.5 rounded-full">
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Applied Jobs */}
      {activeTab === 'applied' && (
        <div className="space-y-3">
          {appsLoading ? (
            Array.from({ length: 3 }).map((_, i) => (
              <Card key={i} className="space-y-3">
                <Skeleton className="h-5 w-48" />
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-4 w-24" />
              </Card>
            ))
          ) : !applications?.length ? (
            <Card className="text-center py-10">
              <Briefcase className="w-10 h-10 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 font-medium">No applications yet</p>
              <p className="text-gray-400 text-sm mt-1">Jobs you apply to will show up here.</p>
              <Link to="/jobs">
                <Button variant="outline" size="sm" className="mt-4">
                  Browse Jobs
                </Button>
              </Link>
            </Card>
          ) : (
            applications.map((app) => {
              const status = STATUS_BADGE[app.status];
              return (
                <Link key={app.id} to={`/jobs/${app.job_id}`}>
                  <Card hover className="space-y-2">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <h3 className="font-semibold text-gray-900 truncate">
                          {app.job?.title || 'Job'}
                        </h3>
                        <div className="flex items-center gap-2 text-sm text-gray-500 mt-0.5">
                          <Building2 className="w-3.5 h-3.5" />
                          <span>{app.job?.company?.company_name || 'Company'}</span>
                        </div>
                      </div>
                      <Badge variant={status.variant}>{status.label}</Badge>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-gray-400">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        Applied {timeAgo(app.applied_at)}
                      </span>
                      {app.job?.zip_code && (
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {app.job.zip_code}
                        </span>
                      )}
                    </div>
                  </Card>
                </Link>
              );
            })
          )}
        </div>
      )}

      {/* Saved Jobs */}
      {activeTab === 'saved' && (
        <div className="space-y-3">
          {savedLoading ? (
            Array.from({ length: 3 }).map((_, i) => (
              <Card key={i} className="space-y-3">
                <Skeleton className="h-5 w-48" />
                <Skeleton className="h-4 w-32" />
              </Card>
            ))
          ) : !savedJobs?.length ? (
            <Card className="text-center py-10">
              <Bookmark className="w-10 h-10 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 font-medium">No saved jobs</p>
              <p className="text-gray-400 text-sm mt-1">Tap the bookmark icon on a job to save it.</p>
              <Link to="/jobs">
                <Button variant="outline" size="sm" className="mt-4">
                  Browse Jobs
                </Button>
              </Link>
            </Card>
          ) : (
            savedJobs.map((saved: any) => {
              const job = saved.job;
              if (!job) return null;
              return (
                <Card key={saved.id} hover className="space-y-2">
                  <div className="flex items-start justify-between gap-3">
                    <Link to={`/jobs/${job.id}`} className="min-w-0 flex-1">
                      <h3 className="font-semibold text-gray-900 truncate">{job.title}</h3>
                      <div className="flex items-center gap-2 text-sm text-gray-500 mt-0.5">
                        <Building2 className="w-3.5 h-3.5" />
                        <span>{job.company?.company_name || 'Company'}</span>
                      </div>
                      <p className="text-sm text-orange font-medium mt-1">
                        {formatPay(job.pay_min, job.pay_max, job.pay_type)}
                      </p>
                    </Link>
                    <button
                      onClick={() => handleUnsave(job.id)}
                      className="p-2 text-gray-400 hover:text-red transition-colors"
                      title="Remove from saved"
                    >
                      <BookmarkX className="w-5 h-5" />
                    </button>
                  </div>
                </Card>
              );
            })
          )}
        </div>
      )}

      {/* Smart Match */}
      {activeTab === 'matched' && (
        <div>
          {profile ? (
            <SmartMatch profile={profile} />
          ) : (
            <Card className="text-center py-10">
              <Sparkles className="w-10 h-10 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 font-medium">Complete your profile first</p>
              <p className="text-gray-400 text-sm mt-1">
                We need your profile info to find your best matches.
              </p>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}
