import { useJobStore } from '../store/jobStore';

const chips = [
  { key: 'hiringNow', label: 'Hiring Now' },
  { key: 'noDegree', label: 'No Degree Required' },
  { key: 'spanishFriendly', label: 'Spanish-Friendly' },
  { key: 'trades', label: 'Trades' },
  { key: 'warehouse', label: 'Warehouse' },
  { key: 'healthcare', label: 'Healthcare' },
  { key: 'restaurant', label: 'Restaurant/Service' },
  { key: 'pay15Plus', label: '$15+/hr' },
  { key: 'pay20Plus', label: '$20+/hr' },
  { key: 'secondShift', label: 'Second Shift' },
  { key: 'thirdShift', label: 'Third Shift' },
] as const;

export default function FilterChips() {
  const { filters, toggleFilter } = useJobStore();

  return (
    <div className="flex flex-wrap gap-2 justify-center max-w-3xl mx-auto mt-4">
      {chips.map((chip) => {
        const isActive = filters[chip.key];
        return (
          <button
            key={chip.key}
            onClick={() => toggleFilter(chip.key)}
            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all cursor-pointer border ${
              isActive
                ? 'bg-orange text-white border-orange shadow-sm'
                : 'bg-white text-navy border-gray-300 hover:border-orange hover:text-orange'
            }`}
          >
            {chip.label}
          </button>
        );
      })}
    </div>
  );
}
