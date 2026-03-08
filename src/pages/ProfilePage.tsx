import { useState, useEffect } from 'react';
import { Navigate, Link } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  User, Phone, MapPin, Globe, Briefcase, Clock, Car, GraduationCap,
  Bookmark, FileText, Loader2, Check, ChevronRight
} from 'lucide-react';
import { useAuth } from '../lib/auth';
import { updateProfile, fetchSavedJobsFull, fetchMyApplications, fetchSavedJobs, saveJob, unsaveJob } from '../lib/queries';
import { supabase } from '../lib/supabase';
import JobCard from '../components/JobCard';
import TradesSkillsCard, { type TradesSkillsData } from '../components/TradesSkillsCard';
import toast from 'react-hot-toast';
import type { SeekerProfile } from '../types/database';

const JOB_CATEGORIES = [
  'Warehouse', 'Healthcare', 'Restaurant/Service', 'Construction/Trades',
  'Manufacturing', 'Retail', 'Transportation', 'Other',
];

const SHIFT_OPTIONS = [
  { value: 'first', label: '1st Shift' },
  { value: 'second', label: '2nd Shift' },
  { value: 'third', label: '3rd Shift' },
  { value: 'flexible', label: 'Flexible' },
  { value: 'weekends', label: 'Weekends' },
  { value: 'rotating', label: 'Rotating' },
];

const EDUCATION_LEVELS = [
  { value: 'no_diploma', label: 'No Diploma' },
  { value: 'ged', label: 'GED' },
  { value: 'high_school', label: 'High School Diploma' },
  { value: 'some_college', label: 'Some College' },
  { value: 'associates', label: 'Associate Degree' },
  { value: 'bachelors_plus', label: "Bachelor's or Higher" },
];

type ProfileTab = 'profile' | 'saved' | 'applications';

