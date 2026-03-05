import { cn } from '../../lib/utils';
import type { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  hover?: boolean;
}

export default function Card({ children, className, onClick, hover }: CardProps) {
  return (
    <div
      className={cn(
        'card',
        hover && 'hover:shadow-md hover:border-gray-300 cursor-pointer transition-all duration-200',
        className
      )}
      onClick={onClick}
    >
      {children}
    </div>
  );
}
