import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Loader2, AlertCircle, Briefcase } from 'lucide-react';
import { useJobStore } from '../store/jobStore';
import { fetchJobs, fetchSavedJobs, saveJob, unsaveJob } from '../lib/queries';
import { useAuth } from '../lib/auth';
import JobCard from './JobCard';
import { sampleJobs } from '../data/sampleJobs';
import toast from 'react-hot-toast';

export default function JobFeed() {
  const filters = useJobStore((s) => s.filters);
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: jobs, isLoading, error } = useQuery({
    queryKey: ['jobs', filters],
    queryFn: () => fetchJobs(filters),
    retry: false,
  });

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
    if (!user) {
      toast.error('Sign in to save jobs');
      return;
    }
    saveMutation.mutate(jobId);
  }

  const displayJobs = error ? sampleJobs : jobs;
  const showingPlaceholder = !!error;

  return (
    <section className="max-w-5xl mx-auto px-4 mt-10">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-navy flex items-center gap-2">
          <Briefcase className="w-6 h-6 text-orange" />
          Hiring Now
        </h2>
        {showingPlaceholder && (
          <span className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded">
            Sample listings
          </span>
        )}
      </div>

      {isLoading && (
        <div className="flex justify-center py-12">
          <Loader2 className="w-8 h-8 text-orange animate-spin" />
        </div>
      )}

      {!isLoading && error && (
        <div className="flex items-center gap-2 bg-amber-50 text-amber-700 px-4 py-3 rounded-lg mb-6 text-sm">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>
            Showing sample jobs. Connect your Supabase project to see live listings.
          </span>
        </div>
      )}

      {!isLoading && displayJobs && displayJobs.length > 0 && (
        <div className="grid gap-4 md:grid-cols-2">
          {displayJobs.map((job) => (
            <JobCard
              key={job.id}
              job={job}
              isSaved={savedJobIds.includes(job.id)}
              onToggleSave={handleToggleSave}
            />
          ))}
        </div>
      )}

      {!isLoading && !error && jobs && jobs.length === 0 && (
        <div className="text-center py-12 text-gray-400">
          <Briefcase className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p className="text-lg font-medium">No jobs found</p>
          <p className="text-sm mt-1">Try adjusting your filters</p>
        </div>
      )}
    </section>
  );
}
