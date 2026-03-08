import { supabase } from './supabase';
import type { Job, Application, Company } from '../types/database';

interface FetchJobsParams {
  search?: string;
  zipCode?: string;
  hiringNow?: boolean;
  noDegree?: boolean;
  spanishFriendly?: boolean;
  trades?: boolean;
  warehouse?: boolean;
  healthcare?: boolean;
  restaurant?: boolean;
  pay15Plus?: boolean;
  pay20Plus?: boolean;
  secondShift?: boolean;
  thirdShift?: boolean;
}

export async function fetchJobs(params: FetchJobsParams = {}): Promise<Job[]> {
  let query = supabase
    .from('jobs')
    .select('*, company:companies(*)')
    .eq('status', 'active')
    .order('created_at', { ascending: false })
    .limit(20);

  if (params.search) {
    query = query.ilike('title', `%${params.search}%`);
  }

  if (params.zipCode) {
    query = query.eq('zip_code', params.zipCode);
  }

  if (params.hiringNow) {
    query = query.eq('is_urgently_hiring', true);
  }

  if (params.noDegree) {
    query = query.eq('is_degree_required', false);
  }

  if (params.spanishFriendly) {
    query = query.eq('is_spanish_friendly', true);
  }

  if (params.trades) {
    query = query.not('trade_category', 'is', null);
  }

  if (params.warehouse) {
    query = query.eq('category', 'Warehouse');
  }

  if (params.healthcare) {
    query = query.eq('category', 'Healthcare');
  }

  if (params.restaurant) {
    query = query.eq('category', 'Restaurant/Service');
  }

  if (params.pay15Plus) {
    query = query.gte('pay_min', 15);
  }

  if (params.pay20Plus) {
    query = query.gte('pay_min', 20);
  }

  if (params.secondShift) {
    query = query.eq('shift', 'second');
  }

  if (params.thirdShift) {
    query = query.eq('shift', 'third');
  }

  const { data, error } = await query;

  if (error) {
    throw new Error(error.message);
  }

  return (data as Job[]) ?? [];
}

export async function fetchJobById(id: string): Promise<Job> {
  const { data, error } = await supabase
    .from('jobs')
    .select('*, company:companies(*)')
    .eq('id', id)
    .single();

  if (error) throw new Error(error.message);
  return data as Job;
}

// ---- Saved jobs ----

export async function fetchSavedJobs(userId: string): Promise<string[]> {
  const { data, error } = await supabase
    .from('saved_jobs')
    .select('job_id')
    .eq('profile_id', userId);

  if (error) throw new Error(error.message);
  return (data ?? []).map((r) => r.job_id);
}

export async function fetchSavedJobsFull(userId: string): Promise<Job[]> {
  const { data, error } = await supabase
    .from('saved_jobs')
    .select('job:jobs(*, company:companies(*))')
    .eq('profile_id', userId);

  if (error) throw new Error(error.message);
  return (data ?? []).map((r: any) => r.job) as Job[];
}

export async function saveJob(userId: string, jobId: string) {
  const { error } = await supabase
    .from('saved_jobs')
    .insert({ profile_id: userId, job_id: jobId });

  if (error) throw new Error(error.message);
}

export async function unsaveJob(userId: string, jobId: string) {
  const { error } = await supabase
    .from('saved_jobs')
    .delete()
    .eq('profile_id', userId)
    .eq('job_id', jobId);

  if (error) throw new Error(error.message);
}

// ---- Applications ----

export async function applyToJob(userId: string, jobId: string, summary?: string) {
  const { error } = await supabase
    .from('applications')
    .insert({ applicant_id: userId, job_id: jobId, candidate_summary: summary || null });

  if (error) {
    if (error.code === '23505') throw new Error('You already applied to this job');
    throw new Error(error.message);
  }
}

export async function fetchMyApplications(userId: string): Promise<(Application & { job?: Job })[]> {
  const { data, error } = await supabase
    .from('applications')
    .select('*, job:jobs(*, company:companies(*))')
    .eq('applicant_id', userId)
    .order('applied_at', { ascending: false });

  if (error) throw new Error(error.message);
  return data as any[] ?? [];
}

// ---- Employer: Companies ----

export async function fetchMyCompany(userId: string): Promise<Company | null> {
  const { data, error } = await supabase
    .from('companies')
    .select('*')
    .eq('owner_id', userId)
    .maybeSingle();

  if (error) throw new Error(error.message);
  return data;
}

export async function createCompany(userId: string, company: Partial<Company>): Promise<Company> {
  const { data, error } = await supabase
    .from('companies')
    .insert({ ...company, owner_id: userId })
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
}

export async function updateCompany(companyId: string, updates: Partial<Company>): Promise<Company> {
  const { data, error } = await supabase
    .from('companies')
    .update(updates)
    .eq('id', companyId)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
}

// ---- Employer: Jobs ----

export async function fetchCompanyJobs(companyId: string): Promise<Job[]> {
  const { data, error } = await supabase
    .from('jobs')
    .select('*, company:companies(*)')
    .eq('company_id', companyId)
    .order('created_at', { ascending: false });

  if (error) throw new Error(error.message);
  return data as Job[] ?? [];
}

export async function createJob(job: Partial<Job>): Promise<Job> {
  const { data, error } = await supabase
    .from('jobs')
    .insert(job)
    .select('*, company:companies(*)')
    .single();

  if (error) throw new Error(error.message);
  return data as Job;
}

export async function updateJob(jobId: string, updates: Partial<Job>): Promise<Job> {
  const { data, error } = await supabase
    .from('jobs')
    .update(updates)
    .eq('id', jobId)
    .select('*, company:companies(*)')
    .single();

  if (error) throw new Error(error.message);
  return data as Job;
}

export async function deleteJob(jobId: string) {
  const { error } = await supabase
    .from('jobs')
    .delete()
    .eq('id', jobId);

  if (error) throw new Error(error.message);
}

// ---- Employer: Applications for their jobs ----

export async function fetchApplicationsForJob(jobId: string): Promise<(Application & { applicant?: any })[]> {
  const { data, error } = await supabase
    .from('applications')
    .select('*, applicant:profiles(*)')
    .eq('job_id', jobId)
    .order('applied_at', { ascending: false });

  if (error) throw new Error(error.message);
  return data as any[] ?? [];
}

export async function updateApplicationStatus(applicationId: string, status: string, notes?: string) {
  const updates: any = { status };
  if (notes !== undefined) updates.notes = notes;

  const { error } = await supabase
    .from('applications')
    .update(updates)
    .eq('id', applicationId);

  if (error) throw new Error(error.message);
}

// ---- Trades jobs ----

export async function fetchTradesJobs(): Promise<Job[]> {
  const { data, error } = await supabase
    .from('jobs')
    .select('*, company:companies(*)')
    .eq('status', 'active')
    .not('trade_category', 'is', null)
    .order('pay_max', { ascending: false, nullsFirst: false });

  if (error) throw new Error(error.message);
  return (data as Job[]) ?? [];
}

// ---- Bench waitlist ----

export async function joinBenchWaitlist(email: string) {
  const { error } = await supabase
    .from('bench_waitlist')
    .insert({ email });

  if (error) {
    if (error.code === '23505') throw new Error('You are already on the waitlist');
    throw new Error(error.message);
  }
}

// ---- Profile ----

export async function updateProfile(userId: string, updates: Record<string, any>) {
  const { error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', userId);

  if (error) throw new Error(error.message);
}
