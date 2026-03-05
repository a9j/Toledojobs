import { cn } from '../../lib/utils';
import type { InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export default function Input({ label, error, className, id, ...props }: InputProps) {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');
  return (
    <div className="space-y-1">
      {label && (
        <label htmlFor={inputId} className="block text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      <input
        id={inputId}
        className={cn(
          'w-full px-4 py-3 rounded-card border border-gray-300 bg-white text-gray-900',
          'focus:outline-none focus:ring-2 focus:ring-orange/50 focus:border-orange',
          'placeholder:text-gray-400 font-body',
          error && 'border-red focus:ring-red/50 focus:border-red',
          className
        )}
        {...props}
      />
      {error && <p className="text-sm text-red">{error}</p>}
    </div>
  );
}
