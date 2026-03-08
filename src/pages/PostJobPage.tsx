import { useState, useEffect } from 'react';
import { Navigate, useNavigate, useSearchParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  ArrowLeft, ArrowRight, Check, Loader2, Eye, Briefcase
} from 'lucide-react';
import { useAuth } from '../lib/auth';
import { fetchMyCompany, fetchJobById, createJob, updateJob } from '../lib/queries';
import JobCard from '../components/JobCard';
import type { Job } from '../types/database';
import toast from 'react-hot-toast';

const CATEGORIES = [
  'Warehouse', 'Healthcare', 'Manufacturing', 'Restaurant/Service', 'Retail',
  'Construction/Trades', 'Driving/CDL', 'Office/Admin', 'Education', 'Tech', 'Other',
];

const JOB_TYPES = [
  { value: 'full_time', label: 'Full-Time' },
  { value: 'part_time', label: 'Part-Time' },
  { value: 'contract', label: 'Contract' },
  { value: 'temp', label: 'Temp' },
  { value: 'seasonal', label: 'Seasonal' },
];

const SHIFTS = [
  { value: 'first', label: '1st Shift' },
  { value: 'second', label: '2nd Shift' },
  { value: 'third', label: '3rd Shift' },
  { value: 'flexible', label: 'Flexible' },
  { value: 'weekends', label: 'Weekends' },
  { value: 'rotating', label: 'Rotating' },
];

const TRADE_CATEGORIES = [
  'Welding', 'Electrical', 'HVAC', 'Plumbing', 'Carpentry', 'CDL/Driving',
  'CNC/Machining', 'Solar/Energy', 'Roofing', 'Heavy Equipment', 'Painting',
  'Concrete/Masonry', 'Auto/Diesel Mechanic', 'General Labor',
];

const CERTIFICATIONS = [
  'OSHA 10', 'OSHA 30', 'EPA 608', 'AWS D1.1', 'CPR/First Aid', 'Forklift',
  'Confined Space', 'Fall Protection', 'Rigging & Signaling', 'CDL Class A',
  'CDL Class B', 'Journeyman License', 'Master License', 'Backflow Prevention',
];

const STEPS = ['Basics', 'Details', 'Trades', 'Preview'];

