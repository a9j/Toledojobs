import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Navigate } from 'react-router-dom';
import {
  Building2, Plus, Briefcase, Users, Loader2, Trash2, Edit3,
  ChevronDown, ChevronUp, X
} from 'lucide-react';
import { useAuth } from '../lib/auth';
import {
  fetchMyCompany, createCompany, updateCompany,
  fetchCompanyJobs, createJob, updateJob, deleteJob,
  fetchApplicationsForJob, updateApplicationStatus
} from '../lib/queries';
import type { Job, Company } from '../types/database';
import toast from 'react-hot-toast';

type Tab = 'jobs' | 'company';

export default function EmployerDashboard() {
  const { user, profile, loading } = useAuth();
  const queryClient = useQueryClient();
  const [tab, setTab] = useState<Tab>('jobs');
  const [showJobForm, setShowJobForm] = useState(false);
  const [editingJob, setEditingJob] = useState<Job | null>(null);
  const [expandedJob, setExpandedJob] = useState<string | null>(null);

  const { data: company, isLoading: companyLoading } = useQuery({
    queryKey: ['myCompany', user?.id],
    queryFn: () => fetchMyCompany(user!.id),
    enabled: !!user,
  });

  const { data: jobs = [], isLoading: jobsLoading } = useQuery({
    queryKey: ['companyJobs', company?.id],
    queryFn: () => fetchCompanyJobs(company!.id),
    enabled: !!company,
  });

  if (loading) return <div className="flex justify-center py-24"><Loader2 className="w-8 h-8 text-orange animate-spin" /></div>;
  if (!user) return <Navigate to="/" replace />;
  if (profile?.role !== 'employer') return <Navigate to="/dashboard" replace />;

  if (companyLoading) return <div className="flex justify-center py-24"><Loader2 className="w-8 h-8 text-orange animate-spin" /></div>;

  if (!company) {
    return <CompanySetup userId={user.id} />;
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-navy flex items-center gap-2">
          <Building2 className="w-6 h-6 text-orange" /> {company.company_name}
        </h1>
      </div>

      <div className="flex gap-1 bg-gray-100 rounded-lg p-1 mb-8 max-w-md">
        <button
          onClick={() => setTab('jobs')}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-medium rounded-md transition-colors cursor-pointer border-none ${
            tab === 'jobs' ? 'bg-white text-navy shadow-sm' : 'text-gray-500 bg-transparent'
          }`}
        >
          <Briefcase className="w-4 h-4" /> Jobs
        </button>
        <button
          onClick={() => setTab('company')}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-medium rounded-md transition-colors cursor-pointer border-none ${
            tab === 'company' ? 'bg-white text-navy shadow-sm' : 'text-gray-500 bg-transparent'
          }`}
        >
          <Building2 className="w-4 h-4" /> Company
        </button>
      </div>

      {tab === 'jobs' && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-navy">Your Job Listings</h2>
            <button
              onClick={() => { setEditingJob(null); setShowJobForm(true); }}
              className="bg-orange hover:bg-orange-dark text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors cursor-pointer border-none flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" /> Post Job
            </button>
          </div>

          {showJobForm && (
            <JobForm
              companyId={company.id}
              job={editingJob}
              onClose={() => { setShowJobForm(false); setEditingJob(null); }}
            />
          )}

          {jobsLoading ? (
            <div className="flex justify-center py-12"><Loader2 className="w-6 h-6 text-orange animate-spin" /></div>
          ) : jobs.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              <Briefcase className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p className="text-lg font-medium">No jobs posted yet</p>
              <p className="text-sm mt-1">Post your first job to start hiring</p>
            </div>
          ) : (
            <div className="space-y-4">
              {jobs.map((job) => (
                <EmployerJobCard
                  key={job.id}
                  job={job}
                  expanded={expandedJob === job.id}
                  onToggleExpand={() => setExpandedJob(expandedJob === job.id ? null : job.id)}
                  onEdit={() => { setEditingJob(job); setShowJobForm(true); }}
                  onDelete={() => {
                    if (confirm('Delete this job listing?')) {
                      deleteJob(job.id).then(() => {
                        queryClient.invalidateQueries({ queryKey: ['companyJobs'] });
                        toast.success('Job deleted');
                      });
                    }
                  }}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {tab === 'company' && (
        <CompanyEditor company={company} />
      )}
    </div>
  );
}

function CompanySetup({ userId }: { userId: string }) {
  const queryClient = useQueryClient();
  const [name, setName] = useState('');
  const [industry, setIndustry] = useState('');
  const [description, setDescription] = useState('');
  const [phone, setPhone] = useState('');
  const [zipCode, setZipCode] = useState('');

  const mutation = useMutation({
    mutationFn: () => createCompany(userId, {
      company_name: name, industry, description, phone, zip_code: zipCode,
    } as any),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myCompany'] });
      toast.success('Company created!');
    },
    onError: (err: Error) => toast.error(err.message),
  });

  return (
    <div className="max-w-lg mx-auto px-4 py-16">
      <div className="text-center mb-8">
        <Building2 className="w-12 h-12 text-orange mx-auto mb-3" />
        <h1 className="text-2xl font-bold text-navy">Set Up Your Company</h1>
        <p className="text-gray-500 mt-1">Create your company profile to start posting jobs</p>
      </div>
      <form onSubmit={(e) => { e.preventDefault(); mutation.mutate(); }} className="bg-white rounded-xl border border-gray-200 p-6 flex flex-col gap-4">
        <div>
          <label className="block text-sm font-medium text-navy mb-1">Company Name *</label>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} required
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-navy outline-none focus:border-orange" />
        </div>
        <div>
          <label className="block text-sm font-medium text-navy mb-1">Industry</label>
          <input type="text" value={industry} onChange={(e) => setIndustry(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-navy outline-none focus:border-orange"
            placeholder="e.g. Manufacturing, Healthcare, Logistics" />
        </div>
        <div>
          <label className="block text-sm font-medium text-navy mb-1">Description</label>
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-navy outline-none focus:border-orange resize-none" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-navy mb-1">Phone</label>
            <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-navy outline-none focus:border-orange" />
          </div>
          <div>
            <label className="block text-sm font-medium text-navy mb-1">Zip Code</label>
            <input type="text" value={zipCode} onChange={(e) => setZipCode(e.target.value)} maxLength={5}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-navy outline-none focus:border-orange" />
          </div>
        </div>
        <button type="submit" disabled={mutation.isPending}
          className="bg-orange hover:bg-orange-dark text-white py-3 rounded-lg font-semibold cursor-pointer border-none disabled:opacity-50">
          {mutation.isPending ? 'Creating...' : 'Create Company'}
        </button>
      </form>
    </div>
  );
}

function CompanyEditor({ company }: { company: Company }) {
  const queryClient = useQueryClient();
  const [name, setName] = useState(company.company_name);
  const [industry, setIndustry] = useState(company.industry || '');
  const [description, setDescription] = useState(company.description || '');
  const [phone, setPhone] = useState(company.phone || '');
  const [zipCode, setZipCode] = useState(company.zip_code || '');
  const [website, setWebsite] = useState(company.website || '');

  const mutation = useMutation({
    mutationFn: () => updateCompany(company.id, {
      company_name: name, industry, description, phone, zip_code: zipCode, website,
    } as any),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myCompany'] });
      toast.success('Company updated');
    },
    onError: (err: Error) => toast.error(err.message),
  });

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 max-w-lg">
      <h2 className="text-lg font-bold text-navy mb-4">Company Settings</h2>
      <form onSubmit={(e) => { e.preventDefault(); mutation.mutate(); }} className="flex flex-col gap-4">
        <div>
          <label className="block text-sm font-medium text-navy mb-1">Company Name</label>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} required
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-navy outline-none focus:border-orange" />
        </div>
        <div>
          <label className="block text-sm font-medium text-navy mb-1">Industry</label>
          <input type="text" value={industry} onChange={(e) => setIndustry(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-navy outline-none focus:border-orange" />
        </div>
        <div>
          <label className="block text-sm font-medium text-navy mb-1">Description</label>
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-navy outline-none focus:border-orange resize-none" />
        </div>
        <div>
          <label className="block text-sm font-medium text-navy mb-1">Website</label>
          <input type="url" value={website} onChange={(e) => setWebsite(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-navy outline-none focus:border-orange"
            placeholder="https://yourcompany.com" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-navy mb-1">Phone</label>
            <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-navy outline-none focus:border-orange" />
          </div>
          <div>
            <label className="block text-sm font-medium text-navy mb-1">Zip Code</label>
            <input type="text" value={zipCode} onChange={(e) => setZipCode(e.target.value)} maxLength={5}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-navy outline-none focus:border-orange" />
          </div>
        </div>
        <button type="submit" disabled={mutation.isPending}
          className="bg-orange hover:bg-orange-dark text-white py-2.5 rounded-lg font-semibold cursor-pointer border-none disabled:opacity-50">
          {mutation.isPending ? 'Saving...' : 'Save Changes'}
        </button>
      </form>
    </div>
  );
}

function JobForm({ companyId, job, onClose }: { companyId: string; job: Job | null; onClose: () => void }) {
  const queryClient = useQueryClient();
  const [title, setTitle] = useState(job?.title || '');
  const [description, setDescription] = useState(job?.description || '');
  const [spanishDesc, setSpanishDesc] = useState(job?.spanish_description || '');
  const [payMin, setPayMin] = useState(job?.pay_min?.toString() || '');
  const [payMax, setPayMax] = useState(job?.pay_max?.toString() || '');
  const [payType, setPayType] = useState(job?.pay_type || 'hourly');
  const [jobType, setJobType] = useState(job?.job_type || 'full_time');
  const [shift, setShift] = useState(job?.shift || 'first');
  const [category, setCategory] = useState(job?.category || '');
  const [tradeCategory, setTradeCategory] = useState(job?.trade_category || '');
  const [neighborhood, setNeighborhood] = useState(job?.neighborhood || '');
  const [zipCode, setZipCode] = useState(job?.zip_code || '');
  const [requirements, setRequirements] = useState(job?.requirements || '');
  const [isDegreeRequired, setIsDegreeRequired] = useState(job?.is_degree_required || false);
  const [isSpanishFriendly, setIsSpanishFriendly] = useState(job?.is_spanish_friendly || false);
  const [isUrgentlyHiring, setIsUrgentlyHiring] = useState(job?.is_urgently_hiring || false);
  const [hasBenefits, setHasBenefits] = useState(job?.has_benefits || false);
  const [overtimeAvailable, setOvertimeAvailable] = useState(job?.overtime_available || false);
  const [status, setStatus] = useState(job?.status || 'active');

  const mutation = useMutation({
    mutationFn: () => {
      const data: any = {
        company_id: companyId, title, description,
        spanish_description: spanishDesc || null,
        pay_min: payMin ? Number(payMin) : null,
        pay_max: payMax ? Number(payMax) : null,
        pay_type: payType, job_type: jobType, shift,
        category: category || null,
        trade_category: tradeCategory || null,
        neighborhood: neighborhood || null,
        zip_code: zipCode || null,
        requirements: requirements || null,
        is_degree_required: isDegreeRequired,
        is_spanish_friendly: isSpanishFriendly,
        is_urgently_hiring: isUrgentlyHiring,
        has_benefits: hasBenefits,
        overtime_available: overtimeAvailable,
        status,
      };
      return job ? updateJob(job.id, data) : createJob(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['companyJobs'] });
      toast.success(job ? 'Job updated' : 'Job posted!');
      onClose();
    },
    onError: (err: Error) => toast.error(err.message),
  });

  return (
    <div className="bg-white rounded-xl border-2 border-orange/20 p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-navy">{job ? 'Edit Job' : 'Post a New Job'}</h3>
        <button onClick={onClose} className="text-gray-400 hover:text-navy bg-transparent border-none cursor-pointer">
          <X className="w-5 h-5" />
        </button>
      </div>
      <form onSubmit={(e) => { e.preventDefault(); mutation.mutate(); }} className="grid gap-4 md:grid-cols-2">
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-navy mb-1">Job Title *</label>
          <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-navy outline-none focus:border-orange"
            placeholder="e.g. Warehouse Associate" />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-navy mb-1">Description *</label>
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} required rows={4}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-navy outline-none focus:border-orange resize-none" />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-navy mb-1">Spanish Description</label>
          <textarea value={spanishDesc} onChange={(e) => setSpanishDesc(e.target.value)} rows={3}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-navy outline-none focus:border-orange resize-none" />
        </div>
        <div>
          <label className="block text-sm font-medium text-navy mb-1">Pay Min</label>
          <input type="number" value={payMin} onChange={(e) => setPayMin(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-navy outline-none focus:border-orange" />
        </div>
        <div>
          <label className="block text-sm font-medium text-navy mb-1">Pay Max</label>
          <input type="number" value={payMax} onChange={(e) => setPayMax(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-navy outline-none focus:border-orange" />
        </div>
        <div>
          <label className="block text-sm font-medium text-navy mb-1">Pay Type</label>
          <select value={payType} onChange={(e) => setPayType(e.target.value as any)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-navy outline-none focus:border-orange bg-white">
            <option value="hourly">Hourly</option>
            <option value="salary">Salary</option>
            <option value="per_diem">Per Diem</option>
            <option value="commission">Commission</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-navy mb-1">Job Type</label>
          <select value={jobType} onChange={(e) => setJobType(e.target.value as any)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-navy outline-none focus:border-orange bg-white">
            <option value="full_time">Full Time</option>
            <option value="part_time">Part Time</option>
            <option value="contract">Contract</option>
            <option value="temp">Temp</option>
            <option value="seasonal">Seasonal</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-navy mb-1">Shift</label>
          <select value={shift} onChange={(e) => setShift(e.target.value as any)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-navy outline-none focus:border-orange bg-white">
            <option value="first">1st Shift</option>
            <option value="second">2nd Shift</option>
            <option value="third">3rd Shift</option>
            <option value="flexible">Flexible</option>
            <option value="weekends">Weekends</option>
            <option value="rotating">Rotating</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-navy mb-1">Category</label>
          <select value={category} onChange={(e) => setCategory(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-navy outline-none focus:border-orange bg-white">
            <option value="">None</option>
            <option value="Warehouse">Warehouse</option>
            <option value="Healthcare">Healthcare</option>
            <option value="Restaurant/Service">Restaurant/Service</option>
            <option value="Manufacturing">Manufacturing</option>
            <option value="Construction">Construction</option>
            <option value="Other">Other</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-navy mb-1">Trade Category</label>
          <input type="text" value={tradeCategory} onChange={(e) => setTradeCategory(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-navy outline-none focus:border-orange"
            placeholder="e.g. Electrical, Plumbing" />
        </div>
        <div>
          <label className="block text-sm font-medium text-navy mb-1">Neighborhood</label>
          <input type="text" value={neighborhood} onChange={(e) => setNeighborhood(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-navy outline-none focus:border-orange"
            placeholder="e.g. East Toledo" />
        </div>
        <div>
          <label className="block text-sm font-medium text-navy mb-1">Zip Code</label>
          <input type="text" value={zipCode} onChange={(e) => setZipCode(e.target.value)} maxLength={5}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-navy outline-none focus:border-orange" />
        </div>
        <div>
          <label className="block text-sm font-medium text-navy mb-1">Status</label>
          <select value={status} onChange={(e) => setStatus(e.target.value as any)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-navy outline-none focus:border-orange bg-white">
            <option value="active">Active</option>
            <option value="draft">Draft</option>
            <option value="closed">Closed</option>
          </select>
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-navy mb-1">Requirements</label>
          <textarea value={requirements} onChange={(e) => setRequirements(e.target.value)} rows={2}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-navy outline-none focus:border-orange resize-none" />
        </div>
        <div className="md:col-span-2 flex flex-wrap gap-4">
          {[
            { label: 'Degree Required', checked: isDegreeRequired, set: setIsDegreeRequired },
            { label: 'Spanish-Friendly', checked: isSpanishFriendly, set: setIsSpanishFriendly },
            { label: 'Urgently Hiring', checked: isUrgentlyHiring, set: setIsUrgentlyHiring },
            { label: 'Benefits', checked: hasBenefits, set: setHasBenefits },
            { label: 'Overtime', checked: overtimeAvailable, set: setOvertimeAvailable },
          ].map(({ label, checked, set }) => (
            <label key={label} className="flex items-center gap-2 text-sm text-navy cursor-pointer">
              <input type="checkbox" checked={checked} onChange={(e) => set(e.target.checked)}
                className="accent-orange w-4 h-4" />
              {label}
            </label>
          ))}
        </div>
        <div className="md:col-span-2 flex gap-3">
          <button type="submit" disabled={mutation.isPending}
            className="bg-orange hover:bg-orange-dark text-white px-6 py-2.5 rounded-lg font-semibold cursor-pointer border-none disabled:opacity-50">
            {mutation.isPending ? 'Saving...' : job ? 'Update Job' : 'Post Job'}
          </button>
          <button type="button" onClick={onClose}
            className="text-gray-500 hover:text-navy px-4 py-2.5 rounded-lg font-medium cursor-pointer border border-gray-300 bg-white">
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

function EmployerJobCard({
  job, expanded, onToggleExpand, onEdit, onDelete,
}: {
  job: Job; expanded: boolean; onToggleExpand: () => void; onEdit: () => void; onDelete: () => void;
}) {
  const statusColor = job.status === 'active' ? 'bg-green-50 text-green-700' : job.status === 'draft' ? 'bg-gray-100 text-gray-600' : 'bg-red-50 text-red-600';

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <div className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-bold text-navy">{job.title}</h3>
              <span className={`text-xs font-semibold px-2 py-0.5 rounded-full capitalize ${statusColor}`}>{job.status}</span>
            </div>
            <p className="text-sm text-gray-500 mt-0.5">
              {job.neighborhood || job.zip_code || ''} &middot; {job.views_count} views
            </p>
          </div>
          <div className="flex items-center gap-1">
            <button onClick={onEdit} className="p-2 text-gray-400 hover:text-navy bg-transparent border-none cursor-pointer" title="Edit">
              <Edit3 className="w-4 h-4" />
            </button>
            <button onClick={onDelete} className="p-2 text-gray-400 hover:text-red-500 bg-transparent border-none cursor-pointer" title="Delete">
              <Trash2 className="w-4 h-4" />
            </button>
            <button onClick={onToggleExpand} className="p-2 text-gray-400 hover:text-navy bg-transparent border-none cursor-pointer" title="View applicants">
              <Users className="w-4 h-4" />
              {expanded ? <ChevronUp className="w-3 h-3 inline" /> : <ChevronDown className="w-3 h-3 inline" />}
            </button>
          </div>
        </div>
      </div>

      {expanded && <ApplicationsList jobId={job.id} />}
    </div>
  );
}

function ApplicationsList({ jobId }: { jobId: string }) {
  const queryClient = useQueryClient();
  const { data: apps = [], isLoading } = useQuery({
    queryKey: ['jobApplications', jobId],
    queryFn: () => fetchApplicationsForJob(jobId),
  });

  const statusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) => updateApplicationStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jobApplications', jobId] });
      toast.success('Status updated');
    },
  });

  if (isLoading) return <div className="px-5 pb-5"><Loader2 className="w-5 h-5 text-orange animate-spin" /></div>;

  if (apps.length === 0) {
    return <div className="px-5 pb-5 text-sm text-gray-400">No applicants yet</div>;
  }

  const statusColors: Record<string, string> = {
    applied: 'bg-blue-50 text-blue-700',
    reviewed: 'bg-yellow-50 text-yellow-700',
    interview: 'bg-purple-50 text-purple-700',
    hired: 'bg-green-50 text-green-700',
    rejected: 'bg-red-50 text-red-700',
  };

  return (
    <div className="border-t border-gray-100 px-5 pb-5 pt-4">
      <h4 className="text-sm font-semibold text-navy mb-3 flex items-center gap-1.5">
        <Users className="w-4 h-4 text-orange" /> Applicants ({apps.length})
      </h4>
      <div className="space-y-3">
        {apps.map((app) => (
          <div key={app.id} className="flex items-center justify-between gap-3 bg-gray-50 rounded-lg p-3">
            <div>
              <p className="text-sm font-medium text-navy">{(app as any).applicant?.full_name || (app as any).applicant?.email || 'Applicant'}</p>
              {app.candidate_summary && <p className="text-xs text-gray-500 mt-0.5">{app.candidate_summary}</p>}
              <p className="text-xs text-gray-400 mt-0.5">{new Date(app.applied_at).toLocaleDateString()}</p>
            </div>
            <select
              value={app.status}
              onChange={(e) => statusMutation.mutate({ id: app.id, status: e.target.value })}
              className={`text-xs font-semibold px-2.5 py-1.5 rounded-lg border-none cursor-pointer ${statusColors[app.status] || 'bg-gray-100'}`}
            >
              <option value="applied">Applied</option>
              <option value="reviewed">Reviewed</option>
              <option value="interview">Interview</option>
              <option value="hired">Hired</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        ))}
      </div>
    </div>
  );
}
