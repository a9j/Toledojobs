import { useParams, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import TradeJobList from '../components/trades/TradeJobList';
import { TRADE_CATEGORIES } from '../lib/constants';
import { useTranslation } from '../context/LanguageContext';

export default function TradeCategoryPage() {
  const { category } = useParams<{ category: string }>();
  const { t } = useTranslation();

  const tradeName = TRADE_CATEGORIES.find(
    (tc) => tc.toLowerCase().replace(/[^a-z0-9]+/g, '-') === category
  ) || category || '';

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <Link to="/trades" className="inline-flex items-center gap-2 text-gray-500 hover:text-navy mb-4">
        <ArrowLeft className="w-4 h-4" /> {t.trades.title}
      </Link>
      <h1 className="font-display text-3xl font-bold mb-6">{tradeName}</h1>
      <TradeJobList tradeCategory={tradeName} />
    </div>
  );
}
