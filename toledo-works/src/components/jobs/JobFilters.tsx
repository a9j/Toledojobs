import { X } from 'lucide-react';
import { JOB_CATEGORIES, SHIFTS, SHIFT_LABELS } from '../../lib/constants';
import Select from '../ui/Select';
import Input from '../ui/Input';
import Button from '../ui/Button';
import Toggle from '../ui/Toggle';

interface Filters {
  category: string;
  job_type: string[];
  shift: string[];
  pay_min: string;
  union_status: string;
  is_urgently_hiring: boolean;
  is_degree_required: boolean;
  is_spanish_friendly: boolean;
  has_benefits: boolean;
  prevailing_wage: boolean;
}

interface JobFiltersProps {
  filters: Filters;
  onFilterChange: (filters: Filters) => void;
}

const JOB_TYPES = [
  { value: 'full_time', label: 'Full Time' },
  { value: 'part_time', label: 'Part Time' },
  { value: 'contract', label: 'Contract' },
  { value: 'temp', label: 'Temp' },
  { value: 'seasonal', label: 'Seasonal' },
];

const UNION_OPTIONS = [
  { value: '', label: 'Any' },
  { value: 'union', label: 'Union' },
  { value: 'non_union', label: 'Non-Union' },
  { value: 'either', label: 'Either' },
];

export default function JobFilters({ filters, onFilterChange }: JobFiltersProps) {
  const update = (partial: Partial<Filters>) => {
    onFilterChange({ ...filters, ...partial });
  };

  const toggleArrayValue = (arr: string[], value: string): string[] => {
    return arr.includes(value)
      ? arr.filter((v) => v !== value)
      : [...arr, value];
  };

  const clearFilters = () => {
    onFilterChange({
      category: '',
      job_type: [],
      shift: [],
      pay_min: '',
      union_status: '',
      is_urgently_hiring: false,
      is_degree_required: false,
      is_spanish_friendly: false,
      has_benefits: false,
      prevailing_wage: false,
    });
  };

  const hasActiveFilters =
    filters.category ||
    filters.job_type.length > 0 ||
    filters.shift.length > 0 ||
    filters.pay_min ||
    filters.union_status ||
    filters.is_urgently_hiring ||
    filters.is_degree_required ||
    filters.is_spanish_friendly ||
    filters.has_benefits ||
    filters.prevailing_wage;

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-navy">Filters</h3>
        {hasActiveFilters && (
          <button
            type="button"
            onClick={clearFilters}
            className="text-sm text-gray-500 hover:text-red flex items-center gap-1 transition-colors"
          >
            <X className="w-4 h-4" />
            Clear Filters
          </button>
        )}
      </div>

      {/* Category */}
      <Select
        label="Category"
        placeholder="All Categories"
        value={filters.category}
        onChange={(e) => update({ category: e.target.value })}
        options={JOB_CATEGORIES.map((c) => ({ value: c, label: c }))}
      />

      {/* Job Type */}
      <fieldset>
        <legend className="block text-sm font-medium text-gray-700 mb-2">Job Type</legend>
        <div className="space-y-2">
          {JOB_TYPES.map((type) => (
            <label key={type.value} className="flex items-center gap-2 cursor-pointer group">
              <input
                type="checkbox"
                checked={filters.job_type.includes(type.value)}
                onChange={() =>
                  update({ job_type: toggleArrayValue(filters.job_type, type.value) })
                }
                className="w-4 h-4 rounded border-gray-300 text-orange focus:ring-orange"
              />
              <span className="text-sm text-gray-700 group-hover:text-gray-900">
                {type.label}
              </span>
            </label>
          ))}
        </div>
      </fieldset>

      {/* Shift */}
      <fieldset>
        <legend className="block text-sm font-medium text-gray-700 mb-2">Shift</legend>
        <div className="space-y-2">
          {SHIFTS.map((shift) => (
            <label key={shift} className="flex items-center gap-2 cursor-pointer group">
              <input
                type="checkbox"
                checked={filters.shift.includes(shift)}
                onChange={() =>
                  update({ shift: toggleArrayValue(filters.shift, shift) })
                }
                className="w-4 h-4 rounded border-gray-300 text-orange focus:ring-orange"
              />
              <span className="text-sm text-gray-700 group-hover:text-gray-900">
                {SHIFT_LABELS[shift]}
              </span>
            </label>
          ))}
        </div>
      </fieldset>

      {/* Pay Range */}
      <Input
        label="Minimum Pay ($/hr)"
        type="number"
        placeholder="e.g. 15"
        value={filters.pay_min}
        onChange={(e) => update({ pay_min: e.target.value })}
        min={0}
        step={0.5}
      />

      {/* Union Status */}
      <Select
        label="Union Status"
        value={filters.union_status}
        onChange={(e) => update({ union_status: e.target.value })}
        options={UNION_OPTIONS}
      />

      {/* Toggles */}
      <div className="space-y-3 pt-2 border-t border-gray-200">
        <Toggle
          label="Urgently Hiring"
          checked={filters.is_urgently_hiring}
          onChange={(checked) => update({ is_urgently_hiring: checked })}
        />
        <Toggle
          label="No Degree Required"
          checked={filters.is_degree_required}
          onChange={(checked) => update({ is_degree_required: checked })}
        />
        <Toggle
          label="Spanish Friendly"
          checked={filters.is_spanish_friendly}
          onChange={(checked) => update({ is_spanish_friendly: checked })}
        />
        <Toggle
          label="Benefits"
          checked={filters.has_benefits}
          onChange={(checked) => update({ has_benefits: checked })}
        />
        <Toggle
          label="Prevailing Wage"
          checked={filters.prevailing_wage}
          onChange={(checked) => update({ prevailing_wage: checked })}
        />
      </div>

      {/* Clear Filters Button (mobile) */}
      {hasActiveFilters && (
        <Button variant="outline" size="sm" onClick={clearFilters} className="w-full sm:hidden">
          Clear All Filters
        </Button>
      )}
    </div>
  );
}
