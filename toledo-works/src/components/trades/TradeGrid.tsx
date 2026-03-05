import { Link } from 'react-router-dom';
import { TRADE_CATEGORIES } from '../../lib/constants';
import {
  Wrench,
  Zap,
  Flame,
  Droplets,
  Hammer,
  Truck,
  Cog,
  Sun,
  HardHat,
  Construction,
  Paintbrush,
  Building2,
  Car,
  Users,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

const TRADE_ICONS: Record<string, LucideIcon> = {
  'Welding': Flame,
  'Electrical': Zap,
  'HVAC': Wrench,
  'Plumbing': Droplets,
  'Carpentry': Hammer,
  'CDL/Driving': Truck,
  'CNC/Machining': Cog,
  'Solar/Energy': Sun,
  'Roofing': HardHat,
  'Heavy Equipment': Construction,
  'Painting': Paintbrush,
  'Concrete/Masonry': Building2,
  'Auto/Diesel Mechanic': Car,
  'General Labor': Users,
};

const TRADE_JOB_COUNTS: Record<string, number> = {
  'Welding': 12,
  'Electrical': 18,
  'HVAC': 9,
  'Plumbing': 7,
  'Carpentry': 14,
  'CDL/Driving': 22,
  'CNC/Machining': 6,
  'Solar/Energy': 4,
  'Roofing': 8,
  'Heavy Equipment': 11,
  'Painting': 5,
  'Concrete/Masonry': 10,
  'Auto/Diesel Mechanic': 13,
  'General Labor': 25,
};

function toSlug(category: string): string {
  return category.toLowerCase().replace(/[\/\s]+/g, '-');
}

export default function TradeGrid() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {TRADE_CATEGORIES.map((trade) => {
        const Icon = TRADE_ICONS[trade] || Wrench;
        const count = TRADE_JOB_COUNTS[trade] ?? 0;

        return (
          <Link
            key={trade}
            to={`/trades/${toSlug(trade)}`}
            className="group block rounded-lg bg-navy-900 border-2 border-navy-700 p-6 text-center
              hover:border-orange-500 hover:shadow-lg hover:shadow-orange-500/20
              transition-all duration-200 active:scale-95"
          >
            <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-orange-500/10 group-hover:bg-orange-500/20 transition-colors">
              <Icon className="h-7 w-7 text-orange-500" />
            </div>
            <h3 className="text-white font-bold text-sm md:text-base leading-tight mb-1">
              {trade}
            </h3>
            <span className="text-orange-400 text-xs font-semibold">
              {count} active {count === 1 ? 'job' : 'jobs'}
            </span>
          </Link>
        );
      })}
    </div>
  );
}
