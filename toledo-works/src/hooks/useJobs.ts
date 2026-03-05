import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';
import type { Job } from '../types';

interface JobFilters {
  search?: string;
  category?: string;
  trade_category?: string;
  job_type?: string;
  shift?: string;
  zip_code?: string;
  is_urgently_hiring?: boolean;
  is_degree_required?: boolean;
  is_spanish_friendly?: boolean;
  has_benefits?: boolean;
  union_status?: string;
  prevailing_wage?: boolean;
  pay_min?: number;
}

export function useJobs(filters?: JobFilters) {
  return useQuery({
    queryKey: ['jobs', filters],
    queryFn: async () => {
      let query = supabase
        .from('jobs')
        .select('*, company:companies(*)')
        .eq('status', 'active')
        .order('created_at', { ascending: false });

      if (filters?.search) {
        query = query.ilike('title', `%${filters.search}%`);
      }
      if (filters?.category) {
        query = query.eq('category', filters.category);
      }
      if (filters?.trade_category) {
        query = query.eq('trade_category', filters.trade_category);
      }
      if (filters?.job_type) {
        query = query.eq('job_type', filters.job_type);
      }
      if (filters?.shift) {
        query = query.eq('shift', filters.shift);
      }
      if (filters?.zip_code) {
        query = query.eq('zip_code', filters.zip_code);
      }
      if (filters?.is_urgently_hiring) {
        query = query.eq('is_urgently_hiring', true);
      }
      if (filters?.is_degree_required === false) {
        query = query.eq('is_degree_required', false);
      }
      if (filters?.is_spanish_friendly) {
        query = query.eq('is_spanish_friendly', true);
      }
      if (filters?.has_benefits) {
        query = query.eq('has_benefits', true);
      }
      if (filters?.union_status) {
        query = query.eq('union_status', filters.union_status);
      }
      if (filters?.prevailing_wage) {
        query = query.eq('prevailing_wage', true);
      }
      if (filters?.pay_min) {
        query = query.gte('pay_min', filters.pay_min);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as (Job & { company: Job['company'] })[];
    },
  });
}

export function useJob(id: string | undefined) {
  return useQuery({
    queryKey: ['job', id],
    queryFn: async () => {
      if (!id) return null;
      const { data, error } = await supabase
        .from('jobs')
        .select('*, company:companies(*)')
        .eq('id', id)
        .single();
      if (error) throw error;

      // Increment view count
      await supabase.rpc('increment_job_views', { job_id: id }).catch(() => {});
      return data as Job & { company: Job['company'] };
    },
    enabled: !!id,
  });
}

export function useCreateJob() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (job: Partial<Job>) => {
      const { data, error } = await supabase
        .from('jobs')
        .insert(job)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
    },
  });
}

export function useEmployerJobs(companyId: string | undefined) {
  return useQuery({
    queryKey: ['employer-jobs', companyId],
    queryFn: async () => {
      if (!companyId) return [];
      const { data, error } = await supabase
        .from('jobs')
        .select('*')
        .eq('company_id', companyId)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data as Job[];
    },
    enabled: !!companyId,
  });
}

export function useSavedJobs(profileId: string | undefined) {
  return useQuery({
    queryKey: ['saved-jobs', profileId],
    queryFn: async () => {
      if (!profileId) return [];
      const { data, error } = await supabase
        .from('saved_jobs')
        .select('*, job:jobs(*, company:companies(*))')
        .eq('profile_id', profileId);
      if (error) throw error;
      return data;
    },
    enabled: !!profileId,
  });
}

export function useToggleSaveJob() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ profileId, jobId, isSaved }: { profileId: string; jobId: string; isSaved: boolean }) => {
      if (isSaved) {
        const { error } = await supabase
          .from('saved_jobs')
          .delete()
          .eq('profile_id', profileId)
          .eq('job_id', jobId);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('saved_jobs')
          .insert({ profile_id: profileId, job_id: jobId });
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['saved-jobs'] });
    },
  });
}
