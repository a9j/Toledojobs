import { cn } from '../../lib/utils';

interface ChipProps {
  label: string;
  active?: boolean;
  onClick?: () => void;
  icon?: React.ReactNode;
}

export default function Chip({ label, active, onClick, icon }: ChipProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'chip gap-1.5 border transition-colors duration-200',
        active
          ? 'bg-navy text-white border-navy'
          : 'bg-white text-gray-700 border-gray-300 hover:border-navy hover:text-navy'
      )}
    >
      {icon}
      {label}
    </button>
  );
}
