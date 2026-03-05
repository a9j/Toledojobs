import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, ChevronRight, ChevronLeft, Eye } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';
import { useCompany } from '../../hooks/useCompany';
import { useCreateJob } from '../../hooks/useJobs';
import {
  JOB_CATEGORIES,
  TRADE_CATEGORIES,
  SHIFTS,
  SHIFT_LABELS,
  CERTIFICATIONS,
} from '../../lib/constants';
import { cn, formatPay } from '../../lib/utils';
import type { Job } from '../../types';
import Card from '../ui/Card';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Select from '../ui/Select';
import Toggle from '../ui/Toggle';
import Badge from '../ui/Badge';

type FormData = {
  title: string;
  category: string;
  job_type: Job['job_type'];
  shift: string;
  pay_min: string;
  pay_max: string;
  pay_type: Job['pay_type'];
  description: string;
  requirements: string;
  is_degree_required: boolean;
  is_spanish_friendly: boolean;
  is_urgently_hiring: boolean;
  has_benefits: boolean;
  spanish_description: string;
  trade_category: string;
  certifications_required: string[];
  union_status: Job['union_status'];
  project_duration: string;
  overtime_available: boolean;
  per_diem_included: boolean;
  prevailing_wage: boolean;
};

const INITIAL_FORM: FormData = {
  title: '',
  category: '',
  job_type: 'full_time',
  shift: '',
  pay_min: '',
  pay_max: '',
  pay_type: 'hourly',
  description: '',
  requirements: '',
  is_degree_required: false,
  is_spanish_friendly: false,
  is_urgently_hiring: false,
  has_benefits: false,
  spanish_description: '',
  trade_category: '',
  certifications_required: [],
  union_status: null,
  project_duration: '',
  overtime_available: false,
  per_diem_included: false,
  prevailing_wage: false,
};

const STEPS = ['Basics', 'Details', 'Trades Extras', 'Preview & Post'] as const;

const JOB_TYPE_OPTIONS = [
  { value: 'full_time', label: 'Full Time' },
  { value: 'part_time', label: 'Part Time' },
  { value: 'contract', label: 'Contract' },
  { value: 'temp', label: 'Temporary' },
  { value: 'seasonal', label: 'Seasonal' },
];

const PAY_TYPE_OPTIONS = [
  { value: 'hourly', label: 'Hourly' },
  { value: 'salary', label: 'Salary' },
  { value: 'per_diem', label: 'Per Diem' },
  { value: 'commission', label: 'Commission' },
];

const UNION_OPTIONS = [
  { value: '', label: 'Not specified' },
  { value: 'union', label: 'Union' },
  { value: 'non_union', label: 'Non-Union' },
  { value: 'either', label: 'Either' },
];

