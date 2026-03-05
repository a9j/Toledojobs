export interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  phone: string | null;
  zip_code: string | null;
  role: 'job_seeker' | 'employer';
  preferred_language: 'en' | 'es';
  avatar_url: string | null;
  created_at: string;
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
  subscription_tier: 'free' | 'starter' | 'pro' | 'recruiter';
  created_at: string;
}

export interface Job {
  id: string;
  company_id: string;
  company?: Company;
  title: string;
  description: string;
  spanish_description: string | null;
  pay_min: number | null;
  pay_max: number | null;
  pay_type: 'hourly' | 'salary' | 'per_diem' | 'commission';
  job_type: 'full_time' | 'part_time' | 'contract' | 'temp' | 'seasonal';
  shift: string | null;
  category: string;
  trade_category: string | null;
  neighborhood: string | null;
  zip_code: string | null;
  requirements: string | null;
  is_degree_required: boolean;
  is_spanish_friendly: boolean;
  is_urgently_hiring: boolean;
  certifications_required: string[];
  experience_level: string | null;
  union_status: 'union' | 'non_union' | 'either' | null;
  has_benefits: boolean;
  start_date: string | null;
  project_duration: string | null;
  overtime_available: boolean;
  per_diem_included: boolean;
  prevailing_wage: boolean;
  status: 'active' | 'closed' | 'draft';
  views_count: number;
  created_at: string;
  expires_at: string;
}

export interface Application {
  id: string;
  job_id: string;
  job?: Job;
  applicant_id: string;
  applicant?: Profile;
  status: 'applied' | 'reviewed' | 'interview' | 'hired' | 'rejected';
  candidate_summary: string | null;
  applied_at: string;
  notes: string | null;
}

export interface SkillsCard {
  id: string;
  profile_id: string;
  trade_category: string;
  experience_years: number | null;
  experience_level: 'apprentice' | 'journeyman' | 'master' | null;
  certifications: { name: string; year?: number }[];
  tools_owned: string[];
  has_reliable_transport: boolean;
  has_own_tools: boolean;
  has_ppe: boolean;
  union_status: 'union_member' | 'willing_to_join' | 'non_union_only' | null;
  available_now: boolean;
  willing_to_travel: boolean;
  availability_notes: string | null;
}

export interface SeekerProfile {
  id: string;
  profile_id: string;
  job_categories: string[];
  preferred_shifts: string[];
  has_reliable_transport: boolean;
  speaks_spanish: boolean;
  education_level: string | null;
  experience_years: string | null;
}
