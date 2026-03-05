import { Check } from 'lucide-react';
import { Link } from 'react-router-dom';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import Card from '../components/ui/Card';
import { useTranslation } from '../context/LanguageContext';
import { FOUNDING_EMPLOYER_END_DATE } from '../lib/constants';

const tiers = [
  {
    name: 'Free',
    price: 0,
    features: [
      '1 active job post',
      'Basic listing',
      'Email notifications',
      'Application tracking',
    ],
  },
  {
    name: 'Starter',
    price: 49,
    popular: true,
    features: [
      'Unlimited job posts',
      'Boosted visibility in search',
      'Company branding on listings',
      'Analytics dashboard',
      'Email + in-app notifications',
    ],
  },
  {
    name: 'Pro',
    price: 149,
    features: [
      'Everything in Starter',
      'AI candidate matching',
      'Featured employer badge',
      'Contractor Bench access',
      'Priority support',
      'Spanish auto-translation',
    ],
  },
  {
    name: 'Recruiter',
    price: 199,
    agency: true,
    features: [
      'Everything in Pro',
      'Bulk job posting',
      'Candidate search & filters',
      'Multi-user accounts',
      'Dedicated account support',
      'API access',
    ],
  },
];

const faqs = [
  {
    q: 'What is the Founding Employer program?',
    a: `Any employer who signs up before ${FOUNDING_EMPLOYER_END_DATE} gets access to all features for free during the launch period, plus a permanent "Founding Employer" badge on all their listings. This badge stays forever, even after paid tiers begin.`,
  },
  {
    q: 'When will paid tiers start?',
    a: `Paid tiers will begin after the Founding Employer period ends on ${FOUNDING_EMPLOYER_END_DATE}. All Founding Employers will be given advance notice and special transition pricing.`,
  },
  {
    q: 'Is there a contract or commitment?',
    a: 'No contracts. All paid plans are month-to-month. Cancel anytime.',
  },
  {
    q: 'How is this different from Indeed or LinkedIn?',
    a: 'Toledo Works is hyperlocal — built specifically for Toledo, Ohio employers and workers. We focus on blue-collar, trades, and hourly positions. No staffing agency middlemen, no corporate overhead. Just direct connections between local employers and local workers.',
  },
  {
    q: 'What is the Contractor Bench?',
    a: 'The Contractor Bench is a searchable directory of skilled trades workers and their Skills Cards. Pro-tier employers can browse and reach out to qualified tradespeople directly. Launching soon.',
  },
  {
    q: 'Do job seekers pay anything?',
    a: 'No. Toledo Works is completely free for job seekers. Always.',
  },
];

export default function Pricing() {
  const { t } = useTranslation();

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="font-display text-3xl md:text-4xl font-bold mb-3">{t.pricing.title}</h1>
        <p className="text-lg text-orange font-semibold">{t.pricing.subtitle}</p>
      </div>

      {/* Tier Cards */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
        {tiers.map((tier) => (
          <Card
            key={tier.name}
            className={`p-6 relative ${tier.popular ? 'border-2 border-orange ring-2 ring-orange/20' : ''}`}
          >
            {tier.popular && (
              <Badge variant="orange" className="absolute -top-3 left-1/2 -translate-x-1/2">
                {t.pricing.mostPopular}
              </Badge>
            )}
            {tier.agency && (
              <Badge variant="navy" className="absolute -top-3 left-1/2 -translate-x-1/2">
                {t.pricing.forAgencies}
              </Badge>
            )}
            <h3 className="font-display text-xl font-bold mt-2">{tier.name}</h3>
            <div className="my-4">
              <span className="text-4xl font-bold text-navy">${tier.price}</span>
              <span className="text-gray-500">{t.pricing.month}</span>
            </div>
            <ul className="space-y-3 mb-6">
              {tier.features.map((feature) => (
                <li key={feature} className="flex items-start gap-2 text-sm">
                  <Check className="w-4 h-4 text-green mt-0.5 flex-shrink-0" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
            {tier.price === 0 ? (
              <Link to="/signup">
                <Button variant="outline" className="w-full">{t.pricing.getStarted}</Button>
              </Link>
            ) : (
              <Button variant="secondary" className="w-full" disabled>
                {t.pricing.comingSoon}
              </Button>
            )}
          </Card>
        ))}
      </div>

      {/* FAQ */}
      <div className="max-w-3xl mx-auto">
        <h2 className="font-display text-2xl font-bold mb-8 text-center">{t.pricing.faqTitle}</h2>
        <div className="space-y-6">
          {faqs.map((faq) => (
            <div key={faq.q} className="border-b border-gray-200 pb-6">
              <h3 className="font-display font-bold text-lg mb-2">{faq.q}</h3>
              <p className="text-gray-500">{faq.a}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
