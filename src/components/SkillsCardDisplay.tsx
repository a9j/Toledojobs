import {
  HardHat, Award, Wrench, Shield, Truck, Car, CheckCircle, User,
} from 'lucide-react';

export interface SkillsCardData {
  name: string;
  primaryTrade: string;
  experienceLevel: string; // apprentice | journeyman | master
  yearsInTrade: number;
  certifications: string[];
  ownTools: boolean;
  ownPPE: boolean;
  reliableTransport: boolean;
  unionStatus: string;
  availableNow: boolean;
  willingToTravel: boolean;
}

interface SkillsCardDisplayProps {
  data: SkillsCardData;
  compact?: boolean;
  blurred?: boolean;
}

const LEVEL_COLORS: Record<string, { bg: string; text: string; label: string }> = {
  apprentice: { bg: 'bg-blue-500', text: 'text-blue-100', label: 'Apprentice' },
  journeyman: { bg: 'bg-orange', text: 'text-white', label: 'Journeyman' },
  master: { bg: 'bg-amber-400', text: 'text-amber-900', label: 'Master' },
};

export default function SkillsCardDisplay({ data, compact = false, blurred = false }: SkillsCardDisplayProps) {
  const level = LEVEL_COLORS[data.experienceLevel] || LEVEL_COLORS.apprentice;

  return (
    <div className={`relative bg-gradient-to-br from-[#0f1a2e] via-navy to-[#1a2d4d] rounded-2xl overflow-hidden text-white ${
      compact ? 'p-4' : 'p-6'
    } ${blurred ? 'select-none' : ''}`}>
      {/* Card texture */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.04]" style={{
        backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
        backgroundSize: '20px 20px',
      }} />

      {/* Accent stripe */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-orange via-orange to-amber-400" />

      <div className={`relative z-10 ${blurred ? 'blur-[3px]' : ''}`}>
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/10 flex items-center justify-center">
              <User className="w-5 h-5 md:w-6 md:h-6 text-white/70" />
            </div>
            <div>
              <h3 className={`font-bold leading-tight ${compact ? 'text-base' : 'text-lg md:text-xl'}`}>
                {data.name || 'Trade Worker'}
              </h3>
              <p className="text-white/40 text-xs uppercase tracking-wider font-semibold mt-0.5">
                Toledo Works Skills Card
              </p>
            </div>
          </div>
          <HardHat className={`text-orange shrink-0 ${compact ? 'w-5 h-5' : 'w-6 h-6'}`} />
        </div>

        {/* Primary Trade + Level */}
        <div className={`mt-4 ${compact ? 'mt-3' : 'mt-5'}`}>
          <p className={`font-black tracking-tight text-orange ${compact ? 'text-xl' : 'text-2xl md:text-3xl'}`}>
            {data.primaryTrade || 'Trade'}
          </p>
          <div className="flex items-center gap-2 mt-1.5">
            <span className={`${level.bg} ${level.text} text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide`}>
              {level.label}
            </span>
            <span className="text-white/50 text-sm">
              {data.yearsInTrade} {data.yearsInTrade === 1 ? 'year' : 'years'} experience
            </span>
          </div>
        </div>

        {/* Certifications */}
        {data.certifications.length > 0 && (
          <div className={compact ? 'mt-3' : 'mt-5'}>
            <p className="text-[10px] text-white/30 uppercase tracking-wider font-bold mb-2">Certifications</p>
            <div className="flex flex-wrap gap-1.5">
              {data.certifications.map((cert) => (
                <span
                  key={cert}
                  className="inline-flex items-center gap-1 text-xs bg-white/10 backdrop-blur-sm text-white/90 px-2.5 py-1 rounded-full border border-white/5"
                >
                  <Award className="w-3 h-3 text-orange" /> {cert}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Status indicators */}
        <div className={`grid grid-cols-3 gap-2 ${compact ? 'mt-3' : 'mt-5'}`}>
          {[
            { show: data.ownTools, icon: Wrench, label: 'Own Tools', color: 'text-orange' },
            { show: data.ownPPE, icon: Shield, label: 'Own PPE', color: 'text-orange' },
            { show: data.reliableTransport, icon: Car, label: 'Transport', color: 'text-green-400' },
            { show: data.availableNow, icon: CheckCircle, label: 'Available', color: 'text-green-400' },
            { show: data.willingToTravel, icon: Truck, label: 'Will Travel', color: 'text-blue-400' },
            { show: !!data.unionStatus && data.unionStatus !== 'non_union_only', icon: Shield, label: data.unionStatus === 'union_member' ? 'Union' : 'Open to Union', color: 'text-blue-400' },
          ].filter((s) => s.show).map((status) => {
            const Icon = status.icon;
            return (
              <div key={status.label} className="flex items-center gap-1.5 bg-white/5 rounded-lg px-2 py-1.5">
                <Icon className={`w-3.5 h-3.5 ${status.color}`} />
                <span className="text-[11px] font-medium text-white/70">{status.label}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Blurred overlay message */}
      {blurred && (
        <div className="absolute inset-0 flex items-center justify-center z-20">
          <div className="bg-navy/80 backdrop-blur-sm rounded-lg px-6 py-3 text-center">
            <p className="text-white font-bold text-sm">Pro Tier Feature</p>
            <p className="text-white/50 text-xs mt-1">Upgrade to view full Skills Cards</p>
          </div>
        </div>
      )}
    </div>
  );
}
