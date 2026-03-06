import { Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-navy text-white/70 py-8 mt-12">
      <div className="max-w-7xl mx-auto px-4 text-center">
        <p className="flex items-center justify-center gap-1.5 text-sm">
          Workforce development powered by{' '}
          <span className="text-orange font-semibold">The Mona K Project</span>
          <Heart className="w-4 h-4 text-orange fill-orange" />
        </p>
        <p className="text-xs mt-2 text-white/40">
          &copy; {new Date().getFullYear()} Toledo Works. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
