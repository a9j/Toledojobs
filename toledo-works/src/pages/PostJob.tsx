import { useAuth } from '../context/AuthContext';
import { useCompany } from '../hooks/useCompany';
import PostJobForm from '../components/employer/PostJobForm';
import { useTranslation } from '../context/LanguageContext';
import { Link } from 'react-router-dom';
import Button from '../components/ui/Button';

export default function PostJob() {
  const { user, loading } = useAuth();
  const { t } = useTranslation();
  const { data: company, isLoading: companyLoading } = useCompany(user?.id);

  if (loading || companyLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <p className="text-gray-500">{t.common.loading}</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <h2 className="font-display text-2xl font-bold mb-4">Please log in to post a job</h2>
        <Link to="/login"><Button variant="primary">{t.nav.login}</Button></Link>
      </div>
    );
  }

  if (!company) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <h2 className="font-display text-2xl font-bold mb-4">Set up your company first</h2>
        <Link to="/dashboard"><Button variant="primary">Set Up Company</Button></Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <PostJobForm companyId={company.id} />
    </div>
  );
}
