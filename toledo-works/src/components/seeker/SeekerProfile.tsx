import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../lib/supabase';
import { SHIFT_LABELS } from '../../lib/constants';
import Card from '../ui/Card';
import Badge from '../ui/Badge';
import Button from '../ui/Button';
import Skeleton from '../ui/Skeleton';
import ProfileBuilder from './ProfileBuilder';
import { Link } from 'react-router-dom';
import {
  User,
  Phone,
  MapPin,
  Briefcase,
  Clock,
  Car,
  GraduationCap,
  Pencil,
  Wrench,
} from 'lucide-react';
import type { SeekerProfile as SeekerProfileType, SkillsCard } from '../../types';

export default function SeekerProfile() {
  const { profile } = useAuth();
  const [seekerProfile, setSeekerProfile] = useState<SeekerProfileType | null>(null);
  const [skillsCard, setSkillsCard] = useState<SkillsCard | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    if (!profile?.id) return;
    fetchSeekerData();
  }, [profile?.id]);

  async function fetchSeekerData() {
    setLoading(true);
    try {
      const [seekerRes, skillsRes] = await Promise.all([
        supabase
          .from('seeker_profiles')
          .select('*')
          .eq('profile_id', profile!.id)
          .maybeSingle(),
        supabase
          .from('skills_cards')
          .select('*')
          .eq('profile_id', profile!.id)
          .maybeSingle(),
      ]);

      setSeekerProfile(seekerRes.data);
      setSkillsCard(skillsRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <Card className="max-w-xl mx-auto space-y-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-1/2" />
      </Card>
    );
  }

  if (editing) {
    return (
      <ProfileBuilder
        existingProfile={seekerProfile}
        onComplete={() => {
          setEditing(false);
          fetchSeekerData();
        }}
      />
    );
  }

  if (!seekerProfile) {
    return (
      <div className="max-w-xl mx-auto text-center py-12 space-y-4">
        <h2 className="text-xl font-bold text-navy">Let's build your profile</h2>
        <p className="text-gray-500">
          Tell us a little about yourself so we can match you with the right jobs.
        </p>
        <Button onClick={() => setEditing(true)}>Get Started</Button>
      </div>
    );
  }

  const educationLabels: Record<string, string> = {
    none: 'No diploma / Still in school',
    ged: 'GED',
    high_school: 'High School Diploma',
    some_college: 'Some College',
    associates: "Associate's Degree",
    bachelors: "Bachelor's Degree",
    trade_cert: 'Trade / Vocational Certificate',
  };

  const experienceLabels: Record<string, string> = {
    none: 'Just getting started',
    '1-2': '1-2 years',
    '3-5': '3-5 years',
    '5-10': '5-10 years',
    '10+': '10+ years',
  };

  return (
    <Card className="max-w-xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-navy">Your Profile</h2>
        <Button variant="ghost" size="sm" onClick={() => setEditing(true)}>
          <Pencil className="w-4 h-4 mr-1" />
          Edit
        </Button>
      </div>

      <div className="space-y-5">
        {/* Name */}
        <div className="flex items-center gap-3">
          <User className="w-5 h-5 text-gray-400 shrink-0" />
          <div>
            <p className="text-sm text-gray-500">Name</p>
            <p className="font-medium text-gray-900">{profile?.full_name || 'Not set'}</p>
          </div>
        </div>

        {/* Phone */}
        <div className="flex items-center gap-3">
          <Phone className="w-5 h-5 text-gray-400 shrink-0" />
          <div>
            <p className="text-sm text-gray-500">Phone</p>
            <p className="font-medium text-gray-900">{profile?.phone || 'Not provided'}</p>
          </div>
        </div>

        {/* Zip */}
        <div className="flex items-center gap-3">
          <MapPin className="w-5 h-5 text-gray-400 shrink-0" />
          <div>
            <p className="text-sm text-gray-500">Zip Code</p>
            <p className="font-medium text-gray-900">{profile?.zip_code || 'Not set'}</p>
          </div>
        </div>

        {/* Categories */}
        <div className="flex items-start gap-3">
          <Briefcase className="w-5 h-5 text-gray-400 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm text-gray-500 mb-1">Looking for work in</p>
            <div className="flex flex-wrap gap-1.5">
              {seekerProfile.job_categories.map((cat) => (
                <Badge key={cat} variant="navy">{cat}</Badge>
              ))}
            </div>
          </div>
        </div>

        {/* Shifts */}
        {seekerProfile.preferred_shifts.length > 0 && (
          <div className="flex items-start gap-3">
            <Clock className="w-5 h-5 text-gray-400 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm text-gray-500 mb-1">Preferred shifts</p>
              <div className="flex flex-wrap gap-1.5">
                {seekerProfile.preferred_shifts.map((s) => (
                  <Badge key={s} variant="gray">{SHIFT_LABELS[s] || s}</Badge>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Transport */}
        <div className="flex items-center gap-3">
          <Car className="w-5 h-5 text-gray-400 shrink-0" />
          <div>
            <p className="text-sm text-gray-500">Reliable transportation</p>
            <p className="font-medium text-gray-900">
              {seekerProfile.has_reliable_transport ? 'Yes' : 'No'}
            </p>
          </div>
        </div>

        {/* Education */}
        {seekerProfile.education_level && (
          <div className="flex items-center gap-3">
            <GraduationCap className="w-5 h-5 text-gray-400 shrink-0" />
            <div>
              <p className="text-sm text-gray-500">Education</p>
              <p className="font-medium text-gray-900">
                {educationLabels[seekerProfile.education_level] || seekerProfile.education_level}
              </p>
            </div>
          </div>
        )}

        {/* Experience */}
        {seekerProfile.experience_years && (
          <div className="flex items-center gap-3">
            <Briefcase className="w-5 h-5 text-gray-400 shrink-0" />
            <div>
              <p className="text-sm text-gray-500">Experience</p>
              <p className="font-medium text-gray-900">
                {experienceLabels[seekerProfile.experience_years] || seekerProfile.experience_years}
              </p>
            </div>
          </div>
        )}

        {/* Skills Card link */}
        {skillsCard ? (
          <Link
            to="/skills-card"
            className="flex items-center gap-3 p-3 bg-navy/5 rounded-card border border-navy/20 hover:bg-navy/10 transition-colors"
          >
            <Wrench className="w-5 h-5 text-navy shrink-0" />
            <div className="flex-1">
              <p className="text-sm font-semibold text-navy">Skills Card</p>
              <p className="text-xs text-gray-600">{skillsCard.trade_category} &middot; View or edit</p>
            </div>
          </Link>
        ) : (
          seekerProfile.job_categories.includes('Construction/Trades') && (
            <Link
              to="/skills-card"
              className="flex items-center gap-3 p-3 bg-orange/5 rounded-card border border-orange/20 hover:bg-orange/10 transition-colors"
            >
              <Wrench className="w-5 h-5 text-orange shrink-0" />
              <div className="flex-1">
                <p className="text-sm font-semibold text-orange">Build your Skills Card</p>
                <p className="text-xs text-gray-600">Stand out to trades employers</p>
              </div>
            </Link>
          )
        )}
      </div>
    </Card>
  );
}
