import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Loader2, DollarSign, MapPin, Flame } from 'lucide-react';
import { getSmartMatches } from '../lib/claude';
import type { MatchResult } from '../lib/claude';
import type { Job, Profile, SeekerProfile, SkillsCard } from '../types/database';
import AiBadge from './AiBadge';
import toast from 'react-hot-toast';
import { sampleJobs } from '../data/sampleJobs';

interface SmartMatchProps {
  profile: Profile | null;
  seekerProfile?: SeekerProfile | null;
  skillsCard?: SkillsCard | null;
  jobs?: Job[];
  language?: string;
}

function buildProfileSummary(profile: Profile | null, seeker?: SeekerProfile | null, skills?: SkillsCard | null): string {
  const parts: string[] = [];
  if (profile?.full_name) parts.push(`Name: ${profile.full_name}`);
  if (profile?.zip_code) parts.push(`Location: ${profile.zip_code}`);
  if (seeker?.job_categories?.length) parts.push(`Interested in: ${seeker.job_categories.join(', ')}`);
  if (seeker?.preferred_shifts?.length) parts.push(`Preferred shifts: ${seeker.preferred_shifts.join(', ')}`);
  if (seeker?.experience_years) parts.push(`Experience: ${seeker.experience_years} years`);
  if (seeker?.education_level) parts.push(`Education: ${seeker.education_level}`);
  if (seeker?.speaks_spanish) parts.push('Speaks Spanish');
  if (seeker?.has_reliable_transport) parts.push('Has reliable transport');
  if (skills?.trade_category) parts.push(`Trade: ${skills.trade_category}`);
  if (skills?.experience_level) parts.push(`Trade level: ${skills.experience_level}`);
  if (skills?.experience_years) parts.push(`Trade experience: ${skills.experience_years} years`);
  if (skills?.has_own_tools) parts.push('Has own tools');
  if (skills?.union_status) parts.push(`Union: ${skills.union_status}`);
  return parts.length > 0 ? parts.join('\n') : 'General job seeker in Toledo, OH area';
}

function buildJobsSummary(jobs: Job[]): string {
  return jobs.map((j) => {
    const pay = j.pay_min && j.pay_max
      ? `$${j.pay_min}-$${j.pay_max}/${j.pay_type === 'hourly' ? 'hr' : 'yr'}`
      : j.pay_min ? `$${j.pay_min}+/${j.pay_type === 'hourly' ? 'hr' : 'yr'}` : 'Pay not listed';
    return `ID: ${j.id} | ${j.title} at ${j.company?.company_name || 'Company'} | ${pay} | ${j.job_type} ${j.shift} shift | ${j.neighborhood || j.zip_code || 'Toledo'} | ${j.trade_category ? `Trade: ${j.trade_category}` : `Category: ${j.category || 'General'}`} | ${j.is_degree_required ? 'Degree required' : 'No degree'} | ${j.union_status}`;
  }).join('\n');
}

export default function SmartMatch({ profile, seekerProfile, skillsCard, jobs, language }: SmartMatchProps) {
  const [matches, setMatches] = useState<(MatchResult & { job?: Job })[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const jobPool = jobs && jobs.length > 0 ? jobs : sampleJobs;

  useEffect(() => {
    let cancelled = false;

    async function fetchMatches() {
      try {
        const profileSummary = buildProfileSummary(profile, seekerProfile, skillsCard);
        const jobsSummary = buildJobsSummary(jobPool.slice(0, 20));
        const results = await getSmartMatches(profileSummary, jobsSummary, language);

        if (cancelled) return;

        const enriched = results
          .map((m) => ({
            ...m,
            job: jobPool.find((j) => j.id === m.job_id),
          }))
          .filter((m) => m.job);

        setMatches(enriched);
      } catch {
        if (!cancelled) {
          setError(true);
          toast.error('Smart matching unavailable right now');
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchMatches();
    return () => { cancelled = true; };
  }, []);

  if (error) return null;

  return (
    <div className="mb-8">
      <div className="flex items-center gap-2 mb-4">
        <h2 className="text-xl font-bold text-navy">Jobs Matched For You</h2>
        <AiBadge label="AI matched" />
      </div>

      {loading ? (
        <div className="grid gap-3 md:grid-cols-2">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-white rounded-xl border border-gray-200 p-5 animate-pulse">
              <div className="flex items-start gap-3">
                <div className="w-12 h-12 rounded-full bg-gray-200 shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4" />
                  <div className="h-3 bg-gray-100 rounded w-1/2" />
                  <div className="h-3 bg-gray-100 rounded w-full" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : matches.length === 0 ? (
        <p className="text-sm text-gray-400">No strong matches found. Try completing your profile for better results.</p>
      ) : (
        <div className="grid gap-3 md:grid-cols-2">
          {matches.map((m) => {
            const job = m.job!;
            const payStr = job.pay_min && job.pay_max
              ? `$${job.pay_min}–$${job.pay_max}${job.pay_type === 'hourly' ? '/hr' : '/yr'}`
              : job.pay_min ? `$${job.pay_min}+${job.pay_type === 'hourly' ? '/hr' : '/yr'}` : '';

            return (
              <Link
                key={m.job_id}
                to={`/jobs/${m.job_id}`}
                className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md hover:border-orange/30 transition-all no-underline group relative"
              >
                {/* Match badge */}
                <div className="absolute -top-2 -right-2 w-11 h-11 rounded-full bg-gradient-to-br from-orange to-amber-400 flex items-center justify-center shadow-lg">
                  <span className="text-white text-xs font-black">{m.match_score}%</span>
                </div>

                <h3 className="text-base font-bold text-navy group-hover:text-orange transition-colors pr-10">
                  {job.title}
                </h3>
                <p className="text-sm text-gray-500">{job.company?.company_name || 'Company'}</p>

                <div className="flex flex-wrap gap-1.5 mt-2">
                  {payStr && (
                    <span className="inline-flex items-center gap-1 text-xs bg-navy/5 text-navy px-2 py-0.5 rounded-full">
                      <DollarSign className="w-3 h-3" /> {payStr}
                    </span>
                  )}
                  {job.neighborhood && (
                    <span className="inline-flex items-center gap-1 text-xs bg-navy/5 text-navy px-2 py-0.5 rounded-full">
                      <MapPin className="w-3 h-3" /> {job.neighborhood}
                    </span>
                  )}
                  {job.is_urgently_hiring && (
                    <span className="inline-flex items-center gap-1 text-xs bg-red-50 text-red-600 px-2 py-0.5 rounded-full">
                      <Flame className="w-3 h-3" /> Urgent
                    </span>
                  )}
                </div>

                <p className="text-xs text-purple-600 mt-3 leading-relaxed bg-purple-50/50 rounded px-2 py-1.5">
                  {m.reason}
                </p>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
