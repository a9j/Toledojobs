import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link, Navigate } from 'react-router-dom';
import {
  Briefcase, Bookmark, User, Settings, Loader2, MapPin, Clock, DollarSign
} from 'lucide-react';
import { useAuth } from '../lib/auth';
import { fetchMyApplications, fetchSavedJobsFull, updateProfile } from '../lib/queries';
import JobCard from '../components/JobCard';
import { saveJob, unsaveJob, fetchSavedJobs } from '../lib/queries';
import toast from 'react-hot-toast';

type Tab = 'applications' | 'saved' | 'profile';

const statusColors: Record<string, string> = {
  applied: 'bg-blue-50 text-blue-700',
  reviewed: 'bg-yellow-50 text-yellow-700',
  interview: 'bg-purple-50 text-purple-700',
  hired: 'bg-green-50 text-green-700',
  rejected: 'bg-red-50 text-red-700',
};

export default function DashboardPage() {
  const { user, profile, loading, refreshProfile } = useAuth();
  const [tab, setTab] = useState<Tab>('applications');
  const queryClient = useQueryClient();

  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [profileInitialized, setProfileInitialized] = useState(false);

  if (!profileInitialized && profile) {
    setFullName(profile.full_name || '');
    setPhone(profile.phone || '');
    setZipCode(profile.zip_code || '');
    setProfileInitialized(true);
  }

  const { data: applications = [], isLoading: appsLoading } = useQuery({
    queryKey: ['myApplications', user?.id],
    queryFn: () => fetchMyApplications(user!.id),
    enabled: !!user,
  });

  const { data: savedJobs = [], isLoading: savedLoading } = useQuery({
    queryKey: ['savedJobsFull', user?.id],
    queryFn: () => fetchSavedJobsFull(user!.id),
    enabled: !!user,
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
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['savedJobs'] });
      queryClient.invalidateQueries({ queryKey: ['savedJobsFull'] });
    },
  });

  const profileMutation = useMutation({
    mutationFn: () => updateProfile(user!.id, { full_name: fullName, phone, zip_code: zipCode }),
    onSuccess: () => { toast.success('Profile updated'); refreshProfile(); },
    onError: (err: Error) => toast.error(err.message),
  });

  if (loading) return <div className="flex justify-center py-24"><Loader2 className="w-8 h-8 text-orange animate-spin" /></div>;
  if (!user) return <Navigate to="/" replace />;

  const tabs: { key: Tab; label: string; icon: React.ReactNode }[] = [
    { key: 'applications', label: 'My Applications', icon: <Briefcase className="w-4 h-4" /> },
    { key: 'saved', label: 'Saved Jobs', icon: <Bookmark className="w-4 h-4" /> },
    { key: 'profile', label: 'Profile', icon: <User className="w-4 h-4" /> },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-navy mb-6">
        Welcome{profile?.full_name ? `, ${profile.full_name}` : ''}
      </h1>

      <div className="flex gap-1 bg-gray-100 rounded-lg p-1 mb-8">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-medium rounded-md transition-colors cursor-pointer border-none ${
              tab === t.key ? 'bg-white text-navy shadow-sm' : 'text-gray-500 bg-transparent hover:text-navy'
            }`}
          >
            {t.icon} {t.label}
          </button>
        ))}
      </div>

      {tab === 'applications' && (
        <div>
          {appsLoading ? (
            <div className="flex justify-center py-12"><Loader2 className="w-6 h-6 text-orange animate-spin" /></div>
          ) : applications.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              <Briefcase className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p className="text-lg font-medium">No applications yet</p>
              <p className="text-sm mt-1">Browse jobs and apply to get started</p>
              <Link to="/" className="text-orange hover:underline mt-3 inline-block">Find Jobs</Link>
            </div>
          ) : (
            <div className="space-y-4">
              {applications.map((app) => (
                <div key={app.id} className="bg-white rounded-xl border border-gray-200 p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <Link to={`/jobs/${app.job_id}`} className="text-lg font-bold text-navy hover:text-orange no-underline transition-colors">
                        {(app as any).job?.title || 'Job'}
                      </Link>
                      <p className="text-sm text-gray-500">{(app as any).job?.company?.company_name || ''}</p>
                    </div>
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full capitalize ${statusColors[app.status] || 'bg-gray-100 text-gray-600'}`}>
                      {app.status}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-3 mt-3 text-xs text-gray-400">
                    {(app as any).job?.pay_min && (
                      <span className="flex items-center gap-1"><DollarSign className="w-3 h-3" />${(app as any).job.pay_min}{(app as any).job.pay_type === 'hourly' ? '/hr' : '/yr'}</span>
                    )}
                    {(app as any).job?.neighborhood && (
                      <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{(app as any).job.neighborhood}</span>
                    )}
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" />Applied {new Date(app.applied_at).toLocaleDateString()}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {tab === 'saved' && (
        <div>
          {savedLoading ? (
            <div className="flex justify-center py-12"><Loader2 className="w-6 h-6 text-orange animate-spin" /></div>
          ) : savedJobs.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              <Bookmark className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p className="text-lg font-medium">No saved jobs</p>
              <p className="text-sm mt-1">Bookmark jobs you're interested in</p>
              <Link to="/" className="text-orange hover:underline mt-3 inline-block">Find Jobs</Link>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {savedJobs.map((job) => (
                <JobCard key={job.id} job={job} isSaved onToggleSave={(id) => saveMutation.mutate(id)} />
              ))}
            </div>
          )}
        </div>
      )}

      {tab === 'profile' && (
        <div className="bg-white rounded-xl border border-gray-200 p-6 max-w-lg">
          <h2 className="text-lg font-bold text-navy mb-4 flex items-center gap-2">
            <Settings className="w-5 h-5 text-orange" /> Profile Settings
          </h2>
          <form
            onSubmit={(e) => { e.preventDefault(); profileMutation.mutate(); }}
            className="flex flex-col gap-4"
          >
            <div>
              <label className="block text-sm font-medium text-navy mb-1">Email</label>
              <input
                type="email"
                value={user.email || ''}
                disabled
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-gray-400 bg-gray-50"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-navy mb-1">Full Name</label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-navy outline-none focus:border-orange transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-navy mb-1">Phone</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-navy outline-none focus:border-orange transition-colors"
                placeholder="(419) 555-1234"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-navy mb-1">Zip Code</label>
              <input
                type="text"
                value={zipCode}
                onChange={(e) => setZipCode(e.target.value)}
                maxLength={5}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-navy outline-none focus:border-orange transition-colors"
                placeholder="43604"
              />
            </div>
            <button
              type="submit"
              disabled={profileMutation.isPending}
              className="bg-orange hover:bg-orange-dark text-white py-2.5 rounded-lg font-semibold transition-colors cursor-pointer border-none disabled:opacity-50"
            >
              {profileMutation.isPending ? 'Saving...' : 'Save Changes'}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
