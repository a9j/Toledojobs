import { useState, useCallback } from 'react';
import { TRADE_CATEGORIES, CERTIFICATIONS } from '../../lib/constants';
import { useSaveSkillsCard } from '../../hooks/useSkillsCard';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { Toggle } from '../ui/Toggle';
import type { SkillsCard } from '../../types';

interface SkillsCardFormProps {
  initial?: SkillsCard | null;
  onSaved?: () => void;
}

const EXPERIENCE_LEVELS = [
  { value: 'apprentice', label: 'Apprentice' },
  { value: 'journeyman', label: 'Journeyman' },
  { value: 'master', label: 'Master' },
] as const;

const UNION_OPTIONS = [
  { value: 'union_member', label: 'Union Member' },
  { value: 'willing_to_join', label: 'Willing to Join' },
  { value: 'non_union_only', label: 'Non-Union Only' },
] as const;

export default function SkillsCardForm({ initial, onSaved }: SkillsCardFormProps) {
  const { profile } = useAuth();
  const { mutate: saveCard, isPending } = useSaveSkillsCard();

  const [tradeCategory, setTradeCategory] = useState(initial?.trade_category ?? '');
  const [experienceYears, setExperienceYears] = useState<string>(
    initial?.experience_years != null ? String(initial.experience_years) : ''
  );
  const [experienceLevel, setExperienceLevel] = useState(initial?.experience_level ?? '');
  const [selectedCerts, setSelectedCerts] = useState<Set<string>>(
    new Set(initial?.certifications.map((c) => c.name) ?? [])
  );
  const [toolsOwned, setToolsOwned] = useState(initial?.tools_owned.join(', ') ?? '');
  const [hasTransport, setHasTransport] = useState(initial?.has_reliable_transport ?? false);
  const [hasOwnTools, setHasOwnTools] = useState(initial?.has_own_tools ?? false);
  const [hasPPE, setHasPPE] = useState(initial?.has_ppe ?? false);
  const [unionStatus, setUnionStatus] = useState(initial?.union_status ?? '');
  const [availableNow, setAvailableNow] = useState(initial?.available_now ?? false);
  const [willingToTravel, setWillingToTravel] = useState(initial?.willing_to_travel ?? false);

  const toggleCert = useCallback((cert: string) => {
    setSelectedCerts((prev) => {
      const next = new Set(prev);
      if (next.has(cert)) {
        next.delete(cert);
      } else {
        next.add(cert);
      }
      return next;
    });
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;

    const payload: Omit<SkillsCard, 'id'> = {
      profile_id: profile.id,
      trade_category: tradeCategory,
      experience_years: experienceYears ? Number(experienceYears) : null,
      experience_level:
        (experienceLevel as SkillsCard['experience_level']) || null,
      certifications: Array.from(selectedCerts).map((name) => ({ name })),
      tools_owned: toolsOwned
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean),
      has_reliable_transport: hasTransport,
      has_own_tools: hasOwnTools,
      has_ppe: hasPPE,
      union_status:
        (unionStatus as SkillsCard['union_status']) || null,
      available_now: availableNow,
      willing_to_travel: willingToTravel,
      availability_notes: null,
    };

    saveCard(
      { ...(initial ? { id: initial.id } : {}), ...payload } as SkillsCard,
      { onSuccess: () => onSaved?.() }
    );
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Trade category */}
      <div>
        <label className="block text-sm font-semibold text-gray-200 mb-1">
          Trade Category
        </label>
        <Select
          value={tradeCategory}
          onChange={(e) => setTradeCategory(e.target.value)}
          required
        >
          <option value="">Select a trade</option>
          {TRADE_CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </Select>
      </div>

      {/* Experience years */}
      <div>
        <label className="block text-sm font-semibold text-gray-200 mb-1">
          Years of Experience
        </label>
        <Input
          type="number"
          min={0}
          max={50}
          value={experienceYears}
          onChange={(e) => setExperienceYears(e.target.value)}
          placeholder="e.g. 5"
        />
      </div>

      {/* Experience level */}
      <div>
        <label className="block text-sm font-semibold text-gray-200 mb-1">
          Experience Level
        </label>
        <Select
          value={experienceLevel}
          onChange={(e) => setExperienceLevel(e.target.value)}
        >
          <option value="">Select level</option>
          {EXPERIENCE_LEVELS.map((lvl) => (
            <option key={lvl.value} value={lvl.value}>
              {lvl.label}
            </option>
          ))}
        </Select>
      </div>

      {/* Certifications */}
      <fieldset>
        <legend className="block text-sm font-semibold text-gray-200 mb-2">
          Certifications
        </legend>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 max-h-64 overflow-y-auto rounded-lg bg-navy-800 p-3">
          {CERTIFICATIONS.map((cert) => (
            <label
              key={cert}
              className="flex items-center gap-2 text-sm text-gray-300 cursor-pointer hover:text-white"
            >
              <input
                type="checkbox"
                checked={selectedCerts.has(cert)}
                onChange={() => toggleCert(cert)}
                className="rounded border-gray-600 bg-navy-700 text-orange-500 focus:ring-orange-500"
              />
              {cert}
            </label>
          ))}
        </div>
      </fieldset>

      {/* Tools owned */}
      <div>
        <label className="block text-sm font-semibold text-gray-200 mb-1">
          Tools Owned (comma separated)
        </label>
        <Input
          value={toolsOwned}
          onChange={(e) => setToolsOwned(e.target.value)}
          placeholder="e.g. MIG welder, angle grinder, drill press"
        />
      </div>

      {/* Toggles */}
      <div className="space-y-3">
        <Toggle
          label="Reliable Transportation"
          checked={hasTransport}
          onChange={setHasTransport}
        />
        <Toggle
          label="Own Tools"
          checked={hasOwnTools}
          onChange={setHasOwnTools}
        />
        <Toggle
          label="Own PPE"
          checked={hasPPE}
          onChange={setHasPPE}
        />
        <Toggle
          label="Available Now"
          checked={availableNow}
          onChange={setAvailableNow}
        />
        <Toggle
          label="Willing to Travel"
          checked={willingToTravel}
          onChange={setWillingToTravel}
        />
      </div>

      {/* Union status */}
      <fieldset>
        <legend className="block text-sm font-semibold text-gray-200 mb-2">
          Union Status
        </legend>
        <div className="flex flex-col gap-2">
          {UNION_OPTIONS.map((opt) => (
            <label
              key={opt.value}
              className="flex items-center gap-2 text-sm text-gray-300 cursor-pointer hover:text-white"
            >
              <input
                type="radio"
                name="union_status"
                value={opt.value}
                checked={unionStatus === opt.value}
                onChange={() => setUnionStatus(opt.value)}
                className="border-gray-600 bg-navy-700 text-orange-500 focus:ring-orange-500"
              />
              {opt.label}
            </label>
          ))}
        </div>
      </fieldset>

      {/* Submit */}
      <Button type="submit" disabled={isPending} className="w-full">
        {isPending ? 'Saving...' : initial ? 'Update Skills Card' : 'Create Skills Card'}
      </Button>
    </form>
  );
}