export default function PostJobPage() {
  const { user, profile, loading } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [searchParams] = useSearchParams();
  const editId = searchParams.get('edit');

  const [step, setStep] = useState(0);

  // Step 1: Basics
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [jobType, setJobType] = useState('full_time');
  const [shift, setShift] = useState('first');
  const [payMin, setPayMin] = useState('');
  const [payMax, setPayMax] = useState('');
  const [payType, setPayType] = useState('hourly');
  const [isUrgent, setIsUrgent] = useState(false);
  const [neighborhood, setNeighborhood] = useState('');
  const [zipCode, setZipCode] = useState('');

  // Step 2: Details
  const [description, setDescription] = useState('');
  const [requirements, setRequirements] = useState('');
  const [isDegreeRequired, setIsDegreeRequired] = useState(false);
  const [isSpanishFriendly, setIsSpanishFriendly] = useState(false);
  const [hasBenefits, setHasBenefits] = useState(false);
  const [startDate, setStartDate] = useState('');
  const [spanishDesc, setSpanishDesc] = useState('');

  // Step 3: Trades
  const [tradeCategory, setTradeCategory] = useState('');
  const [certifications, setCertifications] = useState<string[]>([]);
  const [toolsRequired, setToolsRequired] = useState('');
  const [unionStatus, setUnionStatus] = useState('either');
  const [projectDuration, setProjectDuration] = useState('');
  const [overtimeAvailable, setOvertimeAvailable] = useState(false);
  const [perDiem, setPerDiem] = useState(false);
  const [prevailingWage, setPrevailingWage] = useState(false);

  const isTrades = category === 'Construction/Trades';

  // Fetch company
  const { data: company } = useQuery({
    queryKey: ['myCompany', user?.id],
    queryFn: () => fetchMyCompany(user!.id),
    enabled: !!user,
  });

  // Fetch existing job for editing
  const { data: existingJob } = useQuery({
    queryKey: ['job', editId],
    queryFn: () => fetchJobById(editId!),
    enabled: !!editId,
  });

  // Populate form for editing
  useEffect(() => {
    if (existingJob) {
      setTitle(existingJob.title);
      setCategory(existingJob.category || '');
      setJobType(existingJob.job_type);
      setShift(existingJob.shift);
      setPayMin(existingJob.pay_min?.toString() || '');
      setPayMax(existingJob.pay_max?.toString() || '');
      setPayType(existingJob.pay_type);
      setIsUrgent(existingJob.is_urgently_hiring);
      setNeighborhood(existingJob.neighborhood || '');
      setZipCode(existingJob.zip_code || '');
      setDescription(existingJob.description);
      setRequirements(existingJob.requirements || '');
      setIsDegreeRequired(existingJob.is_degree_required);
      setIsSpanishFriendly(existingJob.is_spanish_friendly);
      setHasBenefits(existingJob.has_benefits);
      setStartDate(existingJob.start_date || '');
      setSpanishDesc(existingJob.spanish_description || '');
      setTradeCategory(existingJob.trade_category || '');
      setCertifications(existingJob.certifications_required || []);
      setUnionStatus(existingJob.union_status);
      setOvertimeAvailable(existingJob.overtime_available);
      setPerDiem(existingJob.per_diem_included);
      setPrevailingWage(existingJob.prevailing_wage);
      setProjectDuration(existingJob.project_duration || '');
    }
  }, [existingJob]);

  const publishMutation = useMutation({
    mutationFn: () => {
      if (!company) throw new Error('No company found');
      const jobData: any = {
        company_id: company.id,
        title,
        description,
        spanish_description: spanishDesc || null,
        pay_min: payMin ? Number(payMin) : null,
        pay_max: payMax ? Number(payMax) : null,
        pay_type: payType,
        job_type: jobType,
        shift,
        category: category || null,
        trade_category: isTrades ? (tradeCategory || null) : null,
        neighborhood: neighborhood || null,
        zip_code: zipCode || null,
        requirements: (isTrades && toolsRequired)
          ? `${requirements || ''}\n\nTools Required: ${toolsRequired}`.trim()
          : (requirements || null),
        is_degree_required: isDegreeRequired,
        is_spanish_friendly: isSpanishFriendly,
        is_urgently_hiring: isUrgent,
        has_benefits: hasBenefits,
        start_date: startDate || null,
        certifications_required: isTrades ? certifications : [],
        union_status: isTrades ? unionStatus : 'either',
        project_duration: isTrades ? (projectDuration || null) : null,
        overtime_available: overtimeAvailable,
        per_diem_included: isTrades ? perDiem : false,
        prevailing_wage: isTrades ? prevailingWage : false,
        status: 'active',
      };
      return editId ? updateJob(editId, jobData) : createJob(jobData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['companyJobs'] });
      toast.success(editId ? 'Job updated!' : 'Job published!');
      navigate('/dashboard');
    },
    onError: (err: Error) => toast.error(err.message),
  });

  if (loading) return <div className="flex justify-center py-24"><Loader2 className="w-8 h-8 text-orange animate-spin" /></div>;
  if (!user) return <Navigate to="/login" replace />;
  if (profile?.role !== 'employer') return <Navigate to="/" replace />;

  // Build the steps (skip trades if not applicable)
  const visibleSteps = isTrades ? STEPS : STEPS.filter((s) => s !== 'Trades');
  const currentStepName = visibleSteps[step];
  const isLastStep = step === visibleSteps.length - 1;

  // Build preview job object
  const previewJob: Job = {
    id: editId || 'preview',
    company_id: company?.id || '',
    title: title || 'Job Title',
    description: description || 'Job description will appear here...',
    spanish_description: spanishDesc || null,
    pay_min: payMin ? Number(payMin) : null,
    pay_max: payMax ? Number(payMax) : null,
    pay_type: payType as any,
    job_type: jobType as any,
    shift: shift as any,
    category: category || null,
    trade_category: isTrades ? (tradeCategory || null) : null,
    neighborhood: neighborhood || null,
    zip_code: zipCode || null,
    requirements: requirements || null,
    is_degree_required: isDegreeRequired,
    is_spanish_friendly: isSpanishFriendly,
    is_urgently_hiring: isUrgent,
    certifications_required: isTrades ? certifications : [],
    experience_level: null,
    union_status: (isTrades ? unionStatus : 'either') as any,
    has_benefits: hasBenefits,
    start_date: startDate || null,
    project_duration: isTrades ? (projectDuration || null) : null,
    overtime_available: overtimeAvailable,
    per_diem_included: isTrades ? perDiem : false,
    prevailing_wage: isTrades ? prevailingWage : false,
    status: 'active',
    views_count: 0,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    company: company || undefined,
  };

  function canProceed(): boolean {
    if (currentStepName === 'Basics') return !!title && !!jobType && !!shift;
    if (currentStepName === 'Details') return !!description;
    return true;
  }

  function toggleCert(cert: string) {
    setCertifications((prev) => prev.includes(cert) ? prev.filter((c) => c !== cert) : [...prev, cert]);
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      {/* Header */}
      <button
        onClick={() => navigate('/dashboard')}
        className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-navy mb-6 bg-transparent border-none cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Dashboard
      </button>

      <h1 className="text-2xl font-bold text-navy mb-2">
        {editId ? 'Edit Job Listing' : 'Post a New Job'}
      </h1>
      <p className="text-sm text-gray-500 mb-6">Fill in the details below. Target: under 2 minutes.</p>

      {/* Progress Bar */}
      <div className="flex items-center gap-1 mb-8">
        {visibleSteps.map((s, i) => (
          <div key={s} className="flex-1 flex items-center gap-1">
            <button
              onClick={() => { if (i < step) setStep(i); }}
              className={`flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full transition-colors cursor-pointer border-none ${
                i === step
                  ? 'bg-orange text-white'
                  : i < step
                  ? 'bg-green-50 text-green-700'
                  : 'bg-gray-100 text-gray-400'
              }`}
            >
              {i < step ? <Check className="w-3 h-3" /> : <span>{i + 1}</span>}
              <span className="hidden sm:inline">{s}</span>
            </button>
            {i < visibleSteps.length - 1 && (
              <div className={`flex-1 h-0.5 rounded ${i < step ? 'bg-green-300' : 'bg-gray-200'}`} />
            )}
          </div>
        ))}
      </div>

      {/* Step 1: Basics */}
      {currentStepName === 'Basics' && (
        <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-navy mb-1">Job Title *</label>
            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-navy outline-none focus:border-orange"
              placeholder="e.g. Warehouse Associate, HVAC Technician" />
          </div>

          <div>
            <label className="block text-sm font-medium text-navy mb-1">Category *</label>
            <select value={category} onChange={(e) => setCategory(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-navy outline-none focus:border-orange bg-white">
              <option value="">Select category...</option>
              {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-navy mb-1">Job Type *</label>
            <div className="flex flex-wrap gap-2">
              {JOB_TYPES.map((t) => (
                <button key={t.value} type="button" onClick={() => setJobType(t.value)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium border cursor-pointer transition-colors ${
                    jobType === t.value ? 'bg-orange text-white border-orange' : 'bg-white text-navy border-gray-300 hover:border-orange'
                  }`}>
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-navy mb-1">Shift *</label>
            <div className="flex flex-wrap gap-2">
              {SHIFTS.map((s) => (
                <button key={s.value} type="button" onClick={() => setShift(s.value)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium border cursor-pointer transition-colors ${
                    shift === s.value ? 'bg-navy text-white border-navy' : 'bg-white text-navy border-gray-300 hover:border-navy'
                  }`}>
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-navy mb-1">Pay Range</label>
            <div className="flex items-center gap-2">
              <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden flex-1">
                <span className="px-3 py-2.5 bg-gray-50 text-gray-400 text-sm border-r border-gray-300">$</span>
                <input type="number" value={payMin} onChange={(e) => setPayMin(e.target.value)}
                  className="flex-1 px-3 py-2.5 text-navy outline-none text-sm" placeholder="Min" />
              </div>
              <span className="text-gray-400">to</span>
              <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden flex-1">
                <span className="px-3 py-2.5 bg-gray-50 text-gray-400 text-sm border-r border-gray-300">$</span>
                <input type="number" value={payMax} onChange={(e) => setPayMax(e.target.value)}
                  className="flex-1 px-3 py-2.5 text-navy outline-none text-sm" placeholder="Max" />
              </div>
              <select value={payType} onChange={(e) => setPayType(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2.5 text-navy outline-none focus:border-orange bg-white text-sm">
                <option value="hourly">Hourly</option>
                <option value="salary">Salary</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-navy mb-1">Neighborhood</label>
              <input type="text" value={neighborhood} onChange={(e) => setNeighborhood(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-navy outline-none focus:border-orange text-sm"
                placeholder="e.g. East Toledo" />
            </div>
            <div>
              <label className="block text-sm font-medium text-navy mb-1">Zip Code</label>
              <input type="text" value={zipCode} onChange={(e) => setZipCode(e.target.value)} maxLength={5}
                className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-navy outline-none focus:border-orange text-sm"
                placeholder="43604" />
            </div>
          </div>

          <label className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all ${
            isUrgent ? 'border-red-300 bg-red-50' : 'border-gray-200'
          }`}>
            <input type="checkbox" checked={isUrgent} onChange={(e) => setIsUrgent(e.target.checked)} className="sr-only" />
            <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${isUrgent ? 'bg-red-500 border-red-500' : 'border-gray-300'}`}>
              {isUrgent && <Check className="w-3 h-3 text-white" />}
            </div>
            <div>
              <p className="text-sm font-medium text-navy">Urgently Hiring</p>
              <p className="text-xs text-gray-500">Adds a "Hiring Now" badge to your listing</p>
            </div>
          </label>
        </div>
      )}

      {/* Step 2: Details */}
      {currentStepName === 'Details' && (
        <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-navy mb-1">Job Description *</label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={6} required
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-navy outline-none focus:border-orange resize-none text-sm"
              placeholder="Describe the role, responsibilities, and what a typical day looks like..." />
          </div>

          <div>
            <label className="block text-sm font-medium text-navy mb-1">Requirements</label>
            <textarea value={requirements} onChange={(e) => setRequirements(e.target.value)} rows={3}
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-navy outline-none focus:border-orange resize-none text-sm"
              placeholder="List requirements (e.g. must be able to lift 50 lbs, valid driver's license...)" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { label: 'Degree Required', checked: isDegreeRequired, setter: setIsDegreeRequired },
              { label: 'Spanish-Friendly', checked: isSpanishFriendly, setter: setIsSpanishFriendly },
              { label: 'Benefits Offered', checked: hasBenefits, setter: setHasBenefits },
            ].map((toggle) => (
              <label key={toggle.label} className={`flex items-center gap-2 p-3 rounded-lg border cursor-pointer transition-all ${
                toggle.checked ? 'border-orange bg-orange/5' : 'border-gray-200'
              }`}>
                <input type="checkbox" checked={toggle.checked} onChange={(e) => toggle.setter(e.target.checked)} className="sr-only" />
                <div className={`w-5 h-5 rounded border-2 flex items-center justify-center shrink-0 ${toggle.checked ? 'bg-orange border-orange' : 'border-gray-300'}`}>
                  {toggle.checked && <Check className="w-3 h-3 text-white" />}
                </div>
                <span className="text-sm text-navy">{toggle.label}</span>
              </label>
            ))}
          </div>

          <div>
            <label className="block text-sm font-medium text-navy mb-1">Start Date</label>
            <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-navy outline-none focus:border-orange text-sm" />
          </div>

          {isSpanishFriendly && (
            <div>
              <label className="block text-sm font-medium text-navy mb-1">Spanish Description (optional)</label>
              <textarea value={spanishDesc} onChange={(e) => setSpanishDesc(e.target.value)} rows={3}
                className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-navy outline-none focus:border-orange resize-none text-sm"
                placeholder="Descripci&oacute;n del trabajo en espa&ntilde;ol..." />
            </div>
          )}
        </div>
      )}

      {/* Step 3: Trades Extras */}
      {currentStepName === 'Trades' && (
        <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-navy mb-1">Trade Category *</label>
            <select value={tradeCategory} onChange={(e) => setTradeCategory(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-navy outline-none focus:border-orange bg-white text-sm">
              <option value="">Select trade...</option>
              {TRADE_CATEGORIES.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-navy mb-2">Certifications Required</label>
            <div className="flex flex-wrap gap-2">
              {CERTIFICATIONS.map((cert) => (
                <button key={cert} type="button" onClick={() => toggleCert(cert)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium border cursor-pointer transition-colors ${
                    certifications.includes(cert) ? 'bg-orange text-white border-orange' : 'bg-white text-navy border-gray-300 hover:border-orange'
                  }`}>
                  {cert}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-navy mb-1">Tools Required</label>
            <textarea value={toolsRequired} onChange={(e) => setToolsRequired(e.target.value)} rows={2}
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-navy outline-none focus:border-orange resize-none text-sm"
              placeholder="List any tools workers need to bring..." />
          </div>

          <div>
            <label className="block text-sm font-medium text-navy mb-1">Union Status</label>
            <div className="flex gap-2">
              {[
                { value: 'union', label: 'Union' },
                { value: 'non_union', label: 'Non-Union' },
                { value: 'either', label: 'Either' },
              ].map((opt) => (
                <button key={opt.value} type="button" onClick={() => setUnionStatus(opt.value)}
                  className={`flex-1 py-2.5 rounded-lg text-sm font-medium border cursor-pointer transition-colors ${
                    unionStatus === opt.value ? 'bg-navy text-white border-navy' : 'bg-white text-navy border-gray-300 hover:border-navy'
                  }`}>
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-navy mb-1">Project Duration</label>
            <input type="text" value={projectDuration} onChange={(e) => setProjectDuration(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-navy outline-none focus:border-orange text-sm"
              placeholder="e.g. 6 months, Ongoing, 2 years" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { label: 'Overtime Available', checked: overtimeAvailable, setter: setOvertimeAvailable },
              { label: 'Per Diem Included', checked: perDiem, setter: setPerDiem },
              { label: 'Prevailing Wage', checked: prevailingWage, setter: setPrevailingWage },
            ].map((toggle) => (
              <label key={toggle.label} className={`flex items-center gap-2 p-3 rounded-lg border cursor-pointer transition-all ${
                toggle.checked ? 'border-orange bg-orange/5' : 'border-gray-200'
              }`}>
                <input type="checkbox" checked={toggle.checked} onChange={(e) => toggle.setter(e.target.checked)} className="sr-only" />
                <div className={`w-5 h-5 rounded border-2 flex items-center justify-center shrink-0 ${toggle.checked ? 'bg-orange border-orange' : 'border-gray-300'}`}>
                  {toggle.checked && <Check className="w-3 h-3 text-white" />}
                </div>
                <span className="text-sm text-navy">{toggle.label}</span>
              </label>
            ))}
          </div>
        </div>
      )}

      {/* Step 4: Preview */}
      {currentStepName === 'Preview' && (
        <div className="space-y-6">
          <div className="flex items-center gap-2 bg-blue-50 text-blue-700 px-4 py-3 rounded-lg text-sm">
            <Eye className="w-4 h-4 shrink-0" />
            This is how your listing will appear to job seekers
          </div>

          {/* Card Preview */}
          <div className="max-w-lg">
            <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-2">Job Card Preview</p>
            <JobCard job={previewJob} />
          </div>

          {/* Full Detail Preview */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-4">Full Listing Preview</p>

            <p className="text-sm text-gray-500">{company?.company_name}</p>
            <h2 className="text-2xl font-bold text-navy mt-1">{previewJob.title || 'Job Title'}</h2>
            <p className="text-2xl font-extrabold text-orange mt-2">
              {previewJob.pay_min || previewJob.pay_max
                ? `$${previewJob.pay_min || '?'}–$${previewJob.pay_max || '?'}/${payType === 'hourly' ? 'hr' : 'yr'}`
                : 'Pay not listed'}
            </p>

            {previewJob.description && (
              <div className="mt-4">
                <h3 className="text-sm font-bold text-navy mb-1">About this role</h3>
                <p className="text-sm text-gray-700 whitespace-pre-wrap">{previewJob.description}</p>
              </div>
            )}

            {previewJob.requirements && (
              <div className="mt-4">
                <h3 className="text-sm font-bold text-navy mb-1">Requirements</h3>
                <p className="text-sm text-gray-700 whitespace-pre-wrap">{previewJob.requirements}</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between mt-6">
        <button
          onClick={() => setStep(Math.max(0, step - 1))}
          disabled={step === 0}
          className="flex items-center gap-1 text-sm text-gray-500 hover:text-navy bg-transparent border-none cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <ArrowLeft className="w-4 h-4" /> Back
        </button>

        {isLastStep ? (
          <button
            onClick={() => publishMutation.mutate()}
            disabled={publishMutation.isPending || !canProceed()}
            className="bg-orange hover:bg-orange-dark text-white px-8 py-3 rounded-lg font-semibold transition-colors cursor-pointer border-none disabled:opacity-50 flex items-center gap-2"
          >
            {publishMutation.isPending ? (
              <><Loader2 className="w-4 h-4 animate-spin" /> Publishing...</>
            ) : (
              <><Briefcase className="w-4 h-4" /> {editId ? 'Update Listing' : 'Confirm & Publish'}</>
            )}
          </button>
        ) : (
          <button
            onClick={() => setStep(Math.min(visibleSteps.length - 1, step + 1))}
            disabled={!canProceed()}
            className="bg-navy hover:bg-navy-light text-white px-6 py-3 rounded-lg font-semibold transition-colors cursor-pointer border-none disabled:opacity-50 flex items-center gap-1"
          >
            Next <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}
