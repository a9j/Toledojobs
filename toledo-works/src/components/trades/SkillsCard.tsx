import { Wrench, Truck, HardHat } from 'lucide-react';
import { Badge } from '../ui/Badge';
import { Chip } from '../ui/Chip';
import type { SkillsCard as SkillsCardType, Profile } from '../../types';

interface SkillsCardProps {
  card: SkillsCardType;
  profile: Profile;
}

const LEVEL_STYLES: Record<string, { bg: string; text: string }> = {
  apprentice: { bg: 'bg-blue-500/20', text: 'text-blue-400' },
  journeyman: { bg: 'bg-orange-500/20', text: 'text-orange-400' },
  master: { bg: 'bg-yellow-500/20', text: 'text-yellow-400' },
};

const LEVEL_LABELS: Record<string, string> = {
  apprentice: 'Apprentice',
  journeyman: 'Journeyman',
  master: 'Master',
};

export default function SkillsCard({ card, profile }: SkillsCardProps) {
  const level = card.experience_level ?? 'apprentice';
  const levelStyle = LEVEL_STYLES[level] ?? LEVEL_STYLES.apprentice;
  const levelLabel = LEVEL_LABELS[level] ?? 'Apprentice';

  return (
    <div className="relative w-full max-w-md rounded-xl bg-navy-900 border border-navy-700 overflow-hidden shadow-xl">
      {/* Header bar */}
      <div className="bg-orange-500 px-5 py-2 flex items-center justify-between">
        <span className="text-white text-xs font-bold tracking-wider uppercase">
          Skills Card
        </span>
        {card.available_now && (
          <span className="flex items-center gap-1.5 text-white text-xs font-semibold">
            <span className="relative flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-green-400" />
            </span>
            Available Now
          </span>
        )}
      </div>

      <div className="p-5 space-y-4">
        {/* Identity */}
        <div>
          <h3 className="text-white text-xl font-bold leading-tight">
            {profile.full_name ?? 'Trade Professional'}
          </h3>
          <p className="text-orange-400 font-semibold text-sm mt-0.5">
            {card.trade_category}
          </p>
        </div>

        {/* Level & years */}
        <div className="flex items-center gap-3">
          <span
            className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-bold ${levelStyle.bg} ${levelStyle.text}`}
          >
            {levelLabel}
          </span>
          {card.experience_years != null && (
            <span className="text-gray-400 text-sm">
              {card.experience_years} {card.experience_years === 1 ? 'year' : 'years'} experience
            </span>
          )}
        </div>

        {/* Certifications */}
        {card.certifications.length > 0 && (
          <div>
            <p className="text-gray-500 text-xs uppercase tracking-wider mb-2 font-semibold">
              Certifications
            </p>
            <div className="flex flex-wrap gap-1.5">
              {card.certifications.map((cert) => (
                <Chip key={cert.name} variant="secondary" size="sm">
                  {cert.name}
                  {cert.year ? ` (${cert.year})` : ''}
                </Chip>
              ))}
            </div>
          </div>
        )}

        {/* Quick indicators */}
        <div className="flex items-center gap-4 pt-1">
          {card.has_reliable_transport && (
            <div className="flex items-center gap-1.5 text-green-400" title="Has reliable transport">
              <Truck className="h-4 w-4" />
              <span className="text-xs font-medium">Transport</span>
            </div>
          )}
          {card.has_own_tools && (
            <div className="flex items-center gap-1.5 text-green-400" title="Owns tools">
              <Wrench className="h-4 w-4" />
              <span className="text-xs font-medium">Own Tools</span>
            </div>
          )}
          {card.has_ppe && (
            <div className="flex items-center gap-1.5 text-green-400" title="Has PPE">
              <HardHat className="h-4 w-4" />
              <span className="text-xs font-medium">PPE</span>
            </div>
          )}
        </div>

        {/* Union status */}
        {card.union_status && (
          <div className="pt-1 border-t border-navy-700">
            <Badge
              variant={card.union_status === 'union_member' ? 'default' : 'outline'}
            >
              {card.union_status === 'union_member'
                ? 'Union Member'
                : card.union_status === 'willing_to_join'
                  ? 'Willing to Join Union'
                  : 'Non-Union'}
            </Badge>
          </div>
        )}
      </div>
    </div>
  );
}
