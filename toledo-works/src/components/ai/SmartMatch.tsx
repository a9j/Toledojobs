import { useState, useEffect } from 'react';
import { askClaude } from '../../lib/claude';
import { supabase } from '../../lib/supabase';
import Card from '../ui/Card';
import Badge from '../ui/Badge';
import Skeleton from '../ui/Skeleton';
import { Link } from 'react-router-dom';
import { Sparkles, AlertCircle, Building2 } from 'lucide-react';
import { formatPay } from '../../lib/utils';
import type { Profile, Job } from '../../types';

interface SmartMatchProps {
  profile: Profile;
}

interface MatchResult {
  job_id: string;
  match_score: number;
  reason: string;
}

export default function SmartMatch({ profile }: SmartMatchProps) {
  const [matches, setMatches] = useState<(MatchResult & { job?: Job })[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchMatches();
  }, [profile.id]);

  async function fetchMatches() {
    setLoading(true);
    setError(null);

    try {
      // Fetch active jobs
      const { data: jobs, error: jobsError } = await supabase
        .from('jobs')
        .select('*, company:companies(*)')
        .eq('status', 'active')
        .order('created_at', { ascending: false })
        .limit(30);

      if (jobsError) throw jobsError;
      if (!jobs?.length) {
        setMatches([]);
        setLoading(false);
        return;
      }

      // Fetch seeker profile for extra context
      const { data: seekerProfile } = await supabase
        .from('seeker_profiles')
        .select('*')
        .eq('profile_id', profile.id)
        .maybeSingle();

      const jobSummaries = jobs.map((j) => ({
        id: j.id,
        title: j.title,
        category: j.category,
        shift: j.shift,
        pay_type: j.pay_type,
        pay_min: j.pay_min,
        pay_max: j.pay_max,
        zip_code: j.zip_code,
        is_degree_required: j.is_degree_required,
        experience_level: j.experience_level,
      }));

      const profileSummary = {
        name: profile.full_name,
        zip_code: profile.zip_code,
        preferred_language: profile.preferred_language,
        ...(seekerProfile && {
          job_categories: seekerProfile.job_categories,
          preferred_shifts: seekerProfile.preferred_shifts,
          has_reliable_transport: seekerProfile.has_reliable_transport,
          education_level: seekerProfile.education_level,
          experience_years: seekerProfile.experience_years,
        }),
      };

      const prompt =
        `You are a job matching assistant for Toledo Works, a job board in Toledo, Ohio. ` +
        `Match this job seeker with the best jobs from the list.\n\n` +
        `Job Seeker Profile:\n${JSON.stringify(profileSummary, null, 2)}\n\n` +
        `Available Jobs:\n${JSON.stringify(jobSummaries, null, 2)}\n\n` +
        `Return ONLY a JSON array of the top 5 best matches. Each object must have:\n` +
        `- "job_id": the job's id string\n` +
        `- "match_score": a number from 1-100\n` +
        `- "reason": a brief 1-sentence explanation of why this is a good match\n\n` +
        `Return ONLY the JSON array, no other text.`;

      const response = await askClaude(prompt);

      // Parse the JSON response
      let parsed: MatchResult[];
      try {
        // Try to extract JSON array from response
        const jsonMatch = response.match(/\[[\s\S]*\]/);
        if (!jsonMatch) throw new Error('No JSON array found');
        parsed = JSON.parse(jsonMatch[0]);
      } catch {
        console.error('Failed to parse AI response:', response);
        setError('Smart Match had trouble analyzing jobs. Try again later.');
        setLoading(false);
        return;
      }

      // Attach full job data to matches
      const matchesWithJobs = parsed
        .filter((m) => m.job_id && m.match_score && m.reason)
        .map((m) => ({
          ...m,
          job: jobs.find((j) => j.id === m.job_id),
        }))
        .filter((m) => m.job)
        .sort((a, b) => b.match_score - a.match_score);

      setMatches(matchesWithJobs);
    } catch (err) {
      console.error(err);
      setError('Something went wrong finding your matches. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="space-y-3">
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="w-5 h-5 text-orange animate-pulse" />
          <p className="text-sm text-gray-500 font-medium">Finding your best matches...</p>
        </div>
        {Array.from({ length: 3 }).map((_, i) => (
          <Card key={i} className="space-y-3">
            <div className="flex justify-between">
              <Skeleton className="h-5 w-48" />
              <Skeleton className="h-6 w-16 rounded-full" />
            </div>
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-4 w-full" />
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <Card className="text-center py-8">
        <AlertCircle className="w-10 h-10 text-gray-300 mx-auto mb-3" />
        <p className="text-gray-500">{error}</p>
        <button
          onClick={fetchMatches}
          className="mt-3 text-sm text-orange font-semibold hover:underline"
        >
          Try again
        </button>
      </Card>
    );
  }

  if (!matches.length) {
    return (
      <Card className="text-center py-8">
        <Sparkles className="w-10 h-10 text-gray-300 mx-auto mb-3" />
        <p className="text-gray-500 font-medium">No matches found right now</p>
        <p className="text-gray-400 text-sm mt-1">
          Check back as new jobs are posted, or update your profile to improve matches.
        </p>
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 mb-1">
        <Sparkles className="w-5 h-5 text-orange" />
        <p className="text-sm font-semibold text-navy">Your Top Matches</p>
      </div>

      {matches.map((match) => {
        const job = match.job!;
        return (
          <Link key={match.job_id} to={`/jobs/${match.job_id}`}>
            <Card hover className="space-y-2">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <h3 className="font-semibold text-gray-900 truncate">{job.title}</h3>
                  <div className="flex items-center gap-2 text-sm text-gray-500 mt-0.5">
                    <Building2 className="w-3.5 h-3.5 shrink-0" />
                    <span className="truncate">
                      {job.company?.company_name || 'Company'}
                    </span>
                  </div>
                </div>
                <Badge variant="orange">{match.match_score}% Match</Badge>
              </div>
              <p className="text-sm text-orange font-medium">
                {formatPay(job.pay_min, job.pay_max, job.pay_type)}
              </p>
              <p className="text-sm text-gray-500">{match.reason}</p>
            </Card>
          </Link>
        );
      })}
    </div>
  );
}
