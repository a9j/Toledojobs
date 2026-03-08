import { useState, useEffect } from 'react';
import { X, Loader2, RefreshCw, Briefcase } from 'lucide-react';
import { generateCandidateSummary } from '../lib/claude';
import AiBadge from './AiBadge';
import toast from 'react-hot-toast';
import type { Job, Profile } from '../types/database';

interface ApplySummaryModalProps {
  job: Job;
  profile: Profile | null;
  profileSummary: string;
  onSubmit: (summary: string) => void;
  onClose: () => void;
  isSubmitting: boolean;
  language?: string;
}

function buildJobSummary(job: Job): string {
  const parts = [
    `Title: ${job.title}`,
    `Company: ${job.company?.company_name || 'Unknown'}`,
    `Type: ${job.job_type}, ${job.shift} shift`,
    job.description ? `Description: ${job.description}` : '',
    job.requirements ? `Requirements: ${job.requirements}` : '',
    job.trade_category ? `Trade: ${job.trade_category}` : '',
    job.certifications_required.length > 0 ? `Certs needed: ${job.certifications_required.join(', ')}` : '',
    `Union: ${job.union_status}`,
    job.is_degree_required ? 'Degree required' : 'No degree required',
  ];
  return parts.filter(Boolean).join('\n');
}

export default function ApplySummaryModal({
  job, profile, profileSummary, onSubmit, onClose, isSubmitting, language,
}: ApplySummaryModalProps) {
  const [summary, setSummary] = useState('');
  const [generating, setGenerating] = useState(true);
  const [genError, setGenError] = useState(false);

  async function generate() {
    setGenerating(true);
    setGenError(false);
    try {
      const result = await generateCandidateSummary(profileSummary, buildJobSummary(job), language);
      setSummary(result);
    } catch {
      setGenError(true);
      toast.error('Could not generate summary. You can write your own.');
    } finally {
      setGenerating(false);
    }
  }

  useEffect(() => {
    generate();
  }, []);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div
        className="bg-white rounded-2xl max-w-lg w-full p-6 relative max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-navy cursor-pointer bg-transparent border-none"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 mb-1">
          <Briefcase className="w-5 h-5 text-orange" />
          <h2 className="text-lg font-bold text-navy">Quick Apply</h2>
        </div>
        <p className="text-sm text-gray-500 mb-4">
          Applying to <span className="font-semibold text-navy">{job.title}</span> at {job.company?.company_name || 'Company'}
        </p>

        <div className="flex items-center gap-2 mb-2">
          <label className="text-sm font-semibold text-navy">Candidate Summary</label>
          <AiBadge label="AI generated" />
        </div>

        {generating ? (
          <div className="flex items-center justify-center py-8 bg-gray-50 rounded-lg">
            <Loader2 className="w-6 h-6 text-purple-500 animate-spin mr-2" />
            <span className="text-sm text-gray-500">Generating your candidate summary...</span>
          </div>
        ) : (
          <>
            <textarea
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              rows={5}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-navy outline-none focus:border-orange transition-colors resize-none text-sm leading-relaxed"
              placeholder="Write a brief summary about yourself..."
            />

            <div className="flex items-center gap-2 mt-2">
              <button
                onClick={generate}
                disabled={generating}
                className="inline-flex items-center gap-1 text-xs text-purple-600 hover:text-purple-800 bg-transparent border-none cursor-pointer font-medium"
              >
                <RefreshCw className="w-3 h-3" /> Regenerate
              </button>
              {genError && (
                <span className="text-xs text-amber-600">AI unavailable — edit manually</span>
              )}
            </div>
          </>
        )}

        <div className="flex gap-3 mt-5">
          <button
            onClick={() => onSubmit(summary)}
            disabled={isSubmitting || generating}
            className="flex-1 bg-orange hover:bg-orange-dark text-white py-2.5 rounded-lg font-semibold transition-colors cursor-pointer border-none disabled:opacity-50"
          >
            {isSubmitting ? 'Submitting...' : 'Submit Application'}
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2.5 rounded-lg font-medium text-gray-500 hover:text-navy border border-gray-300 bg-white cursor-pointer transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
