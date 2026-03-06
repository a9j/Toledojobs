import { useQuery } from '@tanstack/react-query';
import { Loader2, AlertCircle, Briefcase } from 'lucide-react';
import { useJobStore } from '../store/jobStore';
import { fetchJobs } from '../lib/queries';
import JobCard from './JobCard';
import type { Job } from '../types/database';

// Sample placeholder jobs for when Supabase isn't connected yet
const placeholderJobs: Job[] = [
  {
    id: '1',
    company_id: '1',
    title: 'Warehouse Associate',
    description: 'Full-time warehouse position with benefits.',
    spanish_description: null,
    pay_min: 17,
    pay_max: 20,
    pay_type: 'hourly',
    job_type: 'full_time',
    shift: 'first',
    category: 'Warehouse',
    trade_category: null,
    neighborhood: 'East Toledo',
    zip_code: '43605',
    requirements: null,
    is_degree_required: false,
    is_spanish_friendly: true,
    is_urgently_hiring: true,
    certifications_required: [],
    experience_level: null,
    union_status: 'either',
    has_benefits: true,
    start_date: null,
    project_duration: null,
    overtime_available: true,
    per_diem_included: false,
    prevailing_wage: false,
    status: 'active',
    views_count: 42,
    created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date().toISOString(),
    expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    company: {
      id: '1',
      owner_id: '1',
      company_name: 'Toledo Logistics Co.',
      industry: 'Logistics',
      description: null,
      logo_url: null,
      website: null,
      phone: null,
      address: null,
      zip_code: '43605',
      is_founding_employer: true,
      subscription_tier: 'starter',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  },
  {
    id: '2',
    company_id: '2',
    title: 'CNC Machinist',
    description: 'Experienced CNC machinist needed for precision manufacturing.',
    spanish_description: null,
    pay_min: 24,
    pay_max: 32,
    pay_type: 'hourly',
    job_type: 'full_time',
    shift: 'second',
    category: null,
    trade_category: 'Machining',
    neighborhood: 'Maumee',
    zip_code: '43537',
    requirements: '3+ years CNC experience',
    is_degree_required: false,
    is_spanish_friendly: false,
    is_urgently_hiring: false,
    certifications_required: [],
    experience_level: 'journeyman',
    union_status: 'union',
    has_benefits: true,
    start_date: null,
    project_duration: null,
    overtime_available: true,
    per_diem_included: false,
    prevailing_wage: false,
    status: 'active',
    views_count: 28,
    created_at: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date().toISOString(),
    expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    company: {
      id: '2',
      owner_id: '2',
      company_name: 'Precision Parts MFG',
      industry: 'Manufacturing',
      description: null,
      logo_url: null,
      website: null,
      phone: null,
      address: null,
      zip_code: '43537',
      is_founding_employer: false,
      subscription_tier: 'pro',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  },
  {
    id: '3',
    company_id: '3',
    title: 'Medical Assistant',
    description: 'Join our healthcare team as a medical assistant.',
    spanish_description: 'Únase a nuestro equipo de salud como asistente médico.',
    pay_min: 16,
    pay_max: 19,
    pay_type: 'hourly',
    job_type: 'full_time',
    shift: 'first',
    category: 'Healthcare',
    trade_category: null,
    neighborhood: 'West Toledo',
    zip_code: '43615',
    requirements: null,
    is_degree_required: false,
    is_spanish_friendly: true,
    is_urgently_hiring: true,
    certifications_required: ['CPR'],
    experience_level: null,
    union_status: 'non_union',
    has_benefits: true,
    start_date: null,
    project_duration: null,
    overtime_available: false,
    per_diem_included: false,
    prevailing_wage: false,
    status: 'active',
    views_count: 56,
    created_at: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date().toISOString(),
    expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    company: {
      id: '3',
      owner_id: '3',
      company_name: 'ProMedica Health',
      industry: 'Healthcare',
      description: null,
      logo_url: null,
      website: null,
      phone: null,
      address: null,
      zip_code: '43615',
      is_founding_employer: true,
      subscription_tier: 'pro',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  },
  {
    id: '4',
    company_id: '4',
    title: 'Line Cook',
    description: 'Fast-paced kitchen looking for experienced line cook.',
    spanish_description: null,
    pay_min: 15,
    pay_max: 18,
    pay_type: 'hourly',
    job_type: 'full_time',
    shift: 'flexible',
    category: 'Restaurant/Service',
    trade_category: null,
    neighborhood: 'Downtown Toledo',
    zip_code: '43604',
    requirements: null,
    is_degree_required: false,
    is_spanish_friendly: true,
    is_urgently_hiring: false,
    certifications_required: [],
    experience_level: null,
    union_status: 'non_union',
    has_benefits: false,
    start_date: null,
    project_duration: null,
    overtime_available: true,
    per_diem_included: false,
    prevailing_wage: false,
    status: 'active',
    views_count: 19,
    created_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date().toISOString(),
    expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    company: {
      id: '4',
      owner_id: '4',
      company_name: 'The Chop House',
      industry: 'Restaurant',
      description: null,
      logo_url: null,
      website: null,
      phone: null,
      address: null,
      zip_code: '43604',
      is_founding_employer: false,
      subscription_tier: 'free',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  },
  {
    id: '5',
    company_id: '5',
    title: 'Electrician Apprentice',
    description: 'Join IBEW Local 8 apprenticeship program.',
    spanish_description: null,
    pay_min: 18,
    pay_max: 22,
    pay_type: 'hourly',
    job_type: 'full_time',
    shift: 'first',
    category: null,
    trade_category: 'Electrical',
    neighborhood: 'Sylvania',
    zip_code: '43560',
    requirements: 'High school diploma or GED',
    is_degree_required: false,
    is_spanish_friendly: false,
    is_urgently_hiring: true,
    certifications_required: [],
    experience_level: 'apprentice',
    union_status: 'union',
    has_benefits: true,
    start_date: null,
    project_duration: null,
    overtime_available: true,
    per_diem_included: false,
    prevailing_wage: true,
    status: 'active',
    views_count: 73,
    created_at: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date().toISOString(),
    expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    company: {
      id: '5',
      owner_id: '5',
      company_name: 'IBEW Local 8',
      industry: 'Trades',
      description: null,
      logo_url: null,
      website: null,
      phone: null,
      address: null,
      zip_code: '43560',
      is_founding_employer: true,
      subscription_tier: 'pro',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  },
  {
    id: '6',
    company_id: '6',
    title: 'Forklift Operator',
    description: 'Forklift operator needed for 3rd shift warehouse operations.',
    spanish_description: 'Operador de montacargas necesario para turno nocturno.',
    pay_min: 19,
    pay_max: 23,
    pay_type: 'hourly',
    job_type: 'full_time',
    shift: 'third',
    category: 'Warehouse',
    trade_category: null,
    neighborhood: 'Northwood',
    zip_code: '43619',
    requirements: 'Valid forklift certification',
    is_degree_required: false,
    is_spanish_friendly: true,
    is_urgently_hiring: false,
    certifications_required: ['Forklift'],
    experience_level: null,
    union_status: 'either',
    has_benefits: true,
    start_date: null,
    project_duration: null,
    overtime_available: true,
    per_diem_included: false,
    prevailing_wage: false,
    status: 'active',
    views_count: 31,
    created_at: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date().toISOString(),
    expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    company: {
      id: '6',
      owner_id: '6',
      company_name: 'Great Lakes Distribution',
      industry: 'Logistics',
      description: null,
      logo_url: null,
      website: null,
      phone: null,
      address: null,
      zip_code: '43619',
      is_founding_employer: false,
      subscription_tier: 'starter',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  },
];

export default function JobFeed() {
  const filters = useJobStore((s) => s.filters);

  const { data: jobs, isLoading, error } = useQuery({
    queryKey: ['jobs', filters],
    queryFn: () => fetchJobs(filters),
    retry: false,
  });

  // Use placeholder jobs when Supabase isn't configured or returns error
  const displayJobs = error ? placeholderJobs : jobs;
  const showingPlaceholder = !!error;

  return (
    <section className="max-w-5xl mx-auto px-4 mt-10">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-navy flex items-center gap-2">
          <Briefcase className="w-6 h-6 text-orange" />
          Hiring Now
        </h2>
        {showingPlaceholder && (
          <span className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded">
            Sample listings
          </span>
        )}
      </div>

      {isLoading && (
        <div className="flex justify-center py-12">
          <Loader2 className="w-8 h-8 text-orange animate-spin" />
        </div>
      )}

      {!isLoading && error && (
        <div className="flex items-center gap-2 bg-amber-50 text-amber-700 px-4 py-3 rounded-lg mb-6 text-sm">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>
            Showing sample jobs. Connect your Supabase project to see live listings.
          </span>
        </div>
      )}

      {!isLoading && displayJobs && displayJobs.length > 0 && (
        <div className="grid gap-4 md:grid-cols-2">
          {displayJobs.map((job) => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>
      )}

      {!isLoading && !error && jobs && jobs.length === 0 && (
        <div className="text-center py-12 text-gray-400">
          <Briefcase className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p className="text-lg font-medium">No jobs found</p>
          <p className="text-sm mt-1">Try adjusting your filters</p>
        </div>
      )}
    </section>
  );
}
