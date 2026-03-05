import { useState, useEffect } from 'react';
import { askClaude } from '../../lib/claude';
import Button from '../ui/Button';
import Card from '../ui/Card';
import Skeleton from '../ui/Skeleton';
import { Sparkles, Send, RotateCcw } from 'lucide-react';
import type { Profile, Job } from '../../types';

interface ApplySummaryProps {
  profile: Profile;
  job: Job;
  onSubmit: (summary: string) => void;
}

export default function ApplySummary({ profile, job, onSubmit }: ApplySummaryProps) {
  const [summary, setSummary] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    generateSummary();
  }, []);

  async function generateSummary() {
    setLoading(true);
    setError(false);

    try {
      const prompt =
        `You are helping a job seeker apply for a job on Toledo Works, a job board in Toledo, Ohio. ` +
        `Write a short candidate summary (3-4 sentences) that highlights why this person could be a good fit. ` +
        `Keep it conversational and honest — don't oversell. Use plain English.\n\n` +
        `Job Title: ${job.title}\n` +
        `Job Category: ${job.category}\n` +
        `Job Description: ${job.description?.slice(0, 500)}\n` +
        `Requirements: ${job.requirements || 'None listed'}\n` +
        `Experience Level: ${job.experience_level || 'Not specified'}\n\n` +
        `Applicant Name: ${profile.full_name || 'Not provided'}\n` +
        `Applicant Zip: ${profile.zip_code || 'Not provided'}\n` +
        `Applicant Language: ${profile.preferred_language === 'es' ? 'Bilingual (English/Spanish)' : 'English'}\n\n` +
        `Write ONLY the summary, nothing else. Do not include a greeting or sign-off.`;

      const result = await askClaude(prompt);
      setSummary(result);
    } catch (err) {
      console.error(err);
      setError(true);
      setSummary('');
    } finally {
      setLoading(false);
    }
  }

  function handleSubmit() {
    if (!summary.trim()) return;
    setSubmitting(true);
    onSubmit(summary.trim());
  }

  if (loading) {
    return (
      <Card className="space-y-4">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-orange animate-pulse" />
          <p className="text-sm text-gray-500 font-medium">Writing your summary...</p>
        </div>
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="space-y-4">
        <p className="text-sm text-gray-500">
          We couldn't generate a summary right now. You can write your own below.
        </p>
        <textarea
          value={summary}
          onChange={(e) => setSummary(e.target.value)}
          placeholder="Tell the employer a little about yourself and why you're interested in this position..."
          className="w-full p-3 border border-gray-300 rounded-card text-sm text-gray-700 resize-none focus:outline-none focus:ring-2 focus:ring-orange/50 focus:border-orange"
          rows={5}
        />
        <div className="flex justify-end">
          <Button onClick={handleSubmit} disabled={!summary.trim()} loading={submitting}>
            <Send className="w-4 h-4 mr-2" />
            Send Application
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <Card className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-orange" />
          <p className="text-sm font-semibold text-navy">Your Application Summary</p>
        </div>
        <button
          onClick={generateSummary}
          className="text-xs text-gray-400 hover:text-gray-600 flex items-center gap-1 transition-colors"
        >
          <RotateCcw className="w-3 h-3" />
          Regenerate
        </button>
      </div>

      <p className="text-xs text-gray-400">
        Review and edit the summary below before sending. This is what the employer will see.
      </p>

      <textarea
        value={summary}
        onChange={(e) => setSummary(e.target.value)}
        className="w-full p-3 border border-gray-300 rounded-card text-sm text-gray-700 resize-none focus:outline-none focus:ring-2 focus:ring-orange/50 focus:border-orange"
        rows={5}
      />

      <div className="flex justify-end gap-3">
        <Button onClick={handleSubmit} disabled={!summary.trim()} loading={submitting}>
          <Send className="w-4 h-4 mr-2" />
          Send Application
        </Button>
      </div>
    </Card>
  );
}
