import { useState } from 'react';
import { Wrench, Shield, HardHat, Truck, Clock, Car } from 'lucide-react';
import SkillsCardDisplay from './SkillsCardDisplay';

const TRADE_OPTIONS = [
  'Welding', 'Electrical', 'HVAC', 'Plumbing', 'Carpentry',
  'CDL/Driving', 'CNC/Machining', 'Solar/Energy', 'Roofing',
  'Heavy Equipment', 'Painting', 'Concrete/Masonry', 'Auto/Diesel Mechanic',
  'General Labor',
];

const CERTIFICATION_OPTIONS = [
  'OSHA 10', 'OSHA 30', 'CDL-A', 'CDL-B', 'EPA 608',
  'MIG Welding', 'TIG Welding', 'Stick Welding', 'Flux Core Welding',
  'Journeyman Electrician', 'Master Electrician',
  'Journeyman Plumber', 'Master Plumber',
  'HVAC Certified', 'Forklift Certified', 'First Aid/CPR',
  'Confined Space', 'Fall Protection', 'Scaffolding', 'Rigging/Signal',
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
  availabilityNotes?: string;
  reliableTransport?: boolean;
}

interface TradesSkillsCardProps {
  data: TradesSkillsData;
  onChange: (data: TradesSkillsData) => void;
  viewMode?: boolean;
  userName?: string;
}

export default function TradesSkillsCard({ data, onChange, viewMode = false, userName = '' }: TradesSkillsCardProps) {
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
      <SkillsCardDisplay
        data={{
          name: userName,
          primaryTrade: data.primaryTrade,
          experienceLevel: data.experienceLevel,
          yearsInTrade: data.yearsInTrade,
          certifications: data.certifications,
          ownTools: data.ownTools,
          ownPPE: data.ownPPE,
          reliableTransport: data.reliableTransport ?? false,
          unionStatus: data.unionStatus,
          availableNow: data.availableNow,
          willingToTravel: data.willingToTravel,
        }}
      />
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
          { label: 'Reliable Transport', key: 'reliableTransport' as const, icon: <Car className="w-3.5 h-3.5" /> },
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
              checked={data[toggle.key] || false}
              onChange={(e) => update({ [toggle.key]: e.target.checked })}
              className="sr-only"
            />
            {toggle.icon}
            <span className="text-sm font-medium">{toggle.label}</span>
          </label>
        ))}
      </div>

      {/* Availability Notes */}
      <div className="mt-4">
        <label className="block text-sm font-medium text-navy mb-1">Availability Notes (optional)</label>
        <textarea
          value={data.availabilityNotes || ''}
          onChange={(e) => update({ availabilityNotes: e.target.value })}
          rows={2}
          placeholder="e.g., Available after current project ends April 15, prefer day shifts..."
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-navy outline-none focus:border-orange text-sm resize-none"
        />
      </div>

      {/* Preview */}
      {data.primaryTrade && (
        <div className="mt-5">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Your Skills Card Preview</p>
          <SkillsCardDisplay
            data={{
              name: userName || 'Your Name',
              primaryTrade: data.primaryTrade,
              experienceLevel: data.experienceLevel,
              yearsInTrade: data.yearsInTrade,
              certifications: data.certifications,
              ownTools: data.ownTools,
              ownPPE: data.ownPPE,
              reliableTransport: data.reliableTransport ?? false,
              unionStatus: data.unionStatus,
              availableNow: data.availableNow,
              willingToTravel: data.willingToTravel,
            }}
          />
        </div>
      )}
    </div>
  );
}
