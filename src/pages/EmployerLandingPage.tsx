import { Link } from 'react-router-dom';
import {
  Users, Zap, Clock, Star, Check, Building2, ArrowRight, Briefcase
} from 'lucide-react';

const PRICING_TIERS = [
  {
    name: 'Free',
    price: '$0',
    period: '/mo',
    description: 'Get started at no cost',
    features: ['1 active job listing', 'Basic applicant tracking', 'Email notifications'],
    highlighted: false,
  },
  {
    name: 'Starter',
    price: '$49',
    period: '/mo',
    description: 'For growing teams',
    features: ['5 active job listings', 'Applicant management', 'Priority in search', 'Company branding'],
    highlighted: false,
  },
  {
    name: 'Pro',
    price: '$149',
    period: '/mo',
    description: 'For serious hiring',
    features: ['Unlimited job listings', 'Featured placements', 'Advanced analytics', 'Spanish translations', 'Priority support'],
    highlighted: true,
  },
  {
    name: 'Recruiter',
    price: '$199',
    period: '/mo',
    description: 'Full-service hiring',
    features: ['Everything in Pro', 'AI candidate matching', 'Bulk posting tools', 'Dedicated account manager', 'Custom integrations'],
    highlighted: false,
  },
];

export default function EmployerLandingPage() {
  return (
    <div>
      {/* Hero */}
      <section className="bg-navy text-white py-16 md:py-24 relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-20 -right-20 w-80 h-80 bg-orange/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-32 -left-20 w-96 h-96 bg-orange/5 rounded-full blur-3xl" />
        </div>

        <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
          <div className="inline-flex items-center gap-1.5 bg-orange/15 text-orange text-sm font-semibold px-3 py-1 rounded-full mb-6">
            <Star className="w-4 h-4 fill-orange" />
            Founding Employer Program
          </div>

          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight leading-tight">
            Hire Toledo.
            <br />
            <span className="text-orange">Skip the noise</span> of national job boards.
          </h1>

          <p className="text-lg md:text-xl text-white/70 mt-6 max-w-2xl mx-auto">
            Toledo Works connects you directly with local workers who are ready to start.
            No middlemen, no recruiter fees, no resume spam.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              to="/signup?role=employer"
              className="bg-orange hover:bg-orange-dark text-white px-8 py-4 rounded-xl font-bold text-lg transition-colors no-underline inline-flex items-center justify-center gap-2"
            >
              Become a Founding Employer
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              to="/login"
              className="border border-white/30 hover:bg-white/10 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-colors no-underline inline-flex items-center justify-center"
            >
              Already have an account? Sign In
            </Link>
          </div>
        </div>
      </section>

      {/* Value Props */}
      <section className="py-16 md:py-24">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-3xl font-extrabold text-navy text-center mb-12">
            Why Toledo employers choose us
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="w-14 h-14 bg-orange/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Users className="w-7 h-7 text-orange" />
              </div>
              <h3 className="text-xl font-bold text-navy mb-2">
                Reach local workers who are ready now
              </h3>
              <p className="text-gray-600">
                Our job seekers are in the 419 area code. They're warehouse workers, tradespeople,
                healthcare aides, and line cooks looking for their next opportunity right here in Toledo.
              </p>
            </div>

            <div className="text-center p-6">
              <div className="w-14 h-14 bg-orange/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Zap className="w-7 h-7 text-orange" />
              </div>
              <h3 className="text-xl font-bold text-navy mb-2">
                Post in 60 seconds &mdash; no HR jargon required
              </h3>
              <p className="text-gray-600">
                Our step-by-step job posting form is built for busy owners and managers.
                Just fill in the basics &mdash; pay, shift, location &mdash; and you're live.
              </p>
            </div>

            <div className="text-center p-6">
              <div className="w-14 h-14 bg-orange/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Star className="w-7 h-7 text-orange" />
              </div>
              <h3 className="text-xl font-bold text-navy mb-2">
                Free for Founding Employers through September 2026
              </h3>
              <p className="text-gray-600">
                Sign up now and get full access to every feature at no cost. Post unlimited jobs,
                manage applicants, and build your employer brand &mdash; all free during the founding period.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Founding Employer Banner */}
      <section className="bg-gradient-to-br from-navy to-navy-light text-white py-12">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 bg-orange/15 text-orange text-sm font-semibold px-4 py-1.5 rounded-full mb-4">
            <Star className="w-4 h-4 fill-orange" />
            Limited Time Offer
          </div>
          <h2 className="text-3xl font-extrabold mb-3">
            All features are <span className="text-orange">free</span> for Founding Employers
          </h2>
          <p className="text-white/70 text-lg max-w-2xl mx-auto mb-6">
            Join during our launch period and lock in Founding Employer status. All paid features
            are unlocked for free through September 2026. No credit card required.
          </p>
          <Link
            to="/signup?role=employer"
            className="inline-flex items-center gap-2 bg-orange hover:bg-orange-dark text-white px-8 py-3.5 rounded-xl font-bold text-lg transition-colors no-underline"
          >
            <Building2 className="w-5 h-5" />
            Become a Founding Employer
          </Link>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold text-navy mb-3">Simple, transparent pricing</h2>
            <p className="text-gray-500 text-lg">
              All tiers are <span className="text-orange font-semibold">free during the founding period</span>.
              Pricing takes effect October 2026.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {PRICING_TIERS.map((tier) => (
              <div
                key={tier.name}
                className={`bg-white rounded-2xl border-2 p-6 flex flex-col ${
                  tier.highlighted
                    ? 'border-orange shadow-lg shadow-orange/10 relative'
                    : 'border-gray-200'
                }`}
              >
                {tier.highlighted && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-orange text-white text-xs font-bold px-3 py-1 rounded-full">
                    Most Popular
                  </span>
                )}
                <h3 className="text-lg font-bold text-navy">{tier.name}</h3>
                <div className="mt-2 mb-1">
                  <span className="text-3xl font-extrabold text-navy">{tier.price}</span>
                  <span className="text-gray-400 text-sm">{tier.period}</span>
                </div>
                <p className="text-sm text-gray-500 mb-4">{tier.description}</p>

                <div className="flex-1">
                  <ul className="space-y-2">
                    {tier.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-2 text-sm text-gray-700">
                        <Check className="w-4 h-4 text-orange shrink-0 mt-0.5" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-6">
                  <div className="text-center mb-2">
                    <span className="text-xs text-orange font-semibold bg-orange/10 px-2 py-0.5 rounded-full">
                      Free through Sep 2026
                    </span>
                  </div>
                  <Link
                    to="/signup?role=employer"
                    className={`block text-center py-2.5 rounded-lg font-semibold text-sm transition-colors no-underline ${
                      tier.highlighted
                        ? 'bg-orange hover:bg-orange-dark text-white'
                        : 'bg-navy/5 hover:bg-navy/10 text-navy'
                    }`}
                  >
                    Get Started Free
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-16 bg-white">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <Briefcase className="w-12 h-12 text-orange mx-auto mb-4" />
          <h2 className="text-3xl font-extrabold text-navy mb-3">Ready to hire local?</h2>
          <p className="text-gray-500 text-lg mb-8">
            Join the growing list of Toledo employers who are finding great workers through Toledo Works.
          </p>
          <Link
            to="/signup?role=employer"
            className="inline-flex items-center gap-2 bg-orange hover:bg-orange-dark text-white px-8 py-4 rounded-xl font-bold text-lg transition-colors no-underline"
          >
            Become a Founding Employer
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </div>
  );
}
