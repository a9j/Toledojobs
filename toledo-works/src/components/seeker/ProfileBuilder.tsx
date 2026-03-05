import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useTranslation } from '../../context/LanguageContext';
import { supabase } from '../../lib/supabase';
import { JOB_CATEGORIES, SHIFTS, SHIFT_LABELS } from '../../lib/constants';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Select from '../ui/Select';
import Toggle from '../ui/Toggle';
import Chip from '../ui/Chip';
import Card from '../ui/Card';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { ArrowLeft, ArrowRight, Check, Wrench } from 'lucide-react';
import type { SeekerProfile } from '../../types';

interface ProfileBuilderProps {
  existingProfile?: SeekerProfile | null;
  onComplete?: () => void;
}

const EDUCATION_OPTIONS = [
  { value: 'none', label: 'No diploma / Still in school' },
  { value: 'ged', label: 'GED' },
  { value: 'high_school', label: 'High School Diploma' },
  { value: 'some_college', label: 'Some College' },
  { value: 'associates', label: "Associate's Degree" },
  { value: 'bachelors', label: "Bachelor's Degree" },
  { value: 'trade_cert', label: 'Trade / Vocational Certificate' },
];

const EXPERIENCE_OPTIONS = [
  { value: 'none', label: "I'm just getting started" },
  { value: '1-2', label: '1-2 years' },
  { value: '3-5', label: '3-5 years' },
  { value: '5-10', label: '5-10 years' },
  { value: '10+', label: '10+ years' },
];

const STEPS = ['basics', 'preferences', 'background'] as const;
type Step = typeof STEPS[number];

