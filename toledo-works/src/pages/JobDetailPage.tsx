import { useParams } from 'react-router-dom';
import JobDetail from '../components/jobs/JobDetail';
import { useJob } from '../hooks/useJobs';
import Skeleton from '../components/ui/Skeleton';

export default function JobDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { data: job, isLoading, error } = useJob(id);

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-6 space-y-4">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-6 w-48" />
        <Skeleton className="h-10 w-32" />
        <Skeleton className="h-40 w-full" />
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <h2 className="font-display text-2xl font-bold text-gray-900 mb-2">Job not found</h2>
        <p className="text-gray-500">This job may have been removed or the link is incorrect.</p>
      </div>
    );
  }

  return <JobDetail job={job} />;
}
