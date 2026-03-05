import { Link } from 'react-router-dom';
import { Users, TrendingUp, Zap, Award, ArrowRight } from 'lucide-react';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import { useTranslation } from '../context/LanguageContext';
import { BRAND_NAME, FOUNDING_EMPLOYER_END_DATE } from '../lib/constants';

export default function EmployerLanding() {
  const { t } = useTranslation();

  const features = [
    {
      icon: <Users className="w-8 h-8 text-orange" />,
      title: 'Reach Local Workers',
      description: 'Post directly to motivated Toledo workers actively looking for jobs. No middlemen, no staffing agency markups.',
    },
    {
      icon: <Zap className="w-8 h-8 text-orange" />,
      title: 'Post in Under 2 Minutes',
      description: 'Our streamlined form gets your job live fast. Include pay, shift, and requirements — everything workers need.',
    },
    {
      icon: <TrendingUp className="w-8 h-8 text-orange" />,
      title: 'AI-Powered Matching',
      description: 'Our AI matches qualified candidates to your listing and generates candidate summaries so you can review faster.',
    },
    {
      icon: <Award className="w-8 h-8 text-orange" />,
      title: 'Founding Employer Badge',
      description: `Sign up during our launch period (through ${FOUNDING_EMPLOYER_END_DATE}) and earn a permanent Founding Employer badge on all your listings.`,
    },
  ];

  return (
    <div>
      {/* Hero */}
      <section className="bg-navy text-white py-16 md:py-24">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <Badge variant="yellow" className="mb-4 text-base px-4 py-2">
            Free During Launch
          </Badge>
          <h1 className="font-display text-4xl md:text-5xl font-extrabold mb-4">
            {t.employer.landingTitle}
          </h1>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            {t.employer.landingSubtitle}
          </p>
          <Link to="/signup">
            <Button variant="primary" size="lg">
              {t.employer.foundingCta} <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 max-w-6xl mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-6">
          {features.map((feature) => (
            <Card key={feature.title} className="p-6">
              <div className="mb-4">{feature.icon}</div>
              <h3 className="font-display text-xl font-bold mb-2">{feature.title}</h3>
              <p className="text-gray-500">{feature.description}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* Founding Employer CTA */}
      <section className="bg-gray-100 py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <Award className="w-12 h-12 text-yellow mx-auto mb-4" />
          <h2 className="font-display text-3xl font-bold mb-3">{t.employer.foundingTitle}</h2>
          <p className="text-gray-500 text-lg mb-6 max-w-2xl mx-auto">{t.employer.foundingSubtitle}</p>
          <Link to="/signup">
            <Button variant="primary" size="lg">{t.employer.foundingCta}</Button>
          </Link>
        </div>
      </section>

      {/* Pricing Preview */}
      <section className="py-16 max-w-4xl mx-auto px-4 text-center">
        <h2 className="font-display text-2xl font-bold mb-6">Simple, Transparent Pricing</h2>
        <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { name: 'Free', price: '$0', desc: '1 active post' },
            { name: 'Starter', price: '$49', desc: 'Unlimited posts', popular: true },
            { name: 'Pro', price: '$149', desc: 'AI + Contractor Bench' },
            { name: 'Recruiter', price: '$199', desc: 'Bulk + Multi-user' },
          ].map((tier) => (
            <Card key={tier.name} className={tier.popular ? 'border-orange border-2' : ''}>
              {tier.popular && <Badge variant="orange" className="mb-2">Most Popular</Badge>}
              <h3 className="font-display font-bold text-lg">{tier.name}</h3>
              <p className="text-2xl font-bold text-navy">{tier.price}<span className="text-sm text-gray-500">/mo</span></p>
              <p className="text-gray-500 text-sm">{tier.desc}</p>
            </Card>
          ))}
        </div>
        <Link to="/pricing" className="text-orange font-semibold hover:underline mt-4 inline-block">
          See full pricing details <ArrowRight className="w-4 h-4 inline" />
        </Link>
      </section>
    </div>
  );
}
