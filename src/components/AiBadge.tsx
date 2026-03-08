import { Sparkles } from 'lucide-react';

export default function AiBadge({ label = 'AI-powered' }: { label?: string }) {
  return (
    <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-purple-600 bg-purple-50 px-2 py-0.5 rounded-full uppercase tracking-wide">
      <Sparkles className="w-3 h-3" />
      {label}
    </span>
  );
}
