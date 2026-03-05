import {
  Flame,
  GraduationCap,
  Wrench,
  DollarSign,
  Languages,
  ShieldCheck,
  Clock,
  Clock4,
} from 'lucide-react';
import Chip from '../ui/Chip';

interface QuickFilter {
  key: string;
  label: string;
  icon: React.ReactNode;
}

const QUICK_FILTERS: QuickFilter[] = [
  { key: 'urgentlyHiring', label: 'Hiring Now', icon: <Flame className="w-4 h-4" /> },
  { key: 'noDegree', label: 'No Degree Required', icon: <GraduationCap className="w-4 h-4" /> },
  { key: 'trades', label: 'Trades', icon: <Wrench className="w-4 h-4" /> },
  { key: 'pay15', label: '$15+/hr', icon: <DollarSign className="w-4 h-4" /> },
  { key: 'spanishFriendly', label: 'Spanish Friendly', icon: <Languages className="w-4 h-4" /> },
  { key: 'benefits', label: 'Benefits', icon: <ShieldCheck className="w-4 h-4" /> },
  { key: 'fullTime', label: 'Full Time', icon: <Clock className="w-4 h-4" /> },
  { key: 'partTime', label: 'Part Time', icon: <Clock4 className="w-4 h-4" /> },
];

interface QuickFilterChipsProps {
  activeFilters: string[];
  onFilterChange: (filterKey: string) => void;
}

export default function QuickFilterChips({ activeFilters, onFilterChange }: QuickFilterChipsProps) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0 sm:flex-wrap">
      {QUICK_FILTERS.map((filter) => (
        <Chip
          key={filter.key}
          label={filter.label}
          icon={filter.icon}
          active={activeFilters.includes(filter.key)}
          onClick={() => onFilterChange(filter.key)}
        />
      ))}
    </div>
  );
}
