import { supabase } from './supabase';
import type { Job } from '../types/database';

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
