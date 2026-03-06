-- Toledo Works Database Schema
-- Run this in your Supabase SQL Editor

-- ============================================================
-- 1. PROFILES
-- ============================================================
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  email text not null,
  full_name text,
  phone text,
  zip_code text,
  role text not null default 'job_seeker' check (role in ('job_seeker', 'employer')),
  preferred_language text not null default 'en' check (preferred_language in ('en', 'es')),
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "Anyone can view profiles"
  on public.profiles for select using (true);

create policy "Users can update own profile"
  on public.profiles for update using (auth.uid() = id);

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, role)
  values (new.id, new.email, 'job_seeker');
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ============================================================
-- 2. COMPANIES
-- ============================================================
create table public.companies (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid references public.profiles(id) on delete cascade not null,
  company_name text not null,
  industry text,
  description text,
  logo_url text,
  website text,
  phone text,
  address text,
  zip_code text,
  is_founding_employer boolean not null default false,
  subscription_tier text not null default 'free' check (subscription_tier in ('free', 'starter', 'pro', 'recruiter')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.companies enable row level security;

create policy "Anyone can view companies"
  on public.companies for select using (true);

create policy "Owners can insert own companies"
  on public.companies for insert with check (auth.uid() = owner_id);

create policy "Owners can update own companies"
  on public.companies for update using (auth.uid() = owner_id);

create policy "Owners can delete own companies"
  on public.companies for delete using (auth.uid() = owner_id);

-- ============================================================
-- 3. JOBS
-- ============================================================
create table public.jobs (
  id uuid primary key default gen_random_uuid(),
  company_id uuid references public.companies(id) on delete cascade not null,
  title text not null,
  description text not null,
  spanish_description text,
  pay_min numeric,
  pay_max numeric,
  pay_type text not null default 'hourly' check (pay_type in ('hourly', 'salary', 'per_diem', 'commission')),
  job_type text not null default 'full_time' check (job_type in ('full_time', 'part_time', 'contract', 'temp', 'seasonal')),
  shift text not null default 'first' check (shift in ('first', 'second', 'third', 'flexible', 'weekends', 'rotating')),
  category text,
  trade_category text,
  neighborhood text,
  zip_code text,
  requirements text,
  is_degree_required boolean not null default false,
  is_spanish_friendly boolean not null default false,
  is_urgently_hiring boolean not null default false,
  certifications_required text[] default '{}',
  experience_level text,
  union_status text not null default 'either' check (union_status in ('union', 'non_union', 'either')),
  has_benefits boolean not null default false,
  start_date date,
  project_duration text,
  overtime_available boolean not null default false,
  per_diem_included boolean not null default false,
  prevailing_wage boolean not null default false,
  status text not null default 'active' check (status in ('active', 'closed', 'draft')),
  views_count integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  expires_at timestamptz not null default (now() + interval '30 days')
);

alter table public.jobs enable row level security;

create policy "Anyone can view active jobs"
  on public.jobs for select using (status = 'active');

create policy "Company owners can insert jobs"
  on public.jobs for insert with check (
    exists (select 1 from public.companies where id = company_id and owner_id = auth.uid())
  );

create policy "Company owners can update own jobs"
  on public.jobs for update using (
    exists (select 1 from public.companies where id = company_id and owner_id = auth.uid())
  );

create policy "Company owners can delete own jobs"
  on public.jobs for delete using (
    exists (select 1 from public.companies where id = company_id and owner_id = auth.uid())
  );

create index idx_jobs_status_created on public.jobs (status, created_at desc);
create index idx_jobs_category on public.jobs (category);
create index idx_jobs_trade_category on public.jobs (trade_category);
create index idx_jobs_zip_code on public.jobs (zip_code);

-- ============================================================
-- 4. APPLICATIONS
-- ============================================================
create table public.applications (
  id uuid primary key default gen_random_uuid(),
  job_id uuid references public.jobs(id) on delete cascade not null,
  applicant_id uuid references public.profiles(id) on delete cascade not null,
  status text not null default 'applied' check (status in ('applied', 'reviewed', 'interview', 'hired', 'rejected')),
  candidate_summary text,
  applied_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  notes text,
  unique (job_id, applicant_id)
);

alter table public.applications enable row level security;

create policy "Applicants can view own applications"
  on public.applications for select using (auth.uid() = applicant_id);

create policy "Employers can view applications to their jobs"
  on public.applications for select using (
    exists (
      select 1 from public.jobs j
      join public.companies c on c.id = j.company_id
      where j.id = job_id and c.owner_id = auth.uid()
    )
  );

create policy "Applicants can insert applications"
  on public.applications for insert with check (auth.uid() = applicant_id);

create policy "Employers can update application status"
  on public.applications for update using (
    exists (
      select 1 from public.jobs j
      join public.companies c on c.id = j.company_id
      where j.id = job_id and c.owner_id = auth.uid()
    )
  );

-- ============================================================
-- 5. SKILLS CARDS
-- ============================================================
create table public.skills_cards (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid references public.profiles(id) on delete cascade unique not null,
  trade_category text,
  experience_years integer,
  experience_level text check (experience_level in ('apprentice', 'journeyman', 'master')),
  certifications jsonb,
  tools_owned text[] default '{}',
  has_reliable_transport boolean not null default false,
  has_own_tools boolean not null default false,
  has_ppe boolean not null default false,
  union_status text not null default 'non_union_only' check (union_status in ('union_member', 'willing_to_join', 'non_union_only')),
  available_now boolean not null default true,
  willing_to_travel boolean not null default false,
  availability_notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.skills_cards enable row level security;

create policy "Anyone can view skills cards"
  on public.skills_cards for select using (true);

create policy "Users can insert own skills card"
  on public.skills_cards for insert with check (auth.uid() = profile_id);

create policy "Users can update own skills card"
  on public.skills_cards for update using (auth.uid() = profile_id);

create policy "Users can delete own skills card"
  on public.skills_cards for delete using (auth.uid() = profile_id);

-- ============================================================
-- 6. SEEKER PROFILES
-- ============================================================
create table public.seeker_profiles (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid references public.profiles(id) on delete cascade unique not null,
  job_categories text[] default '{}',
  preferred_shifts text[] default '{}',
  has_reliable_transport boolean not null default false,
  speaks_spanish boolean not null default false,
  education_level text check (education_level in ('no_diploma', 'ged', 'high_school', 'some_college', 'associates', 'bachelors_plus')),
  experience_years integer,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.seeker_profiles enable row level security;

create policy "Users can view own seeker profile"
  on public.seeker_profiles for select using (auth.uid() = profile_id);

create policy "Users can insert own seeker profile"
  on public.seeker_profiles for insert with check (auth.uid() = profile_id);

create policy "Users can update own seeker profile"
  on public.seeker_profiles for update using (auth.uid() = profile_id);

create policy "Users can delete own seeker profile"
  on public.seeker_profiles for delete using (auth.uid() = profile_id);

-- ============================================================
-- 7. SAVED JOBS
-- ============================================================
create table public.saved_jobs (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid references public.profiles(id) on delete cascade not null,
  job_id uuid references public.jobs(id) on delete cascade not null,
  saved_at timestamptz not null default now(),
  unique (profile_id, job_id)
);

alter table public.saved_jobs enable row level security;

create policy "Users can view own saved jobs"
  on public.saved_jobs for select using (auth.uid() = profile_id);

create policy "Users can save jobs"
  on public.saved_jobs for insert with check (auth.uid() = profile_id);

create policy "Users can unsave jobs"
  on public.saved_jobs for delete using (auth.uid() = profile_id);

-- ============================================================
-- AUTO-UPDATE updated_at TRIGGERS
-- ============================================================
create or replace function public.update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger set_updated_at before update on public.profiles
  for each row execute function public.update_updated_at();

create trigger set_updated_at before update on public.companies
  for each row execute function public.update_updated_at();

create trigger set_updated_at before update on public.jobs
  for each row execute function public.update_updated_at();

create trigger set_updated_at before update on public.applications
  for each row execute function public.update_updated_at();

create trigger set_updated_at before update on public.skills_cards
  for each row execute function public.update_updated_at();

create trigger set_updated_at before update on public.seeker_profiles
  for each row execute function public.update_updated_at();
