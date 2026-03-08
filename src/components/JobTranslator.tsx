import { useState } from 'react';
import { Languages, Loader2 } from 'lucide-react';
import { translateJobToPlainEnglish } from '../lib/claude';
import AiBadge from './AiBadge';
import toast from 'react-hot-toast';

interface JobTranslatorProps {
  description: string;
  language?: string;
}

export default function JobTranslator({ description, language }: JobTranslatorProps) {
  const [showPlain, setShowPlain] = useState(false);
  const [plainText, setPlainText] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleToggle() {
    if (showPlain) {
      setShowPlain(false);
      return;
    }

    // If cached, just toggle
    if (plainText) {
      setShowPlain(true);
      return;
    }

    setLoading(true);
    try {
      const result = await translateJobToPlainEnglish(description, language);
      setPlainText(result);
      setShowPlain(true);
    } catch {
      toast.error('AI translation unavailable right now');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <div className="flex items-center gap-2 mb-3">
        <h2 className="text-lg font-bold text-navy">About this role</h2>
        <button
          onClick={handleToggle}
          disabled={loading}
          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border cursor-pointer transition-all ${
            showPlain
              ? 'bg-purple-50 text-purple-700 border-purple-200'
              : 'bg-white text-gray-600 border-gray-300 hover:border-purple-300 hover:text-purple-600'
          } disabled:opacity-50`}
        >
          {loading ? (
            <Loader2 className="w-3 h-3 animate-spin" />
          ) : (
            <Languages className="w-3 h-3" />
          )}
          {showPlain ? 'Original' : 'Plain English'}
        </button>
        <AiBadge />
      </div>

      {showPlain && plainText ? (
        <div className="bg-purple-50/50 border border-purple-100 rounded-lg p-4">
          <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">{plainText}</p>
        </div>
      ) : (
        <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">{description}</p>
      )}
    </div>
  );
}