export default function ProfilePage() {
  const { user, profile, loading, refreshProfile } = useAuth();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<ProfileTab>('profile');

  // Profile form state
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [preferredLanguage, setPreferredLanguage] = useState('en');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedShifts, setSelectedShifts] = useState<string[]>([]);
  const [hasTransport, setHasTransport] = useState(false);
  const [speaksSpanish, setSpeaksSpanish] = useState(false);
  const [educationLevel, setEducationLevel] = useState('');
  const [experienceYears, setExperienceYears] = useState(0);
  const [initialized, setInitialized] = useState(false);

  // Trades skills card state
  const [showTradesCard, setShowTradesCard] = useState(false);
  const [tradesData, setTradesData] = useState<TradesSkillsData>({
    primaryTrade: '',
    experienceLevel: '',
    yearsInTrade: 0,
    certifications: [],
    ownTools: false,
    ownPPE: false,
    unionStatus: 'willing_to_join',
    availableNow: false,
    willingToTravel: false,
  });

  // Fetch seeker profile data
  const { data: seekerProfile } = useQuery({
    queryKey: ['seekerProfile', user?.id],
    queryFn: async () => {
      const { data } = await supabase
        .from('seeker_profiles')
        .select('*')
        .eq('profile_id', user!.id)
        .maybeSingle();
      return data as SeekerProfile | null;
    },
    enabled: !!user,
  });

  // Fetch skills card data
  const { data: skillsCard } = useQuery({
    queryKey: ['skillsCard', user?.id],
    queryFn: async () => {
      const { data } = await supabase
        .from('skills_cards')
        .select('*')
        .eq('profile_id', user!.id)
        .maybeSingle();
      return data;
    },
    enabled: !!user,
  });

  // Initialize form data
  useEffect(() => {
    if (!initialized && profile) {
      setFullName(profile.full_name || '');
      setPhone(profile.phone || '');
      setZipCode(profile.zip_code || '');
      setPreferredLanguage(profile.preferred_language || 'en');
      setInitialized(true);
    }
  }, [profile, initialized]);

  useEffect(() => {
    if (seekerProfile) {
      setSelectedCategories(seekerProfile.job_categories || []);
      setSelectedShifts(seekerProfile.preferred_shifts || []);
      setHasTransport(seekerProfile.has_reliable_transport);
      setSpeaksSpanish(seekerProfile.speaks_spanish);
      setEducationLevel(seekerProfile.education_level || '');
      setExperienceYears(seekerProfile.experience_years || 0);
    }
  }, [seekerProfile]);

  useEffect(() => {
    if (skillsCard) {
      setShowTradesCard(true);
      setTradesData({
        primaryTrade: skillsCard.trade_category || '',
        experienceLevel: skillsCard.experience_level || '',
        yearsInTrade: skillsCard.experience_years || 0,
        certifications: (skillsCard.certifications as string[]) || [],
        ownTools: skillsCard.has_own_tools,
        ownPPE: skillsCard.has_ppe,
        unionStatus: skillsCard.union_status || 'willing_to_join',
        availableNow: skillsCard.available_now,
        willingToTravel: skillsCard.willing_to_travel,
      });
    }
  }, [skillsCard]);

  // Watch for Construction/Trades selection
  useEffect(() => {
    if (selectedCategories.includes('Construction/Trades')) {
      setShowTradesCard(true);
    }
  }, [selectedCategories]);

  // Saved jobs
  const { data: savedJobs = [], isLoading: savedLoading } = useQuery({
    queryKey: ['savedJobsFull', user?.id],
    queryFn: () => fetchSavedJobsFull(user!.id),
    enabled: !!user && activeTab === 'saved',
  });

  const { data: savedJobIds = [] } = useQuery({
    queryKey: ['savedJobs', user?.id],
    queryFn: () => fetchSavedJobs(user!.id),
    enabled: !!user,
  });

  // Applications
  const { data: applications = [], isLoading: appsLoading } = useQuery({
    queryKey: ['myApplications', user?.id],
    queryFn: () => fetchMyApplications(user!.id),
    enabled: !!user && activeTab === 'applications',
  });

  const saveMutation = useMutation({
    mutationFn: (jobId: string) => {
      if (!user) throw new Error('Must be signed in');
      return savedJobIds.includes(jobId) ? unsaveJob(user.id, jobId) : saveJob(user.id, jobId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['savedJobs'] });
      queryClient.invalidateQueries({ queryKey: ['savedJobsFull'] });
    },
  });

  // Save profile mutation
  const profileMutation = useMutation({
    mutationFn: async () => {
      if (!user) throw new Error('Must be signed in');

      // Update main profile
      await updateProfile(user.id, {
        full_name: fullName,
        phone,
        zip_code: zipCode,
        preferred_language: preferredLanguage,
      });

      // Upsert seeker profile
      await supabase.from('seeker_profiles').upsert({
        profile_id: user.id,
        job_categories: selectedCategories,
        preferred_shifts: selectedShifts,
        has_reliable_transport: hasTransport,
        speaks_spanish: speaksSpanish,
        education_level: educationLevel || null,
        experience_years: experienceYears,
      }, { onConflict: 'profile_id' });

      // Upsert skills card if trades selected
      if (showTradesCard && tradesData.primaryTrade) {
        await supabase.from('skills_cards').upsert({
          profile_id: user.id,
          trade_category: tradesData.primaryTrade,
          experience_years: tradesData.yearsInTrade,
          experience_level: tradesData.experienceLevel || null,
          certifications: tradesData.certifications,
          has_own_tools: tradesData.ownTools,
          has_ppe: tradesData.ownPPE,
          has_reliable_transport: hasTransport,
          union_status: tradesData.unionStatus,
          available_now: tradesData.availableNow,
          willing_to_travel: tradesData.willingToTravel,
        }, { onConflict: 'profile_id' });
      }
    },
    onSuccess: () => {
      toast.success('Profile saved!');
      refreshProfile();
      queryClient.invalidateQueries({ queryKey: ['seekerProfile'] });
      queryClient.invalidateQueries({ queryKey: ['skillsCard'] });
    },
    onError: (err: Error) => toast.error(err.message),
  });

  function toggleCategory(cat: string) {
    setSelectedCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
  }

  function toggleShift(shift: string) {
    setSelectedShifts((prev) =>
      prev.includes(shift) ? prev.filter((s) => s !== shift) : [...prev, shift]
    );
  }

  if (loading) return <div className="flex justify-center py-24"><Loader2 className="w-8 h-8 text-orange animate-spin" /></div>;
  if (!user) return <Navigate to="/login" replace />;

  const statusColors: Record<string, string> = {
    applied: 'bg-blue-50 text-blue-700',
    reviewed: 'bg-yellow-50 text-yellow-700',
    interview: 'bg-purple-50 text-purple-700',
    hired: 'bg-green-50 text-green-700',
    rejected: 'bg-red-50 text-red-700',
  };

  const tabs: { key: ProfileTab; label: string; icon: React.ReactNode }[] = [
    { key: 'profile', label: 'My Profile', icon: <User className="w-4 h-4" /> },
    { key: 'saved', label: 'Saved Jobs', icon: <Bookmark className="w-4 h-4" /> },
    { key: 'applications', label: 'Applications', icon: <FileText className="w-4 h-4" /> },
  ];

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-navy mb-6">
        {profile?.full_name ? `Hey, ${profile.full_name}` : 'Your Profile'}
      </h1>

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 rounded-lg p-1 mb-8">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setActiveTab(t.key)}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-medium rounded-md transition-colors cursor-pointer border-none ${
              activeTab === t.key ? 'bg-white text-navy shadow-sm' : 'text-gray-500 bg-transparent hover:text-navy'
            }`}
          >
            {t.icon}
            <span className="hidden sm:inline">{t.label}</span>
          </button>
        ))}
      </div>

      {/* Profile Tab */}
      {activeTab === 'profile' && (
        <form onSubmit={(e) => { e.preventDefault(); profileMutation.mutate(); }} className="space-y-6">
          {/* Basic Info */}
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h2 className="text-base font-bold text-navy mb-4 flex items-center gap-2">
              <User className="w-4 h-4 text-orange" /> Basic Information
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-navy mb-1">Full Name</label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-navy outline-none focus:border-orange transition-colors"
                  placeholder="John Smith"
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
              <div>
                <label className="block text-sm font-medium text-navy mb-1">Preferred Language</label>
                <select
                  value={preferredLanguage}
                  onChange={(e) => setPreferredLanguage(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-navy outline-none focus:border-orange"
                >
                  <option value="en">English</option>
                  <option value="es">Spanish</option>
                </select>
              </div>
            </div>
          </div>

          {/* Work Preferences */}
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h2 className="text-base font-bold text-navy mb-4 flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-orange" /> What Kind of Work?
            </h2>
            <div className="flex flex-wrap gap-2 mb-4">
              {JOB_CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => toggleCategory(cat)}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all cursor-pointer border ${
                    selectedCategories.includes(cat)
                      ? 'bg-orange text-white border-orange'
                      : 'bg-white text-navy border-gray-300 hover:border-orange'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <h3 className="text-sm font-semibold text-navy mb-2 mt-4">Available Shifts</h3>
            <div className="flex flex-wrap gap-2">
              {SHIFT_OPTIONS.map((shift) => (
                <button
                  key={shift.value}
                  type="button"
                  onClick={() => toggleShift(shift.value)}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all cursor-pointer border ${
                    selectedShifts.includes(shift.value)
                      ? 'bg-navy text-white border-navy'
                      : 'bg-white text-navy border-gray-300 hover:border-navy'
                  }`}
                >
                  {shift.label}
                </button>
              ))}
            </div>
          </div>

          {/* About You */}
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h2 className="text-base font-bold text-navy mb-4 flex items-center gap-2">
              <GraduationCap className="w-4 h-4 text-orange" /> About You
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-navy mb-1">Education Level</label>
                <select
                  value={educationLevel}
                  onChange={(e) => setEducationLevel(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-navy outline-none focus:border-orange"
                >
                  <option value="">Select...</option>
                  {EDUCATION_LEVELS.map((edu) => (
                    <option key={edu.value} value={edu.value}>{edu.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-navy mb-1">Years of Experience</label>
                <input
                  type="number"
                  min={0}
                  max={50}
                  value={experienceYears}
                  onChange={(e) => setExperienceYears(Number(e.target.value))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-navy outline-none focus:border-orange transition-colors"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
              <label className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all ${
                hasTransport ? 'border-orange bg-orange/5' : 'border-gray-200 hover:border-gray-300'
              }`}>
                <input
                  type="checkbox"
                  checked={hasTransport}
                  onChange={(e) => setHasTransport(e.target.checked)}
                  className="sr-only"
                />
                <Car className={`w-5 h-5 ${hasTransport ? 'text-orange' : 'text-gray-400'}`} />
                <div>
                  <p className="text-sm font-medium text-navy">Reliable Transportation</p>
                  <p className="text-xs text-gray-500">I can get to work consistently</p>
                </div>
                {hasTransport && <Check className="w-4 h-4 text-orange ml-auto" />}
              </label>

              <label className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all ${
                speaksSpanish ? 'border-orange bg-orange/5' : 'border-gray-200 hover:border-gray-300'
              }`}>
                <input
                  type="checkbox"
                  checked={speaksSpanish}
                  onChange={(e) => setSpeaksSpanish(e.target.checked)}
                  className="sr-only"
                />
                <Globe className={`w-5 h-5 ${speaksSpanish ? 'text-orange' : 'text-gray-400'}`} />
                <div>
                  <p className="text-sm font-medium text-navy">Speaks Spanish</p>
                  <p className="text-xs text-gray-500">Hablo espa&ntilde;ol</p>
                </div>
                {speaksSpanish && <Check className="w-4 h-4 text-orange ml-auto" />}
              </label>
            </div>
          </div>

          {/* Trades Skills Card */}
          {showTradesCard && (
            <TradesSkillsCard data={tradesData} onChange={setTradesData} />
          )}

          {/* Save Button */}
          <button
            type="submit"
            disabled={profileMutation.isPending}
            className="w-full bg-orange hover:bg-orange-dark text-white py-3 rounded-lg font-semibold text-lg transition-colors cursor-pointer border-none disabled:opacity-50"
          >
            {profileMutation.isPending ? 'Saving...' : 'Save Profile'}
          </button>
        </form>
      )}

      {/* Saved Jobs Tab */}
      {activeTab === 'saved' && (
        <div>
          {savedLoading ? (
            <div className="flex justify-center py-12"><Loader2 className="w-6 h-6 text-orange animate-spin" /></div>
          ) : savedJobs.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              <Bookmark className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p className="text-lg font-medium">No saved jobs</p>
              <p className="text-sm mt-1">Bookmark jobs you're interested in</p>
              <Link to="/jobs" className="text-orange hover:underline mt-3 inline-block">Browse Jobs</Link>
            </div>
          ) : (
            <div className="space-y-4">
              {savedJobs.map((job) => (
                <JobCard key={job.id} job={job} isSaved onToggleSave={(id) => saveMutation.mutate(id)} />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Applications Tab */}
      {activeTab === 'applications' && (
        <div>
          {appsLoading ? (
            <div className="flex justify-center py-12"><Loader2 className="w-6 h-6 text-orange animate-spin" /></div>
          ) : applications.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              <FileText className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p className="text-lg font-medium">No applications yet</p>
              <p className="text-sm mt-1">Apply to jobs to see them here</p>
              <Link to="/jobs" className="text-orange hover:underline mt-3 inline-block">Browse Jobs</Link>
            </div>
          ) : (
            <div className="space-y-4">
              {applications.map((app) => (
                <Link
                  key={app.id}
                  to={`/jobs/${app.job_id}`}
                  className="block bg-white rounded-xl border border-gray-200 p-5 hover:border-orange/30 hover:shadow-sm transition-all no-underline"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-lg font-bold text-navy">
                        {(app as any).job?.title || 'Job'}
                      </p>
                      <p className="text-sm text-gray-500">{(app as any).job?.company?.company_name || ''}</p>
                    </div>
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full capitalize shrink-0 ${statusColors[app.status] || 'bg-gray-100 text-gray-600'}`}>
                      {app.status}
                    </span>
                  </div>
                  <p className="text-xs text-gray-400 mt-2">
                    Applied {new Date(app.applied_at).toLocaleDateString()}
                  </p>
                </Link>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
