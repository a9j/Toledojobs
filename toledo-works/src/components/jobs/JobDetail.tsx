import { useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  MapPin,
  Clock,
  Briefcase,
  DollarSign,
  Award,
  ShieldCheck,
  Building2,
  Globe,
  Wrench,
  HardHat,
  CheckCircle2,
} from 'lucide-react';
import { useJob } from '../../hooks/useJobs';
import { useApplyToJob } from '../../hooks/useApplications';
import { useAuth } from '../../context/AuthContext';
import { formatPay, timeAgo } from '../../lib/utils';
import { SHIFT_LABELS } from '../../lib/constants';
import Badge from '../ui/Badge';
import Button from '../ui/Button';
import Skeleton from '../ui/Skeleton';

export default function JobDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: job, isLoading } = useJob(id);
  const { user, profile } = useAuth();
  const applyToJob = useApplyToJob();

  const handleApply = () => {
    if (!user || !profile) {
      navigate('/login');
      return;
    }
    if (!job) return;
    applyToJob.mutate({ jobId: job.id, applicantId: profile.id });
  };

  if (isLoading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-6 space-y-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-6 w-32" />
        <Skeleton className="h-10 w-56" />
        <Skeleton className="h-40 w-full" />
        <Skeleton className="h-40 w-full" />
      </div>
    );
  }

  if (!job) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center">
        <h2 className="text-xl font-bold text-gray-700">Job not found</h2>
        <p className="text-gray-500 mt-2">This listing may have been removed or expired.</p>
        <Button variant="outline" className="mt-6" onClick={() => navigate('/jobs')}>
          Browse Jobs
        </Button>
      </div>
    );
  }

  const isTradeJob = job.category === 'Construction/Trades';

  return (
    <>
      <div className="max-w-3xl mx-auto px-4 py-6 pb-28 sm:pb-6">
        {/* Back Button */}
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-navy transition-colors mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to jobs
        </button>

        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-2xl sm:text-3xl font-bold text-navy">{job.title}</h1>

          <p className="text-gray-600 flex items-center gap-1.5">
            <Building2 className="w-4 h-4" />
            {job.company?.company_name}
          </p>

          {/* Pay - Most Prominent */}
          <p className="text-3xl sm:text-4xl font-bold text-orange">
            {formatPay(job.pay_min, job.pay_max, job.pay_type)}
          </p>
        </div>

        {/* Status Badges */}
        <div className="flex flex-wrap gap-1.5 mt-4">
          {job.is_urgently_hiring && <Badge variant="red">Hiring Now</Badge>}
          {!job.is_degree_required && <Badge variant="green">No Degree</Badge>}
          {job.is_spanish_friendly && <Badge variant="navy">Spanish Friendly</Badge>}
          {job.has_benefits && <Badge variant="green">Benefits</Badge>}
          {job.company?.is_founding_employer && <Badge variant="yellow">Founding Employer</Badge>}
        </div>

        {/* Key Details Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-6 p-4 bg-gray-50 rounded-card">
          <DetailItem
            icon={<DollarSign className="w-5 h-5 text-orange" />}
            label="Pay"
            value={formatPay(job.pay_min, job.pay_max, job.pay_type)}
          />
          <DetailItem
            icon={<Briefcase className="w-5 h-5 text-navy" />}
            label="Type"
            value={job.job_type.replace('_', ' ')}
          />
          {job.shift && (
            <DetailItem
              icon={<Clock className="w-5 h-5 text-navy" />}
              label="Shift"
              value={SHIFT_LABELS[job.shift] || job.shift}
            />
          )}
          {(job.neighborhood || job.zip_code) && (
            <DetailItem
              icon={<MapPin className="w-5 h-5 text-navy" />}
              label="Location"
              value={job.neighborhood || job.zip_code || ''}
            />
          )}
          {job.experience_level && (
            <DetailItem
              icon={<Award className="w-5 h-5 text-navy" />}
              label="Experience"
              value={job.experience_level}
            />
          )}
        </div>

        {/* Description */}
        <section className="mt-8">
          <h2 className="text-lg font-bold text-navy mb-3">Description</h2>
          <div className="prose prose-sm max-w-none text-gray-700 whitespace-pre-line">
            {job.description}
          </div>
        </section>

        {/* Requirements */}
        {job.requirements && (
          <section className="mt-8">
            <h2 className="text-lg font-bold text-navy mb-3">Requirements</h2>
            <div className="prose prose-sm max-w-none text-gray-700 whitespace-pre-line">
              {job.requirements}
            </div>
          </section>
        )}

        {/* Certifications */}
        {job.certifications_required && job.certifications_required.length > 0 && (
          <section className="mt-8">
            <h2 className="text-lg font-bold text-navy mb-3">Certifications Required</h2>
            <div className="flex flex-wrap gap-2">
              {job.certifications_required.map((cert) => (
                <Badge key={cert} variant="orange">
                  <span className="flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    {cert}
                  </span>
                </Badge>
              ))}
            </div>
          </section>
        )}

        {/* Trade-Specific Info */}
        {isTradeJob && (
          <section className="mt-8 p-4 bg-navy/5 rounded-card border border-navy/10">
            <h2 className="text-lg font-bold text-navy mb-3 flex items-center gap-2">
              <HardHat className="w-5 h-5" />
              Trade Details
            </h2>
            <div className="grid grid-cols-2 gap-3">
              {job.trade_category && (
                <TradeItem label="Trade" value={job.trade_category} />
              )}
              {job.union_status && (
                <TradeItem
                  label="Union Status"
                  value={job.union_status.replace('_', ' ')}
                />
              )}
              <TradeItem
                label="Overtime"
                value={job.overtime_available ? 'Available' : 'Not listed'}
              />
              <TradeItem
                label="Per Diem"
                value={job.per_diem_included ? 'Included' : 'Not included'}
              />
              {job.prevailing_wage && (
                <TradeItem label="Prevailing Wage" value="Yes" />
              )}
              {job.project_duration && (
                <TradeItem label="Project Duration" value={job.project_duration} />
              )}
            </div>
          </section>
        )}

        {/* Company Info */}
        {job.company && (
          <section className="mt-8 p-4 border border-gray-200 rounded-card">
            <h2 className="text-lg font-bold text-navy mb-3">About the Company</h2>
            <div className="flex items-start gap-4">
              {job.company.logo_url ? (
                <img
                  src={job.company.logo_url}
                  alt={job.company.company_name}
                  className="w-14 h-14 rounded-card object-cover bg-gray-100"
                />
              ) : (
                <div className="w-14 h-14 rounded-card bg-gray-100 flex items-center justify-center">
                  <Building2 className="w-6 h-6 text-gray-400" />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-navy">{job.company.company_name}</h3>
                {job.company.industry && (
                  <p className="text-sm text-gray-500">{job.company.industry}</p>
                )}
                {job.company.description && (
                  <p className="text-sm text-gray-600 mt-2 line-clamp-3">
                    {job.company.description}
                  </p>
                )}
                {job.company.website && (
                  <a
                    href={job.company.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-sm text-orange hover:underline mt-2"
                  >
                    <Globe className="w-3.5 h-3.5" />
                    Website
                  </a>
                )}
              </div>
            </div>
          </section>
        )}

        {/* Posted Time & Views */}
        <p className="text-xs text-gray-400 mt-6">
          Posted {timeAgo(job.created_at)} &middot; {job.views_count} views
        </p>

        {/* Desktop Apply Button */}
        <div className="hidden sm:block mt-6">
          <Button
            size="lg"
            onClick={handleApply}
            loading={applyToJob.isPending}
            className="w-full sm:w-auto"
          >
            {applyToJob.isSuccess ? (
              <span className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5" />
                Applied
              </span>
            ) : (
              'Quick Apply'
            )}
          </Button>
        </div>
      </div>

      {/* Sticky Mobile Apply Button */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-200 sm:hidden z-50">
        <Button
          size="lg"
          onClick={handleApply}
          loading={applyToJob.isPending}
          className="w-full"
        >
          {applyToJob.isSuccess ? (
            <span className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5" />
              Applied
            </span>
          ) : (
            'Quick Apply'
          )}
        </Button>
      </div>
    </>
  );
}

function DetailItem({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-start gap-2">
      {icon}
      <div>
        <p className="text-xs text-gray-500 uppercase tracking-wide">{label}</p>
        <p className="text-sm font-semibold text-gray-900 capitalize">{value}</p>
      </div>
    </div>
  );
}

function TradeItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs text-gray-500">{label}</p>
      <p className="text-sm font-semibold text-navy capitalize">{value}</p>
    </div>
  );
}
