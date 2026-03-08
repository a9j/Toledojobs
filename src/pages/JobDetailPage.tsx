import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  ArrowLeft, MapPin, Clock, Bookmark, Flame, Shield, Calendar,
  Briefcase, CheckCircle, Loader2, AlertCircle, Award, HardHat,
  Heart, Zap, Building2
} from 'lucide-react';
import { fetchJobById, fetchSavedJobs, saveJob, unsaveJob, applyToJob, fetchMyApplications } from '../lib/queries';
import { useAuth } from '../lib/auth';
import { getSampleJobById } from '../data/sampleJobs';
import JobTranslator from '../components/JobTranslator';
import ApplySummaryModal from '../components/ApplySummaryModal';
import TrainingPathCard from '../components/TrainingPathCard';
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

function buildProfileSummary(profile: any): string {
  const parts: string[] = [];
  if (profile?.full_name) parts.push(`Name: ${profile.full_name}`);
  if (profile?.zip_code) parts.push(`Location: ${profile.zip_code}`);
  if (profile?.role) parts.push(`Role: ${profile.role}`);
  return parts.length > 0 ? parts.join('\n') : 'Job seeker in Toledo, OH area';
}

export default function JobDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { user, profile } = useAuth();
  const queryClient = useQueryClient();
  const [showApplyModal, setShowApplyModal] = useState(false);

  const language = profile?.preferred_language === 'es' ? 'es' : undefined;

  const { data: fetchedJob, isLoading } = useQuery({
    queryKey: ['job', id],
    queryFn: () => fetchJobById(id!),
    enabled: !!id,
    retry: false,
  });

  const job = fetchedJob || (id ? getSampleJobById(id) : undefined);
  const usingSample = !fetchedJob && !!job;

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
    mutationFn: (summary: string) => {
      if (!user || !id) throw new Error('Must be signed in');
      return applyToJob(user.id, id, summary);
    },
    onSuccess: () => {
      toast.success('Application submitted!');
      queryClient.invalidateQueries({ queryKey: ['myApplications'] });
      setShowApplyModal(false);
    },
    onError: (err: Error) => toast.error(err.message),
  });

  if (isLoading && !job) {
    return (
      <div className="flex justify-center py-24">
        <Loader2 className="w-8 h-8 text-orange animate-spin" />
      </div>
    );
  }

  if (!job) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center">
        <AlertCircle className="w-12 h-12 text-gray-300 mx-auto mb-4" />
        <p className="text-lg text-gray-500">Job not found</p>
        <Link to="/jobs" className="text-orange hover:underline mt-2 inline-block">Back to jobs</Link>
      </div>
    );
  }

  const isTrades = !!job.trade_category;
  const profileSummary = buildProfileSummary(profile);

  const detailsGrid = [
    { label: 'Job Type', value: formatJobType(job.job_type), icon: <Briefcase className="w-4 h-4" /> },
    { label: 'Shift', value: formatShift(job.shift), icon: <Clock className="w-4 h-4" /> },
    { label: 'Location', value: job.neighborhood || job.zip_code || 'Toledo Area', icon: <MapPin className="w-4 h-4" /> },
    { label: 'Start Date', value: job.start_date ? new Date(job.start_date).toLocaleDateString() : 'ASAP', icon: <Calendar className="w-4 h-4" /> },
    { label: 'Benefits', value: job.has_benefits ? 'Yes' : 'No', icon: <Heart className="w-4 h-4" /> },
    { label: 'Overtime', value: job.overtime_available ? 'Available' : 'No', icon: <Zap className="w-4 h-4" /> },
    { label: 'Union', value: job.union_status === 'union' ? 'Union' : job.union_status === 'non_union' ? 'Non-Union' : 'Either', icon: <Shield className="w-4 h-4" /> },
    { label: 'Degree', value: job.is_degree_required ? 'Required' : 'Not Required', icon: <Award className="w-4 h-4" /> },
  ];

  function handleQuickApply() {
    if (!user) { toast.error('Sign in to apply'); return; }
    setShowApplyModal(true);
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 pb-24 md:pb-8">
      <Link to="/jobs" className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-navy mb-6 no-underline">
        <ArrowLeft className="w-4 h-4" /> Back to jobs
      </Link>

      {usingSample && (
        <div className="bg-amber-50 text-amber-700 px-4 py-2 rounded-lg mb-4 text-sm flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          Showing sample listing
        </div>
      )}

      <div className="bg-white rounded-xl border border-gray-200 p-6 md:p-8">
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm text-gray-500 flex items-center gap-1">
              <Building2 className="w-3.5 h-3.5" />
              {job.company?.company_name || 'Company'}
            </p>
            <div className="flex items-center gap-2 flex-wrap mt-1">
              <h1 className="text-2xl md:text-3xl font-bold text-navy">{job.title}</h1>
              {job.is_urgently_hiring && (
                <span className="inline-flex items-center gap-1 bg-red-50 text-red-600 text-xs font-semibold px-2 py-0.5 rounded-full">
                  <Flame className="w-3 h-3" /> Hiring Now
                </span>
              )}
            </div>
            <div className="mt-3">
              <span className="text-2xl md:text-3xl font-extrabold text-orange">
                {formatPay(job)}
              </span>
            </div>
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

        <p className="text-xs text-gray-400 mt-2">Posted {timeAgo(job.created_at)}</p>

        {/* Status Badges */}
        <div className="flex flex-wrap gap-2 mt-4">
          {!job.is_degree_required && <span className="text-xs bg-green-50 text-green-700 px-2.5 py-1 rounded-full">No Degree Required</span>}
          {job.is_spanish_friendly && <span className="text-xs bg-blue-50 text-blue-700 px-2.5 py-1 rounded-full">Spanish-Friendly</span>}
          {job.has_benefits && <span className="text-xs bg-purple-50 text-purple-700 px-2.5 py-1 rounded-full">Benefits</span>}
          {job.overtime_available && <span className="text-xs bg-navy/5 text-navy px-2.5 py-1 rounded-full">Overtime</span>}
          {job.prevailing_wage && <span className="text-xs bg-amber-50 text-amber-700 px-2.5 py-1 rounded-full">Prevailing Wage</span>}
          {isTrades && <span className="text-xs bg-amber-50 text-amber-700 px-2.5 py-1 rounded-full flex items-center gap-1"><HardHat className="w-3 h-3" /> {job.trade_category}</span>}
        </div>

        <hr className="my-6 border-gray-100" />

        {/* Key Details Grid */}
        <div>
          <h2 className="text-lg font-bold text-navy mb-3">Key Details</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {detailsGrid.map((detail) => (
              <div key={detail.label} className="bg-gray-50 rounded-lg p-3">
                <div className="flex items-center gap-1.5 text-gray-400 mb-1">
                  {detail.icon}
                  <span className="text-xs font-medium uppercase tracking-wide">{detail.label}</span>
                </div>
                <p className="text-sm font-semibold text-navy">{detail.value}</p>
              </div>
            ))}
          </div>
        </div>

        <hr className="my-6 border-gray-100" />

        {/* FEATURE 1: Job Translator — replaces the plain description */}
        <JobTranslator description={job.description} language={language} />

        {job.spanish_description && (
          <div className="mt-6 bg-blue-50 rounded-lg p-4">
            <h3 className="text-sm font-bold text-blue-700 mb-2">En Espa&ntilde;ol</h3>
            <p className="text-blue-800 text-sm whitespace-pre-wrap">{job.spanish_description}</p>
          </div>
        )}

        {/* Requirements */}
        {job.requirements && (
          <>
            <hr className="my-6 border-gray-100" />
            <div>
              <h2 className="text-lg font-bold text-navy mb-3">Requirements</h2>
              <p className="text-gray-700 whitespace-pre-wrap">{job.requirements}</p>
            </div>
          </>
        )}

        {job.certifications_required.length > 0 && (
          <div className="mt-4">
            <h3 className="text-sm font-semibold text-navy mb-2">Certifications Needed</h3>
            <div className="flex flex-wrap gap-2">
              {job.certifications_required.map((cert) => (
                <span key={cert} className="text-xs bg-gray-100 text-gray-700 px-2.5 py-1 rounded-full flex items-center gap-1">
                  <Award className="w-3 h-3" /> {cert}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* FEATURE 4: Training Path Recommender — shows below requirements when logged in */}
        {user && (job.requirements || job.certifications_required.length > 0 || job.is_degree_required) && (
          <TrainingPathCard
            job={job}
            profileSummary={profileSummary}
            language={language}
          />
        )}

        {/* Trades Section */}
        {isTrades && (
          <>
            <hr className="my-6 border-gray-100" />
            <div className="bg-gradient-to-br from-navy to-navy-light rounded-xl p-5 text-white">
              <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                <HardHat className="w-5 h-5 text-orange" /> Trades Details
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                <div>
                  <p className="text-xs text-white/50 uppercase tracking-wide">Trade</p>
                  <p className="font-semibold">{job.trade_category}</p>
                </div>
                {job.experience_level && (
                  <div>
                    <p className="text-xs text-white/50 uppercase tracking-wide">Level</p>
                    <p className="font-semibold capitalize">{job.experience_level}</p>
                  </div>
                )}
                <div>
                  <p className="text-xs text-white/50 uppercase tracking-wide">Union Status</p>
                  <p className="font-semibold capitalize">{job.union_status.replace(/_/g, ' ')}</p>
                </div>
                {job.project_duration && (
                  <div>
                    <p className="text-xs text-white/50 uppercase tracking-wide">Duration</p>
                    <p className="font-semibold">{job.project_duration}</p>
                  </div>
                )}
                <div>
                  <p className="text-xs text-white/50 uppercase tracking-wide">Per Diem</p>
                  <p className="font-semibold">{job.per_diem_included ? 'Included' : 'No'}</p>
                </div>
                <div>
                  <p className="text-xs text-white/50 uppercase tracking-wide">Prevailing Wage</p>
                  <p className="font-semibold">{job.prevailing_wage ? 'Yes' : 'No'}</p>
                </div>
              </div>
              {job.certifications_required.length > 0 && (
                <div className="mt-4">
                  <p className="text-xs text-white/50 uppercase tracking-wide mb-1.5">Required Certs</p>
                  <div className="flex flex-wrap gap-1.5">
                    {job.certifications_required.map((cert) => (
                      <span key={cert} className="text-xs bg-white/15 text-white px-2 py-0.5 rounded-full">
                        {cert}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </>
        )}

        <hr className="my-6 border-gray-100" />

        {/* Apply Section - Desktop */}
        <div className="hidden md:block">
          {alreadyApplied ? (
            <div className="flex items-center gap-2 bg-green-50 text-green-700 px-4 py-3 rounded-lg">
              <CheckCircle className="w-5 h-5" />
              <span className="font-medium">You've applied to this job</span>
            </div>
          ) : (
            <button
              onClick={handleQuickApply}
              className="w-full bg-orange hover:bg-orange-dark text-white py-3 rounded-lg font-semibold text-lg transition-colors cursor-pointer border-none"
            >
              Quick Apply
            </button>
          )}
        </div>
      </div>

      {/* Mobile Fixed Apply Button */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 md:hidden z-50">
        {alreadyApplied ? (
          <div className="flex items-center justify-center gap-2 text-green-700 py-2">
            <CheckCircle className="w-5 h-5" />
            <span className="font-medium">Already Applied</span>
          </div>
        ) : (
          <button
            onClick={handleQuickApply}
            disabled={applyMutation.isPending}
            className="w-full bg-orange hover:bg-orange-dark text-white py-3.5 rounded-xl font-semibold text-lg transition-colors cursor-pointer border-none disabled:opacity-50"
          >
            Quick Apply
          </button>
        )}
      </div>

      {/* FEATURE 3: Apply Summary Modal */}
      {showApplyModal && (
        <ApplySummaryModal
          job={job}
          profileSummary={profileSummary}
          onSubmit={(summary) => applyMutation.mutate(summary)}
          onClose={() => setShowApplyModal(false)}
          isSubmitting={applyMutation.isPending}
          language={language}
        />
      )}
    </div>
  );
}