export default function ProfileBuilder({ existingProfile, onComplete }: ProfileBuilderProps) {
  const { user, profile, updateProfile } = useAuth();
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [step, setStep] = useState<Step>('basics');
  const [saving, setSaving] = useState(false);

  // Basics
  const [fullName, setFullName] = useState(profile?.full_name || '');
  const [phone, setPhone] = useState(profile?.phone || '');
  const [zipCode, setZipCode] = useState(profile?.zip_code || '');
  const [preferredLanguage, setPreferredLanguage] = useState<'en' | 'es'>(profile?.preferred_language || 'en');

  // Preferences
  const [jobCategories, setJobCategories] = useState<string[]>(existingProfile?.job_categories || []);
  const [preferredShifts, setPreferredShifts] = useState<string[]>(existingProfile?.preferred_shifts || []);
  const [hasTransport, setHasTransport] = useState(existingProfile?.has_reliable_transport ?? false);

  // Background
  const [educationLevel, setEducationLevel] = useState(existingProfile?.education_level || '');
  const [experienceYears, setExperienceYears] = useState(existingProfile?.experience_years || '');

  const currentStepIndex = STEPS.indexOf(step);

  function toggleCategory(cat: string) {
    setJobCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
  }

  function toggleShift(shift: string) {
    setPreferredShifts((prev) =>
      prev.includes(shift) ? prev.filter((s) => s !== shift) : [...prev, shift]
    );
  }

  function canAdvance(): boolean {
    if (step === 'basics') return !!fullName.trim() && !!zipCode.trim();
    if (step === 'preferences') return jobCategories.length > 0;
    return true;
  }

  function goNext() {
    if (currentStepIndex < STEPS.length - 1) {
      setStep(STEPS[currentStepIndex + 1]);
    }
  }

  function goBack() {
    if (currentStepIndex > 0) {
      setStep(STEPS[currentStepIndex - 1]);
    }
  }

  async function handleSubmit() {
    if (!user) return;
    setSaving(true);

    try {
      // Update profiles table
      await updateProfile({
        full_name: fullName.trim(),
        phone: phone.trim() || null,
        zip_code: zipCode.trim(),
        preferred_language: preferredLanguage,
      });

      // Upsert seeker_profiles
      const seekerData = {
        profile_id: user.id,
        job_categories: jobCategories,
        preferred_shifts: preferredShifts,
        has_reliable_transport: hasTransport,
        speaks_spanish: preferredLanguage === 'es',
        education_level: educationLevel || null,
        experience_years: experienceYears || null,
      };

      if (existingProfile?.id) {
        const { error } = await supabase
          .from('seeker_profiles')
          .update(seekerData)
          .eq('id', existingProfile.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('seeker_profiles')
          .insert(seekerData);
        if (error) throw error;
      }

      toast.success('Profile saved!');

      // If Construction/Trades selected, prompt for Skills Card
      if (jobCategories.includes('Construction/Trades')) {
        const buildCard = window.confirm(
          'Since you selected Construction/Trades, would you like to build your Skills Card? It helps you stand out to employers.'
        );
        if (buildCard) {
          navigate('/skills-card');
          return;
        }
      }

      onComplete?.();
    } catch (err) {
      console.error(err);
      toast.error('Something went wrong saving your profile.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <Card className="max-w-xl mx-auto">
      {/* Progress */}
      <div className="flex items-center gap-2 mb-8">
        {STEPS.map((s, i) => (
          <div key={s} className="flex items-center gap-2 flex-1">
            <div
              className={`h-2 flex-1 rounded-full transition-colors ${
                i <= currentStepIndex ? 'bg-orange' : 'bg-gray-200'
              }`}
            />
          </div>
        ))}
      </div>

      {/* Step: Basics */}
      {step === 'basics' && (
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-bold text-navy mb-1">Let's start with the basics</h2>
            <p className="text-gray-500 text-sm">Just a few things so employers can reach you.</p>
          </div>

          <Input
            label="What's your name?"
            placeholder="Your full name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
          />

          <Input
            label="Phone number (optional)"
            placeholder="(419) 555-1234"
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />

          <Input
            label="Zip code"
            placeholder="43604"
            value={zipCode}
            onChange={(e) => setZipCode(e.target.value)}
            maxLength={5}
          />

          <Select
            label="Preferred language"
            value={preferredLanguage}
            onChange={(e) => setPreferredLanguage(e.target.value as 'en' | 'es')}
            options={[
              { value: 'en', label: 'English' },
              { value: 'es', label: 'Espanol' },
            ]}
          />
        </div>
      )}

      {/* Step: Preferences */}
      {step === 'preferences' && (
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-bold text-navy mb-1">What kind of work are you looking for?</h2>
            <p className="text-gray-500 text-sm">Pick all that fit. You can always change these later.</p>
          </div>

          <div>
            <p className="text-sm font-medium text-gray-700 mb-3">Job categories</p>
            <div className="flex flex-wrap gap-2">
              {JOB_CATEGORIES.map((cat) => (
                <Chip
                  key={cat}
                  label={cat}
                  active={jobCategories.includes(cat)}
                  onClick={() => toggleCategory(cat)}
                />
              ))}
            </div>
          </div>

          <div>
            <p className="text-sm font-medium text-gray-700 mb-3">Preferred shifts</p>
            <div className="flex flex-wrap gap-2">
              {SHIFTS.map((shift) => (
                <Chip
                  key={shift}
                  label={SHIFT_LABELS[shift]}
                  active={preferredShifts.includes(shift)}
                  onClick={() => toggleShift(shift)}
                />
              ))}
            </div>
          </div>

          <Toggle
            label="I have reliable transportation"
            checked={hasTransport}
            onChange={setHasTransport}
          />
        </div>
      )}

      {/* Step: Background */}
      {step === 'background' && (
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-bold text-navy mb-1">Almost done!</h2>
            <p className="text-gray-500 text-sm">
              This helps us match you with the right opportunities. No judgment here.
            </p>
          </div>

          <Select
            label="Education level"
            value={educationLevel}
            onChange={(e) => setEducationLevel(e.target.value)}
            options={EDUCATION_OPTIONS}
            placeholder="Select one..."
          />

          <Select
            label="Work experience"
            value={experienceYears}
            onChange={(e) => setExperienceYears(e.target.value)}
            options={EXPERIENCE_OPTIONS}
            placeholder="Select one..."
          />

          {jobCategories.includes('Construction/Trades') && (
            <div className="flex items-start gap-3 p-4 bg-navy/5 rounded-card border border-navy/20">
              <Wrench className="w-5 h-5 text-navy mt-0.5 shrink-0" />
              <div>
                <p className="text-sm font-semibold text-navy">Build your Skills Card</p>
                <p className="text-xs text-gray-600 mt-0.5">
                  Since you're interested in the trades, you'll be able to build a Skills Card
                  after saving your profile. It shows employers your certs, tools, and experience at a glance.
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Navigation */}
      <div className="flex justify-between mt-8 pt-6 border-t border-gray-100">
        {currentStepIndex > 0 ? (
          <Button variant="ghost" onClick={goBack}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
        ) : (
          <div />
        )}

        {currentStepIndex < STEPS.length - 1 ? (
          <Button onClick={goNext} disabled={!canAdvance()}>
            Next
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        ) : (
          <Button onClick={handleSubmit} loading={saving} disabled={!canAdvance()}>
            <Check className="w-4 h-4 mr-2" />
            Save Profile
          </Button>
        )}
      </div>
    </Card>
  );
}
