import { useAuth } from '../context/AuthContext';
import SeekerDashboard from '../components/seeker/SeekerDashboard';
import { useTranslation } from '../context/LanguageContext';
import { Link } from 'react-router-dom';
import Button from '../components/ui/Button';

export default function SeekerDashboardPage() {
  const { user, loading } = useAuth();
  const { t } = useTranslation();

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <p className="text-gray-500">{t.common.loading}</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <h2 className="font-display text-2xl font-bold mb-4">Please log in</h2>
        <Link to="/login"><Button variant="primary">{t.nav.login}</Button></Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <SeekerDashboard />
    </div>
  );
}
