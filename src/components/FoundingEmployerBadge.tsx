import { Star } from 'lucide-react';

interface FoundingBadgeProps {
  size?: 'sm' | 'md';
}

export default function FoundingEmployerBadge({ size = 'sm' }: FoundingBadgeProps) {
  if (size === 'md') {
    return (
      <span className="inline-flex items-center gap-1.5 bg-orange/10 text-orange text-sm font-semibold px-3 py-1 rounded-full border border-orange/20">
        <Star className="w-4 h-4 fill-orange" />
        Founding Employer
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1 bg-orange/10 text-orange text-xs font-semibold px-2 py-0.5 rounded-full">
      <Star className="w-3 h-3 fill-orange" />
      Founding
    </span>
  );
}