export default function PostJobForm() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { data: company } = useCompany(user?.id);
  const createJob = useCreateJob();

  const [step, setStep] = useState(0);
  const [form, setForm] = useState<FormData>(INITIAL_FORM);

  const isTradesCategory = form.category === 'Construction/Trades';

  // Determine actual steps (skip trades step if not applicable)
  const activeSteps = useMemo(() => {
    if (isTradesCategory) return STEPS;
    return [STEPS[0], STEPS[1], STEPS[3]] as const;
  }, [isTradesCategory]);

  const totalSteps = activeSteps.length;

  function update<K extends keyof FormData>(key: K, value: FormData[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function toggleCert(cert: string) {
    setForm((prev) => ({
      ...prev,
      certifications_required: prev.certifications_required.includes(cert)
        ? prev.certifications_required.filter((c) => c !== cert)
        : [...prev.certifications_required, cert],
    }));
  }

  function canAdvance(): boolean {
    if (step === 0) {
      return !!(form.title.trim() && form.category && form.job_type);
    }
    if (step === 1 || (step === 1 && activeSteps.length === 3)) {
      return !!form.description.trim();
    }
    return true;
  }

  function nextStep() {
    if (step < totalSteps - 1) setStep(step + 1);
  }

  function prevStep() {
    if (step > 0) setStep(step - 1);
  }

  async function handlePublish() {
    if (!company) {
      toast.error('Please create a company profile first.');
      return;
    }

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 30);

    try {
      await createJob.mutateAsync({
        company_id: company.id,
        title: form.title.trim(),
        category: form.category,
        job_type: form.job_type,
        shift: form.shift || null,
        pay_min: form.pay_min ? parseFloat(form.pay_min) : null,
        pay_max: form.pay_max ? parseFloat(form.pay_max) : null,
        pay_type: form.pay_type,
        description: form.description.trim(),
        requirements: form.requirements.trim() || null,
        is_degree_required: form.is_degree_required,
        is_spanish_friendly: form.is_spanish_friendly,
        is_urgently_hiring: form.is_urgently_hiring,
        has_benefits: form.has_benefits,
        spanish_description: form.spanish_description.trim() || null,
        trade_category: isTradesCategory ? form.trade_category || null : null,
        certifications_required: isTradesCategory ? form.certifications_required : [],
        union_status: isTradesCategory ? form.union_status : null,
        project_duration: isTradesCategory ? form.project_duration || null : null,
        overtime_available: isTradesCategory ? form.overtime_available : false,
        per_diem_included: isTradesCategory ? form.per_diem_included : false,
        prevailing_wage: isTradesCategory ? form.prevailing_wage : false,
        zip_code: company.zip_code,
        status: 'active',
        views_count: 0,
        expires_at: expiresAt.toISOString(),
      });
      toast.success('Job posted successfully!');
      navigate('/employer');
    } catch {
      toast.error('Failed to post job. Please try again.');
    }
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-navy mb-6">Post a New Job</h1>

      {/* Step Indicator */}
      <div className="flex items-center mb-8">
        {activeSteps.map((label, i) => (
          <div key={label} className="flex items-center flex-1 last:flex-none">
            <button
              type="button"
              onClick={() => i < step && setStep(i)}
              className={cn(
                'flex items-center gap-2 text-sm font-medium',
                i <= step ? 'text-orange' : 'text-gray-400',
                i < step && 'cursor-pointer'
              )}
            >
              <span
                className={cn(
                  'w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border-2',
                  i < step && 'bg-orange border-orange text-white',
                  i === step && 'border-orange text-orange',
                  i > step && 'border-gray-300 text-gray-400'
                )}
              >
                {i < step ? <Check className="w-4 h-4" /> : i + 1}
              </span>
              <span className="hidden sm:inline">{label}</span>
            </button>
            {i < activeSteps.length - 1 && (
              <div
                className={cn(
                  'flex-1 h-0.5 mx-2',
                  i < step ? 'bg-orange' : 'bg-gray-200'
                )}
              />
            )}
          </div>
        ))}
      </div>

      {/* Step 1: Basics */}
      {step === 0 && (
        <Card className="space-y-5">
          <Input
            label="Job Title"
            placeholder="e.g. Warehouse Associate, Welder, CNA"
            value={form.title}
            onChange={(e) => update('title', e.target.value)}
          />

          <Select
            label="Category"
            placeholder="Select a category"
            options={JOB_CATEGORIES.map((c) => ({ value: c, label: c }))}
            value={form.category}
            onChange={(e) => update('category', e.target.value)}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Select
              label="Job Type"
              options={JOB_TYPE_OPTIONS}
              value={form.job_type}
              onChange={(e) => update('job_type', e.target.value as Job['job_type'])}
            />
            <Select
              label="Shift"
              placeholder="Select shift"
              options={SHIFTS.map((s) => ({ value: s, label: SHIFT_LABELS[s] }))}
              value={form.shift}
              onChange={(e) => update('shift', e.target.value)}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Input
              label="Pay Min"
              type="number"
              placeholder="0.00"
              value={form.pay_min}
              onChange={(e) => update('pay_min', e.target.value)}
            />
            <Input
              label="Pay Max"
              type="number"
              placeholder="0.00"
              value={form.pay_max}
              onChange={(e) => update('pay_max', e.target.value)}
            />
            <Select
              label="Pay Type"
              options={PAY_TYPE_OPTIONS}
              value={form.pay_type}
              onChange={(e) => update('pay_type', e.target.value as Job['pay_type'])}
            />
          </div>
        </Card>
      )}

      {/* Step 2: Details */}
      {step === 1 && (
        <Card className="space-y-5">
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <textarea
              className="w-full px-4 py-3 rounded-card border border-gray-300 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange/50 focus:border-orange placeholder:text-gray-400 font-body min-h-[140px]"
              placeholder="Describe the job, responsibilities, and what makes it a great opportunity..."
              value={form.description}
              onChange={(e) => update('description', e.target.value)}
              rows={6}
            />
          </div>

          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">Requirements</label>
            <textarea
              className="w-full px-4 py-3 rounded-card border border-gray-300 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange/50 focus:border-orange placeholder:text-gray-400 font-body min-h-[100px]"
              placeholder="List requirements, experience, or qualifications..."
              value={form.requirements}
              onChange={(e) => update('requirements', e.target.value)}
              rows={4}
            />
          </div>

          <div className="space-y-3 pt-2">
            <Toggle
              label="Degree Required"
              description="Does this position require a college degree?"
              checked={form.is_degree_required}
              onChange={(v) => update('is_degree_required', v)}
            />
            <Toggle
              label="Spanish Friendly"
              description="Is this workplace accommodating for Spanish speakers?"
              checked={form.is_spanish_friendly}
              onChange={(v) => update('is_spanish_friendly', v)}
            />
            <Toggle
              label="Urgently Hiring"
              description="Looking to fill this position ASAP?"
              checked={form.is_urgently_hiring}
              onChange={(v) => update('is_urgently_hiring', v)}
            />
            <Toggle
              label="Benefits Included"
              description="Does this position include health, dental, or other benefits?"
              checked={form.has_benefits}
              onChange={(v) => update('has_benefits', v)}
            />
          </div>

          {form.is_spanish_friendly && (
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">
                Spanish Description (optional)
              </label>
              <textarea
                className="w-full px-4 py-3 rounded-card border border-gray-300 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange/50 focus:border-orange placeholder:text-gray-400 font-body min-h-[100px]"
                placeholder="Descripcion del trabajo en espanol..."
                value={form.spanish_description}
                onChange={(e) => update('spanish_description', e.target.value)}
                rows={4}
              />
            </div>
          )}
        </Card>
      )}

      {/* Step 3: Trades Extras (only if Construction/Trades) */}
      {step === 2 && isTradesCategory && (
        <Card className="space-y-5">
          <Select
            label="Trade Category"
            placeholder="Select a trade"
            options={TRADE_CATEGORIES.map((t) => ({ value: t, label: t }))}
            value={form.trade_category}
            onChange={(e) => update('trade_category', e.target.value)}
          />

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Certifications Required
            </label>
            <div className="flex flex-wrap gap-2">
              {CERTIFICATIONS.map((cert) => (
                <button
                  key={cert}
                  type="button"
                  onClick={() => toggleCert(cert)}
                  className={cn(
                    'px-3 py-1.5 text-sm rounded-full border transition-colors',
                    form.certifications_required.includes(cert)
                      ? 'bg-orange text-white border-orange'
                      : 'bg-white text-gray-700 border-gray-300 hover:border-orange'
                  )}
                >
                  {cert}
                </button>
              ))}
            </div>
          </div>

          <Select
            label="Union Status"
            options={UNION_OPTIONS}
            value={form.union_status ?? ''}
            onChange={(e) =>
              update('union_status', (e.target.value || null) as Job['union_status'])
            }
          />

          <Input
            label="Project Duration"
            placeholder="e.g. 6 months, Ongoing, Through 2026"
            value={form.project_duration}
            onChange={(e) => update('project_duration', e.target.value)}
          />

          <div className="space-y-3 pt-2">
            <Toggle
              label="Overtime Available"
              checked={form.overtime_available}
              onChange={(v) => update('overtime_available', v)}
            />
            <Toggle
              label="Per Diem Included"
              checked={form.per_diem_included}
              onChange={(v) => update('per_diem_included', v)}
            />
            <Toggle
              label="Prevailing Wage"
              checked={form.prevailing_wage}
              onChange={(v) => update('prevailing_wage', v)}
            />
          </div>
        </Card>
      )}

      {/* Step 4 (or 3 for non-trades): Preview */}
      {step === totalSteps - 1 && (
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
            <Eye className="w-4 h-4" />
            Preview &mdash; this is how your listing will appear to job seekers
          </div>

          <Card className="space-y-4">
            <h2 className="text-xl font-bold text-navy">{form.title || 'Job Title'}</h2>
            <p className="text-sm text-gray-600">{company?.company_name}</p>

            <p className="text-2xl font-bold text-orange">
              {formatPay(
                form.pay_min ? parseFloat(form.pay_min) : null,
                form.pay_max ? parseFloat(form.pay_max) : null,
                form.pay_type
              )}
            </p>

            <div className="flex flex-wrap gap-2">
              <Badge variant="gray">{form.category || 'Category'}</Badge>
              {form.shift && (
                <Badge variant="gray">{SHIFT_LABELS[form.shift] || form.shift}</Badge>
              )}
              {form.job_type && (
                <Badge variant="navy">
                  {JOB_TYPE_OPTIONS.find((o) => o.value === form.job_type)?.label}
                </Badge>
              )}
              {form.is_urgently_hiring && <Badge variant="red">Hiring Now</Badge>}
              {!form.is_degree_required && <Badge variant="green">No Degree</Badge>}
              {form.is_spanish_friendly && <Badge variant="navy">Spanish Friendly</Badge>}
              {form.has_benefits && <Badge variant="green">Benefits</Badge>}
            </div>

            {isTradesCategory && (
              <div className="flex flex-wrap gap-2">
                {form.trade_category && (
                  <Badge variant="orange">{form.trade_category}</Badge>
                )}
                {form.union_status && (
                  <Badge variant="gray">
                    {UNION_OPTIONS.find((o) => o.value === form.union_status)?.label}
                  </Badge>
                )}
                {form.overtime_available && <Badge variant="green">OT Available</Badge>}
                {form.per_diem_included && <Badge variant="green">Per Diem</Badge>}
                {form.prevailing_wage && <Badge variant="green">Prevailing Wage</Badge>}
              </div>
            )}

            {form.description && (
              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-1">Description</h3>
                <p className="text-sm text-gray-600 whitespace-pre-line">{form.description}</p>
              </div>
            )}

            {form.requirements && (
              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-1">Requirements</h3>
                <p className="text-sm text-gray-600 whitespace-pre-line">{form.requirements}</p>
              </div>
            )}

            {isTradesCategory && form.certifications_required.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-1">
                  Certifications Required
                </h3>
                <div className="flex flex-wrap gap-1.5">
                  {form.certifications_required.map((cert) => (
                    <Badge key={cert} variant="orange">
                      {cert}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {form.project_duration && (
              <p className="text-sm text-gray-600">
                <span className="font-medium">Project Duration:</span> {form.project_duration}
              </p>
            )}
          </Card>
        </div>
      )}

      {/* Navigation */}
      <div className="flex items-center justify-between mt-6">
        {step > 0 ? (
          <Button variant="outline" onClick={prevStep}>
            <ChevronLeft className="w-4 h-4 mr-1" />
            Back
          </Button>
        ) : (
          <div />
        )}

        {step < totalSteps - 1 ? (
          <Button onClick={nextStep} disabled={!canAdvance()}>
            Next
            <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        ) : (
          <Button onClick={handlePublish} loading={createJob.isPending}>
            Publish Job
          </Button>
        )}
      </div>
    </div>
  );
}
