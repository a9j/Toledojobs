import { useAuth } from '../context/AuthContext';
import { useCompany } from '../hooks/useCompany';
import EmployerDashboard from '../components/employer/EmployerDashboard';
import CompanyProfile from '../components/employer/CompanyProfile';
import { useTranslation } from '../context/LanguageContext';
import { Link } from 'react-router-dom';
import Button from '../components/ui/Button';

export default function EmployerDashboardPage() {
  const { user, profile, loading } = useAuth();
  const { t } = useTranslation();
  const { data: company, isLoading: companyLoading } = useCompany(user?.id);

  if (loading || companyLoading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-16 text-center">
        <p className="text-gray-500">{t.common.loading}</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <h2 className="font-display text-2xl font-bold mb-4">Please log in</h2>
        <Link to="/login">
          <Button variant="primary">{t.nav.login}</Button>
        </Link>
      </div>
    );
  }

  if (!company) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="font-display text-3xl font-bold mb-6">Set Up Your Company</h1>
        <p className="text-gray-500 mb-8">Create your company profile to start posting jobs.</p>
        <CompanyProfile />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <EmployerDashboard company={company} />
    </div>
  );
}
