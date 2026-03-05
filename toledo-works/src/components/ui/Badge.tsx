import { cn } from '../../lib/utils';

interface BadgeProps {
  variant?: 'orange' | 'navy' | 'green' | 'red' | 'yellow' | 'gray';
  children: React.ReactNode;
  className?: string;
}

export default function Badge({ variant = 'gray', children, className }: BadgeProps) {
  const variants = {
    orange: 'bg-orange/10 text-orange',
    navy: 'bg-navy/10 text-navy',
    green: 'bg-green/10 text-green',
    red: 'bg-red/10 text-red',
    yellow: 'bg-yellow/10 text-yellow',
    gray: 'bg-gray-100 text-gray-700',
  };

  return (
    <span className={cn('chip', variants[variant], className)}>
      {children}
    </span>
  );
}
