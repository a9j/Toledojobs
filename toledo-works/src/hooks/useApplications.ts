import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';
import type { Application } from '../types';

export function useApplications(jobId: string | undefined) {
  return useQuery({
    queryKey: ['applications', jobId],
    queryFn: async () => {
      if (!jobId) return [];
      const { data, error } = await supabase
        .from('applications')
        .select('*, applicant:profiles(*)')
        .eq('job_id', jobId)
        .order('applied_at', { ascending: false });
      if (error) throw error;
      return data as Application[];
    },
    enabled: !!jobId,
  });
}

export function useMyApplications(applicantId: string | undefined) {
  return useQuery({
    queryKey: ['my-applications', applicantId],
    queryFn: async () => {
      if (!applicantId) return [];
      const { data, error } = await supabase
        .from('applications')
        .select('*, job:jobs(*, company:companies(*))')
        .eq('applicant_id', applicantId)
        .order('applied_at', { ascending: false });
      if (error) throw error;
      return data as Application[];
    },
    enabled: !!applicantId,
  });
}

export function useApplyToJob() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ jobId, applicantId, candidateSummary }: {
      jobId: string;
      applicantId: string;
      candidateSummary?: string;
    }) => {
      const { data, error } = await supabase
        .from('applications')
        .insert({
          job_id: jobId,
          applicant_id: applicantId,
          candidate_summary: candidateSummary,
        })
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-applications'] });
      queryClient.invalidateQueries({ queryKey: ['applications'] });
    },
  });
}

export function useUpdateApplicationStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, status, notes }: { id: string; status: Application['status']; notes?: string }) => {
      const { error } = await supabase
        .from('applications')
        .update({ status, notes, updated_at: new Date().toISOString() })
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['applications'] });
    },
  });
}
