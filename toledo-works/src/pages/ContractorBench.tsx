import { useState } from 'react';
import { HardHat, Mail } from 'lucide-react';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { useTranslation } from '../context/LanguageContext';
import toast from 'react-hot-toast';

export default function ContractorBench() {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubmitted(true);
      toast.success('You\'ll be notified when Contractor Bench launches!');
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-16 text-center">
      <HardHat className="w-16 h-16 text-orange mx-auto mb-6" />
      <h1 className="font-display text-3xl md:text-4xl font-bold mb-4">{t.trades.benchTitle}</h1>
      <p className="text-lg text-gray-500 mb-8 max-w-2xl mx-auto">{t.trades.benchSubtitle}</p>

      {/* Mockup */}
      <div className="bg-navy rounded-card p-8 mb-12 max-w-lg mx-auto">
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-navy-light rounded-card p-4 flex items-center gap-4">
              <div className="w-12 h-12 bg-orange/20 rounded-full flex items-center justify-center">
                <HardHat className="w-6 h-6 text-orange" />
              </div>
              <div className="text-left">
                <div className="h-4 w-32 bg-gray-600 rounded mb-2" />
                <div className="h-3 w-24 bg-gray-700 rounded" />
              </div>
              <div className="ml-auto">
                <div className="h-6 w-16 bg-orange/30 rounded-full" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Email Capture */}
      <div className="max-w-md mx-auto">
        <p className="font-display font-bold text-lg mb-4">{t.trades.benchNotify}</p>
        {submitted ? (
          <div className="bg-green/10 text-green rounded-card p-4 font-semibold">
            <Mail className="w-5 h-5 inline mr-2" />
            You're on the list!
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex gap-3">
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t.trades.emailPlaceholder}
              className="flex-1"
              required
            />
            <Button type="submit" variant="primary">{t.trades.notify}</Button>
          </form>
        )}
      </div>
    </div>
  );
}
