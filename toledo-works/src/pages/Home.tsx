import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, MapPin, ArrowRight, Wrench, Building2, TrendingUp } from 'lucide-react';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import { useJobs } from '../hooks/useJobs';
import { useTranslation } from '../context/LanguageContext';
import { JOB_CATEGORIES } from '../lib/constants';
import { formatPay, timeAgo } from '../lib/utils';
import { BRAND_NAME } from '../lib/constants';

export default function Home() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [zip, setZip] = useState('');
  const { data: featuredJobs } = useJobs();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (search) params.set('search', search);
    if (zip) params.set('zip', zip);
    navigate(`/jobs?${params.toString()}`);
  };

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-navy text-white py-16 md:py-24">
        <div className="max-w-6xl mx-auto px-4">
          <h1 className="font-display text-4xl md:text-6xl font-extrabold mb-4">
            {t.home.heroTitle}
          </h1>
          <p className="text-lg md:text-xl text-gray-300 mb-8 max-w-2xl">
            {t.home.heroSubtitle}
          </p>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3 max-w-2xl">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={t.home.searchPlaceholder}
                className="w-full pl-10 pr-4 py-3 rounded-card bg-white text-gray-900 placeholder:text-gray-400 font-body"
              />
            </div>
            <div className="relative sm:w-36">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={zip}
                onChange={(e) => setZip(e.target.value)}
                placeholder={t.home.zipPlaceholder}
                className="w-full pl-10 pr-4 py-3 rounded-card bg-white text-gray-900 placeholder:text-gray-400 font-body"
              />
            </div>
            <Button type="submit" variant="primary" className="sm:w-auto">
              {t.home.searchButton}
            </Button>
          </form>
        </div>
      </section>

      {/* Categories */}
      <section className="py-12 md:py-16 max-w-6xl mx-auto px-4">
        <h2 className="font-display text-2xl md:text-3xl font-bold mb-8">{t.home.categoriesTitle}</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {JOB_CATEGORIES.map((cat) => (
            <Link
              key={cat}
              to={`/jobs?category=${encodeURIComponent(cat)}`}
              className="card hover:shadow-md hover:border-orange transition-all duration-200 text-center py-4"
            >
              <span className="font-display font-semibold text-navy">{cat}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Trades CTA */}
      <section className="bg-navy text-white py-12 md:py-16">
        <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Wrench className="w-8 h-8 text-orange" />
              <h2 className="font-display text-2xl md:text-3xl font-bold">{t.home.tradesTitle}</h2>
            </div>
            <p className="text-gray-300 text-lg">{t.home.tradesSubtitle}</p>
          </div>
          <Link to="/trades">
            <Button variant="primary" size="lg">
              {t.home.browseTrades} <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Featured Jobs */}
      <section className="py-12 md:py-16 max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <h2 className="font-display text-2xl md:text-3xl font-bold">{t.home.featuredTitle}</h2>
          <Link to="/jobs" className="text-orange font-semibold hover:underline flex items-center gap-1">
            {t.home.viewAll} <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {(featuredJobs || []).slice(0, 6).map((job) => (
            <Link key={job.id} to={`/jobs/${job.id}`}>
              <Card hover className="h-full">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-display font-bold text-lg text-navy">{job.title}</h3>
                  {job.is_urgently_hiring && <Badge variant="red">{t.jobs.hiringNow}</Badge>}
                </div>
                <p className="text-gray-500 text-sm mb-2">{job.company?.company_name}</p>
                <p className="text-orange font-bold text-xl mb-3">
                  {formatPay(job.pay_min, job.pay_max, job.pay_type)}
                </p>
                <div className="flex flex-wrap gap-2">
                  {!job.is_degree_required && <Badge variant="green">{t.jobs.noDegree}</Badge>}
                  {job.has_benefits && <Badge variant="green">{t.jobs.benefits}</Badge>}
                  {job.shift && <Badge variant="gray">{job.shift}</Badge>}
                </div>
                <p className="text-gray-400 text-xs mt-3">{timeAgo(job.created_at)}</p>
              </Card>
            </Link>
          ))}
        </div>
        {(!featuredJobs || featuredJobs.length === 0) && (
          <div className="text-center py-12">
            <Building2 className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">Jobs will appear here once employers start posting.</p>
          </div>
        )}
      </section>

      {/* Employer CTA */}
      <section className="bg-gray-100 py-12 md:py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <TrendingUp className="w-10 h-10 text-orange mx-auto mb-4" />
          <h2 className="font-display text-2xl md:text-3xl font-bold mb-3">{t.home.employerCta}</h2>
          <Link to="/employers">
            <Button variant="primary" size="lg">
              {t.home.employerCtaButton}
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
