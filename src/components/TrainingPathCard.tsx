import { useState, useEffect } from 'react';
import { GraduationCap, Loader2 } from 'lucide-react';
import { getTrainingRecommendations } from '../lib/claude';
import AiBadge from './AiBadge';
import type { Job } from '../types/database';

interface TrainingPathCardProps {
  job: Job;
  profileSummary: string;
  language?: string;
}

function buildJobSummary(job: Job): string {
  const parts = [
    `Title: ${job.title}`,
    `Company: ${job.company?.company_name || 'Unknown'}`,
    job.description ? `Description: ${job.description}` : '',
    job.requirements ? `Requirements: ${job.requirements}` : '',
    job.trade_category ? `Trade: ${job.trade_category}` : '',
    job.experience_level ? `Experience level: ${job.experience_level}` : '',
    job.certifications_required.length > 0 ? `Certifications required: ${job.certifications_required.join(', ')}` : '',
    job.is_degree_required ? 'Degree required' : '',
    `Union status: ${job.union_status}`,
  ];
  return parts.filter(Boolean).join('\n');
}

export default function TrainingPathCard({ job, profileSummary, language }: TrainingPathCardProps) {
  const [recommendations, setRecommendations] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function fetch() {
      try {
        const result = await getTrainingRecommendations(profileSummary, buildJobSummary(job), language);
        if (!cancelled) setRecommendations(result);
      } catch {
        if (!cancelled) {
          setError(true);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetch();
    return () => { cancelled = true; };
  }, [job.id]);

  if (error) return null;

  return (
    <div className="bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-200 rounded-xl p-5 mt-6">
      <div className="flex items-center gap-2 mb-3">
        <GraduationCap className="w-5 h-5 text-emerald-600" />
        <h3 className="text-base font-bold text-emerald-800">Your Path to This Job</h3>
        <AiBadge label="AI advisor" />
      </div>

      {loading ? (
        <div className="flex items-center gap-2 py-4">
          <Loader2 className="w-5 h-5 text-emerald-500 animate-spin" />
          <span className="text-sm text-emerald-600">Analyzing your qualifications...</span>
        </div>
      ) : (
        <div className="text-sm text-emerald-900 leading-relaxed whitespace-pre-wrap">
          {recommendations}
        </div>
      )}
    </div>
  );
}
