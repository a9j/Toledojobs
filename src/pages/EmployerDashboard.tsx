import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Navigate, Link } from 'react-router-dom';
import {
  Building2, Plus, Briefcase, Users, Loader2, Trash2, Edit3,
  Eye, FileText, Clock, ChevronDown, Copy, X,
  Mail, Phone, User, Star
} from 'lucide-react';
import { useAuth } from '../lib/auth';
import {
  fetchMyCompany, createCompany, updateCompany,
  fetchCompanyJobs, createJob, updateJob, deleteJob,
  fetchApplicationsForJob, updateApplicationStatus
} from '../lib/queries';
import { supabase } from '../lib/supabase';
import FoundingEmployerBadge from '../components/FoundingEmployerBadge';
import type { Job, Company } from '../types/database';
import toast from 'react-hot-toast';

export default function EmployerDashboard() {
  const { user, profile, loading } = useAuth();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<'jobs' | 'company'>('jobs');
  const [viewingAppsForJob, setViewingAppsForJob] = useState<Job | null>(null);

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

  // Fetch all application counts for stats
  const { data: allAppCounts = {} } = useQuery({
    queryKey: ['allAppCounts', company?.id],
    queryFn: async () => {
      if (!company) return {};
      const counts: Record<string, number> = {};
      for (const job of jobs) {
        const { count } = await supabase
          .from('applications')
          .select('*', { count: 'exact', head: true })
          .eq('job_id', job.id);
        counts[job.id] = count || 0;
      }
      return counts;
    },
    enabled: !!company && jobs.length > 0,
  });

  if (loading) return <div className="flex justify-center py-24"><Loader2 className="w-8 h-8 text-orange animate-spin" /></div>;
  if (!user) return <Navigate to="/login" replace />;
  if (profile?.role !== 'employer') return <Navigate to="/" replace />;
  if (companyLoading) return <div className="flex justify-center py-24"><Loader2 className="w-8 h-8 text-orange animate-spin" /></div>;

  if (!company) {
    return <CompanyOnboarding userId={user.id} />;
  }

  // Stats
  const activeJobs = jobs.filter((j) => j.status === 'active').length;
  const totalViews = jobs.reduce((sum, j) => sum + j.views_count, 0);
  const totalApps = Object.values(allAppCounts).reduce((sum, c) => sum + c, 0);

  const statusColor = (status: string) => {
    if (status === 'active') return 'bg-green-50 text-green-700';
    if (status === 'draft') return 'bg-gray-100 text-gray-600';
    return 'bg-red-50 text-red-600';
  };

  // Application viewer overlay
  if (viewingAppsForJob) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <button
          onClick={() => setViewingAppsForJob(null)}
          className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-navy mb-6 bg-transparent border-none cursor-pointer"
        >
          <ChevronDown className="w-4 h-4 rotate-90" /> Back to Dashboard
        </button>
        <ApplicationManager job={viewingAppsForJob} />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-navy">{company.company_name}</h1>
            {company.is_founding_employer && <FoundingEmployerBadge size="md" />}
          </div>
          <p className="text-sm text-gray-500 mt-1">Employer Dashboard</p>
        </div>
        <Link
          to="/dashboard/post"
          className="bg-orange hover:bg-orange-dark text-white px-5 py-2.5 rounded-lg font-semibold transition-colors no-underline flex items-center gap-2 text-sm"
        >
          <Plus className="w-4 h-4" /> Post a New Job
        </Link>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Active Listings', value: activeJobs, icon: <Briefcase className="w-5 h-5 text-orange" /> },
          { label: 'Total Views', value: totalViews, icon: <Eye className="w-5 h-5 text-blue-500" /> },
          { label: 'Applications', value: totalApps, icon: <FileText className="w-5 h-5 text-purple-500" /> },
          { label: 'Avg Response', value: '< 24h', icon: <Clock className="w-5 h-5 text-green-500" /> },
        ].map((stat) => (
          <div key={stat.label} className="bg-white rounded-xl border border-gray-200 p-4">
            <div className="flex items-center gap-2 mb-2">
              {stat.icon}
              <span className="text-xs font-medium text-gray-400 uppercase tracking-wide">{stat.label}</span>
            </div>
            <p className="text-2xl font-bold text-navy">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 rounded-lg p-1 mb-6 max-w-md">
        <button
          onClick={() => setActiveTab('jobs')}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-medium rounded-md transition-colors cursor-pointer border-none ${
            activeTab === 'jobs' ? 'bg-white text-navy shadow-sm' : 'text-gray-500 bg-transparent'
          }`}
        >
          <Briefcase className="w-4 h-4" /> Job Listings
        </button>
        <button
          onClick={() => setActiveTab('company')}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-medium rounded-md transition-colors cursor-pointer border-none ${
            activeTab === 'company' ? 'bg-white text-navy shadow-sm' : 'text-gray-500 bg-transparent'
          }`}
        >
          <Building2 className="w-4 h-4" /> Company
        </button>
      </div>

      {/* Jobs Tab */}
      {activeTab === 'jobs' && (
        <div>
          {jobsLoading ? (
            <div className="flex justify-center py-12"><Loader2 className="w-6 h-6 text-orange animate-spin" /></div>
          ) : jobs.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
              <Briefcase className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-lg font-medium text-gray-500">No jobs posted yet</p>
              <p className="text-sm text-gray-400 mt-1">Post your first job to start receiving applicants</p>
              <Link
                to="/dashboard/post"
                className="inline-flex items-center gap-2 bg-orange hover:bg-orange-dark text-white px-5 py-2.5 rounded-lg font-semibold text-sm mt-4 no-underline transition-colors"
              >
                <Plus className="w-4 h-4" /> Post a Job
              </Link>
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              {/* Table Header - Desktop */}
              <div className="hidden md:grid grid-cols-12 gap-4 px-5 py-3 bg-gray-50 text-xs font-medium text-gray-400 uppercase tracking-wide border-b border-gray-100">
                <div className="col-span-4">Job Title</div>
                <div className="col-span-1">Status</div>
                <div className="col-span-1 text-center">Views</div>
                <div className="col-span-2 text-center">Applications</div>
                <div className="col-span-2">Posted</div>
                <div className="col-span-2 text-right">Actions</div>
              </div>

              {jobs.map((job) => {
                const appCount = allAppCounts[job.id] || 0;
                return (
                  <div key={job.id} className="px-5 py-4 border-b border-gray-50 last:border-b-0 hover:bg-gray-50/50 transition-colors">
                    {/* Desktop */}
                    <div className="hidden md:grid grid-cols-12 gap-4 items-center">
                      <div className="col-span-4">
                        <p className="font-semibold text-navy text-sm">{job.title}</p>
                        <p className="text-xs text-gray-400">{job.neighborhood || job.zip_code || ''}</p>
                      </div>
                      <div className="col-span-1">
                        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full capitalize ${statusColor(job.status)}`}>
                          {job.status}
                        </span>
                      </div>
                      <div className="col-span-1 text-center text-sm text-gray-600">{job.views_count}</div>
                      <div className="col-span-2 text-center">
                        <button
                          onClick={() => setViewingAppsForJob(job)}
                          className="text-sm text-orange hover:text-orange-dark font-medium bg-transparent border-none cursor-pointer"
                        >
                          {appCount} applicant{appCount !== 1 ? 's' : ''}
                        </button>
                      </div>
                      <div className="col-span-2 text-sm text-gray-500">
                        {new Date(job.created_at).toLocaleDateString()}
                      </div>
                      <div className="col-span-2 flex items-center justify-end gap-1">
                        <Link
                          to={`/dashboard/post?edit=${job.id}`}
                          className="p-2 text-gray-400 hover:text-navy bg-transparent no-underline"
                          title="Edit"
                        >
                          <Edit3 className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => {
                            const data: any = { ...job };
                            delete data.id;
                            delete data.created_at;
                            delete data.updated_at;
                            delete data.company;
                            data.title = `${job.title} (Copy)`;
                            data.status = 'draft';
                            createJob(data).then(() => {
                              queryClient.invalidateQueries({ queryKey: ['companyJobs'] });
                              toast.success('Job duplicated as draft');
                            }).catch((err) => toast.error(err.message));
                          }}
                          className="p-2 text-gray-400 hover:text-navy bg-transparent border-none cursor-pointer"
                          title="Duplicate"
                        >
                          <Copy className="w-4 h-4" />
                        </button>
                        {job.status === 'active' ? (
                          <button
                            onClick={() => {
                              updateJob(job.id, { status: 'closed' } as any).then(() => {
                                queryClient.invalidateQueries({ queryKey: ['companyJobs'] });
                                toast.success('Job closed');
                              });
                            }}
                            className="p-2 text-gray-400 hover:text-red-500 bg-transparent border-none cursor-pointer"
                            title="Close"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        ) : (
                          <button
                            onClick={() => {
                              if (confirm('Delete this job?')) {
                                deleteJob(job.id).then(() => {
                                  queryClient.invalidateQueries({ queryKey: ['companyJobs'] });
                                  toast.success('Job deleted');
                                });
                              }
                            }}
                            className="p-2 text-gray-400 hover:text-red-500 bg-transparent border-none cursor-pointer"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Mobile */}
                    <div className="md:hidden">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="font-semibold text-navy">{job.title}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <span className={`text-xs font-semibold px-2 py-0.5 rounded-full capitalize ${statusColor(job.status)}`}>
                              {job.status}
                            </span>
                            <span className="text-xs text-gray-400">{job.views_count} views</span>
                          </div>
                        </div>
                        <button
                          onClick={() => setViewingAppsForJob(job)}
                          className="text-xs text-orange font-medium bg-transparent border-none cursor-pointer"
                        >
                          {allAppCounts[job.id] || 0} apps
                        </button>
                      </div>
                      <div className="flex items-center gap-2 mt-3">
                        <Link to={`/dashboard/post?edit=${job.id}`} className="text-xs text-gray-400 hover:text-navy no-underline">Edit</Link>
                        <span className="text-gray-200">|</span>
                        <button onClick={() => {
                          const data: any = { ...job };
                          delete data.id; delete data.created_at; delete data.updated_at; delete data.company;
                          data.title = `${job.title} (Copy)`; data.status = 'draft';
                          createJob(data).then(() => {
                            queryClient.invalidateQueries({ queryKey: ['companyJobs'] });
                            toast.success('Duplicated');
                          });
                        }} className="text-xs text-gray-400 hover:text-navy bg-transparent border-none cursor-pointer">Duplicate</button>
                        <span className="text-gray-200">|</span>
                        {job.status === 'active' ? (
                          <button onClick={() => {
                            updateJob(job.id, { status: 'closed' } as any).then(() => {
                              queryClient.invalidateQueries({ queryKey: ['companyJobs'] });
                              toast.success('Closed');
                            });
                          }} className="text-xs text-red-400 hover:text-red-600 bg-transparent border-none cursor-pointer">Close</button>
                        ) : (
                          <button onClick={() => {
                            if (confirm('Delete?')) deleteJob(job.id).then(() => {
                              queryClient.invalidateQueries({ queryKey: ['companyJobs'] });
                              toast.success('Deleted');
                            });
                          }} className="text-xs text-red-400 hover:text-red-600 bg-transparent border-none cursor-pointer">Delete</button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Company Tab */}
      {activeTab === 'company' && <CompanyEditor company={company} />}
    </div>
  );
}

// ---- Company Onboarding (Founding Employer flow) ----
function CompanyOnboarding({ userId }: { userId: string }) {
  const queryClient = useQueryClient();
  const [name, setName] = useState('');
  const [industry, setIndustry] = useState('');
  const [description, setDescription] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [website, setWebsite] = useState('');
  const [success, setSuccess] = useState(false);

  const INDUSTRIES = [
    'Manufacturing', 'Logistics/Warehouse', 'Healthcare', 'Construction',
    'Restaurant/Food Service', 'Retail', 'Transportation', 'Education',
    'Technology', 'Professional Services', 'Government', 'Other',
  ];

  const mutation = useMutation({
    mutationFn: () => createCompany(userId, {
      company_name: name, industry, description, phone, address, zip_code: zipCode, website: website || null,
      is_founding_employer: true,
    } as any),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myCompany'] });
      setSuccess(true);
    },
    onError: (err: Error) => toast.error(err.message),
  });

  if (success) {
    return (
      <div className="max-w-lg mx-auto px-4 py-16 text-center">
        <div className="bg-white rounded-2xl border-2 border-orange/20 p-8">
          <div className="w-20 h-20 bg-orange/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <Star className="w-10 h-10 text-orange fill-orange" />
          </div>
          <h1 className="text-2xl font-extrabold text-navy mb-2">Welcome, Founding Employer!</h1>
          <p className="text-gray-500 mb-6">
            {name} is now part of the Toledo Works founding employer program.
            All features are free through September 2026.
          </p>
          <FoundingEmployerBadge size="md" />
          <div className="mt-8">
            <Link
              to="/dashboard/post"
              className="inline-flex items-center gap-2 bg-orange hover:bg-orange-dark text-white px-6 py-3 rounded-lg font-semibold transition-colors no-underline"
            >
              <Plus className="w-4 h-4" /> Post Your First Job
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto px-4 py-12">
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-1.5 bg-orange/10 text-orange text-sm font-semibold px-3 py-1 rounded-full mb-4">
          <Star className="w-4 h-4 fill-orange" /> Founding Employer
        </div>
        <h1 className="text-2xl font-bold text-navy">Set Up Your Company</h1>
        <p className="text-gray-500 mt-1">Tell us about your business to start posting jobs</p>
      </div>

      <form onSubmit={(e) => { e.preventDefault(); mutation.mutate(); }} className="bg-white rounded-xl border border-gray-200 p-6 flex flex-col gap-4">
        <div>
          <label className="block text-sm font-medium text-navy mb-1">Company Name *</label>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} required
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-navy outline-none focus:border-orange"
            placeholder="Your company name" />
        </div>

        <div>
          <label className="block text-sm font-medium text-navy mb-1">Industry *</label>
          <select value={industry} onChange={(e) => setIndustry(e.target.value)} required
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-navy outline-none focus:border-orange bg-white">
            <option value="">Select industry...</option>
            {INDUSTRIES.map((i) => <option key={i} value={i}>{i}</option>)}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-navy mb-1">Description</label>
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-navy outline-none focus:border-orange resize-none"
            placeholder="Brief description of your company..." />
        </div>

        <div>
          <label className="block text-sm font-medium text-navy mb-1">Phone</label>
          <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-navy outline-none focus:border-orange"
            placeholder="(419) 555-1234" />
        </div>

        <div>
          <label className="block text-sm font-medium text-navy mb-1">Address</label>
          <input type="text" value={address} onChange={(e) => setAddress(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-navy outline-none focus:border-orange"
            placeholder="123 Main St, Toledo, OH" />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-navy mb-1">Zip Code</label>
            <input type="text" value={zipCode} onChange={(e) => setZipCode(e.target.value)} maxLength={5}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-navy outline-none focus:border-orange"
              placeholder="43604" />
          </div>
          <div>
            <label className="block text-sm font-medium text-navy mb-1">Website</label>
            <input type="url" value={website} onChange={(e) => setWebsite(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-navy outline-none focus:border-orange"
              placeholder="https://" />
          </div>
        </div>

        <button type="submit" disabled={mutation.isPending}
          className="bg-orange hover:bg-orange-dark text-white py-3 rounded-lg font-semibold cursor-pointer border-none disabled:opacity-50 mt-2">
          {mutation.isPending ? 'Creating...' : 'Create Company & Become Founding Employer'}
        </button>
      </form>
    </div>
  );
}

// ---- Company Editor ----
function CompanyEditor({ company }: { company: Company }) {
  const queryClient = useQueryClient();
  const [name, setName] = useState(company.company_name);
  const [industry, setIndustry] = useState(company.industry || '');
  const [description, setDescription] = useState(company.description || '');
  const [phone, setPhone] = useState(company.phone || '');
  const [address, setAddress] = useState(company.address || '');
  const [zipCode, setZipCode] = useState(company.zip_code || '');
  const [website, setWebsite] = useState(company.website || '');

  const mutation = useMutation({
    mutationFn: () => updateCompany(company.id, {
      company_name: name, industry, description, phone, address, zip_code: zipCode, website: website || null,
    } as any),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myCompany'] });
      toast.success('Company updated');
    },
    onError: (err: Error) => toast.error(err.message),
  });

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 max-w-lg">
      <h2 className="text-lg font-bold text-navy mb-4 flex items-center gap-2">
        <Building2 className="w-5 h-5 text-orange" /> Company Settings
      </h2>
      {company.is_founding_employer && (
        <div className="mb-4">
          <FoundingEmployerBadge size="md" />
        </div>
      )}
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
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-navy outline-none focus:border-orange" placeholder="https://" />
        </div>
        <div>
          <label className="block text-sm font-medium text-navy mb-1">Address</label>
          <input type="text" value={address} onChange={(e) => setAddress(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-navy outline-none focus:border-orange" />
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

// ---- Application Manager ----
function ApplicationManager({ job }: { job: Job }) {
  const queryClient = useQueryClient();

  const { data: apps = [], isLoading } = useQuery({
    queryKey: ['jobApplications', job.id],
    queryFn: () => fetchApplicationsForJob(job.id),
  });

  const statusMutation = useMutation({
    mutationFn: ({ id, status, notes }: { id: string; status: string; notes?: string }) =>
      updateApplicationStatus(id, status, notes),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jobApplications', job.id] });
      queryClient.invalidateQueries({ queryKey: ['allAppCounts'] });
      toast.success('Status updated');
    },
  });

  const statusColors: Record<string, string> = {
    applied: 'bg-blue-50 text-blue-700 border-blue-200',
    reviewed: 'bg-yellow-50 text-yellow-700 border-yellow-200',
    interview: 'bg-purple-50 text-purple-700 border-purple-200',
    hired: 'bg-green-50 text-green-700 border-green-200',
    rejected: 'bg-red-50 text-red-700 border-red-200',
  };

  return (
    <div>
      <h2 className="text-xl font-bold text-navy mb-1">{job.title}</h2>
      <p className="text-sm text-gray-500 mb-6">Manage applicants for this position</p>

      {isLoading ? (
        <div className="flex justify-center py-12"><Loader2 className="w-6 h-6 text-orange animate-spin" /></div>
      ) : apps.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
          <Users className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-lg font-medium text-gray-500">No applicants yet</p>
          <p className="text-sm text-gray-400">Share this job listing to get applicants</p>
        </div>
      ) : (
        <div className="space-y-4">
          {apps.map((app) => {
            const applicant = (app as any).applicant;
            return (
              <div key={app.id} className="bg-white rounded-xl border border-gray-200 p-5">
                <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <User className="w-4 h-4 text-gray-400" />
                      <h3 className="font-semibold text-navy">
                        {applicant?.full_name || applicant?.email || 'Applicant'}
                      </h3>
                    </div>

                    {/* Contact info */}
                    <div className="flex flex-wrap gap-3 text-xs text-gray-500 mt-1">
                      {applicant?.email && (
                        <span className="flex items-center gap-1">
                          <Mail className="w-3 h-3" /> {applicant.email}
                        </span>
                      )}
                      {applicant?.phone && (
                        <span className="flex items-center gap-1">
                          <Phone className="w-3 h-3" /> {applicant.phone}
                        </span>
                      )}
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        Applied {new Date(app.applied_at).toLocaleDateString()}
                      </span>
                    </div>

                    {/* Candidate Summary */}
                    {app.candidate_summary && (
                      <div className="mt-3 bg-gray-50 rounded-lg p-3">
                        <p className="text-xs font-medium text-gray-400 mb-1">Candidate Summary</p>
                        <p className="text-sm text-gray-700">{app.candidate_summary}</p>
                      </div>
                    )}
                  </div>

                  {/* Status Dropdown */}
                  <select
                    value={app.status}
                    onChange={(e) => statusMutation.mutate({ id: app.id, status: e.target.value })}
                    className={`px-3 py-2 rounded-lg text-sm font-semibold border cursor-pointer capitalize ${
                      statusColors[app.status] || 'bg-gray-100 text-gray-600 border-gray-200'
                    }`}
                  >
                    <option value="applied">New</option>
                    <option value="reviewed">Reviewed</option>
                    <option value="interview">Interview</option>
                    <option value="hired">Hired</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
