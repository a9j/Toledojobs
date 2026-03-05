import { Link } from 'react-router-dom';
import { Wrench, ArrowRight } from 'lucide-react';
import TradeGrid from '../components/trades/TradeGrid';
import ApprenticeshipCards from '../components/trades/ApprenticeshipCards';
import Button from '../components/ui/Button';
import { useTranslation } from '../context/LanguageContext';

export default function Trades() {
  const { t } = useTranslation();

  return (
    <div>
      {/* Hero */}
      <section className="bg-navy text-white py-16 md:py-20">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-center gap-4 mb-4">
            <Wrench className="w-10 h-10 text-orange" />
            <h1 className="font-display text-4xl md:text-5xl font-extrabold">
              {t.trades.heroTitle}
            </h1>
          </div>
          <p className="text-xl text-gray-300 mb-6">{t.trades.heroSubtitle}</p>
        </div>
      </section>

      {/* Trade Grid */}
      <section className="py-12 max-w-6xl mx-auto px-4">
        <TradeGrid />
      </section>

      {/* Apprenticeships & Training */}
      <section className="bg-gray-100 py-12 md:py-16">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="font-display text-2xl md:text-3xl font-bold mb-2">{t.trades.training}</h2>
          <p className="text-gray-500 mb-8">{t.trades.trainingSubtitle}</p>
          <ApprenticeshipCards />
        </div>
      </section>

      {/* Contractor Bench CTA */}
      <section className="py-12 md:py-16 max-w-4xl mx-auto px-4 text-center">
        <h2 className="font-display text-2xl md:text-3xl font-bold mb-3">{t.trades.benchTitle}</h2>
        <p className="text-gray-500 mb-6">{t.trades.benchSubtitle}</p>
        <Link to="/trades/bench">
          <Button variant="secondary" size="lg">
            {t.trades.benchComing} <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
        </Link>
      </section>

      {/* Workforce Footer */}
      <div className="bg-navy-light text-white py-4 text-center text-sm">
        {t.trades.workforcePowered}
      </div>
    </div>
  );
}
