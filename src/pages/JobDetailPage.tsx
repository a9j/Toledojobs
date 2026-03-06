import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  ArrowLeft, MapPin, Clock, DollarSign, Bookmark, Flame, Shield,
  Briefcase, CheckCircle, Loader2, AlertCircle
} from 'lucide-react';
import { fetchJobById, fetchSavedJobs, saveJob, unsaveJob, applyToJob, fetchMyApplications } from '../lib/queries';
import { useAuth } from '../lib/auth';
import toast from 'react-hot-toast';

function formatPay(job: any): string {
  if (!job.pay_min && !job.pay_max) return 'Pay not listed';
  const type = job.pay_type === 'hourly' ? '/hr' : job.pay_type === 'salary' ? '/yr' : '';
  if (job.pay_min && job.pay_max) return `$${job.pay_min}–$${job.pay_max}${type}`;
  return `$${job.pay_min || job.pay_max}${type}`;
}

function formatJobType(type: string): string {
  return type.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}

function formatShift(shift: string): string {
  const map: Record<string, string> = {
    first: '1st Shift', second: '2nd Shift', third: '3rd Shift',
    flexible: 'Flexible', weekends: 'Weekends', rotating: 'Rotating',
  };
  return map[shift] || shift;
}

export default function JobDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [summary, setSummary] = useState('');
  const [showApplyForm, setShowApplyForm] = useState(false);

  const { data: job, isLoading, error } = useQuery({
    queryKey: ['job', id],
    queryFn: () => fetchJobById(id!),
    enabled: !!id,
  });

  const { data: savedJobIds = [] } = useQuery({
    queryKey: ['savedJobs', user?.id],
    queryFn: () => fetchSavedJobs(user!.id),
    enabled: !!user,
  });

  const { data: myApps = [] } = useQuery({
    queryKey: ['myApplications', user?.id],
    queryFn: () => fetchMyApplications(user!.id),
    enabled: !!user,
  });

  const isSaved = id ? savedJobIds.includes(id) : false;
  const alreadyApplied = myApps.some((a) => a.job_id === id);

  const saveMutation = useMutation({
    mutationFn: () => {
      if (!user || !id) throw new Error('Must be signed in');
      return isSaved ? unsaveJob(user.id, id) : saveJob(user.id, id);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['savedJobs'] }),
    onError: (err: Error) => toast.error(err.message),
  });

  const applyMutation = useMutation({
    mutationFn: () => {
      if (!user || !id) throw new Error('Must be signed in');
      return applyToJob(user.id, id, summary);
    },
    onSuccess: () => {
      toast.success('Application submitted!');
      queryClient.invalidateQueries({ queryKey: ['myApplications'] });
      setShowApplyForm(false);
    },
    onError: (err: Error) => toast.error(err.message),
  });

  if (isLoading) {
    return (
      <div className="flex justify-center py-24">
        <Loader2 className="w-8 h-8 text-orange animate-spin" />
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center">
        <AlertCircle className="w-12 h-12 text-gray-300 mx-auto mb-4" />
        <p className="text-lg text-gray-500">Job not found</p>
        <Link to="/" className="text-orange hover:underline mt-2 inline-block">Back to jobs</Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <Link to="/" className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-navy mb-6 no-underline">
        <ArrowLeft className="w-4 h-4" /> Back to jobs
      </Link>

      <div className="bg-white rounded-xl border border-gray-200 p-6 md:p-8">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-2xl md:text-3xl font-bold text-navy">{job.title}</h1>
              {job.is_urgently_hiring && (
                <span className="inline-flex items-center gap-1 bg-red-50 text-red-600 text-xs font-semibold px-2 py-0.5 rounded-full">
                  <Flame className="w-3 h-3" /> Urgent
                </span>
              )}
            </div>
            <p className="text-gray-500 mt-1">{job.company?.company_name || 'Company'}</p>
          </div>
          <button
            onClick={() => {
              if (!user) { toast.error('Sign in to save jobs'); return; }
              saveMutation.mutate();
            }}
            className={`shrink-0 bg-transparent border-none cursor-pointer p-2 ${isSaved ? 'text-orange' : 'text-gray-300 hover:text-orange'}`}
          >
            <Bookmark className={`w-6 h-6 ${isSaved ? 'fill-orange' : ''}`} />
          </button>
        </div>

        <div className="flex flex-wrap gap-3 mt-5">
          <span className="inline-flex items-center gap-1.5 text-sm bg-navy/5 text-navy px-3 py-1.5 rounded-full">
            <DollarSign className="w-4 h-4" /> {formatPay(job)}
          </span>
          <span className="inline-flex items-center gap-1.5 text-sm bg-navy/5 text-navy px-3 py-1.5 rounded-full">
            <Clock className="w-4 h-4" /> {formatJobType(job.job_type)} &middot; {formatShift(job.shift)}
          </span>
          {job.zip_code && (
            <span className="inline-flex items-center gap-1.5 text-sm bg-navy/5 text-navy px-3 py-1.5 rounded-full">
              <MapPin className="w-4 h-4" /> {job.neighborhood || job.zip_code}
            </span>
          )}
        </div>

        <div className="flex flex-wrap gap-2 mt-4">
          {!job.is_degree_required && <span className="text-xs bg-green-50 text-green-700 px-2.5 py-1 rounded-full">No Degree Required</span>}
          {job.is_spanish_friendly && <span className="text-xs bg-blue-50 text-blue-700 px-2.5 py-1 rounded-full">Spanish-Friendly</span>}
          {job.has_benefits && <span className="text-xs bg-purple-50 text-purple-700 px-2.5 py-1 rounded-full">Benefits</span>}
          {job.trade_category && <span className="text-xs bg-amber-50 text-amber-700 px-2.5 py-1 rounded-full">{job.trade_category}</span>}
          {job.overtime_available && <span className="text-xs bg-navy/5 text-navy px-2.5 py-1 rounded-full">Overtime Available</span>}
          {job.prevailing_wage && <span className="text-xs bg-navy/5 text-navy px-2.5 py-1 rounded-full">Prevailing Wage</span>}
          {job.union_status === 'union' && <span className="text-xs bg-navy/5 text-navy px-2.5 py-1 rounded-full flex items-center gap-1"><Shield className="w-3 h-3" /> Union</span>}
        </div>

        <hr className="my-6 border-gray-100" />

        <div>
          <h2 className="text-lg font-bold text-navy mb-3">About this role</h2>
          <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">{job.description}</p>
        </div>

        {job.spanish_description && (
          <div className="mt-6 bg-blue-50 rounded-lg p-4">
            <h3 className="text-sm font-bold text-blue-700 mb-2">En Espa&ntilde;ol</h3>
            <p className="text-blue-800 text-sm whitespace-pre-wrap">{job.spanish_description}</p>
          </div>
        )}

        {job.requirements && (
          <div className="mt-6">
            <h2 className="text-lg font-bold text-navy mb-3">Requirements</h2>
            <p className="text-gray-700 whitespace-pre-wrap">{job.requirements}</p>
          </div>
        )}

        {job.certifications_required.length > 0 && (
          <div className="mt-4">
            <h3 className="text-sm font-semibold text-navy mb-2">Certifications Needed</h3>
            <div className="flex flex-wrap gap-2">
              {job.certifications_required.map((cert) => (
                <span key={cert} className="text-xs bg-gray-100 text-gray-700 px-2.5 py-1 rounded-full">{cert}</span>
              ))}
            </div>
          </div>
        )}

        <hr className="my-6 border-gray-100" />

        {alreadyApplied ? (
          <div className="flex items-center gap-2 bg-green-50 text-green-700 px-4 py-3 rounded-lg">
            <CheckCircle className="w-5 h-5" />
            <span className="font-medium">You've applied to this job</span>
          </div>
        ) : showApplyForm ? (
          <div className="bg-gray-50 rounded-xl p-5">
            <h3 className="text-lg font-bold text-navy mb-3 flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-orange" /> Apply Now
            </h3>
            <label className="block text-sm font-medium text-navy mb-1">
              Brief summary about yourself (optional)
            </label>
            <textarea
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              rows={4}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-navy outline-none focus:border-orange transition-colors resize-none"
              placeholder="Tell the employer a bit about your experience..."
            />
            <div className="flex gap-3 mt-4">
              <button
                onClick={() => applyMutation.mutate()}
                disabled={applyMutation.isPending}
                className="bg-orange hover:bg-orange-dark text-white px-6 py-2.5 rounded-lg font-semibold transition-colors cursor-pointer border-none disabled:opacity-50"
              >
                {applyMutation.isPending ? 'Submitting...' : 'Submit Application'}
              </button>
              <button
                onClick={() => setShowApplyForm(false)}
                className="text-gray-500 hover:text-navy px-4 py-2.5 rounded-lg font-medium transition-colors cursor-pointer border border-gray-300 bg-white"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => {
              if (!user) { toast.error('Sign in to apply'); return; }
              setShowApplyForm(true);
            }}
            className="w-full bg-orange hover:bg-orange-dark text-white py-3 rounded-lg font-semibold text-lg transition-colors cursor-pointer border-none"
          >
            Apply Now
          </button>
        )}
      </div>
    </div>
  );
}
