import { useState, useEffect } from 'react';
import { Wrench, Shield, HardHat, Truck, Clock, Award } from 'lucide-react';

const TRADE_OPTIONS = [
  'Electrical', 'Plumbing', 'HVAC', 'Welding', 'Carpentry', 'Machining',
  'Pipefitting', 'Ironwork', 'Masonry', 'Painting', 'Roofing', 'General Labor',
];

const CERTIFICATION_OPTIONS = [
  'OSHA 10', 'OSHA 30', 'EPA 608', 'AWS D1.1', 'CPR/First Aid',
  'Forklift', 'Confined Space', 'Fall Protection', 'Rigging & Signaling',
  'Journeyman License', 'Master License', 'CDL', 'Backflow Prevention',
];

const EXPERIENCE_LEVELS = [
  { value: 'apprentice', label: 'Apprentice' },
  { value: 'journeyman', label: 'Journeyman' },
  { value: 'master', label: 'Master' },
];

export interface TradesSkillsData {
  primaryTrade: string;
  experienceLevel: string;
  yearsInTrade: number;
  certifications: string[];
  ownTools: boolean;
  ownPPE: boolean;
  unionStatus: string;
  availableNow: boolean;
  willingToTravel: boolean;
}

interface TradesSkillsCardProps {
  data: TradesSkillsData;
  onChange: (data: TradesSkillsData) => void;
  viewMode?: boolean;
}

