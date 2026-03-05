import { useState, useEffect } from 'react';
import { askClaude } from '../../lib/claude';
import Card from '../ui/Card';
import Skeleton from '../ui/Skeleton';
import { GraduationCap, AlertCircle, ExternalLink } from 'lucide-react';
import type { Profile, Job } from '../../types';

interface TrainingRecommenderProps {
  profile: Profile | null;
  job: Job;
}

export default function TrainingRecommender({ profile, job }: TrainingRecommenderProps) {
  const [recommendation, setRecommendation] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetchRecommendation();
  }, [job.id, profile?.id]);

  async function fetchRecommendation() {
    setLoading(true);
    setError(false);

    try {
      const profileContext = profile
        ? `The job seeker's name is ${profile.full_name || 'unknown'}. ` +
          `They are in zip code ${profile.zip_code || 'the Toledo area'}. ` +
          `Preferred language: ${profile.preferred_language === 'es' ? 'Spanish/Bilingual' : 'English'}.`
        : 'No profile information is available for this job seeker.';

      const prompt =
        `You are a workforce development advisor for the Toledo, Ohio area. ` +
        `A job seeker is looking at a job posting and may not yet meet all the requirements. ` +
        `Recommend the shortest, most practical path to qualifying for this role.\n\n` +
        `Reference ONLY these real Toledo-area programs when applicable:\n` +
        `- MKP (Manufacturing Kick-Start Program) - short-term manufacturing training\n` +
        `- Owens Community College - certificates and associate degrees in skilled trades\n` +
        `- IBEW Local 8 (International Brotherhood of Electrical Workers) - electrical apprenticeship in Toledo\n` +
        `- OhioMeansJobs Lucas County - free career services, resume help, job placement, training scholarships\n\n` +
        `${profileContext}\n\n` +
        `Job Title: ${job.title}\n` +
        `Category: ${job.category}\n` +
        `Trade: ${job.trade_category || 'N/A'}\n` +
        `Requirements: ${job.requirements || 'None listed'}\n` +
        `Certifications Required: ${job.certifications_required?.join(', ') || 'None'}\n` +
        `Experience Level: ${job.experience_level || 'Not specified'}\n` +
        `Degree Required: ${job.is_degree_required ? 'Yes' : 'No'}\n\n` +
        `Write a concise recommendation (3-5 sentences max). Be specific about which program(s) to look into ` +
        `and roughly how long the training takes. If the seeker likely already qualifies, say so and suggest ` +
        `one thing they could do to stand out. Write in plain English. Do NOT use markdown.`;

      const result = await askClaude(prompt);
      setRecommendation(result);
    } catch (err) {
      console.error(err);
      setError(true);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-card space-y-3">
        <div className="flex items-center gap-2">
          <GraduationCap className="w-5 h-5 text-emerald-600 animate-pulse" />
          <p className="text-sm text-emerald-700 font-medium">Finding training paths...</p>
        </div>
        <Skeleton className="h-4 w-full !bg-emerald-100" />
        <Skeleton className="h-4 w-full !bg-emerald-100" />
        <Skeleton className="h-4 w-3/4 !bg-emerald-100" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-gray-50 border border-gray-200 rounded-card">
        <div className="flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-gray-400" />
          <p className="text-sm text-gray-500">
            Training recommendations are temporarily unavailable.
          </p>
        </div>
      </div>
    );
  }

  if (!recommendation) return null;

  return (
    <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-card">
      <div className="flex items-start gap-3">
        <GraduationCap className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
        <div className="space-y-2">
          <p className="text-sm font-semibold text-emerald-800">Training Path</p>
          <p className="text-sm text-emerald-900 leading-relaxed">{recommendation}</p>
          <div className="flex flex-wrap gap-3 pt-1">
            <a
              href="https://www.ohiomeansjobs.ohio.gov"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs text-emerald-700 font-medium hover:underline"
            >
              OhioMeansJobs
              <ExternalLink className="w-3 h-3" />
            </a>
            <a
              href="https://www.owens.edu"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs text-emerald-700 font-medium hover:underline"
            >
              Owens Community College
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
