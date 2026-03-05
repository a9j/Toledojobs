import { Inbox } from 'lucide-react';
import type { Job } from '../../types';
import JobCard from './JobCard';
import { JobCardSkeleton } from '../ui/Skeleton';
import Button from '../ui/Button';

interface JobFeedProps {
  jobs: (Job & { company?: Job['company'] })[];
  loading?: boolean;
  hasMore?: boolean;
  onLoadMore?: () => void;
  loadingMore?: boolean;
}

export default function JobFeed({ jobs, loading, hasMore, onLoadMore, loadingMore }: JobFeedProps) {
  if (loading) {
    return (
      <div className="space-y-4">
        <JobCardSkeleton />
        <JobCardSkeleton />
        <JobCardSkeleton />
      </div>
    );
  }

  if (!jobs || jobs.length === 0) {
    return (
      <div className="text-center py-16">
        <Inbox className="w-12 h-12 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-700">No jobs match your filters</h3>
        <p className="text-sm text-gray-500 mt-1">
          Try adjusting your search or removing some filters.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {jobs.map((job) => (
        <JobCard key={job.id} job={job} />
      ))}

      {hasMore && onLoadMore && (
        <div className="flex justify-center pt-4">
          <Button
            variant="outline"
            onClick={onLoadMore}
            loading={loadingMore}
          >
            Load More
          </Button>
        </div>
      )}
    </div>
  );
}