export default function TradesSkillsCard({ data, onChange, viewMode = false }: TradesSkillsCardProps) {
  function update(partial: Partial<TradesSkillsData>) {
    onChange({ ...data, ...partial });
  }

  function toggleCert(cert: string) {
    const certs = data.certifications.includes(cert)
      ? data.certifications.filter((c) => c !== cert)
      : [...data.certifications, cert];
    update({ certifications: certs });
  }

  if (viewMode) {
    return (
      <div className="bg-gradient-to-br from-navy to-navy-light rounded-xl p-5 text-white">
        <div className="flex items-center gap-2 mb-4">
          <HardHat className="w-5 h-5 text-orange" />
          <h3 className="text-lg font-bold">Trades Skills Card</h3>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-4">
          <div>
            <p className="text-xs text-white/50 uppercase tracking-wide">Trade</p>
            <p className="font-semibold">{data.primaryTrade || 'Not set'}</p>
          </div>
          <div>
            <p className="text-xs text-white/50 uppercase tracking-wide">Level</p>
            <p className="font-semibold capitalize">{data.experienceLevel || 'Not set'}</p>
          </div>
          <div>
            <p className="text-xs text-white/50 uppercase tracking-wide">Years</p>
            <p className="font-semibold">{data.yearsInTrade || 0}</p>
          </div>
          <div>
            <p className="text-xs text-white/50 uppercase tracking-wide">Union</p>
            <p className="font-semibold capitalize">{data.unionStatus.replace(/_/g, ' ') || 'N/A'}</p>
          </div>
        </div>

        {data.certifications.length > 0 && (
          <div className="mb-4">
            <p className="text-xs text-white/50 uppercase tracking-wide mb-1.5">Certifications</p>
            <div className="flex flex-wrap gap-1.5">
              {data.certifications.map((cert) => (
                <span key={cert} className="text-xs bg-white/15 text-white px-2 py-0.5 rounded-full flex items-center gap-1">
                  <Award className="w-3 h-3" /> {cert}
                </span>
              ))}
            </div>
          </div>
        )}

        <div className="flex flex-wrap gap-2">
          {data.ownTools && (
            <span className="text-xs bg-orange/20 text-orange px-2.5 py-1 rounded-full flex items-center gap-1">
              <Wrench className="w-3 h-3" /> Own Tools
            </span>
          )}
          {data.ownPPE && (
            <span className="text-xs bg-orange/20 text-orange px-2.5 py-1 rounded-full flex items-center gap-1">
              <Shield className="w-3 h-3" /> Own PPE
            </span>
          )}
          {data.availableNow && (
            <span className="text-xs bg-green-500/20 text-green-400 px-2.5 py-1 rounded-full flex items-center gap-1">
              <Clock className="w-3 h-3" /> Available Now
            </span>
          )}
          {data.willingToTravel && (
            <span className="text-xs bg-blue-500/20 text-blue-400 px-2.5 py-1 rounded-full flex items-center gap-1">
              <Truck className="w-3 h-3" /> Will Travel
            </span>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border-2 border-orange/20 p-5">
      <div className="flex items-center gap-2 mb-5">
        <HardHat className="w-5 h-5 text-orange" />
        <h3 className="text-lg font-bold text-navy">Trades Skills Card</h3>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Primary Trade */}
        <div>
          <label className="block text-sm font-medium text-navy mb-1">Primary Trade</label>
          <select
            value={data.primaryTrade}
            onChange={(e) => update({ primaryTrade: e.target.value })}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-navy outline-none focus:border-orange text-sm"
          >
            <option value="">Select trade...</option>
            {TRADE_OPTIONS.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>

        {/* Experience Level */}
        <div>
          <label className="block text-sm font-medium text-navy mb-1">Experience Level</label>
          <div className="flex gap-1.5">
            {EXPERIENCE_LEVELS.map((lvl) => (
              <button
                key={lvl.value}
                type="button"
                onClick={() => update({ experienceLevel: lvl.value })}
                className={`flex-1 py-2 text-xs font-medium rounded-lg border cursor-pointer transition-colors ${
                  data.experienceLevel === lvl.value
                    ? 'bg-orange text-white border-orange'
                    : 'bg-white text-navy border-gray-300 hover:border-orange'
                }`}
              >
                {lvl.label}
              </button>
            ))}
          </div>
        </div>

        {/* Years in Trade */}
        <div>
          <label className="block text-sm font-medium text-navy mb-1">Years in Trade</label>
          <input
            type="number"
            min={0}
            max={50}
            value={data.yearsInTrade}
            onChange={(e) => update({ yearsInTrade: Number(e.target.value) })}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-navy outline-none focus:border-orange text-sm"
          />
        </div>

        {/* Union Status */}
        <div>
          <label className="block text-sm font-medium text-navy mb-1">Union Status</label>
          <select
            value={data.unionStatus}
            onChange={(e) => update({ unionStatus: e.target.value })}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-navy outline-none focus:border-orange text-sm"
          >
            <option value="union_member">Union Member</option>
            <option value="willing_to_join">Willing to Join</option>
            <option value="non_union_only">Non-Union Only</option>
          </select>
        </div>
      </div>

      {/* Certifications */}
      <div className="mt-4">
        <label className="block text-sm font-medium text-navy mb-2">Certifications</label>
        <div className="flex flex-wrap gap-2">
          {CERTIFICATION_OPTIONS.map((cert) => (
            <button
              key={cert}
              type="button"
              onClick={() => toggleCert(cert)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer border ${
                data.certifications.includes(cert)
                  ? 'bg-orange text-white border-orange'
                  : 'bg-white text-navy border-gray-300 hover:border-orange'
              }`}
            >
              {cert}
            </button>
          ))}
        </div>
      </div>

      {/* Toggle Row */}
      <div className="grid grid-cols-2 gap-3 mt-4">
        {[
          { label: 'Own Tools', key: 'ownTools' as const, icon: <Wrench className="w-3.5 h-3.5" /> },
          { label: 'Own PPE', key: 'ownPPE' as const, icon: <Shield className="w-3.5 h-3.5" /> },
          { label: 'Available Now', key: 'availableNow' as const, icon: <Clock className="w-3.5 h-3.5" /> },
          { label: 'Will Travel', key: 'willingToTravel' as const, icon: <Truck className="w-3.5 h-3.5" /> },
        ].map((toggle) => (
          <label
            key={toggle.key}
            className={`flex items-center gap-2 p-3 rounded-lg border cursor-pointer transition-all ${
              data[toggle.key]
                ? 'border-orange bg-orange/5 text-navy'
                : 'border-gray-200 text-gray-500 hover:border-gray-300'
            }`}
          >
            <input
              type="checkbox"
              checked={data[toggle.key]}
              onChange={(e) => update({ [toggle.key]: e.target.checked })}
              className="sr-only"
            />
            {toggle.icon}
            <span className="text-sm font-medium">{toggle.label}</span>
          </label>
        ))}
      </div>

      {/* Preview */}
      {data.primaryTrade && (
        <div className="mt-5">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Preview</p>
          <TradesSkillsCard data={data} onChange={() => {}} viewMode />
        </div>
      )}
    </div>
  );
}
