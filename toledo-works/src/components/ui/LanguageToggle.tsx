import { Globe } from 'lucide-react';
import { useTranslation } from '../../context/LanguageContext';

export default function LanguageToggle() {
  const { language, setLanguage } = useTranslation();

  return (
    <button
      onClick={() => setLanguage(language === 'en' ? 'es' : 'en')}
      className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors"
      aria-label="Toggle language"
    >
      <Globe className="w-4 h-4" />
      <span className="uppercase">{language}</span>
    </button>
  );
}
