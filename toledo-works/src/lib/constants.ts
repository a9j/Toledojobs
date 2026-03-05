export const JOB_CATEGORIES = [
  'Warehouse',
  'Healthcare',
  'Manufacturing',
  'Restaurant/Service',
  'Retail',
  'Construction/Trades',
  'Driving/CDL',
  'Office/Admin',
  'Education',
  'Tech',
  'Other',
] as const;

export const TRADE_CATEGORIES = [
  'Welding',
  'Electrical',
  'HVAC',
  'Plumbing',
  'Carpentry',
  'CDL/Driving',
  'CNC/Machining',
  'Solar/Energy',
  'Roofing',
  'Heavy Equipment',
  'Painting',
  'Concrete/Masonry',
  'Auto/Diesel Mechanic',
  'General Labor',
] as const;

export const SHIFTS = [
  'first',
  'second',
  'third',
  'flexible',
  'weekends',
  'rotating',
] as const;

export const SHIFT_LABELS: Record<string, string> = {
  first: '1st Shift',
  second: '2nd Shift',
  third: '3rd Shift',
  flexible: 'Flexible',
  weekends: 'Weekends',
  rotating: 'Rotating',
};

export const CERTIFICATIONS = [
  'OSHA 10',
  'OSHA 30',
  'CDL-A',
  'CDL-B',
  'EPA 608',
  'MIG Welding',
  'TIG Welding',
  'Stick Welding',
  'Flux Core Welding',
  'Journeyman Electrician',
  'Master Electrician',
  'Journeyman Plumber',
  'Master Plumber',
  'HVAC Certified',
  'Forklift Certified',
  'First Aid/CPR',
  'Confined Space',
  'Fall Protection',
  'Scaffolding',
  'Rigging/Signal',
] as const;

export const FOUNDING_EMPLOYER_END_DATE = '2026-06-04';
export const BRAND_NAME = 'Toledo Works';
