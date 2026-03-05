import { Link, useNavigate } from 'react-router-dom';
import { Plus, Briefcase, Eye, Users, Pencil, XCircle, Building2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useEmployerJobs } from '../../hooks/useJobs';
import { useCompany } from '../../hooks/useCompany';
import { formatPay, timeAgo } from '../../lib/utils';
import Card from '../ui/Card';
import Badge from '../ui/Badge';
import Button from '../ui/Button';

export default function EmployerDashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { data: company, isLoading: companyLoading } = useCompany(user?.id);
  const { data: jobs, isLoading: jobsLoading } = useEmployerJobs(company?.id);

  const isLoading = companyLoading || jobsLoading;

  const activeJobs = jobs?.filter((j) => j.status === 'active') ?? [];
  const totalViews = jobs?.reduce((sum, j) => sum + j.views_count, 0) ?? 0;
  const totalApplications = 0; // Aggregate comes from individual job queries

  if (isLoading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-10">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/3" />
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-28 bg-gray-200 rounded-xl" />
            ))}
          </div>
          <div className="h-64 bg-gray-200 rounded-xl" />
        </div>
      </div>
    );
  }

  if (!company) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <Building2 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-navy mb-2">Set Up Your Company</h2>
        <p className="text-gray-600 mb-6">
          Create your company profile before posting jobs on Toledo Works.
        </p>
        <Button onClick={() => navigate('/employer/company')}>
          Create Company Profile
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-navy">{company.company_name}</h1>
          <p className="text-gray-600 text-sm mt-1">Employer Dashboard</p>
        </div>
        <Button onClick={() => navigate('/employer/post-job')}>
          <Plus className="w-4 h-4 mr-2" />
          Post a Job
        </Button>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <Card className="flex items-center gap-4">
          <div className="p-3 bg-orange/10 rounded-xl">
            <Briefcase className="w-6 h-6 text-orange" />
          </div>
          <div>
            <p className="text-2xl font-bold text-navy">{activeJobs.length}</p>
            <p className="text-sm text-gray-500">Active Listings</p>
          </div>
        </Card>
        <Card className="flex items-center gap-4">
          <div className="p-3 bg-navy/10 rounded-xl">
            <Eye className="w-6 h-6 text-navy" />
          </div>
          <div>
            <p className="text-2xl font-bold text-navy">{totalViews}</p>
            <p className="text-sm text-gray-500">Total Views</p>
          </div>
        </Card>
        <Card className="flex items-center gap-4">
          <div className="p-3 bg-green/10 rounded-xl">
            <Users className="w-6 h-6 text-green" />
          </div>
          <div>
            <p className="text-2xl font-bold text-navy">{totalApplications}</p>
            <p className="text-sm text-gray-500">Total Applications</p>
          </div>
        </Card>
      </div>

      {/* Job Listings */}
      <div className="space-y-3">
        <h2 className="text-lg font-bold text-navy">Your Job Listings</h2>

        {!jobs || jobs.length === 0 ? (
          <Card className="py-12 text-center">
            <Briefcase className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-gray-700 mb-1">No jobs posted yet</h3>
            <p className="text-gray-500 text-sm mb-4">
              Post your first job listing and start reaching candidates in Toledo.
            </p>
            <Button size="sm" onClick={() => navigate('/employer/post-job')}>
              <Plus className="w-4 h-4 mr-2" />
              Post a Job
            </Button>
          </Card>
        ) : (
          <div className="space-y-3">
            {jobs.map((job) => (
              <Card key={job.id} className="flex flex-col sm:flex-row sm:items-center gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <Link
                      to={`/jobs/${job.id}`}
                      className="text-base font-bold text-navy hover:text-orange transition-colors truncate"
                    >
                      {job.title}
                    </Link>
                    <StatusBadge status={job.status} />
                  </div>
                  <div className="flex flex-wrap items-center gap-4 mt-1 text-sm text-gray-500">
                    <span>{formatPay(job.pay_min, job.pay_max, job.pay_type)}</span>
                    <span className="inline-flex items-center gap-1">
                      <Eye className="w-3.5 h-3.5" />
                      {job.views_count} views
                    </span>
                    <span>Posted {timeAgo(job.created_at)}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => navigate(`/employer/jobs/${job.id}/applications`)}
                  >
                    <Users className="w-4 h-4 mr-1" />
                    Applications
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => navigate(`/employer/jobs/${job.id}/edit`)}
                  >
                    <Pencil className="w-4 h-4" />
                  </Button>
                  {job.status === 'active' && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => navigate(`/employer/jobs/${job.id}/close`)}
                    >
                      <XCircle className="w-4 h-4 text-red" />
                    </Button>
                  )}
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  switch (status) {
    case 'active':
      return <Badge variant="green">Active</Badge>;
    case 'closed':
      return <Badge variant="gray">Closed</Badge>;
    case 'draft':
      return <Badge variant="yellow">Draft</Badge>;
    default:
      return <Badge variant="gray">{status}</Badge>;
  }
}
