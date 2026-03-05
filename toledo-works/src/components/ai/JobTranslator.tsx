import { useState } from 'react';
import { askClaude } from '../../lib/claude';
import Button from '../ui/Button';
import { Languages, RotateCcw } from 'lucide-react';

interface JobTranslatorProps {
  description: string;
}

export default function JobTranslator({ description }: JobTranslatorProps) {
  const [simplified, setSimplified] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showSimplified, setShowSimplified] = useState(false);

  async function handleSimplify() {
    if (simplified) {
      setShowSimplified(!showSimplified);
      return;
    }

    setLoading(true);
    try {
      const result = await askClaude(
        `Rewrite this job description in plain, simple English. Use short sentences. ` +
        `Avoid jargon. Make it easy to understand for someone who speaks English as a second language. ` +
        `Keep all the important details like pay, schedule, and requirements. ` +
        `Do not add information that isn't in the original.\n\n` +
        `Job description:\n${description}`
      );
      setSimplified(result);
      setShowSimplified(true);
    } catch (err) {
      console.error(err);
      setSimplified('Unable to simplify right now. Please try again later.');
      setShowSimplified(true);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <div className="flex items-center justify-end mb-3">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleSimplify}
          loading={loading}
          className="text-sm"
        >
          {loading ? (
            'Simplifying...'
          ) : showSimplified ? (
            <>
              <RotateCcw className="w-3.5 h-3.5 mr-1.5" />
              Show Original
            </>
          ) : (
            <>
              <Languages className="w-3.5 h-3.5 mr-1.5" />
              Simplify This
            </>
          )}
        </Button>
      </div>

      <div className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
        {showSimplified && simplified ? (
          <div className="p-4 bg-blue-50 border border-blue-100 rounded-card">
            <p className="text-xs font-medium text-blue-600 uppercase tracking-wider mb-2">
              Simplified Version
            </p>
            {simplified}
          </div>
        ) : (
          description
        )}
      </div>
    </div>
  );
}
