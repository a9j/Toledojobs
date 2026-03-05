export type Role = 'job_seeker' | 'employer';
export type Language = 'en' | 'es';
export type PayType = 'hourly' | 'salary' | 'per_diem' | 'commission';
export type JobType = 'full_time' | 'part_time' | 'contract' | 'temp' | 'seasonal';
export type Shift = 'first' | 'second' | 'third' | 'flexible' | 'weekends' | 'rotating';
export type JobStatus = 'active' | 'closed' | 'draft';
export type ApplicationStatus = 'applied' | 'reviewed' | 'interview' | 'hired' | 'rejected';
export type ExperienceLevel = 'apprentice' | 'journeyman' | 'master';
export type UnionStatus = 'union' | 'non_union' | 'either';
export type SubscriptionTier = 'free' | 'starter' | 'pro' | 'recruiter';
export type EducationLevel = 'no_diploma' | 'ged' | 'high_school' | 'some_college' | 'associates' | 'bachelors_plus';
export type UnionMembership = 'union_member' | 'willing_to_join' | 'non_union_only';

export interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  phone: string | null;
  zip_code: string | null;
  role: Role;
  preferred_language: Language;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface Company {
  id: string;
  owner_id: string;
  company_name: string;
  industry: string | null;
  description: string | null;
  logo_url: string | null;
  website: string | null;
  phone: string | null;
  address: string | null;
  zip_code: string | null;
  is_founding_employer: boolean;
  subscription_tier: SubscriptionTier;
  created_at: string;
  updated_at: string;
}

export interface Job {
  id: string;
  company_id: string;
  title: string;
  description: string;
  spanish_description: string | null;
  pay_min: number | null;
  pay_max: number | null;
  pay_type: PayType;
  job_type: JobType;
  shift: Shift;
  category: string | null;
  trade_category: string | null;
  neighborhood: string | null;
  zip_code: string | null;
  requirements: string | null;
  is_degree_required: boolean;
  is_spanish_friendly: boolean;
  is_urgently_hiring: boolean;
  certifications_required: string[];
  experience_level: string | null;
  union_status: UnionStatus;
  has_benefits: boolean;
  start_date: string | null;
  project_duration: string | null;
  overtime_available: boolean;
  per_diem_included: boolean;
  prevailing_wage: boolean;
  status: JobStatus;
  views_count: number;
  created_at: string;
  updated_at: string;
  expires_at: string;
  // Joined data
  company?: Company;
}

export interface Application {
  id: string;
  job_id: string;
  applicant_id: string;
  status: ApplicationStatus;
  candidate_summary: string | null;
  applied_at: string;
  updated_at: string;
  notes: string | null;
}

export interface SkillsCard {
  id: string;
  profile_id: string;
  trade_category: string | null;
  experience_years: number | null;
  experience_level: ExperienceLevel | null;
  certifications: Record<string, unknown> | null;
  tools_owned: string[];
  has_reliable_transport: boolean;
  has_own_tools: boolean;
  has_ppe: boolean;
  union_status: UnionMembership;
  available_now: boolean;
  willing_to_travel: boolean;
  availability_notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface SeekerProfile {
  id: string;
  profile_id: string;
  job_categories: string[];
  preferred_shifts: string[];
  has_reliable_transport: boolean;
  speaks_spanish: boolean;
  education_level: EducationLevel | null;
  experience_years: number | null;
  created_at: string;
  updated_at: string;
}

export interface SavedJob {
  id: string;
  profile_id: string;
  job_id: string;
  saved_at: string;
}
